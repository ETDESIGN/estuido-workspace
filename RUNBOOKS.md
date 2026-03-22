# Runbooks - 4-Manager System Operations

**Date:** 2026-03-21
**For:** GM (Dereck)
**Version:** 1.0

---

## 🚀 Runbook: Feature Development

### Trigger: User requests new feature

**Owner:** Dereck (GM)
**Estimated Time:** 15-60 min (depends on complexity)

---

### Step 1: Receive Request
**User says:** "Build X feature"

**Do:**
- Confirm feature scope
- Check if budget allows ($5/day limit)
- Verify no blockers in current system

---

### Step 2: Trigger Pipeline
**Command:**
```bash
lobster run workflows/feature-build.lobster --args-json '{
  "feature_request": "Build X feature"
}'
```

**What happens:**
- Lobster orchestrates CTO → QA → GM approval
- Automatic retry on CTO timeout (2 attempts)
- QA review with feedback loop
- Boardroom discussion if needed

---

### Step 3: Monitor Progress
**Check:**
- Warren watchdog reports (every 10 min)
- Budget status (hourly)
- QA loop detection (every 15 min)

**Alerts:**
- If CTO timeouts >2: Warren alerts GM
- If budget at 90%: Warren alerts GM
- If QA rejects 2+ times: Warren triggers boardroom

---

### Step 4: Final Approval
**When:** Pipeline reaches GM approval stage

**Do:**
- Review CTO implementation
- Review QA findings
- Present to E (President) for final decision
- On approval: Deploy (if CTO has deploy permission)

**Success criteria:**
- Feature works as specified
- QA status: PASS
- E approves deployment

---

## 🔍 Runbook: Code Review

### Trigger: Need quick code check

**Owner:** Dereck (GM) or any manager
**Estimated Time:** 3-5 min

---

### Step 1: Trigger QA Pipeline
**Command:**
```bash
lobster run workflows/code-review.lobster --args-json '{
  "review_target": "src/components/Dashboard.tsx",
  "review_type": "quick"
}'
```

**Review types:**
- `quick` - Fast check (default)
- `thorough` - Comprehensive review
- `security` - Security-focused
- `performance` - Performance analysis

---

### Step 2: Review QA Report
**Output format:**
```markdown
## QA Review Report
Status: ✅ PASS / ⚠️ NEEDS_FIX / ❌ BLOCKER
Findings: [...]
Required Changes: [...]
```

---

### Step 3: Act on Findings
**If PASS:** Code is good
**If NEEDS_FIX:** Send back to CTO
**If BLOCKER:** Escalate immediately

---

## 🧠 Runbook: Boardroom Discussion

### Trigger: QA rejects CTO work 2+ times

**Owner:** Dereck (GM) (facilitator)
**Estimated Time:** 10-15 min
**Auto-triggered:** By Warren QA loop detector

---

### Step 1: Detection
**Warren alert:**
```
QA LOOP DETECTED
Rejections: 3 (threshold: 2)
Action: TRIGGER_BOARDROOM
```

---

### Step 2: Trigger Boardroom Pipeline
**Command:**
```bash
lobster run workflows/boardroom-discussion.lobster --args-json '{
  "feature_request": "OAuth integration",
  "qa_rejection_count": "3",
  "previous_attempts": "CTO tried implicit flow, PKCE flow"
}'
```

---

### Step 3: Gather Perspectives
**Pipeline does:**
1. Ask CTO: "What's your architectural approach?"
2. Ask QA: "Why are you rejecting this?"
3. Both perspectives documented

---

### Step 4: Facilitate Discussion
**GM (Dereck) role:**
- Review both perspectives
- Identify the blocker
- Propose solution
- Get agreement from both sides

**Example:**
```
CTO says: "PKCE flow is correct"
QA says: "Token storage not secure"

GM proposes: "Use secure storage (env vars) with PKCE"
Both agree: "Yes"
```

---

### Step 5: Resume Pipeline
**With agreed solution:**
- CTO implements with clear direction
- QA reviews against agreed criteria
- Loop should resolve

