# Agentic Development Team — Research & Blueprint
**Date:** 2026-03-30
**Status:** Draft — Pending Etia Approval

---

## 📦 PART 1: WHAT WE ALREADY HAVE

### Existing Agents (7 total)
| Agent | Role | Status |
|-------|------|--------|
| **main** | Primary agent (me) | ✅ Active |
| **cto** | Engineering Manager | ✅ Has models.json (Moonshot) |
| **planner** | Planning | ⚠️ Only has auth-profiles.json |
| **qa** | Quality Manager | ✅ Has models.json |
| **warren** | System/Finance | ✅ Has models.json |
| **derek-negotiator** | Supplier negotiation | ✅ Custom |
| **sourcing-agent** | Sourcing | ✅ Custom |

### Relevant Skills (34 workspace + 7 system)
| Category | Skills | Dev Team Use |
|----------|--------|-------------|
| **Coding** | `code`, `kilocli-coding-agent`, `cursor-agent`, `react`, `typescript`, `tandem` | ✅ Core coding |
| **Testing** | `test-runner` | ✅ QA automation |
| **Git** | `git` | ✅ Version control |
| **Deploy** | `vercel`, `vercel-deploy`, `docker` | ✅ CI/CD |
| **Database** | `db` | ✅ Backend |
| **Orchestration** | `manager-hierarchy`, `tiered-intelligence`, `clawteam`, `clawflows` | ✅ Team mgmt |
| **Monitoring** | `fs-watcher`, `ez-cronjob`, `self-improving-agent` | ✅ Automation |
| **Agent** | `agent-browser`, `proactive-agent-lite`, `self-improving-agent` | ✅ Agent infra |
| **Other** | `dashboards`, `discord`, `communication-protocol` | Support |

### CLI Tools Installed
| Tool | Path | Purpose |
|------|------|---------|
| **Kilo CLI** v7.0.46 | `/home/e/.npm-global/bin/kilo` | Headless coding agent — `kilo run`, `kilo serve` |
| **ClawTeam** | `~/.local/bin/clawteam` | Multi-agent swarm coordination |
| **ClawFlows** | `~/.local/bin/clawflows` | 112 prebuilt workflows, scheduler running |

### Kilo CLI — Free Models (8 available)
| Model | Best For |
|-------|----------|
| `kilo/deepseek/deepseek-r1-0528` | Complex reasoning (par with o1) |
| `kilo/x-ai/grok-code-fast-1:optimized:free` | **Fast coding** 🎯 |
| `kilo/xiaomi/mimo-v2-pro` | Advanced tool use |
| `kilo/stepfun/step-3.5-flash` | Quick tasks |
| `kilo/minimax/minimax-m2.5` | Agent-centric tasks |
| `kilo/arcee-ai/trinity-large-preview` | General coding |
| `kilo/nvidia/nemotron-3-super-120b` | Large context |

### Integrations
| Integration | Status |
|-------------|--------|
| **Vercel** | ✅ Skills installed (vercel + vercel-deploy) |
| **GitHub** | ✅ Git skill, kilo pr command |
| **Discord** | ✅ Skill + channels configured |
| **WhatsApp** | ✅ Active (current channel) |

---

## 🕳️ PART 2: GAPS — WHAT'S MISSING

### Critical Gaps
1. **Planner agent has no models.json** — can't run independently
2. **No frontend specialist agent** — CTO does everything currently
3. **No backend specialist agent** — same
4. **No CI/CD pipeline** — manual deployment only
5. **No code review automation** — QA exists but no structured review loop
6. **No project tracking** — tasks live in memory, not a proper tracker
7. **No cost monitoring** for coding tokens — Kilo free tier could get eaten up

### Nice-to-Have Gaps
8. **No OpenHands/Cline/Aider** as fallback coding CLIs
9. **No Stitch skill** for multi-file coordinated edits
10. **No browser testing** beyond Tandem
11. **No performance benchmarking** tools

---

## 🌐 PART 3: RESEARCH FINDINGS

### How Others Build Agentic Dev Teams

**1. The "Deterministic Pipeline" Pattern** (dev.to/ggondim)
- Pipeline: `Code → Review (max 3 iterations) → Test → Done`
- Uses OpenClaw sub-agents for programmer, reviewer, tester
- Key insight: **max iterations** prevent infinite loops

