# TODO - E's Action Items

## 🔴 High Priority

### 1. Activate Tavily Search (5 min)
**Why:** Fixes Brave Search rate limits (currently blocked)
**When:** Today
**Steps:**
- [ ] Visit https://tavily.com
- [ ] Sign up with Google (free tier: 1000 searches/month)
- [ ] Get API key from dashboard
- [ ] Run: `export TAVILY_API_KEY="tvly-your-key"`
- [ ] Restart dashboard: `npm run dev`

**Impact:** Search backup working, no more rate limit errors

---

## 🟡 Medium Priority

### 2. Set Up Google Integration (via gog skill)
**Account:** caneles2hk@gmail.com  
**When:** This week  
**Method:** gog skill (NO Google Workspace needed - FREE!)  
**Docs:** `docs/GOG_SKILL_SETUP.md`

**Steps:**
- [ ] Create Google Cloud project (https://console.cloud.google.com)
- [ ] Enable APIs: Gmail, Calendar, Drive, Sheets, Docs
- [ ] Create OAuth 2.0 credentials (Desktop app)
- [ ] Download client_secret.json
- [ ] Run: `npx skills add https://github.com/openclaw/openclaw --skill gog`
- [ ] Authenticate: `gog auth add caneles2hk@gmail.com`
- [ ] Change password (current was shared insecurely)
- [ ] Enable 2-Step Verification on Google account

**Benefits:**
- ✅ FREE (no $6/month Workspace fee)
- ✅ Works with regular Gmail
- ✅ Full access to Gmail, Calendar, Drive, Sheets, Docs
- ✅ Better for personal/small team use

**After setup:** Dereck configures OpenClaw to use gog skill for automations

### 3. Review CTO Agent Dashboard Work
**When:** After sidebar completion (ETA: 30 mins)
**Check:** http://localhost:5173
**Features to verify:**
- [ ] Theme toggle (light/dark)
- [ ] Auto-refresh (30s)
- [ ] CSV export
- [ ] Date filter
- [ ] Trend indicators
- [ ] Sidebar navigation

---

## 🟢 Low Priority

### 4. Optional: E2B Code Sandbox
**Why:** Safe code execution for dev agents
**URL:** https://e2b.dev
**Cost:** Free tier available

### 5. Optional: Langfuse Monitoring
**Why:** Track token usage/costs over time
**URL:** https://langfuse.com
**Cost:** Free tier (50K events/month)

---

## 📊 Current Status

| System | Status |
|--------|--------|
| Dashboard | 🟢 Running (5/6 features complete) |
| Brave Search | 🔴 Rate limited |
| Tavily | 🟡 Ready (needs key) |
| Image Gen | 🟢 Working (Pollinations) |
| Service Tracker | 🟢 Live on dashboard |
| CTO Agent | 🟡 Working on sidebar |

**Next action:** Complete item #1 (Tavily activation)

---

_Last updated: 2026-02-16 08:15_  
_Next review: End of day_
