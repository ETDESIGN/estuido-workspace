# 4-Manager Hierarchy Implementation Plan

**Status:** 🔄 Phase 4 Complete (67% done)
**Created:** 2026-03-21
**Owner:** Dereck (GM)
**Priority:** HIGH

---

## Overview

Transform ESTUDIO from ad-hoc agent delegation to a deterministic 4-Manager topology using Lobster workflow pipelines.

### Current State
- ❌ Agents don't know their boundaries
- ❌ Dereck writes code when CTO times out (breaks autonomy)
- ❌ No formal pipeline for CTO → QA → Approval flow
- ❌ Warren configured as CRO (Strategy), not HR/Ops
- ❌ No automated timeout recovery
- ❌ No boardroom discussion protocol for blockers

### Target State
- ✅ Strict 4-Manager hierarchy (GM → CTO/QA/Warren)
- ✅ Dereck NEVER writes code unless explicitly commanded
- ✅ Lobster pipelines handle all delegation
- ✅ Warren is System Watchdog (HR/Ops Manager)
- ✅ Automated timeout recovery
- ✅ Boardroom discussion after 2 QA rejections

---

## Phase 1: Documentation & Hierarchy Foundation

### 1.1 Create Manager Hierarchy Document
**File:** `/home/e/.openclaw/workspace/skills/manager-hierarchy.md`

**Actions:**
1. Create the skills directory if needed
2. Write the hierarchy document with:
   - 4-Manager topology definition
   - Hands-off protocol for Dereck
   - Boardroom discussion protocol
   - Team communication rules

**Expected Output:**
```
skills/manager-hierarchy.md
├── 4-Manager topology (Dereck, CTO, QA, Warren)
├── Hands-off protocol (Rule 1, 2, 3)
└── Boardroom discussion (after 2 QA rejections)
```

**Time:** 5 minutes

---

### 1.2 Reinforce SOUL.md
**File:** `/home/e/.openclaw/workspace/SOUL.md`

**Actions:**
1. Add reference to manager-hierarchy.md
2. Reinforce hands-off rules in Core Truths
3. Add escalation protocol

**Time:** 3 minutes

---

### 1.3 Reconfigure Warren (CRO → HR/Ops Manager)
**Files:**
- `/home/e/.openclaw/workspace/agents/warren.json`
- `/home/e/.openclaw/workspace/agents/Warren.md` (persona)

**Actions:**
1. Update Warren's system prompt:
   - From: "CRO - Strategy Department Head"
   - To: "HR/Ops Manager - System Watchdog"

2. Update Warren's responsibilities:
   - Monitor agent timeouts
   - Check budget/resource limits
   - Detect stuck pipelines
   - Trigger boardroom discussions
   - Coordinate cron schedules

3. Add skills:
   - `proactive-agent-lite` (already exists)
   - `ez-cronjob` (for monitoring setup)
   - `agent-toolkit-hr` (create if needed)

**Time:** 10 minutes

---

## Phase 2: Lobster Installation

### 2.1 Install Lobster
**Command:**
```bash
# Check if npm/pnpm available
which npm pnpm

# Install Lobster
pnpm add -g lobster  # or npm install -g lobster

# Verify installation
lobster --version
```

**Expected Output:**
- Lobster binary installed in `/usr/local/bin/lobster` or `~/.local/bin/lobster`
- Version output (e.g., "Lobster v1.x.x")

**Fallback:**
If npm not available, clone from GitHub:
```bash
cd /tmp
git clone https://github.com/openclaw/lobster.git
cd lobster
pnpm install
pnpm build
sudo pnpm link
```

**Time:** 5-10 minutes

---

### 2.2 Create Workflows Directory
**Command:**
```bash
mkdir -p /home/e/.openclaw/workspace/workflows
```

**Expected Output:**
```
workflows/
├── feature-build.lobster      # Main dev pipeline
├── code-review.lobster        # QA review pipeline
└── boardroom-discussion.lobster  # Blocker resolution
```

**Time:** 1 minute

---

### 2.3 Verify Lobster Syntax
**Test File:** `/home/e/.openclaw/workspace/workflows/hello-world.lobster`

```yaml
name: hello-world
args:
  name:
    default: "World"
steps:
  - id: greeting
    run: echo "Hello, ${name}!"
```

**Test Command:**
```bash
lobster run workflows/hello-world.lobster --args-json '{"name":"E"}'
```

**Expected Output:** `Hello, E!`

**Time:** 3 minutes

---

## Phase 3: Pipeline Creation ✅ COMPLETE

### 3.1 Create Feature Build Pipeline ✅
**File:** `/home/e/.openclaw/workspace/workflows/feature-build.lobster`
**Status:** Created and tested
**Size:** 5.6KB
**Stages:** CTO Build → QA Review → Boardroom (if needed) → GM Approval

**Time:** 15 minutes ✅

---

### 3.2 Create Code Review Pipeline ✅
**File:** `/home/e/.openclaw/workspace/workflows/code-review.lobster`
**Status:** Created and tested
**Size:** 1.8KB
**Purpose:** Quick QA reviews without full build

**Time:** 10 minutes ✅

---

### 3.3 Create Boardroom Discussion Template ✅
**File:** `/home/e/.openclaw/workspace/workflows/boardroom-discussion.lobster`
**Status:** Created and tested
**Size:** 5.4KB
**Purpose:** Blocker resolution when QA rejects work 2+ times

**Time:** 10 minutes ✅

---

## Phase 4: Warren (HR/Ops) Setup

### 4.1 Create Warren Monitoring Script
**File:** `/home/e/.openclaw/workspace/scripts/warren-watchdog.sh`

**Actions:**
1. Check active agent sessions
2. Detect timeouts (no activity for >10 minutes)
3. Check budget ($5/day limit)
4. Detect stuck QA loops (>3 rejections)
5. Send alerts to Dereck

