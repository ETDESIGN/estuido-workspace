# 🏢 ESTUDIO System Workflow Documentation

**Version:** 1.0  
**Date:** 2026-02-20  
**Purpose:** Complete reference for ESTUDIO's operational workflows, agent systems, and quality processes.

---

## Table of Contents

1. [Organization Structure](#1-organization-structure)
2. [Agent Pipeline](#2-agent-pipeline)
3. [Quality Assurance Process](#3-quality-assurance-process)
4. [Cost Management System](#4-cost-management-system)
5. [Memory System](#5-memory-system)
6. [Tool Request Pipeline](#6-tool-request-pipeline)
7. [Heartbeat & Monitoring](#7-heartbeat--monitoring)
8. [Communication Flows](#8-communication-flows)
9. [System Constraints](#9-system-constraints)

---

## 1. Organization Structure

### Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    ESTUDIO HIERARCHY                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐                                            │
│  │  E (President) │ ← Human in charge, final authority       │
│  └──────┬──────┘                                            │
│         │                                                    │
│  ┌──────┴──────┐                                            │
│  │ Dereck (GM) │ ← General Manager, strategy & delegation  │
│  └──────┬──────┘                                            │
│         │                                                    │
│  ┌──────┴──────┐                                            │
│  │  Warren    │ ← COO, cost monitoring & operations       │
│  │  (COO)     │                                            │
│  └────────────┘                                            │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────────┐  │
│  │ CTO (Dev)   │    │ QA (Review)  │    │ Memory      │  │
│  │             │    │              │    │ (Context)   │  │
│  └──────────────┘    └──────────────┘    └─────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Agent Roster

| Agent | Role | Reports To | Primary Function |
|-------|------|------------|-------------------|
| **E** | President | — | Final authority, strategy |
| **Dereck (GM)** | General Manager | E | Strategy, delegation, quality approval |
| **Warren** | COO | GM | Cost monitoring, operations |
| **CTO** | Lead Developer | GM | Feature dev, bug fixes, code quality |
| **QA** | QA Engineer | GM | Code review, testing, validation |
| **Memory** | Context System | GM | Conversation persistence, semantic recall |

---

## 2. Agent Pipeline

### CTO → QA → GM Workflow

The core development pipeline for all features:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     CTO → QA → GM PIPELINE                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────┐     Build      ┌─────────┐     Review     ┌─────────┐   │
│   │   GM    │ ──────────────▶│   CTO   │ ──────────────▶│   QA    │   │
│   │(Assign) │    (FREE)      │ (Build) │    (Audit)    │(Verify) │   │
│   └─────────┘                └─────────┘               └────┬────┘   │
│        │                          │                          │        │
│        │                    $0 (KiloCode)               ~$0.02    │
│        │                          │                          │        │
│        │                    ┌────▼────┐               ┌────▼────┐  │
│        │                    │ Feature │               │ PASS/   │  │
│        │                    │ Ready  │               │ NEEDS   │  │
│        │                    └────┬────┘               │ FIX    │  │
│        │                         │                    └────┬────┘  │
│        │                    ┌────▼────┐                    │       │
│        │                    │  EOD   │                    │       │
│        │                    │Review │◀───────────────────┘       │
│        │                    └────┬────┘                              │
│        │                         │                                   │
│        │                    ┌────▼────┐                              │
│        │                    │ Next   │◀─────────────────────────┐   │
│        │                    │ Task   │                          │   │
│        │                    └────────┘                          │   │
│        │                                                          │   │
│        └──────────────────────────────────────────────────────────┘   │
│                                                                         │
│   NEVER-ENDING LOOP: After each task, immediately assign next task    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Pipeline Stages

### Stage 1: GM Assigns Task
- **Trigger:** New task available or previous task completed
- **Action:** GM creates TASK.md with requirements
- **Tool:** `sessions_spawn(agentId: "cto", task: "...")`
- **Cost:** $0 (free model)

### Stage 2: CTO Builds
- **Model:** KiloCode CLI with free models (GLM-5, MiniMax, Llama)
- **Output:** Working feature, marked "READY_FOR_QA"
- **Cost:** $0 (free tier)
- **Time estimate:** 10-30 minutes per feature

### Stage 3: QA Reviews
- **Model:** MiniMax-01 (cheap, good for analysis)
- **Actions:**
  - Code review
  - Functional testing
  - Acceptance validation
- **Output:** Structured report (PASS / NEEDS_FIX / BLOCKER)
- **Cost:** ~$0.01-0.02 per review

### Stage 4: GM Decision
- **PASS:** Feature deploys → Next task immediately assigned
- **NEEDS_FIX:** Return to CTO with specific fixes
- **BLOCKER:** Escalate to E immediately

### The Golden Rule
> **CTO NEVER IDLE** - After each completion, immediately assign next task from the queue.

---

## 3. Quality Assurance Process

### QA Agent Responsibilities

| Responsibility | Description |
|----------------|-------------|
| **Code Review** | Read-only audit of CTO code |
| **Functional Testing** | Verify feature works as specified |
| **Acceptance Validation** | Check all TASK.md criteria met |
| **Regression Testing** | Ensure no existing features broken |
| **Structured Reporting** | PASS / NEEDS_FIX / BLOCKER with details |

### QA Review Criteria

```
┌─────────────────────────────────────────────────────────────────┐
│                    QA REVIEW CHECKLIST                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  □ Code Quality                                                │
│    ├── No syntax errors                                        │
│    ├── Proper TypeScript types                                   │
│    ├── No console.log debug statements                          │
│    └── Clean imports/exports                                    │
│                                                                 │
│  □ Functionality                                               │
│    ├── Feature works as specified                                │
│    ├── All TASK.md criteria met                                 │
│    ├── Error handling in place                                 │
│    └── Edge cases considered                                    │
│                                                                 │
│  □ Integration                                                 │
│    ├── No conflicts with existing code                          │
│    ├── API endpoints respond correctly                         │
│    └── UI renders without errors                               │
│                                                                 │
│  □ Performance                                                │
│    ├── No obvious memory leaks                                 │
│    ├── Appropriate caching                                    │
│    └── Responsive (if UI)                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### QA Output Format

```markdown
## QA Review Report - [TASK_NAME]

### Status: ✅ PASS / ⚠️ NEEDS_FIX / ❌ BLOCKER

### Findings
[Detailed observations]

### Required Changes (if NEEDS_FIX)
- [ ] Issue 1: Description
- [ ] Issue 2: Description

### Notes
[Any additional context]
```

---

## 4. Cost Management System

### Warren (COO) - Cost Monitor

**Purpose:** Prevent budget overruns by monitoring API spend in real-time.

### How It Works

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    COST MONITORING FLOW                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────┐                                               │
│  │ Cron Job        │ ← Runs every hour                               │
│  │ (cost-monitor) │                                                 │
│  └────────┬────────┘                                                 │
│           │                                                           │
│           │ Every hour                                               │
│           ▼                                                          │
│  ┌──────────────────────────────────────────┐                       │
│  │ Check api-usage.jsonl                     │                       │
│  │ Calculate today's spend                    │                       │
│  └──────────────────┬───────────────────────┘                       │
│                      │                                                │
│                      ▼                                                │
│          ┌─────────────────────┐                                    │
│          │ Spend ≤ $5?          │                                    │
│          └──────────┬───────────┘                                    │
│                     │                                                 │
│        YES          │          NO                                     │
│        ▼            │          ▼                                     │
│  ┌──────────┐  ┌──────────────┐                                   │
│  │ $0.41/day│  │ ALERT GM    │                                    │
│  │ ✅ OK    │  │ Switch to   │                                    │
│  └──────────┘  │ GLM-5 free  │                                    │
│                 └──────────────┘                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Cost by Agent

| Agent | Model | Cost/M Token | Daily Use |
|-------|-------|--------------|----------|
| **CTO** | KiloCode (GLM-5:free) | $0 | $0 |
| **CTO** | KiloCode (MiniMax:free) | $0 | $0 |
| **QA** | MiniMax-01 | ~$2.25 | ~$0.02 |
| **GM** | Gemini 2.0 Flash | ~$0.25 | ~$0.10 |
| **GM** | Kimi K2.5 | ~$1.50 | ~$0.30 |

### Cost Strategy
- **90%** of work → CTO (free)
- **9%** of work → QA (cheap)
- **1%** of work → GM (when needed)

### Budget Thresholds

| Threshold | Action |
|-----------|---------|
| <$2/day | Normal operation |
| $2-5/day | Monitor closely |
| >$5/day | ALERT - Switch to GLM-5 free tier |
| >$10/day | Pause non-critical agents |

---

## 5. Memory System

### Triple-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MEMORY LAYERS                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  LAYER 1: QMD (Local Search)                                          │
│  ├── BM25: Fast keyword search                                        │
│  ├── Vector: Semantic similarity                                      │
│  └── Use for: Code, docs, technical research                          │
│                                                                         │
│  LAYER 2: Native Files (Git-Tracked)                                  │
│  ├── MEMORY.md: Curated long-term                                     │
│  ├── Daily logs: memory/YYYY-MM-DD.md                                 │
│  ├── Decisions: memory/decisions.md                                    │
│  └── Use for: System config, identity, goals                         │
│                                                                         │
│  LAYER 3: Context Injection (Runtime)                                │
│  ├── memory_search: Semantic recall                                   │
│  ├── memory_get: File section retrieval                              │
│  └── Use for: Relevant context during conversations                 │
│                                                                         │
│  RULES:                                                              │
│  - MUST run memory_search before answering about prior work          │
│  - Write to files when something important happens                  │
│  - Update MEMORY.md periodically with learnings                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### When to Use Each Layer

| Need | Use |
|------|-----|
| Code/technical search | `qmd search "query"` |
| Semantic recall | `memory_search "query"` |
| Recent activity | `memory/2026-02-20.md` |
| Long-term memory | `MEMORY.md` |
| Decisions log | `memory/decisions.md` |
| System config | `TOOLS.md`, `AGENTS.md` |

### Memory Maintenance (Heartbeat Task)

1. Read recent `memory/YYYY-MM-DD.md` files
2. Identify significant events worth keeping
3. Update `MEMORY.md` with distilled learnings
4. Remove outdated info

---

## 6. Tool Request Pipeline

### fs-watcher - Tool Request Automation

**Purpose:** Automatically detect when agents need new tools and route requests for approval.

### How It Works

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TOOL REQUEST PIPELINE                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐     Trigger      ┌─────────────┐     Route          │
│   │ fs-watcher │ ────────────────▶│   HR       │ ────────────────▶ │
│   │ (monitor)  │  (file create)  │ (Warren)   │  (review)        │
│   └─────────────┘                 └──────┬──────┘                   │
│                                         │                           │
│                                         │                           │
│           ┌─────────────────────────────┼──────────────────────┐    │
│           │                             │                      │    │
│           ▼                             ▼                      ▼    │
│   ┌─────────────┐              ┌─────────────┐      ┌───────────┐  │
│   │ APPROVED   │              │ DIAGNOSIS   │      │ REJECTED  │  │
│   │ +Notify GM │              │ +Suggest   │      │ +Notify   │  │
│   └─────────────┘              │  fix       │      │  requester│  │
│                             └─────────────┘      └───────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Tool Request File Format

Location: `requests/TOOL_REQUEST-[id].md`

```markdown
# Tool Request: [TASK_NAME]

## Agent: [cto/qa/gm]
## Task: [what they're working on]

## Tools Needed
- [ ] tool-name: why needed

## Justification
[Business reason for request]

## Approval Status
[WAITING/DIAGNOSIS/APPROVED/REJECTED]
```

---

## 7. Heartbeat & Monitoring

### Heartbeat Purpose

Periodic health checks during idle time to:
- Monitor system status
- Check for alerts/issues
- Perform maintenance tasks
- Report significant changes

### Heartbeat Schedule

| Time | Action |
|------|--------|
| Morning (09:00) | Assign tasks, check overnight alerts |
| Midday (12:00) | Progress check, unblock CTO if stuck |
| Afternoon (15:00) | QA review window |
| EOD (18:00) | Summary, next day planning |

### Heartbeat Actions (Every ~2 Hours)

1. **Check fs-watcher:** Is tool pipeline running?
2. **Dashboard update:** Run `/scripts/update-dashboard.sh`
3. **Subagent check:** Any active or recent agents?
4. **Free tier monitoring:** Any rate limit errors?
5. **HR monitoring:** Pending skill requests? TODOs? BLOCKERS?
6. **Report:** Significant progress/blockers to E

### Heartbeat Response Rules

| Condition | Response |
|-----------|----------|
| Nothing needs attention | `HEARTBEAT_OK` |
| Action required | Alert E with details |
| Important discovery | Proactively message E |
| >8h silence | Reach out with something interesting |

---

## 8. Communication Flows

### User → Dereck → Agents

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MESSAGE FLOW                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────┐                                                         │
│  │ User   │                                                         │
│  │ (E)   │                                                         │
│  └──┬────┘                                                          │
│     │ Direct message                                                │
│     ▼                                                                │
│  ┌─────────────────────────────────────────┐                        │
│  │ Dereck (GM)                              │                        │
│  │ - Parse request                          │                        │
│  │ - Determine: Do it / Delegate / Decline │                        │
│  └──────────────────┬────────────────────┘                        │
│                     │                                                │
│         ┌──────────┼──────────┐                                     │
│         ▼          ▼          ▼                                      │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐                             │
│   │ Do it   │ │Delegate │ │Decline │                             │
│   │ myself │ │ to CTO  │ │ (too   │                             │
│   │        │ │ or QA   │ │ risky) │                             │
│   └─────────┘ └─────────┘ └─────────┘                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Delegation Decision Matrix

| Request Type | Handle With |
|--------------|--------------|
| Strategy, decisions | GM (Dereck) handles |
| Code, features, fixes | Delegate to CTO |
| Review, testing, validation | Delegate to QA |
| Cost alerts, monitoring | Warren (COO) auto |
| Memory, context | Memory system |
| External actions | Confirm with E first |

### Group Chat Behavior

In Discord/Telegram/WhatsApp group chats:
- **Respond when:** Directly mentioned, can add value, something witty fits
- **Stay silent when:** Casual banter, already answered, would just add noise
- **React often:** Use emoji reactions instead of messages when appropriate

---

## 9. System Constraints

### Resource Limits

| Resource | Limit | Notes |
|----------|-------|-------|
| RAM | 5GB total, ~2.2GB available | Chrome + WhatsApp use 3GB+ |
| Daily API Budget | $5.00 | Current: ~$0.41/day |
| Swap | 1.7GB used | Performance risk if exceeded |
| Model Context | 262K tokens | Current: ~81K used |

### Safety Protocols

- **RAM:** Don't load models >1GB without checking
- **Budget:** Alert if approaching $5/day
- **External:** Always confirm before sending emails/tweets
- **Destructive:** Ask before `rm` (use `trash` instead)

---

## Quick Reference Commands

### Spawning Agents
```bash
# CTO for feature work
sessions_spawn(agentId: "cto", task: "Read TASK.md and implement")

# QA for review
sessions_spawn(agentId: "qa", task: "Review TASK.md feature")
```

### Memory
```bash
./scripts/memory-search.sh "query"
./scripts/memory-get.sh file.md
./scripts/memory-save.sh "Title" "Content"
```

### QMD
```bash
qmd search "query"       # BM25 fast search
qmd vsearch "query"      # Vector search
qmd status              # Index health
```

### Monitoring
```bash
/home/e/.openclaw/cron/cost-monitor.sh  # Check daily spend
pgrep -f fs-watcher                    # Tool pipeline running?
```

---

*Documentation maintained by Dereck (GM)*  
*Last updated: 2026-02-20*
