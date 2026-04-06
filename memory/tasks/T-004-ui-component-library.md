# T-004: UI Component Library & Design System

**Priority:** P0
**Assignee:** frontend-coder
**Dependencies:** T-003 (needs architecture in place)
**Status:** todo
**Created:** 2026-03-31 06:20 HKT
**Project:** Sourcing System Full Upgrade
**Time block:** 09:30–10:30 HKT (parallel with T-003 tail)

---

## Description
Build a reusable UI component library with a consistent design system. This gives the entire dashboard a polished, professional look with proper spacing, typography, colors, and interactive states.

## Design System

### Color Palette
```
Primary:     #3B82F6 (blue-500)     — Actions, links, active states
Secondary:   #8B5CF6 (violet-500)   — Accents, highlights
Success:     #10B981 (emerald-500)  — Approved, completed
Warning:     #F59E0B (amber-500)    — Pending, attention needed
Danger:      #EF4444 (red-500)      — Blocked, rejected, errors
Neutral:     #64748B (slate-500)    — Secondary text
Background:  #F8FAFC (slate-50)     — Page background
Surface:     #FFFFFF                — Card backgrounds
Border:      #E2E8F0 (slate-200)    — Borders, dividers
```

### Typography
- Headings: System font stack, bold, darker color (#0F172A)
- Body: System font stack, regular, (#334155)
- Caption: Smaller, lighter (#94A3B8)
- Monospace: For IDs, amounts, technical data

### Spacing Scale
- 4px base unit: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px

### Component Specs
Each component must have:
- `default` state
- `hover` state (interactive components)
- `disabled` state (where applicable)
- `loading` state (forms, buttons)
- Proper padding/margins consistent with spacing scale
- Border radius: 8px (cards), 6px (buttons/inputs)

## Components to Build

### 1. Cards (`components/cards.py`)
```
- metric_card(label, value, delta=None, icon=None, color=None)
- info_card(title, content, icon=None, border_color=None)
- supplier_card(supplier_data, actions=None)
- request_card(request_data, actions=None)
- stat_row(metrics: list)  # Horizontal row of metric cards
```

### 2. Tables (`components/tables.py`)
```
- data_table(data, columns, sortable=True, filterable=True, page_size=20)
- supplier_table(suppliers, on_select=None)
- request_table(requests, on_select=None)
- quote_table(line_items)
```

### 3. Forms (`components/forms.py`)
```
- form_field(label, widget_type, required=False, help_text=None)
- search_bar(placeholder, on_search=None)
- filter_bar(filters: list, active: dict)
- form_actions(submit_label="Save", cancel_label="Cancel")
```

### 4. Charts (`components/charts.py`)
```
- kpi_chart(value, label, trend=None)  # Single KPI with sparkline
- bar_chart(data, x, y, title, color)
- line_chart(data, x, y, title, color)
- radar_chart(categories, values, title)
- pie_chart(data, labels, title)
- comparison_chart(suppliers: list, metrics: list)  # Multi-supplier overlay
```

### 5. Badges (`components/badges.py`)
```
- status_badge(status: str)     # Draft, Active, Completed, Blocked
- priority_badge(priority: str) # P0, P1, P2
- tag_badge(label, color)
- count_badge(count)
```

### 6. Navigation (`components/navigation.py`)
```
- page_header(title, subtitle=None, actions=None)
- breadcrumb(items: list)
- tab_bar(tabs: list, active: str)
- sidebar_section(title, items)
```

## Acceptance Criteria
- [ ] All 6 component modules created and importable
- [ ] Every component renders without errors in isolation
- [ ] Design system colors/fonts are consistent across components
- [ ] Interactive states work (hover on cards, click on tables)
- [ ] Components accept sensible defaults and are easy to customize
- [ ] Documentation strings on all public functions
- [ ] Visual consistency: same card style used everywhere

## Technical Notes
- Use Streamlit's `st.container` and `st.columns` as building blocks
- Wrap everything in CSS classes defined in `config.py`
- Components should return the rendered output (not store state themselves)
- Table pagination should use `st.session_state` for current page
- Chart components should accept data as plain dicts/lists (framework-agnostic)

## Review Log
| Date | Reviewer | Verdict | Notes |
|------|----------|---------|-------|
| | | | |
