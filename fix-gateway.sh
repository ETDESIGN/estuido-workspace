#!/bin/bash
# Quick fix for gateway issues
# Run: bash /home/e/.openclaw/workspace/fix-gateway.sh

echo "🔧 Fixing Gateway Issues..."
echo ""

# Issue 1: Fix main agent model
echo "1️⃣ Fixing main agent model (moonshot → glm-4.7)..."
cp /home/e/.openclaw/agents/main/agent/config.json /home/e/.openclaw/agents/main/agent/config.json.backup-$(date +%Y%m%d-%H%M%S)
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
echo "   ✅ Main agent model updated to zai/glm-4.7"

# Issue 2: Find tool profile issues
echo ""
echo "2️⃣ Scanning for invalid tool profile entries..."
PROBLEM_FILES=$(grep -r "apply_patch\|memory_search\|memory_get" /home/e/.openclaw/agents/*/ 2>/dev/null | grep -v ".jsonl" | cut -d: -f1 | sort -u)

if [ -n "$PROBLEM_FILES" ]; then
    echo "   ⚠️  Found files with invalid tool references:"
    echo "$PROBLEM_FILES"
    echo ""
    echo "   Manual fix required: Remove 'apply_patch', 'memory_search', 'memory_get' from tool allowlists"
else
    echo "   ✅ No invalid tool entries found in agent configs"
fi

# Check workspace for tool profiles
echo ""
echo "3️⃣ Checking workspace for tool profiles..."
WORKSPACE_PROFILES=$(find ~/.openclaw/workspace -name "*profile*.json" -o -name "tools.json" 2>/dev/null)
if [ -n "$WORKSPACE_PROFILES" ]; then
    echo "   Found workspace profiles:"
    echo "$WORKSPACE_PROFILES"
    echo ""
    echo "   Check these files for invalid tool entries"
else
    echo "   ✅ No workspace tool profiles found"
fi

# Restart gateway
echo ""
echo "4️⃣ Reloading gateway..."
systemctl --user reload openclaw-gateway 2>/dev/null && echo "   ✅ Gateway reloaded" || echo "   ⚠️  Reload failed, trying restart..."
sleep 2
systemctl --user restart openclaw-gateway 2>/dev/null && echo "   ✅ Gateway restarted"

# Verify
echo ""
echo "5️⃣ Verifying fix..."
sleep 3
echo "   Gateway status:"
systemctl --user status openclaw-gateway --no-pager | grep -E "Active|loaded" | head -2

echo ""
echo "✨ Fixes applied!"
echo ""
echo "Next steps:"
echo "1. Check UI at http://127.0.0.1:18789/"
echo "2. Run: openclaw status"
echo "3. If warnings persist, manually edit tool profiles found above"
