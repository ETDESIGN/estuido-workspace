# Migration Guide: Old → New Workflow

**Date:** 2026-03-21
**For:** ESTUDIO Team
**Version:** 4-Manager Hierarchy

---

## 🔄 What Changed

### Old Workflow (Ad-Hoc Delegation)
```javascript
// GM directly spawns agents
sessions_spawn(agentId: "cto", task: "Build feature")
sessions_spawn(agentId: "qa", task: "Review code")
```

**Problems:**
- No automatic retry on timeout
- No formal QA → CTO feedback loop
- GM writes code when agents timeout (breaks autonomy)
- No boardroom discussion for blockers
- Manual coordination required

---

### New Workflow (Lobster Pipelines)
```bash
# GM triggers pipeline
lobster run workflows/feature-build.lobster --args-json '{
  "feature_request": "Build dashboard feature"
}'
```

**Benefits:**
- ✅ Automatic retry on CTO timeout (2 attempts)
- ✅ QA → CTO feedback loop (up to 2 retries)
- ✅ Boardroom discussion after 2 QA rejections
- ✅ GM approval gate before production
- ✅ Warren monitoring system health
- ✅ Deterministic execution

---

## 📋 Migration Examples

### Example 1: Build a New Feature

**Old Way:**
```javascript
// Dereck delegates to CTO
sessions_spawn(
  agentId: "cto",
  task: "Build user authentication system"
)
```

**New Way:**
```bash
# Dereck triggers pipeline
lobster run workflows/feature-build.lobster --args-json '{
  "feature_request": "Build user authentication system"
}'
```

**What happens:**
1. CTO builds authentication (5 min timeout, 2 retries)
2. QA reviews code (3 min)
3. If PASS → GM approval → Present to E
4. If NEEDS_FIX (< 2 times) → Back to CTO
5. If NEEDS_FIX (≥ 2 times) → Boardroom discussion
6. GM final approval → Production ready

---

### Example 2: Quick Code Review

**Old Way:**
```javascript
// Dereck delegates to QA
sessions_spawn(
  agentId: "qa",
  task: "Review this pull request"
)
```

**New Way:**
```bash
# Dereck triggers QA pipeline
lobster run workflows/code-review.lobster --args-json '{
  "review_target": "PR #123: OAuth integration",
  "review_type": "security"
}'
```

**What happens:**
1. QA reviews code (3 min)
2. Returns status: PASS / NEEDS_FIX / BLOCKER
3. Report generated automatically
4. No CTO build step needed

---

### Example 3: Handle Blocker

**Old Way:**
```javascript
// CTO stuck, QA rejecting repeatedly
// Dereck doesn't know what to do
// Might write code himself (BREAKS AUTONOMY)
```

**New Way:**
```bash
# Warren detects QA loop (3 rejections)
# Automatically triggers boardroom

lobster run workflows/boardroom-discussion.lobster --args-json '{
  "feature_request": "OAuth integration",
  "qa_rejection_count": "3",
  "previous_attempts": "CTO tried implicit flow, PKCE flow"
}'
```

**What happens:**
1. Gather CTO perspective (2 min)
2. Gather QA perspective (2 min)
3. GM facilitates discussion
4. Agree on solution
5. Resume pipeline with clear direction

---

## 🛠️ Command Reference

### GM (Dereck) Commands

**Old Command:** → **New Command**

| Task | Old Way | New Way |
|------|---------|---------|
| Build feature | `sessions_spawn(cto, "task")` | `lobster run feature-build.lobster` |
| Review code | `sessions_spawn(qa, "review")` | `lobster run code-review.lobster` |
| Check status | `sessions_list()` | Check Warren reports |
| Handle timeout | Write code yourself ❌ | Let Lobster retry ✅ |

---

### Warren (HR/Ops) Commands

**Manual execution (if needed):**

```bash
# Check agent health
/home/e/.openclaw/workspace/scripts/warren-watchdog.sh

# Check budget
/home/e/.openclaw/workspace/scripts/warren-budget-check.sh

# Detect QA loops
/home/e/.openclaw/workspace/scripts/warren-qa-loop-detector.sh

# Generate EOD report
/home/e/.openclaw/workspace/scripts/warren-eod-report.sh
```

**Cron jobs handle these automatically.**

---

