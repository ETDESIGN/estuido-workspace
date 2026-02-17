# TASK: PDF Export Feature

**Task ID:** TASK_DASHBOARD_PDF_EXPORT  
**Assigned to:** CTO Agent  
**Priority:** MEDIUM  
**Model:** KiloCode CLI (GLM-5:free)  
**Cost:** $0  
**Timebox:** 3 hours  
**Status:** IN PROGRESS

---

## Objective

Implement PDF export for dashboard reports and data.

## Acceptance Criteria

- [ ] Export sessions table as PDF
- [ ] Export cost charts as PDF
- [ ] Include date range filter in export
- [ ] Professional report layout with branding
- [ ] Include metadata (date generated, filters applied)

## Technical Requirements

1. Use @react-pdf/renderer for PDF generation
2. Create PDF templates in `src/components/pdf/`
3. Create API endpoint: `src/app/api/export/pdf/route.ts`
4. Integrate with existing ExportDialog component

## PDF Report Layout

```
┌─────────────────────────────────────┐
│  ESTUDIO AI Analytics Report       │
│  Generated: [Date]                 │
├─────────────────────────────────────┤
│  Summary Statistics                │
│  - Total Cost: $X                  │
│  - Total Tokens: X                  │
│  - Sessions: X                      │
├─────────────────────────────────────┤
│  [Cost Chart - optional]           │
├─────────────────────────────────────┤
│  Sessions Table                     │
│  (paginated if > 50 rows)          │
├─────────────────────────────────────┤
│  Filters Applied: [date range]     │
└─────────────────────────────────────┘
```

## Deliverables

1. `@react-pdf/renderer` installed
2. PDF templates created
3. API endpoint working
4. Export button in UI
5. **MARK AS:** `READY_FOR_QA` when done

## Cost Constraint

**MUST USE:** KiloCode CLI with free models only

---

**Next task after this:** User Authentication
