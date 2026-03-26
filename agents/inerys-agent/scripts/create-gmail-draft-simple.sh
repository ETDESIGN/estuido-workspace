#!/bin/bash
# create-gmail-draft-simple.sh - Create simple text draft for easy import

TO="$1"
SUBJECT="$2"
BODY="$3"
DRAFT_DIR="$HOME/.openclaw/workspace/agents/inerys-agent/drafts"
mkdir -p "$DRAFT_DIR"

# Create timestamp and safe filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SAFE_TO=$(echo "$TO" | sed 's/@/_at_/g' | sed 's/\//_slash_/g')
FILENAME="${TIMESTAMP}_${SAFE_TO}.txt"
FILEPATH="$DRAFT_DIR/$FILENAME"

# Create simple text format that can be copied to Gmail
cat > "$FILEPATH" <<EOF
========== EMAIL DRAFT ==========
To: $TO
Subject: $SUBJECT
From: inerys.contact@gmail.com

$BODY

========== END OF DRAFT ==========
Created: $(date)
=======================================
INSTRUCTIONS FOR FLORIAN:
1. Copy everything between the lines above
2. Open Gmail compose
3. Paste into compose window
4. Review, edit, and send when ready
=======================================
EOF

echo "✅ Draft created: $FILEPATH"
echo ""
echo "📧 To send:"
echo "  1. Open: $FILEPATH"
echo "  2. Copy the draft content"
echo "  3. Open Gmail compose"
echo "  4. Paste, review, and send"
echo ""
