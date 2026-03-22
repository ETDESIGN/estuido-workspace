#!/bin/bash

# Warren QA Loop Detector - Detect when QA rejects CTO work 2+ times
# Triggers boardroom discussion if threshold exceeded

LOG_FILE="/home/e/.openclaw/workspace/memory/warren-reports.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
WORKSPACE="/home/e/.openclaw/workspace"
QA_REJECTION_THRESHOLD=2

echo "=== QA LOOP DETECTOR ===" | tee -a "$LOG_FILE"
echo "Time: $TIMESTAMP" | tee -a "$LOG_FILE"

# Search for TASK.md files
TASK_FILES=$(find "$WORKSPACE/agents" -name "TASK-*.md" -o -name "TASK.md" 2>/dev/null)

REJECTION_COUNT=0
CURRENT_TASK=""
ACTION="Monitor"

for task_file in $TASK_FILES; do
    if [ -f "$task_file" ]; then
        # Count NEEDS_FIX occurrences (single line count)
        NEEDS_FIX=$(grep -c "NEEDS_FIX" "$task_file" 2>/dev/null || echo "0")
        BLOCKER=$(grep -c "BLOCKER" "$task_file" 2>/dev/null || echo "0")

        # Ensure these are integers
        NEEDS_FIX=${NEEDS_FIX:-0}
        BLOCKER=${BLOCKER:-0}

        if [ "$NEEDS_FIX" -gt 0 ] 2>/dev/null; then
            REJECTION_COUNT=$((REJECTION_COUNT + NEEDS_FIX))
            CURRENT_TASK=$(basename "$task_file")
            echo "Found $NEEDS_FIX rejections in $CURRENT_TASK" | tee -a "$LOG_FILE"
        fi

        if [ "$BLOCKER" -gt 0 ] 2>/dev/null; then
            echo "⚠️ BLOCKER found in $CURRENT_TASK" | tee -a "$LOG_FILE"
            ACTION="ESCALATE_TO_GM"
        fi
    fi
done

echo "Total rejections: $REJECTION_COUNT" | tee -a "$LOG_FILE"

if [ "$REJECTION_COUNT" -ge "$QA_REJECTION_THRESHOLD" ]; then
    echo "Action: TRIGGER_BOARDROOM" | tee -a "$LOG_FILE"
    echo "Reason: QA has rejected work $REJECTION_COUNT times (threshold: $QA_REJECTION_THRESHOLD)" | tee -a "$LOG_FILE"
    STATUS="BOARDROOM"
    ACTION="TRIGGER_BOARDROOM"
else
    echo "Action: Monitor" | tee -a "$LOG_FILE"
    STATUS="OK"
fi

echo "Status: $STATUS" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# JSON output
echo "{\"type\":\"qa_loop\",\"timestamp\":\"$TIMESTAMP\",\"rejections\":$REJECTION_COUNT,\"threshold\":$QA_REJECTION_THRESHOLD,\"task\":\"$CURRENT_TASK\",\"action\":\"$ACTION\",\"status\":\"$STATUS\"}" >> "$LOG_FILE"

exit 0
