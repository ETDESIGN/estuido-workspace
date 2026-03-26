# Dereck's Chief of Staff Configuration

**Date:** 2026-03-25 23:30 HKT
**Status:** ✅ ACTIVE

---

## 📱 WhatsApp Numbers

| Role | Number | Access Level | Notes |
|------|--------|--------------|-------|
| **E (President)** | +8618566570937 | 🟢 GOD-MODE | Full admin, all agents, spawn permissions |
| **Dereck (Chief of Staff)** | +85267963406 | 🟡 ROUTER | Omni-Hub dispatcher, routes to sub-agents |
| **Florian (Inerys)** | PENDING | 🟡 SANDBOXED | Will add later to Dereck's WhatsApp contacts |

---

## 🔒 Security Protocol

**Caller-ID Bouncer:**
- ✅ E (+8618566570937) → All agents, full workspace access
- ✅ Whitelisted clients → Route ONLY to their agent workspace
- ✅ Unknown numbers → BLOCKED (save API budget)
- ✅ @agent targeting → Enabled (god-mode only)

**WhatsApp Contact List Whitelist:**
- Use existing WhatsApp contacts as authorized list
- Don't contact unsolicited
- Florian will be added later to Dereck's WhatsApp (+85267963406)

---

## ⏰ Daily Executive Briefing

**Schedule:** 10:00 AM HKT (GMT+8) every day
**Recipient:** E (+8618566570937)
**Content:**
- System health (gateway status, RAM, active agents)
- API budget ($5/day spend vs current)
- Client pipelines (Inerys leads, drafts pending, follow-ups due)

**Implementation:** ClawFlows cron (Warren configuring)

---

## 🎯 Routing Logic

```
Incoming WhatsApp to +85267963406 (Dereck)
         ↓
    whatsapp-router.py
         ↓
    ┌──────────────────────────────┐
    │ Check Sender Number          │
    └──────────────────────────────┘
         ↓
    ┌─────────┬────────────┬──────────────┐
    │ E's #   │ Whitelisted│ Unknown #    │
    │ (GOD)   │ Clients    │ (BLOCKED)    │
    └────┬────┴─────┬──────┴──────┬───────┘
         │          │              │
         ↓          ↓              ↓
    Full Agent   Their Agent    IGNORE
    Access       Workspace Only  (Save budget)
```

---

## 🤖 Current Agent Workspaces

| Agent | Workspace | Purpose | Access |
|-------|-----------|---------|--------|
| **Inerys Agent** | `~/workspace/agents/inerys-agent/` | Lead processing, email drafts | Sandboxed (Florian only) |
| **CTO** | `~/workspace/agents/cto/` | Code implementation, routing | God-mode only |
| **QA** | `~/workspace/agents/qa/` | Testing, validation | God-mode only |
| **Warren** | `~/workspace/agents/warren/` | Monitoring, health checks | God-mode only |

---

## 📋 Usage Examples

### E (God-Mode)
```
You → Dereck: "Status report"
Dereck → Routes to main agent → Returns system status

You → Dereck: "@cto fix the router bug"
Dereck → Routes to CTO agent → Spawns fix

You → Dereck: "Save to memory: Inerys using Kimi-OR"
Dereck → QMD integration → Saves to memory
```

### Sandboxed Clients (e.g., Florian)
```
Florian → Dereck: "Process sephora@beauty.com"
Dereck → Routes to Inerys Agent ONLY → Processes lead → Returns draft

Florian → Dereck: "@cto help"  ← BLOCKED (not god-mode)
Dereck → "You don't have access to CTO agent"
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `whatsapp-router.py` | Main router with Caller-ID Bouncer |
| `whatsapp-router-config.json` | Phone mappings & routing rules |
| `whatsapp-router.log` | Audit trail (all routing decisions) |
| `DERECK_CONFIG.md` | This file |

**Location:** `~/.openclaw/workspace/omni-hub/`

---

## ⚠️ Important Notes

1. **Don't contact clients unsolicited** - even if in WhatsApp contact list
2. **Florian's number pending** - will add later to Dereck's WhatsApp
3. **Shadow Mode active** - Complex client requests → Escalate to E for approval
4. **God-mode = E only** - No one else gets full system access
5. **API budget protection** - Unknown numbers blocked to save $5/day

---

## 🚀 Next Steps

- [x] Router built and tested
- [x] Config updated with E + Dereck numbers
- [x] Security verified (unknown numbers blocked)
- [ ] Warren configures 10 AM HKT daily briefing
- [ ] Florian adds his number to Dereck's WhatsApp
- [ ] Test end-to-end with real WhatsApp message
- [ ] Add more client agents as needed

---

**Chief of Staff activation complete.** 🎯
