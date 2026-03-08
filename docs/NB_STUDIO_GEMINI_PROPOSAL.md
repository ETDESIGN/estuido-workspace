# NB Studio Dashboard - Gemini 3.0 Pro Proposal

> ⚠️ **STATUS: DISCONTINUED** (March 2, 2026)
> This proposal is no longer active. NB Studio project was discontinued.
> See current dashboards: Mission Control (port 4000) and Command Center (port 3333)

**Date:** February 19, 2026  
**From:** NB Studio Consultant (Gemini 3.0 Pro)  
**To:** Dereck (GM) & E (President)  
**Subject:** Strategic Roadmap: NB Studio "Mission Control" Transformation

---

## Executive Summary

NB Studio is currently operating with a split brain: rich operational data lives locally (`/home/e/nb-studio/`), while the public face is a static placeholder. The goal is to merge these into a **Mission Control** — a single pane of glass for E to monitor the organization.

**Recommendation:** Refactor the existing `cost-analytics-v2` Next.js project into the main NB Studio repository. Treat local JSON files as the "Database" and create a lightweight "Uplink" to sync data to the live dashboard. This respects cost constraints (Vercel free tier) while providing "Living Dashboard" capability.

---

## 1. Unified Architecture Vision: "Local Heart, Cloud View"

Bridge the gap between local file system and Vercel deployment without expensive databases.

### The Stack
- **Frontend:** Next.js 16 (App Router) + React 19
- **UI Library:** Tailwind CSS + Shadcn/UI
- **Data Transport:** "Pulse" script running on local machine
- **State Management:** Vercel KV (Free tier Redis) or private GitHub Gist

### Data Flow
```
Local: /home/e/nb-studio/ → DASHBOARD.json → Pulse Script → Vercel KV
                                                        ↓
User visits → NB Studio Vercel App ← Fetches Data ←───┘
```

### Why This Works
- **Security:** Raw files stay local; only dashboard-relevant JSON is pushed
- **Cost:** No heavy database fees; Vercel KV has generous free tier
- **Speed:** Dashboard reads from cloud cache, instant regardless of local machine status

---

## 2. Priority Roadmap

### Phase 1: Foundation (Week 1-2)
**Objective:** Merge cost-analytics-v2 into main repo and establish data link

**Actions:**
- Initialize Next.js 16 in repo root (replace static HTML)
- Port existing Cost Analytics into `/finance` route
- Build "Pulse" Script (Node.js watches DASHBOARD.json, pushes to cloud)
- Implement Basic Auth (Middleware)

### Phase 2: Mission Control & Agents (Week 3-4)
**Objective:** Create the "Heads-up Display" (HUD)

**Actions:**
- Build Home Dashboard: KPIs (Spend, Active Agents, System Health)
- Build Agent Status Board: Kanban/List view of DASHBOARD_TASK_QUEUE.json
- Integrate System Health visuals (CPU/Memory from DATA_METRICS.json)

### Phase 3: Departmental Deep Dive (Week 5+)
**Objective:** Specialized views for specific roles

**Actions:**
- Individual pages for Engineering, Growth, Strategy
- Drill-down: Click "Growth" → See SOCIAL_QUEUE
- Search functionality for Library/Runbooks

---

## 3. Feature Specifications (The 4 Seed Ideas)

### Idea 1: Dynamic Dashboard (The HUD)
**Visual Metaphor:** Cockpit. Dark mode default.

**Key Modules:**
- **The Ticker:** Scrolling top bar showing latest completed task or alert
- **Vital Signs:** 3 Gauges (Daily Budget Consumed %, CPU Load, Error Rate)
- **Activity Graph:** Sparkline showing token consumption over last 6 hours
- **Quick Actions:** Buttons to "Pause All Agents" or "Switch to Emergency Mode"

### Idea 2: Department Portals
**Navigation:** Sidebar (Desktop) / Bottom Bar (Mobile)

**Specific Views:**
- **COO (Warren):** Detailed cost breakdown, vendor comparison (OpenAI vs DeepSeek vs Gemini)
- **Growth (Gary):** Calendar View of SOCIAL_QUEUE
- **Engineering (CTO):** Traffic Light system for services (Anvil, Cipher, Pixel)

### Idea 3: Cost Analytics Integration
**Strategy:** Full integration, no iframes

**Enhancements:**
- "Runway" Widget: "At current daily spend ($X), you have Y days remaining"
- Model Battle: Chart comparing "Value for Money" across models

### Idea 4: Agent Status Page
**Visual:** "The Swimlane"

**Layout:**
- Lane 1 (Queue): Pending tasks
- Lane 2 (Active): Spinning loader, showing current thought/step
- Lane 3 (Done): Fade out list of completed items

**Feature:** "Kill Switch" button to cancel specific agent tasks

---

## 4. Architecture Decisions

| Question | Verdict | Rationale |
|----------|---------|-----------|
| Next.js vs Static? | **Next.js** | Need server-side logic for auth and secure data fetching |
| Data Sync Method? | **"Pulse" Script** | Browser can't poll filesystem; local script POSTs changes to cloud endpoint |
| Public or Private? | **Private** | Operational data must be protected; use Vercel Auth or middleware with env password |
| Replace cost-analytics-v2? | **Replace** | Maintainability is key; two repos for one tool is technical debt |
| Real-time Priority? | **Hybrid** | Real-time: System Health, Task Status, Daily Cost. Batched: Content drafts, library updates |
| Department Expansion? | **Add "Auditor/Compliance"** | For safety checks and hallucination audits as agent usage grows |

