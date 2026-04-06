# T-008: System Integration & Deployment

**Priority:** P2
**Assignee:** backend-coder (lead), deployer
**Dependencies:** T-003, T-005, T-006
**Status:** todo
**Created:** 2026-03-31 06:20 HKT
**Project:** Sourcing System Full Upgrade
**Time block:** 14:00–15:00 HKT

---

## Description
Integrate all the upgraded pieces together, ensure data flows correctly between modules, and prepare for deployment. This is the final integration pass before the system goes live with the new design.

## Integration Points

### 1. Data Layer Integration
- **Suppliers:** `suppliers/` JSON files → `services/suppliers.py` → All pages
- **Requests:** `memory/tasks/` + request files → `services/requests.py` → Request pages
- **Quotes:** `tools/quote_generator.py` → `services/quotes.py` → Quote page + Compare page
- **Analytics:** All data sources → `services/analytics.py` → Analytics page
- **Planning:** `memory/tasks/PIPELINE.md` → `services/planning.py` → Planning page

### 2. Real-time Updates
- File watcher (`fs-watcher.js`) detects new supplier/request data
- Dashboard auto-refreshes when data changes (via polling or Streamlit rerun)
- Status updates in planning page trigger dashboard refresh

### 3. Export Pipeline
```
Dashboard → Services → Export Formats
├── CSV (all list views)
├── PDF (quotes, comparison reports, analytics)
├── Markdown (quotes, tickets)
└── JSON (raw data, API-compatible)
```

### 4. Agent Communication
- Sourcing agent writes new supplier data → Dashboard picks it up
- Planner agent creates/updates tickets → Dashboard reflects changes
- CTO agent completes code tasks → QA agent runs tests automatically
- All agents can read from shared `memory/` workspace

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing (pytest clean)
- [ ] No import errors on any page
- [ ] Data files compatible (no breaking schema changes)
- [ ] Performance baseline recorded
- [ ] Backup of current dashboard.py created

### Deployment Steps
1. Stop current Streamlit process
2. Copy new dashboard files to workspace
3. Start Streamlit with new `app.py` entry point
4. Verify all pages load
5. Run smoke tests
6. Update HEARTBEAT.md with new dashboard status

### Rollback Plan
- Keep `dashboard.py.backup` as fallback
- If critical issues: restore backup, restart Streamlit on old entry point
- Document what broke for next iteration

## Acceptance Criteria
- [ ] All 7 pages load correctly after integration
- [ ] Data flows end-to-end: Supplier data → Dashboard display → Quote generation → Export
- [ ] File watcher triggers dashboard refresh
- [ ] Planning page reads/writes to PIPELINE.md
- [ ] CSV export works from all list views
- [ ] PDF export works for quotes
- [ ] Dashboard restarts cleanly (no stale state)
- [ ] Rollback tested and verified

## Files to Create/Modify
- `dashboard/app.py` (entry point — ties everything together)
- `dashboard/services/__init__.py` (exports all services)
- `dashboard/components/__init__.py` (exports all components)
- `~/.openclaw/workspace/HEARTBEAT.md` (update dashboard info)
- `~/.openclaw/workspace/sourcing-agent/Makefile` (add test/deploy targets)

## Technical Notes
- Streamlit doesn't have hot-reload for multi-file apps — need full restart
- Consider using `streamlit run app.py --server.fileWatcherType none` for production (prevent watchdog conflicts with fs-watcher)
- Export PDF: WeasyPrint is already installed, use it via `services/quotes.py`
- Make sure `services/` modules handle missing data gracefully (files may not exist yet)

## Review Log
| Date | Reviewer | Verdict | Notes |
|------|----------|---------|-------|
| | | | |
