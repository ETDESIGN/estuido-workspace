#!/bin/bash
# Event Monitor - Watch for important events and send notifications
# Currently logs events; can be extended to send emails/notifications

EVENTS_LOG="$HOME/.openclaw/workspace/logs/events.log"
ALERT_THRESHOLDS_RAM=80
ALERT_THRESHOLDS_DISK=80

mkdir -p "$(dirname "$EVENTS_LOG")"

log_event() {
    local level="$1"
    local message="$2"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message" | tee -a "$EVENTS_LOG"
}

# Check for budget threshold (if script exists)
if [[ -f "$HOME/.openclaw/workspace/scripts/warren-budget-check.sh" ]]; then
    BUDGET_OUTPUT=$(bash "$HOME/.openclaw/workspace/scripts/warren-budget-check.sh" 2>&1)
    if echo "$BUDGET_OUTPUT" | grep -q "90%"; then
        log_event "ALERT" "API Budget at 90% threshold"
    fi
fi

# Check RAM
RAM_PERCENT=$(free | awk '/Mem:/ {printf "%.0f", $3*100/$2}')
if [[ $RAM_PERCENT -gt $ALERT_THRESHOLDS_RAM ]]; then
    log_event "WARNING" "RAM usage high: ${RAM_PERCENT}%"
fi

# Check disk
DISK_PERCENT=$(df ~/.openclaw | awk 'NR==2 {print $5}' | sed 's/%//')
if [[ $DISK_PERCENT -gt $ALERT_THRESHOLDS_DISK ]]; then
    log_event "WARNING" "Disk usage high: ${DISK_PERCENT}%"
fi

# Check for failed services
if ! curl -s http://localhost:18789/health &>/dev/null; then
    log_event "CRITICAL" "OpenClaw Gateway is down!"
fi

if ! curl -s http://localhost:3000/health &>/dev/null; then
    log_event "WARNING" "WhatsApp Service is down"
fi

# Log all new voice messages
NEW_AUDIO=$(find ~/.openclaw/media/inbound -name "*.ogg" -mmin -5 2>/dev/null | wc -l)
if [[ $NEW_AUDIO -gt 0 ]]; then
    log_event "INFO" "Received $NEW_AUDIO new voice message(s)"
fi

echo "✅ Event monitor check complete"
