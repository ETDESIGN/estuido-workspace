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

**Status:** Working (v1.0.8)
**Location:** ~/.local/bin/qmd (symlink to ~/.bun/bin/qmd)
**Index:** ~/.cache/qmd/index.sqlite (4.8MB)
**Collection:** "estudio" (158 files indexed)

**Working Commands:**
```bash
qmd search "query"              # BM25 only (fast)
qmd collection list             # Show all collections
qmd status                      # Index health
qmd get "file.md:10" -l 20      # Read file section
```

**Notes:**
- Embeddings use local embeddinggemma (314MB)
- Query expansion model NOT loaded (1.2GB, too heavy for 5GB RAM)
- Runs on CPU (no CUDA support on this system)
- First run compiles node-llama-cpp from source (~3 min)

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
