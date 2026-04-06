#!/bin/bash
# Live Voice Conversation with OpenClaw
# Full duplex: speak → transcribe → agent response → speak back

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VOICE_INPUT="$SCRIPT_DIR/voice-input.sh"
VOICE_OUTPUT="$SCRIPT_DIR/linux-voice.sh"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   OpenClaw Live Voice Conversation    ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
    echo ""
}

# Check if setup is needed
check_setup() {
    if [ ! -d "$SCRIPT_DIR/.voice-venv" ]; then
        echo "🔧 First-time setup required..."
        bash "$VOICE_INPUT" --setup
        echo ""
    fi
}

# Single turn: listen → transcribe → respond
conversation_turn() {
    echo -e "${GREEN}🎤 Listening...${NC} (5 seconds)"
    echo "   Speak now!"

    # Record and transcribe
    TEXT=$(bash "$VOICE_INPUT" 2>/dev/null | grep "✅ Transcribed:" | sed 's/✅ Transcribed: //')

    if [ -z "$TEXT" ]; then
        echo -e "${YELLOW}⚠️  Didn't catch that. Try again?${NC}"
        return 1
    fi

    echo ""
    echo -e "${BLUE}👤 You:${NC} $TEXT"
    echo ""

    # Get response from OpenClaw (placeholder - you'd integrate with your agent)
    # For now, just echo back
    RESPONSE="I heard: $TEXT"

    echo -e "${GREEN}🤖 OpenClaw:${NC} $RESPONSE"
    echo ""

    # Speak response
    echo "🔊 Speaking..."
    echo "$RESPONSE" | edge-say

    return 0
}

# Continuous conversation mode
live_conversation() {
    print_header
    echo "🎙️  Live voice chat started"
    echo "   Speak naturally, I'll transcribe and respond"
    echo "   Press Ctrl+C to stop"
    echo ""
    sleep 2

    while true; do
        conversation_turn
        echo ""
        echo "---"
        echo ""
        sleep 1
    done
}

# Main
main() {
    case "${1:-}" in
        --once|-o)
            check_setup
            conversation_turn
            ;;
        --live|-l)
            check_setup
            live_conversation
            ;;
        --setup|-s)
            bash "$VOICE_INPUT" --setup
            ;;
        --help|-h)
            echo "OpenClaw Live Voice Conversation"
            echo ""
            echo "Usage:"
            echo "  voice-conversation             # One turn (listen + speak)"
            echo "  voice-conversation --live      # Continuous conversation"
            echo "  voice-conversation --setup     # Install dependencies"
            echo ""
            echo "Examples:"
            echo "  voice-conversation --once"
            echo "  voice-conversation --live"
            ;;
        "")
            check_setup
            live_conversation
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage"
            exit 1
            ;;
    esac
}

main "$@"
