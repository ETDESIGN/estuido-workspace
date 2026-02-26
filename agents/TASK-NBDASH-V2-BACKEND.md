# TASK - NB Dashboard v2 Backend Implementation

**Task ID:** TASK-NBDASH-V2-BACKEND  
**Assigned To:** CTO (Lead Developer)  
**Priority:** P1 - High  
**Status:** ASSIGNED  
**Due:** 2026-02-22 (2 days)  
**Cost Budget:** $0 (Use KiloCode CLI with free models only)

---

## Overview

Implement the backend API for NB Studio Dashboard v2. Frontend is complete at https://github.com/ETDESIGN/nb-studio-dash-v2. Your job is to create the Next.js backend that serves real data to the dashboard.

**Frontend Repo:** https://github.com/ETDESIGN/nb-studio-dash-v2  
**Implementation Plan:** `docs/NB_DASHBOARD_V2_IMPLEMENTATION_PLAN.md`

---

## Acceptance Criteria

- [ ] `GET /api/dashboard` returns complete dashboard data matching frontend contract
- [ ] `POST /api/agents/:id/halt` stops an agent session
- [ ] `POST /api/protocols/trigger` executes a protocol script
- [ ] Dashboard displays real OpenClaw sessions data
- [ ] System health (CPU, memory, disk) is live
- [ ] Cost tracking shows today's spend
- [ ] Deployed to Vercel and accessible via URL

---

## Phase 1: Setup & Core API (Day 1)

### 1.1 Create Next.js Project
```bash
# In workspace directory
npx create-next-app@latest nb-studio-dashboard --typescript --tailwind --eslint --app --src-dir

cd nb-studio-dashboard
npm install swr recharts lucide-react clsx
```

### 1.2 Copy Frontend Files
From GitHub repo (ETDESIGN/nb-studio-dash-v2):
- Copy `App.tsx` → `app/page.tsx`
- Copy `components/*` → `components/`
- Copy `types.ts` → `types/index.ts`
- Copy `mockData.ts` → `lib/mockData.ts`

### 1.3 Implement API Route
Create `app/api/dashboard/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
```

### 1.4 Implement Data Aggregation
Create `lib/data.ts`:

```typescript
import { sessions_list } from '@/tools/sessions';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

export async function getDashboardData() {
  // Get OpenClaw sessions
  const sessions = await sessions_list({ activeMinutes: 60 });
  
  // Map sessions to agents
  const agents = sessions.map(s => ({
    id: s.sessionId,
    name: s.label || s.displayName || 'Unknown Agent',
    role: detectRole(s.label),
    model: s.model,
    status: mapStatus(s),
    task: 'Active session', // Could be enhanced with session history
    contextUsed: Math.round((s.totalTokens || 0) / 1000),
    contextTotal: Math.round((s.contextTokens || 262144) / 1000),
    contextBreakdown: { system: 20, user: 30, rag: 40, output: 10 },
    tools: ['OpenClaw'],
    color: getAgentColor(s.label)
  }));

  // Get system health
  const health = await getSystemHealth();
  
  // Get cost data (from file or calculate)
  const costData = await getCostData();

  return {
    uplinkTime: new Date().toISOString(),
    stats: {
      totalAgents: agents.length,
      activeSessions: sessions.length,
      costToday: costData.cost,
      tokensToday: costData.tokens,
      tasksCompletedToday: 0 // Could be tracked separately
    },
    systemHealth: health,
    services: await getServicesStatus(),
    agents,
    socialQueue: [], // Placeholder - implement if needed
    vaultFiles: [], // Placeholder - implement if needed
    modelMetrics: [] // Placeholder - implement if needed
  };
}

function detectRole(label?: string): string {
  if (!label) return 'AGENT';
  if (label.includes('CTO')) return 'CTO';
  if (label.includes('QA')) return 'QA';
  if (label.includes('GM')) return 'GM';
  return 'AGENT';
}

function mapStatus(session: any): string {
  if (session.abortedLastRun) return 'error';
  if (session.totalTokens > 0) return 'working';
  return 'idle';
}

function getAgentColor(label?: string): string {
  if (!label) return 'blue';
  if (label.includes('CTO')) return 'emerald';
  if (label.includes('QA')) return 'cyan';
  if (label.includes('GM')) return 'purple';
  return 'blue';
}

async function getSystemHealth() {
  try {
    // CPU usage
    const { stdout: cpuOut } = await execAsync("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1");
    const cpu = parseFloat(cpuOut.trim()) || 0;
    
    // Memory
    const { stdout: memOut } = await execAsync("free -m | awk 'NR==2{printf \"%%s %%s\", $3,$2}'");
    const [used, total] = memOut.trim().split(' ').map(Number);
    
    // Disk
    const { stdout: diskOut } = await execAsync("df -h / | awk 'NR==2{print $5}' | sed 's/%//'");
    const disk = parseInt(diskOut.trim()) || 0;
    
    return {
      cpu: parseFloat(cpu.toFixed(1)),
      memory: {
        used: used || 0,
        total: total || 8192,
        percent: total ? Math.round((used / total) * 100) : 0
      },
      disk
    };
  } catch (e) {
    console.error('System health error:', e);
    return {
      cpu: 0,
      memory: { used: 0, total: 8192, percent: 0 },
      disk: 0
    };
  }
}

async function getCostData() {
  try {
    // Read from cost monitor or calculate from sessions
    // For now, return mock values
    return { cost: 0.41, tokens: 45000 };
  } catch (e) {
    return { cost: 0, tokens: 0 };
  }
}

async function getServicesStatus() {
  const checkProcess = async (name: string) => {
    try {
      await execAsync(`pgrep -f ${name}`);
      return { status: 'running' };
    } catch {
      return { status: 'stopped' };
    }
  };
  
  return {
    openclawGateway: await checkProcess('openclaw'),
    costMonitor: await checkProcess('cost-monitor'),
    pulseUplink: { status: 'sending' } // Placeholder
  };
}
```

