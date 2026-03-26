# ClawFlows Installation

**Date:** 2026-03-24
**Installed by:** kicode (via E)

## What Was Installed
- ClawFlows version: Latest from GitHub (112 workflows)
- Installation method: Official installer (curl | bash)
- Workflows enabled: update-clawflows (auto-update workflow)

## Configuration
- Installation directory: `/home/e/.openclaw/workspace/clawflows`
- CLI symlink: `~/.local/bin/clawflows` (already in PATH)
- Cron scheduler: OpenClaw cron job (every 15 minutes)
  - Job ID: `clawflows-scheduler`
  - Cron expression: `*/15 * * * *`
  - Session mode: isolated
- AGENTS.md synced: Yes

## Testing Results
- CLI command available: PASS
- `clawflows list` shows 111 available workflows: PASS
- Scheduler registered in OpenClaw cron: PASS
- Gateway restart successful: PASS

## How to Use

### Browse Workflows
```bash
clawflows list
```

### Enable a Workflow
```bash
clawflows enable send-morning-briefing
clawflows enable check-email
```

### Run a Workflow Manually
```bash
clawflows run send-morning-briefing
```

### View Dashboard
```bash
clawflows dashboard
```

### Update Workflows
```bash
clawflows update
```

## Rollback Instructions

### Uninstall Command
```bash
clawflows uninstall
```

### Manual Cleanup
1. Remove CLI symlink:
   ```bash
   rm ~/.local/bin/clawflows
   ```

2. Remove installation directory:
   ```bash
   rm -rf ~/.openclaw/workspace/clawflows
   ```

3. Remove OpenClaw cron job:
   ```bash
   openclaw cron remove clawflows-scheduler
   ```

4. Restore AGENTS.md (if needed):
   ```bash
   git -C ~/.openclaw/workspace checkout AGENTS.md
   ```

## Notes
- The Essentials Pack was NOT enabled automatically (non-interactive terminal)
- User can enable it manually with: `clawflows enable send-morning-inspiration send-morning-briefing check-email check-calendar`
- Scheduler checks every 15 minutes for due workflows
