#!/bin/bash
# Daily Startup - Review insights, opportunities, and pick an improvement
# Run this first thing every morning

DATE=$(date '+%Y-%m-%d')
STARTUP_LOG="$HOME/.openclaw/workspace/logs/daily-startup.log"

echo "=== 🌅 Daily Startup - $DATE ===" | tee -a "$STARTUP_LOG"
echo ""

# 1. Check Yesterday's Insights
echo "📚 Yesterday's Insights:" | tee -a "$STARTUP_LOG"
if [[ -f "$HOME/.openclaw/analysis/insights.md" ]]; then
    tail -20 "$HOME/.openclaw/analysis/insights.md" | tee -a "$STARTUP_LOG"
fi
echo ""

# 2. Check Today's Opportunities
echo "🎯 Today's Opportunities:" | tee -a "$STARTUP_LOG"
if [[ -f "$HOME/.openclaw/opportunities/${DATE}.md" ]]; then
    cat "$HOME/.openclaw/opportunities/${DATE}.md" | tee -a "$STARTUP_LOG"
else
    echo "  No opportunities detected yet" | tee -a "$STARTUP_LOG"
fi
echo ""

# 3. Pick an Idea from Backlog
echo "💡 Idea from Backlog:" | tee -a "$STARTUP_LOG"
if [[ -f "$HOME/.openclaw/improvements/ideas-log.md" ]]; then
    grep -A 5 "Status.*Pending\|Status.*Generated" "$HOME/.openclaw/improvements/ideas-log.md" | head -10 | tee -a "$STARTUP_LOG"
fi
echo ""

# 4. System Status
echo "💊 System Status:" | tee -a "$STARTUP_LOG"
bash ~/.openclaw/workspace/scripts/system-health-check.sh | grep -E "✓|✗|RAM|Disk" | tee -a "$STARTUP_LOG"
echo ""

echo "=== ✅ Ready to be useful! ===" | tee -a "$STARTUP_LOG"
