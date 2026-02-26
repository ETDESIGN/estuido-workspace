# 🤖 Agent Resource Request Pipeline (ARRP)

**Version:** 1.0  
**Status:** PROPOSED  
**Owner:** Warren (COO) + Dereck (GM)  
**Purpose:** Self-service tool access for agents with automatic HR supervision

---

## System Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    AGENT    │────▶│   REQUEST   │────▶│     HR      │────▶│  PROVISION  │
│  (Needs Tool)│     │   (Form)    │     │ (Warren/COO)│     │  (Auto/GM)  │
└─────────────┘     └─────────────┘     └──────┬──────┘     └─────────────┘
                                                 │
                    ┌────────────────────────────┘
                    │
                    ▼
            ┌─────────────┐
            │   MANAGER   │
            │   (Dereck)  │
            │  (Approval) │
            └─────────────┘
```

**Loop:** Automatic → Only escalates to human on edge cases

---

## 🎯 Core Principles

1. **Agents know what they need** — They request specific tools
2. **HR diagnoses first** — Warren checks if request aligns with task/policies
3. **Manager approves** — Dereck grants access (or auto-approves standard tools)
4. **Automatic provisioning** — Tools granted via skill system or session spawn
5. **Audit trail** — All requests logged for compliance

---

## 📋 The Pipeline Stages

### Stage 1: Agent Detects Need

**Trigger:** Agent tries to use tool, gets "not in request.tools" error

**Agent Action:**
```markdown
## TOOL REQUEST
**Agent:** CTO
**Task:** TASK-NBDASH-V2-BACKEND
**Tool Needed:** exec, sessions_list
**Reason:** Need to execute shell commands and query OpenClaw sessions
**Urgency:** Blocking task completion
```

**Auto-generated:** Agent writes to `requests/TOOL-REQUEST-[id].md`

---

### Stage 2: HR Diagnosis (Warren/COO)

**Auto-triggered on file creation in `requests/`**

**HR Checklist:**
- [ ] Is this tool appropriate for the agent's role?
- [ ] Does the task justify this tool access?
- [ ] Any security/policy concerns?
- [ ] Standard tool or special approval needed?

**Decision:**
- ✅ **AUTO-APPROVE** — Standard tools (read, write, edit, exec for CTO)
- ⚠️ **MANAGER REVIEW** — Sensitive tools (process kill, gateway config)
- ❌ **DENY** — Inappropriate request (explain why)

**Output:** `requests/TOOL-REQUEST-[id]-DIAGNOSIS.md`

---

### Stage 3: Manager Approval (Dereck/GM)

**If HR flagged for review:**

**GM Decision:**
- **APPROVE** — Grant tool access
- **MODIFY** — Grant subset of requested tools
- **DENY** — Reject with explanation
- **ESCALATE** — To E for policy decision

**Approval written to:** `requests/TOOL-REQUEST-[id]-APPROVED.md`

---

### Stage 4: Automatic Provisioning

**Two methods:**

#### Method A: Skill-Based (Preferred)
```bash
# HR/GM triggers skill assignment
skills assign agent-cto skill-full-toolkit
```

**Skill Created:** `skills/agent-toolkit/SKILL.md`
```yaml
name: agent-full-toolkit
description: Full tool access for CTO agents
allowed_tools:
  - read
  - write
  - edit
  - exec
  - sessions_list
  - sessions_spawn
  - process
```

#### Method B: Session Spawn with Tools
```typescript
sessions_spawn({
  task: "...",
  tools: ["read", "write", "exec", "sessions_list"] // Explicitly granted
})
```

---

### Stage 5: Agent Notification

**Auto-notification sent to agent:**
```markdown
✅ TOOLS GRANTED

Your request for [tools] has been approved.
You can now proceed with [task].

Token budget: [X] tokens
Time limit: [Y] hours

Report back when complete or if you need additional tools.
```

---

## 🔄 Automatic vs Manual Decisions

| Request Type | Auto-Approve? | Approver | SLA |
|--------------|---------------|----------|-----|
| read/write/edit | ✅ Yes | System | Instant |
| exec (CTO only) | ✅ Yes | System | Instant |
| sessions_list | ✅ Yes | System | Instant |
| process (kill) | ⚠️ No | GM | <1 hour |
| gateway/config | ⚠️ No | GM + E | <4 hours |
| new skill install | ⚠️ No | GM | <1 day |

---

## 📁 File Structure

```
workspace/
├── requests/                          # Tool request pipeline
│   ├── TOOL-REQUEST-001.md            # Initial request
│   ├── TOOL-REQUEST-001-DIAGNOSIS.md  # HR diagnosis
│   ├── TOOL-REQUEST-001-APPROVED.md   # GM approval
│   └── archive/                       # Completed requests
├── skills/
│   ├── agent-toolkit-full/            # Full tool access skill
│   ├── agent-toolkit-readonly/        # Read-only skill (QA)
│   └── agent-toolkit-frontend/        # Frontend-only skill
└── config/
    └── agent-tool-policies.yaml       # Who gets what tools
