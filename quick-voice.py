#!/usr/bin/env python3
"""
Quick voice response generator using gTTS (Google Text-to-Speech)
Fast, free, good quality
"""

import os
import sys
from pathlib import Path

def generate_voice_gTTS(text, output_path):
    """Generate speech using Google TTS (gTTS)"""
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
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: quick-voice.py 'Your text here' [output.mp3]")
        sys.exit(1)
    
    text = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else "/tmp/voice-response.mp3"
    
    print(f"🔊 Generating voice: {text[:50]}...")
    
    if generate_voice_gTTS(text, output_path):
        size = os.path.getsize(output_path) / 1024
        print(f"✅ Saved: {output_path} ({size:.1f} KB)")
    else:
        print("❌ Failed")
        sys.exit(1)
