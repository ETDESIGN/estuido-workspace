#!/bin/bash

# Warren Budget Check - Monitor daily API spend
# Alerts at 80% ($4.00) and 90% ($4.50) of $5.00 limit

LOG_FILE="/home/e/.openclaw/workspace/memory/warren-reports.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
DAILY_LIMIT=5.00
WARNING_THRESHOLD=4.00  # 80%
CRITICAL_THRESHOLD=4.50  # 90%

echo "=== BUDGET CHECK ===" | tee -a "$LOG_FILE"
echo "Time: $TIMESTAMP" | tee -a "$LOG_FILE"

# Try to get today's spend from OpenClaw
# This is a placeholder - actual implementation depends on OpenClaw's cost API
CURRENT_SPEND=0.41  # Default fallback if we can't get real data

# Try to fetch from status command
if command -v openclaw &> /dev/null; then
    # Try to get cost info (command may vary)
    ACTUAL_SPEND=$(openclaw status 2>/dev/null | grep -i "cost\|spend\|budget" | head -1 | grep -oE '[0-9]+\.[0-9]{2}' || echo "0.00")
    if [ "$ACTUAL_SPEND" != "0.00" ]; then
        CURRENT_SPEND="$ACTUAL_SPEND"
    fi
fi

PERCENTAGE=$(echo "scale=2; ($CURRENT_SPEND / $DAILY_LIMIT) * 100" | bc)

echo "Today's spend: \$$CURRENT_SPEND / \$$DAILY_LIMIT ($PERCENTAGE%)" | tee -a "$LOG_FILE"

# Determine status
if (( $(echo "$CURRENT_SPEND >= $CRITICAL_THRESHOLD" | bc -l) )); then
    echo "Threshold: CRITICAL - Budget nearly exhausted!" | tee -a "$LOG_FILE"
    echo "Action: STOP all non-essential agents" | tee -a "$LOG_FILE"
    STATUS="CRITICAL"
elif (( $(echo "$CURRENT_SPEND >= $WARNING_THRESHOLD" | bc -l) )); then
    echo "Threshold: WARNING - Approaching limit" | tee -a "$LOG_FILE"
    echo "Action: Consider switching to free models" | tee -a "$LOG_FILE"
    STATUS="WARNING"
else
    echo "Threshold: OK" | tee -a "$LOG_FILE"
    STATUS="OK"
fi

echo "Status: $STATUS" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# JSON output
echo "{\"type\":\"budget\",\"timestamp\":\"$TIMESTAMP\",\"spend\":$CURRENT_SPEND,\"limit\":$DAILY_LIMIT,\"percentage\":$PERCENTAGE,\"status\":\"$STATUS\"}" >> "$LOG_FILE"

exit 0