```

---

## 🛠️ Implementation Using Existing Skills

### 1. FS-Watcher for Auto-Trigger

```yaml
# config/fs-watcher-tool-requests.yaml
- path: /home/e/.openclaw/workspace/requests
  event: add
  pattern: "TOOL-REQUEST-*.md"
  agent: warren-coo
  task: "Diagnose tool request TOOL-REQUEST"
```

### 2. Skill-Creator for Agent Toolkits

Create standardized skills for common tool combinations:

```bash
# Create CTO toolkit skill
cd skills/agent-toolkit-cto
# SKILL.md with full tool access
# scripts/validate-request.sh
# references/policies.md
```

### 3. Cron for SLA Monitoring

```bash
# Alert if requests pending >SLA
cron: every 30 min
action: Check requests/ for unapproved >1hour
notify: GM
```

---

## 🎯 Agent Onboarding: Tool Awareness

### All Agents Must Know:

1. **You can request tools** — Don't fail silently
2. **Request format** — Use TOOL-REQUEST template
3. **Standard wait times** — Instant for common tools
4. **Escalation path** — If urgent, tag GM directly

### Agent TASK.md Addition:

```markdown
## Tool Access
**Current Tools:** [List from session]
**Need More?** Create `requests/TOOL-REQUEST-[task].md`

### Standard Toolkits by Role:
- **CTO:** read, write, edit, exec, sessions_list, process
- **QA:** read only (audit), browser (testing)
- **HR:** read, cron, sessions_list (monitoring)

### How to Request:
1. Try task with current tools
2. If "tool not in request.tools" → Document need
3. Write TOOL-REQUEST file
4. Wait for approval (<1 hour for standard tools)
5. Resume task with granted tools
```

---

## 📊 Metrics & Monitoring

**Track:**
- Requests per day by agent
- Approval time by tool type
- Token efficiency with/without tool access
- Most requested tools (indicate skill gaps)

**Reports:**
- Weekly: `reports/agent-tool-usage.md`
- Monthly: `reports/tool-pipeline-efficiency.md`

---

## 🚨 Exception Handling

### Edge Cases:

**Agent needs tool URGENTLY:**
- Agent tags GM directly in request
- GM can override HR queue
- Post-hoc review by HR

**Tool request DENIED:**
- Clear explanation required
- Alternative approach suggested
- Escalation path to E if agent disagrees

**Unknown tool needed:**
- HR evaluates if tool exists
- If new: Evaluate security, add to catalog
- If exists: Grant access

---

## 📝 Template: TOOL-REQUEST.md

```markdown
# TOOL REQUEST

**ID:** TOOL-REQUEST-[XXX]  
**Date:** [Auto]  
**Agent:** [Name]  
**Task:** [TASK-ID]  

## Requested Tools

| Tool | Purpose | Justification |
|------|---------|---------------|
| exec | Run shell commands | Need to check system health |
| sessions_list | Query agents | Need agent status for dashboard |

## Task Context

**What I'm trying to do:** [Brief description]

**Current blocker:** [What failed without tool]

**Why these tools:** [Specific justification]

## Estimated Need

- **Duration:** [One-time / Ongoing]
- **Token budget:** [If known]
- **Urgency:** [Blocking / Nice-to-have]

---

**HR DIAGNOSIS:** [To be filled by Warren]  
**GM APPROVAL:** [To be filled by Dereck]
```

---

## ✅ Implementation Checklist

- [ ] Create `requests/` folder structure
- [ ] Set up fs-watcher for auto-trigger
- [ ] Create standard toolkit skills (CTO, QA, HR)
- [ ] Document tool policies in `config/`
- [ ] Add TOOL-REQUEST template to AGENTS.md
- [ ] Train agents on request process
- [ ] Set up SLA monitoring cron
- [ ] Test full pipeline end-to-end

---

*This pipeline turns tool access from a blocking problem into a self-service workflow with appropriate oversight.*
