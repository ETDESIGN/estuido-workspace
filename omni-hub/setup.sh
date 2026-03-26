#!/bin/bash
#
# WhatsApp Router Setup Script for Omni-Hub
# Quick setup and configuration helper
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROUTER="$SCRIPT_DIR/whatsapp-router.py"
CONFIG="$SCRIPT_DIR/whatsapp-router-config.json"

echo "🔧 WhatsApp Router Setup for Omni-Hub"
echo "======================================"
echo ""

# Check if router exists
if [ ! -f "$ROUTER" ]; then
    echo "❌ Error: whatsapp-router.py not found in $SCRIPT_DIR"
    exit 1
fi

# Make sure it's executable
chmod +x "$ROUTER"

echo "✅ Router found: $ROUTER"
echo ""

# Show current status
echo "📊 Current Status:"
python3 "$ROUTER" status
echo ""

# Menu
while true; do
    echo ""
    echo "What would you like to do?"
    echo "1) Add god-mode user (full admin access)"
    echo "2) Add sandboxed user (restricted to one agent)"
    echo "3) Block a phone number"
    echo "4) Remove a user"
    echo "5) Test routing"
    echo "6) Show config"
    echo "7) View logs"
    echo "8) Exit"
    echo ""
    read -p "Choose an option (1-8): " choice

    case $choice in
        1)
            echo ""
            echo "➕ Adding God-Mode User"
            read -p "User ID (e.g., 'e'): " user_id
            read -p "Name (e.g., 'E'): " name
            read -p "Phone number (e.g., '+8618566570937'): " phone
            python3 "$ROUTER" add-god "$user_id" "$name" "$phone"
            echo "✅ God-mode user added: $name"
            ;;
        2)
            echo ""
            echo "➕ Adding Sandboxed User"
            read -p "User ID (e.g., 'dereck'): " user_id
            read -p "Name (e.g., 'Dereck'): " name
            read -p "Phone number: " phone
            read -p "Target agent (e.g., 'cto', 'planner'): " agent
            python3 "$ROUTER" add-sandbox "$user_id" "$name" "$phone" "$agent"
            echo "✅ Sandboxed user added: $name -> $agent"
            ;;
        3)
            echo ""
            echo "🚫 Blocking Phone Number"
            read -p "Phone number to block: " phone
            python3 "$ROUTER" block "$phone"
            echo "✅ Blocked: $phone"
            ;;
        4)
            echo ""
            echo "➖ Removing User"
            read -p "User ID to remove: " user_id
            python3 "$ROUTER" remove "$user_id"
            echo "✅ Removed: $user_id"
            ;;
        5)
            echo ""
            echo "🧪 Testing Routing"
            read -p "Phone number to test: " phone
            read -p "Test message: " message
            echo ""
            echo "Result:"
            python3 "$ROUTER" route "$phone" "$message"
            ;;
        6)
            echo ""
            echo "📁 Configuration:"
            if [ -f "$CONFIG" ]; then
                cat "$CONFIG" | python3 -m json.tool
            else
                echo "Config not found"
            fi
            ;;
        7)
            echo ""
            echo "📋 Recent Logs:"
            tail -20 "$SCRIPT_DIR/whatsapp-router.log"
            ;;
        8)
            echo ""
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option"
            ;;
    esac
done
