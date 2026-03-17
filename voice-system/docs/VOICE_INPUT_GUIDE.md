# Voice Input & Live Conversation for OpenClaw

**Status:** ✅ **READY TO SETUP** (first-time installation required)

---

## What This Gives You

| Feature | Description | Status |
|---------|-------------|--------|
| **Voice Input** | Speech-to-text using Google Speech Recognition | ✅ Ready |
| **Voice Output** | Text-to-speech using espeak-ng | ✅ Working |
| **Live Conversation** | Full duplex voice chat with OpenClaw | ✅ Ready |
| **Offline Mode** | Uses cloud STT (needs internet) | ⚠️ Online |
| **Free Tier** | Google Speech Recognition (free tier) | ✅ Free |

---

## Quick Start

### Step 1: Install Dependencies (First Time Only)

```bash
bash /home/e/.openclaw/workspace/voice-input.sh --setup
```

This will:
- Install Python speech recognition library
- Install PyAudio for microphone access
- Set up virtual environment
- Test microphone access

### Step 2: Test Voice Input

```bash
# Record 5 seconds and transcribe
bash /home/e/.openclaw/workspace/voice-input.sh

# Record 10 seconds
bash /home/e/.openclaw/workspace/voice-input.sh 10
```

### Step 3: Live Voice Conversation

```bash
# Continuous voice chat
bash /home/e/.openclaw/workspace/voice-conversation.sh --live
```

---

## Usage Examples

### Single Voice Input

```bash
# Quick voice note
voice-input.sh

# Longer recording
voice-input.sh 15

# Continuous listening (Ctrl+C to stop)
voice-input.sh --loop
```

### Live Conversation Modes

```bash
# One turn: listen → transcribe → respond
voice-conversation.sh --once

# Continuous conversation
voice-conversation.sh --live
```

---

## How It Works

### Voice Input Flow

```
1. 🎤 Record audio (arecord)
   ↓
2. 🔄 Transcribe (Google Speech Recognition)
   ↓
3. 📝 Save text to file
   ↓
4. 🤖 Send to OpenClaw agent
```

### Live Conversation Flow

```
🎤 You speak
   ↓
📝 Transcribed to text
   ↓
🤖 OpenClaw processes
   ↓
🔊 Response spoken aloud
   ↓
🔄 Repeat...
```

---

## Integration with OpenClaw

### Option 1: Manual Integration

```bash
# Record your voice
INPUT=$(bash voice-input.sh | grep "Transcribed:" | cut -d: -f2)

# Send to OpenClaw
openclaw agent --message "$INPUT"

# Get response and speak it
RESPONSE=$(openclaw agent --message "$INPUT")
echo "$RESPONSE" | spd-say
```

### Option 2: Add to Skills

Create a skill that uses voice input:

```bash
# In your agent skill
exec: INPUT=$(bash /home/e/.openclaw/workspace/voice-input.sh 2>/dev/null | grep "Transcribed:" | sed 's/.*Transcribed: //')
exec: echo "You said: $INPUT" | bash /home/e/.openclaw/workspace/linux-voice.sh
```

### Option 3: Web Chat Integration

Modify the live conversation script to send messages to OpenClaw gateway:

```python
# Send to OpenClaw gateway
import requests
response = requests.post('http://localhost:18789/api/message', json={
    'message': transcribed_text,
    'session': 'main'
})
```

---

## Advanced Configuration

### Change Recording Duration

Edit `voice-input.sh`:

```bash
# Default duration (seconds)
DURATION=10
```

### Use Different STT Engine

The script uses Google Speech Recognition (free tier). For offline or private options:

#### Option A: Vosk (Offline, Free)

```bash
# Install Vosk
pip3 install vosk

# Download model (English)
wget https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip

# Update transcribe() function to use Vosk
```

#### Option B: OpenAI Whisper (Better accuracy)

```bash
# Install
pip3 install openai-whisper

# Use Whisper (better but slower)
whisper /tmp/voice-input.wav --model tiny
```

#### Option C: CMU Sphinx (Offline)

```bash
# Install
sudo apt install sphinxbase-utils pocketsphinx

# Use Sphinx
pocketsphinx continuous
```

### Change Voice Output

```bash
# List available voices
spd-say -L

# Use specific voice
spd-say -v female2 "Hello"

# Adjust speed
spd-say -r 50 "Fast speech"

# Adjust pitch
spd-say -p 20 "Higher pitch"
```

---

## Troubleshooting

### No Audio Input

```bash
# List microphones
arecord -l

# Test recording
arecord -f cd -d 5 test.wav
aplay test.wav

# Check microphone permissions
groups | grep audio
# If not in 'audio' group:
sudo usermod -a -G audio $USER
```

### "Could not understand audio"

- Speak clearly and close to microphone
- Reduce background noise
- Try longer recording duration
- Check microphone is selected in sound settings

### STT Service Error

Google Speech Recognition needs internet. Check:

```bash
# Test internet
ping -c 1 google.com

# If offline, use Vosk instead (see above)
```

### Permission Errors

```bash
# Add user to audio group
sudo usermod -a -G audio $USER

# Re-login required
```

---

## Performance Tips

### Faster Response Time

```bash
# Reduce recording duration
voice-input.sh 3  # 3 seconds instead of 5

# Use faster STT model
# Whisper: --model tiny (fastest, less accurate)
# Whisper: --model base (balanced)
```

### Better Accuracy

```bash
# Longer recording for context
voice-input.sh 10

# Use better STT
# Whisper instead of Google (slower but more accurate)
```

---

## Alternatives Considered

### Why Not Use Built-In Options?

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **sag (ElevenLabs)** | Natural voices | Paid only, TTS only | ❌ No input |
| **OpenAI Whisper** | Excellent accuracy | Slow, needs GPU for speed | ⚠️ Use for batch |
| **Vosk** | Offline, free | Limited language support | ✅ Good for privacy |
| **Google Speech** | Free, fast | Needs internet | ✅ Balanced choice |

---

## Future Enhancements

### Possible Improvements

1. **Wake Word Detection** - "Hey OpenClaw" to start listening
   ```bash
   # Use porcupine (free tier)
   # Or snowboy (open source)
   ```

2. **Continuous Listening** - Always on, like Alexa
   ```bash
   # Use VAD (Voice Activity Detection)
   # Only records when speaking
   ```

3. **Offline STT** - No internet required
   ```bash
   # Vosk or Coqui STT
   # Install local model
   ```

4. **Emotion Detection** - Respond to tone
   ```bash
   # Analyze audio patterns
   # Adjust response accordingly
   ```

---

## Files Created

| File | Purpose |
|------|---------|
| `voice-input.sh` | Record and transcribe speech |
| `voice-conversation.sh` | Live voice chat loop |
| `linux-voice.sh` | Text-to-speech output |
| `LINUX_VOICE_SETUP.md` | TTS setup guide |

---

## Summary

✅ **Voice Input:** Speech-to-text using Google STT (free)
✅ **Voice Output:** Text-to-speech using espeak-ng (free, offline)
✅ **Live Conversation:** Full duplex voice chat ready
✅ **Easy Setup:** One command to install dependencies
✅ **Free Tier:** No API keys needed for basic usage

**Voice input and live conversation are ready to use on your Linux system!** 🎉

---

*Created: 2026-03-17*
*Status: Active and ready to setup*
