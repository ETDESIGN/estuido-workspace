# T-003: Frontend Architecture Upgrade

**Priority:** P0
**Assignee:** frontend-coder (lead), CTO (architect)
**Dependencies:** None
**Status:** todo
**Created:** 2026-03-31 06:20 HKT
**Project:** Sourcing System Full Upgrade
**Time block:** 09:00–10:30 HKT

---

## Description
Restructure the Streamlit dashboard from a monolithic single-file app into a modular, maintainable architecture. The current `dashboard.py` (1000+ lines) needs to be broken into proper modules with shared state management, consistent theming, and a component-based structure.

## Current State
- Single `dashboard.py` file (~1000 lines)
- Inline CSS, no design system
- Pages are functions in the same file
- `pages_quotes.py` exists but is disconnected
- `enhancements.py` provides helpers but inconsistently used
- No shared state management

## Target State
```
dashboard/
├── app.py                    # Entry point, minimal routing
├── config.py                 # Theme, colors, fonts, constants
├── state.py                  # Shared session state management
├── components/               # Reusable UI components
│   ├── __init__.py
│   ├── cards.py              # Metric cards, info cards, KPI cards
│   ├── tables.py             # Data tables with sort/filter
│   ├── forms.py              # Form components with validation
│   ├── charts.py             # Chart wrappers (Plotly helpers)
│   ├── badges.py             # Status badges, priority badges
│   └── navigation.py         # Sidebar, breadcrumbs, page headers
├── pages/
│   ├── __init__.py
│   ├── new_request.py        # New RFQ/request page
│   ├── requests.py           # Request list & detail
│   ├── suppliers.py          # Supplier database
│   ├── quotes.py             # Quote generator (from T-004)
│   ├── analytics.py          # Charts & KPIs
│   └── compare.py            # Supplier comparison
├── services/
│   ├── __init__.py
│   ├── suppliers.py          # Supplier data CRUD
│   ├── requests.py           # Request data CRUD
│   ├── quotes.py             # Quote generation logic
│   └── analytics.py          # Analytics calculations
└── styles/
    └── theme.css             # Centralized styles
```

## Acceptance Criteria
- [ ] App loads with no import errors
- [ ] All existing pages work after restructuring
- [ ] Navigation between pages works correctly
- [ ] Shared state persists across page navigation
- [ ] No duplicate code (components are truly reused)
- [ ] Config values (colors, fonts) are centralized

## Files to Create/Modify
- `~/.openclaw/workspace/sourcing-agent/dashboard/app.py` (new entry point)
- `~/.openclaw/workspace/sourcing-agent/dashboard/config.py` (new)
- `~/.openclaw/workspace/sourcing-agent/dashboard/state.py` (new)
- `~/.openclaw/workspace/sourcing-agent/dashboard/components/*.py` (new)
- `~/.openclaw/workspace/sourcing-agent/dashboard/pages/*.py` (refactored from dashboard.py)
- `~/.openclaw/workspace/sourcing-agent/dashboard/services/*.py` (extracted from dashboard.py)
- `~/.openclaw/workspace/sourcing-agent/dashboard/dashboard.py` → kept as backup

## Technical Notes
- Use `st.session_state` for cross-page state (Streamlit standard)
- Keep Plotly for charts (already a dependency)
- Tailwind-like utility classes via custom CSS since Streamlit doesn't support Tailwind directly
- The `quote_generator.py` in `tools/` should be wrapped by `services/quotes.py`
- Maintain backward compatibility with existing data files (JSON, CSV in suppliers/ and customers/)

## Review Log
| Date | Reviewer | Verdict | Notes |
|------|----------|---------|-------|
| | | | |
