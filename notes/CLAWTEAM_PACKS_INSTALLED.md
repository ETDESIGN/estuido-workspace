# ClawTeam Packs Installation

**Date:** 2026-03-24
**Installed by:** kicode (via E)

## Packs Installed

### 1. ClawTeam-OpenClaw
- **Purpose:** Multi-agent swarm coordination for CLI coding agents
- **Repository:** https://github.com/win4r/ClawTeam-OpenClaw
- **Installation method:** pipx (Python package manager)
- **Version:** 0.1.1

## What is ClawTeam?

ClawTeam is a framework for multi-agent coordination. It allows AI agents to:
- Spawn worker agents with their own git worktrees and tmux windows
- Coordinate tasks between agents
- Communicate through CLI commands auto-injected into prompts
- Monitor the swarm from a dashboard

## Configuration

- **Package name:** clawteam
- **CLI command:** `clawteam`
- **Installation:** Via pipx at `~/.local/bin/clawteam`
- **Default transport:** file-based
- **Agent support:** OpenClaw, Claude Code, Codex, nanobot, Cursor

## Available Commands

```bash
# Spawn a new agent
clawteam spawn --team my-team --agent-name worker1 --task "Implement auth module"

# Launch a team from template
clawteam launch <template> --team <name> --goal "Build X"

# List templates
clawteam template list

# Show config
clawteam config show

# Team management
clawteam team list
clawteam team info <team-name>

# Inbox/messaging
clawteam inbox send <team> <recipient> "message"

# Task management
clawteam task list <team>
clawteam task add <team> "task description"

# Dashboard
clawteam board attach <team>
clawteam board serve --port 8080
```

## Testing Results

- CLI command available: PASS
- `clawteam --help` works: PASS
- No conflicts with existing agents: PASS
- Gateway still running: PASS

## Usage with OpenClaw

To use ClawTeam with OpenClaw, you can:

1. **Let the Agent Drive (Recommended):**
   Prompt your agent: "Build a web app. Use clawteam to split the work across multiple agents."

2. **Manual Control:**
   ```bash
   # Create a team
   clawteam spawn --team webapp --agent-name frontend --task "Build React frontend" --agent openclaw
   
   # Add workers
   clawteam spawn --team webapp --agent-name backend --task "Build API" --agent openclaw
   
   # Monitor
   clawteam board attach webapp
   ```

## Rollback Instructions

### Uninstall Command
```bash
pipx uninstall clawteam
```

### Manual Cleanup
1. Remove CLI command:
   ```bash
   rm ~/.local/bin/clawteam
   ```

2. Remove data directory (if needed):
   ```bash
   rm -rf ~/.clawteam
   ```

## Notes

- The original task mentioned "ClawTeam Packs" at `github.com/clawteam-packs` - this repository does NOT exist
- Found alternative: `win4r/ClawTeam-OpenClaw` which is a fork with deep OpenClaw integration
- ClawTeam is different from ClawFlows:
  - **ClawFlows:** Pre-built workflows (email, calendar, smart home, etc.)
  - **ClawTeam:** Multi-agent coordination framework for parallel task execution
