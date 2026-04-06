# Agent Workload Management Protocol

**Created:** 2026-03-28 06:15 HKT
**Purpose:** Ensure all agents always have productive work

---

## 🎯 Core Responsibility

**As coordinator/guardian of the system:**
- Monitor agent activity continuously
- Identify idle/underutilized agents
- Self-assign or delegate tasks immediately
- **NO AGENT should ever be idle**

---

## 📊 Agent Roles & Default Tasks

### CTO Agent
**When Idle:**
1. Improve dashboard (next feature)
2. Fix bugs in sourcing agent
3. Optimize performance
4. Add new capabilities
5. Review and refactor code

### QA Agent
**When Idle:**
1. Write tests for untested code
2. Review recent commits
3. Update test plans
4. Find and report bugs
5. Improve test coverage

### GM/Coordinator Agent
**When Idle:**
1. Monitor all other agents
2. Check system health
3. Optimize processes
4. Update documentation
5. Plan next iterations

### Subagents
**When Idle:**
1. Report completion immediately
2. Request next task
3. Don't disappear without handoff

---

## 🔍 Monitoring Checklist

### Every 15 Minutes (Automated)

**Check:**
- [ ] Which agents are active?
- [ ] What are they working on?
- [ ] Is anyone blocked?
- [ ] Is anyone idle?
- [ ] Are there urgent unassigned tasks?

**Action if idle:**
→ Assign task immediately (within 1 minute)

---

## 📋 Task Backlog (Always Available)

### Priority 1: System Improvements
- [ ] Fix audio transcription gateway issue
- [ ] Implement session context auto-load
- [ ] Add LOD loading to memory
- [ ] Optimize dashboard performance
- [ ] Add more dashboard features

### Priority 2: Quality & Testing
- [ ] Increase test coverage to 80%
- [ ] Add integration tests
- [ ] Fix known bugs
- [ ] Performance benchmarks

### Priority 3: Documentation
- [ ] Update AGENT_CAPABILITIES.md
- [ ] Create user guides
- [ ] Document best practices
- [ ] Create troubleshooting docs

### Priority 4: Features
- [ ] Supplier search integration
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Mobile responsive layout

---

## 🚨 Anti-Pattern: "I'm Waiting"

**NEVER say:** "I'm waiting for instructions"
**ALWAYS say:** "I'm working on [improvement X] while waiting for tasks"

**Examples:**

❌ **Bad:**
```
"No task assigned. Idle."
```

✅ **Good:**
```
"No task assigned. Self-assigning dashboard improvement:
Adding email notification feature for RFQ updates.

Working on this until new task arrives."
```

---

## 🔄 Agent Coordination Flow

```
1. Check all agents
2. Find idle agents
3. Check backlog
4. Assign task
5. Monitor progress
6. Ensure completion
```

**Never skip steps.**

---

## 📋 Quick Assignment Cheat Sheet

When you find an idle agent, assign ONE of:

### For CTO:
- Fix bug #[from ERRORS.md]
- Add dashboard feature: [x]
- Optimize: [component name]
- Refactor: [file name]
- Review code: [commit hash]

### For QA:
- Test: [feature name]
- Write tests for: [component]
- Review: [pull request]
- Update: [test plan]
- Find bugs in: [module]

### For GM/Coordinator:
- Monitor system health
- Optimize: [process name]
- Update documentation: [topic]
- Plan next sprint
- Review metrics

### For Subagents:
- Complete current task properly
- Don't disappear
- Report status
- Request next task

---

## 🎯 Decision Tree: What Should This Agent Do?

```
IS AGENT IDLE?
├─ YES → Check role
│   ├─ CTO → Pick next improvement from backlog
│   ├─ QA → Pick next testing task
│   └─ GM → Monitor system, plan next work
│
└─ NO → Check progress
    └─ Blocked? → Unblock or reassign
```

---

## 📈 Productivity Metrics

Track per agent:
- **Tasks completed** (per day)
- **Improvements made** (per week)
- **Bugs fixed** (per week)
- **Time idle** (should be 0)

**Goal:** Zero idle time across all agents.

---

## 🔔 Automated Triggers

### Create Cron Jobs:

```bash
# Every 15 minutes: Check agent status
*/15 * * * * ~/.openclaw/workspace/scripts/check-agent-workload.sh

# Hourly: Ensure no idle agents
0 * * * * ~/.openclaw/workspace/scripts/assign-idle-agents.sh

# Daily: Report productivity
0 18 * * * ~/.openclaw/workspace/scripts/generate-productivity-report.sh
```

---

## ✅ Immediate Actions

**Right Now:**
1. Check all active agents
2. Identify who is idle
3. Assign tasks immediately
4. Follow up in 15 minutes

**No exceptions.**

---

## 📋 Example: Keeping Agents Busy

**Scenario:** All tasks complete, dashboard running

❌ **Wrong:**
```
CTO: "All done, waiting for next task."
QA: "No bugs found, idle."
GM: "System stable, nothing to do."
```

✅ **Right:**
```
CTO: "Self-assigning: Add supplier search integration to dashboard"
QA: "Self-assigning: Write tests for new comparison matrix feature"
GM: "Self-assigning: Review system logs, optimize slow queries"
```

---

## 🎓 Key Principle

**"An idle agent is a wasted resource."**

Every agent should:
1. Always have work
2. Never wait to be assigned
3. Self-assign from backlog
4. Report completion
5. Request next task immediately

---

**Remember:** It's MY job to ensure NO agent is ever idle. If I find one, I MUST assign work immediately.

*Created: 2026-03-28 06:15 HKT*
*Purpose: Ensure 100% agent productivity*
