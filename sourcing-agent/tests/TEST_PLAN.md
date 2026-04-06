# 📋 Test Plan — Sourcing Agent Dashboard

**Prepared by:** QA Agent  
**Date:** 2026-03-28  
**Dashboard Version:** 1.0 (initial)  
**Tester:** QA + User (Etia)  
**Environment:** Local dev (macOS/Linux, Python 3.12)

---

## TEST PHASES

### Phase 1: Smoke Tests (5 minutes)
*Run immediately when CTO says "it's ready"*

**Goal:** Verify the app starts and doesn't crash.

| # | Test | Command/Action | Expected | Pass? |
|---|------|----------------|----------|-------|
| 1.1 | Install dependencies | `pip install -r dashboard/requirements.txt` | All deps install cleanly | ☐ |
| 1.2 | Run automated tests | `pytest tests/ -v -m smoke` | All smoke tests pass | ☐ |
| 1.3 | Start dashboard | `python dashboard/dashboard.py` | Server starts on :8501 | ☐ |
| 1.4 | Load homepage | Open http://localhost:8501 | Page renders, no errors | ☐ |
| 1.5 | Check all pages | Click each sidebar nav item | All 4 pages render | ☐ |
| 1.6 | Check console | Look at terminal output | No exceptions/warnings | ☐ |

**⛔ GATE:** If any smoke test fails → stop, report to CTO, do not proceed.

---

### Phase 2: Functional Tests (30 minutes)
*Systematic page-by-page testing*

**Goal:** Verify every feature works as specified.

#### 2A — New Request Page (10 min)

| # | Test | Action | Expected | Pass? |
|---|------|--------|----------|-------|
| 2A.1 | Form renders | Navigate to New Request | All fields visible | ☐ |
| 2A.2 | Product type options | Open product_type dropdown | 4 options listed | ☐ |
| 2A.3 | File upload | Upload a test PDF | File accepted, preview shows | ☐ |
| 2A.4 | Submit valid form | Fill all fields, click Submit | Job created, confirmation shown | ☐ |
| 2A.5 | Verify job file | Check `customers/job_*.md` | File exists with correct content | ☐ |
| 2A.6 | Empty validation | Click Submit with empty name | Error/warning shown | ☐ |
| 2A.7 | Chinese characters | Enter 中文 in description | Characters render correctly | ☐ |
| 2A.8 | Incrementing IDs | Submit 3 requests | job_001, job_002, job_003 | ☐ |

#### 2B — Requests Page (8 min)

| # | Test | Action | Expected | Pass? |
|---|------|--------|----------|-------|
| 2B.1 | List renders | Navigate to Requests | Table/cards show all jobs | ☐ |
| 2B.2 | New job appears | Go back to New Request, create one | Job shows in Requests | ☐ |
| 2B.3 | Search | Type in search bar | List filters correctly | ☐ |
| 2B.4 | Job detail | Click a request | Full details shown | ☐ |
| 2B.5 | Status badges | View job list | Correct status colors shown | ☐ |
| 2B.6 | Empty state | (If no jobs) | Helpful empty message | ☐ |

#### 2C — Suppliers Page (8 min)

| # | Test | Action | Expected | Pass? |
|---|------|--------|----------|-------|
| 2C.1 | List renders | Navigate to Suppliers | Seed suppliers shown | ☐ |
| 2C.2 | Search | Search "CNC" | Only CNC suppliers shown | ☐ |
| 2C.3 | Filter specialty | Filter by specialty | Correct filtering | ☐ |
| 2C.4 | Supplier detail | Click a supplier | Full dossier displayed | ☐ |
| 2C.5 | Favorite | Toggle favorite | Star/highlight updates | ☐ |
| 2C.6 | Chinese names | View supplier list | 中文 names render | ☐ |

#### 2D — Analytics Page (4 min)

