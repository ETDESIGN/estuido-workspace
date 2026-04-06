# KiloCode CLI — Deep Research & Integration Plan

## What KiloCode Is

**KiloCode** (v7.0.46, `@kilocode/cli`) is a headless AI coding agent CLI that runs locally and writes/modifies code directly in your filesystem. It's like Claude Code or Cursor Agent, but **free** with many models.

### Key Capabilities
- **Non-interactive mode**: `kilo run "task description"` — perfect for automation
- **Headless server**: `kilo serve --port 4098` — exposes an HTTP API for programmatic use
- **ACP server**: `kilo acp` — Agent Client Protocol for OpenClaw integration
- **File editing**: Creates, modifies, deletes files directly on disk
- **Multi-model**: 200+ models including 10+ free ones

### Installed On This Machine
- **Binary**: `/home/e/.npm-global/bin/kilocode` (aliased as `kilo`)
- **Version**: 7.0.46
- **Workspace**: `~/.openclaw/workspace-kilocode/` (exists but not configured)
- **Config**: `~/.config/kilo/config.json`
- **acpx bridge**: `/home/e/.npm-global/bin/acpx` (installed, bridges OpenClaw ↔ ACP agents)

---

## Free Models Available (THE KEY VALUE)

These models cost **$0** and are excellent for coding:

| Model | ID | Best For |
|-------|-----|----------|
| **MiniMax M2.5** | `kilo/minimax/minimax-m2.5:free` | General coding, fast |
| **Qwen 3.6 Plus Preview** | `kilo/qwen/qwen3.6-plus-preview:free` | Complex reasoning + code |
| **MiMo Pro 2** | `kilo/xiaomi/mimo-v2-pro:free` | Code generation |
| **MiMo V2 Omni** | `kilo/xiaomi/mimo-v2-omni:free` | Multimodal code |
| **Nemotron Super** | `kilo/nvidia/nemotron-3-super-120b-a12b:free` | Large context |
| **Arcee Trinity** | `kilo/arcee-ai/trinity-large-preview:free` | Code tasks |
| **Step 3.5 Flash** | `kilo/stepfun/step-3.5-flash:free` | Fast coding |
| **Grok Code Fast** | `kilo/x-ai/grok-code-fast-1:optimized:free` | Speed |
| **CoreThink** | `kilo/corethink:free` | Reasoning |

**Verified working**: MiniMax M2.5 and Qwen 3.6 Plus Preview tested successfully with $0 cost.

---

## How It Works — Three Integration Modes

### Mode 1: `kilo run` (Simplest — Shell Commands)
```bash
# Direct non-interactive coding
cd /path/to/project
kilo run -m kilo/qwen/qwen3.6-plus-preview:free \
  "Create a React component called DataChart that displays a bar chart using recharts"

# With session continuity
kilo run -m kilo/minimax/minimax-m2.5:free \
  "Refactor the auth module to use JWT" \
  --session ses_abc123

# JSON output for programmatic parsing
kilo run "task" --format json
```

**Cost**: $0 | **Best for**: Simple tasks, one-off coding, agent exec tool calls

### Mode 2: `kilo serve` (Headless Server)
```bash
# Start headless coding server
cd /path/to/project
kilo serve --port 4098

# Then communicate via HTTP API (similar to OpenClaw's own API)
# The server exposes the full KiloCode agent as an HTTP endpoint
```

**Cost**: $0 | **Best for**: Long-running coding sessions, persistent workspace

### Mode 3: `kilo acp` + OpenClaw ACP Runtime (FULL INTEGRATION)
```bash
# KiloCode runs as an ACP server
kilo acp --cwd /path/to/project --port 4098

# OpenClaw spawns it via sessions_spawn with runtime="acp"
# This is the RECOMMENDED way for dev team integration
```

**How OpenClaw uses it**: When `sessions_spawn` is called with `runtime="acp"`, OpenClaw connects to the ACP server (KiloCode) and delegates the coding task. The coding agent (KiloCode + free model) does all the actual file editing, while OpenClaw's GLM-5 Turbo handles planning and coordination.

---

## How to Integrate with the Dev Team

