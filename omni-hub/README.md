# WhatsApp Router for Omni-Hub Architecture

**Purpose:** Route incoming WhatsApp messages to appropriate agent workspaces with Caller-ID Bouncer Protocol for security.

**Version:** 1.0  
**Created:** 2025-03-25  
**Status:** Ready for implementation

---

## 📋 Overview

The WhatsApp Router implements a security-first approach to routing incoming WhatsApp messages to different agents and workspaces. It supports:

- **God-Mode Access:** Full admin access to all agents (E only)
- **Sandboxed Access:** Restricted access to specific agent workspaces
- **Blocked Numbers:** Automatic rejection to save API budget
- **Voice Note Transcription:** Convert audio messages to text
- **QMD Integration:** Save and search memories via WhatsApp

---

## 🔐 Security Model (Caller-ID Bouncer Protocol)

### Authorization Levels

| Level | Description | Access | Example |
|-------|-------------|--------|---------|
| **GOD-MODE** | Full admin access | All agents & workspaces | E (+8618566570937) |
| **SANDBOXED** | Whitelisted client | One specific agent only | Dereck → CTO workspace |
| **BLOCKED** | Unknown number | Rejected immediately | Anyone not in whitelist |

### Routing Rules

1. **GOD-MODE users:**
   - Can message any agent
   - Can specify `@agent-name` in message to target specific agent
   - Full access to all workspaces
   - Can add/remove users

2. **SANDBOXED users:**
   - Can ONLY message their assigned agent
   - Cannot access other workspaces
   - Voice notes transcribed automatically
   - QMD commands enabled

3. **BLOCKED/Unknown:**
   - Messages ignored (no API call made)
   - Logged for audit trail
   - No response sent

---

## 🚀 Setup

### 1. Initial Setup

```bash
# The router is located at:
~/.openclaw/workspace/omni-hub/whatsapp-router.py

# Make sure it's executable (already done):
chmod +x ~/.openclaw/workspace/omni-hub/whatsapp-router.py

# Check status:
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py status
```

### 2. Add God-Mode User (E)

```bash
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py add-god \
  e \
  "E" \
  "+8618566570937"
```

### 3. Add Sandboxed User (Dereck)

```bash
# Route Dereck's messages to CTO workspace:
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py add-sandbox \
  dereck \
  "Dereck" \
  "+1234567890" \
  "cto"
```

### 4. Block a Number

```bash
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py block "+15555555555"
```

---

## 💬 Usage

### For Users (Via WhatsApp)

**God-Mode (E):**
- Send message normally → routes to `main` agent by default
- Send `@cto deploy to production` → routes to CTO agent
- Send `Save this to memory: Project deadline is Friday` → saves to QMD
- Send `Search memory: What did I say about the deadline?` → searches QMD

**Sandboxed (Dereck):**
- Send message normally → routes to assigned agent only
- Send voice note → transcribed and sent to assigned agent
- Send `Remember: The meeting is at 3pm` → saves to QMD

### For Admins (Via CLI)

```bash
# Route a test message:
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py route \
  "+8618566570937" \
  "Test message to main agent"

# Add a new trusted user:
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py add-sandbox \
  client-abc \
  "ABC Corp" \
  "+14155551234" \
  "planner"

# Remove a user:
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py remove client-abc

# Check logs:
tail -f ~/.openclaw/workspace/omni-hub/whatsapp-router.log
```

---

## 🧠 QMD Integration

### Saving to Memory

Send a message like:
```
Save to memory: The client prefers blue over green for the dashboard
```

The router will:
1. Create a memory file in the user's workspace
2. Index it with QMD
3. Return confirmation

### Searching Memory

Send a message like:
```
Search memory: What color does the client prefer?
```

The router will:
1. Query QMD for relevant entries
2. Return top results
3. Include source and timestamp

---

## 🔊 Voice Notes

When a user sends a voice note:

1. **Audio saved** to temporary location
2. **Transcribed** using STT (placeholder - needs implementation)
3. **Text routed** to appropriate agent
4. **Original audio** deleted (to save space)

### Implementation Status

- [x] Audio routing logic
- [ ] OpenAI Whisper API integration
- [ ] Local whisper model fallback
- [ ] FFmpeg audio format conversion

---

## 📁 File Structure

