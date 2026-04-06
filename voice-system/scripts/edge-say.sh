#!/bin/bash
# edge-say: Drop-in replacement for spd-say using Microsoft Edge TTS
# Supports Chinese + English, natural-sounding voices
# Usage: edge-say [options] "text to speak"
#   -v <voice>    Voice name (default: zh-CN-YunxiNeural)
#   -r <rate>     Speech rate -100 to +100 (default: 0)
#   -p <pitch>    Pitch -100 to +100 (default: 0)
#   --en          Use English voice (en-US-AndrewMultilingualNeural)
#   --zh          Use Chinese voice (default)
#   --female      Use female voice
#   --male        Use male voice (default)

set -e

VOICE="zh-CN-YunxiNeural"
RATE="+0%"
PITCH="+0Hz"
TEXT=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        -v|--voice)
            VOICE="$2"
            shift 2
            ;;
        -r|--rate)
            RATE="${2:+$2%}"
            RATE="${RATE:-+0%}"
            shift 2
            ;;
        -p|--pitch)
            PITCH="${2:+$2Hz}"
            PITCH="${PITCH:-+0Hz}"
            shift 2
            ;;
        --en)
            VOICE="en-US-AndrewMultilingualNeural"
            shift
            ;;
        --zh)
            VOICE="zh-CN-YunxiNeural"
            shift
            ;;
        --female)
            # Detect language from current voice and switch to female
            if [[ "$VOICE" == *"zh"* ]]; then
                VOICE="zh-CN-XiaoyiNeural"
            else
                VOICE="en-US-AriaNeural"
            fi
            shift
            ;;
        --male)
            if [[ "$VOICE" == *"zh"* ]]; then
                VOICE="zh-CN-YunxiNeural"
            else
                VOICE="en-US-AndrewMultilingualNeural"
            fi
            shift
            ;;
        --list)
            echo "Available voices:"
            echo ""
            echo "  Chinese (Male):    zh-CN-YunxiNeural (default)"
            echo "  Chinese (Female):  zh-CN-XiaoyiNeural"
            echo "  Chinese (Female):  zh-CN-XiaoxiaoNeural"
            echo "  Chinese (Narrator):zh-CN-YunjianNeural"
            echo ""
            echo "  English (Male):    en-US-AndrewMultilingualNeural"
            echo "  English (Female):  en-US-AriaNeural"
            echo "  English (Female):  en-US-JennyNeural"
            echo ""
            echo "  Japanese (Male):   ja-JP-KeitaNeural"
            echo "  Japanese (Female): ja-JP-NanamiNeural"
            echo ""
            echo "Usage: edge-say [--en|--zh|--female|--male] \"text\""
            return 0 2>/dev/null || exit 0
            ;;
        --help|-h)
            echo "edge-say: Natural-sounding TTS using Microsoft Edge TTS"
            echo ""
            echo "Usage: edge-say [options] \"text to speak\""
            echo "  or:   echo text | edge-say"
            echo ""
            echo "Options:"
            echo "  --en           English voice"
            echo "  --zh           Chinese voice (default)"
            echo "  --female       Female voice"
            echo "  --male         Male voice (default)"
            echo "  --list         List available voices"
            echo "  -v <voice>     Custom voice name"
            echo "  -r <rate>      Speech rate (-100 to +100)"
            echo "  -p <pitch>     Pitch (-100 to +100)"
            echo ""
            echo "Examples:"
            echo '  edge-say "Hello world"'
            echo '  edge-say --en "Good morning"'
            echo '  edge-say --female "你好呀"'
            echo '  echo "test" | edge-say'
            return 0 2>/dev/null || exit 0
            ;;
        -*)
            # Skip unknown flags (compatibility with spd-say)
            shift
            ;;
        *)
            TEXT="$1"
            shift
            ;;
    esac
done

# If no text from args, read from stdin
if [ -z "$TEXT" ]; then
    if [ ! -t 0 ]; then
        TEXT=$(cat)
    else
        echo "Usage: edge-say [options] \"text\"  or: echo text | edge-say"
        return 1 2>/dev/null || exit 1
    fi
fi

# Strip markdown/formatting that would sound weird when spoken
TEXT=$(echo "$TEXT" | \
    sed 's/\*\*//g' | \
    sed 's/\*//g' | \
    sed 's/`//g' | \
    sed 's/##//g' | \
    sed 's/#//g' | \
    sed 's/\[.*\](.*)//g' | \
    sed 's/---//g' | \
    sed 's/```[a-z]*//g' | \
    sed 's/```//g' | \
    sed 's/├\|└\|│\|─//g' | \
    sed 's/✅\|❌\|⚠️\|🔍\|💬\|🤖\|👤\|🔊\|📁\|💾\|📝\|🎯\|⏰\|📌//g' | \
    tr -s ' \n' ' ')

# Skip if text is empty
if [ -z "${TEXT// /}" ]; then
    return 0 2>/dev/null || exit 0
fi

# Generate and play
AUDIO_FILE="/tmp/edge-say-$$.mp3"

edge-tts \
    --text "$TEXT" \
    --voice "$VOICE" \
    --rate="$RATE" \
    --pitch="$PITCH" \
    --write-media "$AUDIO_FILE" 2>/dev/null

if [ -f "$AUDIO_FILE" ] && [ -s "$AUDIO_FILE" ]; then
    ffplay -nodisp -autoexit -loglevel quiet "$AUDIO_FILE" 2>/dev/null
    rm -f "$AUDIO_FILE"
else
    # Fallback to spd-say if edge-tts fails (e.g. no internet)
    echo "$TEXT" | spd-say 2>/dev/null || true
    rm -f "$AUDIO_FILE"
fi

return 0 2>/dev/null || exit 0