---

## ⚠️ Runbook: Emergency Intervention

### Trigger: System failure, all agents stuck

**Owner:** E (President) or GM (Dereck)
**Severity:** CRITICAL

---

### Step 1: Assess Situation
**Check:**
- Warren reports (what's failing?)
- Active agent sessions (who's stuck?)
- Budget status (can we afford restart?)

---

### Step 2: Determine Action

**If CTO timeout >3 retries:**
- Option A: Restart CTO manually
- Option B: GM takes over (ONLY if E commands)
- Option C: Escalate to E

**If QA blocked:**
- Option A: Override QA (if false positive)
- Option B: Trigger boardroom
- Option C: Get human review

**If budget exceeded:**
- Option A: Stop all non-essential agents
- Option B: Request increase from E
- Option C: Switch to free models

---

### Step 3: Execute Resolution
**Document action taken**
**Update system state**
**Notify E if needed**

---

## 📊 Runbook: Daily Operations

### Trigger: Every day operations

**Owner:** Warren (auto) + GM (oversight)
**Frequency:** Daily

---

### Morning (09:00)
**Warren:**
- Check agent health
- Generate standup report

**GM:**
- Review standup
- Assign CTO first task of day

---

### Midday (12:00)
**Warren:**
- Check inbox (if configured)
- Check budget status

**GM:**
- Review budget alerts
- Unblock CTO if stuck

---

### Afternoon (15:00)
**Warren:**
- Check QA reviews completed
- Check fs-watcher status

**GM:**
- Ensure QA reviewed CTO's morning work
- Verify fs-watcher running

---

### EOD (18:00)
**Warren:**
- Generate EOD report
- All managers write learnings

**GM:**
- Review EOD summary
- Report to E (President)

---

## 💰 Runbook: Budget Management

### Trigger: Budget check alerts

**Owner:** Warren (auto) + GM (oversight)

---

### At 80% ($4.00)
**Warren action:**
- Alert GM: "Approaching limit"
- Suggest free model switch

**GM action:**
- Review active agents
- Switch non-critical to free models
- Monitor closely

---

### At 90% ($4.50)
**Warren action:**
- Alert GM: "CRITICAL - Nearly exhausted"
- Stop non-essential agents

**GM action:**
- Suspend all non-critical work
- Use only free models
- Prepare to escalate

---

### At 100% ($5.00)
**Warren action:**
- Alert E: "Budget exceeded"
- Stop all agents

**GM action:**
- Escalate to E immediately
- Request budget increase OR
- Halt all operations until reset

---

## 🔧 Runbook: System Health

### Trigger: Warren health alerts

**Owner:** GM (Dereck)

---

### fs-watcher NOT RUNNING
**Check:**
```bash
pgrep -f fs-watcher
```

**If not running:**
- Investigate why it stopped
- Restart if needed
- Check for errors

---

### Agent Timeout >10 min
**Warren detects:**
- Agent silent for >10 min

**GM action:**
- Check agent status
- If stuck: terminate and respawn
- If working: ignore (false positive)

---

### RAM Usage >4GB
**Warren detects:**
- System running low on RAM

**GM action:**
- Stop heavy agents
- Clear caches if needed
- Switch to lighter models

---

## 🚨 Runbook: Escalation Paths

### Level 1: GM (Dereck)
**Can handle:**
- Routine agent coordination
- Pipeline issues
- Budget monitoring
- QA loop facilitation

**Escalate to E when:**
- Budget increase needed
- Production deploy decision
- System failure declared
- Strategic direction needed

---

### Level 2: E (President)
**Final authority on:**
- Budget increases
- Production deployments
- Strategic changes
- System failure recovery

---

## 📝 Runbook: Documentation

### Keep Updated:

**After each incident:**
1. Document in `.learnings/ERRORS.md`
2. Update relevant runbook
3. Share learnings with team

**Weekly:**
- Review runbooks for accuracy
- Update if processes changed
- Archive outdated versions

---

*Runbooks v1.0*
*GM: Dereck | Date: 2026-03-21*
