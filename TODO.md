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

### 2. Fix Dashboard React Mount Issue
**Why:** Frontend crashes on load (white screen)
**When:** This week
**Check:** http://localhost:5173
**Issue:** React fails to mount - needs browser console error analysis

**Status:** CTO completed 5/6 features, this bug blocks full deployment

---

## 🟡 Medium Priority

### 3. Set Up Google Integration (via gog skill)
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

### 4. Model Fallback Strategy Implementation
**Why:** When API errors or rate limits hit, system should auto-recover
**When:** This week
**Task:** TASK-fallback-strategy (NOT_STARTED)
**Assigned to:** CTO Agent

**Approach:**
- Detect API errors → switch to free model
- Groq rate limits → use MiniMax or GLM-5
- OpenRouter issues → fallback to KiloCode CLI

---

## 🟢 Low Priority

### 5. Optional: E2B Code Sandbox
**Why:** Safe code execution for dev agents
**URL:** https://e2b.dev
**Cost:** Free tier available

### 6. Optional: Langfuse Monitoring
**Why:** Track token usage/costs over time
**URL:** https://langfuse.com
**Cost:** Free tier (50K events/month)

### 7. Config-Based Agent Spawning
**Why:** Enable Dereck to spawn unlimited agents via OpenClaw config
**Status:** BLOCKED - OpenClaw 2026.2.x doesn't support `tools.sessions_spawn` config keys
**Research:** Alternative approaches - skill-based agents, runtime permissions, or wait for OpenClaw update
**Current Workaround:** Option C (Simulation mode) - SOUL files + direct execution

---

## 📊 Current Status (Updated: 2026-02-20)

| System | Status |
|--------|--------|
| QMD Search | 🟢 Working (158 files, embeddings ready) |
| Cost Monitor | 🟢 Running ($0.41/day, $5 threshold) |
| CTO Agent | 🟢 Active (KiloCode free models) |
| QA Agent | 🟢 Ready (MiniMax) |
| Dashboard | 🟡 5/6 features, React mount bug |
| Brave Search | 🔴 Rate limited |
| Tavily | 🟡 Ready (needs key activation) |
| WhatsApp | ⚠️ Flapping (auto-reconnects) |

**System Constraints:**
- RAM: 5GB total, ~2.2GB available
- Daily budget: $5.00 (current: $0.41)

---

_Last updated: 2026-02-20 18:30_  
_Next review: End of week_
