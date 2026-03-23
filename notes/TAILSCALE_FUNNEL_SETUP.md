# Tailscale Funnel Setup Guide
**Purpose:** Expose OpenClaw gateway to Aight app through Tailscale
**Status:** ⏸️ Awaiting user action (tailnet admin approval)

---

## 🎯 What We're Doing

**Problem:** Aight app can't discover gateway due to VPNs on both devices
**Solution:** Use Tailscale Funnel to expose gateway through Tailscale's network
**Benefit:** Works through any VPN, no iOS config changes needed

---

## 📋 Step 1: Enable Tailscale Funnel (USER ACTION REQUIRED)

Tailscale Funnel must be enabled by the tailnet admin first.

**URL to visit:** https://login.tailscale.com/f/funnel?node=nhrokF7evm11CNTRL

**Steps:**
1. Click the link above (opens Tailscale admin console)
2. Review the Funnel permissions and security notice
3. Click "Enable Funnel" to activate
4. Wait 10-20 seconds for activation

**After enabling:**
- Funnel will be available on your tailnet
- You can expose local services to the internet
- TLS/SSL is handled automatically by Tailscale

---

## 🚀 Step 2: Expose the Gateway (After Funnel Enabled)

Once Funnel is enabled, run this command:

```bash
tailscale funnel --bg 18789
```

**What this does:**
- Exposes port 18789 (OpenClaw gateway) on your tailnet
- Runs in background (`--bg`)
- Uses HTTPS automatically (Tailscale handles TLS)
- Creates a public URL like `https://estudio.ts.net` or similar

---

## 📱 Step 3: Connect Aight App

Once gateway is exposed:

1. **Get your Tailscale URL:**
   ```bash
   tailscale funnel status
   ```
   Look for the URL like `https://estudio.tailnet-name.ts.net`

2. **In Aight app:**
   - Tap "Configure Gateway"
   - Enter URL: `https://your-tailnet-url.ts.net`
   - Port: `443` (HTTPS)
   - Tap "Connect"

3. **Verify connection:**
   - Aight should show "Connected"
   - Test by creating a reminder from the app

---

## ✅ Verification Commands

**Check Funnel status:**
```bash
tailscale funnel status
```

**Check what's exposed:**
```bash
tailscale status --json | jq '.Funnel'
```

**View Funnel logs:**
```bash
journalctl -u tailscaled -f | grep funnel
```

**Stop Funnel (if needed):**
```bash
tailscale funnel reset
```

---

## 🔒 Security Notes

**Tailscale Funnel is secure because:**
- ✅ TLS/SSL encryption (handled by Tailscale)
- ✅ Authentication required (only authenticated devices can connect)
- ✅ DDoS protection (Tailscale's infrastructure)
- ✅ No open ports on your router (uses existing Tailscale connection)
- ✅ You control what's exposed (only port 18789)

**Best practices:**
- Only expose necessary ports
- Keep Tailscale updated
- Monitor Funnel status regularly
- Disable Funnel when not in use

---

## 📊 Current Status

**Tailscale:** ✅ Installed and connected
**Tailscale IP:** `100.89.163.71`
**Hostname:** `estudio`
**Tailnet Account:** `etiawork@gmail.com`

**Gateway:** ✅ Running on port 18789
**Funnel:** ⏸️ Pending tailnet admin approval

**Aight Plugin:** ✅ Installed (`@aight-cool/aight-utils` v0.1.21)

---

## 🔄 Alternative: Tailscale Serve (Tailnet-Only)

If you don't want to expose the gateway publicly, use `tailscale serve` instead:

```bash
# Expose only within your tailnet (private)
tailscale serve --bg 18789

# Connect from Aight using Tailscale IP
# URL: http://100.89.163.71:18789
```

**Trade-offs:**
- ✅ More private (only your devices)
- ❌ Requires Aight app to be on Tailscale network
- ❌ Can't use when away from your devices

---

## 📝 What Happens After Setup

**Once Funnel is working:**
1. ✅ Aight app connects from anywhere (even through Clash VPN)
2. ✅ Push notifications work
3. ✅ Reminders sync to Today view
4. ✅ Tasks can be created from app
5. ✅ Shortcuts accessible from iOS

**Gateway remains:**
- ✅ Accessible via LAN (192.168.x.x:18789)
- ✅ Accessible via Tailscale Funnel (https://estudio.ts.net)
- ✅ All existing connections work (Discord, WhatsApp, etc.)

---

## 🆘 Troubleshooting

**Funnel won't start:**
```bash
# Check if Funnel is enabled on tailnet
tailscale funnel status

# Check Tailscale connection
tailscale status

# Restart Funnel
tailscale funnel reset
tailscale funnel --bg 18789
```

**Aight can't connect:**
- Verify Funnel status: `tailscale funnel status`
- Check gateway is running: `openclaw status`
- Try URL in browser: `https://your-tailnet-url.ts.net`
- Check firewall rules (port 443, 18789)

**Gateway not accessible:**
```bash
# Restart gateway
openclaw gateway restart

# Check logs
openclaw logs
```

---

## 📚 Next Steps

1. ⏸️ **User:** Visit https://login.tailscale.com/f/funnel?node=nhrokF7evm11CNTRL to enable Funnel
2. ⏸️ **Dereck:** Run `tailscale funnel --bg 18789` after enabled
3. ⏸️ **Dereck:** Update credentials/REGISTRY.md with Funnel URL
4. ⏸️ **Dereck:** Test Aight app connection
5. ⏸️ **Dereck:** Document final setup

---

**Created:** 2026-03-23 23:05
**Last Updated:** 2026-03-23 23:05
**Status:** ⏸️ Waiting for user to enable Funnel on tailnet
