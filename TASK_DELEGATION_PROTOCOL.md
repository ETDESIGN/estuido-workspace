# Task Delegation Protocol (Watchdog Pattern)

**Last Updated:** 2026-03-28 05:16 HKT
**Purpose:** Prevent fire-and-forget task failures

---

## 🔴 PROBLEM

Subagents are spawned but never followed up, causing:
- Tasks to stall in silence for hours/days
- No progress visibility
- Wasted time and momentum
- Example: 6-day activity gap after Feature 4 completion

---

## ✅ SOLUTION: MANDATORY WATCHDOG PATTERN

### When You Delegate to a Subagent:

**Step 1: Spawn the Subagent**
```python
sessions_spawn({
    "task": "<task description>",
    "mode": "session",  # or "run"
    "runtime": "subagent"
})
```

**Step 2: IMMEDIATELY Set a Watchdog Cron**
```python
# Schedule a check 5 minutes from now
cron add:
    schedule: { kind: "at", at: "<ISO 8601, 5 min from now>" }
    payload: { kind: "systemEvent", text: "Watchdog: check if <task description> completed. Expected: <files/state>. If not done, check agent status, retry, or do it yourself." }
    sessionTarget: "main"
```

**Step 3: When Watchdog Fires**
- Check if expected output exists (files, state changes, messages)
- ✅ If done → Great, clean up
- ❌ If not done → Check agent status (`sessions_history`)
  - Is it alive? Stuck? Dead?
- **If stuck/dead → TAKE OVER YOURSELF**
  - NO MORE SPAWNING
  - NO MORE WAITING
  - Do the work inline

---

## 📊 Escalation Rules

| Time Since Spawn | Action |
|------------------|--------|
| 0 min | Spawn subagent + set 5-min watchdog |
| 5 min | Watchdog fires → check progress |
| 5-10 min | If stalled → take over, do inline |
| 10+ min | NEVER spawn again for same task |

---

## 🚨 AGENT RESPONSIBILITIES

### For the Requester (You):
1. **Set watchdog IMMEDIATELY** after spawning (same function call)
2. **Check expected outputs** when watchdog fires
3. **Take over** if subagent is stuck/dead
4. **Report blockers** immediately (don't wait for watchdog)

### For the Subagent:
1. **Acknowledge task** within 1 minute
2. **Report blockers** within 2 minutes (say: "I'm stuck on X, need Y")
3. **Status updates** every 5 minutes during long tasks
4. **Radio silence = escalation** (if you don't hear back, requester will take over)

---

## 📋 Watchdog Payload Template

```yaml
watchdog_check:
  task: "<brief task description>"
  spawned_at: "<timestamp>"
  expected_output:
    - "<file or state that should exist>"
    - "<another expected result>"
  timeout_minutes: 5
  escalation: "take_over_inline"  # or "retry_once" or "report_to_user"
  check_command: "<how to verify completion>"
  fallback_action: "<what to do if not done>"
```

---

## 🎯 Example: Correct Delegation

### ❌ WRONG (Fire-and-Forget):
```python
# Spawn and hope for the best
sessions_spawn({"task": "Build dashboard"})
# ⚠️ No watchdog, no monitoring, no follow-up
```

### ✅ RIGHT (With Watchdog):
```python
# 1. Spawn
sessions_spawn({
    "task": "Build Streamlit dashboard at ~/.openclaw/workspace/sourcing-agent/dashboard.py",
    "mode": "session",
    "label": "build-dashboard"
})

# 2. IMMEDIATELY set watchdog (in same response)
cron add:
    schedule: { kind: "at", at: "2026-03-28T05:21:00Z" }  # 5 min out
    payload: {
        kind: "systemEvent",
        text: "Watchdog: Dashboard build. Expected: ~/.openclaw/workspace/sourcing-agent/dashboard/dashboard.py exists and streamlit runs on port 8501. If not done, check session 'build-dashboard' status. If stuck, take over and build inline.",
        expected_files: ["~/.openclaw/workspace/sourcing-agent/dashboard/dashboard.py"],
        check_url: "http://localhost:8501"
    }
    sessionTarget: "main"
```

### When Watchdog Fires (5 min later):
```python
# Check if done
if not exists("~/.openclaw/workspace/sourcing-agent/dashboard/dashboard.py"):
    # Check subagent status
    status = sessions_history("build-dashboard")
    if status == "stuck" or status == "dead":
        # TAKE OVER - do it yourself inline
        write(dashboard.py, ...)
        exec("streamlit run dashboard/dashboard.py")
```

---

## ⏱️ Timing Guidelines

| Task Type | Initial Timeout | Watchdog Interval | Max Total Time |
|-----------|-----------------|-------------------|----------------|
| Quick (< 5 min) | 3 min | N/A | 5 min |
| Medium (5-15 min) | 5 min | 5 min | 15 min |
| Long (15-60 min) | 10 min | 10 min | 60 min |
| Very Long (> 60 min) | 15 min | 15 min | 2 hours |

**Rule:** If task exceeds "Max Total Time" → take over immediately

---

## 🔍 Monitoring Commands

### Check Subagent Status:
```bash
# List all subagents
sessions_list kinds=["subagent"]

# Get specific session history
sessions_history sessionKey="agent:main:subagent:..."

# Check if alive
grep -r "<session-id>" ~/.openclaw/agents/main/sessions/
```

### Kill Stuck Subagent:
```python
subagents(action="kill", target="<session-id>")
```

---

## 📈 Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Tasks with watchdog | 0% | 100% |
| Task completion rate | ~50% | 90% |
| Average stall time | Hours | < 10 min |
| Take-over rate | N/A | < 10% |

---

## 🎓 LEARNINGS FROM FAILURES

### Learning: CTO Activity Gap (LRN-20260327-001)
- **Issue:** 6-day gap after Feature 4 completion
- **Root Cause:** No watchdog, no monitoring, task handoff without next-step planning
- **Fix:** This protocol

### Learning: Dashboard Build Stalled
- **Issue:** Subagent ran 4+ hours, unclear status
- **Root Cause:** No watchdog set
- **Fix:** 5-minute watchdog with take-over

---

## ✅ CHECKLIST (Before Spawning)

- [ ] Task is clear and specific
- [ ] Expected outputs defined (files, states, URLs)
- [ ] Timeout set based on task type
- [ ] Watchdog cron scheduled (5 min out)
- [ ] Escalation plan defined (take over vs retry)
- [ ] Subagent knows to report blockers < 2 min

---

**Remember:** Silence is not acceptance. Radio silence = escalation. When the watchdog fires and the task isn't done, TAKE OVER. No more spawning, no more waiting.

*Generated: 2026-03-28 05:16 HKT*
*Purpose: Fix Issue #3 - Fire-and-forget task delegation*
*Reference: LRN-20260327-001 (CTO activity gap)*
