# TASK: Dashboard v2 - Sidebar + Real-time Updates

**Assigned to:** CTO (agentId: cto)
**Date:** 2026-03-17
**Priority:** HIGH (today's goal)
**Status:** ✅ QA PASS (2026-03-21 12:20) - Approved for production

## Objective
Implement sidebar navigation and real-time update features for the dashboard v2.

## Requirements

### Part 1: Sidebar Navigation
- [x] Collapsible sidebar component
- [x] Navigation links (Dashboard, Agents, Tasks, Settings)
- [x] Active state highlighting
- [x] Mobile-responsive toggle
- [x] Persist collapse state in localStorage

### Part 2: Real-time Updates
- [x] WebSocket connection to OpenClaw Gateway
- [x] Live agent status updates
- [x] Real-time message feed
- [x] Connection status indicator
- [x] Auto-reconnect on disconnect

## Technical Stack
- Frontend: Vite + React (E's preferred setup)
- Backend: Express API on :3002
- Gateway: ws://127.0.0.1:18789
- Models: Use KiloCode CLI with GLM-5 free

## Deliverables
1. Working sidebar with navigation
2. Real-time status updates
3. Clean, responsive UI
4. Error handling for WebSocket failures

## Notes
- Use free models only (GLM-5 via KiloCode)
- Test on mobile viewport
- Follow existing dashboard structure
- Report progress every 30 min

## Completion Criteria
- [x] All checkboxes above complete
- [x] Testing passes (desktop + mobile)
- [x] No console errors
- [x] Ready for QA review

---

## QA Review (2026-03-19 09:05)

**Status:** ⚠️ NEEDS_FIX

**Issue Found:** Cost alert threshold is incorrect
- **Current:** Alerts trigger when cost > $5 OR change > 50%
- **Required:** Alerts should trigger when cost > $1
- **File:** `page.tsx` line 76
- **Fix:** Change `if (change > 5 || percentChange > 0.5)` to `if (change > 1)`

**Everything Else:**
- ✅ WebSocket connection working
- ✅ Auto-refresh every 30 seconds
- ✅ Visual indicator (spinning icon)
- ✅ Manual refresh button
- ✅ Page Visibility API (pause when hidden)

**Action Required:** CTO to fix the threshold issue and resubmit for QA review.

---

## Full QA Report
See: `/home/e/.openclaw/workspace/agents/QA_REPORT_DASHBOARD_REALTIME.md`
