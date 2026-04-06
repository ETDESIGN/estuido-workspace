# Critic Audit — E-Studio Sourcing Dashboard
**Date:** 2026-04-02 05:35 HKT
**Auditor:** Main agent (critic subagent timed out after 360k tokens, no report produced)
**Commit:** 1538aab — KiloCode Stitch rebuild
**Scope:** 10 modified files, +1857/-1242 lines

---

## Executive Summary
KiloCode rebuilt 7 pages to match Stitch designs. Visual quality improved significantly but **3 P0 issues** found: brand inconsistency, dangerous auto-send email API, and duplicate landing pages. Dashboard is functional but needs cleanup before customer-facing use.

## Pillar Scores

| Pillar | Score | Notes |
|--------|-------|-------|
| 🎨 Design & Aesthetics | 7/10 | Good MD3 theme, consistent spacing. Points off for brand inconsistency. |
| 📐 Layout & Information Architecture | 6/10 | Duplicate landing pages (page.tsx + landing/page.tsx). Navigation confusion. |
| 🔄 Data Architecture | 7/10 | Clean Turso DB integration, proper env vars for secrets. |
| ⚙️ Functionality & UX | 6/10 | Works but no loading states, no error boundaries, 1 console.error left. |
| 🏗️ Code Quality | 6/10 | Clean TypeScript but 0 tests, no accessibility (0 alt attrs, 3 aria labels total). |
| 🔒 Security | 5/10 | send-rfq API route is a P0 risk — allows anyone to send RFQ emails from the server. |

## P0 Issues (Ship Blockers)

### 1. 🔴 send-rfq API Route — Unrestricted Email Sending
**File:** `src/app/api/send-rfq/route.ts`
**Problem:** Public API endpoint that sends RFQ emails to ANY address using Resend API. No authentication, no rate limiting, no approval gate. Anyone who hits `/api/send-rfq` with a `to` address can send supplier emails from E-Studio's account.
**Etia explicitly said "don't send email to suppliers"** — this route bypasses that completely.
**Fix:** DELETE this file. Remove entirely.

### 2. 🔴 Brand Inconsistency
**Problem:** Three different brand names across the app:
- "Midnight Architect" — login.tsx (2 places), dashboard.tsx (1 place)
- "E-Studio" — page.tsx, landing/page.tsx, register.tsx, app-shell.tsx, layout.tsx, config.ts
- Should be: "O Source" (Etia confirmed)
**Files:** src/app/login/page.tsx:49,91,102,229; src/app/dashboard/page.tsx:102; src/app/page.tsx; src/app/(public)/landing/page.tsx; src/app/register/page.tsx; src/components/layout/app-shell.tsx; src/lib/config.ts; src/app/layout.tsx
**Fix:** Replace ALL with "O Source"

### 3. 🔒 Duplicate Landing Pages
**Problem:** Two separate landing pages exist:
- `src/app/page.tsx` — original landing (200 lines)
- `src/app/(public)/landing/page.tsx` — new KiloCode landing (200 lines)
Both have nearly identical content. The `(public)/landing` route creates `/landing` which is a second URL for the same content.
**Fix:** Delete one. Keep `page.tsx` as the canonical root landing, delete `src/app/(public)/landing/`.

## P1 Issues (Should Fix)

### 4. 🟠 Copyright Year Wrong
**File:** src/app/login/page.tsx:91,229
**Problem:** `© 2024 Midnight Architect Sourcing` → should be `© 2026 O Source`

### 5. 🟠 Zero Accessibility
**Problem:** 0 alt attributes on images, only 3 aria-labels across entire app. No skip links, no focus management.
**Fix:** Add alt attrs to all images, aria-labels to interactive elements.

### 6. 🟠 Console.error Left in Production
**File:** src/app/dashboard/page.tsx:60
**Problem:** `console.error('Dashboard fetch error:', err);` — should use proper error reporting or remove.

### 7. 🟠 Duplicate Feature Cards (Code Duplication)
**File:** src/app/login/page.tsx:59-92
**Problem:** KiloCode unrolled the `.map()` loop into 3 separate JSX blocks. Previously was a clean `.map()` over an array. Now it's copy-paste — harder to maintain.

## P2 Issues (Nice to Have)

### 8. 🟡 No Loading States
No skeleton screens or loading indicators on any page.

### 9. 🟡 No Error Boundaries
No React error boundaries — if a component crashes, whole page goes white.

### 10. 🟡 No Tests
Zero test files. Need at least: API route tests, page render tests.

### 11. 🟡 Static Brand in Config
**File:** src/lib/config.ts:2
`export const APP_NAME = 'E-Studio Sourcing Dashboard';` → should be `O Source`

## What's Done Well
- ✅ Clean MD3 color palette with consistent `s-*` token system
- ✅ Proper env var usage for secrets (Turso, SESSION_SECRET)
- ✅ Good responsive design patterns
- ✅ Material Symbols Outlined integration
- ✅ Glass-effect utility class
- ✅ Proper authentication middleware
- ✅ Clean TypeScript throughout
- ✅ Turso DB client properly initialized with error handling

## Prioritized Fix Plan

| Priority | Issue | Effort | Action |
|----------|-------|--------|--------|
| P0 | Delete send-rfq route | 2 min | Delete src/app/api/send-rfq/route.ts |
| P0 | Brand "O Source" everywhere | 5 min | Find/replace all brand names |
| P0 | Remove duplicate landing | 2 min | Delete src/app/(public)/landing/ |
| P1 | Fix copyright year | 1 min | 2024 → 2026 |
| P1 | Remove console.error | 1 min | Delete or replace |
| P1 | Accessibility basics | 30 min | Add alt attrs, aria-labels |
| P2 | Loading states | 2 hrs | Add skeletons |
| P2 | Error boundaries | 1 hr | Add React error boundaries |
| P2 | Test suite | 4 hrs | API + page tests |
