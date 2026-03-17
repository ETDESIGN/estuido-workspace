#!/bin/bash
# Simple Voice Input for OpenClaw (No PyAudio needed)
# Uses arecord + Google Speech Recognition

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUDIO_FILE="/tmp/openclaw-voice-input.wav"
TEXT_FILE="/tmp/openclaw-voice-input.txt"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Record audio using arecord (ALSA)
record_audio() {
    local duration="${1:-5}"

    echo -e "${BLUE}🎤 Recording for ${duration} seconds...${NC}"
    echo "   Speak now!"

    # Record using arecord (16kHz, mono, CD quality)
    arecord -f cd -t wav -d "$duration" -r 16000 -c 1 "$AUDIO_FILE" 2>/dev/null

    if [ -f "$AUDIO_FILE" ] && [ -s "$AUDIO_FILE" ]; then
        echo -e "${GREEN}✅ Recording saved${NC}"
        ls -lh "$AUDIO_FILE" | awk '{print "   Size: " $5}'
    else
        echo -e "${YELLOW}⚠️  Recording failed${NC}"
        return 1
    fi
}

# Transcribe using Google Speech Recognition (via web API)
transcribe_audio() {
    echo -e "${BLUE}🔄 Transcribing...${NC}"

    # Check if file exists and has audio data
    if [ ! -f "$AUDIO_FILE" ] || [ ! -s "$AUDIO_FILE" ]; then
        echo "No audio file to transcribe"
        return 1
    fi

    # Create Python script for transcription
    cat > /tmp/transcribe_simple.py << 'EOFPYTHON'
#!/usr/bin/env python3
import sys
import json

try:
    import speech_recognition as sr
except ImportError:
    print("ERROR: speech_recognition not installed. Run: pip3 install SpeechRecognition", file=sys.stderr)
    sys.exit(1)

def transcribe(audio_file):
    r = sr.Recognizer()

    try:
        with sr.AudioFile(audio_file) as source:
            audio = r.record(source)

        # Try Google Speech Recognition (free, no API key)
        try:
            text = r.recognize_google(audio)
            return text
        except sr.UnknownValueError:
            return "[Could not understand audio]"
        except sr.RequestError as e:
            return f"[Service error: {e}]"

    except ValueError as e:
        return f"[Audio format error: {e}]"
    except Exception as e:
        return f"[Error: {e}]"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: transcribe_simple.py <audio_file>", file=sys.stderr)
        sys.exit(1)

    result = transcribe(sys.argv[1])
    print(result)
EOFPYTHON

    chmod +x /tmp/transcribe_simple.py

    # Check if speech_recognition is installed
    if ! python3 -c "import speech_recognition" 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Installing speech_recognition...${NC}"
        pip3 install --user SpeechRecognition 2>&1 | grep -v "^Requirement" || echo "Installation complete"
    fi

    # Transcribe
    python3 /tmp/transcribe_simple.py "$AUDIO_FILE" | tee "$TEXT_FILE"

    if [ -s "$TEXT_FILE" ]; then
        TEXT=$(cat "$TEXT_FILE")
        if [[ "$TEXT" == \[*\] ]]; then
            echo -e "${YELLOW}⚠️  $TEXT${NC}"
            return 1
        else
            echo -e "${GREEN}✅ Transcribed:${NC} $TEXT"
            return 0
        fi
    else
        echo -e "${YELLOW}⚠️  Transcription failed${NC}"
        return 1
    fi
}

# Main
main() {
    case "${1:-}" in
        --setup|-s)
            echo "📦 Installing dependencies..."
            pip3 install --user SpeechRecognition 2>&1 | tail -3
            echo -e "${GREEN}✅ Setup complete${NC}"
            echo ""
            echo "Usage:"
            echo "  voice-simple.sh              # Record 5 seconds"
            echo "  voice-simple.sh 10           # Record 10 seconds"
            echo "  voice-simple.sh --loop       # Continuous mode"
            ;;
        --loop|-l)
            echo -e "${BLUE}🔄 Continuous listening (Ctrl+C to stop)${NC}"
            echo ""
            while true; do
                record_audio 5
                transcribe_audio
                echo ""
                sleep 1
            done
            ;;
        --help|-h)
            echo "Simple Voice Input for OpenClaw"
            echo ""
            echo "Usage:"
            echo "  voice-simple.sh [seconds]     # Record and transcribe"
            echo "  voice-simple.sh --setup       # Install dependencies"
            echo "  voice-simple.sh --loop        # Continuous mode"
            ;;
        "")
            # Default: 5 seconds
            record_audio 5
            transcribe_audio
            echo ""
            echo "💾 Text saved to: $TEXT_FILE"
            ;;
        *)
            # Custom duration
            record_audio "$1"
            transcribe_audio
            echo ""
            echo "💾 Text saved to: $TEXT_FILE"
            ;;
    esac
}

main "$@"
