#!/bin/bash
# OpenClaw Agent Voice Integration
# Send voice input to OpenClaw agents

SCRIPT_DIR="/home/e/.openclaw/workspace"
GATEWAY_URL="http://localhost:18789"

echo "🤖 OpenClaw Agent Voice Integration"
echo "===================================="
echo ""
echo "Available agents:"
echo "  1. main (Dereck - General Manager)"
echo "  2. cto (Lead Developer)"
echo "  3. qa (QA Engineer)"
echo ""
read -p "Select agent (1-3): " agent_choice

case "$agent_choice" in
    1) AGENT="main"; AGENT_NAME="Dereck";;
    2) AGENT="cto"; AGENT_NAME="CTO";;
    3) AGENT="qa"; AGENT_NAME="QA";;
    *) echo "Invalid choice"; exit 1;;
esac

echo ""
echo "🎤 Recording voice for $AGENT_NAME..."
echo "   Speak now (5 seconds)"
echo ""

# Record
TEMP_WAV="/tmp/voice-agent-$$.wav"
arecord -f cd -d 5 -r 16000 -c 1 -t wav "$TEMP_WAV" 2>/dev/null

echo "✅ Recording complete!"
echo ""
echo "🔄 Transcribing..."

# Transcribe
python3 << EOF
import speech_recognition as sr
import subprocess
import urllib.request
import json

r = sr.Recognizer()

try:
    with sr.AudioFile("$TEMP_WAV") as source:
        r.energy_threshold = 300
        r.adjust_for_ambient_noise(source, duration=0.5)
        audio = r.record(source)
    
    text = r.recognize_google(audio)
    print(f"✅ Transcribed: {text}")
    print(f"\n🤖 Sending to $AGENT_NAME agent...")
    
    # Send to OpenClaw gateway
    payload = json.dumps({
        "message": text,
        "agent": "$AGENT",
        "session": "main"
    }).encode('utf-8')
    
    req = urllib.request.Request(
        "$GATEWAY_URL/api/message",
        data=payload,
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        response = urllib.request.urlopen(req, timeout=30)
        result = json.loads(response.read().decode('utf-8'))
        
        if 'response' in result:
            agent_response = result['response']
            print(f"\n👤 You: {text}")
            print(f"🤖 {AGENT_NAME}: {agent_response}")
            print(f"\n🔊 Speaking response...")
            subprocess.run(['spd-say', agent_response])
        else:
            print("⚠️  No response from agent")
            
    except urllib.error.URLError as e:
        print(f"⚠️  Gateway error: {e}")
        print("   Is the gateway running?")
    
    except Exception as e:
        print(f"⚠️  Error: {e}")
    
except sr.UnknownValueError:
    print("⚠️  Could not understand audio")
except sr.RequestError as e:
    print(f"⚠️  Service error: {e}")
except Exception as e:
    print(f"❌ Error: {e}")
EOF

# Cleanup
rm -f "$TEMP_WAV"

echo ""
echo "💡 Tip: Add this to your dock for quick access!"
