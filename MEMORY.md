# 🧠 ESTUDIO Memory System

**Status:** ACTIVE (Native File-Based)  
**Last Updated:** 2026-02-20  
**Owner:** All Agents

---

## How to Use Memory

### For Agents (Dereck, CTO, QA, etc.)

**Search memory:**
```bash
./scripts/memory-search.sh "dashboard architecture"
```

**Get specific file:**
```bash
./scripts/memory-get.sh docs/PROCESS_ARCHITECTURE_VALIDATION.md
./scripts/memory-get.sh memory/2026-02-16.md 1 30
```

**Save new memory:**
```bash
./scripts/memory-save.sh "Decision: Use Express" "We chose Express over Next.js for backend API"
```

---

## Memory Structure

```
workspace/
├── MEMORY.md                    ← This file - system overview
├── memory/
│   ├── 2026-02-16.md           ← Daily logs
│   ├── 2026-02-17.md
│   ├── AGENT_STATE.md          ← Agent configurations
│   ├── decisions.md            ← Key decisions log
│   └── ...
├── docs/
│   ├── PROCESS_*.md            ← Process documentation
│   ├── AGENT_*.md              ← Agent workflows
│   └── ...
└── agents/
    ├── TASK-*.md               ← Task definitions
    └── WORKFLOW_*.md           ← Team workflows
```

---

## What to Remember

### Save to Memory When:
- ✅ Important decisions made
- ✅ Architecture changes
- ✅ New processes established
- ✅ Lessons learned from mistakes
- ✅ Agent role/tool changes

### Search Memory When:
- 🔍 Starting new task (check previous similar work)
- 🔍 Making decisions (what did we decide before?)
- 🔍 Debugging issues (have we seen this error?)
- 🔍 Onboarding context (what's the current state?)

---

## Key Memories (Curated)

### Architecture Decisions
| Date | Decision | Context |
|------|----------|---------|
| 2026-02-20 | Express backend for dashboard | E's frontend (Vite) + separate API |
| 2026-02-20 | Tool Request Pipeline | Self-service agent tool access |
| 2026-02-20 | ARCH checkpoint | Required before coding starts |

### Active Systems
| System | Status | Location | Notes |
|--------|--------|----------|-------|
| **4-Manager Hierarchy** | ✅ OPERATIONAL | CTO, QA, Warren, GM | Phase 5-6 complete |
| Mission Control (builderz) | Running ✅ | localhost:4001 (primary) | Version 1.3.0 |
| Mission Control (old) | Discontinued | Was localhost:4000 | Legacy |
| Command Center | Discontinued | Was localhost:3333 | Replaced |
| Dashboard v2 | Local dev | localhost:3000 + :3002 | Feature complete |
| Backend API | Running | Express on :3002 | Active |
| Tool Pipeline | Active | FS-watcher monitoring | Auto-triggers |
| Cost Monitor | Active | Cron every hour | $0.41/day |
| QMD Search | Active | ~/.cache/qmd/index.sqlite | BM25 + vectors |
| WhatsApp Gateway | Connected | OpenClaw gateway | Auto-reconnects |
| **Discord Bot** | ✅ Configured | ESTUDIO Bot | 3 channels linked |
| **Google Workspace** | ✅ Connected | caneles2hk@gmail.com | Gmail, Calendar, Drive, Docs, Sheets |

### Active Project Ideas
| Date | Idea | Status |
|------|------|--------|
| 2026-03-03 | Reverse Beautify App - unbeautify photos, detect modifications, recreate originals | New |
| 2026-03-12 | Model Config: Kimi-OR primary, MiniMax fallback | E moving away from moonshotai direct |

### Discontinued
| System | Status | Notes |
|--------|--------|-------|
| NB Studio | DISCONTINUED | March 2, 2026 - see Mission Control/Command Center |

### System Constraints (Important!)
| Resource | Limit | Implication |
|----------|-------|-------------|
| RAM | 5GB total, 2.2GB free | Cannot run models >1GB |
| Swap | 1.7GB used | Performance risk |
| Daily API Budget | $5.00 | Currently $0.41 ✅ |
| Brave Search | Rate limited | Need Tavily backup |

### Agent Tool Access
| Role | Standard Tools | Request Process |
|------|---------------|-----------------|
| CTO | read, write, edit, exec, sessions_list, process | Auto-approved |
| QA | read, browser, sessions_list | Auto-approved |
| HR/COO | read, sessions_list, cron, exec | Auto-approved |
| GM | All | N/A |

---

## Memory vs Documentation

| Type | Location | Update Frequency | Owner |
|------|----------|-----------------|-------|
| **Memory** | `memory/` | Daily/as needed | All agents |
| **Docs** | `docs/` | When process changes | GM/HR |
| **Tasks** | `agents/TASK-*.md` | Per task | Assignee |
| **Config** | `config/` | Rarely | GM |

---

## QMD Status (Updated 2026-02-20)

**Status:** ✅ WORKING (v1.0.8)
**Collection:** "estudio" — 158 files indexed
**Embeddings:** 159 chunks (embeddinggemma 314MB)
**Search:** BM25 ✅ | Vector ✅ | Hybrid ⚠️

**Important:** QMD doesn't have OpenRouter support for embeddings. Uses local GGUF models only. Query expansion model (1.2GB) NOT loaded due to RAM constraints.

**Working Commands:**
```bash
qmd search "query"        # BM25 only (fast, recommended)
qmd vsearch "query"       # Vector (loads model, slow)
qmd collection list       # Show collections
qmd status                # Index health
```

---

## Migration Notes

**From:** Hybrid system (QMD + native + disabled Super Memory)  
**To:** Native file-based + QMD hybrid

**Evolution:**
- 2026-02-16: QMD broken (stub npm package), switched to native
- 2026-02-20: QMD fixed (built from source), now hybrid system
- Super Memory disabled (API keys, was breaking)

**Current Architecture:**
- **Native search:** `memory_search` tool (semantic, fast)
- **QMD:** BM25 + local embeddings for advanced queries
- **Best of both:** Native for quick recall, QMD for complex search

**Future:** Evaluate Mem0 or keep hybrid if stable

---

## Quick Reference

```bash
# Search everything
./scripts/memory-search.sh "query"

# Read file
./scripts/memory-get.sh filename.md

# Save decision
./scripts/memory-save.sh "Title" "Content"

# Today's log
cat memory/$(date +%Y-%m-%d).md
```

---

*This is your long-term memory. If it's not written here, it didn't happen.*
