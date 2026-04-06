# T-006: Planning System & Workflow Engine

**Priority:** P1
**Assignee:** planner (lead), backend-coder
**Dependencies:** T-003 (needs modular architecture)
**Status:** todo
**Created:** 2026-03-31 06:20 HKT
**Project:** Sourcing System Full Upgrade
**Time block:** 12:00–13:00 HKT

---

## Description
Build a proper planning and workflow system so the sourcing agent team can track work, manage tasks, and coordinate across agents. This connects the OpenClaw task board (`memory/tasks/`) with the dashboard UI.

## Features

### 1. Task Board Integration
- Dashboard reads from `memory/tasks/PIPELINE.md` and ticket files
- Live pipeline view (PLAN → CODE → REVIEW → TEST → DEPLOY → DONE)
- Ticket status updates from the dashboard (writes back to ticket files)
- Agent assignment tracking

### 2. Request Lifecycle Workflow
```
DRAFT → SUBMITTED → RFQ_SENT → QUOTES_RECEIVED → REVIEWING → 
APPROVED → SAMPLE_ORDERED → SAMPLE_APPROVED → PO_ISSUED → 
IN_PRODUCTION → QC_PASSED → SHIPPED → DELIVERED → CLOSED
```

Each state transition:
- Records timestamp
- Records which agent/user triggered it
- Supports optional notes
- Triggers notifications

### 3. Planning Views
- **Sprint view:** Group work by time blocks (morning/afternoon/evening)
- **Priority view:** Sort by P0 → P1 → P2
- **Agent view:** See all tasks assigned to each agent
- **Timeline view:** Gantt-like visualization of planned work

### 4. Meeting Notes & Standup Tracker
- Daily standup template (What I did, What I'm doing, Blockers)
- Standup history (stored per date)
- Summary view: "What the team accomplished this week"

## Data Model

### Task (extends ticket format)
```json
{
  "id": "T-006",
  "title": "Planning System",
  "status": "todo",
  "priority": "P1",
  "assignee": "planner",
  "created": "2026-03-31T06:20:00+08:00",
  "updated": "2026-03-31T06:20:00+08:00",
  "due": "2026-03-31T15:00:00+08:00",
  "time_block": "12:00-13:00",
  "dependencies": ["T-003"],
  "history": [
    {"from": "todo", "to": "in-progress", "by": "planner", "at": "...", "note": "..."}
  ],
  "tags": ["planning", "workflow"]
}
```

### Request Lifecycle State
```json
{
  "request_id": "RFQ-004",
  "lifecycle": {
    "current_state": "QUOTES_RECEIVED",
    "history": [
      {"state": "DRAFT", "entered_at": "...", "entered_by": "main"},
      {"state": "RFQ_SENT", "entered_at": "...", "entered_by": "sourcing-agent"}
    ]
  }
}
```

## Acceptance Criteria
- [ ] Pipeline view in dashboard shows all tickets with correct status
- [ ] Ticket status can be updated from dashboard (writes to file)
- [ ] Request lifecycle states are tracked with timestamps
- [ ] Planning views work (sprint, priority, agent, timeline)
- [ ] Standup tracker records daily notes per agent
- [ ] Data persists in `memory/tasks/` (no database needed)

## Files to Create/Modify
- `dashboard/pages/planning.py` (NEW)
- `dashboard/services/planning.py` (NEW — reads/writes task files)
- `dashboard/services/lifecycle.py` (NEW — request state machine)
- `~/.openclaw/workspace/memory/tasks/PIPELINE.md` (existing, enhanced)
- `dashboard/components/timeline.py` (NEW — lifecycle visualization)

## Technical Notes
- File-based storage (JSON + Markdown in `memory/tasks/`)
- Read PIPELINE.md for state, read individual ticket .md files for details
- State transitions validated by `lifecycle.py` (can't jump from DRAFT to APPROVED)
- Use `st.session_state` for UI state, write to disk for persistence
- The planner agent should be able to update tickets via the gateway API

## Review Log
| Date | Reviewer | Verdict | Notes |
|------|----------|---------|-------|
| | | | |
