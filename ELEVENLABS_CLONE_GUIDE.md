# ElevenLabs Voice Clone Guide

**Issue:** Free tier API key lacks `create_instant_voice_clone` permission

**Solution:** Create voice clone via ElevenLabs web interface (free, no API needed)

---

## 🎯 Step-by-Step: Create Voice Clone (Free)

### Step 1: Go to ElevenLabs
Visit: https://elevenlabs.io
- Log in with your account
- Go to **Voice Lab** (sidebar)

### Step 2: Create Instant Voice Clone
1. Click **"Add Voice"** or **"Voice Cloning"**
2. Choose **"Instant Voice Clone"** (free option)
3. Upload 1-3 audio samples:
   - Best: 30 seconds - 5 minutes of clear speech
   - Format: MP3, WAV, M4A, OGG
   - Content: Your voice reading or speaking naturally
   - Tips: Clear, quiet environment, consistent tone

4. Name your voice (e.g., "My Voice Clone")
5. Add description (optional)
6. Click **"Create Voice"**

### Step 3: Get Voice ID
After creation:
1. Go to **Voice Lab** → **Your Voices**
2. Click on your cloned voice
3. Copy the **Voice ID** (looks like: `abc123xyz456`)

### Step 4: Use with API
Now you can use the voice ID with the API:

```bash
python3 elevenlabs-voice.py "Hello, this is a test" --voice YOUR_VOICE_ID
```

---

## 📝 Audio Sample Recommendations

### Option 1: Record New Sample (Best)
```bash
# Record 30 seconds of your voice
arecord -f cd -d 30 my-voice-sample.wav
```

**What to say:**
- Read a paragraph from a book
- Describe your day
- Count from 1 to 100
- Any natural speech works

### Option 2: Use Existing Audio
- WhatsApp voice notes
- Meeting recordings
- Podcast appearances
- Any clear recording of your voice

---

## 🎤 Quick Test (After Clone Created)

```bash
# Test your cloned voice
python3 elevenlabs-voice.py "This is my cloned voice speaking" --voice YOUR_VOICE_ID

# List available voices (should show your clone)
python3 elevenlabs-voice.py --list
```

---

## ⚠️ Why Can't We Use API?

**Free tier limitations:**
- ❌ Cannot create voice clones via API
- ❌ Cannot use library voices (Rachel, Adam, etc.) via API
- ✅ **Can create clones via web interface** (free!)
- ✅ **Can use cloned voices via API** (free!)

**Paid tier ($5/month):**
- ✅ Full API access
- ✅ All library voices
- ✅ No restrictions

---

## 🚀 After Clone is Ready

Once you have the Voice ID, I can:

1. **Update the wrapper script** to use your cloned voice by default
2. **Create shortcuts** for quick voice output
3. **Integrate with agents** for voice responses
4. **Test quality** and adjust settings

**Just share the Voice ID with me!**

---

**Created:** 2026-03-29
**Status:** Waiting for voice clone creation via web interface
