# O Source Dashboard — Rebuild Action Plan
**Synthesized from CTO + Critic brainstorm — 2026-04-02 06:20 HKT**

---

## 0. Diagnosis (Both Experts Agree)

### The Core Problem: Two Competing Design Systems
| System | Mechanism | Status |
|--------|-----------|--------|
| Old (KiloCode v1) | CSS custom properties → `hsl(var(--primary))`, void-* colors | ❌ Kill |
| New (Stitch/MD3) | Tailwind `s-*` tokens → hex values | ✅ Keep |

Every page mixes both systems. Dashboard uses `bg-[#131b2e]` (raw hex), `bg-s-surface-low` (correct), `text-slate-50` (wrong), and `bg-blue-100` (light-mode status). This is the root cause of "AI slop."

### Other Critical Problems
1. **Dual navigation** — AppShell provides top-nav header. Dashboard/requests pages each build their OWN sidebar. Three navigation patterns across 4 pages.
2. **globals.css bloat** — 284 lines, ~200 lines of dead CSS variable system (`.void-panel`, `.btn-glow`, `.gradient-text-animated`)
3. **Status colors are light-mode** — `bg-blue-100 text-blue-800` invisible on dark background
4. **Dead code** — theme-selector, theme-background, themes.ts, design-tokens.ts, zustand store, @google/stitch-sdk, reactflow, reagraph
5. **Duplicated sidebars** — dashboard/page.tsx and requests/page.tsx each have ~60 lines of identical sidebar JSX
6. **Silent error handling** — `catch (err) {}` swallows errors, user sees spinner forever
7. **Dead UI elements** — "Forgot password?" does nothing, social login buttons do nothing, "Remember me" not sent to API

### What's Actually Good (KEEP)
| Asset | Status |
|-------|--------|
| `src/types/index.ts` | ✅ Clean TypeScript, fix status colors only |
| `src/lib/sourcing-db.ts` | ✅ Solid Turso DB layer |
| `src/lib/*.ts` (auth, middleware, session, csrf, validation, rate-limit, csp) | ✅ Security infra works |
| `src/app/api/**/*` | ✅ All API routes functional |
| `src/app/login/page.tsx` | ✅ Already matches Stitch, minor cleanup |
| `src/app/layout.tsx` | ✅ Clean root layout |
| `tailwind.config.js` | ✅ s-* tokens correctly defined |

---

## 1. Architecture Decisions

### 1.1 Layout: Sidebar on Desktop, Bottom Tabs on Mobile
**Decision:** Adopt the Stitch sidebar layout. Rewrite AppShell as `DashboardShell` with:
- Desktop: `w-64` left sidebar (from Stitch reference)
- Mobile: Bottom tab bar (keep current, remove hamburger duplicate)
- Content: `<main className="lg:ml-64">` with `max-w-7xl` inner container

### 1.2 Color: `s-*` Tokens ONLY
**Decision:** Purge ALL CSS custom properties from globals.css. Use exclusively `s-*` Tailwind classes. Zero raw hex in component code.

### 1.3 Route Groups
```
src/app/(public)/layout.tsx       → Full-screen, no chrome
src/app/(public)/login/page.tsx
src/app/(public)/register/page.tsx
src/app/(public)/page.tsx (landing)

src/app/(protected)/layout.tsx    → DashboardShell with sidebar
src/app/(protected)/dashboard/page.tsx
src/app/(protected)/requests/page.tsx
src/app/(protected)/requests/[id]/page.tsx
src/app/(protected)/requests/new/page.tsx
src/app/(protected)/profile/page.tsx
src/app/(protected)/admin/page.tsx
```

### 1.4 Component Library
Build minimal, purpose-built components (not shadcn):
- `StatusBadge` — dark-mode status colors
- `StatCard` — dashboard stat with icon
- `DataTable` — requests list
- `EmptyState` — illustrated empty lists
- `PageHeader` — title + description + action

---

## 2. Phased Build Plan

### Phase 0: Foundation Cleanup (1-2 tasks)
**Goal:** Clean slate for rebuild
| # | Task | Model |
|---|------|-------|
| 0a | Purge globals.css — delete old CSS variable system, keep only `.glass-effect`, `.grid-overlay`, `.no-scrollbar`, `.animate-shimmer`, `.fade-in`, scrollbar styles | minimax-m2.5:free |
| 0b | Fix `REQUEST_STATUS_COLORS` in types/index.ts — light → dark theme colors | minimax-m2.5:free |
| 0c | Delete dead files: theme-selector.tsx, theme-background.tsx, themes.ts, design-tokens.ts, store/index.ts | manual |
| 0d | Remove unused deps from package.json (reactflow, reagraph, @xyflow/react, zustand, recharts, @google/stitch-sdk, next-intl) | manual |

