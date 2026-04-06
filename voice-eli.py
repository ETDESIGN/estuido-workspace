#!/usr/bin/env python3
import sys
import requests
import subprocess

API_KEY = "sk_4e5bbac476c200df26fccf90af12bf1b59c9ab50d2e49590"
DEFAULT_VOICE = "bXMFaX73JBTOSRQwRWax"

def speak(text, voice_id=None, play=True):
    voice_id = voice_id or DEFAULT_VOICE
    
    response = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={
            "Content-Type": "application/json",
            "xi-api-key": API_KEY,
        },
        json={
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        },
        timeout=30
    )
    
    if response.status_code == 200:
        output_file = "/tmp/elevenlabs-output.mp3"
        with open(output_file, "wb") as f:
            f.write(response.content)
        
        if play:
            subprocess.run(["paplay", output_file], check=True, capture_output=True)
        
        return True
    return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(1)
    speak(" ".join(sys.argv[1:]))
