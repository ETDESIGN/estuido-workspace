#!/bin/bash
# Daily ByteRover sync - curate important new memories
# Designed to run after EOD summary

set -e

WORKSPACE="/home/e/.openclaw/workspace"
MEMORY_DIR="$WORKSPACE/memory"

echo "=== ByteRover Daily Sync ==="
echo "Time: $(date)"

# Get today's date
TODAY=$(date +%Y-%m-%d)

# Find memory files modified in last 24 hours
RECENT=$(find "$MEMORY_DIR" -name "*.md" -newer /tmp/byterover-last-sync 2>/dev/null | head -10)

if [ -z "$RECENT" ]; then
    echo "No new memory files to curate."
    touch /tmp/byterover-last-sync
    exit 0
fi

echo "Found $(echo "$RECENT" | wc -l) recently modified files"

# Curate key files (limit to prevent token waste)
COUNT=0
for f in $RECENT; do
    if [ $COUNT -ge 5 ]; then
        break
    fi
    
    CONTENT=$(head -50 "$f" | tr '\n' ' ')
    if [ ${#CONTENT} -gt 100 ]; then
        echo "Curating: $(basename $f)"
        brv curate "$CONTENT" --detach 2>&1
        COUNT=$((COUNT + 1))
    fi
done

touch /tmp/byterover-last-sync
echo "=== Sync complete: $COUNT files curated ==="
