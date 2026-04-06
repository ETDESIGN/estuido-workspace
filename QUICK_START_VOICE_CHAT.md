# 🎙️ Quick Start: Live Voice Chat

## Start the Conversation Now

```bash
cd /home/e/.openclaw/workspace
./voice-chat-live.sh
```

**That's it!** The script will:
- Start listening automatically
- Show a 5-second countdown
- Transcribe what you say
- Respond in your cloned voice
- Loop continuously

**Stop anytime:** Press `Ctrl+C`

---

## What You'll See

```
🎙️  Live Voice Chat - ElevenLabs Edition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 Instructions:
  • Speak clearly during the 5-second recording
  • Wait for transcription and response
  • Press Ctrl+C to stop

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎤 [Recording 5 seconds - Speak now!]
   5... 4... 3... 2... 1... ✓ Done!

📝 Transcribing...
👤 You: [Your speech appears here]

🤖 Processing...
🔊 Response: [Your voice speaks this back]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Repeats automatically]
```

---

## Requirements (All Met ✅)

- ✅ Microphone: HDA Intel PCH (ALC897 Analog)
- ✅ Internet: For Google STT and ElevenLabs
- ✅ Voice: bXMFaX73JBTOSRQwRWax (your clone)
- ✅ Scripts: voice-chat-live.sh, voice-eli.py

---

## Tips for Best Results

1. **Get close to mic** - 15-20cm distance
2. **Reduce noise** - Turn off TV/music
3. **Speak clearly** - Natural pace is fine
4. **Wait for countdown** - Don't start early

---

## Current Behavior

**Simple echo mode:** "I heard you say: [your words]"

**Future:** Will connect to OpenClaw agents for real conversations

---

**Start now:** `./voice-chat-live.sh`
