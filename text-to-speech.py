#!/usr/bin/env python3
"""
Text-to-speech script for WhatsApp voice responses
Uses ElevenLabs or alternative TTS
"""

import os
import sys
import json
from pathlib import Path

def text_to_speech_gtts(text: str, output_path: str) -> bool:
    """Free option: gTTS (Google Text-to-Speech)"""
    try:
        from gtts import gTTS
        tts = gTTS(text=text, lang='en', slow=False)
        tts.save(output_path)
        return True
    except ImportError:
        print("Installing gTTS...")
        os.system("pip3 install gTTS -q")
        from gtts import gTTS
        tts = gTTS(text=text, lang='en', slow=False)
        tts.save(output_path)
        return True
    except Exception as e:
        print(f"gTTS error: {e}")
        return False

def text_to_speech_elevenlabs(text: str, output_path: str) -> bool:
    """Premium option: ElevenLabs (requires API key)"""
    try:
        import requests
        
        api_key = os.environ.get("ELEVENLABS_API_KEY")
        if not api_key:
            print("ELEVENLABS_API_KEY not found, falling back to gTTS")
            return False
        
        url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"  # Rachel voice
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": api_key
        }
        data = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}
        }
        
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            with open(output_path, "wb") as f:
                f.write(response.content)
            return True
        else:
            print(f"ElevenLabs error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"ElevenLabs error: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: text-to-speech.py <text> [output_path]")
        sys.exit(1)
    
    text = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else "/tmp/whatsapp_response.mp3"
    
    print(f"🔊 Converting to speech: {text[:50]}...")
    
    # Try ElevenLabs first (premium), fallback to gTTS (free)
    success = text_to_speech_elevenlabs(text, output_path)
    if not success:
        print("📱 Using gTTS (free option)...")
        success = text_to_speech_gtts(text, output_path)
    
    if success:
        print(f"✅ Saved to: {output_path}")
        print(f"📏 Size: {os.path.getsize(output_path) / 1024:.1f} KB")
    else:
        print("❌ Failed to convert to speech")
        sys.exit(1)

if __name__ == "__main__":
    main()
