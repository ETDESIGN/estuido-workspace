# ESTUDIO OpenClaw System - Comprehensive Audit Report
**Date:** 2026-03-09  
**Audited by:** Dereck (GM)  
**Version:** 1.0 - Complete System Architecture  

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Organization Hierarchy](#2-organization-hierarchy)
3. [Agent Architecture](#3-agent-architecture)
4. [Infrastructure Overview](#4-infrastructure-overview)
5. [OpenClaw Configuration](#5-openclaw-configuration)
6. [Agent Pipeline (CTO↔QA)](#6-agent-pipeline-ctoqa)
7. [Cost Management System](#7-cost-management-system)
8. [Memory & Context System](#8-memory--context-system)
9. [Communication Channels](#9-communication-channels)
10. [Monitoring & Heartbeats](#10-monitoring--heartbeats)
11. [Tool Access & Permissions](#11-tool-access--permissions)
12. [Scheduled Tasks (Cron)](#12-scheduled-tasks-cron)
13. [Security Profile](#13-security-profile)
14. [System Constraints](#14-system-constraints)
15. [Active Projects & Backlog](#15-active-projects--backlog)
16. [Quick Reference Commands](#16-quick-reference-commands)

---

## 1. EXECUTIVE SUMMARY

### What This System Is
ESTUDIO operates a multi-agent OpenClaw deployment for AI-assisted software development, operations management, and workflow automation. The system uses a hierarchy of specialized agents reporting to a human president (E).

### Core Philosophy
- **Cost-first:** Maximize free tier usage (KiloCode CLI, GLM-5)
- **Token-efficient:** Minimize context, maximize value per token
- **Background-first:** Silent tasks preferred over interactive
- **Zero-RAM operations:** 5GB constraint, no local models >1GB

### Current Status (March 9, 2026)
| Metric | Value |
|--------|-------|
| Daily API Spend | $0.00 / $5.00 threshold |
| Active Subagents | 0 |
| System Uptime | Stable |
| Cost Tracking | ✅ Fixed (12:00 & 18:00 cron) |
| fs-watcher | ✅ Running (PID 291924) |

---

## 2. ORGANIZATION HIERARCHY

```
ESTUDIO ORGANIZATION

                         E (President)
                    Human - Final Authority
                    Owner: +8618566570937
                            │
                            ▼
              DERECK (GM - General Manager)
         Strategy, Delegation, Quality, Architecture
              Reports To: E
              Models: Kimi K2.5, Gemini Flash
              Session: agent:main:main
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
  ┌───────────┐      ┌───────────┐      ┌───────────┐
  │  WARREN   │      │    CTO    │      │    QA     │
  │   (COO)   │      │   (Dev)   │      │  (Review) │
  │           │      │           │      │           │
  │ Cost      │      │ Code      │      │ Test      │
  │ Monitor   │      │ Build     │      │ Validate  │
  │ Operations│      │ Features  │      │ Report    │
  └───────────┘      └───────────┘      └───────────┘
        $0                $0              ~$0.02
```

### Agent Details

| Agent | ID | Role | Reports To | Status | Cost |
|-------|-----|------|------------|--------|------|
| **Dereck** | `main` | General Manager | E | Active | ~$0.10-0.30/day |
| **CTO** | `cto` | Lead Developer | GM | Ready | $0 (free tier) |
| **QA** | `qa` | QA Engineer | GM | Ready | ~$0.01-0.02/review |
| **Warren** | N/A | COO | GM | Automated | $0 |

---

## 3. AGENT ARCHITECTURE

### 3.1 Agent Configuration Files

| Agent | Config File | Persona File | Toolkit |
|-------|-------------|--------------|---------|
| CTO | `agents/cto.json` | `agents/CTO.md` | `skills/agent-toolkit-cto/SKILL.md` |
| QA | `agents/qa.json` | `agents/QA.md` | `skills/agent-toolkit-qa/SKILL.md` |

### 3.2 CTO Agent
- **Purpose:** Feature development, bug fixes, code quality
- **Tools:** read, write, edit, exec, sessions_list, process, browser
- **Models:** KiloCode CLI (MiniMax:free, Llama:free via Groq)
- **Work Directory:** Inherits parent workspace automatically
- **Policy:** Auto-approved for standard tools
- **Special Requests:** Must file `requests/TOOL_REQUEST-[id].md` for new tools
- **Does NOT Do:** Architecture decisions (escalates to GM)

### 3.3 QA Agent
- **Purpose:** Code review, functional testing, acceptance validation
- **Tools:** read, browser, sessions_list (read-only audit)
- **Models:** MiniMax-01 (~$2.25/M tokens)
- **Does NOT Do:** Write code (read-only audit)
- **Output:** PASS / NEEDS_FIX / BLOCKER reports

### 3.4 GM (Dereck)
- **Purpose:** Strategy, delegation, quality approval, architecture
- **Tools:** ALL (full access)
- **Models:** 
  - Kimi K2.5 (complex decisions, ~$1.50/M tokens)
  - Gemini 2.0 Flash (routine, ~$0.25/M tokens)
- **Does NOT Do:** Hands-on coding (delegates to CTO)

---

## 4. INFRASTRUCTURE OVERVIEW

### 4.1 Host Machine
```
HOST SPECIFICATIONS

OS:         Linux 6.17.0-14-generic (x64)
Node:       v22.22.0
RAM:        5GB total, ~2.2GB available
Swap:       3.8GB, 1.7GB used (monitor closely)
CPU:        4 cores
User:       e
Home:       /home/e
Tailscale:  OFF
```

### 4.2 Key Directories

| Path | Purpose | Owner |
|------|---------|-------|
| `~/.openclaw/` | OpenClaw system files | e |
| `~/.openclaw/workspace/` | Primary workspace | e |
| `~/.openclaw/workspace/agents/` | Agent configs & tasks | e |
| `~/.openclaw/workspace/memory/` | Daily logs & state | e |
| `~/.openclaw/workspace/docs/` | Documentation | e |
| `~/.openclaw/cron/` | Cron job scripts | e |
| `~/.openclaw/logs/` | System logs | e |
| `~/.openclaw/config/` | OpenClaw configuration | e |
| `~/.cache/qmd/` | QMD search index | e |
| `~/.local/qmd/` | QMD installation | e |
| `~/nb-studio/` | NB Studio scripts | e |
| `~/nb-studio/scripts/` | Power scripts | e |
| `~/Documents/` | ESTUDIO documentation | e |

### 4.3 Running Services

| Service | Status | PID | URL | Notes |
|---------|--------|-----|-----|-------|
| OpenClaw Gateway | ✅ Running | 927379 | ws://127.0.0.1:18789 | systemd enabled |
| Mission Control | ✅ Running | - | http://127.0.0.1:4001 | builderz-labs v1.3.0 |
| fs-watcher | ✅ Running | 291924 | - | Tool request automation |
| Node Service | ❌ Not installed | - | - | Uses gateway only |

---

## 5. OPENCLAW CONFIGURATION

### 5.1 Core Settings

| Setting | Value |
|---------|-------|
| Dashboard URL | http://127.0.0.1:18789/ |
| Gateway | ws://127.0.0.1:18789 (local loopback) |
| Channel | stable |
| Heartbeat | 30m (main), disabled (planner) |
| Memory Plugin | openclaw-mem0 (@mem0/openclaw-mem0) |
| Update Available | npm 2026.3.8 |

### 5.2 Channels Configuration

| Channel | Enabled | State | Detail |
|---------|---------|-------|--------|
| WhatsApp | ON | OK | linked · +8618566570937 · auth 6m ago |
| Discord | ON | OK | token config (MTQ2…6Nh8) · accounts 1/1 |

### 5.3 Memory System

| Metric | Value |
|--------|-------|
| Files | 26 |
| Chunks | 80 |
| Sources | memory |
| Plugin | memory-core |
| Vector | ready |
| FTS | ready |
| Cache | on (86) |

### 5.4 Active Sessions (16 total)

| Key | Kind | Age | Model | Tokens |
|-----|------|-----|-------|--------|
| agent:main:main | direct | now | moonshotai/kimi-k2.5 | 61k/256k (24%) |
| agent:main:whatsapp:+861... | direct | 13h | llama-3.3-70b | unknown |
| agent:main:discord:10598... | direct | 6d | minimax/m2.5 | 20k/1000k (2%) |
| agent:main:mission-control | direct | 10d | kimi-k2.5 | unknown |
| + 12 others (planning/subagent) | | | | |

---

## 6. AGENT PIPELINE (CTO↔QA)

### 6.1 Workflow

```
GM Assigns → CTO Builds → QA Reviews → GM Approves → Next Task
   (FREE)      (FREE)       (~$0.02)     (Decision)
```

**Golden Rule:** After each task completion → Immediately assign next task

### 6.2 Task File Format

Location: `agents/TASK-[feature].md`

```markdown
# Task: [Name]
## Objective
[What to build]
## Current State
- Location: `/path/to/project/`
- Status: [NOT_STARTED/IN_PROGRESS/READY_FOR_QA]
## Requirements
- [ ] Feature 1
- [ ] Feature 2
## Acceptance Criteria
- [ ] Criteria 1
## Progress Log
### [Date] [Time]
[Updates]
```

### 6.3 Current Task Backlog

| Task File | Created | Status | Assignee |
|-----------|---------|--------|----------|
| TASK-dashboard-batch2.md | Feb 27 | Features 4-7 pending | CTO |
| TASK-dashboard-upgrade.md | Feb 27 | Completed | - |
| TASK-mc-upgrade-check.md | Mar 4 | Due (bi-weekly) | Warren |
| TASK-DEBUG-FRONTEND-001.md | Feb 27 | Pending | CTO |
| TASK-fallback-strategy.md | Feb 27 | Pending | CTO |
| TASK-memory-agent-impl.md | Feb 27 | Pending | CTO |
| TASK-NBDASH-V2-BACKEND.md | Feb 27 | Completed | - |
| TASK-theme-toggle.md | Feb 27 | Pending | CTO |

---

## 7. COST MANAGEMENT SYSTEM

### 7.1 Warren (COO) - Automated Cost Monitor

- **Script:** `/home/e/.openclaw/cron/cost-monitor-v2.sh`
- **Schedule:** 12:00 & 18:00 daily (twice per day)
- **Threshold:** $5.00 USD per day
- **Current Spend:** $0.00/day

### 7.2 Cost by Agent/Model

| Agent | Model/Service | Cost/M Tokens | Daily Use | Monthly |
|-------|---------------|---------------|-----------|---------|
| **CTO** | KiloCode (GLM-5:free) | $0 | $0 | $0 |
| **CTO** | KiloCode (MiniMax:free) | $0 | $0 | $0 |
| **CTO** | KiloCode (Llama via Groq) | $0 | $0 | $0 |
| **QA** | MiniMax-01 | ~$2.25 | ~$0.02 | ~$0.60 |
| **GM** | Gemini 2.0 Flash | ~$0.25 | ~$0.10 | ~$3.00 |
| **GM** | Kimi K2.5 | ~$1.50 | ~$0.30 | ~$9.00 |
| **GM** | Qwen (free) | $0 | $0 | $0 |
| **Total** | | | ~$0.42/day | ~$12.60/mo |

### 7.3 Budget Thresholds

| Daily Spend | Status | Action |
|-------------|--------|--------|
| <$2 | 🟢 Normal | Continue normal operation |
| $2-5 | 🟡 Monitor | Watch closely, reduce non-essential |
| >$5 | 🔴 ALERT | Switch to GLM-5 free tier, pause agents |
| >$10 | 🚨 CRITICAL | Pause all non-critical agents |

### 7.4 Cost Strategy

- **90%** → CTO (FREE) - All coding via KiloCode CLI
- **9%** → QA (CHEAP) - Code review via MiniMax-01
- **1%** → GM (AS NEEDED) - Complex decisions via Kimi/Gemini
- **Target:** <$50/month (~$0.42/day current)

---

## 8. MEMORY & CONTEXT SYSTEM

### 8.1 Triple-Layer Architecture

| Layer | Technology | Status | Use Case |
|-------|------------|--------|----------|
| 1 | QMD (BM25 + Vector) | ✅ Working | Code/docs search |
| 2 | Native Files (Git) | ✅ Active | Long-term memory |
| 3 | Context Injection | ✅ Ready | Runtime recall |

### 8.2 Memory Files Reference

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `SOUL.md` | Core identity | Rarely |
| `IDENTITY.md` | Name, role | Rarely |
| `USER.md` | E's profile | As needed |
| `AGENTS.md` | Agent roster | When agents change |
| `MEMORY.md` | Curated memory | Periodic review |
| `TOOLS.md` | Environment notes | As needed |
| `HEARTBEAT.md` | Scheduled tasks | When schedules change |
| `memory/YYYY-MM-DD.md` | Daily logs | Daily |
| `memory/STANDUPS/YYYY-MM-DD.md` | Standups | Daily |
| `memory/decisions.md` | Decisions log | As decided |

### 8.3 QMD Commands

```bash
qmd search "query"              # BM25 + vector
qmd collection list             # Show collections
qmd status                      # Index health
qmd index [path] --pattern "*.md"  # Re-index
```

### 8.4 Memory Rules

1. **Search BEFORE answering** about prior work
2. **Write to files** when something important happens
3. **Update MEMORY.md** periodically with learnings
4. **Never rely on "mental notes"**

---

## 9. COMMUNICATION CHANNELS

### 9.1 Active Channels

| Channel | Status | Config | Primary Use |
|---------|--------|--------|-------------|
| **WhatsApp** | ✅ ON | +8618566570937 | Primary user communication |
| **Discord** | ✅ ON | Token configured | Secondary, group chats |
| **Heartbeat** | ✅ Active | 30m interval | System health checks |

### 9.2 WhatsApp Configuration

- Status: linked
- Phone: +8618566570937
- Behavior: Flapping (auto-reconnects)
- Known Issue: Status 428 disconnects, but functional

### 9.3 Message Routing

| Source | Action |
|--------|--------|
| User (E) direct | Reply normally |
| Heartbeat poll | Check systems, reply HEARTBEAT_OK or alert |
| Cron reminder | Execute internally |
| Group chat | Respond only when mentioned |
| External/public | Confirm with E first |

### 9.4 Heartbeat Responses

- `HEARTBEAT_OK` — nothing needs attention
- Alert text — action required
- Must be ENTIRE message

---

## 10. MONITORING & HEARTBEATS

### 10.1 Heartbeat Schedule

| Time | Action |
|------|--------|
| **09:00** | Morning Standup & Task Assignment |
| **12:00** | Midday Progress Check |
| **15:00** | Afternoon QA Review |
| **18:00** | EOD Summary |

### 10.2 Heartbeat Checks

1. ✅ fs-watcher status
2. ✅ Dashboard update
3. ✅ Subagent check
4. ✅ Free tier monitoring
5. ✅ BLOCKERS.md scan

### 10.3 Heartbeat Rules

| Condition | Response |
|-----------|----------|
| Nothing needs attention | `HEARTBEAT_OK` |
| Action required | Alert with details |
| >8h silence | Reach out |
| Late night (23:00-08:00) | Only if urgent |

---

## 11. TOOL ACCESS & PERMISSIONS

### 11.1 Standard Toolkits

| Role | Tools | Auto-Approved |
|------|-------|---------------|
| **CTO** | read, write, edit, exec, sessions_list, process, browser | ✅ Yes |
| **QA** | read, browser, sessions_list | ✅ Yes |
| **HR/COO** | read, sessions_list, cron, exec | ✅ Yes |
| **GM** | All tools | ✅ Yes |

### 11.2 Tool Request Pipeline

**File:** `requests/TOOL_REQUEST-[id].md`

1. Agent creates request when "tool not in request.tools" error
2. Warren (HR) reviews and diagnoses
3. GM approves or rejects
4. Response files: `-DIAGNOSIS.md` or `-APPROVED.md`

### 11.3 fs-watcher

- **Status:** ✅ Running (PID 291924)
- **Purpose:** Auto-detect tool requests
- **Behavior:** Routes requests to HR for approval

---

## 12. SCHEDULED TASKS (CRON)

### 12.1 Current Cron Jobs

| Schedule | Command | Purpose |
|----------|---------|---------|
| `0 12,18 * * *` | cost-monitor-v2.sh | Cost tracking (2x daily) |
| `0 9 * * 0` | workspace-git-backup.sh | Weekly git backup |
| `0 20 * * *` | GitHub reminder | Daily reminder |
| `0 9 * * 6` | mc-upgrade-check.sh | Bi-weekly MC check |

### 12.2 Cron Files

| File | Purpose | Status |
|------|---------|--------|
| cost-monitor-v2.sh | Daily spend check | ✅ Active |
| cost-monitor.sh | Legacy | ⚠️ Deprecated |
| mc-upgrade-check.sh | MC upgrade | ✅ Active |
| workspace-git-backup.sh | Git backup | ✅ Active |

---

## 13. SECURITY PROFILE

### 13.1 Security Audit

| Level | Count |
|-------|-------|
| Critical | 0 |
| Warning | 3 |
| Info | 1 |

### 13.2 Warnings

1. **Reverse proxy headers not trusted**
   - Fix: Set trustedProxies or keep Control UI local-only

2. **Extension plugin tools may be reachable**
   - Fix: Use restrictive profiles for untrusted input

3. **Plugin installs unpinned**
   - Fix: Pin to exact versions

### 13.3 Security Protocols

| Action | Protocol |
|--------|----------|
| External emails/tweets | Confirm with E first |
| Destructive commands | Use `trash` not `rm` |
| Private data | Never exfiltrate |
| Group chats | Don't share E's context |

---

## 14. SYSTEM CONSTRAINTS

### 14.1 Resource Limits

| Resource | Limit | Current | Status |
|----------|-------|---------|--------|
| RAM | 5GB | ~2.2GB | ⚠️ Monitor |
| Swap | 3.8GB | 1.7GB | ⚠️ Risk |
| Daily API | $5.00 | ~$0.42 | ✅ OK |
| Context | 256K | ~61K | ✅ OK |
| Cache | — | 83% | ✅ Good |

### 14.2 RAM Safety

| Available | Action |
|-----------|--------|
| >1GB | Safe |
| 500MB-1GB | Monitor |
| <500MB | Emergency clearance |
| <300MB | Critical |

### 14.3 Model Constraints

| Size | Load? |
|------|-------|
| <500MB | ✅ Safe |
| 500MB-1GB | ⚠️ Check first |
| >1GB | ❌ Ask user |

### 14.4 Power Scripts

Location: `/home/e/nb-studio/scripts/`

| Script | Purpose |
|--------|---------|
| git-diff-analyzer.sh | QA code review |
| ram-survival.sh | Emergency RAM clearance |
| ast-mapper.sh | Codebase mapping |

---

## 15. ACTIVE PROJECTS & BACKLOG

### 15.1 Dashboard Projects

| Project | Location | Status | URL |
|---------|----------|--------|-----|
| Mission Control | `~/workspace/mission-control/` | ✅ Running | :4001 |
| Cost Analytics v2 | `~/workspace/dashboards/cost-analytics-v2/` | 🔄 Dev | :5173 |
| Token Dashboard | `~/workspace/projects/token-dashboard/` | ✅ Parser | — |

### 15.2 Dashboard Batch #2

| Feature | Status |
|---------|--------|
| Data Export | ✅ Complete |
| Notifications | ✅ Complete |
| Model Performance | ✅ Complete |
| Data Visualization | ⏭️ Pending |
| Session Management | ⏭️ Pending |
| Performance | ⏭️ Pending |
| Accessibility | ⏭️ Pending |

### 15.3 Pending Tasks

| Task | Priority | Blocker |
|------|----------|---------|
| Dashboard Batch #2 (4-7) | High | Needs CTO spawn |
| MC Upgrade Check | Medium | Warren, due now |
| API Usage Logger | Medium | Needs data source |
| GitHub Remote Setup | Low | Daily reminder |

---

## 16. QUICK REFERENCE

### Spawning Agents
```bash
sessions_spawn(agentId: "cto", task: "Read TASK.md and implement")
sessions_spawn(agentId: "qa", task: "Review CTO work")
subagents(action: "list")
subagents(action: "kill", target: "session-id")
```

### Memory
```bash
./scripts/memory-search.sh "query"
./scripts/memory-get.sh file.md
./scripts/memory-save.sh "Title" "Content"
```

### QMD
```bash
qmd search "query"
qmd vsearch "query"
qmd status
```

### Monitoring
```bash
/home/e/.openclaw/cron/cost-monitor-v2.sh
pgrep -f fs-watcher
```

### OpenClaw
```bash
openclaw status
openclaw logs --follow
openclaw gateway restart
```

---

**End of Report**

*This audit provides complete system architecture for ESTUDIO's OpenClaw deployment. Use as reference for system management, planning, and agent coordination.*

**Audited by:** Dereck (GM)  
**Date:** 2026-03-09  
**Version:** 1.0