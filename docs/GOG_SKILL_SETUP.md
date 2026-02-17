# Google Services Integration - gog Skill

## Overview
The **gog** skill provides unified access to Google services via OAuth - works with regular Gmail accounts, **no Google Workspace required**.

## Supported Services
- ✅ Gmail (send/read/search)
- ✅ Google Calendar (events, scheduling)
- ✅ Google Drive (files, folders)
- ✅ Google Contacts
- ✅ Google Sheets
- ✅ Google Docs

## Installation

```bash
npx skills add https://github.com/openclaw/openclaw --skill gog
```

## Setup (One-Time OAuth)

### 1. Create Google Cloud Project
1. Go to https://console.cloud.google.com
2. Create new project (e.g., "openclaw-integration")
3. Enable APIs:
   - Gmail API
   - Calendar API
   - Drive API
   - People API (for Contacts)
   - Sheets API
   - Docs API

### 2. Create OAuth Credentials
1. APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Application type: Desktop app
4. Download `client_secret.json`

### 3. Authenticate
```bash
gog auth credentials /path/to/client_secret.json
gog auth add caneles2hk@gmail.com
```

Follow the OAuth flow in browser - grant permissions.

## Usage Examples

### Gmail
```bash
# Send email
gog gmail send --to "recipient@example.com" --subject "Hello" --body "Message"

# Read inbox
gog gmail list --limit 10

# Search
gog gmail search "from:boss@company.com subject:urgent"
```

### Calendar
```bash
# List events
gog calendar events list --calendar primary

# Create event
gog calendar events create --summary "Meeting" --start "2026-02-17T10:00:00" --end "2026-02-17T11:00:00"
```

### Drive
```bash
# List files
gog drive files list

# Upload
gog drive files upload /path/to/file.txt

# Download
gog drive files download --file-id "abc123"
```

## In OpenClaw Config

Add to `~/.openclaw/openclaw.json`:

```json
{
  "skills": {
    "entries": {
      "gog": {
        "enabled": true,
        "config": {
          "defaultAccount": "caneles2hk@gmail.com",
          "clientSecretPath": "/home/e/.config/gog/client_secret.json"
        }
      }
    }
  }
}
```

## Security Notes

- OAuth tokens stored securely in `~/.config/gog/`
- Refresh tokens auto-renew
- Scope-limited access (only requested APIs)
- No password storage (OAuth only)

## Advantages Over Google Workspace

| Feature | gog Skill | Google Workspace |
|---------|-----------|------------------|
| **Cost** | $0 (uses free APIs) | $6/user/month |
| **Setup** | OAuth (15 min) | Business verification |
| **Account** | Regular Gmail | New Workspace account |
| **API Limits** | Standard consumer | Higher business limits |
| **Works with** | Any Gmail | Workspace only |

## Limitations

- Consumer Gmail API limits (lower than Workspace)
- Some enterprise features unavailable
- OAuth consent screen required (one-time)

## When to Use What

**Use gog skill when:**
- Personal/small team use
- Budget-conscious
- Standard Gmail account exists
- Basic email/calendar/file automation

**Use Google Workspace when:**
- Large team (10+ users)
- Need higher API quotas
- Enterprise security requirements
- Custom domain email

## Resources

- GitHub: https://github.com/openclaw/openclaw/tree/main/skills/gog
- Documentation: `SKILL.md` after installation
- ClawHub: `npx skills search gog`

---

**Bottom line:** Use `gog` skill for caneles2hk@gmail.com - free, works immediately, no Workspace subscription needed.
