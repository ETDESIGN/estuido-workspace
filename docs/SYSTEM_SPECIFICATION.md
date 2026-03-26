# ESTUDIO System Specification
**Version:** 1.0
**Last Updated:** 2026-03-25
**Purpose:** Full system overview for project brainstorming

---

## 🏛️ System Architecture

### Multi-Agent Hierarchy (4-Manager Topology)

```
                    E (President)
                          ↓
              Dereck (General Manager) 🎯
                          ↓
        ┌─────────┬───────┼───────┬─────────┐
        ↓         ↓       ↓       ↓         ↓
    CTO 🛠️    QA 🔍  Warren 💼  HR 📋   (Subagents)
```

#### Agent Roles

| Agent | Role | Tools | Responsibilities |
|-------|------|-------|------------------|
| **Dereck** (GM) | General Manager | All tools | Orchestration, delegation, system integration |
| **CTO** | Engineering Manager | read, write, edit, exec, sessions_spawn, process | Architecture, implementation, coding |
| **QA** | Quality Manager | read, browser, sessions_list, exec (test only) | Code review, testing, quality gates |
| **Warren** (HR/COO) | Operations Manager | read, sessions_list, cron, exec | System monitoring, budget tracking, health checks |
| **HR** | Human Resources | read, sessions_list, cron, exec | Documentation, agent lifecycle |

### Delegation Protocol

**Dereck NEVER writes code unless explicitly commanded.**
- Routes tasks → CTO via Lobster pipelines
- QA reviews CTO output → PASS/NEEDS_FIX/BLOCKER
- Warren monitors health → alerts on issues
- Boardroom discussion after 2 QA rejections

---

## 🛠️ Installed Tools & Capabilities

### 1. ClawFlows (112 Prebuilt Workflows)
**Status:** ✅ Installed & Active
**Location:** `~/.openclaw/workspace/clawflows`
**CLI:** `clawflows`
**Scheduler:** OpenClaw cron (every 15 min)

**Workflow Categories:**
- **Productivity:** `build-standup`, `block-deep-work`, `build-changelog`
- **Smart Home:** `activate-morning-mode`, `activate-focus-mode`, `activate-sleep-mode`
- **Email/Communication:** `check-email`, `send-morning-briefing`
- **Maintenance:** `backup-important-files`, `audit-subscriptions`, `update-clawflows`
- **Project Management:** `build-nightly-project`, `build-packing-list`
- **Health/Wellness:** Morning/night routines, focus modes

**Commands:**
```bash
clawflows list                    # Browse 112 workflows
clawflows enable <name>           # Enable workflow
clawflows run <name>              # Run manually
clawflows dashboard               # Open dashboard
```

**Currently Enabled:**
- `update-clawflows` — Auto-update ClawFlows
- `build-standup` — Daily standup at 9am

---

### 2. ClawTeam (Multi-Agent Swarm)
**Status:** ✅ Installed
**Location:** `~/.local/bin/clawteam` (via pipx)
**Purpose:** Parallel agent coordination for complex tasks

**Capabilities:**
- Spawn multiple worker agents simultaneously
- Each agent gets own git worktree + tmux window
- File-based transport for communication
- Dashboard for monitoring swarm activity

**Commands:**
```bash
clawteam spawn --team <name> --agent-name <worker> --task "description" --agent openclaw
clawteam launch <template> --team <name> --goal "goal"
clawteam board attach <team>     # Monitor swarm
clawteam team list               # List active teams
clawteam task list <team>        # Show tasks
```

**Use Cases:**
- Parallel feature development (frontend + backend simultaneously)
- Multi-agent research (different agents explore different approaches)
- Swarm testing (multiple agents test different scenarios)

---

### 3. OpenClaw Gateway
**Status:** ✅ Running (PID 41409)
**Port:** 18789 (loopback only)
**Dashboard:** http://127.0.0.1:18789/
**Config:** `~/.openclaw/openclaw.json`

