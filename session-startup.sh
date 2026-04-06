#!/bin/bash
# Session Startup Check - Runs automatically before first response
# Usage: source session-startup.sh or bash session-startup.sh

echo "═══ SESSION STARTUP ═══" >&2
echo "" >&2

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Critical Files
echo "📖 Critical files:" >&2
for f in SOUL.md IDENTITY.md MEMORY.md USER.md HEARTBEAT.md LEARNINGS.md TOOLS.md; do
    if [ -f "$f" ]; then
        echo -e "  ${GREEN}✅${NC} $f" >&2
    else
        echo -e "  ${RED}❌${NC} $f missing" >&2
    fi
done

# 2. Voice System
echo "" >&2
echo "🎙️  Voice system:" >&2
which spd-say >/dev/null 2>&1 && echo -e "  ${GREEN}✅${NC} TTS (spd-say/espeak-ng)" >&2 || echo -e "  ${YELLOW}⚠️${NC}  TTS not found" >&2
which arecord >/dev/null 2>&1 && echo -e "  ${GREEN}✅${NC} Recording (arecord)" >&2 || echo -e "  ${YELLOW}⚠️${NC}  Recording not found" >&2
python3 -c "import speech_recognition" 2>/dev/null && echo -e "  ${GREEN}✅${NC} STT (Google Speech Recognition)" >&2 || echo -e "  ${YELLOW}⚠️${NC}  STT not available" >&2
[ -d "voice-system" ] && echo -e "  ${GREEN}✅${NC} voice-system/ directory ($(\ls -1 voice-system/scripts/*.sh 2>/dev/null | wc -l) scripts)" >&2 || echo -e "  ${YELLOW}⚠️${NC}  voice-system/ not found" >&2

# 3. Memory & Search
echo "" >&2
echo "🧠 Memory & search:" >&2
which qmd >/dev/null 2>&1 && echo -e "  ${GREEN}✅${NC} QMD search" >&2 || echo -e "  ${YELLOW}⚠️${NC}  QMD not in PATH" >&2
[ -f "scripts/memory-search.sh" ] && echo -e "  ${GREEN}✅${NC} Native memory search" >&2 || echo -e "  ${YELLOW}⚠️${NC}  memory-search.sh not found" >&2

# 4. Resources
echo "" >&2
echo "💾 System resources:" >&2
RAM_INFO=$(free -h | grep "Mem:" | awk '{printf "%s / %s", $3, $2}')
echo -e "  RAM: $RAM_INFO" >&2

# 5. Active Projects
echo "" >&2
echo "📂 Active projects:" >&2
ls -d */ 2>/dev/null | grep -v -E "(node_modules|\.git|__pycache__|\..*venv)" | head -5 | while read dir; do
    echo -e "  ${GREEN}▸${NC} ${dir%/}" >&2
done

# 6. Integrations (if gateway config accessible)
echo "" >&2
echo "🔗 Integrations:" >&2
if [ -f "$HOME/.openclaw/openclaw.json" ]; then
    # Check audio transcription
    AUDIO_ENABLED=$(jq -r '.tools.audio.enabled // false' "$HOME/.openclaw/openclaw.json" 2>/dev/null)
    [ "$AUDIO_ENABLED" = "true" ] && echo -e "  ${GREEN}✅${NC} Gateway audio transcription" >&2 || echo -e "  ${YELLOW}⚠️${NC}  Audio transcription disabled" >&2

    # Check agents
    AGENT_COUNT=$(jq -r '.agents.list | length' "$HOME/.openclaw/openclaw.json" 2>/dev/null)
    [ -n "$AGENT_COUNT" ] && echo -e "  ${GREEN}✅${NC} $AGENT_COUNT agents configured" >&2
else
    echo -e "  ${YELLOW}⚠️${NC}  Gateway config not accessible" >&2
fi

# 7. Today's Context
echo "" >&2
echo "📅 Today's context:" >&2
TODAY_MEM="memory/$(date +%Y-%m-%d).md"
if [ -f "$TODAY_MEM" ]; then
    LINES=$(wc -l < "$TODAY_MEM")
    echo -e "  ${GREEN}✅${NC} $TODAY_MEM ($LINES lines)" >&2
else
    echo -e "  ${YELLOW}⚠️${NC}  No memory log for today" >&2
fi

echo "" >&2
echo "═════════════════════════════════" >&2

# Export summary as environment variable for agent to read
export SESSION_STARTUP_COMPLETE=true
export SESSION_STARTUP_TIME=$(date +%s)

return 0
