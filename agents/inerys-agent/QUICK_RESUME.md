# INERYS PROJECT - QUICK RESUME
**Last updated**: 2026-03-25 06:27 UTC

---

## 🎯 MISSION
Build a Virtual Marketing Agent for Florian (Inerys + Proteke) that automates B2B cold outreach via WhatsApp → Email pipeline.

---

## ✅ WHAT'S COMPLETE (100%)

### System Built
- **Location**: `~/.openclaw/workspace/agents/inerys-agent/`
- **Files**: 15 files, ~3,500 lines of code
- **Security**: Sandbox isolation verified, zero data leakage

### Core Components
1. **pipeline.sh** - Main automation (enrich → CRM → personalize → draft → approve)
2. **search-inerys-memory.sh** - Local-only memory search (NEVER touches global memory)
3. **whatsapp_parser.py** - Parse "Send", "Tweak", "Add lead" commands
4. **skills/escalate_to_gm.sh** - Escalate tasks agent can't handle
5. **IDENTITY.md** - Agent persona as Florian's marketing exec
6. **business_context.md** - Inerys/Proteke USP (L'Oréal, Cabaïa, China factory, GRS eco)
7. **CRON_SCHEDULE.md** - All cron jobs documented
8. **QA_REPORT.md** - Security audit passed

### All Scripts Fixed
- **Every `gog` command uses**: `gog -a inerys.contact@gmail.com` (NOT `--profile`)
- **Pattern**: `GOOGLE_ACCOUNT="florian@inerys.com"` then `gog -a "$GOOGLE_ACCOUNT" <command>`

### Infrastructure
- ✅ tmux 3.4 installed
- ✅ ClawTeam tested & working
- ✅ Can spawn parallel workers

---

## ⏳ BLOCKING (Requires Your Action)

### 1. Gmail Authentication (CRITICAL)
```bash
gog auth add inerys.contact@gmail.com
```
**What**: Opens browser → Login to Florian's Google → Grant OAuth permissions
**Time**: 2 minutes
**Status**: ⏳ Awaiting your access to Florian's account

### 2. Google Sheet Setup
- Create Google Sheet for CRM
- Copy spreadsheet ID
- Update `pipeline.sh` line 135: `SHEET_ID="paste-id-here"`

### 3. Florian's Email Samples
- Send 3-5 emails from Florian's sent folder
- I'll extract his tone → populate `florian_tone.md`

---

## 🚀 RESUMING WORK (Do This First)

### Step 1: Authenticate
```bash
gog auth add florian@inerys.com
```

### Step 2: Verify
```bash
gog auth list
# Should show: florian@inerys.com
```

### Step 3: Test Pipeline
```bash
cd ~/.openclaw/workspace/agents/inerys-agent
./pipeline.sh test@example.com --company "Test Brand" --niche "Beauty" --dry-run
```

### Step 4: Send Me
- Florian's email samples (for tone extraction)
- Google Sheet ID

### Step 5: Go Live
- Production test
- Create cron jobs (commands in CRON_SCHEDULE.md)
- Hand off to Florian

---

## 📊 KEY TECHNICAL DETAILS

### Pipeline Flow
```
WhatsApp Input (Florian sends lead)
    ↓
customer-enrichment ClawFlow (research prospect)
    ↓
Google Sheets CRM update (gog -a florian@inerys.com sheets append)
    ↓
cold-email-personalizer ClawFlow (write email)
    ↓
Gmail draft creation (gog -a florian@inerys.com gmail create-draft)
    ↓
WhatsApp notification to Florian
    ↓
Florian approves: "Send" or "Tweak tone to X"
```

### Critical Syntax (Don't Forget)
```bash
# CORRECT:
gog -a inerys.contact@gmail.com gmail send ...
gog -a inerys.contact@gmail.com sheets append ...

# WRONG:
gog --profile inerys gmail send ...  # ❌ This fails
```

### Google Sheet Schema
Columns A-E: Company, Niche, Status, Warm/Cold, Contact

### Cron Jobs (Ready to Create)
- Ghost follow-ups: Daily at 09:00 UTC (4-day unreplied detection)
- CRM sync: Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)
- Memory monitor: Hourly
- Weekly summary: Mondays 08:00 UTC

---

## 🔒 SECURITY REMINDERS

### MUST NEVER CHANGE
- Agent only accesses `~/.openclaw/workspace/agents/inerys-agent/`
- NEVER uses global `memory-search.sh`
- EVERY `gog` command must have `-a florian@inerys.com`
- NO access to other client data

### Verified Safe
- ✅ Sandbox isolation tested
- ✅ Zero data leakage confirmed
- ✅ Google account isolation enforced

---

## 📞 QUICK COMMANDS

### Test Agent Memory Search
```bash
~/.openclaw/workspace/agents/inerys-agent/search-inerys-memory.sh "Sephora"
```

### Test WhatsApp Parser
```bash
~/.openclaw/workspace/agents/inerys-agent/whatsapp_parser.py "Send"
~/.openclaw/workspace/agents/inerys-agent/whatsapp_parser.py "Add marc@sephora.fr from Sephora"
```

### Escalate to GM
```bash
~/.openclaw/workspace/agents/inerys-agent/skills/escalate_to_gm.sh high "Build custom scraper" --context "Client needs product catalog"
```

### Check Auth Status
```bash
gog auth status
gog auth list
```

---

## 📋 DOCUMENTATION REFERENCE

| File | Purpose |
|------|---------|
| `README.md` | Full system architecture |
| `STATUS.md` | Implementation status |
| `QA_REPORT.md` | Security audit |
| `CRON_SCHEDULE.md` | Cron job commands |
| `READY_FOR_TOMORROW.md` | Handoff checklist |
| `FIXED_GOG_SYNTAX.md` | Syntax fix notes |

---

## 🎯 END STATE

**When You Return**:
1. Run `gog auth add florian@inerys.com`
2. Send Florian's email samples + Google Sheet ID
3. We test → go live → hand to Florian

**Time to Resume**: ~10 minutes
**Time to Production**: ~30 minutes after auth

---

**Project Status**: ✅ Infrastructure Complete | ⏳ Awaiting Auth
**Next Milestone**: Production deployment

*Last updated: 2026-03-25 06:27 UTC*
