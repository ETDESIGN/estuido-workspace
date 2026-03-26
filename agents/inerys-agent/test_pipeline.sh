#!/bin/bash
# test_pipeline.sh - Test Inerys Agent with sample leads

set -e

SANDBOX_DIR="$HOME/.openclaw/workspace/agents/inerys-agent"
TEST_LEADS="$SANDBOX_DIR/test_leads.txt"

echo "========================================="
echo "  INERYS AGENT - PIPELINE TEST"
echo "========================================="
echo ""

# Check if pipeline exists
if [[ ! -f "$SANDBOX_DIR/pipeline.sh" ]]; then
    echo "❌ Error: pipeline.sh not found"
    exit 1
fi

# Make sure pipeline is executable
chmod +x "$SANDBOX_DIR/pipeline.sh"

echo "📋 Test Leads Available:"
echo ""
grep -E "^Email:|^Company:|^Niche:" "$TEST_LEADS" | paste - - -
echo ""
echo "========================================="
echo ""

# Parse and test first lead
echo "🧪 Testing Pipeline with Lead 1..."
echo ""

EMAIL=$(grep "^Email:" "$TEST_LEADS" | head -1 | cut -d' ' -f2)
COMPANY=$(grep "^Company:" "$TEST_LEADS" | head -1 | cut -d' ' -f2-)
NICHE=$(grep "^Niche:" "$TEST_LEADS" | head -1 | cut -d' ' -f2-)

echo "Lead Details:"
echo "  Email: $EMAIL"
echo "  Company: $COMPANY"
echo "  Niche: $NICHE"
echo ""
echo "----------------------------------------"
echo ""

# Run pipeline in dry-run mode
cd "$SANDBOX_DIR"
./pipeline.sh "$EMAIL" --company "$COMPANY" --niche "$NICHE" --dry-run

echo ""
echo "========================================="
echo "✅ Test Complete!"
echo ""
echo "Next Steps:"
echo "  1. Check the logs above for any errors"
echo "  2. When ready, remove --dry-run to test full pipeline"
echo "  3. Provide Google Sheet ID for CRM integration"
echo "========================================="
