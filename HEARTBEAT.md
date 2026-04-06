# HEARTBEAT.md — Current State (2026-04-06 09:23 HKT)

## ⚠️ CORE RULES
1. I am **coordinator**, NOT coder. All coding delegated to CTO team.
2. Read this file FIRST before any action. Single source of truth.
3. Email restricted to approved recipients only. Deploy to Vercel: always.

## Active Agents (12)
| Agent | Role | Model | Status |
|-------|------|-------|--------|
| main | Coordinator | zai/glm-5.1 | ✅ Active |
| cto | Engineering Manager | zai/glm-5.1 | ✅ Active |
| frontend-coder | Frontend | zai/glm-5.1 | ✅ Ready |
| backend-coder | Backend | zai/glm-5.1 | ✅ Ready |
| qa | QA/Testing | zai/glm-5.1 | ✅ Ready |
| planner | PM | zai/glm-5-turbo | ✅ Ready |
| deployer | Deploy | zai/glm-5-turbo | ✅ Ready |
| warren | Ops/HR | zai/glm-5-turbo | ✅ Ready |
| derek-negotiator | Negotiation | zai/glm-5-turbo | ✅ Ready |
| sourcing-agent (Scout) | Sourcing | zai/glm-5-turbo | ✅ Ready |
| kilocode | CLI Coder | zai/glm-5.1 | ✅ Ready |
| critic | Code Review | openrouter/moonshotai/kimi-k2-instruct | ✅ Ready |

## Current Project: Sourcing Dashboard
- **Repo:** `/home/e/sourcing-dashboard/`
- **Stack:** Next.js 16 + React 19 + TypeScript + Tailwind v3 + Radix UI + shadcn/ui
- **Build:** ✅ Passing
- **Deploy:** Vercel (https://sourcing-dashboard-six.vercel.app)
- **DB:** Turso (libSQL) — users, requests, quotes, files, activity_log, suppliers

### Active Tasks
| Task | Owner | Status |
|------|-------|--------|
| Wire suppliers to real DB (remove mocks) | CTO | 🔄 In Progress |
| Seed initial supplier data | CTO | 🔄 In Progress |

### Completed Recently
- ✅ Frontend Foundation Overhaul (shadcn/ui migration) 
- ✅ Duplicate Request + Copy Link buttons
- ✅ Accept quote fix
- ✅ Notification bell wired to real data
- ✅ Customer dashboard improvements
- ✅ Sign-out button fix
- ✅ Security audit & sanitization hardening

## System Status
- **Gateway:** v2026.3.24 (updating to v2026.4.2)
- **WhatsApp:** Connected (+8618566570937)
- **Budget:** $0/day (all free models)
- **Cron Jobs:** auto-tag ✅, daily-summary ✅, weekly-summary ✅

## Pending Decisions (need Etia)
- 🔴 Send Project Spider RFQs to STW & Goochain (awaiting approval)
- 🟡 WhatsApp DM binding for executive briefings
- 🟡 Derek negotiation strategy for first supplier outreach

## shadcn/ui Components Available
avatar, badge, button, card, command, dialog, dropdown-menu, input, input-group, label, loader, popover, select, separator, sheet, sonner, table, tabs, textarea, tooltip

### Shared Domain Components
stat-card, empty-state, page-header, status-badge
