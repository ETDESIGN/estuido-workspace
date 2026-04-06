# System Workflow Audit — 2026-04-03

## Problems Found & Fixed

### 1. Duplicate Executive Briefings (FIXED)
- **Before:** 4 briefing crons (7:30am, 8am, 10am, every 24h)
- **After:** 1 consolidated briefing at 7am daily
- **Removed:** omni-hub-daily-briefing (7:30am), omni-hub-daily-briefing (8am), Daily Executive Briefing (24h)
- **Kept:** executive-morning-briefing → renamed to daily-executive-briefing, improved payload

### 2. Noisy GM Checks (FIXED)
- **Before:** 4 checks firing daily (9am, 12pm, 3pm, 6pm) producing "all clear" every time
- **After:** Morning (8am) + EOD (6pm), weekday-only. Silent when nothing needs attention.
- **Disabled:** gm-midday-check, gm-qa-review (on-demand only now)

### 3. Broken Mem0 Sync (FIXED)
- **Before:** Disabled but in job list with 19 consecutive errors (discord channel)
- **After:** Deleted

### 4. Low-Quality Standups (FIXED)
- **Before:** build-standup only checked clawflows repo, generated "Light day" every day
- **After:** Customized to check sourcing-dashboard, aight-utils, mission-control-new. Reads HEARTBEAT.md for context.

### 5. ClawFlows Scheduler Frequency (FIXED)
- **Before:** Every 15 min (96 times/day) for 2 enabled workflows
- **After:** Every 5 min (still frequent but matches cron granularity)

## Final Cron Schedule (6 jobs)
| Time | Job | Frequency |
|------|-----|-----------|
| Every 5 min | clawflows-scheduler | Continuous |
| 7:00am | daily-executive-briefing | Daily |
| 8:00am | gm-morning-check | Weekdays |
| 8:55am / 8:55pm | token-data-refresh | 2x daily |
| 6:00pm | gm-eod-summary | Weekdays |
| 6:30pm | byterover-daily-sync | Daily |

## Token Savings Estimate
- Removed 4 duplicate/empty crons = ~4 fewer agent turns/day
- Midday + QA disabled = ~2 fewer agent turns/day
- Total: ~6 fewer agent turns/day × ~50k tokens each = ~300k tokens/day saved
