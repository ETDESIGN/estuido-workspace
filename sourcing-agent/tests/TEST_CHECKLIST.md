# 🧪 Testing Checklist — Sourcing Agent Dashboard

**Prepared by:** QA Agent  
**Date:** 2026-03-28  
**Dashboard:** `dashboard/dashboard.py`  
**Deploy URL:** http://localhost:8501

---

## ✅ PRE-LAUNCH CHECKS

- [ ] `pip install -r dashboard/requirements.txt` succeeds
- [ ] `python dashboard/dashboard.py` starts without errors
- [ ] http://localhost:8501 loads and renders
- [ ] No Python import errors in logs
- [ ] No `st.deprecation` warnings on first load
- [ ] `pytest tests/ -v` passes all tests
- [ ] `customers/` directory is writable by Streamlit process
- [ ] `dashboard/uploads/` directory exists
- [ ] No hardcoded secrets or API keys in source

---

## 📄 PAGE 1: NEW REQUEST

### Form Rendering
- [ ] All form fields render (project_name, product_type, quantity, material, tolerance, timeline, description, drawing)
- [ ] Product type dropdown has all 4 options (CNC, Plastic Molding, PCB/PCBA, Assembly)
- [ ] File uploader accepts PDF, PNG, JPG
- [ ] Date picker defaults to +30 days
- [ ] Quantity has min=1, default=100

### Form Submission
- [ ] Submit button is visible and clickable
- [ ] Validation: empty project_name shows error
- [ ] Submit creates a `.md` file in `customers/`
- [ ] File has correct Job ID format (job_NNN)
- [ ] Confirmation message shown after submit
- [ ] Uploaded file saved to `dashboard/uploads/`
- [ ] Created job appears in Requests page

### Edge Cases
- [ ] Very long project name (200+ chars) doesn't break layout
- [ ] Special characters in description (Chinese, emoji) render correctly
- [ ] Submitting twice doesn't create duplicate IDs

---

## 📄 PAGE 2: REQUESTS

### List View
- [ ] Shows all existing requests in a table/cards
- [ ] Displays status badges (In Progress, RFQ Sent, etc.)
- [ ] Job ID and Customer name visible
- [ ] Empty state message when no requests exist
- [ ] New request from Page 1 appears here

### Filtering & Search
- [ ] Search bar filters by project name
- [ ] Status filter works (if implemented)
- [ ] Clearing filters shows all results

### Detail View
- [ ] Clicking a request shows full job details
- [ ] All sections from job_template.md rendered
- [ ] Back button returns to list

### Actions
- [ ] Approve/Reject buttons visible (if implemented)
- [ ] Status change persists

---

## 📄 PAGE 3: SUPPLIERS

### List View
- [ ] Shows all suppliers (seed + any added)
- [ ] Displays key info: name, specialty, city, rating
- [ ] Empty state message when no suppliers
- [ ] Status badges (active/inactive)

### Search & Filter
- [ ] Search by supplier name
- [ ] Filter by specialty/capability
- [ ] Filter by rating
- [ ] Filter by location/city
- [ ] Filters combine correctly (AND logic)

### Supplier Detail
- [ ] Clicking supplier shows full dossier
- [ ] All template fields displayed
- [ ] Capabilities shown clearly
- [ ] Pricing info visible
- [ ] Performance metrics shown

### Favorites
- [ ] Can favorite/unfavorite a supplier
- [ ] Favorite status persists (saved to JSON)

---

## 📄 PAGE 4: ANALYTICS

### Metrics
- [ ] Total requests count displayed
- [ ] Active jobs count displayed
- [ ] Supplier count displayed
- [ ] Numbers match actual data

### Charts
- [ ] At least 1 chart renders without error
- [ ] Charts have labels/titles
- [ ] Charts use correct color scheme (per spec)

### Data Accuracy
- [ ] Metrics update when new request added
- [ ] Supplier count matches actual supplier files

---

## 🔗 INTEGRATION TESTS

### Cross-Page Flow
- [ ] Create request → appears in Requests → shows in Analytics
- [ ] Supplier added → appears in Suppliers → count in Analytics updates
- [ ] Status change in Requests → reflected in Analytics

### Data Persistence
- [ ] Data survives page refresh
- [ ] Data survives browser tab close/reopen
- [ ] Multiple browser tabs show same data

### File System
- [ ] Job `.md` files are valid markdown
- [ ] Supplier JSON files parse correctly
- [ ] Uploads saved to correct directory
- [ ] No temporary/lock files left behind

---

## ⚡ PERFORMANCE TESTS

- [ ] Initial page load < 5 seconds
- [ ] Switching between pages < 2 seconds
- [ ] Rendering 10+ suppliers < 2 seconds
- [ ] Rendering 10+ requests < 2 seconds
- [ ] Chart rendering < 3 seconds
- [ ] No memory leaks (check after 50+ page switches)

---

## 🎨 UI/UX CHECKS

- [ ] Color scheme matches spec (green/yellow/red/blue)
- [ ] Status badges use correct colors
- [ ] Responsive layout (resize browser window)
- [ ] Mobile viewport renders acceptably
- [ ] Chinese characters display correctly (supplier names)
- [ ] Navigation sidebar works
- [ ] Page titles are clear and descriptive

---

## 🐛 KNOWN ISSUES LOG

| # | Issue | Severity | Page | Status |
|---|-------|----------|------|--------|
| | (none yet) | | | |

---

*Last updated: 2026-03-28 01:24*
