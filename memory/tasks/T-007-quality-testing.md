# T-007: Quality & Testing Framework

**Priority:** P1
**Assignee:** qa (lead), CTO
**Dependencies:** T-003, T-004, T-005
**Status:** todo
**Created:** 2026-03-31 06:20 HKT
**Project:** Sourcing System Full Upgrade
**Time block:** 13:00–14:00 HKT

---

## Description
Build a proper testing framework for the dashboard and backend services. Currently there are 34 passing tests — expand coverage and add new test types to prevent regressions after the upgrade.

## Current State
- `pytest.ini` exists in `sourcing-agent/`
- 34 tests passing (likely basic unit tests)
- No UI/integration tests
- No test for new components or services

## Testing Strategy

### 1. Unit Tests (target: 80%+ coverage on services/)
```
tests/
├── unit/
│   ├── test_services/
│   │   ├── test_suppliers.py
│   │   ├── test_requests.py
│   │   ├── test_quotes.py
│   │   └── test_analytics.py
│   ├── test_components/
│   │   ├── test_cards.py
│   │   ├── test_tables.py
│   │   └ test_badges.py
│   └── test_tools/
│       └── test_quote_generator.py
```

### 2. Integration Tests
```
tests/
├── integration/
│   ├── test_dashboard_load.py      # All pages load without errors
│   ├── test_data_flow.py           # Supplier → Quote → Export chain
│   ├── test_lifecycle.py           # Request state machine transitions
│   └── test_file_watching.py       # New data files trigger updates
```

### 3. Visual Regression Tests
- Screenshot comparison for each page (before/after)
- Capture baseline screenshots of current dashboard
- After upgrade, compare new screenshots
- Flag any unexpected visual changes

### 4. Data Integrity Tests
```
tests/
├── data/
│   ├── test_supplier_schema.py     # Supplier JSON matches expected format
│   ├── test_request_schema.py      # Request JSON matches expected format
│   ├── test_quote_format.py        # Quote JSON is valid and calculable
│   └── fixtures/
│       ├── sample_supplier.json
│       ├── sample_request.json
│       └── sample_quote.json
```

### 5. Performance Tests
- Page load time < 2 seconds
- Chart rendering < 500ms
- Data file parsing < 100ms for 1000 suppliers
- No memory leaks on navigation between pages

## Test Execution
```bash
# Run all tests
cd ~/.openclaw/workspace/sourcing-agent && python -m pytest

# Run with coverage
python -m pytest --cov=dashboard --cov=tools --cov-report=term-missing

# Run only unit tests
python -m pytest tests/unit/

# Run only integration tests
python -m pytest tests/integration/
```

## QA Checklist for Each Ticket
Before marking any ticket as DONE, QA must verify:
- [ ] Page loads without errors
- [ ] All existing data still displays correctly
- [ ] New features work as described in acceptance criteria
- [ ] No regressions (existing features still work)
- [ ] Responsive layout works (test at 768px, 1024px, 1440px widths)
- [ ] No console errors (check browser dev tools)
- [ ] Performance acceptable (page load < 2s)

## Acceptance Criteria
- [ ] Unit test coverage ≥ 80% on services/ directory
- [ ] All 34 existing tests still pass
- [ ] 20+ new tests added
- [ ] Integration tests verify data flow between modules
- [ ] Test fixtures cover edge cases (empty data, missing fields, large datasets)
- [ ] CI-ready: `pytest` runs clean with zero failures
- [ ] QA checklist documented and usable

## Files to Create/Modify
- `~/.openclaw/workspace/sourcing-agent/tests/unit/` (NEW)
- `~/.openclaw/workspace/sourcing-agent/tests/integration/` (NEW)
- `~/.openclaw/workspace/sourcing-agent/tests/data/` (NEW)
- `~/.openclaw/workspace/sourcing-agent/tests/fixtures/` (NEW)
- `~/.openclaw/workspace/sourcing-agent/pytest.ini` (update)

## Technical Notes
- Use `pytest` and `pytest-cov` (already available)
- Streamlit testing: use `streamlit.testing` or mock `st` for component tests
- For integration tests, can start Streamlit in test mode and make HTTP requests
- Fixtures should use `@pytest.fixture` with factory pattern
- Test data should be small but representative (3-5 suppliers, 5-10 requests)

## Review Log
| Date | Reviewer | Verdict | Notes |
|------|----------|---------|-------|
| | | | |
