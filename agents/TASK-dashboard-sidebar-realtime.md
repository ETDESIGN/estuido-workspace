# TASK: Dashboard v2 - Sidebar + Real-time Updates

**Assigned to:** CTO (agentId: cto)
**Date:** 2026-03-17
**Priority:** HIGH (today's goal)
**Status:** PENDING (retry - visibility fixed)

## Objective
Implement sidebar navigation and real-time update features for the dashboard v2.

## Requirements

### Part 1: Sidebar Navigation
- [ ] Collapsible sidebar component
- [ ] Navigation links (Dashboard, Agents, Tasks, Settings)
- [ ] Active state highlighting
- [ ] Mobile-responsive toggle
- [ ] Persist collapse state in localStorage

### Part 2: Real-time Updates
- [ ] WebSocket connection to OpenClaw Gateway
- [ ] Live agent status updates
- [ ] Real-time message feed
- [ ] Connection status indicator
- [ ] Auto-reconnect on disconnect

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
- [ ] All checkboxes above complete
- [ ] Testing passes (desktop + mobile)
- [ ] No console errors
- [ ] Ready for QA review
