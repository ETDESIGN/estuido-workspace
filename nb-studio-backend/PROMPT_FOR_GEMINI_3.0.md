# Prompt for Gemini 3.0 Pro - Connect Frontend to Backend

**Context:**
The backend API is now ready and running at `http://localhost:3002`.

Your frontend currently uses mock data from `mockData.ts`. 

**Task:**
Replace the mock data with real API calls to the backend.

---

## Step 1: Create API Client

Create a new file `src/lib/api.ts` with this exact content:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export interface DashboardData {
  uplinkTime: string;
  stats: {
    totalAgents: number;
    activeSessions: number;
    costToday: number;
    tokensToday: number;
    tasksCompletedToday: number;
  };
  systemHealth: {
    cpu: number;
    disk: number;
    memory: { used: number; total: number; percent: number };
  };
  services: {
    openclawGateway: { status: string };
    costMonitor: { status: string };
    pulseUplink: { status: string };
  };
  agents: Array<{
    id: string;
    name: string;
    role: string;
    model: string;
    status: 'thinking' | 'idle' | 'offline' | 'error' | 'working';
    task: string;
    contextUsed: number;
    contextTotal: number;
    contextBreakdown: { system: number; user: number; rag: number; output: number };
    tools: string[];
    color: string;
  }>;
  socialQueue: Array<{ day: number; title: string; type: string; status: string }>;
  modelMetrics: Array<{ model: string; tasks: number; cost: number; efficiency: number }>;
  vaultFiles: Array<{ id: string; name: string; type: string; size?: string; modified: string; extension?: string; category: string }>;
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`);
  if (!response.ok) throw new Error(`Failed: ${response.status}`);
  return response.json();
}
```

---

## Step 2: Update App.tsx

Replace mock data imports with real API calls.

**BEFORE (current):**
```typescript
import { fetchMockData } from './mockData';
const { data } = useSWR('dashboard-data', fetchMockData, { refreshInterval: 2000 });
```

**AFTER (new):**
```typescript
import { fetchDashboardData, DashboardData } from './lib/api';
const { data, error, isLoading } = useSWR<DashboardData>('/api/dashboard', fetchDashboardData, { 
  refreshInterval: 5000,
  dedupingInterval: 2000 
});
```

Also add:
```typescript
if (isLoading) return <LoadingScreen />;
if (error) return <ErrorScreen error={error} />;
if (!data) return <div>No data</div>;
```

---

## Step 3: Create Loading & Error Components

Create `src/components/LoadingScreen.tsx`:
```typescript
export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="text-white text-xl animate-pulse">Loading Mission Control...</div>
    </div>
  );
}
```

Create `src/components/ErrorScreen.tsx`:
```typescript
export function ErrorScreen({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">Error loading dashboard</div>
        <div className="text-zinc-400">{error.message}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
```

---

## Step 4: Test Integration

1. Start backend (in separate terminal):
   ```bash
   cd /home/e/.openclaw/workspace/nb-studio-backend
   npm run dev
   ```

2. Start frontend (your existing Vite dev server):
   ```bash
   npm run dev
   ```

3. Open browser to your frontend URL

4. Verify:
   - Dashboard loads without errors
   - Data refreshes every 5 seconds
   - Real system health metrics appear

---

## Expected Behavior

- ✅ Dashboard shows real data from backend
- ✅ Auto-refreshes every 5 seconds
- ✅ Loading state while fetching
- ✅ Error display if backend is down
- ✅ Same UI/UX as before, but with live data

---

## Troubleshooting

**CORS Error?**
Backend already configured to allow localhost:3000, 3001, 5173

**Connection Refused?**
Make sure backend is running: `npm run dev` in nb-studio-backend folder

**Data not updating?**
Check browser Network tab - should see requests to localhost:3002/api/dashboard every 5 seconds

---

**Provide the complete updated files:**
- src/lib/api.ts
- Updated App.tsx (only the data fetching parts)
- src/components/LoadingScreen.tsx
- src/components/ErrorScreen.tsx
