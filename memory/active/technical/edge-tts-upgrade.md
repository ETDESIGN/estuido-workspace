---
tags: voice, tts, edge-tts, upgrade, configuration
type: technical
priority: high
status: active
created: 2026-04-03
---

# Edge TTS Upgrade (replaced espeak-ng)

> **Natural-sounding voice output** replacing the robotic espeak-ng/spd-say
>
> Upgraded: 2026-04-03

---

## What Changed

All voice scripts (`voice-*.sh`) were upgraded from `spd-say` (espeak-ng) to `edge-say` (Microsoft Edge TTS).

**Before:** `spd-say "hello"` → robotic voice
**After:** `edge-say "hello"` → natural, human-like voice

---

## Commands

```bash
# Speak text (Chinese voice by default)
edge-say "你好，有什么可以帮你？"

# English voice
edge-say --en "Good morning!"

# Female voice
edge-say --female "大家好"

# From pipe
echo "test" | edge-say

# Quick aliases (added to .bashrc)
say "hello"
speak "hello"
```

---

## Configuration

| Setting | Value |
|---------|-------|
| **Default voice** | `zh-CN-YunxiNeural` (Chinese male) |
| **English voice** | `en-US-AndrewMultilingualNeural` |
| **Female voice** | `zh-CN-XiaoyiNeural` |
| **Script location** | `/home/e/.openclaw/workspace/voice-system/scripts/edge-say.sh` |
| **Symlink** | `/usr/local/bin/edge-say` |
| **Cost** | FREE (Microsoft Edge TTS, no API key) |
| **Requires** | Internet connection |

---

## Available Voices

| Voice | Language | Gender |
|-------|----------|--------|
| `zh-CN-YunxiNeural` | Chinese | Male (default) |
| `zh-CN-XiaoyiNeural` | Chinese | Female |
| `zh-CN-XiaoxiaoNeural` | Chinese | Female (warm) |
| `zh-CN-YunjianNeural` | Chinese | Male (narrator) |
| `en-US-AndrewMultilingualNeural` | English | Male |
| `en-US-AriaNeural` | English | Female |
| `en-US-JennyNeural` | English | Female |
| `ja-JP-KeitaNeural` | Japanese | Male |
| `ja-JP-NanamiNeural` | Japanese | Female |

Run `edge-say --list` for full list.

---

## Scripts Updated

All scripts in `/home/e/.openclaw/workspace/` were updated:
- `voice-simple.sh`
- `voice-chat-v2.sh`
- `voice-chat-once.sh`
- `voice-verify.sh`
- `voice-to-agent.sh`
- `voice-commands.sh`
- `voice-conversation.sh`

---

## Fallback

If Edge TTS fails (no internet), `edge-say` automatically falls back to `spd-say`.

---

## Features

- ✅ Auto-strips markdown, emojis, formatting before speaking
- ✅ Supports piped input: `echo "text" | edge-say`
- ✅ Compatible with all existing voice scripts
- ✅ Free, no API key needed
- ✅ Chinese + English + 400+ other languages
