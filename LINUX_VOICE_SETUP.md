# Linux Voice Messaging for OpenClaw

**Status:** ✅ **WORKING** on your Linux system

---

## Your System Capabilities

| Component | Status | Tool |
|-----------|--------|------|
| **TTS Engine** | ✅ Available | `spd-say` (Speech Dispatcher) |
| **Audio Player** | ✅ Available | `paplay` (PulseAudio) |
| **Audio Output** | ✅ Ready | PipeWire/PulseAudio |

---

## Quick Start

### Basic Usage

```bash
# Speak text directly
bash /home/e/.openclaw/workspace/linux-voice.sh "Hello, this is a test"

# Pipe text to voice
echo "Task completed" | bash /home/e/.openclaw/workspace/linux-voice.sh

# Check voice support
bash /home/e/.openclaw/workspace/linux-voice.sh --check
```

---

## Integration with OpenClaw

### Option 1: Command Line

Use `exec` tool with voice output:

```bash
# In OpenClaw chat
exec: bash /home/e/.openclaw/workspace/linux-voice.sh "Your message here"

# Example
exec: bash /home/e/.openclaw/workspace/linux-voice.sh "Hey! The build is done."
```

### Option 2: Agent Skill Integration

Create a skill that uses voice:

```bash
# In agent skill
exec: echo "Alert: ${message}" | bash /home/e/.openclaw/workspace/linux-voice.sh
```

### Option 3: Add to PATH for Easy Access

```bash
# Create symlink
sudo ln -s /home/e/.openclaw/workspace/linux-voice.sh /usr/local/bin/linux-voice

# Then use directly
linux-voice "Hello world"
```

---

## Advanced Usage

### Voice Notifications for Events

```bash
# Cron job with voice alert
0 9 * * * echo "Good morning! Time for standup" | linux-voice

# Build complete notification
make build && linux-voice "Build successful"

# Error alerts
error_command || linux-voice "Build failed"
```

### Reading Files Aloud

```bash
# Read log file
tail -20 /var/log/syslog | linux-voice

# Read message
cat message.txt | linux-voice

# Read agent response
echo "Agent said: ${response}" | linux-voice
```

---

## Configuration

### Change Voice/Speed/Pitch

```bash
# List available voices
spd-say -L

# Use different voice
spd-say -v en+f3 "Hello"  # female voice 3

# Adjust speed
spd-say -r 150 "Fast message"    # 150 words/min
spd-say -r 50 "Slow message"     # 50 words/min

# Adjust pitch
spd-say -p 50 "High pitch"       # higher pitch
spd-say -p -50 "Low pitch"       # lower pitch
```

### Modify the Script

Edit `/home/e/.openclaw/workspace/linux-voice.sh`:

```bash
# Add default voice
speak() {
    spd-say -v en+f3 -r 150 "$text"  # female, faster
}
```

---

## Troubleshooting

### No Sound Output

```bash
# Check PulseAudio is running
pactl info

# Check default sink
pactl info | grep "Default Sink"

# Test audio
paplay /usr/share/sounds/alsa/Front_Center.wav

# Restart PulseAudio
systemctl --user restart pulseaudio
```

### Install Additional Voices

```bash
# Install more espeak voices
sudo apt install espeak-ng-data espeak-ng-espeak

# Install other languages
sudo apt install espeak-ng-data-spanish espeak-ng-data-french
```

---

## Alternative TTS Engines

### Pico TTS (Smaller, Faster)

```bash
# Install
sudo apt install libttspico-utils

# Use
pico2wave --wave test.wav "Hello world"
aplay test.wav
```

### Festival TTS (More Natural)

```bash
# Install
sudo apt install festival festvox-kallpc16k

# Use
echo "Hello world" | festival --tts
```

### Google Cloud TTS (Online)

Requires API key but more natural voices:

```bash
# Install gcloud CLI
sudo apt install google-cloud-sdk

# Use (requires setup)
gcloud tts synthesize "Hello world" output.wav --language-code en-US
aplay output.wav
```

---

## OpenClaw Integration Examples

### Alert on Task Complete

```javascript
// In agent skill
if (taskComplete) {
  exec('bash /home/e/.openclaw/workspace/linux-voice.sh "Task completed successfully"');
}
```

### Heartbeat Voice Check

```bash
# Add to HEARTBEAT.md
*/30 * * * * echo "System check complete" | linux-voice
```

### Read Aloud Responses

```bash
# Pipe OpenClaw output to voice
openclaw agent --message "Summarize today" | linux-voice
```

---

## Limitations vs sag (ElevenLabs)

| Feature | Linux Voice (spd-say) | sag (ElevenLabs) |
|---------|----------------------|------------------|
| **Cost** | Free (offline) | Paid API |
| **Voice Quality** | Robotic | Natural |
| **Emotion** | Limited | Full range |
| **Voices** | ~10 basic | 100s of premium |
| **Latency** | Instant | Network delay |
| **Privacy** | 100% local | Cloud processing |

---

## Recommendation

**For your use case:**
- **System notifications**: Use `linux-voice.sh` (free, instant, private)
- **Storytelling/Narration**: Consider sag for natural voices (if budget allows)

---

**Created:** 2026-03-17
**Status:** ✅ Ready to use
**Location:** `/home/e/.openclaw/workspace/linux-voice.sh`

---

*Voice messaging works on Linux! Use this script as a free, offline alternative to sag/ElevenLabs.*
