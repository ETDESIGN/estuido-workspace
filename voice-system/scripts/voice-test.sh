#!/bin/bash
# Voice Input with Test Mode
# Records audio, lets you play it back, then transcribes

AUDIO_FILE="/tmp/voice-test.wav"

record_and_test() {
    local duration="${1:-5}"

    echo "🎤 Recording for ${duration} seconds..."
    echo "   Speak clearly into your microphone"
    echo ""

    # Record
    arecord -f cd -t wav -d "$duration" -r 16000 -c 1 "$AUDIO_FILE" 2>/dev/null

    if [ ! -f "$AUDIO_FILE" ]; then
        echo "❌ Recording failed"
        return 1
    fi

    echo ""
    echo "✅ Recording complete"
    echo "   File: $AUDIO_FILE"
    ls -lh "$AUDIO_FILE" | awk '{print "   Size: " $5}'
    echo ""

    # Option to play back
    echo "🔊 Play back recording to check quality?"
    read -p "   Press Enter to play, or 'n' to skip: " choice

    if [ "$choice" != "n" ]; then
        aplay "$AUDIO_FILE" 2>/dev/null
        echo ""
    fi

    # Transcribe
    echo "🔄 Transcribing..."

    python3 << EOF
import speech_recognition as sr
import sys

r = sr.Recognizer()

try:
    with sr.AudioFile("$AUDIO_FILE") as source:
        # Adjust for ambient noise
        r.adjust_for_ambient_noise(source, duration=0.5)
        audio = r.record(source)

    print("🎤 Processing audio...")

    try:
        # Try Google Speech Recognition
        text = r.recognize_google(audio)
        print(f"✅ Transcribed: {text}")
        with open("/tmp/voice-text.txt", "w") as f:
            f.write(text)
    except sr.UnknownValueError:
        print("⚠️  Could not understand audio")
        print("   Tips:")
        print("   - Speak closer to microphone")
        print("   - Reduce background noise")
        print("   - Speak more clearly")
        sys.exit(1)
    except sr.RequestError as e:
        print(f"⚠️  Service error: {e}")
        print("   Check your internet connection")
        sys.exit(1)

except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
EOF
}

# Interactive menu
echo "╔════════════════════════════════════════╗"
echo "║   Voice Input Test & Transcribe       ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "Options:"
echo "  1) Quick test (5 seconds)"
echo "  2) Longer recording (10 seconds)"
echo "  3) Custom duration"
echo "  4) Just record (no transcription)"
echo ""
read -p "Choose option (1-4): " option

case "$option" in
    1)
        record_and_test 5
        ;;
    2)
        record_and_test 10
        ;;
    3)
        read -p "Enter duration (seconds): " duration
        record_and_test "$duration"
        ;;
    4)
        read -p "Enter duration (seconds): " duration
        arecord -f cd -t wav -d "$duration" -r 16000 -c 1 "$AUDIO_FILE"
        echo "✅ Recorded to: $AUDIO_FILE"
        echo "   Play with: aplay $AUDIO_FILE"
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

if [ -f "/tmp/voice-text.txt" ]; then
    echo ""
    echo "💾 Text saved to: /tmp/voice-text.txt"
    echo ""
    echo "Quick copy command:"
    echo "  cat /tmp/voice-text.txt"
fi
