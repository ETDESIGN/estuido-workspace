#!/bin/bash
# Live Voice Conversation with OpenClaw
# One turn at a time: Listen → Transcribe → Response → Speak

SCRIPT_DIR="/home/e/.openclaw/workspace"
VOICE_INPUT="$SCRIPT_DIR/voice-simple.sh"
VOICE_OUTPUT="edge-say"

echo "╔════════════════════════════════════════╗"
echo "║   OpenClaw Voice Chat (One-Turn)      ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "🎤 I'll listen for 5 seconds, then respond"
echo "   Speak clearly and naturally"
echo ""
echo "Starting in..."
echo "   3..."
sleep 1
echo "   2..."
sleep 1
echo "   1..."
sleep 1
echo "   🎙️ SPEAK NOW!"

# Record and transcribe
OUTPUT=$(bash "$VOICE_INPUT" 2>&1)

# Extract transcribed text
USER_TEXT=$(echo "$OUTPUT" | grep "Transcribed:" | sed 's/.*Transcribed: //')

if [ -z "$USER_TEXT" ]; then
    echo ""
    echo "⚠️  Didn't catch that. Try again?"
    echo "   - Speak closer to microphone"
    echo "   - Reduce background noise"
    echo "   - Speak clearly"
    exit 1
fi

echo ""
echo "✅ Transcribed"
echo "👤 You: $USER_TEXT"
echo ""
echo "🤖 OpenClaw is responding..."
echo ""

# Save to file for reference
echo "$USER_TEXT" > /tmp/voice-input.txt

# Get response from OpenClaw
# For now, echo the text back (you can integrate with gateway)
RESPONSE="I heard you say: $USER_TEXT"

echo "🔊 $RESPONSE"
echo ""
echo "$RESPONSE" | $VOICE_OUTPUT

echo ""
echo "💾 Saved to: /tmp/voice-input.txt"
echo ""
echo "Run again for another turn!"
