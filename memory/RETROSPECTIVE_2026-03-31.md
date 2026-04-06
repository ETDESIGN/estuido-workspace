# Retrospective & Self-Improvement Loop
**Date:** 2026-03-31 (21:30 HKT)
**Period:** March 28–31 (4 days)
**Trigger:** Etia requested full analysis of what went well/wrong, issues, solutions, memory consolidation

---

## 🟢 What Went Well

### 1. Customer Sourcing Dashboard Built (Mar 29)
- Forked Next.js 16 from mission-control-new, stripped OpenClaw code
- Built 7 pages + 10 API routes + SQLite database in one session
- All routes verified working (login, register, requests, admin, files)
- **Quality:** Clean architecture, proper auth, responsive design

### 2. Streamlit Dashboard v0.3 Restructured (Mar 31)
- Modular architecture: components/, pages/, services/
- 6 reusable component modules with design system
- 7 pages with charts, analytics, supplier comparison
- **Quality:** 185/205 tests passing, app runs on localhost:8501

### 3. Supplier Sourcing for Project Spider (Mar 29)
- Found 2 matching suppliers (STW 95%, Goochain 85%)
- Complete RFQ document with specs
- Key business insight: NEVER include timeline in RFQ (weakens negotiation)

### 4. Quotation System (Mar 31)
- Excel + PDF generation for customer-facing quotations
- White-label format, EUR pricing, professional terms
- Automated generation script

### 5. KiloCode Integration (Mar 31 evening)
- Researched and configured ACP integration
- Verified free models work ($0 coding cost)
- Updated all dev team agent SOUL.md files
- End-to-end test passed: KiloCode created real component in the project

---

## 🔴 What Went Wrong

### 1. CRITICAL: 8-Hour Lost Sprint (Mar 31)
**What happened:** Etia asked to spawn dev team at 9:00. Subagent spawns failed (streamTo error, thread=true error). I got sidetracked with quotation files instead of fixing the spawn issue immediately. By 5pm, nothing had been done.

**Impact:** 8 hours wasted, Etia very frustrated, had to do emergency work session

**Root cause:** 
- Didn't retry failed spawns with correct parameters
- Got distracted by quotation task instead of prioritizing the sprint
- Didn't escalate the spawn failure immediately

**Fix:** Set up watchdog timers. If a task isn't started within 15 min of being asked, alert immediately.

### 2. I Coded Directly Instead of Using the Dev Team (Mar 31)
**What happened:** When subagents failed, I rewrote the entire dashboard myself (50+ files, hours of work, burned tokens)

**Impact:** Rate limit hit, cost money, undermined the dev team system

**Root cause:** Didn't trust the team, took the easy path instead of fixing the underlying issue

**Fix:** Etia's clear instruction — I am coordinator, not coder. All coding via KiloCode + free models.

### 3. Quotation File Was Supplier-Facing (Mar 31)
**What happened:** Generated a quotation addressed TO a supplier ("please quote your BEST prices") when it should have been FROM E-Studio TO a customer

**Impact:** Etia had to correct me twice

**Root cause:** Didn't fully understand the business context. E-Studio is a sourcing agent — quotations go TO customers, RFQs go TO suppliers.

**Fix:** Business context card in memory. Quotation = to customer. RFQ = to supplier.

### 4. Subagent Timeout ≠ Failure Assumption (Mar 31)
**What happened:** All 4 subagents "timed out" but 3 had actually written files before timeout. I assumed total failure and redid everything.

**Impact:** Wasted effort duplicating completed work

**Fix:** After timeout, always check `find -newer` to see what was actually produced.

### 5. Dashboard Not on Vercel (Mar 31)
**What happened:** Built the dashboard but left it on localhost. Etia expects it on Vercel for customer access.

**Impact:** Customers can't access it

**Fix:** The Next.js sourcing-dashboard at ~/sourcing-dashboard/ is already deployed to Vercel (multiple deployments exist). Need to merge Streamlit improvements into the Next.js version, or deploy Streamlit separately.

### 6. Stale/Fragmented Memory
**What happened:** Memory has files from Feb (decisions.md, TODO.md, completed-tasks.md) that are outdated and reference old systems (MemoryAgent, QMD, Dereck as GM).

**Impact:** Memory search returns irrelevant results, wastes tokens

