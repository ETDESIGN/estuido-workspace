#!/bin/bash

# Warren EOD Report - End-of-Day System Health Summary
# Generated daily at 6:00 PM

LOG_FILE="/home/e/.openclaw/workspace/memory/warren-reports.log"
EOD_LOG="/home/e/.openclaw/workspace/memory/warren-eod-$(date +%Y%m%d).log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
TODAY=$(date +"%Y-%m-%d")

echo "=== WARREN EOD REPORT ===" | tee -a "$EOD_LOG"
echo "Date: $TODAY" | tee -a "$EOD_LOG"
echo "Generated: $TIMESTAMP" | tee -a "$EOD_LOG"
echo "" | tee -a "$EOD_LOG"

# ============================================================
# System Overview
# ============================================================
echo "## SYSTEM OVERVIEW" | tee -a "$EOD_LOG"

# Uptime
if [ -f /proc/uptime ]; then
    UPTIME=$(cat /proc/uptime | awk '{print int($1/86400)" days"}')
    echo "System uptime: $UPTIME" | tee -a "$EOD_LOG"
fi

# RAM usage
RAM_USAGE=$(free -m | awk 'NR==2{printf "%.1fGB / 5GB (%.1f%%)", $3/1024, ($3/$2)*100 }')
echo "RAM usage: $RAM_USAGE" | tee -a "$EOD_LOG"

# Disk space
DISK_USAGE=$(df -h /home | awk 'NR==2{print $3 "/" $2 " (" $5 ")"}')
echo "Disk usage: $DISK_USAGE" | tee -a "$EOD_LOG"

echo "" | tee -a "$EOD_LOG"

# ============================================================
# Agent Activity
# ============================================================
echo "## AGENT ACTIVITY" | tee -a "$EOD_LOG"

# Count agent sessions today
AGENT_SESSIONS=$(grep -c "agent:cto\|agent:qa\|agent:main" "$LOG_FILE" 2>/dev/null || echo "0")
echo "Total agent sessions: $AGENT_SESSIONS" | tee -a "$EOD_LOG"

# Check fs-watcher
if pgrep -f "fs-watcher" > /dev/null; then
    echo "fs-watcher: RUNNING (PID: $(pgrep -f 'fs-watcher'))" | tee -a "$EOD_LOG"
else
    echo "fs-watcher: NOT RUNNING ⚠️" | tee -a "$EOD_LOG"
fi

echo "" | tee -a "$EOD_LOG"

# ============================================================
# Budget Summary
# ============================================================
echo "## BUDGET SUMMARY" | tee -a "$EOD_LOG"

# Get latest budget check
LATEST_BUDGET=$(grep "Today's spend:" "$LOG_FILE" | tail -1)
if [ -n "$LATEST_BUDGET" ]; then
    echo "$LATEST_BUDGET" | tee -a "$EOD_LOG"
else
    echo "No budget data available" | tee -a "$EOD_LOG"
fi

echo "" | tee -a "$EOD_LOG"

# ============================================================
# Issues & Blockers
# ============================================================
echo "## ISSUES & BLOCKERS" | tee -a "$EOD_LOG"

# Count alerts today
CRITICAL_COUNT=$(grep -c "CRITICAL" "$LOG_FILE" 2>/dev/null || echo "0")
WARNING_COUNT=$(grep -c "WARNING" "$LOG_FILE" 2>/dev/null || echo "0")
QA_LOOPS=$(grep -c "TRIGGER_BOARDROOM" "$LOG_FILE" 2>/dev/null || echo "0")

echo "Critical alerts: $CRITICAL_COUNT" | tee -a "$EOD_LOG"
echo "Warnings: $WARNING_COUNT" | tee -a "$EOD_LOG"
echo "QA loops detected: $QA_LOOPS" | tee -a "$EOD_LOG"

if [ "$QA_LOOPS" -gt 0 ]; then
    echo "" | tee -a "$EOD_LOG"
    echo "QA Loop Details:" | tee -a "$EOD_LOG"
    grep -B2 "TRIGGER_BOARDROOM" "$LOG_FILE" | tail -5 | tee -a "$EOD_LOG"
fi

echo "" | tee -a "$EOD_LOG"

# ============================================================
# Recommendations
# ============================================================
echo "## RECOMMENDATIONS" | tee -a "$EOD_LOG"

# Analyze and make recommendations
if [ "$CRITICAL_COUNT" -gt 0 ]; then
    echo "⚠️ $CRITICAL_COUNT critical issues detected. Review logs." | tee -a "$EOD_LOG"
fi

if [ "$QA_LOOPS" -gt 2 ]; then
    echo "🔄 High QA loop count ($QA_LOOPS). Consider architecture review." | tee -a "$EOD_LOG"
fi

if pgrep -f "fs-watcher" > /dev/null; then
    echo "✅ System healthy. Continue monitoring." | tee -a "$EOD_LOG"
else
    echo "❌ fs-watcher not running. Restart recommended." | tee -a "$EOD_LOG"
fi

echo "" | tee -a "$EOD_LOG"
echo "=== END OF REPORT ===" | tee -a "$EOD_LOG"
echo "" | tee -a "$EOD_LOG"

# Send notification to GM
echo "Warren EOD Report complete. Log saved to: $EOD_LOG" | tee -a "$LOG_FILE"

exit 0
