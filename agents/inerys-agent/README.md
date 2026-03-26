# PROJECT INERYS - VIRTUAL MARKETING AGENT

## 🎯 MISSION
Dedicated B2B marketing automation system for Florian (Inerys + Proteke). Handles lead enrichment, CRM management, and personalized email drafting via WhatsApp interface.

---

## 🏢 BUSINESS CONTEXT

### Client: Florian
- **Companies**: Inerys (est. 2010) + Proteke (eco-subsidiary)
- **Core Business**: Custom B2B manufacturing of bags, pouches, promotional packaging
- **Unique Value Proposition**: End-to-end control (Design → Prototyping → Production → Logistics) with own China factory
- **Major Clients**: L'Oréal, Cabaïa, Tour de France, Renault, Ferrero, Kiehl's
- **Target Audience**: French B2B importers, retail buyers, distributors

### Product Lines
- **Inerys**: Premium custom bags, pouches, promotional packaging
- **Proteke**: Eco-conscious line (GRS-certified, rPET, recycled, compostable materials)

---

## 🛠️ SYSTEM ARCHITECTURE

### Data Isolation (CRITICAL)
- **Sandbox Directory**: `~/.openclaw/workspace/agents/inerys-agent/`
- **Google Profile**: `--profile inerys` (separate Google Workspace)
- **Memory**: Custom `search-inerys-memory.sh` (local-only, NEVER global)
- **No Access**: Global `memory-search.sh` or other client data

### Pipeline Flow
```
WhatsApp Input (Florian)
    ↓
Lead Enrichment (clawflows run customer-enrichment)
    ↓
Google Sheets CRM Update (gog -a florian@inerys.com sheets append)
    ↓
Email Personalization (clawflows run cold-email-personalizer)
    ↓
Gmail Draft Creation (gog -a florian@inerys.com gmail create-draft)
    ↓
WhatsApp Approval (Florian: "Send" / "Tweak" / Voice Note)
```

---

## 🔧 TECHNICAL STACK

### Tools & Integrations
- **ClawFlows**: `customer-enrichment`, `cold-email-personalizer`
- **Google Workspace CLI** (`gog`): Florian's account `-a florian@inerys.com`
- **WhatsApp**: Command parsing (text + audio transcription)
- **OpenClaw Cron**: Ghost follow-ups + daily CRM sync

### Scripts (in sandbox)
- `pipeline.sh`: Main orchestration script
- `search-inerys-memory.sh`: Local-only memory search
- `escalate_to_gm.sh`: Dereck escalation skill
- `whatsapp_parser.py`: Text/audio command handler

---

## ⚙️ CRON JOBS

### 1. Daily Inbox Scan (Ghost Follow-Ups)
- **Trigger**: Runs daily via `inbox-zero-helper`
- **Logic**: Detect emails unreplied after 4 days → auto-draft follow-up → WhatsApp ping
- **Command**: `gog -a florian@inerys.com gmail create-draft`

### 2. Daily CRM Sync
- **Trigger**: Daily sync of Google Sheets → Agent memory
- **Updates**: Lead status changes, new entries, warm/cold tagging

---

## 🔒 SECURITY CONSTRAINTS

### Non-Negotiable Rules
1. ✅ **Every** `gog` command MUST include `-a florian@inerys.com`
2. ✅ **No** access to global `memory-search.sh`
3. ✅ **No** paths outside `~/.openclaw/workspace/agents/inerys-agent/`
4. ✅ **Zero** LLM config changes (use system defaults)
5. ✅ **Max** 2-3 parallel workers (RAM discipline)

### QA Clearance Required
- [ ] All scripts verified for `--profile inerys` compliance
- [ ] Zero data leakage confirmed (sandbox test)
- [ ] Dry-run pipeline test passed
- [ ] Escalation skill functional

---

## 📋 INITIAL SETUP CHECKLIST

- [x] Directive received and acknowledged by Dereck
- [x] ClawTeam swarm spawned (inerys-core team)
  - [ ] HR: Agent identity + business context docs
  - [ ] CTO: Pipeline + memory search + escalation skill
  - [ ] Ops: Cron jobs configured
  - [ ] QA: Security audit + dry-run test
- [ ] **BLOCKING**: E to run `gog auth add inerys.contact@gmail.com` (opens browser for OAuth)
- [ ] Final integration test with dummy lead
- [ ] Production handoff to Florian

---

## 👥 TEAM ROSTER

- **General Manager**: @Dereck (orchestration, escalation point)
- **HR**: @inerys-hr (agent persona, context docs)
- **CTO**: @inerys-cto (pipeline, scripts, integrations)
- **Ops**: @inerys-ops (cron jobs, monitoring)
- **QA**: @inerys-qa (security audit, testing)

---

## 📞 ESCALATION PATH

If agent cannot fulfill request (e.g., custom site scraping):
1. Agent informs Florian: "Requesting upgrade for [task]"
2. Uses `escalate_to_gm.sh` skill
3. Drops high-priority task in Dereck's queue
4. Dereck assesses → spawns specialist or updates system

---

## 📊 STATUS

**Created**: 2026-03-24
**Phase**: Initialization
**Watchdog**: Active (checks every 5 min)
**Next Milestone**: QA clearance + `gog auth add inerys.contact@gmail.com` confirmation

---

*Last updated: 2026-03-24 20:21 UTC*
