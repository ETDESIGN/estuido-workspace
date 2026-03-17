#!/bin/bash
# Voice Test with Playback Verification

echo "🎤 Microphone Test & Voice Input"
echo "================================="
echo ""
echo "This will:"
echo "  1. Record your voice (5 seconds)"
echo "  2. Play it back for you to hear"
echo "  3. Transcribe if audio is clear"
echo ""
echo "📍 Position yourself 15-20cm from microphone"
echo "🔇 Reduce background noise if possible"
echo ""
read -p "Press Enter when ready..."

TEMP_WAV="/tmp/voice-verify-$$.wav"

echo ""
echo "🎙️ RECORDING STARTED - Speak now!"
echo ""

# Record
arecord -f cd -d 5 -r 16000 -c 1 -t wav "$TEMP_WAV" 2>/dev/null

echo ""
echo "✅ Recording complete!"
echo ""

# Check file size
SIZE=$(ls -lh "$TEMP_WAV" 2>/dev/null | awk '{print $5}')
echo "📁 File size: $SIZE"

if [ "$SIZE" == "0" ]; then
    echo "❌ No audio recorded!"
    exit 1
fi

echo ""
echo "🔊 Playing back your recording..."
echo "   (This lets you verify the microphone picked up your voice)"
echo ""

aplay "$TEMP_WAV" 2>/dev/null

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Could you hear your voice clearly? (y/n): " heard

if [ "$heard" = "y" ]; then
    echo ""
    echo "✅ Good! Attempting transcription..."
    echo ""
    
    python3 << EOF
import speech_recognition as sr

r = sr.Recognizer()

try:
    with sr.AudioFile("$TEMP_WAV") as source:
        print("🔄 Transcribing...")
        r.energy_threshold = 300
        r.adjust_for_ambient_noise(source, duration=0.5)
        audio = r.record(source)
    
    text = r.recognize_google(audio)
    
    print("\n" + "="*60)
    print("✅ TRANSCRIPTION SUCCESS!")
    print("="*60)
    print(f"\n👤 You said:")
    print(f"   \"{text}\"")
    print("\n" + "="*60)
    
    with open("/tmp/voice-transcript.txt", "w") as f:
        f.write(text)
    
    import subprocess
    response = f"I heard: {text}"
    print(f"\n🔊 {response}")
    subprocess.run(['spd-say', response])
    
except sr.UnknownValueError:
    print("\n⚠️  Audio detected but unclear")
    print("   The microphone is working, but:")
    print("   - Try speaking closer to it")
    print("   - Speak more clearly")
    print("   - Reduce background noise further")
except sr.RequestError as e:
    print(f"\n⚠️  Service error: {e}")
except Exception as e:
    print(f"\n❌ Error: {e}")
EOF

else
    echo ""
    echo "❌ Microphone issues detected"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check microphone is not muted"
    echo "  2. Test with: arecord -d 3 test.wav && aplay test.wav"
    echo "  3. Check system sound settings"
    echo "  4. Try a different microphone"
fi

# Cleanup
rm -f "$TEMP_WAV"

echo ""
echo "💾 Last transcript: /tmp/voice-transcript.txt"
echo ""
echo "Run again: bash /home/e/.openclaw/workspace/voice-verify.sh"
