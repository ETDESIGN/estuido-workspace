#!/bin/bash
# Daily Insights Generator - Analyzes system activity and generates insights
# Run at end of day to summarize what happened

INSIGHTS_DIR="$HOME/.openclaw/insights"
DATE=$(date '+%Y-%m-%d')
INSIGHTS_FILE="$INSIGHTS_DIR/${DATE}.md"
mkdir -p "$INSIGHTS_DIR"

echo "# Daily Insights - $DATE" > "$INSIGHTS_FILE"
echo "" >> "$INSIGHTS_FILE"
echo "Generated: $(date '+%H:%M:%S')" >> "$INSIGHTS_FILE"
echo "" >> "$INSIGHTS_FILE"

## 1. Audio Messages Summary
echo "## 🎙️ Voice Messages" >> "$INSIGHTS_FILE"
AUDIO_COUNT=$(find ~/.openclaw/media/inbound -name "*.ogg" -newermt "$(date '+%Y-%m-%d')" 2>/dev/null | wc -l)
TRANSCRIBED=$(find ~/.openclaw/media/inbound -name "*.txt" -newermt "$(date '+%Y-%m-%d')" 2>/dev/null | wc -l)
echo "- Received: $AUDIO_COUNT voice messages" >> "$INSIGHTS_FILE"
echo "- Transcribed: $TRANSCRIBED messages" >> "$INSIGHTS_FILE"
echo "" >> "$INSIGHTS_FILE"

## 2. Agent Activity
echo "## 🤖 Agent Activity" >> "$INSIGHTS_FILE"
if [[ -f "$HOME/.openclaw/workspace/memory/$(date +%Y-%m-%d).md" ]]; then
    TASKS=$(grep -c "^\- \[x\]" "$HOME/.openclaw/workspace/memory/$(date +%Y-%m-%d).md" 2>/dev/null || echo 0)
    echo "- Tasks completed: $TASKS" >> "$INSIGHTS_FILE"
fi
echo "" >> "$INSIGHTS_FILE"

## 3. System Health
echo "## 💊 System Health" >> "$INSIGHTS_FILE"
RAM_USAGE=$(free -m | awk '/Mem:/ {printf "%.1f%%", $3*100/$2}')
DISK_USAGE=$(df -h ~/.openclaw | awk 'NR==2 {print $5}')
echo "- RAM: $RAM_USAGE used" >> "$INSIGHTS_FILE"
echo "- Disk: $DISK_USAGE used" >> "$INSIGHTS_FILE"
echo "" >> "$INSIGHTS_FILE"

## 4. Backup Status
echo "## 💾 Backups" >> "$INSIGHTS_FILE"
LATEST_BACKUP=$(ls -t ~/.openclaw/backups/*.tar.gz 2>/dev/null | head -1)
if [[ -n "$LATEST_BACKUP" ]]; then
    BACKUP_AGE=$(( ($(date +%s) - $(stat -c %Y "$LATEST_BACKUP")) / 86400 ))
    BACKUP_SIZE=$(du -h "$LATEST_BACKUP" | cut -f1)
    echo "- Latest backup: $(basename "$LATEST_BACKUP")" >> "$INSIGHTS_FILE"
    echo "- Age: $BACKUP_AGE days" >> "$INSIGHTS_FILE"
    echo "- Size: $BACKUP_SIZE" >> "$INSIGHTS_FILE"
else
    echo "- ⚠️  No backups found" >> "$INSIGHTS_FILE"
fi
echo "" >> "$INSIGHTS_FILE"

## 5. New Memory Entries
echo "## 🧠 New Knowledge" >> "$INSIGHTS_FILE"
if [[ -f "$HOME/.openclaw/workspace/memory/$(date +%Y-%m-%d).md" ]]; then
    echo "Today's memory entries:" >> "$INSIGHTS_FILE"
    grep "^### " "$HOME/.openclaw/workspace/memory/$(date +%Y-%m-%d).md" | head -5 >> "$INSIGHTS_FILE"
fi
echo "" >> "$INSIGHTS_FILE"

cat "$INSIGHTS_FILE"
echo ""
echo "✅ Insights saved to: $INSIGHTS_FILE"
