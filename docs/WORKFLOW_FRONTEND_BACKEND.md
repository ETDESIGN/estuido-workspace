# 🔄 NB Studio Workflow - Frontend/Backend Architecture

**Date:** February 19, 2026  
**Established by:** E (President) + Dereck (GM)  
**Purpose:** Clear separation of frontend (Gemini AI Studio) and backend (OpenClaw) responsibilities

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND (Google AI Studio + Gemini Builder)                    │
│  ─────────────────────────────────────────────                   │
│  • Vibe coding with Gemini 3.0 Pro                               │
│  • Visual design, components, UI/UX                              │
│  • Pushes to GitHub automatically                                │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼ GitHub Repo
┌─────────────────┴───────────────────────────────────────────────┐
│  BACKEND (OpenClaw - Dereck/CTO)                                 │
│  ─────────────────────────────────                               │
│  • API routes, data sync, auth                                   │
│  • Pulse script (local → cloud)                                  │
│  • Database, Vercel KV integration                               │
│  • Deployment to Vercel                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Workflow (E + Gemini 3.0 Pro)

### Tools
- **Google AI Studio** — Chat interface with Gemini 3.0 Pro
- **Gemini Builder** — Visual coding environment

### Constraints
| Constraint | Impact |
|------------|--------|
| **GitHub-only export** | All code must go through GitHub; no direct file access |
| **Command prompt modifications** | Every frontend change MUST be requested via prompts to Gemini 3.0 |
| **No backend logic** | Frontend only; all data/API handled by OpenClaw backend |

### Process
1. **Design Phase** — E describes UI needs to Gemini 3.0 Pro in AI Studio
2. **Code Generation** — Gemini generates React/Next.js components
3. **GitHub Push** — Gemini Builder pushes code to GitHub repo
4. **Notify Dereck** — E tells Dereck: "Frontend updated, check GitHub"

---

## Backend Workflow (Dereck/CTO + OpenClaw)

### Responsibilities
- Analyze frontend code pushed to GitHub
- Create API routes (`/api/*`) for data needs
- Build Pulse script for local → cloud sync
- Configure Vercel KV (Redis)
- Deploy and connect frontend + backend

### Process
1. **Analyze Frontend** — Dereck pulls GitHub changes, reviews data requirements
2. **API Design** — Design endpoints frontend needs (`/api/dashboard`, `/api/agents`, etc.)
3. **Implementation** — CTO codes backend (Next.js API routes, Pulse script)
4. **Integration Test** — Verify frontend can fetch data from backend
5. **Deploy** — Push to Vercel, update environment variables

---

## Communication Protocol

### When Frontend Updates (E → Dereck)
```
E: "Frontend pushed to GitHub. New features:
    - Sidebar navigation component
    - Agent status cards
    - Cost chart with filters
    
    Need backend APIs for:
    - GET /api/agents (list all agents)
    - GET /api/costs?range=7d (cost data)
    - WebSocket for real-time updates?"
```

### When Backend Updates (Dereck → E)
```
Dereck: "Backend deployed. New endpoints:
         - /api/agents ✅
         - /api/costs ✅
         - WebSocket: /api/live (optional)
         
         Frontend can now fetch data with:
         fetch('/api/agents').then(r => r.json())
         
         Next: Tell Gemini 3.0 to wire up the data fetching."
```

### Prompt Template for Gemini 3.0 Pro

When E needs frontend changes, use this structure:

```
**Context:**
- Backend API endpoint: [URL]
- Data format: [JSON structure]
- Current component: [File name]

**Task:**
[Describe what to build/modify]

**Requirements:**
- Use [React/Next.js/Tailwind/shadcn]
- Fetch data from [endpoint]
- Handle loading states
- Handle errors gracefully
- Responsive design

**Output:**
- Complete component code
- Any new dependencies needed
- Instructions for connecting to backend
```

---

## GitHub Repository Structure

```
nb-studio-dashboard/
├── frontend/                    # E owns this (via Gemini Builder)
│   ├── app/
│   │   ├── page.tsx            # Main dashboard
│   │   ├── agents/
│   │   ├── costs/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── AgentCard.tsx
│   │   └── CostChart.tsx
│   └── lib/
│       └── api.ts              # API client (Dereck provides endpoints)
├── backend/                     # Dereck owns this
│   ├── app/api/
│   │   ├── agents/route.ts
│   │   ├── costs/route.ts
│   │   └── dashboard/route.ts
│   └── pulse/
│       └── pulse.js            # Local sync script
├── .env.example                # API keys template
└── README.md                   # Setup instructions
```

---

## Current Status

| Component | Owner | Status |
|-----------|-------|--------|
| Frontend design | E + Gemini 3.0 | 🟡 In progress |
| Backend API | Dereck/CTO | ⏳ Waiting for frontend |
| GitHub repo | Shared | ⏳ To be created |
| Vercel deploy | Dereck | ⏳ After integration |
| Pulse script | Dereck | ⏳ After API design |

---

## Next Actions

1. **E:** Create GitHub repo, push initial frontend from Gemini Builder
2. **E:** Send Dereck the repo URL + list of components built
3. **Dereck:** Review frontend, design API contract
4. **Dereck:** Implement backend routes + Pulse script
5. **Dereck:** Deploy to Vercel, share URL
6. **E:** Test frontend, request modifications via Gemini 3.0 prompts

---

## Important Notes

- **Frontend changes ALWAYS go through Gemini 3.0 prompts** — never edit directly
- **Backend changes ALWAYS go through Dereck/CTO** — E doesn't touch API code
- **Communication is key** — each side must notify the other of changes
- **Version control** — Both sides commit to GitHub with clear messages

---

*This workflow ensures clean separation of concerns while enabling rapid iteration via AI-assisted coding.*
