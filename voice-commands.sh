#!/bin/bash
# Voice-Controlled OpenClaw Launcher
# Speak commands to control OpenClaw

SCRIPT_DIR="/home/e/.openclaw/workspace"

echo "🎙️  OpenClaw Voice Command Center"
echo "=================================="
echo ""
echo "Available commands:"
echo "  'start' - Start OpenClaw gateway"
echo "  'stop' - Stop OpenClaw gateway"
echo "  'status' - Check gateway status"
echo "  'dashboard' - Open Mission Control"
echo "  'agent [name]' - Send to agent"
echo ""
echo "Example: 'start gateway' or 'agent main hello'"
echo ""

# Record voice
echo "🎤 Speak your command..."
TEMP_WAV="/tmp/voice-cmd-$$.wav"
arecord -f cd -d 5 -r 16000 -c 1 -t wav "$TEMP_WAV" 2>/dev/null

echo "✅ Recorded"
echo ""

# Transcribe and execute
python3 << EOF
import speech_recognition as sr
import subprocess
import os

r = sr.Recognizer()

try:
    with sr.AudioFile("$TEMP_WAV") as source:
        r.energy_threshold = 300
        r.adjust_for_ambient_noise(source, duration=0.5)
        audio = r.record(source)
    
    text = r.recognize_google(audio).lower()
    print(f"👤 Command: {text}")
    print("")
    
    # Parse command
    if "start" in text and "gateway" in text:
        print("🚀 Starting gateway...")
        subprocess.run(['systemctl', '--user', 'start', 'openclaw-gateway'])
        subprocess.run(['edge-say', 'Gateway started'])
        
    elif "stop" in text and "gateway" in text:
        print("🛑 Stopping gateway...")
        subprocess.run(['systemctl', '--user', 'stop', 'openclaw-gateway'])
        subprocess.run(['edge-say', 'Gateway stopped'])
        
    elif "status" in text:
        print("📊 Checking status...")
        result = subprocess.run(['systemctl', '--user', 'status', 'openclaw-gateway'], 
                              capture_output=True, text=True)
        if 'active (running)' in result.stdout:
            print("✅ Gateway is running")
            subprocess.run(['edge-say', 'Gateway is running'])
        else:
            print("⚠️  Gateway is not running")
            subprocess.run(['edge-say', 'Gateway is not running'])
            
    elif "dashboard" in text or "mission" in text:
        print("🖥️  Opening dashboard...")
        subprocess.run(['xdg-open', 'http://localhost:4001'])
        subprocess.run(['edge-say', 'Opening dashboard'])
        
    elif "agent" in text:
        # Extract agent name and message
        parts = text.split('agent', 1)[1].strip()
        if parts:
            print(f"🤖 Sending to agent: {parts}")
            print("   (Agent integration requires gateway)")
            subprocess.run(['edge-say', f'Sending to agent: {parts}'])
        
    elif "time" in text:
        from datetime import datetime
        time_str = datetime.now().strftime('%I:%M %p')
        print(f"🕐 Current time: {time_str}")
        subprocess.run(['edge-say', f'The time is {time_str}'])
        
    elif "thank" in text:
        print("😊 You're welcome!")
        subprocess.run(['edge-say', 'You are welcome'])
        
    else:
        print(f"❓ Unknown command: {text}")
        print("   Try: start/stop gateway, status, dashboard, agent [name]")
        subprocess.run(['edge-say', 'I did not understand that command'])
    
except sr.UnknownValueError:
    print("⚠️  Could not understand command")
    subprocess.run(['edge-say', 'Could not understand'])
except sr.RequestError as e:
    print(f"⚠️  Service error: {e}")
except Exception as e:
    print(f"❌ Error: {e}")
EOF

# Cleanup
rm -f "$TEMP_WAV"

echo ""
echo "💡 Create a dock icon for quick voice commands!"