## 📊 File Structure Changes

### New Files Created

```
workspace/
├── skills/
│   └── manager-hierarchy/
│       └── SKILL.md                    # 4-Manager rules
├── workflows/                           # NEW
│   ├── feature-build.lobster           # Main pipeline
│   ├── code-review.lobster             # QA pipeline
│   ├── boardroom-discussion.lobster    # Blocker resolution
│   └── hello-world.lobster             # Test
├── agents/
│   ├── warren.json                     # UPDATED (CRO → HR/Ops)
│   ├── Warren.md                       # NEW (persona)
│   └── cto.json                        # UPDATED (subagent behavior)
└── scripts/
    ├── warren-watchdog.sh              # NEW
    ├── warren-budget-check.sh          # NEW
    ├── warren-qa-loop-detector.sh      # NEW
    ├── warren-eod-report.sh            # NEW
    └── warren-schedule-merged.cron     # NEW
```

---

## ⚠️ Breaking Changes

### 1. GM Cannot Write Code (Hands-Off Protocol)
**Old:** Dereck writes code when CTO timeouts
**New:** Dereck NEVER writes code unless E commands it

**Impact:**
- ✅ True autonomy maintained
- ✅ GM stays in orchestration role
- ⚠️ Requires trust in pipeline/CTO

---

### 2. CTO Spawns Workers (Doesn't Code Directly)
**Old:** CTO might implement directly
**New:** CTO delegates to KiloCode workers

**Impact:**
- ✅ Consistent architecture
- ✅ Free tier models used
- ⚠️ Slightly slower (orchestration overhead)

---

### 3. Warren Reconfigured (CRO → HR/Ops)
**Old:** Warren focused on strategy/ROI
**New:** Warren is system watchdog

**Impact:**
- ✅ Active monitoring
- ✅ Budget tracking
- ⚠️ No strategic role (needs new agent if needed)

---

## 🚀 Rollback Plan (If Needed)

### If Lobster Pipelines Fail:

1. **Stop using pipelines:**
   ```bash
   # Don't trigger new workflows
   ```

2. **Revert to old delegation:**
   ```javascript
   sessions_spawn(agentId: "cto", task: "...")
   sessions_spawn(agentId: "qa", task: "...")
   ```

3. **Disable Warren cron:**
   ```bash
   crontab -l | grep -v warren | crontab -
   ```

4. **Restore old CTO config:**
   ```bash
   git checkout HEAD~1 agents/cto.json
   ```

---

## 📈 Success Metrics

### Before (Old Workflow)
- CTO timeout handling: Manual (GM writes code)
- QA rejection loops: Infinite (no detection)
- System monitoring: None
- Budget tracking: Manual
- Autonomy: Broken (GM intervenes)

### After (New Workflow)
- CTO timeout handling: Automatic (2 retries)
- QA rejection loops: Detected → Boardroom
- System monitoring: Continuous (Warren)
- Budget tracking: Hourly (auto-alerts)
- Autonomy: Maintained (GM orchestrates only)

---

## 🎓 Training

### For GM (Dereck)
1. **Read** `skills/manager-hierarchy/SKILL.md`
2. **Understand** hands-off protocol (Rule 1, 2, 3)
3. **Practice** triggering pipelines instead of sessions_spawn
4. **Learn** to wait for Warren reports instead of checking manually

### For CTO
1. **Read** updated `agents/cto.json`
2. **Understand** subagent behavior rules
3. **Practice** delegating to KiloCode workers
4. **Remember:** Return final message, don't make tool loops

### For QA
1. **Read** `agents/qa.json`
2. **Understand** QA rejection triggers boardroom
3. **Practice** structured report format
4. **Remember:** 3rd rejection = boardroom discussion

### For Warren
1. **Read** `agents/Warren.md`
2. **Understand** monitoring responsibilities
3. **Review** alert thresholds
4. **Remember:** Escalate at 90% budget

---

## 📞 Support

### Issues?
1. Check `IMPLEMENTATION_PLAN.md` for phase status
2. Check `CTO_SUBAGENT_INVESTIGATION.md` for known issues
3. Check `AGENTS.md` for escalation paths
4. Escalate to GM (Dereck) or E (President)

---

*Migration Guide v1.0*
*GM: Dereck | Date: 2026-03-21*
