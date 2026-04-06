---
name: elevenlabs-voice
version: 1.0.0
description: Text-to-speech via ElevenLabs API with ~1000 credits/day. Use when Etia asks to "speak", "talk", or respond vocally.
---

# ElevenLabs Voice Skill

## Purpose
Convert text to speech and play through the Linux audio system (PipeWire/PulseAudio).

## API Configuration
- **API Key:** stored in openclaw.json under `talk.providers.elevenlabs.apiKey`
- **Base URL:** https://api.elevenlabs.io/v1
- **Voice ID:** pNInz6obpgDQGcFmaJgB (default male voice)
- **Model:** eleven_multilingual_v2 (supports English + Chinese + 29 languages)
- **Credits:** ~1000 characters per day on free plan

## How to Use

### Basic Usage
```bash
# Read the API key from config
EL_KEY=$(python3 -c "import json; d=json.load(open('/home/e/.openclaw/openclaw.json')); print(d['talk']['providers']['elevenlabs']['apiKey'])")

# Generate speech and play
curl -sS --max-time 15 -X POST "https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB" \
  -H "xi-api-key: $EL_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"YOUR TEXT HERE","model_id":"eleven_multilingual_v2"}' \
  -o /tmp/voice_output.mp3 && paplay /tmp/voice_output.mp3
```

### Chinese Text
Same command — the model is multilingual. Just write Chinese text.

### Quick Script
```bash
# /tmp/speak_el.sh "text to speak"
speak_el() {
  EL_KEY=$(python3 -c "import json; d=json.load(open('/home/e/.openclaw/openclaw.json')); print(d['talk']['providers']['elevenlabs']['apiKey'])")
  TEXT="$1"
  curl -sS --max-time 15 -X POST "https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB" \
    -H "xi-api-key: $EL_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"text\":\"$TEXT\",\"model_id\":\"eleven_multilingual_v2\"}" \
    -o /tmp/voice_output.mp3 && paplay /tmp/voice_output.mp3
}
```

## Rules
- **Budget:** ~1000 chars/day. Keep responses concise.
- **Fall back to espeak** if ElevenLabs returns an error (credits exhausted, API down).
- **Never use for testing** — only speak when Etia explicitly asks.
- **Keep spoken responses short** — people don't want to listen to a 5-minute monologue.

## Error Handling
If ElevenLabs returns `payment_required` or `character_limit` exceeded:
```bash
espeak-ng -v en-us -s 155 "Fallback to espeak." --stdout | paplay
```
