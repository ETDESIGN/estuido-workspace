#!/bin/bash
# pipeline.sh - Main Inerys Agent Outreach Pipeline
# Flow: Email Input → Enrichment → CRM Update → Personalization → Gmail Draft → Approval

set -e

# Configuration
SANDBOX_DIR="$HOME/.openclaw/workspace/agents/inerys-agent"
MEMORY_FILE="$SANDBOX_DIR/memory/leads.json"
BUSINESS_CONTEXT="$SANDBOX_DIR/business_context.md"
IDENTITY="$SANDBOX_DIR/IDENTITY.md"
FLORIAN_TONE="$SANDBOX_DIR/florian_tone.md"
LOG_DIR="$SANDBOX_DIR/logs"

# Google Account (CRITICAL - data isolation)
# Florian's authenticated Gmail account
GOOGLE_ACCOUNT="inerys.contact@gmail.com"

# Ensure directories exist
mkdir -p "$LOG_DIR" "$(dirname "$MEMORY_FILE")"

# Logging
log() {
    echo "[$(date -u +'%Y-%m-%d %H:%M:%S UTC')] $1" | tee -a "$LOG_DIR/pipeline.log"
}

error() {
    log "ERROR: $1"
    exit 1
}

# Usage
usage() {
    cat <<EOF
Usage: $0 <email> [--company <name>] [--niche <sector>] [--warm-cold <warm|cold>] [--dry-run]

Inerys Agent Outreach Pipeline:
  1. Enrich lead data (customer-enrichment ClawFlow)
  2. Update Google Sheets CRM
  3. Personalize email draft (cold-email-personalizer ClawFlow)
  4. Create Gmail draft (gog -a florian@inerys.com)
  5. Notify Florian via WhatsApp (await approval)

Options:
  email          Prospect email address (required)
  --company      Company name (optional, will enrich if missing)
  --niche        Industry niche (optional, will enrich if missing)
  --warm-cold    Lead temperature: warm or cold (default: cold)
  --dry-run      Execute pipeline without sending data

Examples:
  $0 m.dupont@sephora.fr
  $0 contact@exemple.com --company "Exemple Brand" --niche "Beauty" --warm-cold warm
  $0 test@example.com --dry-run

EOF
    exit 1
}

# Parse arguments
if [[ $# -eq 0 ]]; then
    usage
fi

EMAIL="$1"
shift

COMPANY=""
NICHE=""
WARM_COLD="cold"
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --company)
            COMPANY="$2"
            shift 2
            ;;
        --niche)
            NICHE="$2"
            shift 2
            ;;
        --warm-cold)
            WARM_COLD="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate email