**2. The "Multi-Agent Blueprint"** (ClawHub — suspicious, but architecture is sound)
- 5-10 agent teams with cross-agent routing
- PM agent plans → delegates to Dev agents → Reviewer validates

**3. Claude Code Agent Teams** (Reddit r/codereview)
- Shift role from "manual coder" to "Lead Engineer"
- Assign specific roles: write, review, test code
- ~$20/month to run a junior dev team

**4. Anthropic's 2026 Agentic Coding Trends**
- Multi-agent coordination is THE priority for 2026
- AI-automated review scales human oversight
- Tighter feedback loops between agents
- Key: agents should work in parallel, not sequentially

**5. Kilo CLI Best Practices**
- Use `kilo run` for non-interactive coding (perfect for sub-agents)
- Use `kilo serve` for headless background coding
- Free models (grok-code-fast, deepseek-r1) are excellent for coding
- `kilo pr <number>` fetches and checks out GitHub PRs automatically

### Key Insight
The winning pattern is: **Plan → Code (parallel) → Review → Test → Deploy → Iterate** with max iteration limits and cost controls at each stage.

---

## 🏗️ PART 4: ARCHITECTURE PROPOSAL

### Team Structure (6 Roles)

```
                    ┌─────────────┐
                    │  Etia / GM  │  (Human + Main Agent)
                    │  🎯 Dereck  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  PLANNER    │  Plans tasks, breaks into tickets
                    │  📋 PM Agent│
                    └──────┬──────┘
                           │ splits tasks
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌──▼────────┐ ┌▼───────────┐
       │  FRONTEND   │ │ BACKEND   │ │  FULLSTACK │
       │  ⚛️ Coder   │ │ 🔧 Coder  │ │  💻 Coder  │
       │  React/TS   │ │ Node/DB   │ │  Kilo CLI  │
       └──────┬──────┘ └──┬────────┘ └┬───────────┘
              │            │            │
              └────────────┼────────────┘
                           │ code complete
                    ┌──────▼──────┐
                    │  REVIEWER   │  Code review, lint, type-check
                    │  🔍 QA Agent│  Max 3 iteration loop
                    └──────┬──────┘
                           │ approved
                    ┌──────▼──────┐
                    │  DEPLOYER   │  Auto-deploy to Vercel/Docker
                    │  🚀 DevOps  │  Rollback on failure
                    └─────────────┘
```

### Agent Configurations

| Agent | ID | Model (Free/Cheap) | Kilo CLI? | Key Skills |
|-------|-----|--------------------|-----------|------------|
| Planner | `planner` | Moonshot (existing) | No | manager-hierarchy, code (planning) |
| Frontend Coder | `frontend-coder` | grok-code-fast:free via Kilo | ✅ `kilo run` | react, typescript, kilocli-coding-agent |
| Backend Coder | `backend-coder` | deepseek-r1-0528:free via Kilo | ✅ `kilo run` | db, docker, kilocli-coding-agent |
| Fullstack Coder | `cto` (upgraded) | Various via Kilo | ✅ `kilo run` | code, kilocli-coding-agent, git |
| Reviewer | `qa` (upgraded) | Moonshot (existing) | No | test-runner, git (diff analysis) |
| Deployer | `deployer` | Moonshot | No | vercel-deploy, docker, git |

### The Development Loop

```
1. PLAN:    Planner receives feature request → breaks into subtasks → creates tickets
2. CODE:    CTO assigns subtasks to Frontend/Backend/Fullstack coders (parallel)
3. REVIEW:  QA reviews each PR → requests fixes (max 3 rounds)
4. TEST:    QA runs test-runner → PASS/NEEDS_FIX/BLOCKER
5. DEPLOY:  Deployer pushes to Vercel → monitors → auto-rollback if broken
6. ITERATE: fs-watcher + cron monitors → feeds learnings back into next cycle
```

### Cost Optimization Strategy

| Layer | Model | Cost | When Used |
|-------|-------|------|-----------|
| **Planning** | Moonshot/Kimi K2 | Free tier | Breaking down tasks |
| **Coding** | Kilo free models | **$0** | All actual code writing via `kilo run` |
| **Review** | Qwen 4B | **$0** | Linting, type checking, basic review |
| **Testing** | Kilo free models | **$0** | Running tests |
| **Architecture** | Claude Sonnet (Tier 3) | ~$3/M tokens | Complex decisions only |

