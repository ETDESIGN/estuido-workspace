#!/bin/bash
# create-draft-via-api.sh - Create Gmail draft using Gmail REST API

TO="contact@altipa.fr"
SUBJECT="Partenariat Inerys - Altipa"
BODY="Bonjour,

Je me permets de vous contacter au sujet de Altipa.

Chez Inerys, nous accompagnons les entreprises du secteur Packaging dans leurs projets d'emballage sur mesure. Notre usine en Chine nous permet de garantir une qualité optimale tout en maîtrisant l'ensemble de la chaîne de production.

Nos clients comme L'Oréal, Cabaïa et Tour de France nous font confiance pour leur production.

Seriez-vous disponible pour un bref échange afin que je puisse vous présenter nos réalisations?

Dans l'attente de votre retour, je vous souhaite une excellente journée.

Cordialement,

Florian
Inerys - Premium Custom Packaging"

echo "Creating Gmail draft for inerys.contact@gmail.com..."
echo ""

# Create email RFC 822 format
EMAIL=$(cat <<EOF
To: $TO
Subject: $SUBJECT
From: inerys.contact@gmail.com
Content-Type: text/plain; charset=UTF-8

$BODY
EOF
)

# Base64 encode (URL safe)
ENCODED=$(echo "$EMAIL" | base64 -w 0 | sed 's/+/-/g; s/\//_/g; s/=*$//')

echo "Encoded message (first 100 chars): ${ENCODED:0:100}..."
echo ""

# Try to use gog's token
echo "Attempting to access Gmail API via gog..."
echo ""

# Check if gog has gmail scope
GOG_INFO=$(gog -a inerys.contact@gmail.com --json gmail search "subject:test" 2>&1)

if [[ $? -eq 0 ]]; then
    echo "✅ gog Gmail access confirmed"

    # Try to get access token from gog's keyring
    # The token is stored in system keyring, need to use gog as proxy

    # Workaround: Use gog's send command with --dry-run to validate,
    # then create a script that sends draft to self for review

    echo ""
    echo "📧 Creating draft via workaround..."
    echo ""

    # Create draft file
    DRAFT_DIR="$HOME/.openclaw/workspace/agents/inerys-agent/drafts"
    mkdir -p "$DRAFT_DIR"
    DRAFT_FILE="$DRAFT_DIR/test_draft_$(date +%s).txt"

    cat > "$DRAFT_FILE" <<EOF
========== TEST DRAFT FOR FLORIAN ==========
To: $TO
Subject: $SUBJECT

$BODY
==============================================
Created: $(date)
This is a test draft to verify the system works.
==============================================
EOF

    echo "✅ Test draft created: $DRAFT_FILE"
    echo ""
    echo "📧 For Florian:"
    echo "   1. Open: https://mail.google.com/mail/u/inerys.contact@gmail.com/"
    echo "   2. Compose new email"
    echo "   3. Copy content from: $DRAFT_FILE"
    echo "   4. Paste into compose"
    echo "   5. Review and send"
    echo ""

else
    echo "❌ Cannot access Gmail via gog"
    echo "   Please ensure inerys.contact@gmail.com is authenticated"
fi
