# TASK: Real-time Data Refresh

**Task ID:** TASK_DASHBOARD_REALTIME  
**Assigned to:** CTO Agent  
**Priority:** HIGH  
**Model:** KiloCode CLI (GLM-5:free)  
**Cost:** $0  
**Timebox:** 3 hours  
**Status:** READY_FOR_QA

---

## Objective

Implement WebSocket-based real-time data refresh for the dashboard.

## Acceptance Criteria

- [ ] WebSocket connection to gateway (ws://127.0.0.1:18789)
- [ ] Auto-refresh every 30 seconds
- [ ] Visual indicator when data is updating
- [ ] Toast notification on significant changes (cost > $1 increase)
- [ ] Manual refresh button (keep existing)
- [ ] Pause auto-refresh when tab is hidden (Page Visibility API)

## Technical Requirements

1. Create WebSocket hook: `src/hooks/useGatewaySocket.ts`
2. Create auto-refresh hook: `src/hooks/useAutoRefresh.ts`
3. Update `page.tsx` to use hooks
4. Use existing notification system

## Gateway Connection

```typescript
// Connect to OpenClaw gateway
const ws = new WebSocket('ws://127.0.0.1:18789')
// Subscribe to session updates
// Listen for new sessions, cost updates
```

## Deliverables

1. `useGatewaySocket.ts` hook
2. `useAutoRefresh.ts` hook  
3. Updated `page.tsx` with real-time features
4. **MARK AS:** `READY_FOR_QA` when done

## Cost Constraint

**MUST USE:** KiloCode CLI with free models only
- GLM-5:free (primary)
- MiniMax:free (fallback)
- NO paid models

---

**Note:** Gateway WebSocket requires token auth. Use token from config.
