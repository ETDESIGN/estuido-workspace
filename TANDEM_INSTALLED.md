# Tandem Browser Installation Complete

## Location
- **Installed:** `/home/e/tandem-browser`
- **Start script:** `/home/e/tandem-browser/start-tandem.sh`
- **Skill installed:** `~/.openclaw/workspace/skills/tandem/SKILL.md`

## API Configuration
- **Endpoint:** `http://127.0.0.1:8765`
- **Token file:** `~/.tandem/api-token`
- **Token:** `11685c447e0a926cfde2a6c1d0329de9dcd6eec00176572216bd9ec31424e7cc`

## How to Use

### Start the Browser
```bash
# Option 1: Use the start script
/home/e/tandem-browser/start-tandem.sh

# Option 2: Start directly
cd /home/e/tandem-browser
npm start
```

### Test the Connection
```bash
# Check if Tandem is running
TOKEN="$(cat ~/.tandem/api-token)"
curl -sS http://127.0.0.1:8765/status

# List tabs
curl -sS http://127.0.0.1:8765/tabs/list \
  -H "Authorization: Bearer $TOKEN"
```

## OpenClaw Integration

The Tandem skill is now available to OpenClaw agents. They can:
- Open and manage tabs
- Take snapshots and screenshots
- Inspect DOM and network traffic
- Interact with pages
- Coordinate browser workflows

## Features

### Left Sidebar (Built-in Panels)
- Telegram, WhatsApp, Discord, Slack, Gmail, Google Calendar, Instagram, X
- Workspaces, Pinboards, Bookmarks, History, Downloads
- Personal News

### Right Wingman Panel
- OpenClaw chat interface
- Activity feed
- Screenshots
- Agent context

### Security Model
- Local-first (no cloud dependency)
- Network filtering with blocklists
- Outbound request scanning for credential leaks
- AST-level JavaScript analysis
- Behavior monitoring
- Human-in-the-loop for risky actions

## Platform Support
- ✅ macOS (primary)
- ✅ Linux (secondary)
- ⚠️ Windows (not actively validated)

## Version
Current: v0.62.4 (as of repository clone)

## Documentation
- README: `/home/e/tandem-browser/README.md`
- Project docs: `/home/e/tandem-browser/docs/`
- Skill docs: `~/.openclaw/workspace/skills/tandem/SKILL.md`

## Next Steps
1. Start Tandem Browser with the start script
2. OpenClaw agents can now use the Tandem skill
3. For full Wingman chat, ensure OpenClaw gateway is running on ws://127.0.0.1:18789

---
*Installed: 2026-03-18*
*Node.js version: v22.22.0*
