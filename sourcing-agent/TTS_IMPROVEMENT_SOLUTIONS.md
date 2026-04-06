# 🔊 Better Text-to-Speech Solutions for Linux

**Date:** 2026-03-29 00:15 HKT
**Current Issue:** espeak/spd-say voice quality is robotic
**Goal:** Find more natural, high-quality TTS for Linux

---

## ✅ RECOMMENDED SOLUTIONS (Best to Worst)

### **1. Piper TTS** ⭐ BEST FREE OPTION

**Why It's Great:**
- ✅ Recent breakthrough (2025)
- ✅ Natural-sounding voices
- ✅ Open source
- ✅ Works offline (privacy)
- ✅ Optimized for Raspberry Pi/Linux
- ✅ Uses ONNX models with VITS
- ✅ Multiple languages and accents

**Installation:**
```bash
# Ubuntu/Debian
sudo apt install piper-phonemize

# Or build from source
git clone https://github.com/rhasspy/piper.git
cd piper
pip install piper-tts

# Download voice models
wget https://github.com/rhasspy/piper/releases/download/v1.0.0/en_US-lessac-medium.tar.gz
tar -xvzf en_US-lessac-medium.tar.gz
```

**Usage:**
```bash
echo "Hello, this is a test" | piper --model en_US-lessac-medium.onix --output_file output.wav
aplay output.wav
```

**Quality:** Much better than espeak (near-human)

---

### **2. eSpeak NG** (eSpeak Next Generation)

**Why It's Better:**
- ✅ Successor to espeak
- ✅ Improved voice quality
- ✅ Faster
- ✅ More languages
- ✅ Still lightweight

**Installation:**
```bash
sudo apt install espeak-ng
```

**Usage:**
```bash
espeak-ng "Hello world" --stdout | aplay
```

**Quality:** Better than espeak, still robotic but improved

---

### **3. Festival with CMU/Nitech Voices**

**Why It's Better:**
- ✅ Nitech voices are "heads and shoulders" above others
- ✅ CMU voices also very good
- ✅ More natural than espeak
- ✅ Open source

**Installation:**
```bash
sudo apt install festival festival-dev festvox-cmu-us-slt festvox-kallpc16k
```

**Usage:**
```bash
echo "Hello world" | festival --tts
```

**Quality:** Much better than espeak, but harder to install

---

### **4. Cloud-Based Solutions** (Best Quality, Cost Money)

#### **Amazon Polly** 💰
- ✅ Best quality (industry standard)
- ✅ Natural voices (neural engine)
- ✅ Multiple languages
- ✅ SSML support
- ❌ Requires AWS account
- ❌ Costs: $5/1M characters (standard), $15/1M (neural)

#### **Google Cloud TTS** 💰
- ✅ WaveNet voices (very natural)
- ✅ DeepMind technology
- ✅ Multiple languages
- ❌ Costs: $4-16/1M characters
- ❌ Requires Google Cloud account

#### **Microsoft Azure TTS** 💰
- ✅ Very natural voices
- ✅ Neural engine
- ✅ Multiple styles
- ❌ Costs: $4-16/1M characters
- ❌ Requires Azure account

#### **Murf.ai** 💰
- ✅ Premium quality
- ✅ Multilingual
- ✅ API support
- ❌ Costs: ~$13-26/month
- ❌ Subscription required

---

## 🎯 RECOMMENDATION

### **For FREE (Best Quality): PIPER TTS**

**Why:**
- Best free option
- Natural sounding
- Works offline
- Open source
- Recent technology (2025)

**Installation Steps:**
```bash
# Install dependencies
sudo apt install python3-pip python3-dev

# Install Piper
pip3 install piper-tts

# Download a voice model (example)
wget https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx -P /tmp/

# Test it
echo "Testing improved voice quality with Piper TTS" | piper-tts --model /tmp/en_US-lessac-medium.onix --output_file /tmp/test.wav
aplay /tmp/test.wav
```

---

### **For BEST QUALITY (Paid): Amazon Polly Neural**

**Why:**
- Industry standard
- Most natural voices
- Used by Android apps
- Reliable

**Installation:**
```bash
# Install AWS CLI
pip3 install boto3

# Use API
import boto3
polly = boto3.client('polly')
response = polly.synthesize_speech(
    Text='Hello world',
    OutputFormat='mp3',
    VoiceId='Joanna',
    Engine='neural'
)
```

---

## 📊 Comparison Table

| Solution | Quality | Cost | Offline? | Difficulty |
|----------|---------|------|----------|------------|
| **Piper TTS** | ⭐⭐⭐⭐⭐ | Free | ✅ | Medium |
| **eSpeak NG** | ⭐⭐⭐ | Free | ✅ | Easy |
| **Festival** | ⭐⭐⭐⭐ | Free | ✅ | Hard |
| **Amazon Polly** | ⭐⭐⭐⭐⭐ | Paid | ❌ | Medium |
| **Google TTS** | ⭐⭐⭐⭐⭐ | Paid | ❌ | Medium |
| **spd-say (current)** | ⭐⭐ | Free | ✅ | Easy |

---

## 🚀 Quick Fix (Try First)

**Test Piper TTS:**
```bash
# Quick install
pip3 install piper-tts --user

# Download voice
wget https://github.com/rhasspy/piper/releases/download/v1.2.0/en_US-lessac-medium.tar.gz -O /tmp/voice.tar.gz
tar -xzf /tmp/voice.tar.gz -C /tmp/

# Test
echo "This is much better voice quality" | piper --model /tmp/en_US-lessac-medium.onix | aplay
```

---

**Recommendation:** Start with Piper TTS (free, natural, offline). If you need even better quality and don't mind paying, use Amazon Polly Neural.

*Research completed: 2026-03-29 00:15 HKT*
*Best Option: Piper TTS (free) or Amazon Polly (paid)*
