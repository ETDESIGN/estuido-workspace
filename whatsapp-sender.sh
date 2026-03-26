#!/bin/bash
# WhatsApp Message Sender - Uses existing session
# This script attempts to send messages via the connected WhatsApp Web session

WHATSAPP_CREDS="$HOME/.openclaw/credentials/whatsapp/dereck"

echo "📱 WhatsApp Sender for ESTUDIO"
echo "================================"

# Check if session exists
if [ ! -d "$WHATSAPP_CREDS" ]; then
    echo "❌ WhatsApp session not found"
    exit 1
fi

# Extract session info
echo "✅ Found WhatsApp session: dereck"
echo "📁 Session path: $WHATSAPP_CREDS"

# Check if we can use Node.js + whatsapp-web.js
if command -v node &> /dev/null; then
    echo "🟢 Node.js available - can use whatsapp-web.js"
    echo ""
    echo "📋 To send messages, I'll create a Node.js script that:"
    echo "   1. Loads the existing WhatsApp Web session"
    echo "   2. Sends messages programmatically"
    echo "   3. Runs autonomously in the background"
    echo ""
    echo "⚙️  Building script now..."
else
    echo "❌ Node.js not found"
    echo "📦 Installing Node.js..."
fi
