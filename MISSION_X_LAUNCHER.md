# Mission X Launcher

**Mission Control Dashboard Desktop Launcher**

---

## 🚀 What is Mission X?

Mission X is your desktop launcher for the OpenClaw Mission Control Dashboard. It provides:
- ✅ **One-click launch** - Opens Mission Control in your browser
- ✅ **Auto-start** - Starts the service if it's not running
- ✅ **Custom icon** - Cool "X" logo with constellation pattern
- ✅ **Smart checks** - Verifies the dashboard is ready before opening

---

## 📍 Files Created

| File | Location | Purpose |
|------|----------|---------|
| **Desktop Entry** | `~/.local/share/applications/mission-x.desktop` | System launcher |
| **Desktop Shortcut** | `~/Desktop/mission-x.desktop` | Desktop icon |
| **Launcher Script** | `~/.local/bin/launch-mission-x` | Smart launcher |
| **Custom Icon** | `~/.local/share/icons/mission-x.svg` | Mission X logo |

---

## 🎯 How to Use

### Desktop Icon
1. Look for **Mission X** on your desktop
2. Double-click the icon
3. Dashboard opens automatically in your browser

### Application Menu
1. Press **Super** (Windows key) or click **Activities**
2. Search for "Mission X"
3. Click to launch

### Command Line
```bash
# From anywhere
launch-mission-x

# Or use the desktop file
gtk-launch mission-x
```

---

## 🎨 Icon Design

The Mission X icon features:
- **Dark gradient background** (#0A0E1A → #1a1a2e)
- **Neon green X** (#00ff88) representing mission/coordination
- **Constellation dots** symbolizing agent networks
- **Circular frame** for unified control

---

## 🔧 What the Launcher Does

The smart launcher (`~/.local/bin/launch-mission-x`) performs these steps:

1. ✅ **Check if running** - Verifies if Mission Control service is active
2. 🔄 **Start if needed** - Launches the service with `systemctl --user start mission-control`
3. ⏳ **Wait for ready** - Polls `http://localhost:4001` until it responds
4. 🌐 **Open browser** - Launches your default browser to the dashboard
5. 💬 **Status messages** - Shows progress in terminal (if launched from CLI)

---

## 🔐 Dashboard Login

When the dashboard opens:
- **URL:** http://localhost:4001/
- **Username:** `admin`
- **Password:** `Dereck2026!`

---

## 🛠️ Management Commands

```bash
# Check if Mission Control is running
systemctl --user status mission-control

# Start manually
systemctl --user start mission-control

# Stop the service
systemctl --user stop mission-control

# Restart the service
systemctl --user restart mission-control

# View logs
journalctl --user -u mission-control -f

# Enable auto-start on login
systemctl --user enable mission-control

# Disable auto-start
systemctl --user disable mission-control
```

---

## 📝 Customization

### Change Icon
Edit the desktop entry:
```bash
nano ~/.local/share/applications/mission-x.desktop
```
Change the `Icon=` line to point to a different icon file.

### Change Name or Comment
Edit the `Name=` or `Comment=` lines in the desktop entry.

### Add to Dock/Favorites
- **GNOME:** Right-click icon → "Add to Favorites"
- **KDE:** Right-click → "Edit Application" → "Place in system tray"
- **XFCE:** Right-click → "Add to panel"

---

## 🐛 Troubleshooting

### Icon doesn't appear
1. Log out and log back in (desktop entries refresh on login)
2. Or run: `update-desktop-database ~/.local/share/applications`

### Dashboard won't open
1. Check if service is running: `systemctl --user status mission-control`
2. Check port 4001: `ss -tlnp | grep 4001`
3. View logs: `journalctl --user -u mission-control -n 50`

### Browser doesn't open
1. Verify `xdg-open` works: `xdg-open http://example.com`
2. Set default browser: `xdg-settings set default-web-browser`

---

## 📦 File Locations Summary

```
~/.local/share/applications/mission-x.desktop  # System launcher
~/.local/bin/launch-mission-x                   # Smart launcher script
~/.local/share/icons/mission-x.svg              # Custom icon
~/Desktop/mission-x.desktop                     # Desktop shortcut
```

---

## ✨ Features

- **Smart startup** - Checks if service is running before opening browser
- **Auto-recovery** - Starts service automatically if it's down
- **Health check** - Waits for dashboard to be ready before launching browser
- **Cross-desktop** - Works with GNOME, KDE, XFCE, and other Linux desktops
- **Beautiful branding** - Custom "Mission X" identity

---

**Created:** 2026-03-17
**Version:** 1.0
**Status:** ✅ Active and ready to use

---

*Double-click the Mission X icon on your desktop to launch! 🚀*
