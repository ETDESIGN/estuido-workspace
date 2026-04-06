#!/usr/bin/env python3
"""
ElevenLabs TTS Wrapper - ESTUDIO
Default voice: bXMFaX73JBTOSRQwRWax (E's cloned voice)
"""
import sys
import os
import requests
import subprocess

API_KEY = "sk_4e5bbac476c200df26fccf90af12bf1b59c9ab50d2e49590"
DEFAULT_VOICE = "bXMFaX73JBTOSRQwRWax"
MODEL = "eleven_multilingual_v2"

def speak(text, voice_id=None, output_file=None, play=True):
    """Generate speech from text"""
    
    voice_id = voice_id or DEFAULT_VOICE
    
    if not text:
        print("Error: No text provided")
        return False
    
    print(f"🔊 Generating speech...")
    
    try:
        response = requests.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
            headers={
                "Content-Type": "application/json",
                "xi-api-key": API_KEY,
                "Accept": "audio/mpeg"
            },
            json={
                "text": text,
                "model_id": MODEL,
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.75
                }
            },
            timeout=30
        )
        
        if response.status_code == 200:
            if not output_file:
                output_file = "/tmp/elevenlabs-output.mp3"
            
            with open(output_file, "wb") as f:
                f.write(response.content)
            
            print(f"✅ Saved to: {output_file}")
            
            if play:
                try:
                    subprocess.run(["paplay", output_file], check=True, capture_output=True)
                    print("✅ Playback complete")
                except FileNotFoundError:
                    print("⚠️  paplay not found")
                    return False
                except subprocess.CalledProcessError:
                    print("⚠️  Playback failed")
                    return False
            
            return True
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: voice.py \"Your text here\"")
        print(f"Default voice: {DEFAULT_VOICE}")
        sys.exit(1)
    
    text = " ".join(sys.argv[1:])
    speak(text)
