# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Mem0 (Cloud Memory)

**Status:** ✅ Working (2026-03-11)
**Key:** m0-GouLJkFH7qy7Z5TDpZdcMPpCjWObCYCuHOZI26Qi
**Auth:** `Token <key>` (header format)
**Usage:** Semantic memory search + cross-session continuity

---

## Discord Bot (ESTUDIO Bot)

**Status:** ✅ Configured (2026-03-21)
**Config:** `/home/e/.openclaw/workspace/notes/DISCORD_CONFIG.md`
**Token:** [REDACTED - See openclaw.json]
**Permissions:** 8866461766385655 (Most enabled)
**Linked Channels:** 3 channels configured
**Gateway:** Restart required after config changes

**IMPORTANT:** This has been forgotten 3 times in 4 weeks. DON'T FORGET AGAIN!

---

## Google Workspace (Gog CLI)

**Status:** ✅ Installed & Authenticated (2026-03-21)
**Binary:** /usr/local/bin/gog (v0.12.0)
**Account:** caneles2hk@gmail.com (AI workspace)
**Personal:** etiawork@gmail.com (E's inbox)
**Config:** `/home/e/.openclaw/workspace/notes/GOOGLE_WORKSPACE_CONFIG.md`

**Services Enabled:**
- Gmail (read, send, search, organize)
- Google Calendar (events, scheduling)
- Google Drive (files, folders)
- Google Docs (create, edit)
- Google Sheets (create, edit, analyze)
- Google Contacts (manage)

**OAuth:**
- Client ID: 139608939133-arjp9dcglkl419qtse1s53kuol7tdpm8.apps.googleusercontent.com
- Project: clawboatapi
- Credentials: /home/e/.openclaw/client_secret.json
- Token Storage: ~/.config/gogcli/credentials.json

**Usage Examples:**
```bash
gog gmail search 'is:inbox' --max 10
gog gmail send --to@example.com --subject "Test" --body "Hello"
gog calendar events primary --from 2026-03-22 --to 2026-03-29
gog drive files list --query 'name contains "report"'
```

---

## Default Models (Updated 2026-03-12)

| Model | Provider | Status | Use |
|-------|----------|--------|-----|
| **Kimi-OR** | OpenRouter | PRIMARY | `openrouter/moonshotai/kimi-k2.5` |
| **MiniMax** | OpenRouter | FALLBACK | `openrouter/minimax/minimax-m2.5` |
| Groq-Llama | Groq | FREE | Free tier |
| Qwen 8B | OpenRouter | FREE | Free tier |

**Note:** E moving away from moonshotai direct key. Config updated to use OpenRouter for both.

---

## QMD (Local Search)

**Status:** Working (v1.1.1) ✅ FIXED 2026-03-08
**Location:** ~/.local/bin/qmd → ~/.local/qmd/dist/qmd.js
**Index:** ~/.cache/qmd/index.sqlite (72KB, needs re-indexing)
**Collection:** "estudio" (0 files - needs re-indexing)

**Working Commands:**
```bash
qmd search "query"              # BM25 + vector (runs on CPU)
qmd collection list             # Show all collections
qmd status                      # Index health
qmd get "file.md:10" -l 20      # Read file section
qmd index ~/.cache/qmd/estudio/ --pattern "**/*.md"  # Re-index
```

**Notes:**
- Originally installed in /tmp/qmd (cleared on reboot)
- Now installed to ~/.local/qmd/ (persistent)
- Runs on CPU (no CUDA) - slower but works
- Re-index needed after QMD fix

---

## System Resources

| Resource | Spec | Available | Notes |
|----------|------|-----------|-------|
| RAM | 5GB | ~2.2GB | Chrome + WhatsApp use 3GB+ |
| Swap | 3.8GB | 1.7GB used | Swap thrashing risk |
| CPU | 4 cores | — | Sufficient for most tasks |
| Disk | — | — | No issues |

**RAM Safety Limits:**
- <500MB: Safe to run
- 500MB-1GB: Monitor closely
- >1GB: Ask user first

---

## Mission Control (builderz-labs)

### Instance 1: OLD (port 3000)
- **Location:** `/home/e/mission-control`
- **Version:** 1.2.0
- **URL:** http://localhost:3000
- **Status:** Running (legacy, some features disconnected)
- **Auth:** admin / (check .env)

### Instance 2: NEW (port 4001) ✅ CURRENT
- **Location:** `/home/e/mission-control-new`
- **Version:** 1.3.0 (latest from GitHub)
- **URL:** http://localhost:4001
- **Admin:** admin / Dereck2026!
- **API Key:** mc2-b1f86da9e058c65f8a1a4e3c37ac0311
- **Gateway:** ws://127.0.0.1:18789
- **Start command:** `cd /home/e/mission-control-new && PORT=4001 pnpm dev`

**Update Check:** Bi-weekly (Saturdays 9 AM PST) via cron

---

## OpenClaw Gateway

**Status:** Running on localhost:18789
**WhatsApp:** Connected (flaps occasionally, auto-reconnects)
**Cost Today:** $0.41 / $5.00 threshold

---

## Media Archive (Images & Audio)

**Status:** ✅ Working (2026-03-23)
**Script:** `~/openclaw/workspace/scripts/archive-media.sh`
**Archive Location:** `~/openclaw/workspace/archive/`

**Purpose:** Copy inbound media from gateway to workspace so I can analyze it

**Usage:**
```bash
./scripts/archive-media.sh
# Copies all images/audio from ~/.openclaw/media/inbound/ to workspace/archive/
# Adds timestamps: image-20260323-060743.png
```

**Directory Structure:**
```
archive/
├── images/  # PNG, JPG, GIF, WebP
└── audio/   # MP3, WAV, M4A, OGG
```

**Note:** Gateway stores media outside workspace (sandbox restriction). Run this script after receiving images/audio to archive them for analysis.

---

## Power Skills (Zero-RAM Tools)
**Location:** `/home/e/nb-studio/scripts/`

### git-diff-analyzer.sh (For QA)
**Purpose:** Compressed, token-friendly git diff for QA review
```bash
./git-diff-analyzer.sh [file_pattern]
# Outputs: git diff -U1 (1 line context only), no index/@@ lines
# Saves tokens vs reading full files
```

### ram-survival.sh (For Warren)
**Purpose:** Emergency RAM clearance when below 300MB
```bash
./ram-survival.sh
# Checks free RAM, clears caches if critical
# Essential for 2.2GB available limit
```

### ast-mapper.sh (For CTO)
**Purpose:** Extract function signatures without reading full files
```bash
./ast-mapper.sh <directory>
# Outputs: function/class/const definitions only
# Use for codebase mapping without token overhead
```

**Note:** All scripts are executable and owned by user `e`

---

Add whatever helps you do your job. This is your cheat sheet.
