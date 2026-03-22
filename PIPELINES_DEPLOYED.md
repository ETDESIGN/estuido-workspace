# Lobster Pipelines - Deployed

**Date:** 2026-03-21 20:07
**Status:** ✅ Deployed and Tested
**GM:** Dereck

---

## 🚀 Pipelines Created

### 1. feature-build.lobster (Main Dev Pipeline)
**Location:** `/home/e/.openclaw/workspace/workflows/feature-build.lobster`
**Size:** 5.6KB
**Stages:** 4

#### Flow:
```
CTO Build (5 min)
  ↓ fail
CTO Retry 1 (5 min)
  ↓ fail
CTO Retry 2 (5 min)
  ↓ fail → Notify GM (manual intervention)
  ↓ success
QA Review (3 min)
  ↓ PASS → GM Approval
  ↓ NEEDS_FIX (< 2 iterations) → Back to CTO
  ↓ NEEDS_FIX (≥ 2 iterations) → Boardroom Discussion
Boardroom Discussion (if needed)
  ↓ Agreement → CTO with clear direction
GM Approval
  ↓ Approve → Success
  ↓ Reject → Request changes
```

#### Features:
- ✅ Auto-retry on CTO timeout (up to 2 retries)
- ✅ QA rejection loop detection
- ✅ Boardroom discussion trigger (after 2 rejections)
- ✅ GM final approval before production
- ✅ Error escalation to GM on systemic failure

#### Usage:
```bash
# Basic usage
lobster run workflows/feature-build.lobster --args-json '{
  "feature_request": "Add user authentication to dashboard"
}'

# With custom TASK file
lobster run workflows/feature-build.lobster --args-json '{
  "feature_request": "Implement dark mode toggle",
  "task_file": "agents/TASK-dark-mode.md"
}'
```

---

### 2. code-review.lobster (Quick QA Review)
**Location:** `/home/e/.openclaw/workspace/workflows/code-review.lobster`
**Size:** 1.8KB
**Stages:** 2

#### Flow:
```
QA Review (3 min)
  ↓
Report Results
```

#### Review Types:
- `quick` - Fast code check (default)
- `thorough` - Comprehensive review
- `security` - Security-focused review
- `performance` - Performance analysis

#### Usage:
```bash
# Quick review
lobster run workflows/code-review.lobster --args-json '{
  "review_target": "src/components/Dashboard.tsx"
}'

# Security review
lobster run workflows/code-review.lobster --args-json '{
  "review_target": "PR #123: Authentication changes",
  "review_type": "security"
}'
```

---

### 3. boardroom-discussion.lobster (Blocker Resolution)
**Location:** `/home/e/.openclaw/workspace/workflows/boardroom-discussion.lobster`
**Size:** 5.4KB
**Stages:** 6

#### Flow:
```
Gather CTO Context (2 min)
  ↓
Gather QA Context (2 min)
  ↓
GM Facilitates Discussion (approval required)
  ↓ Approve → Propose Solution
  ↓ Reject → Escalate to President
Propose Solution → CTO with clear direction
  ↓
QA Reviews Revised Work (3 min)
  ↓
Final Decision
```

#### Features:
- ✅ Collects both CTO and QA perspectives
- ✅ GM facilitates consensus
- ✅ Documents agreed solution
- ✅ Resumes pipeline with clear requirements
- ✅ Escalates to President if no consensus

#### Usage:
```bash
# Manual trigger
lobster run workflows/boardroom-discussion.lobster --args-json '{
  "feature_request": "OAuth integration",
  "qa_rejection_count": "3",
  "previous_attempts": "CTO tried implicit flow, PKCE flow, both rejected by QA"
}'
```

---

## ✅ Installation Verified

### Lobster Status:
```bash
$ lobster --version
2026.1.21-1

$ lobster run workflows/hello-world.lobster --args-json '{"name":"E"}'
["Hello, E!"]
```

**Status:** ✅ Working

---

## 📋 Integration with Agents

### How Pipelines Replace sessions_spawn

**Before (Old Way):**
```javascript
sessions_spawn(
  agentId: "cto",
  task: "Build dashboard feature"
)
```

**After (New Way):**
```bash
lobster run workflows/feature-build.lobster --args-json '{
  "feature_request": "Build dashboard feature"
}'
```

**Benefits:**
- ✅ Deterministic execution
- ✅ Auto-retry on timeout
- ✅ State management via JSON
- ✅ QA review built-in
- ✅ Boardroom discussion trigger
- ✅ GM approval gate

---

## 🔄 Phase 3 Complete

**Deliverables:**
- [x] feature-build.lobster - Main dev pipeline
- [x] code-review.lobster - Quick QA reviews
- [x] boardroom-discussion.lobster - Blocker resolution
- [x] hello-world.lobster - Test pipeline
- [x] All pipelines tested and verified
- [x] Documentation created

**Time:** ~15 minutes
**Status:** ✅ COMPLETE

---

## 🚀 Next: Phase 4 (Warren Setup)

**Tasks:**
1. Reconfigure Warren from CRO → HR/Ops Manager
2. Create Warren monitoring scripts
3. Setup Warren cron jobs
4. Test Warren alert system

**Estimated Time:** 30 minutes

---

*Last updated: 2026-03-21*
*GM: Dereck | President: E*