**Target cost: ~$0-5/month for most projects** by routing all coding through Kilo free models.

### Kilo CLI Integration Pattern

```bash
# Frontend coder spawns Kilo for React work
SCRATCH=$(mktemp -d)
kilo run --model kilo/x-ai/grok-code-fast-1:optimized:free \
  "Implement the user dashboard component with these specs: ..." \
  --workdir $SCRATCH

# Backend coder spawns Kilo for API work
kilo run --model kilo/deepseek/deepseek-r1-0528 \
  "Create Express API endpoints for user management: ..." \
  --workdir ~/project/api

# CTO reviews Kilo output
kilo run --model kilo/minimax/minimax-m2.5:free \
  "Review this PR and suggest improvements: ..."
```

---

## 📋 PART 5: IMPLEMENTATION PLAN

### Phase 1: Foundation (Tonight/Tomorrow)
- [ ] **Fix Planner agent** — add models.json, write SOUL.md with PM persona
- [ ] **Create frontend-coder agent** — SOUL.md + models.json + Kilo CLI integration
- [ ] **Create backend-coder agent** — SOUL.md + models.json + Kilo CLI integration
- [ ] **Create deployer agent** — SOUL.md + models.json + Vercel/Docker skills
- [ ] **Upgrade CTO agent** — add Kilo CLI instructions to workspace
- [ ] **Upgrade QA agent** — add structured review loop (max 3 iterations)

### Phase 2: The Loop (Day 2)
- [ ] **Build task board** — create `memory/tasks/` with ticket format (TICKET.md template)
- [ ] **Wire the pipeline** — Planner → Coders → QA → Deployer with ClawTeam/ClawFlows
- [ ] **Add auto-review** — QA auto-reviews every PR, max 3 rounds before escalation
- [ ] **Set up cost monitoring** — Kilo stats + tiered-intelligence routing

### Phase 3: Hardening (Day 3)
- [ ] **Add browser testing** — Tandem + agent-browser for visual regression
- [ ] **Add CI/CD** — auto deploy on merge, auto rollback on failure
- [ ] **Add project dashboard** — update MISSION_CONTROL dashboard with dev team status
- [ ] **Document everything** — update ESTUDIO_WORKFLOW_DOCUMENTATION.md

---

## 🔑 KEY DECISIONS NEEDED FROM ETIA

1. **Agent names** — should frontend-coder, backend-coder, deployer have Chinese names or English?
2. **Model budget** — should we use strictly free models, or allow small paid budget for complex tasks?
3. **First project** — what should the dev team build first as a test run?
4. **GitHub org** — should we create a new GitHub repo/org for dev team projects?
5. **Communication channel** — should dev team coordinate via Discord channels or WhatsApp?

---

## ✅ IMPLEMENTATION STATUS (as of 2026-03-30 23:40 HKT)

### Phase 1: Foundation — COMPLETE ✅
- [x] **Planner agent** — config.json, models.json, SOUL.md, workspace, MEMORY.md
- [x] **Frontend Coder agent** — config.json, models.json, SOUL.md, workspace, MEMORY.md
- [x] **Backend Coder agent** — config.json, models.json, SOUL.md, workspace, MEMORY.md
- [x] **Deployer agent** — config.json, models.json, SOUL.md, workspace, MEMORY.md
- [x] **CTO** — already existed, has config + models + Moonshot API
- [x] **QA** — already existed, has config + models
- [x] **Gateway config** — all 10 agents registered in agents.list
- [ ] **CTO SOUL.md upgrade** — add Kilo CLI instructions
- [ ] **QA SOUL.md upgrade** — add structured review loop (max 3 iterations)

### Phase 2: The Loop — PENDING
- [ ] Task board system (ticket format + tracker)
- [ ] Wire pipeline (Planner → Coders → QA → Deployer)
- [ ] Auto-review system
- [ ] Cost monitoring

### Phase 3: Hardening — PENDING
- [ ] Browser testing
- [ ] CI/CD pipeline
- [ ] Project dashboard
- [ ] Documentation update

---

*Phase 1 complete. Phase 2 ready to start.*
