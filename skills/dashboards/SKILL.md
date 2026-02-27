---
name: Dashboards
description: Use Mission Control and Command Center dashboards to monitor and manage OpenClaw operations.
metadata: {"clawdbot":{"emoji":"📊","os":["linux","darwin"]}, "version": "1.0.0"}
---

## Overview

You have TWO dashboards installed to help monitor OpenClaw:

1. **Mission Control** (Port 4000) - Task management and planning
2. **Command Center** (Port 3333) - Session monitoring and metrics

## When to Use Each Dashboard

### Use Mission Control when user wants to:
- Create/track tasks and projects
- View Kanban board of operations
- Plan multi-step AI workflows
- See live event stream from OpenClaw

### Use Command Center when user wants to:
- Check active OpenClaw sessions
- Monitor token usage and costs
- View system vitals (CPU, memory, disk)
- See LLM fuel gauges (context usage)

## Quick Commands

```bash
# Start dashboards (manual only - not auto-started)
start-dashboards.sh

# Stop dashboards
stop-dashboards.sh

# Check status
curl -s http://localhost:4000/api/openclaw/status
curl -s http://localhost:3333/api/health
```

## API Endpoints You Can Query

### Mission Control APIs:
- GET `/api/openclaw/status` - Connection status
- GET `/api/openclaw/sessions?status=active` - Active sessions
- GET `/api/events/stream` - Live events (SSE)

### Command Center APIs:
- GET `/api/health` - Health check
- GET `/api/sessions` - All sessions with token stats
- GET `/api/sessions/stats` - Session statistics
- GET `/api/vitals` - System vitals
- GET `/api/llm-usage` - LLM usage/costs

## Key Files to Know

| File | Purpose |
|------|---------|
| `~/mission-control/.env.local` | Mission Control config |
| `~/openclaw-command-center/config/dashboard.json` | Command Center config |
| `/tmp/mission-control.log` | Mission Control logs |
| `/tmp/command-center.log` | Command Center logs |

## Integration Notes

- **Mission Control** connects via WebSocket to OpenClaw Gateway (ws://127.0.0.1:18789)
- **Command Center** reads session files directly from `~/.openclaw/agents/main/sessions/`
- Both dashboards are manually started via `start-dashboards.sh`
- Gateway token is in `~/.openclaw/openclaw.json` under `gateway.auth.token`

## Common User Requests

### "Show my OpenClaw status"
Query both dashboards:
1. Mission Control: `GET /api/openclaw/status` for connection status
2. Command Center: `GET /api/sessions` for session count and token stats
3. Combine: "You have X sessions. 24h cost: $Y. Mission Control connected."

### "Start the dashboards"
Run: `start-dashboards.sh`

### "Stop the dashboards"
Run: `stop-dashboards.sh`

### "How much did I spend?"
Query Command Center `GET /api/sessions` and extract `tokenStats.estCost`

## Troubleshooting

If dashboards aren't connecting:
1. Check OpenClaw gateway: `curl http://localhost:18789/`
2. Restart dashboards: `stop-dashboards.sh && start-dashboards.sh`
3. Check logs: `tail -20 /tmp/mission-control.log` and `/tmp/command-center.log`
