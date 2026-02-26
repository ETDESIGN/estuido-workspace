#!/bin/bash
# auto-monitor.sh - Automatic system monitoring by agents
# Run this every 5 minutes via cron or heartbeat

echo "$(date): Auto-monitor check..."

# Check Backend
if ! curl -s http://localhost:3002/api/health > /dev/null; then
    echo "Backend down - alerting Tech agent"
    # Trigger tech agent action
fi

# Check Frontend  
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "Frontend down - alerting Design agent"
    # Trigger design agent action
fi

# Check FS-Watcher
if ! pgrep -f "fs-watcher" > /dev/null; then
    echo "FS-Watcher down - restarting"
    /home/e/.openclaw/workspace/scripts/start-tool-request-watcher.sh &
fi

# Check Memory Usage
MEM_USED=$(free | awk 'NR==2{printf "%.0f", $3/$2*100}')
if [ "$MEM_USED" -gt 80 ]; then
    echo "Memory high ($MEM_USED%) - alerting GM"
fi

echo "$(date): Monitor complete"