```
~/.openclaw/workspace/omni-hub/
├── whatsapp-router.py          # Main router script
├── whatsapp-router-config.json # Phone number mappings
├── whatsapp-router.log         # Audit log
└── README.md                   # This file
```

---

## ⚙️ Configuration

The config file (`whatsapp-router-config.json`) contains:

```json
{
  "version": "1.0",
  "lastUpdated": "2025-03-25T...",
  "whatsappAccounts": {
    "main": "+8618566570937"
  },
  "trusted": {
    "god_mode": {
      "name": "E (God Mode)",
      "phone": "+8618566570937",
      "phone_normalized": "8618566570937",
      "agentAccess": "all",
      "enabled": true
    }
  },
  "sandboxed": {},
  "blocked": [],
  "routing": {
    "defaultAgent": "main",
    "allowUnknown": false,
    "saveUnknownMessages": false
  },
  "features": {
    "transcriptionEnabled": true,
    "qmdIntegration": true,
    "autoSaveToMemory": false
  }
}
```

---

## 🔧 Integration with OpenClaw

### Hooking into OpenClaw WhatsApp System

The router is designed to be called from the OpenClaw gateway when a WhatsApp message is received. Integration points:

1. **Gateway Hook:** Modify `~/.openclaw/openclaw.json` to call the router
2. **Message Handler:** Router returns target agent and workspace
3. **Response:** Gateway sends response back to WhatsApp

### Example Gateway Integration

```json
{
  "channel": "whatsapp",
  "agentId": "whatsapp-router",
  "handler": {
    "script": "~/.openclaw/workspace/omni-hub/whatsapp-router.py",
    "args": ["route", "{{phone}}", "{{message}}"]
  }
}
```

---

## 🧪 Testing

### Test Routing

```bash
# Test god-mode routing:
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py route \
  "+8618566570937" \
  "Test message from E"

# Test sandboxed routing:
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py route \
  "+1234567890" \
  "Test message from Dereck"

# Test blocked number:
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py route \
  "+15555555555" \
  "This should be blocked"
```

### Test QMD Commands

```bash
# Test save to memory:
python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py route \
  "+8618566570937" \
  "Save to memory: Test memory entry from router"
```

---

## 📊 Logging

All routing decisions are logged to:
```
~/.openclaw/workspace/omni-hub/whatsapp-router.log
```

Log format:
```
2025-03-25 23:30:00 | INFO     | WhatsApp Router initialized
2025-03-25 23:30:15 | INFO     | God-mode access: +8618566570937 -> E
2025-03-25 23:30:15 | INFO     | Routed message from +8618566570937 -> main (God-mode access to main)
2025-03-25 23:31:00 | WARNING  | Unknown number (blocked): +15555555555
2025-03-25 23:31:00 | INFO     | Blocked message from +15555555555
```

---

## 🚦 Next Steps

1. **Add Dereck's WhatsApp number:**
   ```bash
   python3 ~/.openclaw/workspace/omni-hub/whatsapp-router.py add-sandbox \
     dereck \
     "Dereck" \
     "<INSERT_DERECK_NUMBER>" \
     "cto"
   ```

2. **Implement audio transcription:**
   - Add OpenAI Whisper API key
   - Install `openai` Python package
   - Update `_transcribe_audio()` method

3. **Gateway integration:**
   - Modify OpenClaw config to call router for incoming WhatsApp messages
   - Test end-to-end flow

4. **Monitor logs:**
   ```bash
   tail -f ~/.openclaw/workspace/omni-hub/whatsapp-router.log
   ```

---

## 🛡️ Security Considerations

- **All unknown numbers are blocked by default** (saves API budget)
- **God-mode is single-user** (E only)
- **Sandboxed users cannot escalate privileges**
- **All actions logged** for audit trail
- **QMD collections isolated** per user/workspace

---

## 📝 Todo

- [ ] Implement actual audio transcription (Whisper API or local)
- [ ] Add rate limiting per phone number
- [ ] Add message history buffer
- [ ] Support group chat routing
- [ ] Add webhook integration for non-OpenClaw systems
- [ ] Add analytics dashboard

---

## 📧 Support

For issues or questions, contact E via WhatsApp at +8618566570937

---

**Built for Omni-Hub Architecture**  
*Caller-ID Bouncer Protocol v1.0*
