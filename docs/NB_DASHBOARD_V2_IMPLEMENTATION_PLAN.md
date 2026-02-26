# 🎯 NB Studio Dashboard v2 - Backend Implementation Plan

**Date:** February 20, 2026  
**Frontend Repo:** https://github.com/ETDESIGN/nb-studio-dash-v2  
**Owner:** E (Frontend via Gemini 3.0) + Dereck/CTO (Backend)  
**Status:** Ready for Implementation

---

## 1. Frontend Analysis

### Tech Stack
| Component | Technology |
|-----------|------------|
| Framework | React 19 + Vite 6 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Data Fetching | SWR (Stale-While-Revalidate) |
| Icons | Lucide React |

### Current State
- ✅ **UI Complete** — All components built in `App.tsx` (~80KB)
- ✅ **Mock Data** — `mockData.ts` provides simulation data
- ⚠️ **Backend Needed** — Currently in simulation mode
- ⚠️ **API Integration** — Needs real endpoints

### Data Contract (What Frontend Expects)

```typescript
// GET /api/dashboard returns:
{
  uplinkTime: "2024-02-20T14:30:00.000Z",
  
  stats: {
    totalAgents: 12,
    activeSessions: 4,
    costToday: 1.25,
    tokensToday: 450000,
    tasksCompletedToday: 84
  },

  systemHealth: {
    cpu: 45.2,          // 0-100%
    disk: 82,           // 0-100%
    memory: {
      used: 4096,       // MB
      total: 16384,     // MB
      percent: 25       // 0-100%
    }
  },

  services: {
    openclawGateway: { status: "running" }, // 'running' | 'stopped' | 'error'
    costMonitor: { status: "active" },
    pulseUplink: { status: "sending" }
  },

  agents: [
    {
      id: "agent-alpha",
      name: "Architect_01",
      role: "CTO",
      model: "Gemini 1.5 Pro",
      status: "working", // 'thinking' | 'idle' | 'offline' | 'error' | 'working'
      task: "Refactoring API middleware...",
      contextUsed: 80,   // kTokens
      contextTotal: 128, // kTokens
      contextBreakdown: { system: 10, user: 20, rag: 60, output: 10 },
      tools: ["AWS", "Kubectl"],
      color: "emerald"
    }
  ],

  socialQueue: [
    { day: 1, title: "Launch Tweet", type: "Twitter", status: "Scheduled" }
  ],

  vaultFiles: [
    { id: "f1", name: "logs.txt", type: "file", category: "doc", modified: "Today" }
  ],

  modelMetrics: [
    { model: "Gemini 1.5 Flash", tasks: 1420, cost: 0.12, efficiency: 95 }
  ]
}
```

---

## 2. Backend Architecture

### Option A: Next.js Full-Stack (Recommended)
**Best for:** Tight integration, SSR, Vercel deployment

```
nb-studio-dashboard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── dashboard/route.ts      # GET - Main data endpoint
│   │   │   ├── agents/[id]/halt/route.ts # POST - Stop agent
│   │   │   └── protocols/trigger/route.ts # POST - Trigger protocol
│   │   ├── page.tsx                     # Dashboard UI (from GitHub)
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── api.ts                       # Frontend API client
│   │   └── data.ts                      # Data aggregation logic
│   └── components/                      # UI components (from GitHub)
├── scripts/
│   └── pulse.js                         # Local → Cloud sync (if needed)
└── package.json
```

### Option B: Separate Backend (Express/Fastify)
**Best for:** Complex backend logic, microservices

```
nb-studio-backend/
├── src/
│   ├── routes/
│   │   ├── dashboard.ts
│   │   ├── agents.ts
│   │   └── protocols.ts
│   ├── services/
│   │   ├── dataCollector.ts           # Gather from local files
│   │   └── openclaw.ts                # OpenClaw integration
│   └── index.ts
└── package.json
```

**Recommendation:** Use Option A (Next.js) for simplicity and Vercel hosting.

---

## 3. API Endpoints Required

### Read Endpoints

| Method | Endpoint | Description | Data Source |
|--------|----------|-------------|-------------|
| GET | `/api/dashboard` | Full dashboard state | Aggregated from local files |
| GET | `/api/agents` | List all agents | OpenClaw sessions API |
| GET | `/api/health` | System health metrics | Local system commands |

### Write Endpoints

| Method | Endpoint | Description | Action |
|--------|----------|-------------|--------|
| POST | `/api/agents/:id/halt` | Stop an agent | sessions_kill or signal |
| POST | `/api/agents/:id/restart` | Restart agent | Spawn new session |
| POST | `/api/protocols/trigger` | Run protocol | Execute script |
| POST | `/api/command` | Generic command | Passthrough to OpenClaw |

---

## 4. Data Sources

### 1. OpenClaw Sessions API
```typescript
// Get active sessions
const sessions = await sessions_list({ activeMinutes: 60 });

// Map to agent format
const agents = sessions.map(s => ({
  id: s.sessionId,
  name: s.label || s.displayName,
  role: detectRole(s.label), // GM, CTO, QA, etc.
  model: s.model,
  status: mapStatus(s), // thinking, idle, working, etc.
  contextUsed: Math.round(s.totalTokens / 1000),
  contextTotal: Math.round(s.contextTokens / 1000),
  // ...
}));
```

### 2. Local System Metrics
```typescript
// CPU, Memory, Disk
import { exec } from 'child_process';

const cpu = await getCPUUsage();     // mpstat or top
const memory = await getMemoryInfo(); // free -m
const disk = await getDiskUsage();    // df -h
```

### 3. Cost Data
```typescript
// From cost-monitor.sh output or log aggregation
const costToday = await getDailyCost();
const tokensToday = await getDailyTokens();
```

