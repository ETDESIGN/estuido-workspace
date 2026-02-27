# HEARTBEAT.md

## ⚠️ CURRENT MODE: ULTRA LOW COST
- Default model: `qwen/qwen3-4b:free`
- KiloCode CLI for all coding
- Monitor for free tier limits

# Periodic Checks (every ~2 hours while E is asleep/away)

## Active Tasks to Monitor
- [ ] CTO dashboard upgrade - COMPLETED
- [ ] fs-watcher automation - RUNNING
- [ ] Any spawned subagents - check progress
- [ ] Remind E about GitHub remote setup (8 PM tonight)

## Heartbeat Actions (Zero-RAM System Ops - v2.0)

| Time | Action | Execution Details |
|------|--------|-------------------|
| **09:00** | **Morning Standup & Task Assignment** | 1. Run `/home/e/nb-studio/scripts/generate-standup.sh`<br>2. GM (Dereck) reads `memory/STANDUPS/YYYY-MM-DD.md`<br>3. GM assigns CTO their first task of the day. |
| **12:00** | **Midday Inbox & Progress Check** | 1. Run `/home/e/nb-studio/scripts/check-inbox.sh`<br>2. If Warren or HR have mail, GM spawns them to read/approve budgets or tools.<br>3. Unblock CTO if stuck. |
| **15:00** | **Afternoon QA & Mail Check** | 1. Run `/home/e/nb-studio/scripts/check-inbox.sh` again.<br>2. Ensure QA has reviewed CTO's morning code using `git-diff-analyzer.sh`.<br>3. Check fs-watcher status. |
| **18:00** | **EOD Self-Improvement Loop** | 1. GM spawns all active managers (CTO, QA, Warren, HR).<br>2. **Task:** "Review your actions today. Write 1 new optimization or failure-analysis to your `LEARNINGS.md` file."<br>3. Trigger system-wide summary for E (President). |

### Legacy Checks (Background)
- fs-watcher status (`pgrep -f fs-watcher`)
- Dashboard update (`update-dashboard.sh`)
- Subagent sessions check
- Free tier monitoring
- BLOCKERS.md scan

## 📅 Bi-Weekly Tasks (Every 2 Weeks)

### Documentation Review
- **Task:** Review and update ESTUDIO_WORKFLOW_DOCUMENTATION.md
- **Location:** `~/Documents/ESTUDIO_WORKFLOW_DOCUMENTATION.md`
- **Check:**
  - [ ] Agent roster still accurate?
  - [ ] Pipeline stages unchanged?
  - [ ] Cost thresholds current?
  - [ ] New systems/processes to add?
  - [ ] Copy updated version to ~/Documents/
- **Next review:** [Set 2-week reminder]

## Dashboard Location
- **Local:** `/home/e/nb-studio/00_MISSION_CONTROL/DASHBOARD.md`
- **Web:** Check OpenClaw dashboard at `http://127.0.0.1:18789/`
