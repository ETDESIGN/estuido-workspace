#!/bin/bash
# Voice Chat with Better Timing

echo "╔════════════════════════════════════════╗"
echo "║       OpenClaw Voice Chat v2          ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "Instructions:"
echo "  1. Get close to your microphone"
echo "  2. Reduce background noise (TV, music)"
echo "  3. Speak clearly and naturally"
echo ""

TEMP_WAV="/tmp/voice-chat-$$.wav"

echo "🎤 Preparing to record..."
echo ""
sleep 2
echo "   5..."
sleep 1
echo "   4..."
sleep 1
echo "   3..."
sleep 1
echo "   2..."
sleep 1
echo "   1..."
sleep 1
echo "   🎙️🎙️🎙️ SPEAK NOW! 🎙️🎙️🎙️"
echo ""

# Record with better parameters
arecord -f cd -d 6 -r 16000 -c 1 -t wav "$TEMP_WAV" 2>/dev/null

echo ""
echo "✅ Recording complete!"
echo ""

# Check file size
SIZE=$(ls -lh "$TEMP_WAV" 2>/dev/null | awk '{print $5}')
if [ -z "$SIZE" ]; then
    echo "❌ Recording failed"
    exit 1
fi

echo "📁 File size: $SIZE"
echo ""

# Quick check if there's audio data
DURATION=$(ffprobe -i "$TEMP_WAV" 2>&1 | grep Duration | awk '{print $2}' | sed 's/,//')
echo "⏱️  Duration: $DURATION"
echo ""

echo "🔄 Transcribing..."
echo ""

python3 << EOF
import speech_recognition as sr
import subprocess
import os

wav_file = "$TEMP_WAV"

if not os.path.exists(wav_file):
    print("❌ Audio file not found")
    exit(1)

r = sr.Recognizer()

try:
    with sr.AudioFile(wav_file) as source:
        print("🔍 Processing with Google Speech Recognition...")
        print("   (This requires internet connection)")
        print("")
        
        r.energy_threshold = 300
        r.dynamic_energy_threshold = True
        r.adjust_for_ambient_noise(source, duration=0.5)
        audio = r.record(source)
    
    print("🎤 Analyzing speech patterns...")
    text = r.recognize_google(audio)
    
    print("")
    print("="*60)
    print("✅ SUCCESS!")
    print("="*60)
    print(f"\n👤 You said:")
    print(f"   \"{text}\"")
    print("\n" + "="*60)
    
    # Save transcript
    with open("/tmp/voice-transcript.txt", "w") as f:
        f.write(text)
    
    print(f"\n💾 Saved to: /tmp/voice-transcript.txt")
    
    # Smart response
    text_lower = text.lower()
    
    if any(word in text_lower for word in ["hello", "hi", "hey"]):
        response = "Hello there! How can I help you?"
    elif "time" in text_lower:
        from datetime import datetime
        response = f"The time is {datetime.now().strftime('%I:%M %p')}"
    elif "weather" in text_lower:
        response = "I'd be happy to check the weather. Which location?"
    elif "thank" in text_lower:
        response = "You're welcome! Is there anything else?"
    elif "stop" in text_lower or "exit" in text_lower:
        response = "Goodbye!"
    else:
        response = f"I heard: {text}"
    
    print(f"\n🤖 Response: {response}")
    print(f"\n🔊 Speaking response...")
    
    result = subprocess.run(['edge-say', response], capture_output=True)
    
    if result.returncode == 0:
        print("\n✅ Voice chat completed!")
        print("\n💡 Tips for next time:")
        print("   - Speak 15-20cm from microphone")
        print("   - Use a quiet environment")
        print("   - Speak at normal volume")
        print("   - Avoid background noise")
    else:
        print("\n⚠️  Speech synthesis issue")
    
except sr.UnknownValueError:
    print("")
    print("="*60)
    print("⚠️  Could Not Understand Audio")
    print("="*60)
    print("\nPossible reasons:")
    print("  ❌ No speech detected (was the room quiet?)")
    print("  ❌ Too far from microphone")
    print("  ❌ Background noise (TV, music, fans)")
    print("  ❌ Whispering or speaking too quietly")
    print("\n💡 Try again:")
    print("   - Move closer to microphone")
    print("   - Reduce background noise")
    print("   - Speak clearly at normal volume")
    print("   - Ensure microphone is selected in system settings")
    
except sr.RequestError as e:
    print(f"\n⚠️  Service error: {e}")
    print("   Check your internet connection")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()

finally:
    # Cleanup
    if os.path.exists(wav_file):
        os.remove(wav_file)
EOF

echo ""
echo "📁 Audio file cleaned up"
echo ""
echo "Run again for another voice chat!"
