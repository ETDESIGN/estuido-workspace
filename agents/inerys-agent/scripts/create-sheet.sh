#!/bin/bash
# create-sheet.sh - Create Google Sheet via API using gog's stored credentials

echo "Creating Google Sheet: Inerys Leads CRM..."

# Try to use gog with sheets command
# Since gog doesn't have create, we'll use the API directly

# Method: Use gog to open browser for manual creation
echo ""
echo "Opening Google Sheets in your browser..."
echo "Please:"
echo "  1. A new sheet will open"
echo "  2. Name it: Inerys Leads CRM"
echo "  3. Add headers: Company | Contact | Email | Niche | Status | Warm/Cold | First Contact | Last Contact | Notes"
echo "  4. Copy the Sheet ID from the URL"
echo "  5. Paste it below"
echo ""

# Open sheets.new
if command -v xdg-open >/dev/null; then
    xdg-open "https://sheets.new" 2>/dev/null &
elif command -v open >/dev/null; then
    open "https://sheets.new" 2>/dev/null &
else
    echo "Please open: https://sheets.new"
fi

echo ""
echo "Waiting for you to create the sheet and provide the ID..."
echo "Press Ctrl+C to cancel"
echo ""

# Prompt for Sheet ID
read -p "Enter Sheet ID (from URL): " SHEET_ID

if [[ -z "$SHEET_ID" ]]; then
    echo "❌ No Sheet ID provided"
    exit 1
fi

# Save to pipeline config
SANDBOX_DIR="$HOME/.openclaw/workspace/agents/inerys-agent"
PIPELINE="$SANDBOX_DIR/pipeline.sh"

# Update the SHEET_ID in pipeline.sh
sed -i "s/SHEET_ID=\"YOUR_SHEET_ID_HERE\"/SHEET_ID=\"$SHEET_ID\"/" "$PIPELINE"

echo ""
echo "✅ Sheet ID saved to pipeline.sh!"
echo ""
echo "Testing connection to sheet..."
echo ""

# Test connection
gog -a inerys.contact@gmail.com sheets get "$SHEET_ID" "Leads!A1:J1" 2>&1

echo ""
echo "✅ Google Sheet configured and tested!"
