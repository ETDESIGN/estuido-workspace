---
name: dev-team
version: 1.0.0
description: Orchestrate the multi-agent development team. Plan → Code → Review → Test → Deploy loop.
---

# Dev Team Skill — Pipeline Orchestrator

This skill coordinates E-Studio's development team through a structured pipeline.

## Team Roster

| Agent | ID | Role | Model |
|-------|-----|------|-------|
| 📋 Planner | `planner` | PM — tickets, priorities, coordination | GLM-5 Turbo (free) |
| ⚛️ Frontend Coder | `frontend-coder` | React/TypeScript/Tailwind | GLM-5 Turbo + Kilo free |
| 🔧 Backend Coder | `backend-coder` | APIs/DBs/Server-side | GLM-5 Turbo + Kilo free |
| 🛠️ CTO | `cto` | Architecture, fullstack, technical lead | GLM-5 Turbo + Kilo free |
| 🔍 QA | `qa` | Code review, testing | GLM-5 Turbo + Kilo free |
| 🚀 Deployer | `deployer` | Vercel/Docker, monitoring | GLM-5 Turbo (free) |

## Pipeline

```
REQUEST → PLAN → CODE → REVIEW → TEST → DEPLOY → DONE
                      ↑____________|  (max 3 rounds)
```

## How to Use

### Start a New Project
When Etia describes a feature/project:

1. **Spawn Planner** with the feature description:
```
sessions_spawn({
  agentId: "planner",
  task: "Break down this feature into tickets: [description]",
  mode: "run",
  runTimeoutSeconds: 300
})
```

2. Planner creates tickets in `memory/tasks/` and reports back

3. **Assign tickets** to coders based on type:
- Frontend → `frontend-coder`
- Backend → `backend-coder`
- Fullstack/Complex → `cto`

4. **Spawn coders** (can be parallel for independent tickets):
```
sessions_spawn({
  agentId: "frontend-coder",
  task: "Execute ticket T-001: [ticket content]. Work in /path/to/project",
  mode: "run",
  runTimeoutSeconds: 600
})
```

5. **Spawn QA** after coder completes:
```
sessions_spawn({
  agentId: "qa",
  task: "Review code changes for T-001: [files changed]. Run tests. PASS/NEEDS_FIX/BLOCKER?",
  mode: "run",
  runTimeoutSeconds: 300
})
```

6. **If QA passes** → spawn Deployer
7. **If QA says NEEDS_FIX** → back to coder (max 3 times)
8. **If QA says BLOCKER** → escalate to GM/Etia

### Monitor Progress
Check `memory/tasks/PIPELINE.md` for current state.

### Kilo CLI Patterns for Coders

**Frontend (React/TS):**
```bash
kilo run --model kilo/x-ai/grok-code-fast-1:optimized:free \
  "Implement [requirement]. Use React + TypeScript + Tailwind." \
  --workdir /path/to/project
```

**Backend (API/DB):**
```bash
kilo run --model kilo/deepseek/deepseek-r1-0528 \
  "Implement [requirement]. Create Express API endpoints." \
  --workdir /path/to/project/api
```

**Quick fixes:**
```bash
kilo run --model kilo/stepfun/step-3.5-flash:free \
  "Fix: [issue description]"
```

## Rules

1. **Always use free models** — GLM-5 Turbo for agents, Kilo free models for coding
2. **Max 3 review loops** — escalate to Etia after 3 QA rejections
3. **One ticket per coder** — don't overload
4. **Watchdog timeout** — set 5-min watchdog for each agent spawn
5. **Report blockers immediately** — silence is escalation
6. **Update PIPELINE.md** after every stage transition
7. **Parallel when possible** — independent tickets can run simultaneously

## Communication

- **Team channel:** WhatsApp (until Discord is fixed)
- **Escalation to Etia:** Any BLOCKER or after 3 QA rejections
- **Status updates:** Update `memory/tasks/PIPELINE.md`

## Cost Targets

| Activity | Model | Cost |
|----------|-------|------|
| Planning | GLM-5 Turbo | $0 |
| Coding | Kilo free models | $0 |
| Review | GLM-5 Turbo | $0 |
| Testing | GLM-5 Turbo | $0 |
| Deploy | GLM-5 Turbo | $0 |
| **Total per feature** | | **$0** |