**Integrations:**
- **WhatsApp:** Connected (auto-reconnects)
- **Discord:** ESTUDIO Bot (3 channels linked)
- **Aight App:** iOS client (TTS, reminders, group chats)
- **Google Workspace:** Gmail, Calendar, Drive, Docs, Sheets (via `gog` CLI)
- **Tailscale Funnel:** Public HTTPS (https://estudio.tail06c830.ts.net)
- **ElevenLabs:** Text-to-speech configured

**Plugin System:**
- **Aight Utils:** Bootstrap hooks, group chat RPC, notification prefs
- **Custom skills:** 30+ skills in `workspace/skills/`

---

### 4. Mission Control Dashboard
**Status:** ✅ Running (v1.3.0)
**URL:** http://localhost:4001
**Admin:** admin / Dereck2026!
**API Key:** mc2-b1f86da9e058c65f8a1a4e3c37ac0311

**Features:**
- Agent management interface
- Real-time monitoring
- Configuration UI
- Bi-weekly updates

---

### 5. Memory & Knowledge System

#### Native File-Based Memory
**Location:** `~/.openclaw/workspace/memory/`
**Structure:**
- Daily logs: `2026-03-25.md`
- Decisions: `decisions.md`
- Agent states: `AGENT_STATE.md`

**Commands:**
```bash
./scripts/memory-search.sh "query"      # Search memory
./scripts/memory-get.sh <file> <line>   # Read specific file
./scripts/memory-save.sh "Title" "Content"  # Save to memory
```

#### QMD Search (Advanced)
**Status:** ✅ Working (v1.1.1)
**Collection:** "estudio" — 158 files indexed
**Index:** `~/.cache/qmd/index.sqlite`
**Search Types:** BM25 (fast), Vector (slow), Hybrid

**Commands:**
```bash
qmd search "query"        # BM25 search (recommended)
qmd vsearch "query"       # Vector search
qmd status                # Index health
```

---

### 6. Communication Channels

#### Discord Bot
**Status:** ✅ Configured
**Bot Name:** ESTUDIO
**Linked Channels:** 3 channels
**Features:** Commands, notifications, group chat

#### Google Workspace (via gog CLI)
**Status:** ✅ Connected
**Account:** caneles2hk@gmail.com (AI workspace)
**Services:** Gmail, Calendar, Drive, Docs, Sheets, Contacts

**Commands:**
```bash
gog gmail search 'is:inbox'
gog calendar events primary --from 2026-03-25
gog drive files list
gog docs create --title "Meeting Notes"
```

#### WhatsApp Gateway
**Status:** ✅ Connected
**Features:** Messaging, reminders, status updates

---

### 7. Development Tools

#### KiloCode CLI
**Purpose:** Free coding alternative (cost optimization)
**Usage:** Primary choice for all coding tasks

#### fs-watcher
**Status:** ✅ Running (systemd service)
**Purpose:** Auto-triggers pipelines on file changes
**Monitors:** Tool request files, skill changes

#### Agent Toolkits
**Location:** `workspace/skills/agent-toolkit-*`
- **CTO:** Full development tools
- **QA:** Browser automation, testing tools
- **HR:** Documentation, management tools

---

## 📊 System Constraints

| Resource | Limit | Current | Implication |
|----------|-------|---------|-------------|
| **RAM** | 5GB total | ~2.2GB free | Cannot load models >1GB |
| **Swap** | 3.8GB | 1.7GB used | Performance risk if overloaded |
| **Daily API Budget** | $5.00 | $0.41/day | Well under budget ✅ |
| **Default Model** | qwen/qwen3-4b:free | Free tier | Cost-optimized mode |
| **Backup Model** | kimi-k2.5 (OpenRouter) | Paid | Fallback when needed |

---

## 🎯 Current Active Systems

### Running Services
| Service | Status | Endpoint |
|---------|--------|----------|
| OpenClaw Gateway | ✅ | ws://127.0.0.1:18789 |
| Mission Control | ✅ | http://localhost:4001 |
| fs-watcher | ✅ | systemd service |
| ClawFlows Scheduler | ✅ | OpenClaw cron (*/15 * * * *) |
| Discord Bot | ✅ | ESTUDIO Bot |
| WhatsApp Gateway | ✅ | Connected |
| Tailscale Funnel | ✅ | https://estudio.tail06c830.ts.net |

### Dashboard v2
**Status:** Local dev
**URLs:** http://localhost:3000 (frontend), http://localhost:3002 (API)
**Stack:** Vite + Express
**Features:** Feature complete

---

## 📁 Workspace Structure

```
~/.openclaw/workspace/
├── agents/                 # Agent-specific tasks & workflows
│   ├── TASK-*.md
│   └── WORKFLOW-*.md
├── skills/                 # 30+ OpenClaw skills
│   ├── agent-toolkit-cto/
│   ├── agent-toolkit-qa/
│   ├── discord/
│   ├── fs-watcher/
│   └── manager-hierarchy/
├── memory/                 # Native memory system
│   ├── 2026-03-25.md
│   ├── decisions.md
│   └── AGENT_STATE.md
├── docs/                   # Process documentation
│   ├── PROCESS_*.md
│   └── AGENT_*.md
├── notes/                  # Installation notes, configs
│   ├── CLAWFLOWS_INSTALLED.md
│   ├── CLAWTEAM_PACKS_INSTALLED.md
│   └── DISCORD_CONFIG.md
├── clawflows/              # ClawFlows installation
│   └── workflows/          # 112 workflow definitions
├── scripts/                # Utility scripts
│   ├── memory-search.sh
│   ├── memory-get.sh
│   └── memory-save.sh
├── HEARTBEAT.md            # System health checks
├── MEMORY.md               # Memory system overview
├── SOUL.md                 # Agent personalities
├── IDENTITY.md             # Agent definitions
└── USER.md                 # User (E) preferences
```

---

## 🔄 Workflow Examples

### Example 1: Morning Standup (Automated)
1. **09:00** — ClawFlows `build-standup` runs automatically
2. Generates standup from git commits + tasks
3. Dereck (GM) reads the standup
4. Assigns CTO first task of the day

### Example 2: Feature Development
1. User requests feature → Dereck receives
2. Dereck spawns CTO via Lobster pipeline
3. CTO implements using KiloCode CLI
4. QA reviews using `git-diff-analyzer.sh`
5. If PASS → Dereck approves → User
6. If NEEDS_FIX → Back to CTO (max 2 loops)
7. If 3rd rejection → Boardroom discussion

### Example 3: Parallel Development (ClawTeam)
1. Complex project splits into frontend + backend
2. Dereck uses ClawTeam to spawn 2 workers:
   ```bash
   clawteam spawn --team webapp --agent-name frontend --task "Build React UI" --agent openclaw
   clawteam spawn --team webapp --agent-name backend --task "Build Express API" --agent openclaw
   ```
3. Monitor via `clawteam board attach webapp`
4. Workers coordinate via shared transport

### Example 4: Email Triage
1. Enable workflow: `clawflows enable check-email`
2. Runs daily, scans Gmail for important emails
3. Categorizes: urgent, action-required, FYI
4. Sends summary briefing

---

## 🚀 Project Ideas Compatible with This System

### Category 1: Productivity Automation
- **Smart Calendar Agent:** Auto-schedule meetings, avoid conflicts, send reminders
- **Email Triage Pipeline:** Auto-categorize, draft replies, flag urgent
- **Task Inference:** Read messages, extract action items, create tasks
- **Meeting Notes:** Auto-join calls, transcribe, summarize, extract decisions

### Category 2: Multi-Agent Applications
- **Research Swarm:** Multiple agents explore different sources, merge findings
- **Code Review Army:** Parallel agents review different parts of PR
- **Testing Grid:** Spawn agents to test different browsers/devices simultaneously
- **Content Generation:** Swarm writes articles, other swarm edits, QA approves

### Category 3: Smart Home/Office
- **Presence Detection:** Tailscale + WiFi to detect who's home/office
- **Auto Modes:** Activate focus/sleep/morning modes based on calendar
- **Energy Optimization:** Turn off devices when not needed
- **Meeting Room:** Auto-book, unlock, control lights/temp

### Category 4: Knowledge Management
- **Memory Graph:** Connect all docs/emails/tasks into searchable graph
- **Decision Tracker:** Log every decision with context, rationale, outcome
- **Auto-Documentation:** Read code, generate docs, keep in sync
- **Meeting Intelligence:** Extract action items, decisions, assign tasks

### Category 5: Developer Tools
- **PR Agent:** Auto-review, suggest changes, estimate risk
- **Bug Finder:** Swarm tests different scenarios, reports bugs
- **Refactoring Bot:** Identify code smells, suggest improvements
- **Documentation Generator:** Read git diff, update docs automatically

---

## 📋 Quick Start for Brainstorming

### Question to Ask Another AI:

> "I have a multi-agent AI system with these capabilities:
>
> **Architecture:** 4-manager hierarchy (GM delegates to CTO/QA/Ops agents)
> **Workflows:** 112 prebuilt automations (email, calendar, smart home, standups)
> **Multi-Agent:** Can spawn parallel workers with isolated environments
> **Integrations:** Discord, WhatsApp, Google Workspace, Gmail, Calendar, Drive
> **Memory:** Native file-based + semantic search (QMD) for 158+ docs
> **Development:** KiloCode CLI for coding, fs-watcher for automation
> **Constraints:** 5GB RAM, $5/day budget, cost-optimized mode (free models preferred)
>
> What projects could I build that leverage:
> 1. The multi-agent coordination (ClawTeam swarm)?
> 2. The prebuilt workflows (ClawFlows)?
> 3. The integrations (Gmail, Calendar, Discord)?
> 4. The memory system (searchable knowledge base)?
>
> Focus on practical applications that save time or automate repetitive tasks."

---

## 🔧 Available Commands Reference

### ClawFlows
```bash
clawflows list                    # Browse workflows
clawflows enable <name>           # Enable workflow
clawflows run <name>              # Run manually
clawflows disable <name>          # Disable workflow
clawflows dashboard               # Open dashboard
```

### ClawTeam
```bash
clawteam spawn --team <team> --agent-name <name> --task "task" --agent openclaw
clawteam launch <template> --team <team> --goal "goal"
clawteam board attach <team>      # Monitor swarm
clawteam team list                # List teams
clawteam task list <team>         # Show tasks
```

### Memory
```bash
./scripts/memory-search.sh "query"
./scripts/memory-get.sh <file> <line>
./scripts/memory-save.sh "Title" "Content"
```

### QMD Search
```bash
qmd search "query"                # BM25 search
qmd vsearch "query"               # Vector search
qmd status                        # Index health
```

### Google Workspace
```bash
gog gmail search 'is:inbox'
gog calendar events primary --from 2026-03-25
gog drive files list
```

---

## 📞 Contact & Support

**System Owner:** E (President)
**GM:** Dereck 🎯
**Workspace:** `~/.openclaw/workspace/`
**Documentation:** `docs/`, `notes/`, `MEMORY.md`

**Last System Review:** 2026-03-25
**Next Review:** 2026-04-08 (bi-weekly)

---

*This specification is maintained in `docs/SYSTEM_SPECIFICATION.md`*
*Update when tools/agents/capabilities change*
