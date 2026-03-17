# Quick Voice Test

## Test Linux Voice Now

```bash
# Simple test
echo "Hello! Voice messaging is working" | bash /home/e/.openclaw/workspace/linux-voice.sh

# Fun test
echo "Beep boop! I am a robot" | bash /home/e/.openclaw/workspace/linux-voice.sh

# Test different speeds
spd-say -r -50 "Slow and clear"     # slower
spd-say -r 50 "Fast speaking"       # faster
spd-say -v female2 "Female voice"   # female voice
```

## Use in OpenClaw Chat

Just tell me:
```
"say: The build is complete"
"voice: Task finished successfully"
"speak: Alert! High CPU usage detected"
```

And I'll speak it aloud using your Linux TTS!
