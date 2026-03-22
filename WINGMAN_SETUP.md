# Tandem Wingman Setup Checklist

## Current Status
- ✅ OpenClaw Gateway: Running on ws://127.0.0.1:18789
- ✅ Tandem Browser: Running with API on http://127.0.0.1:8765
- ✅ API Token: Generated at ~/.tandem/api-token
- ⚠️ Wingman Connection: Needs configuration

## How to Configure Wingman

### Option 1: In Tandem Settings
1. In Tandem Browser, open Settings (gear icon)
2. Look for "Wingman" or "OpenClaw" section
3. Enter gateway URL: `ws://127.0.0.1:18789`
4. Enter gateway token: `cd0e7665-2b1e-4a7e-81d4-d4aa54d77012`
5. Save and restart Tandem

### Option 2: Configuration File
Check if there's a Tandem config file:
```bash
# Look for config files
ls -la ~/.tandem/
ls -la ~/.config/tandem/
```

### Option 3: Environment Variables
Tandem might need these env vars set:
```bash
OPENCLAW_GATEWAY_URL=ws://127.0.0.1:18789
OPENCLAW_GATEWAY_TOKEN=cd0e7665-2b1e-4a7e-81d4-d4aa54d77012
```

## Testing the Connection

Once configured, test Wingman:
1. Open Tandem Browser
2. Open Wingman panel (right sidebar)
3. Send a test message: "Hello, can you hear me?"
4. Should see response from OpenClaw

## Troubleshooting

If Wingman still doesn't respond:

1. **Check both services are running:**
   ```bash
   ps aux | grep -E "tandem|electron" | grep -v grep
   openclaw gateway status
   ```

2. **Verify gateway accessibility:**
   ```bash
   curl -sS http://127.0.0.1:18789/health
   ```

3. **Check Tandem logs for connection errors:**
   - Look in Tandem's developer console (Ctrl+Shift+I)
   - Check for WebSocket connection errors

4. **Verify API token is correct:**
   ```bash
   cat ~/.tandem/api-token
   cat ~/.openclaw/openclaw.json | jq '.gateway.auth'
   ```

## Next Steps

1. Check Tandem settings for Wingman/OpenClaw configuration
2. If settings exist, configure the gateway URL and token
3. If no settings, check Tandem documentation for setup instructions
4. Restart Tandem after configuration
5. Test Wingman chat

---
*Created: 2026-03-18*
*Gateway: ws://127.0.0.1:18789*
*Token: cd0e7665-2b1e-4a7e-81d4-d4aa54d77012*
