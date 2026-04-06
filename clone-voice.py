#!/usr/bin/env python3
"""
Create ElevenLabs Voice Clone via API
"""
import requests
import sys
import os

API_KEY = "sk_4e5bbac476c200df26fccf90af12bf1b59c9ab50d2e49590"

def create_voice_clone(name, description, audio_files):
    """Create an instant voice clone from audio samples"""
    
    url = "https://api.elevenlabs.io/v1/voices/add"
    
    # Prepare files for upload
    files = []
    for i, audio_path in enumerate(audio_files):
        if not os.path.exists(audio_path):
            print(f"Error: File not found: {audio_path}")
            return None
        
        files.append(('files', open(audio_path, 'rb')))
    
    # Prepare form data
    data = {
        'name': name,
        'description': description
    }
    
    headers = {
        'xi-api-key': API_KEY
    }
    
    print(f"Creating voice clone: {name}")
    print(f"Description: {description}")
    print(f"Audio samples: {len(audio_files)}")
    
    try:
        response = requests.post(url, headers=headers, data=data, files=files)
        
        # Close files
        for _, f in files:
            f.close()
        
        if response.status_code == 200:
            result = response.json()
            voice_id = result.get('voice_id')
            print(f"\n✅ Voice clone created successfully!")
            print(f"Voice ID: {voice_id}")
            print(f"Name: {name}")
            return voice_id
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(response.text)
            return None
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 clone-voice.py \"Voice Name\" \"Description\" audio1.wav [audio2.wav ...]")
        print("\nExample:")
        print("  python3 clone-voice.py \"Demo Voice\" \"Test clone\" /usr/share/sounds/freedesktop/stereo/complete.oga")
        sys.exit(1)
    
    name = sys.argv[1]
    description = sys.argv[2]
    audio_files = sys.argv[3:]
    
    voice_id = create_voice_clone(name, description, audio_files)
    
    if voice_id:
        print(f"\n🎯 You can now use this voice with:")
        print(f"  python3 elevenlabs-voice.py \"Hello\" --voice {voice_id}")
