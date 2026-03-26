#!/bin/bash
# Auto-transcribe audio files in inbound media directory
# Watches ~/.openclaw/media/inbound/ for new .ogg files without .txt counterparts

WATCH_DIR="$HOME/.openclaw/media/inbound"
GROQ_API_KEY="REDACTED"
LOG_FILE="$HOME/.openclaw/workspace/logs/audio-transcribe.log"

mkdir -p "$(dirname "$LOG_FILE")"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

transcribe_audio() {
    local audio_file="$1"
    local txt_file="${audio_file%.ogg}.txt"
    
    # Skip if transcription already exists
    if [[ -f "$txt_file" ]]; then
        log "✅ Already transcribed: $(basename "$audio_file")"
        return 0
    fi
    
    log "🎙️  Transcribing: $(basename "$audio_file")"
    
    # Transcribe using Groq Whisper
    local transcription=$(curl -s "https://api.groq.com/openai/v1/audio/transcriptions" \
        -H "Authorization: Bearer $GROQ_API_KEY" \
        -F "file=@$audio_file" \
        -F "model=whisper-large-v3-turbo" \
        -F "response_format=text")
    
    if [[ -n "$transcription" && "$transcription" != *"error"* ]]; then
        echo "$transcription" > "$txt_file"
        log "✅ Success: $transcription"
    else
        log "❌ Failed: $(basename "$audio_file")"
        return 1
    fi
}

export -f transcribe_audio
export GROQ_API_KEY LOG_FILE

# Find all .ogg files without .txt and transcribe them
find "$WATCH_DIR" -name "*.ogg" -type f | while read -r audio_file; do
    transcribe_audio "$audio_file"
done

log "✅ Audio transcription batch complete"
