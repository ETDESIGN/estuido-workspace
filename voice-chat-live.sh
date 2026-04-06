#!/bin/bash
# Live Voice Chat with ElevenLabs TTS
# Records your voice → Transcribes → Gets response → Speaks back

VOICE_SCRIPT="/home/e/.openclaw/workspace/voice-eli.py"
RECORDING="/tmp/live-input.wav"

echo "🎙️  Live Voice Chat - ElevenLabs Edition"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📌 Instructions:"
echo "  • Speak clearly during the 5-second recording"
echo "  • Wait for transcription and response"
echo "  • Press Ctrl+C to stop"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check microphone
if ! arecord -l >/dev/null 2>&1; then
    echo "❌ Error: No microphone found"
    echo "   Check: arecord -l"
    exit 1
fi

while true; do
    echo "🎤 [Recording 5 seconds - Speak now!]"
    
    # Record with visual indicator
    arecord -f cd -d 5 -q "$RECORDING" 2>/dev/null &
    RECORD_PID=$!
    
    # Simple countdown
    for i in 5 4 3 2 1; do
        echo -ne "\r   $i... "
        sleep 1
    done
    echo -ne "\r   ✓ Done!    "
    echo ""
    
    # Wait for recording to finish
    wait $RECORD_PID 2>/dev/null
    
    echo "📝 Transcribing..."
    
    # Transcribe using Google Speech Recognition
    TRANSCRIPT_TEXT=$(python3 -c "
import speech_recognition as sr
import sys
r = sr.Recognizer()
try:
    with sr.AudioFile('$RECORDING') as source:
        audio = r.record(source)
        text = r.recognize_google(audio)
        print(text)
except sr.UnknownValueError:
    print('')
except sr.RequestError as e:
    print(f'[Error: {e}]', file=sys.stderr)
    print('')
except Exception as e:
    print(f'[Error: {e}]', file=sys.stderr)
    print('')
" 2>&1)
    
    # Check for errors in transcript
    if echo "$TRANSCRIPT_TEXT" | grep -q "\[Error:"; then
        echo "❌ Transcription failed: $TRANSCRIPT_TEXT"
        echo "   Check your internet connection (Google STT)"
        sleep 2
        continue
    fi
    
    # If empty, try again
    if [ -z "$TRANSCRIPT_TEXT" ]; then
        echo "⚠️  No speech detected. Try again..."
        echo ""
        continue
    fi
    
    echo "👤 You: $TRANSCRIPT_TEXT"
    echo ""
    
    # This is where OpenClaw agent would be called
    # For now, using a simple echo response
    echo "🤖 Processing..."
    
    # Simple response (in production, this calls OpenClaw agent)
    RESPONSE="I heard you say: $TRANSCRIPT_TEXT"
    
    # Speak the response using ElevenLabs
    echo "🔊 Response: $RESPONSE"
    python3 "$VOICE_SCRIPT" "$RESPONSE" 2>/dev/null
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
done
