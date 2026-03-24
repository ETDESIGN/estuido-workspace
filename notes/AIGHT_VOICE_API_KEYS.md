# API Keys Needed for Aight Voice Features
**Date:** 2026-03-24 03:12
**Purpose:** Document required API keys for Aight app voice functionality

---

## 🔑 Required API Keys

### 1. 11apps API Key
**Purpose:** Voice transcription (speech-to-text)
**Required for:** 🎤 Voice input in Aight app
**Status:** ❌ Not configured
**API Key:** [Please provide]

### 2. Google Workspace API Key
**Purpose:** Google services integration
**Required for:** Additional features (calendar, docs, etc.)
**Status:** ❌ Not configured
**API Key:** [Please provide]

---

## 📋 Where to Configure

**Option 1: Aight App Settings**
- Open Aight app → Settings (⚙️)
- Look for "API Keys" or "Services"
- Enter keys there

**Option 2: Gateway Configuration**
- Configure in `~/.openclaw/openclaw.json`
- Under channel-specific settings
- Requires gateway restart

**Option 3: Environment Variables**
- Add to `~/.openclaw/.env`
- Format: `SERVICE_NAME_API_KEY=your-key-here`

---

## 🔍 Getting API Keys

### For 11apps:
1. Visit 11apps website
2. Sign up / Log in
3. Go to API / Developer section
4. Generate new API key
5. Copy and paste here

### For Google Workspace:
1. Go to Google Cloud Console
2. Create a project
3. Enable required APIs (Speech-to-Text, etc.)
4. Create credentials (API Key)
5. Copy and paste here

---

## ✅ Once Keys Are Provided

I can configure them in:
- Gateway config
- Environment variables
- Credentials registry

Then voice features should work!

---

**Status:** Waiting for API keys from user
**Next Step:** User provides keys → I configure them → Test voice
