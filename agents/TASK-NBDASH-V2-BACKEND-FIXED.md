# TASK - NB Dashboard v2 Backend (Corrected Architecture)

**Task ID:** TASK-NBDASH-V2-BACKEND-FIXED  
**Assigned To:** Dereck (GM) - Direct Implementation  
**Priority:** P0 - Critical Fix  
**Due:** Immediate  
**Architecture:** Option A - Separate Express Backend

---

## CORRECT ARCHITECTURE (Approved by E)

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (E's Domain - DO NOT TOUCH)                        │
│  ───────────────────────────────────                         │
│  Repo: https://github.com/ETDESIGN/nb-studio-dash-v2        │
│  Stack: Vite + React 19 + Tailwind                          │
│  Built by: Gemini 3.0 Pro (Google AI Studio)                │
│                                                              │
│  E modifies via AI Studio → Pushes to GitHub                │
│  Dereck ONLY provides: lib/api.ts connector                 │
└───────────────────┬─────────────────────────────────────────┘
                    │ HTTP API Calls
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (Dereck's Domain - THIS TASK)                       │
│  ─────────────────────────────────────                       │
│  Stack: Express.js + TypeScript                              │
│  Data Sources: OpenClaw API, System commands                │
│                                                              │
│  Endpoints:                                                  │
│  - GET http://localhost:3002/api/dashboard                  │
│  - GET http://localhost:3002/api/health                     │
│  - POST http://localhost:3002/api/agents/:id/halt          │
└─────────────────────────────────────────────────────────────┘
```

---

## PREVIOUS MISTAKE (Documented for Learning)

**What Went Wrong:**
- Built Next.js full-stack app instead of API-only backend
- Created new frontend instead of connecting to E's existing frontend
- Did not clone E's GitHub repo before implementing
- Assumed wrong architecture without confirming

**Root Cause:** Skipped architecture validation step

---

## ACCEPTANCE CRITERIA

- [ ] Express server running on port 3002
- [ ] CORS enabled for localhost:3001 (E's frontend)
- [ ] `GET /api/dashboard` returns data matching mockData.ts structure
- [ ] Real OpenClaw data via sessions_list tool
- [ ] Real system health (CPU, memory, disk) via exec commands
- [ ] E's frontend can fetch from backend without errors
- [ ] Prompt provided to E for Gemini 3.0 to connect frontend

---

## IMPLEMENTATION STEPS

### Step 1: Create Express Backend
```bash
mkdir -p /home/e/.openclaw/workspace/nb-studio-backend
cd /home/e/.openclaw/workspace/nb-studio-backend
npm init -y
npm install express cors typescript @types/express @types/cors ts-node nodemon
```

### Step 2: Implement API
Create `src/index.ts`:
- Express app with CORS
- GET /api/dashboard - returns dashboard data
- Data from: sessions_list, exec (system commands)

### Step 3: Clone E's Frontend (Reference Only)
```bash
git clone https://github.com/ETDESIGN/nb-studio-dash-v2.git temp-frontend
cp temp-frontend/mockData.ts reference/
cp temp-frontend/src/types.ts reference/
rm -rf temp-frontend
```

### Step 4: Create Frontend Connector
Create file `api-connector-for-e.ts`:
- fetchDashboardData() function
- BASE_URL = 'http://localhost:3002'
- Types matching backend response

### Step 5: Test Integration
- Start backend: npm run dev
- E starts frontend: npm run dev
- Verify CORS works
- Verify data flows

---

## PROMPT FOR E (To Give Gemini 3.0)

```
Context:
- Backend API is ready at: http://localhost:3002/api/dashboard
- Current frontend uses mock data from mockData.ts
- Need to connect to real backend

Task:
Replace mock data with real API calls.

Requirements:
1. Create src/lib/api.ts with fetchDashboardData() function
2. Update App.tsx to use SWR or useEffect to fetch from backend
3. Remove mockData.ts imports
4. Handle loading and error states
5. Backend returns exact same structure as mockData.ts

API Endpoint: GET http://localhost:3002/api/dashboard
Response format: Same as current mockData.ts

Output:
- Complete src/lib/api.ts
- Updated App.tsx with data fetching
- Loading component
- Error handling
```

---

## DEFINITION OF DONE

1. Backend running on :3002
2. E can copy api-connector-for-e.ts into their project
3. E's frontend successfully fetches real data
4. Architecture diagram updated in docs
5. Lessons learned documented

---

**DO NOT:**
- Modify E's frontend code
- Create new frontend components
- Assume different architecture
- Skip testing with E's actual frontend

**DO:**
- Build API-only backend
- Test CORS thoroughly
- Provide clear integration instructions
- Document the fix process
