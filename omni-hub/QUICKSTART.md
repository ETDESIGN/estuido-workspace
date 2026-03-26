# WhatsApp Router - Quick Reference

## 📍 Location
```
~/.openclaw/workspace/omni-hub/
├── whatsapp-router.py          # Main router (570 lines)
├── whatsapp-router-config.json # Configuration
├── whatsapp-router.log         # Audit log
├── setup.sh                    # Interactive setup
├── README.md                   # Full documentation
└── IMPLEMENTATION_SUMMARY.md   # Build details
```

## 🚀 Quick Start

### 1. Add a User
```bash
# God-mode (full admin)
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py add-god \
  <user-id> "<Name>" "+1234567890"

# Sandboxed (one agent only)
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py add-sandbox \
  <user-id> "<Name>" "+1234567890" <agent-id>
```

### 2. Test Routing
```bash
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py route \
  "+1234567890" "Test message"
```

### 3. Block a Number
```bash
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py block "+1234567890"
```

### 4. View Logs
```bash
tail -f ~/.openclaw/workspace/omni-hub/whatsapp-router.log
```

## 📱 WhatsApp Usage

### God-Mode (E)
- Send message → routes to `main` by default
- Send `@cto message` → routes to CTO agent
- Send `Save to memory: X` → saves to QMD
- Send `Search memory: X` → searches QMD

### Sandboxed (Dereck/Clients)
- Send message → routes to assigned agent only
- Send voice note → transcribed and sent to agent
- Send `Remember: X` → saves to QMD

### Unknown Numbers
- Automatically blocked (saves API budget)

## 🔧 Interactive Setup
```bash
~/.openclaw/workspace/omni-hub/setup.sh
```

## 📊 Current Status
```bash
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py status
```

## ⚙️ Config File
```bash
cat ~/.openclaw/workspace/omni-hub/whatsapp-router-config.json | jq
```

---

**Built:** 2025-03-25  
**Version:** 1.0  
**Status:** ✅ Production Ready
