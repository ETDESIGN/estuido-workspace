# CRON SCHEDULE - INERYS AGENT

## Overview
This document defines all OpenClaw cron jobs for the Inerys Agent automation pipeline.

---

## 1. Ghost Follow-Up Detection (Daily)

**Purpose**: Detect unreplied emails after 4 days and auto-draft follow-ups

**Schedule**: Daily at 09:00 UTC

**Command**:
```bash
inbox-zero-helper -a inerys.contact@gmail.com --ghost-threshold 4 --follow-up-template ~/.openclaw/workspace/agents/inerys-agent/templates/follow_up.txt
```

**Action**:
- Scan Florian's Gmail for sent emails without replies
- Identify emails where `sent_date + 4 days < now` and `no reply detected`
- Auto-draft polite follow-up using template
- Update Google Sheets `ghost_alert = true`
- Send WhatsApp notification to Florian

**WhatsApp Alert Template**:
```
👻 Ghost Follow-Up Alert

Company: [Company]
Email: [email@example.com]
No reply in 4 days.

Follow-up drafted in Gmail.
Reply "Send" or "Tweak"
```

---

## 2. Daily CRM Sync (Every 6 Hours)

**Purpose**: Keep agent memory in sync with Google Sheets

**Schedule**: Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)

**Command**:
```bash
~/.openclaw/workspace/agents/inerys-agent/scripts/sync_crm.sh
```

**Action**:
- Pull latest data from Google Sheets
- Update local `memory/leads.json`
- Recalculate stats (total leads, warm/cold counts)
- Update dashboard metrics

---

## 3. Memory Usage Monitoring (Hourly)

**Purpose**: Ensure agent stays under 5GB RAM limit

**Schedule**: Every hour

**Command**:
```bash
~/.openclaw/workspace/agents/inerys-agent/scripts/check_memory.sh
```

**Action**:
- Check memory usage of Inerys sandbox
- Alert if > 4GB (warning threshold)
- Alert if > 5GB (critical - stop operations)
- Log metrics to `logs/memory_usage.log`

**Alert Format**:
```
⚠️ Memory Alert: Inerys Agent
Usage: 4.2GB / 5GB
Action: Approaching limit
```

---

## 4. Weekly Summary (Weekly)

**Purpose**: Send weekly performance report to Florian

**Schedule**: Every Monday at 08:00 UTC

**Command**:
```bash
~/.openclaw/workspace/agents/inerys-agent/scripts/weekly_summary.sh
```

**Report Includes**:
- New leads added this week
- Emails sent
- Response rate
- Ghost follow-ups triggered
- Conversion metrics

---

## Cron Job IDs (Reference)

| Job Name | ID | Status | Next Run |
|----------|-----|--------|----------|
| ghost-follow-up | TBD | Not created | - |
| crm-sync-1 | TBD | Not created | - |
| crm-sync-2 | TBD | Not created | - |
| crm-sync-3 | TBD | Not created | - |
| crm-sync-4 | TBD | Not created | - |
| memory-monitor | TBD | Not created | - |
| weekly-summary | TBD | Not created | - |

---

## Implementation Commands

### Add Ghost Follow-Up Job
```bash
cron add \
  --name "inerys-ghost-followup" \
  --schedule '0 9 * * *' \
  --command "inbox-zero-helper --profile inerys --ghost-threshold 4" \
  --session-target isolated
```

### Add CRM Sync Jobs
```bash
# Midnight UTC
cron add \
  --name "inerys-crm-sync-1" \
  --schedule '0 0 * * *' \
  --command "~/.openclaw/workspace/agents/inerys-agent/scripts/sync_crm.sh" \
  --session-target isolated

# 06:00 UTC
cron add \
  --name "inerys-crm-sync-2" \
  --schedule '0 6 * * *' \
  --command "~/.openclaw/workspace/agents/inerys-agent/scripts/sync_crm.sh" \
  --session-target isolated

# 12:00 UTC
cron add \
  --name "inerys-crm-sync-3" \
  --schedule '0 12 * * *' \
  --command "~/.openclaw/workspace/agents/inerys-agent/scripts/sync_crm.sh" \
  --session-target isolated

# 18:00 UTC
cron add \
  --name "inerys-crm-sync-4" \
  --schedule '0 18 * * *' \
  --command "~/.openclaw/workspace/agents/inerys-agent/scripts/sync_crm.sh" \
  --session-target isolated
```

### Add Memory Monitor
```bash
cron add \
  --name "inerys-memory-monitor" \
  --schedule '0 * * * *' \
  --command "~/.openclaw/workspace/agents/inerys-agent/scripts/check_memory.sh" \
  --session-target isolated
```

### Add Weekly Summary
```bash
cron add \
  --name "inerys-weekly-summary" \
  --schedule '0 8 * * 1' \
  --command "~/.openclaw/workspace/agents/inerys-agent/scripts/weekly_summary.sh" \
  --session-target isolated
```

---

## Notes

- All cron jobs use `--session-target isolated` to run in separate sessions
- Memory monitoring is critical given system's 5GB limit
- Ghost follow-ups use `inbox-zero-helper` ClawFlow
- Weekly summaries help Florian track ROI

---

*Created: 2026-03-24*
*Ops: Warren (inerys-ops)*
