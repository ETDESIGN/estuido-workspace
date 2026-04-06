---
tags: config, testing, error, setup
type: technical
priority: critical
status: active
created: 2026-03-28
---

# Cost Alert Cron Job - Implementation Complete

**Created by:** Warren (COO)  
**Date:** 2026-02-18  
**Purpose:** Alert when daily token spend exceeds $5

## Implementation Summary

### 1. Cost Monitoring Script
- **Location:** `/home/e/.openclaw/cron/cost-monitor.sh`
- **Function:** Checks daily API usage and calculates estimated spend
- **Threshold:** $5.00 USD
- **Alert Frequency:** Once per day (resets at midnight)

### 2. Cron Job Configuration
- **Job ID:** `cost-monitor-daily-alert`
- **Schedule:** Every hour at minute 0 (`0 * * * *`)
- **Timezone:** Asia/Hong_Kong
- **Target:** Main session (Dereck/GM)
- **Status:** ✅ Active and enabled

### 3. How It Works
1. Every hour, the cron job triggers a system event
2. The event instructs the main agent to run the cost-monitor.sh script
3. Script checks `api-usage.jsonl` for today's entries with cost data
4. If daily spend > $5:
   - Returns exit code 2 (alert triggered)
   - Logs alert to `cost_alerts.log`
   - Records alert sent date (prevents duplicate alerts)
5. If spend ≤ $5: Normal exit (code 0)

### 4. Alert Message
When triggered, sends this instruction to GM:
```
[Warren - COO Alert] Check daily token spend. Run: /home/e/.openclaw/cron/cost-monitor.sh. 
If daily spend > $5, WARN Dereck (GM) immediately to switch to GLM-5 free tier or pause 
non-critical agents.
```

### 5. Files Created
- `/home/e/.openclaw/cron/cost-monitor.sh` - Main monitoring script
- `/home/e/.openclaw/cron/jobs.json` - Updated with new job
- `/home/e/.openclaw/cron/jobs.json.bak` - Backup of previous config

### 6. Testing Results
✅ Script executes without errors  
✅ Correctly detects spend > $5 threshold  
✅ Returns appropriate exit codes  
✅ Prevents duplicate daily alerts  
✅ Cron job properly registered in OpenClaw

### 7. Next Runs (Hong Kong Time)
- Next run: Top of next hour (e.g., 21:00, 22:00, etc.)
- Runs: Every hour, 24 times per day
- First run: Pending (job just created)

### 8. Cost Calculation Method
The script uses two methods:
1. **Direct cost:** Reads `"cost"` field from `api-usage.jsonl` entries
2. **Estimation:** If no cost data, estimates based on service calls:
   - Moonshot/Kimi: ~$0.015 per call
   - OpenRouter: ~$0.01 per call
   - Groq: $0 (free tier)

### 9. Manual Check
To manually verify current spend:
```bash
bash /home/e/.openclaw/cron/cost-monitor.sh
```

---
**Status:** ✅ ACTIVE AND MONITORING
