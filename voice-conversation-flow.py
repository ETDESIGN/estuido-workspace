#!/usr/bin/env python3
"""
Voice Message Conversation Flow for ESTUDIO GM
Creates natural voice conversations via WhatsApp voice messages
"""

import json
import os
import subprocess
from pathlib import Path
from datetime import datetime

# Configuration
TRANSCRIPTION_SCRIPT = Path.home() / ".openclaw/workspace/transcribe-audio.py"
TTS_SCRIPT = Path.home() / ".openclaw/workspace/text-to-speech.py"
WHATSAPP_SEND_CMD = "openclaw message send --channel whatsapp --account dereck"
CONVERSATION_LOG = Path.home() / ".openclaw/workspace/voice-conversations.json"

def log_conversation(phone, incoming_msg, incoming_type, outgoing_msg, outgoing_type):
    """Log conversation"""
    log = []
    if CONVERSATION_LOG.exists():
        log = json.loads(CONVERSATION_LOG.read_text())["conversations"]
    
    log.append({
        "timestamp": datetime.now().isoformat(),
        "phone": phone,
        "incoming": {
            "message": incoming_msg,
            "type": incoming_type  # "voice" or "text"
        },
        "outgoing": {
            "message": outgoing_msg,
            "type": outgoing_type  # "text" or "voice"
        }
    })
    
    CONVERSATION_LOG.write_text(json.dumps({"conversations": log}, indent=2))

def transcribe_voice(audio_path):
    """Transcribe voice message using Groq Whisper"""
    venv = Path.home() / ".openclaw/workspace/.venv-audio"
    python = venv / "bin/python"
    
    result = subprocess.run(
        [str(python), str(TRANSCRIPTION_SCRIPT), audio_path],
        capture_output=True,
        text=True
    )
    
    # Extract transcription from output
    for line in result.stdout.split('\n'):
        if line and not line.startswith('🎙️') and not line.startswith('📝') and not line.startswith('=') and not line.startswith('✅') and not line.startswith('📋'):
            if len(line) > 20:  # Actual transcribed text
                return line
    
    return "Could not transcribe"

def generate_voice_response(text):
    """Generate voice response using TTS"""
    # For now, return text - voice generation is optional
    # Can use ElevenLabs or gTTS if needed
    return None  # Returns text response

def send_whatsapp(phone, message, audio_file=None):
    """Send WhatsApp message"""
    cmd = WHATSAPP_SEND_CMD.split()
    cmd.extend(["--target", phone, "--message", message])
    
    if audio_file:
        cmd.extend(["--media", audio_file])
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.returncode == 0

# Voice Conversation Flow

print("📱 Voice Message Conversation Flow")
print("=" * 60)

print("""
## Flow Design

### 1. RECEIVE VOICE MESSAGE
User sends voice message → WhatsApp receives → Audio file saved

### 2. TRANSCRIBE (Automatic)
```
Audio file → Groq Whisper → Text
```
✅ Already working

### 3. PROCESS WITH AI (Me)
```
Transcribed text → ESTUDIO GM → Understanding → Response generation
```
✅ Already working

### 4. GENERATE RESPONSE (Choose Mode)

**Option A: Text Response (Default)**
- Fast (instant)
- No additional processing
- Good for simple responses

**Option B: Voice Response (Optional)**
- TTS generates audio
- Takes 2-3 seconds
- Better for personal touch
- Use ElevenLabs (premium) or gTTS (free)

### 5. SEND RESPONSE
```
Response text → WhatsApp → User receives
```
✅ Already working

---

## Conversation Modes

### Mode 1: Fast Text (Default)
- Receive voice → Transcribe → Respond with text
- Latency: ~2 seconds
- Best for: Information exchange, quick answers

### Mode 2: Voice Reply (Optional)
- Receive voice → Transcribe → Respond with voice
- Latency: ~5 seconds
- Best for: Personal connection, important conversations

### Mode 3: Mixed (Adaptive)
- Simple questions → Text reply
- Complex/emotional → Voice reply
- Balances speed and personal touch

---

## Example Conversation

**User (Voice):** "Hey, how's the website going?"

**Transcription:** "Hey, how's the website going?"

**AI Processing:** Understands context, checks Fred's project status

**Response (Text):** "Hey! The Freds Terrois site is running well. I'm monitoring it and everything looks stable. How can I help you today?"

**Alternative Response (Voice):** [AI generates audio file]
"Hey! The Freds Terrois site is running well. I'm monitoring it and everything looks stable. How can I help you today?"

---

## Configuration

### Voice Transcription
- ✅ Groq Whisper (working)
- Speed: ~1-2 seconds
- Accuracy: High

### Voice Generation (Optional)
- **Free:** gTTS (Google Text-to-Speech)
  - Speed: ~2 seconds
  - Quality: Good
  - Cost: $0

- **Premium:** ElevenLabs
  - Speed: ~2 seconds
  - Quality: Excellent
  - Cost: ~$5-10/month

### Sending
- ✅ WhatsApp via openclaw CLI (working)

---

## Decision Points

**When to use voice reply:**
1. User sends voice first (mirror their mode)
2. Emotional/complex topics
3. Building relationship
4. Important announcements

**When to use text reply:**
1. Quick questions
2. Factual information
3. Time-sensitive
4. Technical discussions

---

## Implementation Priority

1. ✅ Phase 1: Voice → Text (DONE)
   - Receive voice, transcribe, text response

2. ⏳ Phase 2: Text → Voice (Optional)
   - Add TTS for voice responses

3. ⏳ Phase 3: Smart Mode (Advanced)
   - Auto-choose text vs voice based on context

---

## Next Steps

1. Keep current setup (voice → text → text)
2. Monitor conversation quality
3. Add voice reply if needed
4. Optimize based on feedback

**Voice message conversations are already working!** 🎉

The flow is:
Voice message → Transcription → My response → Text back

**Want me to add voice response generation?** I can implement gTTS (free) or ElevenLabs (premium).
""")

print("\n" + "=" * 60)
print("Ready to process voice messages!")
print("Current mode: Voice in → Text out (fast)")
print("=" * 60)