| # | Test | Action | Expected | Pass? |
|---|------|--------|----------|-------|
| 2D.1 | Metrics render | Navigate to Analytics | Numbers displayed | ☐ |
| 2D.2 | Charts render | View charts | Charts visible, no errors | ☐ |
| 2D.3 | Data accuracy | Count suppliers manually | Metric matches count | ☐ |
| 2D.4 | Updates | Create request, check Analytics | Count increases | ☐ |

---

### Phase 3: Integration Tests (30 minutes)
*Test cross-feature workflows and data persistence*

| # | Test | Action | Expected | Pass? |
|---|------|--------|----------|-------|
| 3.1 | Full workflow | New Request → Submit → View in Requests → Check Analytics | End-to-end works | ☐ |
| 3.2 | Data persists | Create request → Refresh page → Check Requests | Data still there | ☐ |
| 3.3 | Multi-tab | Open 2 browser tabs, modify in one | Other tab shows update | ☐ |
| 3.4 | File system | Check created `.md` file | Valid markdown, all sections | ☐ |
| 3.5 | Run all pytest | `pytest tests/ -v` | All tests pass | ☐ |
| 3.6 | Edge: rapid submits | Click Submit 5 times fast | No duplicates, no errors | ☐ |
| 3.7 | Edge: large description | Paste 10,000 chars in description | No crash or truncation | ☐ |
| 3.8 | Edge: no suppliers | Temporarily empty suppliers dir | Graceful empty state | ☐ |

---

### Phase 4: User Acceptance Tests (UAT) (30 minutes)
*Etia tests the dashboard as a real user*

**Scenarios:**

1. **"I need CNC aluminum brackets sourced"**
   - Submit a new request for 100x CNC aluminum 6061 brackets
   - Verify the job appears with correct specs
   - Check Chinese translation in the job file

2. **"Show me my suppliers"**
   - Browse suppliers, search for "Dongguan"
   - Favorite a supplier
   - View full supplier dossier

3. **"How's my sourcing going?"**
   - Check Analytics for overview
   - Verify numbers make sense

4. **"I made a mistake, let me fix it"**
   - (If editing is supported) modify a request
   - Verify changes persist

**UAT Sign-off:**
- [ ] Etia confirms the dashboard meets requirements
- [ ] Etia identifies any UX improvements
- [ ] Priority bugs logged

---

## RUNNING THE TESTS

```bash
# From sourcing-agent/ directory

# Install test dependencies
pip install pytest

# Run all tests
pytest tests/ -v

# Smoke tests only (quick check)
pytest tests/ -v -m smoke

# Functional tests
pytest tests/ -v -m functional

# Integration tests
pytest tests/ -v -m integration

# Performance tests
pytest tests/ -v -m performance

# With coverage (if pytest-cov installed)
pytest tests/ -v --cov=dashboard --cov-report=term-missing
```

---

## BUG REPORTING FORMAT

When a bug is found, report it as:

```
**BUG-NNN:** [Short description]
- **Severity:** Critical / High / Medium / Low
- **Page:** New Request / Requests / Suppliers / Analytics
- **Steps to Reproduce:**
  1. ...
  2. ...
- **Expected:** ...
- **Actual:** ...
- **Screenshot:** (attach if UI bug)
- **Console Error:** (paste if applicable)
```

---

## TIMELINE

| Phase | Duration | Start | End |
|-------|----------|-------|-----|
| Smoke Tests | 5 min | CTO says ready | +5 min |
| Functional Tests | 30 min | Smoke pass | +35 min |
| Integration Tests | 30 min | Functional pass | +65 min |
| UAT | 30 min | Integration pass | +95 min |
| **Total** | **~1.5 hours** | | |

---

## SIGN-OFF

- [ ] **QA:** All automated tests pass
- [ ] **QA:** Manual checklist completed
- [ ] **CTO:** No critical bugs remain
- [ ] **Etia (UAT):** Approved for use

---

*Prepared: 2026-03-28 01:24 | QA Agent*
