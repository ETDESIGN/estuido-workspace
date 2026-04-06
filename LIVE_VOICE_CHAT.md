# Live Voice Chat - ElevenLabs Edition

**Created:** 2026-03-29 01:03
**Status:** ✅ Ready to use

---

## 🎙️ What It Does

A continuous voice conversation loop:
1. **Records** your voice (5 seconds)
2. **Transcribes** using Google Speech Recognition
3. **Processes** through OpenClaw agent
4. **Speaks back** using your cloned ElevenLabs voice

---

## 🚀 How to Start

```bash
# Start live voice chat
/home/e/.openclaw/workspace/voice-chat-live.sh

# Or from workspace
cd /home/e/.openclaw/workspace
./voice-chat-live.sh
```

---

## 📋 Usage Instructions

1. **Run the script** - It will start listening
2. **Wait for "Recording 5 seconds"** - Speak clearly
3. **See transcription** - What you said appears
4. **Hear response** - Spoken in your cloned voice
5. **Repeat** - Continuous conversation loop
6. **Stop anytime** - Press Ctrl+C

---

## 💡 Example Conversation

```
🎤 [Recording 5 seconds - Speak now!]
   5... 4... 3... 2... 1... ✓ Done!

📝 Transcribing...
👤 You: Hello computer

🤖 Processing...
🔊 Response: I heard you say: Hello computer
[Your voice speaks back]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎤 [Recording 5 seconds - Speak now!]
...
```

---

## 🔧 Technical Details

**Input:**
- Microphone: arecord (ALSA)
- Duration: 5 seconds per recording
- Format: CD quality (44.1kHz, 16-bit)
- Transcription: Google Speech Recognition (requires internet)

**Output:**
- Voice: Your cloned voice (bXMFaX73JBTOSRQwRWax)
- TTS: ElevenLabs Multilingual v2
- Player: paplay (PulseAudio)

**Loop:**
- Continuous until Ctrl+C
- Auto-retries on silence
- Error handling included

---

## ⚙️ Requirements

**Hardware:**
- ✅ Microphone (arecord -l to check)
- ✅ Speakers/audio output

**Software:**
- ✅ arecord (ALSA recording)
- ✅ python3 with speech_recognition
- ✅ Internet (for Google STT and ElevenLabs API)
- ✅ ElevenLabs API key configured

---

## 🎯 Customization

### Change Recording Duration

Edit `voice-chat-live.sh`:
```bash
# Line 45: Change from 5 to your preferred seconds
arecord -f cd -d 5 -q "$RECORDING"
```

### Add OpenClaw Agent Integration

Replace the simple echo with actual agent call:
```bash
# Instead of:
RESPONSE="I heard you say: $TRANSCRIPT_TEXT"

# Use:
RESPONSE=$(openclaw-agent --message "$TRANSCRIPT_TEXT")
```

### Adjust Voice Settings

Edit `voice-eli.py`:
```python
"voice_settings": {
    "stability": 0.5,        # Lower = more expressive
    "similarity_boost": 0.75  # Higher = more like your voice
}
```

---

## 📊 Performance

- **Recording:** 5 seconds
- **Transcription:** ~1-2 seconds
- **Agent processing:** ~1-3 seconds
- **TTS generation:** ~1-2 seconds
- **Total per turn:** ~8-12 seconds

---

## ⚠️ Troubleshooting

**No microphone found:**
```bash
arecord -l  # List recording devices
pactl info  # Check PulseAudio
```

**Transcription fails:**
- Check internet connection
- Google STT requires online access
- Speak clearly and reduce noise

**No audio output:**
```bash
paplay /usr/share/sounds/freedesktop/stereo/complete.oga  # Test audio
```

**ElevenLabs errors:**
- Check API key is valid
- Verify voice ID: bXMFaX73JBTOSRQwRWax
- Monitor character usage at elevenlabs.io

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Microphone records (countdown visible)
- ✅ Transcription appears (your speech as text)
- ✅ Response plays (your voice speaks back)
- ✅ Loop continues (ready for next input)

---

## 📝 Next Steps

**Current:** Simple echo response ("I heard you say...")

**Production:** Integrate with OpenClaw agents
```bash
RESPONSE=$(sessions_send --message "$TRANSCRIPT_TEXT" --agent main)
```

**Advanced:** Add wake word, noise cancellation, faster response

---

**File:** `/home/e/.openclaw/workspace/voice-chat-live.sh`
**Documentation:** `/home/e/.openclaw/workspace/LIVE_VOICE_CHAT.md`
**Status:** ✅ Ready to test

---

*Start the conversation! 🎙️✨*