### 4. Services Status
```typescript
// Check if processes are running
const services = {
  openclawGateway: await checkProcess('openclaw'),
  costMonitor: await checkProcess('cost-monitor'),
  pulseUplink: await checkProcess('pulse')
};
```

### 5. Social Queue & Vault
```typescript
// From local JSON files
const socialQueue = JSON.parse(fs.readFileSync('/home/e/nb-studio/social_queue.json'));
const vaultFiles = JSON.parse(fs.readFileSync('/home/e/nb-studio/vault_index.json'));
```

---

## 5. Implementation Phases

### Phase 1: Core API (Day 1)
- [ ] Create Next.js project structure
- [ ] Implement `GET /api/dashboard` with mock data
- [ ] Test frontend connection
- [ ] Deploy to Vercel

### Phase 2: Real Data Integration (Day 2)
- [ ] Connect OpenClaw sessions API
- [ ] Add system health metrics
- [ ] Implement cost/token tracking
- [ ] Add service status checks

### Phase 3: Actions & Real-time (Day 3)
- [ ] Implement `POST /api/agents/:id/halt`
- [ ] Add WebSocket or SSE for live updates
- [ ] Implement protocol triggers
- [ ] Add error handling and retries

### Phase 4: Pulse Script (Day 4)
- [ ] Create `scripts/pulse.js` for local sync
- [ ] Set up Vercel KV as cache
- [ ] Configure debouncing (max 1 sync per 10s)
- [ ] Test offline/online scenarios

---

## 6. Prompts for Gemini 3.0 (Frontend Modifications)

### Prompt 1: Update API Client
```
Context:
- Current file: src/lib/api.ts (needs to be created)
- Backend endpoint: /api/dashboard
- Using SWR for data fetching

Task:
Create an API client that fetches real data from the backend instead of mock data.

Requirements:
1. Create fetchDashboardData() function that calls /api/dashboard
2. Handle loading states
3. Handle errors gracefully with retry logic
4. Use environment variable for API URL (NEXT_PUBLIC_API_URL)
5. Export for use in App.tsx

Output:
- Complete TypeScript code for src/lib/api.ts
- Instructions for updating App.tsx to use real data
```

### Prompt 2: Add Error Handling UI
```
Context:
- Current dashboard shows mock data always
- Need to handle backend errors gracefully

Task:
Add error and loading states to the dashboard.

Requirements:
1. Create ErrorScreen component for API failures
2. Create LoadingScreen component for initial load
3. Update App.tsx to show these states when data is loading or errored
4. Add retry button on error
5. Keep existing UI when data is available

Output:
- ErrorScreen component code
- LoadingScreen component code  
- Updated App.tsx integration code
```

### Prompt 3: Wire Up Action Buttons
```
Context:
- Dashboard has "Halt Agent" and "Trigger Protocol" buttons
- Currently using setTimeout simulation

Task:
Wire up the action buttons to call real backend APIs.

Requirements:
1. Update handleHaltAgent() to POST to /api/agents/:id/halt
2. Update handleTrigger() to POST to /api/protocols/trigger
3. Show loading state during API call
4. Show success/error notifications
5. Refresh dashboard data after successful action

Output:
- Updated handler functions for App.tsx
- API call implementations
- Loading/notification logic
```

### Prompt 4: Add Chart History Data
```
Context:
- Charts currently use generateChartData() from mockData.ts
- Backend will provide historical data

Task:
Update charts to use real historical data from backend.

Requirements:
1. Update chart components to accept data via props
2. Modify API client to fetch chart history
3. Handle empty or partial data gracefully
4. Keep chart styling consistent

Output:
- Updated chart data flow
- API integration code
- Fallback for missing data
```

---

## 7. Environment Variables

### Backend (.env.local)
```
# OpenClaw API
OPENCLAW_API_URL=http://localhost:18789
OPENCLAW_API_KEY=your_key_here

# Vercel KV (for Pulse)
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...

# Security
API_SECRET=your_secret_for_pulse_auth
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=/api
```

---

## 8. Testing Checklist

### API Tests
- [ ] GET /api/dashboard returns valid JSON
- [ ] All required fields present
- [ ] Data types match frontend expectations
- [ ] Error responses handled

### Integration Tests
- [ ] Frontend fetches data on load
- [ ] SWR polling works (every 5s)
- [ ] Agent halt works
- [ ] Protocol trigger works
- [ ] Charts render with real data

### Performance Tests
- [ ] API response < 500ms
- [ ] Frontend renders < 1s
- [ ] No memory leaks with polling

---

## 9. Deployment Plan

1. **Create Vercel Project**
   ```bash
   vercel --prod
   ```

2. **Set Environment Variables** in Vercel Dashboard

3. **Deploy Backend**
   ```bash
   git push origin main
   # Auto-deploy via Vercel
   ```

4. **Test Frontend**
   - Visit deployed URL
   - Verify data loads
   - Test actions

5. **Enable Pulse Script** (local machine)
   ```bash
   node scripts/pulse.js &
   ```

---

## 10. File Mapping (GitHub → Next.js)

| GitHub File | Next.js Location | Notes |
|-------------|------------------|-------|
| App.tsx | app/page.tsx | Main dashboard page |
| components/* | components/* | Copy as-is |
| mockData.ts | lib/mockData.ts | Keep for fallback |
| types.ts | types/index.ts | TypeScript types |
| index.html | app/layout.tsx + page.tsx | HTML template |

---

## Next Steps

1. **CTO implements** Phase 1 (Core API)
2. **E provides** frontend modifications via Gemini 3.0 prompts
3. **Test integration** locally
4. **Deploy to Vercel**
5. **Enable Pulse** for live data

---

*Ready for CTO to begin implementation.*
