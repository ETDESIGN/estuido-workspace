# 🎤 Voice Input Quick Start

## One-Time Setup (5 minutes)

```bash
# 1. Install voice input
bash /home/e/.openclaw/workspace/voice-input.sh --setup
```

This installs:
- Python speech recognition
- PyAudio (microphone access)
- Virtual environment

---

## Test Voice Input

```bash
# Test 1: Quick 5-second recording
bash /home/e/.openclaw/workspace/voice-input.sh

# Speak into your microphone for 5 seconds
# It will transcribe what you said!
```

---

## Start Live Voice Chat

```bash
# Continuous conversation mode
bash /home/e/.openclaw/workspace/voice-conversation.sh --live

# It will:
# 1. Listen for 5 seconds
# 2. Transcribe your speech
# 3. Show you what it heard
# 4. Speak the response aloud
# 5. Repeat until you press Ctrl+C
```

---

## Quick Commands

| Command | What It Does |
|---------|--------------|
| `voice-input.sh` | Record 5 seconds, transcribe |
| `voice-input.sh 10` | Record 10 seconds, transcribe |
| `voice-input.sh --loop` | Continuous listening |
| `voice-conversation.sh --once` | One voice turn |
| `voice-conversation.sh --live` | Live voice chat |

---

## Requirements

✅ Microphone (you have ALC897 Analog)
✅ Internet (for Google Speech Recognition)
✅ Python 3 (installed)
✅ 5 minutes for setup

---

## What to Expect

**Quality:** Good for most speech, but not perfect
- Works best in quiet environment
- Speak clearly and naturally
- Supports multiple languages
- Free tier has some limits

**Speed:** Fast enough for conversation
- ~2 seconds to transcribe 5 seconds of speech
- Depends on internet connection

---

**Ready to try voice input?** Run the setup command above! 🎙️
