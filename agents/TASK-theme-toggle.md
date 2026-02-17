# Task: Dashboard Theme Toggle

## Objective
Add a dark/light mode theme toggle to the cost analytics dashboard

## Requirements
- [ ] Add theme toggle button in header
- [ ] Implement theme context/provider
- [ ] Persist theme preference (localStorage)
- [ ] Toggle between dark (default) and light modes
- [ ] Update all components to respect theme

## Constraints
- Use shadcn/ui `Toggle` or `Switch` component
- Use CSS variables for theming (Tailwind `dark:` classes)
- Must work with existing `bg-slate-900` etc. colors
- No new npm dependencies without approval

## Files to Modify
- `src/app/layout.tsx` - Add ThemeProvider
- `src/app/page.tsx` - Add theme toggle button
- `src/components/ui/` - May need theme-aware components
- `src/lib/theme.ts` - New file for theme logic

## Acceptance Criteria
- [ ] Toggle visible in header
- [ ] Clicking toggle switches theme
- [ ] Theme persists across reloads
- [ ] All components render correctly in both modes
- [ ] No visual regressions in dark mode (current default)

## Priority
Medium - Nice to have for Q1

## Estimated Effort
2-3 hours

---

## Progress Log

### 2026-02-16 07:40
Task assigned to CTO. Starting work.

