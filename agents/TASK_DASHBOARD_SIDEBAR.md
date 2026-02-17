# TASK: Sidebar Navigation Component

**Task ID:** TASK_DASHBOARD_SIDEBAR  
**Assigned to:** CTO Agent  
**Priority:** HIGH  
**Model:** KiloCode CLI (GLM-5:free)  
**Cost:** $0  
**Timebox:** 3 hours  
**Status:** NOT_STARTED

---

## Objective

Implement a collapsible sidebar navigation component for the Cost Analytics Dashboard v2.

## Acceptance Criteria

- [ ] Sidebar collapsible (expand/collapse toggle)
- [ ] Navigation links to all sections:
  - Dashboard (Home)
  - Models (Model comparison)
  - Sessions (Session history)
  - Analytics (Cost charts)
  - Settings
- [ ] Active state highlighting based on current route
- [ ] Mobile-responsive hamburger menu
- [ ] Smooth animations (CSS transitions)
- [ ] Icons for each navigation item (Lucide React icons)

## Technical Requirements

1. Use existing dashboard structure:
   - Location: `dashboards/cost-analytics-v2/src/components/dashboard/Sidebar.tsx`
   - Styling: Tailwind CSS
   - Icons: `lucide-react`

2. Integration:
   - Mount in `src/app/layout.tsx` or `src/app/page.tsx`
   - Should not break existing components

3. Mobile behavior:
   - < 768px: Hidden by default, hamburger menu trigger
   - ≥ 768px: Visible by default, collapse toggle available

## Deliverables

1. Updated/created `Sidebar.tsx` component
2. Any new dependencies added to package.json
3. Update to main page layout to include sidebar
4. **MARK AS:** `READY_FOR_QA` when done

## Cost Constraint

**MUST USE:** KiloCode CLI with free models only
- GLM-5:free (primary)
- MiniMax:free (fallback)
- NO paid models for this task

## QA Checklist (for reference)

QA will verify:
- Sidebar renders correctly
- Collapse/expand works
- Navigation links work
- Active state shows correctly
- Mobile responsive
- No console errors

---

**Start:** Read existing Sidebar.tsx if it exists, then implement.
**End:** Mark TASK_DASHBOARD_SIDEBAR as READY_FOR_QA in AGENT_STATE.md
