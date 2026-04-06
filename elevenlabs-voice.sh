#!/bin/bash
# ElevenLabs Text-to-Speech Wrapper
# Natural voice output using ElevenLabs API
# Usage: elevenlabs-voice.sh "Your text here"

API_KEY="sk_9cdaf9671455cac113ee30cbe6441b5f252368616313b4e2"
VOICE_ID="21m00Tcm4TlvDq8ikWAM"  # Rachel (default voice)
MODEL_ID="eleven_multilingual_v2"
OUTPUT_FILE="/tmp/elevenlabs-output.mp3"

# Parse arguments
TEXT="$*"
VOICE="${ELEVENLABS_VOICE:-$VOICE_ID}"
MODEL="${ELEVENLABS_MODEL:-$MODEL_ID}"

# Help
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "ElevenLabs Text-to-Speech"
    echo ""
    echo "Usage: elevenlabs-voice.sh \"Your text here\""
    echo ""
    echo "Options:"
    echo "  --list-voices    List available voices"
    echo "  --voice ID       Use specific voice ID"
    echo "  --model ID       Use specific model ID"
    echo "  --save FILE      Save to file instead of playing"
    echo "  --help           Show this help"
    echo ""
    echo "Environment Variables:"
    echo "  ELEVENLABS_VOICE  Default voice ID"
    echo "  ELEVENLABS_MODEL  Default model ID"
    echo ""
    echo "Examples:"
    echo "  elevenlabs-voice.sh \"Hello world\""
    echo "  ELEVENLABS_VOICE=azf19ykDx5oIgvQ4RB9v elevenlabs-voice.sh \"Bonjour\""
    echo ""
    exit 0
fi

# List voices
if [ "$1" = "--list-voices" ]; then
    echo "Available ElevenLabs voices:"
    curl -s "https://api.elevenlabs.io/v1/voices" -H "xi-api-key: $API_KEY" | \
        jq -r '.voices[] | "\(.voice_id) | \(.name) | \(.labels.gender // "N/A") | \(.labels.accent // "N/A")"' | \
        column -t -s "|"
    exit 0
fi

# Check for text
if [ -z "$TEXT" ]; then
    echo "Error: No text provided"
    echo "Usage: elevenlabs-voice.sh \"Your text here\""
    exit 1
fi

# Generate speech
echo "🔊 Generating speech..."

RESPONSE=$(curl -s "https://api.elevenlabs.io/v1/text-to-speech/$VOICE" \
    -H "Content-Type: application/json" \
    -H "xi-api-key: $API_KEY" \
    -H "Accept: audio/mpeg" \
    -d "{
        \"text\": \"$TEXT\",
        \"model_id\": \"$MODEL\",
        \"voice_settings\": {
            \"stability\": 0.5,
            \"similarity_boost\": 0.75
        }
    }" \
    -o "$OUTPUT_FILE" \
    -w "%{http_code}")

# Check for errors
if [ "$RESPONSE" != "200" ]; then
    echo "Error: ElevenLabs API returned HTTP $RESPONSE"
    echo "Check your API key and voice ID"
    exit 1
fi

# Play audio
if command -v paplay >/dev/null 2>&1; then
    paplay "$OUTPUT_FILE"
elif command -v aplay >/dev/null 2>&1; then
    aplay "$OUTPUT_FILE"
elif command -v ffplay >/dev/null 2>&1; then
    ffplay -autoexit -nodisp "$OUTPUT_FILE" 2>/dev/null
else
    echo "Error: No audio player found (paplay, aplay, ffplay)"
    echo "Audio saved to: $OUTPUT_FILE"
    exit 1
fi

# Cleanup
rm -f "$OUTPUT_FILE"