**Quality Gate:** `grep -rn '#[0-9a-fA-F]\{6\}' src/app/globals.css` returns 0 (old color vars gone). Build succeeds.

### Phase 1: App Shell + Layout (2-3 tasks)
**Goal:** Single navigation system for all pages
| # | Task | Model | Stitch Ref |
|---|------|-------|------------|
| 1a | Create `DashboardShell` component — sidebar (desktop) + bottom tabs (mobile). Read Stitch customer_dashboard reference for sidebar structure | minimax-m2.5:free | customer_dashboard |
| 1b | Create route groups: `(public)/layout.tsx` (no chrome) + `(protected)/layout.tsx` (DashboardShell) | minimax-m2.5:free | — |
| 1c | Delete old `app-shell.tsx`, move login/register/landing to `(public)/` | minimax-m2.5:free | — |

**Quality Gate:** All protected pages render inside sidebar layout. No duplicate navigation. Mobile shows bottom tabs only. Build succeeds.

### Phase 2: Core Pages (4-5 tasks)
**Goal:** Rebuild the main user-facing pages with Stitch fidelity
| # | Task | Model | Stitch Ref |
|---|------|-------|------------|
| 2a | Rebuild login page — already mostly done, minor cleanup (remove dead links, font-['Inter'] cleanup) | xiaomi-mimo-v2-pro:free | login_page |
| 2b | Rebuild register page — match login's split layout, Stitch profile_settings for form patterns | xiaomi-mimo-v2-pro:free | login_page + profile_settings |
| 2c | Rebuild dashboard page — stat cards, recent requests, quick actions. NO sidebar (DashboardShell provides it) | minimax-m2.5:free | customer_dashboard |
| 2d | Rebuild requests list page — filters, table/cards, pagination. NO sidebar (DashboardShell) | minimax-m2.5:free | customer_dashboard (list section) |
| 2e | Rebuild landing page — hero, features, CTA, footer | minimax-m2.5:free | landing_page |

**Quality Gate per page:**
- [ ] Uses s-* tokens only (no raw hex)
- [ ] Matches Stitch layout structure
- [ ] Has loading skeleton
- [ ] Has error state
- [ ] Has empty state (lists)
- [ ] Hover/focus states on all interactive elements
- [ ] Responsive at 375px, 768px, 1440px
- [ ] Build succeeds

### Phase 3: Feature Pages (3-4 tasks)
**Goal:** Build missing complex pages
| # | Task | Model | Stitch Ref |
|---|------|-------|------------|
| 3a | Build request detail page — full request info, quotes table, activity timeline, status management | minimax-m2.5:free | request_detail_page |
| 3b | Build new request wizard — multi-step form with product specs, quantity, target price | minimax-m2.5:free | new_request_wizard |
| 3c | Build quote comparison page — side-by-side supplier quotes, pricing analysis | minimax-m2.5:free | quote_comparison_page |
| 3d | Rebuild profile page — settings, notification prefs, account management | xiaomi-mimo-v2-pro:free | profile_settings_page |

**Quality Gate:** Same as Phase 2 + API integration works with real data.

### Phase 4: Polish + QA (2-3 tasks)
**Goal:** Production-ready quality
| # | Task | Model |
|---|------|-------|
| 4a | Animations polish — page transitions, stagger reveals, micro-interactions | minimax-m2.5:free |
| 4b | Accessibility audit — focus rings, aria labels, keyboard navigation, screen reader test | xiaomi-mimo-v2-pro:free |
| 4c | Cross-browser test — Chrome, Safari, Firefox. Mobile Safari fix. | manual |
| 4d | Performance — Lighthouse audit, bundle analysis, lazy loading | manual |

**Quality Gate:** Lighthouse score > 90 all categories. Zero axe accessibility violations.

---

## 3. KiloCode Prompt Strategy

