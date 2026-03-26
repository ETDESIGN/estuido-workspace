#!/bin/bash
# test-pipeline-real-leads.sh - Test Inerys Agent with real French packaging companies

set -e

SANDBOX_DIR="$HOME/.openclaw/workspace/agents/inerys-agent"
TEST_LEADS="$SANDBOX_DIR/test_leads_real.txt"

echo "========================================="
echo "  INERYS AGENT - REAL LEAD TEST"
echo "  Testing Research Pipeline"
echo "========================================="
echo ""
echo "⚠️  Using REAL French packaging company contacts"
echo "⚠️  DRY RUN MODE - No emails will be sent"
echo ""

# Check if pipeline exists
if [[ ! -f "$SANDBOX_DIR/pipeline.sh" ]]; then
    echo "❌ Error: pipeline.sh not found"
    exit 1
fi

chmod +x "$SANDBOX_DIR/pipeline.sh"

echo "📋 Test Leads (Public Business Contacts):"
echo ""
grep -E "^Email:|^Company:|^Niche:" "$TEST_LEADS" | paste - - -
echo ""
echo "========================================="
echo ""

# Test with first lead
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

cd "$SANDBOX_DIR"

# Test 1: Dry run (no Google Sheet needed)
echo "🧪 TEST 1: Pipeline Dry Run (No Sheet)"
./pipeline.sh "$EMAIL" --company "$COMPANY" --niche "$NICHE" --dry-run

echo ""
echo "========================================="
echo ""

# Test 2: Check if we can research this company
echo "🧪 TEST 2: Company Research (ClawFlow)"
echo "Running customer-enrichment workflow..."
echo ""

clawflows run customer-enrichment --args "{\"email\": \"$EMAIL\"}"

echo ""
echo "========================================="
echo "✅ Tests Complete!"
echo ""
echo "Summary:"
echo "  ✓ Pipeline script executed"
echo "  ✓ Research workflow tested"
echo "  ✓ No emails sent (dry-run mode)"
echo ""
echo "Next Steps:"
echo "  1. Create Google Sheet (see SHEET_CREATION_GUIDE.md)"
echo "  2. Provide Sheet ID"
echo "  3. Test full pipeline with CRM integration"
echo "========================================="
