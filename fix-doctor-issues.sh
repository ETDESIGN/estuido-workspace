#!/bin/bash
# Fix OpenClaw Doctor Issues
# Run: bash /home/e/.openclaw/workspace/fix-doctor-issues.sh

echo "🔧 Fixing OpenClaw Doctor Issues..."
echo ""

# 1. Fix gateway mode
echo "1️⃣  Setting gateway mode to local..."
openclaw config set gateway.mode local 2>/dev/null || echo "   ⚠️  Could not set gateway mode via CLI"

# 2. Fix state directory permissions
echo "2️⃣  Fixing state directory permissions..."
chmod 700 /home/e/.openclaw
echo "   ✅ Permissions fixed: chmod 700 ~/.openclaw"

# 3. Create OAuth directory
echo "3️⃣  Creating OAuth directory..."
mkdir -p /home/e/.openclaw/credentials
chmod 700 /home/e/.openclaw/credentials
echo "   ✅ OAuth directory created"

# 4. Fix gateway service entrypoint
echo "4️⃣  Updating gateway service..."
systemctl --user stop openclaw-gateway
sleep 2

# Update systemd service with correct entrypoint
cat > ~/.config/systemd/user/openclaw-gateway.service << 'EOF'
[Unit]
Description=OpenClaw Gateway
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/home/e/.npm-global/bin/openclaw gateway
Restart=always
RestartSec=10
Environment="PATH=/home/e/.npm-global/bin:/usr/local/bin:/usr/bin:/bin"
Environment="NODE_ENV=production"

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
systemctl --user start openclaw-gateway
sleep 3
echo "   ✅ Gateway service updated and restarted"

# 5. Verify status
echo ""
echo "5️⃣  Verifying fixes..."
sleep 2
echo "   Gateway status:"
systemctl --user is-active openclaw-gateway && echo "   ✅ Gateway running" || echo "   ❌ Gateway not running"
echo "   Permissions:"
ls -ld /home/e/.openclaw | grep "drwx------" && echo "   ✅ Permissions correct" || echo "   ❌ Permissions still wrong"
echo "   OAuth dir:"
ls -ld /home/e/.openclaw/credentials && echo "   ✅ OAuth dir exists" || echo "   ❌ OAuth dir missing"

echo ""
echo "✨ Doctor fixes applied!"
echo ""
echo "Next steps:"
echo "1. Run: openclaw doctor"
echo "2. Test Discord: send 'hi' in Discord"
echo "3. Check logs: journalctl --user -u openclaw-gateway -f"
