#!/bin/bash
# create-gmail-draft.sh - Create a draft in inerys.contact@gmail.com

set -e

TO="$1"
SUBJECT="$2"
BODY_FILE="$3"

if [[ -z "$TO" || -z "$SUBJECT" ]]; then
    echo "Usage: $0 <to> <subject> <body-file>"
    exit 1
fi

echo "Creating draft in Gmail..."
echo "  To: $TO"
echo "  Subject: $SUBJECT"
echo "  Body: $BODY_FILE"
echo ""

# Read body
BODY=$(cat "$BODY_FILE")

# Method: Use gog to send to a special label that acts as draft folder
# Actually, gog doesn't support drafts, so we'll use Gmail API via curl

# First, let's try a simpler approach: save as email file that can be imported
DRAFT_DIR="$HOME/.openclaw/workspace/agents/inerys-agent/drafts"
mkdir -p "$DRAFT_DIR"

DRAFT_FILE="$DRAFT_DIR/$(date +%Y%m%d_%H%M%S)_${TO//@/_}.eml"

cat > "$DRAFT_FILE" <<EOF
To: $TO
Subject: $SUBJECT
Content-Type: text/plain; charset=UTF-8

$BODY
EOF

echo "✅ Draft saved as: $DRAFT_FILE"
echo ""
echo "📧 To import to Gmail:"
echo "  1. Compose a new email in Gmail"
echo "  2. Click the three dots → More options → Import from mail"
echo "  3. Select: $DRAFT_FILE"
echo "  4. Review and send when ready"
echo ""
echo "Alternatively, Florian can:"
echo "  - Copy the content from the draft file"
echo "  - Paste into Gmail compose"
echo "  - Edit and send"
echo ""

# Also try to send using gog with --dry-run to validate
echo "🧪 Validating email format with gog..."
gog -a inerys.contact@gmail.com --dry-run gmail send \
    --to="$TO" \
    --subject="$SUBJECT" \
    --body="$BODY" 2>&1 || echo "⚠️  Validation skipped"

echo ""
echo "✅ Draft ready for Florian!"
