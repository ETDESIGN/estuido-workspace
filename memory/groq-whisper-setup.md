# Groq Whisper Voice Transcription Setup

> **Automatic voice message transcription for WhatsApp/Discord**
> 
> Powered by Groq API (Free Tier)

---

## Configuration

**Location:** `~/.openclaw/openclaw.json`

**Setup:**
```json
"tools": {
  "media": {
    "audio": {
      "enabled": true,
      "timeoutSeconds": 60,
      "models": [
        {
          "provider": "groq",
          "model": "whisper-large-v3-turbo",
          "apiKey": "gsk_..."
        }
      ]
    }
  }
}
```

---

## How It Works

1. **You send voice message** (WhatsApp/Discord)
2. **OpenClaw receives audio** attachment
3. **Groq Whisper transcribes** (25 MB max, ~2 seconds)
4. **I receive text** and respond

---

## Model Details

| Feature | Value |
|---------|-------|
| **Model** | whisper-large-v3-turbo |
| **Speed** | 216x real-time |
| **Cost** | **FREE** (within Groq limits) |
| **Max File** | 25 MB |
| **Languages** | Multilingual (99 languages) |
| **Accuracy** | 12% word error rate |

---

## Free Tier Limits

| Resource | Limit |
|----------|-------|
| **Requests/minute** | 20 |
| **Requests/day** | 1,000 |
| **Audio file size** | 25 MB max |
| **Cost** | **$0** |

---

## Usage

**No setup needed!** Just works automatically.

Send a voice message to me on:
- ✅ WhatsApp
- ✅ Discord

I'll receive the transcription and respond.

---

## Testing

**Test command:**
```bash
# Send voice message to OpenClaw
# Check logs:
tail -f ~/.openclaw/logs/gateway.log | grep -i whisper
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Transcription fails | Check Groq API key |
| File too large | Max 25 MB (free tier) |
| Slow response | Groq is ultra-fast, check network |
| Wrong language | Whisper auto-detects |

---

## Alternative Models

If needed, switch to:
- `whisper-large-v3` — Higher accuracy (10.3% WER), slower, more expensive

---

*Configured: 2026-02-16*  
*Provider: Groq*  
*Model: whisper-large-v3-turbo*