---

## 5. Cost & Risk Assessment

### Cost Estimate
- **Hosting:** Vercel Hobby (Free)
- **Database:** Vercel KV (Free tier sufficient)
- **Compute:** Minimal (logic runs locally)
- **Total Monthly Cost:** $0.00 (excluding AI token usage)

### Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Local machine offline | Dashboard shows "Last Updated: X hours ago" in red; data visible but stale |
| Pulse script consumes too much CPU | Debounce: Sync max once per 10 seconds |
| Security leak | .env files in .gitignore; strong password for middleware |

---

## 6. Implementation: Pulse Script

### Directory Structure
```
/home/e/nb-studio/
├── 00_MISSION_CONTROL/       # JSON Data lives here
├── scripts/                  # Pulse script here
├── web/                      # Next.js 16 Dashboard
├── .env.local                # Secrets
└── package.json
```

### Pulse Script (`scripts/pulse.js`)
```javascript
/**
 * PULSE.js - NB Studio Uplink
 * Watches local Mission Control data and syncs to Vercel KV/API
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// CONFIGURATION
const API_ENDPOINT = process.env.NB_API_ENDPOINT;
const API_SECRET = process.env.NB_API_SECRET;
const WATCH_DIR = path.join(__dirname, '../00_MISSION_CONTROL');

// FILES TO SYNC
const TARGETS = [
  'DASHBOARD.json',
  'DASHBOARD_AGENTS.json',
  'DATA_METRICS.json'
];

let debounceTimer;

console.log(`[PULSE] System Online.`);
console.log(`[PULSE] Watching: ${WATCH_DIR}`);

// THE UPLINK FUNCTION
async function sendPulse() {
  console.log('[PULSE] Detecting change... Aggregating data...');

  const payload = {};

  try {
    // 1. Read all target files
    TARGETS.forEach(file => {
      const filePath = path.join(WATCH_DIR, file);
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        payload[file.replace('.json', '')] = JSON.parse(raw);
      }
    });

    // 2. Add Timestamp
    payload.uplinkTime = new Date().toISOString();

    // 3. Send to Cloud (Native Node HTTPS Request)
    const dataString = JSON.stringify(payload);
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

    const req = https.request(options, (res) => {
      console.log(`[PULSE] Status: ${res.statusCode}`);
      if (res.statusCode !== 200) {
        console.error(`[PULSE] Error: Failed to sync.`);
      }
    });

    req.on('error', (e) => {
      console.error(`[PULSE] Network Error: ${e.message}`);
    });

    req.write(dataString);
    req.end();

  } catch (err) {
    console.error(`[PULSE] Local Read Error:`, err.message);
  }
}

// WATCHER LOGIC
if (fs.existsSync(WATCH_DIR)) {
  fs.watch(WATCH_DIR, (eventType, filename) => {
    if (filename && TARGETS.includes(filename)) {
      // Debounce: Wait 2 seconds after last change
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(sendPulse, 2000);
    }
  });
} else {
  console.error(`[PULSE] CRITICAL: Directory ${WATCH_DIR} not found.`);
}
```

### Cloud Receiver (`web/app/api/uplink/route.ts`)
```typescript
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: Request) {
  try {
    // 1. Security Check
    const secret = request.headers.get('x-nb-secret');
    if (secret !== process.env.NB_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Payload
    const data = await request.json();

    // 3. Save to Redis (Vercel KV)
    await kv.set('nb-studio-state', data);

    console.log(`[UPLINK] Data synced at ${new Date().toISOString()}`);
    
    return NextResponse.json({ success: true, timestamp: Date.now() });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

### Dashboard API (`web/app/api/dashboard/route.ts`)
```typescript
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  const data = await kv.get('nb-studio-state');
  
  if (!data) {
    return NextResponse.json({ status: 'No Data Synced Yet' }, { status: 404 });
  }

  return NextResponse.json(data);
}
```

---

## 7. Setup Instructions

### 1. Install Dependencies (Local)
```bash
cd /home/e/nb-studio/
npm init -y
npm install dotenv
```

### 2. Environment Variables (Local `.env.local`)
```
NB_API_ENDPOINT=https://your-vercel-url.vercel.app/api/uplink
NB_API_SECRET=MakeUpALongComplexPasswordHere123
```

### 3. Environment Variables (Vercel Dashboard)
- Go to Vercel Project Settings → Environment Variables
- Add `NB_API_SECRET` (same as above)
- Vercel auto-adds `KV_URL` when you enable Storage

### 4. Run the Pulse
```bash
node scripts/pulse.js
```

**Success indicator:** `[PULSE] Status: 200`

---

## Next Steps

1. ✅ **Green Light Received** on Unified Architecture
2. Deploy `web/` folder to Vercel with new API routes
3. Update local `.env.local` with Vercel URL
4. Run `pulse.js` and verify 200 status
5. **Status:** Ready for Phase 1 execution

---

*Document preserved from Gemini 3.0 Pro consultation*
