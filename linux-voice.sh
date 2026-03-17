#!/bin/bash
# Linux Voice Message Solution for OpenClaw
# Text-to-Speech workaround for Linux systems

# Check for available TTS engines
check_tts() {
    if command -v spd-say &> /dev/null; then
        echo "spd-say"
    elif command -v espeak &> /dev/null; then
        echo "espeak"
    elif command -v espeak-ng &> /dev/null; then
        echo "espeak-ng"
    else
        echo "none"
    fi
}

# Check for available audio players
check_player() {
    if command -v paplay &> /dev/null; then
        echo "paplay"
    elif command -v aplay &> /dev/null; then
        echo "aplay"
    else
        echo "none"
    fi
}

# Main TTS function
speak() {
    local text="$1"
    local tts_engine=$(check_tts)
    local player=$(check_player)

    case "$tts_engine" in
        spd-say)
            spd-say "$text"
            ;;
        espeak|espeak-ng)
            "$tts_engine" -v en-us "$text"
            ;;
        none)
            echo "❌ No TTS engine found. Install espeak or speech-dispatcher:"
            echo "   sudo apt install espeak-ng speech-dispatcher"
            return 1
            ;;
    esac
}

# Main function
main() {
    case "$1" in
        --check|-c)
            echo "=== Linux Voice Support Check ==="
            echo ""
            echo "TTS Engine: $(check_tts)"
            echo "Audio Player: $(check_player)"
            echo ""
            if [ "$(check_tts)" != "none" ]; then
                echo "✅ Voice messaging is supported"
                echo ""
                echo "Usage:"
                echo "  linux-voice 'Hello, this is a test'"
                echo "  echo 'Hi there' | linux-voice"
            else
                echo "❌ No TTS engine found"
                echo ""
                echo "Install TTS:"
                echo "  sudo apt install espeak-ng speech-dispatcher"
            fi
            ;;
        --help|-h)
            echo "Linux Voice Messaging for OpenClaw"
            echo ""
            echo "Usage:"
            echo "  linux-voice 'Your text here'"
            echo "  echo 'Text' | linux-voice"
            echo "  linux-voice --check"
            echo ""
            echo "Examples:"
            echo "  linux-voice 'Hello from OpenClaw'"
            echo "  linux-voice 'Task completed successfully'"
            ;;
        "")
            # Read from stdin if no argument
            while IFS= read -r line; do
                speak "$line"
            done
            ;;
        *)
            speak "$*"
            ;;
    esac
}

main "$@"
