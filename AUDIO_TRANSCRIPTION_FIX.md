# Audio Transcription Issue - ROOT CAUSE IDENTIFIED

**Investigated:** 2026-03-28 06:20 HKT
**Status:** 🔴 Root cause found
**Priority:** CRITICAL

---

## 🔍 Investigation Results

### What's Working
✅ Audio transcription IS enabled in `openclaw.json`
✅ Groq Whisper (whisper-large-v3-turbo) IS configured
✅ Audio files arrive in `~/.openclaw/media/inbound/`
✅ Watcher script transcribes them automatically
✅ Transcriptions saved as `.txt` files

### What's NOT Working
❌ Transcriptions NOT included in agent message content
❌ Agent only receives audio file path
❌ Agent doesn't see the transcribed text

---

## 🎯 Root Cause

**Gateway Integration Gap:**

The transcription pipeline works like this:
```
1. User sends voice → Audio file (.ogg) arrives
2. Watcher detects .ogg → Transcribes via Groq Whisper
3. Transcription saved → .txt file created
4. ❌ GAP: .txt content NOT injected into agent message
5. Agent receives → Only .ogg path, not transcribed text
```

**Expected behavior:**
```json
{
  "message": "User's transcribed text here",
  "audio": {
    "path": "/home/e/.openclaw/media/inbound/xxx.ogg",
    "transcription": "User's transcribed text here"
  }
}
```

**Actual behavior:**
```json
{
  "message": "[media attached: /path/to/xxx.ogg]",
  "audio": "/path/to/xxx.ogg"
}
```

---

## 🔧 Fix Required

### Option 1: Modify Gateway (Preferred)

**File:** Gateway message handler
**Change:** When sending audio file to agent, also include transcription content

```python
# Pseudo-code for gateway fix:
def send_audio_to_agent(audio_file_path):
    # Get transcription
    txt_file = audio_file_path.replace('.ogg', '.txt')
    if os.path.exists(txt_file):
        transcription = read_file(txt_file)
    else:
        # Wait for transcription or trigger it
        transcription = transcribe(audio_file_path)
    
    # Send to agent WITH transcription
    message = {
        "content": f"User said: {transcription}",
        "audio_path": audio_file_path,
        "transcription": transcription
    }
    send_to_agent(message)
```

### Option 2: Modify Watcher Script

**File:** `~/.openclaw/workspace/scripts/audio-transcribe-watcher.sh`
**Change:** After transcription, trigger agent notification with text

```bash
# After transcribing, send to agent
send_to_agent "$txt_file" "$transcription"
```

### Option 3: Agent-Side Fix (Temporary Workaround)

**Current behavior:** Agent manually transcribes when audio arrives
**Better:** Check for .txt file before manual transcription

```python
# In agent message handler:
if message contains audio file:
    txt_file = audio_file.replace('.ogg', '.txt')
    if os.path.exists(txt_file):
        # Use existing transcription
        text = read_file(txt_file)
    else:
        # Transcribe manually
        text = transcribe(audio_file)
```

---

## 📊 Evidence

**Files checked:**
```bash
# Audio files exist
ls ~/.openclaw/media/inbound/*.ogg | wc -l  # 10+ files

# Transcriptions exist
ls ~/.openclaw/media/inbound/*.txt | wc -l  # 10+ files

# BUT agent doesn't see them in message content
```

**Example:**
- Audio: `/home/e/.openclaw/media/inbound/e808eb36-d574-4e24-838c-70de1aec9a42.ogg`
- Transcription: `/home/e/.openclaw/media/inbound/e808eb36-d574-4e24-838c-70de1aec9a42.txt` ✅
- Agent message: Only shows audio path ❌

---

## ✅ Solution Priority

| Priority | Solution | Effort | Impact |
|----------|----------|--------|--------|
| 1 | Gateway fix | Medium | ✅ Solves completely |
| 2 | Watcher enhancement | Low | ⚠️ Partial solution |
| 3 | Agent workaround | Low | ⚠️ Temporary |

**Recommendation:** Implement Gateway fix (Option 1) for permanent solution

---

## 🚀 Next Steps

1. ✅ **Root cause identified** - Transcriptions exist, not passed to agent
2. ⏳ **Create gateway patch** - Modify message handler
3. ⏳ **Test with voice message** - Verify agent receives text
4. ⏳ **Deploy fix** - Update gateway
5. ⏳ **Verify end-to-end** - Test voice chat flow

---

**Status:** Root cause found, solution designed
**Created:** 2026-03-28 06:20 HKT
**Priority:** CRITICAL - User-facing issue
**Impact:** Voice messages work but require manual transcription

*Next: Implement gateway fix or escalate to gateway maintainers*
