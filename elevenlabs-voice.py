#!/usr/bin/env python3
"""
ElevenLabs Text-to-Speech Wrapper
Handles free tier limitations (cloned voices only)
"""
import os
import sys
import argparse
import subprocess

# ElevenLabs API (free tier - cloned voices only)
API_KEY = "sk_4e5bbac476c200df26fccf90af12bf1b59c9ab50d2e49590"

def get_voices():
    """List available voices (free tier shows cloned voices)"""
    import requests
    
    response = requests.get(
        "https://api.elevenlabs.io/v1/voices",
        headers={"xi-api-key": API_KEY}
    )
    
    if response.status_code == 200:
        data = response.json()
        voices = data.get("voices", [])
        
        print("Available ElevenLabs Voices:")
        print(f"Total: {len(voices)}")
        print()
        
        for v in voices:
            name = v.get("name", "Unknown")
            voice_id = v.get("voice_id", "N/A")
            labels = v.get("labels", {})
            category = v.get("category", "unknown")
            
            print(f"🎤 {name}")
            print(f"   ID: {voice_id}")
            print(f"   Category: {category}")
            if labels:
                print(f"   Gender: {labels.get('gender', 'N/A')}")
                print(f"   Accent: {labels.get('accent', 'N/A')}")
            print()
        
        # Highlight cloned voices (free tier compatible)
        cloned = [v for v in voices if v.get("category") == "cloned"]
        if cloned:
            print("✅ FREE TIER COMPATIBLE (cloned voices):")
            for v in cloned:
                print(f"   - {v.get('name')} ({v.get('voice_id')})")
        else:
            print("⚠️  No cloned voices found. Free tier requires cloned voices.")
            print("   You need to create a voice clone at elevenlabs.io first.")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

def speak(text, voice_id=None, output_file=None):
    """Generate speech from text"""
    import requests
    
    # Default voice (user must provide a cloned voice ID)
    if not voice_id:
        print("Error: Free tier requires a cloned voice ID")
        print("Run: elevenlabs-voice.py --list")
        print("Then create a voice clone at https://elevenlabs.io")
        sys.exit(1)
    
    print(f"🔊 Generating speech...")
    print(f"   Voice: {voice_id}")
    print(f"   Text: {text[:50]}...")
    
    response = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        headers={
            "Content-Type": "application/json",
            "xi-api-key": API_KEY,
            "Accept": "audio/mpeg"
        },
        json={
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }
    )
    
    if response.status_code == 200:
        # Save to file
        if not output_file:
            output_file = "/tmp/elevenlabs-output.mp3"
        
        with open(output_file, "wb") as f:
            f.write(response.content)
        
        print(f"✅ Saved to: {output_file}")
        
        # Play audio
        try:
            subprocess.run(["paplay", output_file], check=True)
            os.remove(output_file)
            print("✅ Playback complete")
        except FileNotFoundError:
            print("⚠️  paplay not found. Audio saved but not played.")
        except subprocess.CalledProcessError as e:
            print(f"⚠️  Playback failed: {e}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="ElevenLabs TTS (Free Tier)")
    parser.add_argument("text", nargs="?", help="Text to speak")
    parser.add_argument("--list", action="store_true", help="List available voices")
    parser.add_argument("--voice", help="Voice ID (required for free tier)")
    parser.add_argument("--output", help="Output file (default: play audio)")
    
    args = parser.parse_args()
    
    if args.list:
        get_voices()
    elif args.text:
        speak(args.text, voice_id=args.voice, output_file=args.output)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
