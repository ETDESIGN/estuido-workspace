#!/bin/bash
# Archive old memory entries (> 90 days)

AGE_DAYS=90
MEMORY_BASE=~/.openclaw/workspace/memory

echo "📦 Archiving memory older than $AGE_DAYS days..."

CUTOFF_DATE=$(date -d "$AGE_DAYS days ago" +%Y-%m-%d)
echo "📅 Cutoff: $CUTOFF_DATE"

find "$MEMORY_BASE/active" -name "*.md" -type f -mtime +$AGE_DAYS | while read file; do
    # Check if tagged "evergreen" (keep active)
    if ! grep -q "tags:.*evergreen" "$file" 2>/dev/null; then
        # Get file modification date
        file_date=$(stat -c %y "$file" 2>/dev/null | cut -d' ' -f1)

        # Extract year and month
        year=$(echo $file_date | cut -d'-' -f1)
        month=$(echo $file_date | cut -d'-' -f2)

        # Create archive directory
        archive_dir="$MEMORY_BASE/archive/$year/$month"
        mkdir -p "$archive_dir"

        # Move to archive
        mv "$file" "$archive_dir/"
        echo "  📦 Archived: $(basename "$file") → $archive_dir/"
    fi
done

echo "✅ Archive complete"
