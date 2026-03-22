# Tandem Wingman Connection Issue - Diagnosis

## Problem Identified

Tandem cannot connect to OpenClaw because of an API endpoint mismatch.

### What Tandem Expects:
- Endpoint: `http://127.0.0.1:18789/v1/status`
- Response format:
```json
{
  "gateway": {
    "hooks": {
      "token": "cd0e7665-2b1e-4a7e-81d4-d4aa54d77012"
    }
  }
}
```

### What OpenClaw Provides:
- Endpoint: `http://127.0.0.1:18789/health` ✅
- Response: `{"ok":true,"status":"live"}` ✅
- Missing: `/v1/status` endpoint ❌

## Root Cause

Tandem's `openclaw-detect.ts` (line 18-22) calls:
```typescript
const url = `http://127.0.0.1:${WEBHOOK_PORT}/v1/status`;
```

But OpenClaw doesn't have a `/v1/` API prefix.

## Solution Options

### Option 1: Add Proxy Route (Recommended)
Create a simple proxy that adds the `/v1/status` endpoint:

```bash
# Add to OpenClaw config or create a micro-proxy
# Maps /v1/status to /health with gateway info
```

### Option 2: Use Webhook Direct
Skip auto-detection, configure Tandem to use webhook directly:
- Webhook URL: Already configured correctly ✅
- Webhook secret: Already configured ✅
- Issue: Wingman panel might not be using the webhook

### Option 3: Check Tandem Version
This might be fixed in a newer Tandem version. Current: v0.62.4

## Current Status
- ✅ OpenClaw Gateway: Running
- ✅ Tandem: Running
- ✅ Tandem API: Working
- ✅ Webhook configured: token set
- ❌ Wingman panel: Cannot detect OpenClaw (API mismatch)

## Next Steps
1. Tandem's Wingman chat may need to use the configured webhook instead of auto-detection
2. Check if there's a "Manual Connect" option in Wingman settings
3. Or wait for Tandem update that supports OpenClaw's current API structure

---
*Diagnosed: 2026-03-18 01:38*
