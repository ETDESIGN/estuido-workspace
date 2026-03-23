#!/bin/bash
# Archive inbound media (images/audio) to workspace
# Usage: ./scripts/archive-media.sh

INBOUND_DIR="/home/e/.openclaw/media/inbound"
ARCHIVE_DIR="/home/e/.openclaw/workspace/archive"

# Create archive subdirectories
mkdir -p "$ARCHIVE_DIR/images"
mkdir -p "$ARCHIVE_DIR/audio"

# Process images
find "$INBOUND_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.gif" -o -iname "*.webp" \) | while read file; do
    filename=$(basename "$file")
    timestamp=$(date +%Y%m%d-%H%M%S)
    ext="${filename##*.}"
    
    # Copy to archive with timestamp
    cp "$file" "$ARCHIVE_DIR/images/image-${timestamp}.${ext}"
    
    echo "Archived: $filename -> image-${timestamp}.${ext}"
done

# Process audio
find "$INBOUND_DIR" -type f \( -iname "*.mp3" -o -iname "*.wav" -o -iname "*.m4a" -o -iname "*.ogg" \) | while read file; do
    filename=$(basename "$file")
    timestamp=$(date +%Y%m%d-%H%M%S)
    ext="${filename##*.}"
    
    cp "$file" "$ARCHIVE_DIR/audio/audio-${timestamp}.${ext}"
    echo "Archived: $filename -> audio-${timestamp}.${ext}"
done

# Count archived files
image_count=$(ls -1 "$ARCHIVE_DIR/images" 2>/dev/null | wc -l)
audio_count=$(ls -1 "$ARCHIVE_DIR/audio" 2>/dev/null | wc -l)

echo ""
echo "Archive complete:"
echo "  Images: $image_count files"
echo "  Audio: $audio_count files"
echo "  Location: $ARCHIVE_DIR"
