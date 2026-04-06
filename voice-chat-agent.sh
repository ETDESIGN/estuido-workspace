#!/bin/bash
# Live Voice Chat - 5 Minute Session
echo "🎙️ Starting 5-minute voice chat session..."
echo ""
echo "Speak into your microphone. I'll transcribe and respond."
echo "Press Ctrl+C to stop early."
echo ""

TURN=0
while [ $TURN -lt 60 ]; do  # Max 60 turns (5 min at 5 sec each)
    TURN=$((TURN + 1))
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Turn #$TURN"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    echo "🎤 Recording 5 seconds..."
    arecord -f cd -d 5 -q /tmp/live-input.wav 2>/dev/null
    
    echo "📝 Transcribing..."
    
    TRANSCRIPT=$(python3 -c "
import speech_recognition as sr
r = sr.Recognizer()
try:
    with sr.AudioFile('/tmp/live-input.wav') as source:
        text = r.recognize_google(r.record(source))
        print(text)
except: print('')
" 2>/dev/null)
    
    if [ -z "$TRANSCRIPT" ]; then
        echo "⚠️  No speech detected. Trying again..."
        continue
    fi
    
    echo "👤 You: $TRANSCRIPT"
    echo ""
    echo "🤖 Processing your request..."
    echo ""
    
    # The agent will respond naturally in this chat
    # I'm just the transcriber
    
    sleep 3
    echo ""
done
