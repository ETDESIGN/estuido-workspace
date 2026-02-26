#!/bin/bash
# memory-save.sh - Save important information to memory
# Usage: ./memory-save.sh "Title" "Content"

TITLE="$1"
CONTENT="$2"
WORKSPACE="/home/e/.openclaw/workspace"
MEMORY_DIR="$WORKSPACE/memory"
TODAY=$(date +%Y-%m-%d)

if [ -z "$TITLE" ] || [ -z "$CONTENT" ]; then
    echo "Usage: $0 'Title of memory' 'Content to save'"
    exit 1
fi

# Save to daily log
DAILY_FILE="$MEMORY_DIR/$TODAY.md"

if [ ! -f "$DAILY_FILE" ]; then
    echo "# Memory Log - $TODAY" > "$DAILY_FILE"
    echo "" >> "$DAILY_FILE"
fi

echo "## $(date '+%H:%M') - $TITLE" >> "$DAILY_FILE"
echo "" >> "$DAILY_FILE"
echo "$CONTENT" >> "$DAILY_FILE"
echo "" >> "$DAILY_FILE"

echo "✅ Saved to: $DAILY_FILE"
echo ""
echo "Content preview:"
echo "  Title: $TITLE"
echo "  Content: ${CONTENT:0:100}..."
