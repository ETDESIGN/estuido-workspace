#!/bin/bash
# Wrapper script for audio transcription
# Usage: ./transcribe-audio.sh <audio_file>

AUDIO_FILE="$1"

if [ -z "$AUDIO_FILE" ]; then
    echo "Usage: transcribe-audio.sh <audio_file>"
    exit 1
fi

if [ ! -f "$AUDIO_FILE" ]; then
    echo "Error: File not found: $AUDIO_FILE"
    exit 1
fi

# Source environment if needed
if [ -f ~/.openclaw/.env ]; then
    export $(grep -v '^#' ~/.openclaw/.env | xargs)
fi

# Run Python script
python3 ~/.openclaw/workspace/transcribe-audio.py "$AUDIO_FILE"
