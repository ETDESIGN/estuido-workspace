#!/bin/bash
# Opportunity Detector - Runs frequently to find quick improvements
# Looks for low-hanging fruit and immediate optimizations

OPPORTUNITIES_DIR="$HOME/.openclaw/opportunities"
TODAY_OPPORTUNITIES="$OPPORTUNITIES_DIR/$(date +%Y-%m-%d).md"

mkdir -p "$OPPORTUNITIES_DIR"

FOUND=0

# Check 1: Old logs that can be cleaned
OLD_LOGS=$(find ~/.openclaw/workspace/logs -name "*.log" -mtime +7 -size +1M 2>/dev/null | wc -l)
if [[ $OLD_LOGS -gt 0 ]]; then
    echo "[$(date)] 🧹 Clean up $OLD_LOGS large log files (>7 days old)" >> "$TODAY_OPPORTUNITIES"
    FOUND=$((FOUND + 1))
fi

# Check 2: Uncommitted changes in workspace
UNCOMMITTED=$(cd ~/.openclaw/workspace && git status --porcelain 2>/dev/null | wc -l)
if [[ $UNCOMMITTED -gt 5 ]]; then
    echo "[$(date)] 📦 Commit $UNCOMMITTED uncommitted changes to git" >> "$TODAY_OPPORTUNITIES"
    FOUND=$((FOUND + 1))
fi

# Check 3: Memory files that need merging
MEMORY_FILES=$(ls -1 ~/.openclaw/workspace/memory/*.md 2>/dev/null | wc -l)
if [[ $MEMORY_FILES -gt 30 ]]; then
    echo "[$(date)] 🧠 Consolidate $MEMORY_FILES memory files (consider archive)" >> "$TODAY_OPPORTUNITIES"
    FOUND=$((FOUND + 1))
fi

# Check 4: Large files in media inbound
LARGE_MEDIA=$(find ~/.openclaw/media/inbound -name "*.ogg" -size +2M -mtime -1 2>/dev/null | wc -l)
if [[ $LARGE_MEDIA -gt 0 ]]; then
    echo "[$(date)] 🎙️ Found $LARGE_MEDIA large voice files - consider compression" >> "$TODAY_OPPORTUNITIES"
    FOUND=$((FOUND + 1))
fi

# Check 5: Failed transcriptions
if [[ -f "$HOME/.openclaw/workspace/logs/audio-transcribe.log" ]]; then
    RECENT_FAILURES=$(grep "❌ Failed" "$HOME/.openclaw/workspace/logs/audio-transcribe.log" 2>/dev/null | tail -5 | wc -l)
    if [[ $RECENT_FAILURES -gt 2 ]]; then
        echo "[$(date)] ⚠️  $RECENT_FAILURES recent transcription failures - investigate" >> "$TODAY_OPPORTUNITIES"
        FOUND=$((FOUND + 1))
    fi
fi

# Check 6: Low disk space on backup drive
DISK_PCT=$(df ~/.openclaw | awk 'NR==2 {print $5}' | sed 's/%//')
if [[ $DISK_PCT -gt 80 ]]; then
    echo "[$(date)] 💾 Disk usage at ${DISK_PCT}% - extend storage or cleanup" >> "$TODAY_OPPORTUNITIES"
    FOUND=$((FOUND + 1))
fi

# Check 7: High memory usage
RAM_PCT=$(free | awk '/Mem:/ {printf "%.0f", $3*100/$2}')
if [[ $RAM_PCT -gt 85 ]]; then
    echo "[$(date)] 🐏 RAM usage at ${RAM_PCT}% - restart services or optimize" >> "$TODAY_OPPORTUNITIES"
    FOUND=$((FOUND + 1))
fi

if [[ $FOUND -gt 0 ]]; then
    echo "✅ Found $FOUND improvement opportunities today"
    echo "📋 Logged to: $TODAY_OPPORTUNITIES"
else
    echo "✨ No immediate opportunities - system running well!"
fi

exit $FOUND
