#!/usr/bin/env python3
import requests
import subprocess

API_KEY = "sk_4e5bbac476c200df26fccf90af12bf1b59c9ab50d2e49590"
VOICE_ID = "bXMFaX73JBTOSRQwRWax"

print("🔊 Testing cloned voice...")
print(f"Voice ID: {VOICE_ID}")

response = requests.post(
    f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
    headers={
        "Content-Type": "application/json",
        "xi-api-key": API_KEY,
        "Accept": "audio/mpeg"
    },
    json={
        "text": "This is your cloned voice speaking. The system is now fully operational and ready to use.",
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }
)

if response.status_code == 200:
    output_file = "/tmp/voice-test.mp3"
    with open(output_file, "wb") as f:
        f.write(response.content)
    
    print(f"✅ Success! Audio generated: {output_file}")
    print(f"Size: {len(response.content)} bytes")
    
    # Play it
    subprocess.run(["paplay", output_file])
    print("✅ Playback complete")
else:
    print(f"❌ Error: {response.status_code}")
    print(response.text)
