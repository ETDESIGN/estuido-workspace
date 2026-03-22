# Google Workspace Configuration for OpenClaw

**Account:** caneles2hk@gmail.com
**Purpose:** OpenClaw's personal Google Workspace for AI operations
**Configured:** 2026-03-22

## Connected Services
- ✅ Gmail (read, send, search, organize)
- ✅ Google Calendar (events, scheduling)
- ✅ Google Drive (files, folders)
- ✅ Google Docs (create, edit)
- ✅ Google Sheets (create, edit, analyze)
- ✅ Google Contacts (manage)

## OAuth Configuration
**Client ID:** 139608939133-arjp9dcglkl419qtse1s53kuol7tdpm8.apps.googleusercontent.com
**Project:** clawboatapi
**Credentials:** /home/e/.openclaw/client_secret.json
**Token Storage:** ~/.config/gogcli/credentials.json

## CLI Tool: Gog
**Binary:** /usr/local/bin/gog
**Version:** v0.12.0
**Skill:** gog (OpenClaw bundled)

## Usage Examples

### Gmail
```bash
# Search emails
gog gmail search 'is:inbox newer_than:7d' --max 10

# Send email
gog gmail send --to recipient@example.com --subject "Test" --body "Hello"

# Read message
gog gmail get <messageId>
```

### Calendar
```bash
# List events
gog calendar events primary --from 2026-03-22 --to 2026-03-29

# Create event
gog calendar create primary --summary "Meeting" --from 2026-03-22T10:00:00 --to 2026-03-22T11:00:00
```

### Drive
```bash
# List files
gog drive files list --query 'name contains "report"'

# Download file
gog drive files download <fileId>
```

### Docs
```bash
# Create document
gog docs create --title "My Document"

# List documents
gog docs list
```

### Sheets
```bash
# Create spreadsheet
gog sheets create --title "My Spreadsheet"

# Read sheet
gog sheets get <spreadsheetId>
```

## Integration with OpenClaw
- AI can read/write emails
- AI can manage calendar events
- AI can create/edit documents
- AI can analyze spreadsheets
- AI can organize Drive files

## Notes
- This is OpenClaw's dedicated workspace for AI operations
- Use this account for all AI-generated content and communications
- Keep this separate from personal accounts
- OAuth tokens auto-refresh

---
**Last Updated:** 2026-03-22
**Status:** ✅ Active and Tested