**Fix:** Consolidate and archive old files. Update references.

### 7. HEARTBEAT.md is Outdated
**What happened:** References non-existent scripts (check-inbox.sh), old dashboard paths, stale tasks

**Impact:** Scheduled heartbeats run but do nothing useful

**Fix:** Rewrite HEARTBEAT.md for current state

### 8. Empty Agent Shells
**What happened:** sourcing-agent and derek-negotiator have no SOUL.md or MEMORY.md since creation on Mar 28

**Impact:** These agents can't do anything if asked

**Fix:** Initialize them properly

---

## 🔧 Issues & Solutions

| # | Issue | Solution | Status |
|---|-------|----------|--------|
| 1 | Rate limit from coding directly | Use KiloCode CLI with free models | ✅ Configured |
| 2 | Subagent spawn failures | Use runtime="acp" with proper config | ✅ Fixed |
| 3 | Memory bloat/outdated files | Consolidate, archive, clean up | 🔄 Doing now |
| 4 | HEARTBEAT.md stale | Rewrite for current state | 🔄 Doing now |
| 5 | Dashboard on localhost | Deploy to Vercel | ⏳ Pending Etia review |
| 6 | Empty agent shells | Write SOUL.md for sourcing-agent, derek-negotiator | ⏳ |
| 7 | 15 pre-existing test failures | Fix supplier JSON schemas | ⏳ |
| 8 | No watchdog on tasks | Set up watchdog crons for all spawned work | ✅ Protocol in place |

---

## 🧠 Memory Consolidation Plan

### Files to Archive (move to memory/archive/)
- `2026-03-28-aight-audio-flow.md` — specific to one feature, done
- `2026-03-28-memory-flush-complete.md` — one-time event
- `2026-03-28-voice-chat-system.md` — one-time event
- `2026-03-29-byterover-setup.md` — specific tool setup, done
- `GM-QA-REVIEW-2026-03-*.md` — old QA reviews
- `GM-MIDDAY-CHECK-2026-03-28.md` — one-time event
- `EOD_SUMMARY_2026-03-16.md` — old
- `EOD-SUMMARY-2026-03-21.md` — old
- `EOD_SUMMARY_2026-03-23.md` — old
- `warren-eod-20260321.log` through `20260327.log` — old warren reports
- `balance-audit.md` — no longer relevant
- `token-dashboard-spec.md` — never built
- `completed-tasks.md` — only has Feb tasks, outdated format
- `QMD-SETUP.md` — QMD no longer used
- `GITHUB_REMOTE_STATUS.md` — likely stale

### Files to Keep & Update
- `2026-03-31.md` — current day, comprehensive
- `KILOCODE_RESEARCH.md` — active reference
- `LEARNINGS.md` — add new learnings from today
- `decisions.md` — update with recent decisions
- `TODO.md` — rewrite with current tasks
- `tasks/PIPELINE.md` — active project tracking
- `AGENT_STATE.md` — update with current state
- `EOD_SUMMARY_2026-03-31.md` — keep as reference

### Files to Create
- `BUSINESS_CONTEXT.md` — E-Studio business model, customer/supplier relationship, quotation vs RFQ
- `RULES.md` — hard rules Etia has established (don't code directly, use dev team, etc.)

### MEMORY.md (Main Index) — Rewrite
Should contain:
1. Who Etia is (president)
2. Business context (sourcing agent)
3. Active projects
4. Key rules
5. Dev team structure
6. Tool reference (KiloCode)
7. Recent decisions (last 7 days)

---

## 📐 Behavioral Rules (Etia's Instructions — Permanent)

1. **I am the coordinator, NOT the coder.** Plan → delegate → monitor → merge. Never code directly.
2. **All coding via KiloCode CLI** with free models (Qwen 3.6 Plus, MiniMax M2.5). Cost must be $0.
3. **Use the full dev team.** CTO plans, frontend-coder/backend-coder code, QA tests, deployer deploys.
4. **Don't assume failure.** Check what subagents actually produced before redoing work.
5. **Report blockers immediately.** Silence is not acceptable.
6. **Don't get sidetracked.** Focus on the priority task until it's done.
7. **Dashboard goes to Vercel.** Customer-facing apps must be publicly accessible.
8. **Quotation = to customer. RFQ = to supplier.** Know the business context.
