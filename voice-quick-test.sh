#!/bin/bash
# Simple Voice Test - Direct approach

echo "🎤 Voice Input - Simplified"
echo "==============================="
echo ""
echo "Testing microphone access..."
echo ""

# Check microphone
echo "Available microphones:"
arecord -l | grep "card [0-9]"
echo ""

# Test recording to a temp file
TEMP_WAV="/tmp/quick-voice-$$.wav"

echo "🎙️ Recording 5 seconds..."
echo "   (Count down: 3...2...1...SPEAK!)"
echo ""

# Simple recording without fancy parameters
timeout 6 arecord -f cd -d 5 -t wav $TEMP_WAV 2>/dev/null

if [ -f "$TEMP_WAV" ]; then
    SIZE=$(ls -lh "$TEMP_WAV" | awk '{print $5}')
    echo "✅ Recorded: $SIZE"
    echo ""
    
    # Try to play it back
    echo "🔊 Playing back..."
    if aplay $TEMP_WAV 2>/dev/null; then
        echo "✅ Audio playback successful"
    else
        echo "⚠️  Could not play back"
    fi
    
    echo ""
    echo "File: $TEMP_WAV"
    echo ""
    echo "Next: Transcribe with:"
    echo "  python3 -c 'import speech_recognition as sr; r = sr.Recognizer(); print(r.recognize_google(sr.AudioFile(\"$TEMP_WAV\")))'"
else
    echo "❌ Recording failed"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check if microphone is in use by another app"
    echo "  2. Test with: arecord -f cd -d 3 test.wav && aplay test.wav"
    echo "  3. Check system microphone settings"
fi
