# Frontend Coding Workflow — Proven Patterns

**Created:** 2026-04-03
**Status:** Active — use this automatically for any frontend project

---

## Philosophy

Every frontend project should follow a **foundation-first** approach:
1. **Component library first** → shadcn/ui before writing any page
2. **Design tokens via CSS variables** → one source of truth for colors, spacing, radii
3. **Shared components** → extract patterns the moment they appear twice
4. **Build after every change** → never let the build break
5. **Commit after every milestone** → atomic, descriptive commits

---

## 1. Project Foundation Checklist

Before writing ANY page code, ensure these are done:

### 1a. shadcn/ui Initialization
```bash
npx shadcn@latest init -t next -b radix -p nova --css-variables --force --yes
```
- Use `-t next` for Next.js projects
- Use `-b radix` for accessible primitives (always)
- Use `-p nova` for modern defaults (Lucide + Geist)
- Use `--css-variables` for theming support

### 1b. Install Core Components
Always install these base components before building pages:
```bash
npx shadcn@latest add \
  button card input label select textarea \
  dialog sheet dropdown-menu command popover \
  table badge tabs separator avatar tooltip \
  sonner --yes
```

### 1c. Fix Common Issues
- `tw-animate-css` import: if build fails with "module not found", use:
  ```css
  @import "../../node_modules/tw-animate-css/dist/tw-animate.css";
  ```
- If using a non-standard PostCSS setup, verify the CSS `@import` paths resolve correctly

### 1d. Verify Build
```bash
pnpm build 2>&1 | tail -20
```
Build MUST pass before proceeding.

---

## 2. Design System Rules

### 2a. One Color System
- **CSS variables** (oklch) for semantic tokens: `--primary`, `--muted`, `--destructive`, etc.
- Tailwind auto-maps these: `bg-primary`, `text-muted-foreground`, `border-destructive`
- **Never** mix multiple color systems (don't add `s-*` hex tokens on top of CSS variables)
- **Never** hardcode hex colors in components — use the design tokens

### 2b. Dark Mode
- Use the `dark` class on `<html>` (already set by shadcn defaults)
- Define both `:root` and `.dark` CSS variable blocks
- All components automatically support dark mode via shadcn tokens

### 2c. Typography
- One font family: `font-sans` (mapped in tailwind.config.js)
- Use weight utilities: `font-medium`, `font-bold`, `font-black`
- Use size utilities: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`
- Avoid arbitrary sizes (`text-[13px]`) — stick to the type scale

---

## 3. Component Architecture

### 3a. File Structure
```
src/
├── components/
│   ├── ui/           ← shadcn primitives (NEVER edit these directly)
│   ├── layout/       ← app shell, sidebar, header, navigation
│   └── [domain]/     ← domain-specific shared components
│       ├── stat-card.tsx
│       ├── status-badge.tsx
│       ├── empty-state.tsx
│       └── data-table.tsx
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   └── (route-groups)/
│       └── page.tsx   ← page components (thin, orchestrate shared components)
├── hooks/            ← custom React hooks
├── lib/              ← utilities, helpers
└── types/            ← TypeScript type definitions
```

### 3b. Component Rules
- **shadcn components**: Use as-is, compose them. Don't fork unless absolutely necessary.
- **Domain components**: Extract when pattern appears 2+ times
- **Page components**: Thin — orchestrate domain components, fetch data, handle routing
- **No inline component definitions** in pages — extract to separate files

### 3c. The "Extract Prompt"
When you see the same UI pattern in 2+ places, immediately create a shared component:
> "This pattern appears in [page A] and [page B]. I'm extracting it to `components/[domain]/[name].tsx`"

---

## 4. AI Coding Agent Workflow

### 4a. Before Delegating to Sub-Agents
1. ✅ Component library installed and building
2. ✅ Shared components extracted for common patterns
3. ✅ Design tokens documented in globals.css
4. ✅ Provide the agent with: file structure, component inventory, design tokens, and page spec
5. ✅ Verify build after agent completes

### 4b. What to Tell Frontend Sub-Agents
Always include in the task:
```
## Available Components (use these — do NOT create inline alternatives)
- Button (src/components/ui/button.tsx) — variants: default, outline, ghost, secondary, destructive, link
- Card (src/components/ui/card.tsx) — CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Dialog (src/components/ui/dialog.tsx) — for modals
- Sheet (src/components/ui/sheet.tsx) — for side panels
- Table (src/components/ui/table.tsx) — TableHeader, TableBody, TableRow, TableHead, TableCell
- Badge (src/components/ui/badge.tsx) — for status labels
- Input (src/components/ui/input.tsx) — text inputs
- Select (src/components/ui/select.tsx) — dropdowns
- Tabs (src/components/ui/tabs.tsx) — TabsList, TabsTrigger, TabsContent
- etc.

## Design Rules
- Use Tailwind utility classes only
- Use CSS variable tokens (bg-primary, text-muted-foreground, border-border)
- Dark mode is always on (class="dark" on html)
- Extract any pattern used 2+ times into a shared component
- Build must pass: pnpm build
```

### 4c. Model Selection for Frontend Tasks
- **Free models** (glm-5-turbo, etc.): OK for simple boilerplate, but produce inconsistent UI
- **Stronger models** (Claude Sonnet, GPT-4o): Use for component extraction, design system work, complex pages
- **Rule**: The more UI composition and design decision involved, the stronger the model needed

---

## 5. What We Learned From the Sourcing Dashboard (Mistakes to Avoid)

### ❌ Mistakes Made
1. **Built pages without a component library** → every page reinvented buttons, tables, modals, cards
2. **Mixed 3 color systems** → HSL variables + s-* hex tokens + void-* tokens in tailwind.config.js
3. **Used free models for design work** → inconsistent spacing, hardcoded colors, duplicate code
4. **No shared components** → 170-line page files with inline everything
5. **Tasks planned but never executed** → T-003 through T-005 were all "todo"

### ✅ What Worked
1. **Good route structure** — Next.js route groups (public/protected/admin)
2. **API routes complete** — all 10 endpoints functional
3. **SQLite database** with proper schema
4. **TypeScript types** well-defined
5. **Build passes** — always verify this

---

## 6. Quick Reference Commands

```bash
# Add a new shadcn component
npx shadcn@latest add [component-name] --yes

# Check what components are installed
ls src/components/ui/

# Verify build
pnpm build 2>&1 | tail -20

# Type check
pnpm typecheck

# Dev server
pnpm dev
```

---

*This document should be read and applied automatically whenever working on a frontend project. Update it as we learn more.*
