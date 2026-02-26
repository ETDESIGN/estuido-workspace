#!/bin/bash
# memory-get.sh - Retrieve specific memory content
# Usage: ./memory-get.sh <filename> [lines_from]

FILE="$1"
FROM="${2:-1}"
LINES="${3:-50}"
WORKSPACE="/home/e/.openclaw/workspace"

if [ -z "$FILE" ]; then
    echo "Usage: $0 <filename> [start_line] [num_lines]"
    echo ""
    echo "Examples:"
    echo "  $0 MEMORY.md              # Show MEMORY.md from line 1"
    echo "  $0 MEMORY.md 50           # Show from line 50"
    echo "  $0 2026-02-16.md 1 20     # Show first 20 lines of daily log"
    exit 1
fi

# Find file
if [ -f "$WORKSPACE/$FILE" ]; then
    FULLPATH="$WORKSPACE/$FILE"
elif [ -f "$WORKSPACE/memory/$FILE" ]; then
    FULLPATH="$WORKSPACE/memory/$FILE"
elif [ -f "$WORKSPACE/docs/$FILE" ]; then
    FULLPATH="$WORKSPACE/docs/$FILE"
elif [ -f "$WORKSPACE/agents/$FILE" ]; then
    FULLPATH="$WORKSPACE/agents/$FILE"
else
    echo "❌ File not found: $FILE"
    echo ""
    echo "Searching for similar files:"
    find $WORKSPACE -name "*$FILE*" -type f 2>/dev/null | head -5
    exit 1
fi

echo "📄 $FILE (lines $FROM-$((FROM + LINES - 1)))"
echo "═══════════════════════════════════════════════════════"
sed -n "${FROM},$((FROM + LINES - 1))p" "$FULLPATH"
echo ""
echo "═══════════════════════════════════════════════════════"
echo "Full path: $FULLPATH"
echo "Total lines: $(wc -l < "$FULLPATH")"
