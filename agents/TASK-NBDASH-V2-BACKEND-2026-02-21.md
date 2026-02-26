# TASK: NB Studio Dashboard v2 - Backend Implementation

**Created:** 2026-02-21
**Project:** New Mission Control Dashboard
**Assigned to:** CTO Agent
**Status:** NOT_STARTED

---

## Goal
Build the backend API for the new Mission Control Dashboard so the frontend can display real-time data.

## Context
- **Frontend:** Complete at `nb-studio-dashboard/` (React + Vite + Tailwind)
- **Frontend Repo:** https://github.com/ETDESIGN/nb-studio-dash-v2
- **Spec:** `docs/NB_DASHBOARD_V2_IMPLEMENTATION_PLAN.md`
- **Data Contract:** See SPEC below

---

## Deliverables

### 1. Core API Endpoint
- `GET /api/dashboard` — Returns full dashboard state
- Match the frontend's expected data structure (see SPEC)

### 2. Data Sources Integration
- OpenClaw sessions API (active agents, status)
- System metrics (CPU, memory, disk)
- Cost data (daily spend)
- Service status (gateway, cost-monitor, etc.)

### 3. Action Endpoints (Phase 2)
- `POST /api/agents/:id/halt` — Stop an agent

---

## SPEC: Dashboard Data Contract

```typescript
{
  uplinkTime: string,        // ISO timestamp
  
  stats: {
    totalAgents: number,
    activeSessions: number,
    costToday: number,
    tokensToday: number,
    tasksCompletedToday: number
  },

  systemHealth: {
    cpu: number,             // 0-100%
    disk: number,            // 0-100%
    memory: {
      used: number,         // MB
      total: number,         // MB
      percent: number        // 0-100%
    }
  },

  services: {
    openclawGateway: { status: "running" | "stopped" | "error" },
    costMonitor: { status: "active" | "inactive" },
    pulseUplink: { status: "sending" | "idle" }
  },

  agents: [
    {
      id: string,
      name: string,
      role: string,
      model: string,
      status: "thinking" | "idle" | "working" | "offline" | "error",
      task: string,
      contextUsed: number,    // kTokens
      contextTotal: number,   // kTokens
      color: string
    }
  ],

  socialQueue: [
    { day: number, title: string, type: string, status: string }
  ],

  vaultFiles: [
    { id: string, name: string, type: string, category: string, modified: string }
  ],

  modelMetrics: [
    { model: string, tasks: number, cost: number, efficiency: number }
  ]
}
```

---

## Technical Approach

**Recommended:** Next.js API routes (Option A from spec)
- Use existing `nb-studio-dashboard/` Next.js project
- Add API routes under `src/app/api/`
- Deploy to Vercel

**Data Collection:**
1. `sessions_list` from OpenClaw for agent data
2. `exec` commands for system metrics (CPU, memory, disk)
3. Parse cost logs for spending data
4. Check process status for services

---

## Acceptance Criteria

- [ ] `GET /api/dashboard` returns valid JSON matching the data contract
- [ ] All required fields present (no undefined/null where not expected)
- [ ] Agent list populated from active sessions
- [ ] System health shows real CPU/memory/disk
- [ ] Services status reflects actual process state
- [ ] Error responses handled gracefully
- [ ] Response time < 1 second

---

## Notes
- Use KiloCode CLI with free models (GLM-5 or MiniMax)
- Check RAM before loading any local models (max 1GB)
- Cost constraint: $0 (free tier only)
- Reference `docs/NB_DASHBOARD_V2_IMPLEMENTATION_PLAN.md` for full details

---

## Workflow
1. CTO reads spec and existing frontend
2. Implement `/api/dashboard` endpoint
3. Test locally with `npm run dev`
4. Mark READY_FOR_QA when complete
5. QA validates against data contract
6. GM approves for deployment
