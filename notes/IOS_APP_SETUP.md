# iOS App Connection Setup

**Last Updated:** 2026-03-23 03:34 AM
**For:** Aight & OpenClaw Voice Companion

---

## ✅ Gateway Status

| Setting | Value |
|---------|-------|
| **Status** | ✅ Running |
| **Local IP** | 192.168.10.105 |
| **Port** | 18789 |
| **Auth Mode** | Token Required |
| **Auth Token** | `cd0e7665-2b1e-4a7e-81d4-d4aa54d77012` |
| **Network Binding** | LAN (accessible from local network) |

---

## 📱 iOS App Setup Instructions

### Step 1: Install from TestFlight

1. **Open TestFlight** on your iPhone
2. **Accept invitation** for:
   - **Aight** (Full client): https://testflight.apple.com/join/cutCZt5s
   - **Voice Companion**: https://testflight.apple.com/join/f1GCNSrZ
3. **Install the app**

### Step 2: Configure Server Connection

**In the iOS app settings:**

**Server URL (choose one):**

```
Option 1 (Local Network):
http://192.168.10.105:18789

Option 2 (If on same machine):
http://localhost:18789

Option 3 (via mDNS/Bonjour):
http://openclaw.local:18789
```

**Auth Token:**
```
cd0e7665-2b1e-4a7e-81d4-d4aa54d77012
```

### Step 3: Test Connection

1. **Open the iOS app**
2. **Go to Settings** → Server Configuration
3. **Enter Server URL** (use `http://192.168.10.105:18789`)
4. **Enter Auth Token** (paste the token above)
5. **Tap "Connect"**

---

## 🚨 Troubleshooting

### "Can't Connect" Errors

**Check 1: Same Network?**
- iPhone must be on the **same WiFi** as the machine running OpenClaw
- If not, use Tailscale VPN or set up port forwarding

**Check 2: Firewall Blocking?**
- Run this command to allow connections:
```bash
sudo ufw allow 18789/tcp
```

**Check 3: Gateway Running?**
- Check if gateway is listening:
```bash
ss -tuln | grep 18789
```
- Should show: `tcp LISTEN 0 0.0.0.0:18789`

**Check 4: Correct URL?**
- Make sure URL includes `http://` (not https unless you set up TLS)
- Don't add trailing slash: `http://192.168.10.105:18789` ✅
- Wrong: `http://192.168.10.105:18789/` ❌

**Check 5: Correct Token?**
- Token must be exact: `cd0e7665-2b1e-4a7e-81d4-d4aa54d77012`
- No extra spaces
- Copy-paste from this file

### "Authentication Failed" Error

- Double-check the auth token
- Make sure you're using the **gateway token**, not an API key
- Token is case-sensitive

### "Connection Timeout"

- iPhone on different network? → Use same WiFi
- Gateway not running? → Check with `openclaw status`
- Firewall blocking? → Allow port 18789

---

## 🌐 Remote Access (Outside Home Network)

### Option 1: Tailscale VPN (Recommended)

1. **Install Tailscale** on both:
   - The machine running OpenClaw
   - Your iPhone

2. **Connect both** to the same Tailscale network

3. **Use Tailscale IP** in iOS app:
```bash
# Get Tailscale IP
tailscale ip -4
```

4. **Server URL becomes:**
```
http://<tailscale-ip>:18789
```

### Option 2: Port Forwarding (Advanced)

1. **Forward port 18789** on your router to the OpenClaw machine
2. **Use public IP** or domain name
3. **⚠️ Security Risk:** Only do this if you understand the risks

---

## 📋 Quick Reference Card

| Field | Value |
|-------|-------|
| **Server URL (LAN)** | `http://192.168.10.105:18789` |
| **Server URL (localhost)** | `http://localhost:18789` |
| **Auth Token** | `cd0e7665-2b1e-4a7e-81d4-d4aa54d77012` |
| **Port** | 18789 |
| **Protocol** | HTTP (not HTTPS) |

---

## 🔒 Security Notes

- ⚠️ **This token gives full access** to your OpenClaw instance
- 📱 **Don't share** the token publicly
- 🔐 **Keep iOS device locked** when not in use
- 🔄 **Regenerate token** if compromised:
  ```bash
  # Edit openclaw.json and change gateway.auth.token
  openclaw gateway restart
  ```

---

## ✅ Success Checklist

- [ ] TestFlight app installed
- [ ] Server URL entered correctly
- [ ] Auth token entered correctly
- [ ] iPhone on same WiFi as OpenClaw machine
- [ ] Connection successful
- [ ] Can send/receive messages

---

**Still can't connect?**

1. Check gateway is running: `openclaw status`
2. Check firewall: `sudo ufw status`
3. Check network: Can you ping 192.168.10.105 from iPhone?
4. Check logs: `journalctl -u openclaw-gateway -f`

**Last resort:** Send me a screenshot of the error message and I'll help debug.
