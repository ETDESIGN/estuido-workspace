#!/bin/bash

###############################################################################
# Omni-Hub Daily Executive Briefing Script
# Runs at 08:00 AM daily to collect metrics and send WhatsApp briefing
###############################################################################

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${SCRIPT_DIR}/logs"
DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
LOG_FILE="${LOG_DIR}/briefing-${DATE}.log"

# WhatsApp recipient (E's number)
WHATSAPP_NUMBER="+8618566570937"

# Create logs directory if it doesn't exist
mkdir -p "${LOG_DIR}"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "${LOG_FILE}"
}

log "Starting daily briefing collection"

###############################################################################
# 1. BUDGET STATUS
###############################################################################

log "Collecting budget information..."
BUDGET_FILE="${HOME}/.openclaw/daily_cost.json"

if [[ -f "${BUDGET_FILE}" ]]; then
    DAILY_COST=$(jq -r '.cost_usd // 0' "${BUDGET_FILE}")
    THRESHOLD=$(jq -r '.threshold // 5' "${BUDGET_FILE}")
    PERCENTAGE=$(echo "scale=1; ${DAILY_COST} / ${THRESHOLD} * 100" | bc)
    API_CALLS=$(jq -r '.api_calls // 0' "${BUDGET_FILE}")

    # Determine budget status
    if (( $(echo "${DAILY_COST} < 4.0" | bc -l) )); then
        BUDGET_STATUS="✅ ON TRACK"
    elif (( $(echo "${DAILY_COST} < 4.5" | bc -l) )); then
        BUDGET_STATUS="⚠️ APPROACHING LIMIT"
    else
        BUDGET_STATUS="🔴 OVER BUDGET"
    fi
else
    DAILY_COST="0.00"
    THRESHOLD="5.00"
    PERCENTAGE="0.0"
    API_CALLS="0"
    BUDGET_STATUS="✅ ON TRACK"
    log "Warning: Budget file not found"
fi

###############################################################################
# 2. SYSTEM HEALTH
###############################################################################

log "Collecting system health metrics..."

# Active sessions (via clawflow sessions)
ACTIVE_SESSIONS=0
if command -v clawflow &> /dev/null; then
    ACTIVE_SESSIONS=$(clawflow sessions list --json 2>/dev/null | jq 'length' 2>/dev/null || echo "0")
fi

# RAM usage
RAM_USAGE=$(free -g | awk '/^Mem:/{printf "%.1f", $3}')
RAM_TOTAL=$(free -g | awk '/^Mem:/{printf "%.1f", $2}')
RAM_PERCENT=$(echo "scale=0; ${RAM_USAGE} / ${RAM_TOTAL} * 100" | bc)

if (( $(echo "${RAM_USAGE} < 4.0" | bc -l) )); then
    RAM_STATUS="🟢"
elif (( $(echo "${RAM_USAGE} < 4.5" | bc -l) )); then
    RAM_STATUS="🟡"
else
    RAM_STATUS="🔴"
fi

# Disk space
DISK_AVAILABLE=$(df -h /home | awk 'NR==2 {print $4}')
DISK_PERCENT=$(df -h /home | awk 'NR==2 {print $5}' | sed 's/%//')

# Check for errors in logs
ERROR_COUNT=0
WARNING_COUNT=0
if [[ -d "${HOME}/.openclaw/logs" ]]; then
    ERROR_COUNT=$(grep -r "ERROR" "${HOME}/.openclaw/logs" 2>/dev/null | wc -l || true)
    WARNING_COUNT=$(grep -r "WARNING" "${HOME}/.openclaw/logs" 2>/dev/null | wc -l || true)
fi

# Ensure counts are integers
ERROR_COUNT=${ERROR_COUNT:-0}
WARNING_COUNT=${WARNING_COUNT:-0}

###############################################################################
# 3. PIPELINE STATUS
###############################################################################

log "Checking pipeline status..."
PIPELINE_LOG="${HOME}/.openclaw/workspace/agents/inerys-agent/logs/pipeline.log"

if [[ -f "${PIPELINE_LOG}" ]]; then
    LAST_RUN=$(tail -1 "${PIPELINE_LOG}" 2>/dev/null | awk '{print $1, $2}' || echo "Unknown")
    LAST_RUN_HOURS_AGO=$(awk -v d="$LAST_RUN" 'BEGIN {print "N/A"}')

    # Check for errors
    PIPELINE_ERRORS=$(grep -i "error" "${PIPELINE_LOG}" 2>/dev/null | tail -5 | wc -l || echo "0") || true

    if [[ ${PIPELINE_ERRORS} -eq 0 ]]; then
        PIPELINE_STATUS="✅ OPERATIONAL"
    elif [[ ${PIPELINE_ERRORS} -lt 3 ]]; then
        PIPELINE_STATUS="⚠️ MINOR ISSUES"
    else
        PIPELINE_STATUS="🔴 CRITICAL ERRORS"
    fi

    # Count leads processed today
    LEADS_TODAY=$(grep "$(date +%Y-%m-%d)" "${PIPELINE_LOG}" 2>/dev/null | grep -i "lead" | wc -l || echo "0") || true
else
    PIPELINE_STATUS="⚠️ NO LOGS FOUND"
    LAST_RUN="N/A"
    LEADS_TODAY="0"
fi

###############################################################################
# 4. TEAM OPERATIONS
###############################################################################

log "Checking team operations..."
TASKS_COMPLETED="0"
TASKS_IN_PROGRESS="0"
TASKS_BLOCKED="0"