### Prompt Template (EVERY task)
```
Read these files first:
1. ~/sourcing-dashboard/AGENTS.md — design tokens and coding standards
2. ~/sourcing-dashboard/.kilo/skills/frontend-design.md — layout patterns and quality rules
3. [STITCH REFERENCE PATH] — the visual target

Task: [SPECIFIC, SINGLE-RESPONSIBILITY DESCRIPTION]

Requirements:
- Use ONLY s-* Tailwind color tokens (never raw hex)
- Use Material Symbols Outlined for icons
- Inter font (already set globally, don't re-declare)
- Match the Stitch reference layout exactly
- Include loading skeleton state
- Include error state for any fetch() calls
- Component max 200 lines — split if bigger
```

### Model Selection
| Task Type | Model | Why |
|-----------|-------|-----|
| CSS/layout cleanup | minimax-m2.5:free | Strong code editing |
| Complex page rebuild | minimax-m2.5:free | Best free model, handles complex JSX |
| Form-heavy pages | xiaomi-mimo-v2-pro:free | Good at form patterns |
| Simple cleanup | xiaomi-mimo-v2-pro:free | Fast, cheap |
| QA review | xiaomi-mimo-v2-pro:free | Good analysis |

### Anti-Rules for KiloCode
These MUST appear in every prompt:
- "Do NOT use `bg-[#hex]` or `text-[#hex]` — use s-* tokens only"
- "Do NOT unroll .map() into repeated JSX blocks"
- "Do NOT leave console.log or console.error in the code"
- "Do NOT import or use the old design system (bg-primary, text-foreground, etc.)"
- "Do NOT build a sidebar — DashboardShell provides it"

---

## 4. Quality Gates (Enforced Per Phase)

### Automated Checks (run after EVERY KiloCode task)
```bash
# 1. Build check
cd ~/sourcing-dashboard && npx next build

# 2. Raw hex check (MUST be 0)
grep -rn 'bg-\[#\|text-\[#\|border-\[#' src/app/ src/components/ | grep -v node_modules | wc -l

# 3. Console statement check (MUST be 0)
grep -rn 'console\.\(log\|error\|warn\)' src/app/ src/components/ | wc -l

# 4. Old design system check (MUST be 0 in new code)
grep -rn 'bg-primary\b\|text-foreground\b\|bg-background\b' src/app/ src/components/ | grep -v node_modules | wc -l

# 5. Component size check (none > 200 lines)
find src/components src/app -name "*.tsx" -exec wc -l {} + | sort -rn | head -10
```

### Manual Review Checklist
- [ ] Stitch reference layout matched?
- [ ] Loading states present?
- [ ] Error states present?
- [ ] Empty states present?
- [ ] Hover/focus/disabled states on all interactive elements?
- [ ] Responsive at mobile/tablet/desktop?
- [ ] No dead UI elements (links/buttons that do nothing)?

---

## 5. Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| KiloCode ignores design tokens | High | High | Include anti-rules in every prompt + automated grep check |
| KiloCode rebuilds sidebar in pages | High | Medium | "Do NOT build sidebar" in every prompt + grep for `<aside` |
| Free models produce verbose code | Medium | Medium | 200-line component limit + automated size check |
| Route group migration breaks auth | Medium | High | Test login flow after Phase 1 |
| Stitch refs don't cover edge cases | Medium | Medium | CTO fills gaps with design skill patterns |
| Build breaks during migration | Medium | High | Build check after every single task |
| globals.css purge breaks something | Low | High | Keep `.glass-effect`, `.grid-overlay`, animations |

---

## 6. Estimated Scope

| Phase | Tasks | Est. KiloCode Runs | Files Changed |
|-------|-------|-------------------|---------------|
| Phase 0 | 4 | 2-3 | ~5 files |
| Phase 1 | 3 | 3-4 | ~8 files |
| Phase 2 | 5 | 5-7 | ~12 files |
| Phase 3 | 4 | 4-6 | ~8 files |
| Phase 4 | 4 | 1-2 + manual | ~10 files |
| **Total** | **20** | **15-22** | **~43 files** |

---

## 7. Approval Required

Before executing, Etia needs to confirm:
- [x] Layout decision: Sidebar on desktop, bottom tabs on mobile
- [x] Kill the old design system entirely (CSS variables, void-* colors)
- [x] Delete dead code (theme-selector, unused deps)
- [x] Build order: Foundation → Shell → Core Pages → Feature Pages → Polish
- [ ] **Which phase to start with?** (Recommendation: Phase 0+1 together)
