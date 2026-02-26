#!/bin/bash
# memory-search.sh - Search workspace memory using grep + ranking
# Usage: ./memory-search.sh "your query"

QUERY="$1"
WORKSPACE="/home/e/.openclaw/workspace"
MEMORY_DIR="$WORKSPACE/memory"
DOCS_DIR="$WORKSPACE/docs"

if [ -z "$QUERY" ]; then
    echo "Usage: $0 'search query'"
    exit 1
fi

echo "🔍 Searching memory for: $QUERY"
echo ""

# Search in priority order
echo "📁 In docs/ (architecture, processes):"
grep -ri "$QUERY" $DOCS_DIR --include="*.md" -l 2>/dev/null | head -5 | while read f; do
    echo "  - $(basename $f)"
    grep -i "$QUERY" "$f" | head -2 | sed 's/^/    /'
    echo ""
done

echo "📁 In memory/ (daily logs, decisions):"
grep -ri "$QUERY" $MEMORY_DIR --include="*.md" -l 2>/dev/null | head -5 | while read f; do
    echo "  - $(basename $f)"
    grep -i "$QUERY" "$f" | head -2 | sed 's/^/    /'
    echo ""
done

echo "📁 In agents/ (task history):"
grep -ri "$QUERY" $WORKSPACE/agents --include="TASK*.md" -l 2>/dev/null | head -3 | while read f; do
    echo "  - $(basename $f)"
done

echo ""
echo "Tip: Use 'memory-get.sh <file> <line>' to read specific files"