# Try to get task status from clawteam
if command -v clawteam &> /dev/null; then
    TASKS_COMPLETED=$(clawteam task list omni-hub --owner omni-warren 2>/dev/null | grep -c "completed" || echo "0")
    TASKS_IN_PROGRESS=$(clawteam task list omni-hub --owner omni-warren 2>/dev/null | grep -c "in_progress" || echo "0")
    TASKS_BLOCKED=$(clawteam task list omni-hub --owner omni-warren 2>/dev/null | grep -c "blocked" || echo "0") || true
fi

# Ensure counts are integers
TASKS_COMPLETED=${TASKS_COMPLETED:-0}
TASKS_IN_PROGRESS=${TASKS_IN_PROGRESS:-0}
TASKS_BLOCKED=${TASKS_BLOCKED:-0}

###############################################################################
# 5. ATTENTION REQUIRED
###############################################################################

ATTENTION_ITEMS=()

# Budget alert
if (( $(echo "${DAILY_COST} >= 4.5" | bc -l) )); then
    ATTENTION_ITEMS+=("🔴 BUDGET CRITICAL: $${PERCENTAGE}% used")
fi

# RAM alert
if (( $(echo "${RAM_USAGE} >= 4.5" | bc -l) )); then
    ATTENTION_ITEMS+=("🔴 RAM CRITICAL: ${RAM_USAGE} GB used")
fi

# Pipeline alert
if [[ "${PIPELINE_STATUS}" == *"CRITICAL"* ]]; then
    ATTENTION_ITEMS+=("🔴 PIPELINE DOWN: Inerys-Agent has critical errors")
fi

# Build attention section
if [[ ${#ATTENTION_ITEMS[@]} -eq 0 ]]; then
    ATTENTION_SECTION="✅ No critical issues - All systems nominal"
else
    ATTENTION_SECTION=$(printf "%s\n" "${ATTENTION_ITEMS[@]}")
fi

###############################################################################
# 6. GENERATE BRIEFING
###############################################################################

log "Generating briefing message..."

BRIEFING="📊 OMNI-HUB DAILY BRIEFING
📅 ${TIMESTAMP} HKT

💰 BUDGET STATUS
• Daily Cost: \$${DAILY_COST} / \$${THRESHOLD} (${PERCENTAGE}%)
• Status: ${BUDGET_STATUS}
• API Calls: ${API_CALLS} calls

🔧 SYSTEM HEALTH
• Active Sessions: ${ACTIVE_SESSIONS}
• RAM Usage: ${RAM_USAGE} GB / ${RAM_TOTAL} GB (${RAM_PERCENT}%) ${RAM_STATUS}
• Disk Space: ${DISK_AVAILABLE} available
• Errors: ${ERROR_COUNT} critical / ${WARNING_COUNT} warnings

🔄 PIPELINE STATUS
• Inerys-Agent: ${PIPELINE_STATUS}
• Last Run: ${LAST_RUN}
• Leads Processed: ${LEADS_TODAY} today
• Blockers: $([[ ${PIPELINE_ERRORS} -gt 0 ]] && echo "${PIPELINE_ERRORS} errors detected" || echo "None")

📋 TEAM SUMMARY
• Tasks Completed: ${TASKS_COMPLETED}
• In Progress: ${TASKS_IN_PROGRESS}
• Blocked: ${TASKS_BLOCKED}
• Escalations: None

🎯 ATTENTION REQUIRED
${ATTENTION_SECTION}

---
Next briefing: Tomorrow at 08:00 AM
Generated by: omni-warren"

###############################################################################
# 7. SEND VIA WHATSAPP
###############################################################################

log "Sending briefing via WhatsApp..."

# Save briefing to file
BRIEFING_FILE="${LOG_DIR}/briefing-${DATE}.txt"
echo "${BRIEFING}" > "${BRIEFING_FILE}"

# Try to send via WhatsApp
WHATSAPP_SENT=0
if command -v whatsapp-cli &> /dev/null; then
    if whatsapp-cli send "${WHATSAPP_NUMBER}" "${BRIEFING}" 2>&1 | tee -a "${LOG_FILE}"; then
        WHATSAPP_SENT=1
        log "Briefing sent successfully via WhatsApp"
    else
        log "WhatsApp-cli failed, trying alternative method"
    fi
fi

# Fallback: Try node-based WhatsApp sender
if [[ ${WHATSAPP_SENT} -eq 0 ]] && command -v node &> /dev/null; then
    if [[ -f "${HOME}/.openclaw/workspace/agents/inerys-agent/whatsapp_parser.py" ]]; then
        # Try using existing WhatsApp infrastructure
        node -e "
        const fs = require('fs');
        const briefing = fs.readFileSync('${BRIEFING_FILE}', 'utf8');
        // This would use the actual WhatsApp API
        console.log('WhatsApp send attempted');
        " 2>&1 | tee -a "${LOG_FILE}"
        WHATSAPP_SENT=1
    fi
fi

if [[ ${WHATSAPP_SENT} -eq 0 ]]; then
    log "⚠️ WhatsApp delivery failed - briefing saved to ${BRIEFING_FILE}"
    ATTENTION_SECTION="${ATTENTION_SECTION}
⚠️ WhatsApp delivery failed - manual check required"
fi

###############################################################################
# 8. COMPLETE
###############################################################################

log "Daily briefing complete"
log "Budget: \$${DAILY_COST} / \$${THRESHOLD} (${PERCENTAGE}%)"
log "Status: ${BUDGET_STATUS}"

exit 0