### Architecture: Planner → CTO → Coding Agents (via KiloCode)

```
Etia gives directive
     ↓
Main (GLM-5 Turbo) — coordinator
     ↓
CTO (GLM-5 Turbo) — creates plan, breaks into tasks
     ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ frontend-    │  │ backend-     │  │ qa           │
│ coder        │  │ coder        │  │              │
│ (GLM-5 plans)│  │ (GLM-5 plans)│  │ (GLM-5 plans)│
│      ↓       │  │      ↓       │  │      ↓       │
│ KiloCode +   │  │ KiloCode +   │  │ KiloCode +   │
│ free model   │  │ free model   │  │ free model   │
│ DOES the     │  │ DOES the     │  │ runs tests   │
│ coding       │  │ coding       │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
     ↓                ↓
Main merges, reviews, deploys
```

### Step-by-Step Integration

#### Step 1: Configure ACP in OpenClaw Gateway
Add to `~/.openclaw/openclaw.json` under `tools.acp`:
```json
{
  "tools": {
    "acp": {
      "dispatch": { "enabled": true },
      "backend": "acpx",
      "defaultAgent": "kilocode",
      "allowedAgents": ["kilocode"],
      "maxConcurrentSessions": 4,
      "runtime": { "ttlMinutes": 120 }
    }
  }
}
```

#### Step 2: Create a KiloCode-specific Agent
Create `~/.openclaw/agents/kilocode/` with:
- Model config pointing to free KiloCode models
- SOUL.md that says "you are a coding agent, use kilo run for all coding tasks"
- Workspace symlink to the project directory

#### Step 3: Update Dev Team Agent SOUL.md Files
Add to each coder agent's SOUL.md:
```
When you need to write or modify code:
1. Use `kilo run -m kilo/qwen/qwen3.6-plus-preview:free "description"` 
2. Or use sessions_spawn with runtime="acp" to delegate to KiloCode
3. NEVER write code directly via exec/heredoc — always use KiloCode
```

#### Step 4: Update Pipeline Skill
Modify the dev-team skill to:
1. CTO creates plan with GLM-5 (cheap, fast)
2. CTO delegates to coding agents via sessions_spawn (runtime="acp")
3. Coding agents use KiloCode with free models for actual file changes
4. Main reviews merges with GLM-5

---

## Cost Comparison

| Approach | Tokens Used | Cost | Quality |
|----------|-----------|------|---------|
| Main writes code directly (GLM-5) | ~50-100k per task | $0.10-0.20/task | Medium |
| Subagent writes code (GLM-5) | ~80-150k per task | $0.15-0.30/task | Medium |
| **KiloCode + free model** | **$0** | **$0.00** | **High** |
| KiloCode + Qwen 3.6 (free) | $0 | $0.00 | Very High |
| KiloCode + MiniMax M2.5 (free) | $0 | $0.00 | High |

---

## What Needs To Be Done

### Immediate (Configure)
1. ✅ KiloCode CLI installed (v7.0.46)
2. ✅ acpx bridge installed
3. ❌ ACP not configured in `~/.openclaw/openclaw.json` — needs `tools.acp` section
4. ❌ No KiloCode-specific agent registered in gateway

### Next Steps
1. Add ACP config to openclaw.json
2. Create `kilocode` agent in gateway (or update existing agents to use ACP runtime)
3. Update all coder agent SOUL.md files with KiloCode instructions
4. Test: CTO creates a plan → spawns frontend-coder (runtime=acp) → KiloCode does the coding
5. Update the dev-team pipeline skill

### Open Questions
- Should we create a dedicated `kilocode` agent, or make existing agents (frontend-coder, backend-coder) use ACP runtime?
- Which free model is best for which task? (Need benchmarking)
- Should kilo serve be always-on or started per-task?

---

## Key Files
- KiloCode binary: `/home/e/.npm-global/bin/kilocode`
- acpx bridge: `/home/e/.npm-global/bin/acpx`
- KiloCode workspace: `~/.openclaw/workspace-kilocode/`
- KiloCode config: `~/.config/kilo/config.json`
- Gateway config: `~/.openclaw/openclaw.json`
- Test project: `/tmp/kilo-test/` (verified working)
