# T-002: Sourcing Dashboard - Phase 2 Enhanced Features

**Status:** PLAN
**Priority:** P2
**Assignee:** CTO (after T-001)
**Created:** 2026-03-31
**Depends on:** T-001

---

## Tasks

### 1. Real-time RFQ Tracking
- Auto-refresh every 30s
- WebSocket or polling for file changes
- Status timeline visualization

### 2. Supplier Comparison Visualizations
- Radar charts (capabilities, pricing, reliability)
- Bar charts for side-by-side comparison
- Interactive chart with Plotly

### 3. PDF Export
- Generate PDF reports from comparison data
- Include supplier details, quotes, recommendations
- Professional formatting

### 4. Analytics Dashboard
- RFQ volume over time
- Supplier response rate
- Average pricing trends
- At-a-glance metrics on homepage

### 5. Integration Points
- Connect to sourcing-agent data (suppliers/, customers/)
- File watching for new supplier data
- 1688.com scraped data integration

## Acceptance Criteria
- [ ] Radar charts for supplier comparison
- [ ] PDF export from Compare page
- [ ] Analytics page with 4+ charts
- [ ] Auto-refresh working
- [ ] Data flows from sourcing-agent JSON files

## Technical
- Use Plotly for interactive charts
- Use WeasyPrint for PDF generation (already installed)
- File watcher for real-time updates