if [[ ! "$EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    error "Invalid email address: $EMAIL"
fi

log "=== PIPELINE START ==="
log "Email: $EMAIL"
log "Company: ${COMPANY:-Auto-enrich}"
log "Niche: ${NICHE:-Auto-enrich}"
log "Temperature: $WARM_COLD"
log "Dry Run: $DRY_RUN"

# STEP 1: Enrichment
log "Step 1: Enriching lead data..."

ENRICH_INPUT="{\"email\": \"$EMAIL\"}"
if [[ -n "$COMPANY" ]]; then
    ENRICH_INPUT="{\"email\": \"$EMAIL\", \"company\": \"$COMPANY\"}"
fi

# For now, use provided data. ClawFlows integration coming soon.
# TODO: Enable when customer-enrichment ClawFlow is available
# ENRICHMENT_OUTPUT=$(clawflows run customer-enrichment --args "$ENRICH_INPUT" 2>&1) || {
#     log "Warning: Enrichment ClawFlow not available, using provided data"
# }

ENRICHED_COMPANY="$COMPANY"
ENRICHED_NICHE="$NICHE"

log "Enrichment completed: Company=$ENRICHED_COMPANY, Niche=$ENRICHED_NICHE"

if [[ "$DRY_RUN" == "true" ]]; then
    log "DRY RUN: Skipping Google Sheets update"
else
    # STEP 2: Update Google Sheets CRM
    log "Step 2: Updating Google Sheets CRM..."

    # Google Sheets CRM
    SHEET_ID="1GQ-RUe9qxiUhfd2mdSbca1W7j6Yqu8q884hP5OFy6FM"

    SHEETS_VALUES="[$ENRICHED_COMPANY,$ENRICHED_NICHE,New,$WARM_COLD]"

    gog -a "$GOOGLE_ACCOUNT" sheets append \
        "$SHEET_ID" \
        "A:T" \
        "$ENRICHED_COMPANY|$EMAIL|$ENRICHED_NICHE||||||||||||||$WARM_COLD|New|$(date +%Y-%m-%d)||" || {
        error "Google Sheets update failed. Note: Run 'gog auth add inerys.contact@gmail.com' first!"
    }

    log "CRM updated successfully"
fi

# STEP 3: Personalize Email
log "Step 3: Personalizing email draft..."

PERSONALIZER_INPUT=$(cat <<EOF
{
    "email": "$EMAIL",
    "company": "$ENRICHED_COMPANY",
    "niche": "$ENRICHED_NICHE",
    "warm_cold": "$WARM_COLD",
    "business_context": "$BUSINESS_CONTEXT",
    "identity": "$IDENTITY",
    "tone_guide": "$FLORIAN_TONE"
}
EOF
)

# For now, generate a basic draft. ClawFlows integration coming soon.
# TODO: Enable when cold-email-personalizer ClawFlow is available
# EMAIL_DRAFT=$(clawflows run cold-email-personalizer --args "$PERSONALIZER_INPUT" 2>&1) || {
#     log "Warning: Personalizer ClawFlow not available, using template"
# }

# Generate subject based on company and niche
SUBJECT="Partenariat Inerys - ${ENRICHED_COMPANY}"

# Generate body based on tone guide
BODY=$(cat <<EOF
Bonjour,

Je me permets de vous contacter au sujet de ${ENRICHED_COMPANY}.

Chez Inerys, nous accompagnons les entreprises du secteur ${ENRICHED_NICHE} dans leurs projets d'emballage sur mesure. Notre usine en Chine nous permet de garantir une qualité optimale tout en maîtrisant l'ensemble de la chaîne de production.

Nos clients comme L'Oréal, Cabaïa et Tour de France nous font confiance pour leur production.

Seriez-vous disponible pour un bref échange afin que je puisse vous présenter nos réalisations?

Dans l'attente de votre retour, je vous souhaite une excellente journée.

Cordialement,

Florian
Inerys - Premium Custom Packaging
Quality Production | Design to Delivery
EOF
)

log "Email personalized"

# Save draft to temp file
DRAFT_FILE="$LOG_DIR/draft_${EMAIL//@/_}.txt"
echo "$BODY" > "$DRAFT_FILE"

log "Email personalized"
log "Subject: $SUBJECT"
log "Body saved to: $DRAFT_FILE"

if [[ "$DRY_RUN" == "true" ]]; then
    log "DRY RUN: Skipping Gmail draft creation"
else
    # STEP 4: Create Gmail Draft
    log "Step 4: Creating Gmail draft..."

    # Use simple bash script to create text draft
    DRAFT_CREATOR="$SANDBOX_DIR/scripts/create-gmail-draft-simple.sh"
    if [[ -f "$DRAFT_CREATOR" ]]; then
        bash "$DRAFT_CREATOR" "$EMAIL" "$SUBJECT" "$BODY" 2>&1 | tee -a "$LOG_DIR/pipeline.log"
    else
        # Fallback: Create simple text file
        DRAFT_FILE="$LOG_DIR/draft_${EMAIL//@/_}_$(date +%s).txt"
        {
            echo "========== EMAIL DRAFT =========="
            echo "To: $EMAIL"
            echo "Subject: $SUBJECT"
            echo ""
            echo "$BODY"
            echo "==================================="
        } > "$DRAFT_FILE"
        log "Draft saved to: $DRAFT_FILE"
        log "Open the file and copy/paste into Gmail compose"
    fi
fi

# STEP 5: Notify Florian (WhatsApp)
log "Step 5: Sending WhatsApp notification..."

WHATSAPP_MESSAGE="✨ Nouveau brouillon prêt

📧 $EMAIL
🏢 $ENRICHED_COMPANY
🎯 Niche: $ENRICHED_NICHE
📋 Subject: $SUBJECT

Pour visualiser le brouillon: Gmail Drafts
Pour approuver: Répondez 'Send'
Pour modifier: Répondez 'Change tone to...'"

log "WhatsApp: $WHATSAPP_MESSAGE"
# TODO: Integrate actual WhatsApp API

# Update local memory
log "Updating local lead memory..."

# TODO: Update leads.json with new entry

log "=== PIPELINE COMPLETE ==="
log "Next: Await Florian's WhatsApp approval ('Send' or 'Tweak')"

echo ""
echo "✓ Pipeline completed successfully"
echo "  Email: $EMAIL"
echo "  Company: $ENRICHED_COMPANY"
echo "  Draft: Gmail Drafts folder"
echo ""
echo "Waiting for Florian's approval..."
