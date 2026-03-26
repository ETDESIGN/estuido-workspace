#!/home/e/.openclaw/workspace/.venv-audio/bin/python3
"""
Audio transcription script for WhatsApp voice messages
Uses Groq Whisper API for fast, accurate transcription
"""

import os
import sys
import json
import time
from pathlib import Path

from groq import Groq

def transcribe_audio(audio_path: str) -> str:
    """Transcribe audio file using Groq Whisper"""
    
    if not os.path.exists(audio_path):
        return f"Error: File not found: {audio_path}"
    
    # Get API key from environment or file
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        # Try reading from .groq-key file
        keyfile = Path.home() / ".openclaw" / ".groq-key"
        if keyfile.exists():
            api_key = keyfile.read_text().strip()
        else:
            return "Error: GROQ_API_KEY not found in environment or ~/.openclaw/.groq-key"
    
    try:
        # Disable proxy for Groq API
        if 'http_proxy' in os.environ:
            del os.environ['http_proxy']
        if 'https_proxy' in os.environ:
            del os.environ['https_proxy']
        if 'HTTP_PROXY' in os.environ:
            del os.environ['HTTP_PROXY']
        if 'HTTPS_PROXY' in os.environ:
            del os.environ['HTTPS_PROXY']
        if 'all_proxy' in os.environ:
            del os.environ['all_proxy']
        if 'ALL_PROXY' in os.environ:
            del os.environ['ALL_PROXY']
        
        client = Groq(api_key=api_key)
        
        with open(audio_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=(audio_path, audio_file.read()),
                model="whisper-large-v3-turbo",
                response_format="text",
                language="en"  # Will auto-detect if needed
            )
        
        return transcription
        
    except Exception as e:
        return f"Error transcribing: {str(e)}"

def main():
    if len(sys.argv) < 2:
        print("Usage: transcribe-audio.py <audio_file_path>")
        sys.exit(1)
    
    audio_path = sys.argv[1]
    
    print(f"🎙️  Transcribing: {audio_path}")
    result = transcribe_audio(audio_path)
    
    print(f"\n📝 Transcription:")
    print("=" * 50)
    print(result)
    print("=" * 50)
    
    # Save to file alongside audio
    audio_dir = Path(audio_path).parent
    audio_name = Path(audio_path).stem
    txt_path = audio_dir / f"{audio_name}.txt"
    
    with open(txt_path, "w") as f:
        f.write(result)
    
    print(f"\n✅ Saved to: {txt_path}")
    
    # Copy to clipboard (if xclip available)
    if os.system("which xclip > /dev/null 2>&1") == 0:
        os.system(f"echo '{result}' | xclip -selection clipboard")
        print("📋 Copied to clipboard")

if __name__ == "__main__":
    main()
