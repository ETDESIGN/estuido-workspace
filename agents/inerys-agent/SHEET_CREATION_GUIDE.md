# 🔧 How to Enable Automatic Google Sheet Creation

## Option 1: Enable OAuth Token Access (Recommended)

This will allow me to use the stored Google credentials to create sheets.

### Step 1: Locate gog's credential storage
```bash
# Find where gog stores tokens
ls -la ~/.config/gogcli/keyring/
```

### Step 2: Create a helper script that uses gog's credentials

The issue is that `gog` doesn't expose a direct way to get the access token for API calls.

### Step 3: Alternative - Use a dedicated script

**Run this script**:
```bash
~/.openclaw/workspace/agents/inerys-agent/scripts/create-sheet.sh
```

It will:
1. Open https://sheets.new in your browser
2. Guide you through creating the sheet
3. Prompt you for the Sheet ID
4. Automatically update pipeline.sh

---

## Option 2: Manual One-Time Setup (Fastest)

### Just Do This Now:
1. Open: https://sheets.new (logged in as inerys.contact@gmail.com)
2. Name it: "Inerys Leads CRM"
3. Add headers in Row 1:
   ```
   Company | Contact Name | Email | Niche | Status | Warm/Cold | First Contact | Last Contact | Notes
   ```
4. Copy the Sheet ID from the URL (between `/d/` and `/edit`)
5. Paste it here

**Example URL**:
```
https://docs.google.com/spreadsheets/d/1BxiMvs0XRA5nFMdKZBEF7eBz3G3k/edit
```
**Sheet ID**: `1BxiMvs0XRA5nFMdKZBEF7eBz3G3k`

---

## Option 3: I Create It Programmatically (Advanced)

To enable this, I would need:

### A. Access to the refresh token
```bash
# gog stores credentials but doesn't expose them easily
# The tokens are in the system keyring, encrypted
```

### B. Use a service account (Production setup)
1. Create a Google Cloud project
2. Enable Google Sheets API
3. Create service account
4. Download credentials JSON
5. Configure gog to use service account
6. Grant service account access to inerys.contact@gmail.com

**This is overkill for now.**

---

## ✅ My Recommendation

**Use Option 2 (Manual One-Time Setup)** - Takes 1 minute:

1. Open https://sheets.new
2. Name it "Inerys Leads CRM"
3. Add headers
4. Copy Sheet ID
5. Send it to me

**Then I update the pipeline and we're done!**

---

## 🎯 Why I Can't Auto-Create Right Now

1. **gog CLI limitation**: The `gog` tool doesn't have a `sheets create` command
2. **Access token extraction**: Tokens are stored in system keyring, not easily accessible
3. **API authentication**: Need OAuth 2.0 token for API calls, but can't extract it from gog easily

**The manual setup is actually faster than debugging this!**

---

*Created: 2026-03-25*
*Purpose: Explain Google Sheet creation options*