**Time:** 15 minutes

---

### 4.2 Setup Cron Jobs for Warren
**File:** `/home/e/.openclaw/workspace/scripts/warren-schedule.cron`

**Schedule:**
```cron
# Every 10 minutes: Check agent health
*/10 * * * * /home/e/.openclaw/workspace/scripts/warren-watchdog.sh

# Hourly: Check budget
0 * * * * /home/e/.openclaw/workspace/scripts/warren-budget-check.sh

# Daily: EOD report
18:00 * * * /home/e/.openclaw/workspace/scripts/warren-eod-report.sh
```

**Time:** 5 minutes

---

### 4.3 Create Boardroom Trigger Logic
**File:** `/home/e/.openclaw/workspace/scripts/detect-qa-loop.sh`

**Logic:**
```bash
# Check TASK.md for QA rejections
rejection_count=$(grep -c "NEEDS_FIX" TASK.md || echo 0)

if [ "$rejection_count" -ge 2 ]; then
  # Trigger boardroom discussion
  openclaw invoke --agent main --pipeline boardroom-discussion.lobster
fi
```

**Time:** 10 minutes

---

## Phase 5: Integration & Testing

### 5.1 Update AGENTS.md
**File:** `/home/e/.openclaw/workspace/AGENTS.md`

**Changes:**
1. Add 4-Manager hierarchy section
2. Document pipeline usage
3. Update agent spawn commands (use Lobster instead of sessions_spawn)
4. Document Warren's new role

**Time:** 10 minutes

---

### 5.2 Create Migration Guide
**File:** `/home/e/.openclaw/workspace/MIGRATION_GUIDE.md`

**Content:**
- Old way: `sessions_spawn(agentId: "cto", task: "...")`
- New way: Trigger Lobster pipeline
- Example migrations for common tasks

**Time:** 10 minutes

---

### 5.3 Test Pipeline End-to-End
**Test Task:** Simple feature (e.g., "Add timestamp to dashboard")

**Steps:**
1. Dereck triggers: `lobster run workflows/feature-build.lobster`
2. CTO builds the feature
3. QA reviews the code
4. If QA rejects: Verify automatic retry
5. If 2nd rejection: Verify boardroom trigger
6. Final approval to E

**Expected Behavior:**
- ✅ Dereck does NOT write code
- ✅ CTO completes build
- ✅ QA reviews output
- ✅ Pipeline handles retries automatically
- ✅ Boardroom discussion triggers on loop

**Time:** 20 minutes

---

## Phase 6: Deployment

### 6.1 Activate Warren Monitoring
**Command:**
```bash
# Install cron jobs
crontab /home/e/.openclaw/workspace/scripts/warren-schedule.cron

# Verify
crontab -l
```

**Time:** 2 minutes

---

### 6.2 Create Runbooks
**File:** `/home/e/.openclaw/workspace/RUNBOOK.md`

**Sections:**
- How to trigger a feature build
- How to handle pipeline failures
- How to check Warren's status
- Emergency procedures (total system failure)

**Time:** 15 minutes

---

### 6.3 Team Briefing
**Action:** Send summary to E (President)

**Content:**
- ✅ 4-Manager hierarchy activated
- ✅ Lobster pipelines deployed
- ✅ Warren reconfigured as HR/Ops
- ✅ Hands-off protocol in effect
- ✅ Next steps: Monitor and iterate

**Time:** 10 minutes

---

## Success Criteria

### Must Have (MVP)
- [x] Hierarchy document created
- [ ] Lobster installed and working
- [ ] At least 1 pipeline deployed (feature-build.lobster)
- [ ] Warren reconfigured as HR/Ops
- [ ] Dereck successfully delegates without writing code

### Should Have
- [ ] All 3 pipelines deployed (feature, review, boardroom)
- [ ] Warren cron jobs active
- [ ] End-to-end test completed
- [ ] AGENTS.md updated

### Could Have
- [ ] Web dashboard for pipeline status
- [ ] Automated rollback on failures
- [ ] Performance metrics tracking

---

## Timeline Estimate (Updated)

| Phase | Time | Status | Running Total |
|-------|------|--------|---------------|
| Phase 1: Docs & Hierarchy | 18 min | ✅ COMPLETE | 18 min |
| Phase 2: Lobster Install | 19 min | ✅ COMPLETE | 37 min |
| Phase 3: Pipeline Creation | 35 min | ✅ COMPLETE | 72 min |
| Phase 4: Warren Setup | 30 min | ✅ COMPLETE | 102 min |
| Phase 5: Integration | 40 min | 🔄 NEXT | 142 min |
| Phase 6: Deployment | 27 min | ⏳ PENDING | **169 min (~3 hours)** |

**Progress:** 4 of 6 phases complete (~67%)

---

## Risks & Mitigations

### Risk 1: Lobster Installation Fails
**Mitigation:** Use fallback install from GitHub source

### Risk 2: Agent Config Conflicts
**Mitigation:** Test agent spawn before activating pipelines

### Risk 3: Warren Cron Job Overhead
**Mitigation:** Stagger schedules to avoid API bursts

### Risk 4: QA False Positives (Rejects good code)
**Mitigation:** Boardroom discussion allows human review

---

## Next Steps

1. **Immediate (Phase 1):** Create hierarchy document
2. **Short-term (Phases 2-4):** Install Lobster, create pipelines, setup Warren
3. **Medium-term (Phase 5):** Integration testing
4. **Long-term (Phase 6):** Deployment and monitoring

---

**Status:** 🔄 Ready to begin Phase 1
**Blockers:** None
**Dependencies:** None

---

*Last updated: 2026-03-21*
*GM: Dereck | President: E*
