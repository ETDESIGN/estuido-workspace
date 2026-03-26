#!/bin/bash
# escalate_to_gm.sh
# Escalation skill for Inerys Agent
# Drops high-priority tasks into Dereck's (GM) queue when agent cannot fulfill requests

set -e

# Configuration
GM_SESSION="agent:main:main"  # Dereck's session
TASK_LOG="$HOME/.openclaw/workspace/agents/inerys-agent/logs/escalations.log"
SANDBOX_DIR="$HOME/.openclaw/workspace/agents/inerys-agent"

# Ensure log directory exists
mkdir -p "$(dirname "$TASK_LOG")"

# Usage
usage() {
    echo "Usage: $0 <priority> <task_description> [--context <context>]"
    echo ""
    echo "Priorities: critical, high, medium, low"
    echo ""
    echo "Example:"
    echo '  $0 high "Build custom scraper for example.com" --context "Client requested product catalog extraction"'
    exit 1
}

# Parse arguments
if [[ $# -lt 2 ]]; then
    usage
fi

PRIORITY="$1"
TASK_DESC="$2"
CONTEXT=""

shift 2

while [[ $# -gt 0 ]]; do
    case $1 in
        --context)
            CONTEXT="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate priority
case "$PRIORITY" in
    critical|high|medium|low)
        ;;
    *)
        echo "Error: Invalid priority. Use: critical, high, medium, low"
        exit 1
        ;;
esac

# Create escalation entry
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
ESCALATION_ID="esc-$(date +%s)"

# Log to file
cat >> "$TASK_LOG" <<EOF
---
ID: $ESCALATION_ID
Timestamp: $TIMESTAMP
Priority: $PRIORITY
Task: $TASK_DESC
Context: $CONTEXT
Status: pending
---

EOF

# Format message for GM
MESSAGE="🚨 ESCALATION [${PRIORITY^^}]

Inerys Agent cannot fulfill: $TASK_DESC

Context: $CONTEXT

Escalation ID: $ESCALATION_ID
Client: Florian (Inerys/Proteke)

Please assess and either:
1. Build required capability
2. Delegate to specialist
3. Inform agent of workaround

Reference: $TASK_LOG"

# Send to GM session (if sessions tool available)
if command -v sessions_send &> /dev/null; then
    sessions_send "$GM_SESSION" "$MESSAGE"
    echo "✓ Escalation sent to GM"
else
    # Fallback: Create task file for GM to pick up
    GM_TASK_FILE="$HOME/.openclaw/workspace/tasks/inerys-escalations.txt"
    mkdir -p "$(dirname "$GM_TASK_FILE")"
    echo "$MESSAGE" >> "$GM_TASK_FILE"
    echo "⚠️  sessions_send not available - logged to $GM_TASK_FILE"
fi

# Inform Florian via WhatsApp (placeholder - actual implementation would use WhatsApp API)
WHATSAPP_MSG="🔄 Amélioration demandée: $TASK_DESC

Je reviens vers vous dès que possible."

echo ""
echo "Escalation Summary:"
echo "  ID: $ESCALATION_ID"
echo "  Priority: $PRIORITY"
echo "  Task: $TASK_DESC"
echo "  Logged: $TASK_LOG"
echo ""
echo "📧 Informing Florian of upgrade request..."
echo "   (WhatsApp: $WHATSAPP_MSG)"
