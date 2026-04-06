#!/bin/bash
# Live Voice Chat with ElevenLabs TTS
# Records your voice, transcribes it, gets response, speaks it back

VOICE_SCRIPT="/home/e/.openclaw/workspace/voice-eli.py"
RECORDING="/tmp/live-input.wav"
TRANSCRIPT="/tmp/live-transcript.txt"

echo "🎙️  Live Voice Chat - ElevenLabs Edition"
echo "Press Ctrl+C to stop"
echo ""

while true; do
    echo "🎤 Listening... (speak now)"
    
    # Record 5 seconds of audio
    arecord -f cd -d 5 -q "$RECORDING" 2>/dev/null
    
    echo "📝 Transcribing..."
    
    # Transcribe using Google Speech Recognition
    TRANSCRIPT_TEXT=$(python3 -c "
import speech_recognition as sr
r = sr.Recognizer()
try:
    with sr.AudioFile('$RECORDING') as source:
        audio = r.record(source)
        text = r.recognize_google(audio)
        print(text)
except:
    print('')
" 2>/dev/null)
    
    # If empty, continue
    if [ -z "$TRANSCRIPT_TEXT" ]; then
        echo "⚠️  No speech detected, trying again..."
        continue
    fi
    
    echo "👤 You said: $TRANSCRIPT_TEXT"
    echo "$TRANSCRIPT_TEXT" > "$TRANSCRIPT"
    
    # Get response from agent (this would be handled by OpenClaw)
    echo "🤖 Processing..."
    
    # For now, just echo back with ElevenLabs voice
    # In real use, this would call the OpenClaw agent
    RESPONSE="I heard you say: $TRANSCRIPT_TEXT"
    
    echo "🔊 Speaking..."
    python3 "$VOICE_SCRIPT" "$RESPONSE"
    
    echo ""
    echo "---"
    echo ""
done
