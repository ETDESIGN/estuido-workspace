#!/bin/bash
# Voice Input for OpenClaw - Linux Speech-to-Text
# Records audio and transcribes to text

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.voice-venv"
AUDIO_FILE="/tmp/openclaw-voice-input.wav"
TEXT_FILE="/tmp/openclaw-voice-input.txt"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check dependencies
check_deps() {
    echo "🔍 Checking dependencies..."

    # Check for Python
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}❌ Python 3 not found${NC}"
        exit 1
    fi

    # Check for audio recording
    if ! command -v arecord &> /dev/null; then
        echo -e "${RED}❌ arecord not found. Install: sudo apt install alsa-utils${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ Dependencies OK${NC}"
}

# Setup Python virtual environment
setup_venv() {
    if [ ! -d "$VENV_DIR" ]; then
        echo "📦 Setting up voice input environment..."
        python3 -m venv "$VENV_DIR"
        source "$VENV_DIR/bin/activate"
        pip install --quiet SpeechRecognition pyaudio
        echo -e "${GREEN}✅ Voice input environment ready${NC}"
    fi
}

# Record audio
record_audio() {
    local duration="${1:-5}"  # Default 5 seconds
    echo "🎤 Recording for ${duration} seconds..."
    echo "   Speak now!"

    # Record audio
    arecord -f cd -t wav -d "$duration" -r 16000 "$AUDIO_FILE" 2>/dev/null

    if [ -f "$AUDIO_FILE" ]; then
        echo -e "${GREEN}✅ Recording saved${NC}"
        ls -lh "$AUDIO_FILE" | awk '{print "   Size: " $5}'
    else
        echo -e "${RED}❌ Recording failed${NC}"
        exit 1
    fi
}

# Transcribe audio
transcribe() {
    echo "🔄 Transcribing..."
    source "$VENV_DIR/bin/activate"

    # Create Python script for transcription
    cat > /tmp/transcribe.py << 'EOFPYTHON'
import sys
import speech_recognition as sr

def transcribe_audio(audio_file):
    r = sr.Recognizer()

    with sr.AudioFile(audio_file) as source:
        audio = r.record(source)

    try:
        # Try Google Speech Recognition (free, no API key)
        text = r.recognize_google(audio)
        print(text)
        return text
    except sr.UnknownValueError:
        print("[Could not understand audio]", file=sys.stderr)
        return None
    except sr.RequestError as e:
        print(f"[Service error: {e}]", file=sys.stderr)
        return None
    except Exception as e:
        print(f"[Error: {e}]", file=sys.stderr)
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: transcribe.py <audio_file>", file=sys.stderr)
        sys.exit(1)

    result = transcribe_audio(sys.argv[1])
    sys.exit(0 if result else 1)
EOFPYTHON

    # Run transcription
    python3 /tmp/transcribe.py "$AUDIO_FILE" > "$TEXT_FILE" 2>&1

    if [ -s "$TEXT_FILE" ]; then
        TEXT=$(cat "$TEXT_FILE")
        echo -e "${GREEN}✅ Transcribed:${NC} $TEXT"
        echo "$TEXT" > "$TEXT_FILE"
    else
        echo -e "${YELLOW}⚠️  Transcription failed or empty${NC}"
        return 1
    fi
}

# Main function
main() {
    case "$1" in
        --setup|-s)
            check_deps
            setup_venv
            echo ""
            echo "✨ Voice input ready!"
            echo ""
            echo "Usage:"
            echo "  voice-input                    # Record 5 seconds"
            echo "  voice-input 10                # Record 10 seconds"
            echo "  voice-input --loop            # Continuous mode"
            ;;
        --loop|-l)
            echo "🔄 Continuous voice input mode"
            echo "   Press Ctrl+C to stop"
            echo ""
            while true; do
                record_audio 5
                transcribe
                echo ""
                sleep 1
            done
            ;;
        --help|-h)
            echo "Voice Input for OpenClaw"
            echo ""
            echo "Usage:"
            echo "  voice-input [seconds]         # Record and transcribe"
            echo "  voice-input --setup          # Install dependencies"
            echo "  voice-input --loop           # Continuous mode"
            echo ""
            echo "Examples:"
            echo "  voice-input                  # Record 5 seconds"
            echo "  voice-input 10               # Record 10 seconds"
            echo "  voice-input --loop           # Keep listening"
            ;;
        "")
            # Default: record 5 seconds
            check_deps
            setup_venv
            echo ""
            record_audio 5
            transcribe
            echo ""
            echo "💾 Text saved to: $TEXT_FILE"
            ;;
        *)
            # Custom duration
            check_deps
            setup_venv
            echo ""
            record_audio "$1"
            transcribe
            echo ""
            echo "💾 Text saved to: $TEXT_FILE"
            ;;
    esac
}

main "$@"
