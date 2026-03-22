#!/bin/bash

# Warren Watchdog - Agent Health Monitor
# Checks active agent sessions every 10 minutes
# Detects timeouts and stuck agents

LOG_FILE="/home/e/.openclaw/workspace/memory/warren-reports.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
TIMEOUT_THRESHOLD=600  # 10 minutes in seconds

echo "=== WARREN WATCHDOG REPORT ===" | tee -a "$LOG_FILE"
echo "Time: $TIMESTAMP" | tee -a "$LOG_FILE"

# Check if OpenClaw is running
if ! command -v openclaw &> /dev/null; then
    echo "Status: CRITICAL - OpenClaw not found" | tee -a "$LOG_FILE"
    exit 1
fi

# Get current time in seconds
CURRENT_TIME=$(date +%s)

# Count active sessions (grep through memory or use sessions_list)
# For now, use process listing
ACTIVE_AGENTS=$(pgrep -f "openclaw.*agent" | wc -l)

echo "Active agents: $ACTIVE_AGENTS" | tee -a "$LOG_FILE"

# Check for stuck fs-watcher
if pgrep -f "fs-watcher" > /dev/null; then
    FS_WATCHER_PID=$(pgrep -f "fs-watcher")
    FS_WATCHER_AGE=$(ps -p $FS_WATCHER_PID -o etimes= | tr -d ' ')

    if [ "$FS_WATCHER_AGE" -gt "$TIMEOUT_THRESHOLD" ]; then
        echo "⚠️ ALERT: fs-watcher may be stuck (PID: $FS_WATCHER_PID, age: ${FS_WATCHER_AGE}s)" | tee -a "$LOG_FILE"
        echo "Status: ALERT" | tee -a "$LOG_FILE"
    else
        echo "fs-watcher: OK (PID: $FS_WATCHER_PID)" | tee -a "$LOG_FILE"
        echo "Status: OK" | tee -a "$LOG_FILE"
    fi
else
    echo "fs-watcher: NOT RUNNING" | tee -a "$LOG_FILE"
    echo "Status: WARNING - fs-watcher not detected" | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"

# JSON output for machine parsing
echo "{\"type\":\"watchdog\",\"timestamp\":\"$TIMESTAMP\",\"active_agents\":$ACTIVE_AGENTS,\"status\":\"$(grep 'Status:' "$LOG_FILE" | tail -1 | cut -d' ' -f2-)\"}" >> "$LOG_FILE"

exit 0
