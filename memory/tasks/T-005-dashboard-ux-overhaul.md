# T-005: Dashboard UX Overhaul

**Priority:** P0
**Assignee:** frontend-coder (lead), CTO (review)
**Dependencies:** T-003, T-004
**Status:** todo
**Created:** 2026-03-31 06:20 HKT
**Project:** Sourcing System Full Upgrade
**Time block:** 10:30–12:00 HKT

---

## Description
Redesign all dashboard pages using the new component library (T-004) and modular architecture (T-003). Transform from "functional but basic" to a polished, intuitive business tool that Etia would be proud to show clients.

## Page-by-Page Redesign

### 1. Homepage / Overview (NEW)
**Current:** No dedicated homepage — lands on New Request
**Target:** At-a-glance dashboard with:

```
┌─────────────────────────────────────────────────┐
│  🏭 E-Studio Sourcing — Mission Control        │
│  Good morning! Here's your sourcing overview.   │
├─────────┬─────────┬─────────┬─────────┬─────────┤
│ 📋 12   │ 🔄 5    │ ✅ 7    │ 🏭 24   │ 💰 $45K │
│ Requests│ Active  │ Done    │Suppliers│ Pipeline│
├─────────┴─────────┴─────────┴─────────┴─────────┤
│  [Line chart: RFQ volume last 30 days]          │
├──────────────────────┬──────────────────────────┤
│  Recent Requests     │  Urgent Items            │
│  ──────────────      │  ─────────────           │
│  RFQ-004 CNC Part  🔄│  ⚠️ Sample overdue      │
│  RFQ-003 PCB Board  ✅│  ⚠️ Supplier response   │
│  RFQ-002 Housing    ⏳│  ⚠️ Quote expiring      │
├──────────────────────┴──────────────────────────┤
│  Quick Actions: [New RFQ] [Add Supplier] [Quote]│
└─────────────────────────────────────────────────┘
```

### 2. New Request Page
**Improvements:**
- Step-by-step wizard (1. Basic Info → 2. Specifications → 3. Review → 4. Submit)
- Auto-fill from previous requests
- File upload for drawings/specs (drag & drop)
- Product category selector with common CNC/electronics categories
- Estimated timeline display based on product type
- Duplicate request detection

### 3. Requests List Page
**Improvements:**
- Kanban-style view option (Drag between columns: Draft → RFQ Sent → Quoted → Approved → Ordered)
- List view with advanced filters (by status, date range, customer, product type)
- Search bar with instant filtering
- Bulk actions (change status, export selected)
- Request detail drawer/modal instead of separate page
- Status timeline per request (when was it sent, quoted, approved...)

### 4. Suppliers Page
**Improvements:**
- Card grid view (instead of just list)
- Filter by capability (CNC, Injection, PCB, Assembly)
- Filter by location (city/province)
- Filter by MOQ range, rating, response time
- Supplier detail page with full profile, past quotes, certifications
- Quick-add supplier form
- Import suppliers from 1688 JSON data

### 5. Quotes Page (NEW — from existing `pages_quotes.py`)
**Improvements:**
- Quote builder wizard (Select supplier → Set markup → Add line items → Preview → Export)
- Auto-populate from supplier pricing data
- Multiple quote templates (standard, detailed, simple)
- Quote comparison view (show 2-3 supplier quotes side by side)
- Export as PDF, Markdown, or email-ready format
- Quote versioning (track revisions)

### 6. Analytics Page
**Improvements:**
- 4 KPI cards at top (Total Requests, Avg Response Time, Win Rate, Pipeline Value)
- Charts:
  - RFQ volume trend (line chart, 30/60/90 days)
  - Supplier performance (grouped bar: quality, on-time, response rate)
  - Cost trends (average unit price over time)
  - Request status distribution (donut chart)
  - Top suppliers table (ranked by score)
- Date range selector for all charts
- Export any chart as image

### 7. Compare Page
**Improvements:**
- Select 2-5 suppliers from dropdown
- Side-by-side cards with all metrics
- Radar chart overlay (all selected suppliers)
- Pricing comparison table (unit cost, MOQ, lead time)
- "Generate Quote" button from comparison (creates quote from best supplier)
- Save comparisons for later

## Navigation Improvements
- Breadcrumbs on every page
- Quick action buttons always visible
- Recent items in sidebar
- Search accessible from any page
- Mobile-friendly (stack columns on narrow screens)

## Acceptance Criteria
- [ ] Homepage shows KPI overview + recent activity
- [ ] New Request has wizard flow with validation
- [ ] Requests page has list + kanban view toggle
- [ ] Suppliers page has card grid with filters
- [ ] Quotes page has builder wizard + comparison
- [ ] Analytics has 4+ interactive charts
- [ ] Compare page supports 2-5 supplier selection
- [ ] All pages use consistent design system
- [ ] Responsive layout (works on tablet widths)
- [ ] Page load time < 2 seconds

## Files to Create/Modify
- All files in `dashboard/pages/` (new structure from T-003)
- `dashboard/pages/home.py` (NEW — homepage)
- `dashboard/components/wizard.py` (NEW — step-by-step forms)

## Technical Notes
- Use `st.session_state` for wizard step tracking
- Kanban view can use `st.columns` with drop zones (simplified — no drag-drop in Streamlit, use status filter buttons)
- Charts should use the component library wrappers from T-004
- File uploads use `st.file_uploader` — save to `uploads/` directory
- Keep existing data format compatibility (don't break existing JSON/CSV files)

## Review Log
| Date | Reviewer | Verdict | Notes |
|------|----------|---------|-------|
| | | | |
