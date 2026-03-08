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

**Status:** Running ✅
**Location:** `/home/e/.openclaw/workspace/mission-control`
**URL:** http://127.0.0.1:4001
**Version:** 1.3.0
**Admin:** admin / Dereck2026!
**API Key:** DY7rWOy8XDZN47mocEM5jO9WY3oeUDVF

**Update Check:** Bi-weekly (Saturdays 9 AM PST) via cron

---

## OpenClaw Gateway

**Status:** Running on localhost:18789
**WhatsApp:** Connected (flaps occasionally, auto-reconnects)
**Cost Today:** $0.41 / $5.00 threshold

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
