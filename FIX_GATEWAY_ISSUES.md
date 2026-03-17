# Gateway Fix Script - Run These Commands

## Issue 1: Model Config Fix

The main agent config has reverted to old moonshot AI. Update to glm-4.7:

```bash
# Backup current config
cp /home/e/.openclaw/agents/main/agent/config.json /home/e/.openclaw/agents/main/agent/config.json.backup

# Update to glm-4.7
cat > /home/e/.openclaw/agents/main/agent/config.json << 'EOF'
{
    "id": "main",
    "name": "Project Developer",
    "description": "Main development assistant",
    "model": "zai/glm-4.7",
    "systemPrompt": "systemPrompt.md",
    "tools": [
        "search",
        "browser",
        "nodes",
        "exec"
    ]
}
EOF
```

## Issue 2: Find and Fix Tool Profile

The tool profile has invalid entries causing UI warnings. Find the profile:

```bash
# Find which profile has the invalid entries
grep -r "apply_patch\|memory_search\|memory_get" /home/e/.openclaw/agents/*/ 2>/dev/null | grep -v ".jsonl"

# Check workspace profiles
find ~/.openclaw/workspace -name "*profile*.json" -o -name "tools.json" 2>/dev/null
```

Then remove these invalid entries from the allowlist.

## Restart Gateway

After fixes:

```bash
# Reload gateway config (hot reload)
systemctl --user reload openclaw-gateway

# Or restart if hot reload doesn't work
systemctl --user restart openclaw-gateway

# Check status
systemctl --user status openclaw-gateway
```

## Verify

```bash
# Check gateway is using correct model
openclaw status | grep "default"

# Check UI - warning signs should be gone
# Open: http://127.0.0.1:18789/
```

---

## Why This Happened

**Model config issue:**
- Old config in `/home/e/.openclaw/agents/main/agent/config.json` was never updated
- System was using fallback to glm-4.7 when moonshot billing failed
- That's why it "worked" but showed wrong model in UI

**Tool profile issue:**
- Tool profiles reference tools that don't exist in current OpenClaw version
- `apply_patch`, `memory_search`, `memory_get` were removed or renamed
- Gateway detects these and shows UI warnings

---

## Prevention

To prevent this from happening again:

1. **Always update agent configs when changing defaults:**
   ```bash
   # When setting new default model, update ALL agent configs
   find /home/e/.openclaw/agents/*/agent/config.json -exec sed -i 's/old-model/new-model/g' {} +
   ```

2. **Validate tool profiles after OpenClaw updates:**
   ```bash
   # Check for invalid tool references
   openclaw status --deep
   ```

3. **Keep backup of working configs:**
   ```bash
   cp /home/e/.openclaw/agents/main/agent/config.json ~/.openclaw-backups/config-main-working.json
   ```

---

Created: 2026-03-17 04:15 GMT+8