### 1.5 Test Locally
```bash
npm run dev
# Visit http://localhost:3000
# Verify dashboard loads with real data
```

---

## Phase 2: Actions API (Day 1-2)

### 2.1 Halt Agent Endpoint
Create `app/api/agents/[id]/halt/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { process } from '@/tools/process';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get session info
    const sessions = await sessions_list();
    const session = sessions.find(s => s.sessionId === id);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
    
    // Kill the process
    await process({ action: 'kill', sessionId: id });
    
    return NextResponse.json({ success: true, message: `Agent ${id} halted` });
  } catch (error) {
    console.error('Halt error:', error);
    return NextResponse.json(
      { error: 'Failed to halt agent' },
      { status: 500 }
    );
  }
}
```

### 2.2 Protocol Trigger Endpoint
Create `app/api/protocols/trigger/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { protocolId, protocolName } = await request.json();
    
    // Map protocol IDs to scripts
    const protocols: Record<string, string> = {
      '1': '/home/e/.openclaw/cron/cost-monitor.sh',
      '2': '/home/e/nb-studio/00_MISSION_CONTROL/scripts/update-dashboard.sh',
      // Add more as needed
    };
    
    const script = protocols[protocolId];
    if (!script) {
      return NextResponse.json(
        { error: 'Unknown protocol' },
        { status: 400 }
      );
    }
    
    // Run script in background
    execAsync(script).catch(console.error);
    
    return NextResponse.json({
      success: true,
      message: `Protocol ${protocolName || protocolId} triggered`
    });
  } catch (error) {
    console.error('Protocol trigger error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger protocol' },
      { status: 500 }
    );
  }
}
```

---

## Phase 3: Deploy (Day 2)

### 3.1 Prepare for Vercel
Create `vercel.json`:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### 3.2 Deploy
```bash
vercel --prod
```

### 3.3 Set Environment Variables
In Vercel Dashboard:
- Add any needed env vars
- Note: For local system access, we'll need the Pulse script (Phase 4)

---

## Phase 4: Pulse Script (Day 2-3)

Since Vercel can't access local machine directly, create a Pulse script that pushes data to Vercel KV.

Create `scripts/pulse.js` in local workspace:

```javascript
/**
 * PULSE.js - NB Studio Uplink
 * Pushes local dashboard data to Vercel KV
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const API_ENDPOINT = process.env.NB_API_ENDPOINT || 'https://your-app.vercel.app/api/uplink';
const API_SECRET = process.env.NB_API_SECRET;

async function sendPulse() {
  try {
    // Gather data (same logic as API)
    const data = await gatherData();
    
    // Send to Vercel
    const dataString = JSON.stringify(data);
    const url = new URL(API_ENDPOINT);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length,
        'x-nb-secret': API_SECRET
      }
    };
    
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        console.log(`[PULSE] Status: ${res.statusCode}`);
        if (res.statusCode === 200) resolve(true);
        else reject(new Error(`Status ${res.statusCode}`));
      });
      
      req.on('error', reject);
      req.write(dataString);
      req.end();
    });
  } catch (err) {
    console.error('[PULSE] Error:', err.message);
  }
}

// Run every 10 seconds
setInterval(sendPulse, 10000);
sendPulse(); // Initial run
```

Create `app/api/uplink/route.ts` in Next.js app:

```typescript
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: Request) {
  try {
    // Verify secret
    const secret = request.headers.get('x-nb-secret');
    if (secret !== process.env.NB_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    await kv.set('nb-dashboard-state', data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Uplink error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

Update `app/api/dashboard/route.ts` to use KV:

```typescript
import { kv } from '@vercel/kv';

export async function GET() {
  const data = await kv.get('nb-dashboard-state');
  if (!data) {
    return NextResponse.json({ error: 'No data available' }, { status: 404 });
  }
  return NextResponse.json(data);
}
```

---

## Resources

### Documentation
- `docs/NB_DASHBOARD_V2_IMPLEMENTATION_PLAN.md` - Full implementation guide
- `docs/WORKFLOW_FRONTEND_BACKEND.md` - Workflow overview
- Frontend INTEGRATION_GUIDE.md - Data contract details

### Tools Available
- `sessions_list` - Get active OpenClaw sessions
- `process` - Manage running processes
- `exec` - Run shell commands

### Constraints
- Use KiloCode CLI with free models (GLM-5, MiniMax free)
- No paid API calls
- Must deploy to Vercel

---

## Definition of Done

- [ ] `npm run dev` starts the app locally
- [ ] Dashboard shows real OpenClaw sessions
- [ ] System health metrics are live
- [ ] Agent halt button works
- [ ] Deployed to Vercel with working URL
- [ ] Pulse script pushes data every 10s
- [ ] Documentation updated with deployment URL

---

## Questions?

Ask Dereck (GM) if blocked. Escalate to E if architectural decisions needed.

**READY_FOR_QA when:** All acceptance criteria met and deployed.
