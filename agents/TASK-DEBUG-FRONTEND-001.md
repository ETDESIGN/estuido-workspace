# TASK - Debug Frontend Issues (Token-Efficient)

**Task ID:** TASK-DEBUG-FRONTEND-001  
**Assigned To:** CTO  
**Priority:** P2  
**Token Budget:** MAX 2,000 tokens (be efficient!)  
**Status:** ASSIGNED

---

## Issues to Fix

### 1. Tailwind CDN Warning (Console)
```
cdn.tailwindcss.com should not be used in production. 
To use Tailwind CSS in production, install it as a PostCSS plugin 
or use the Tailwind CLI
```

**Location:** Likely in `index.html`  
**Fix:** This is a dev warning only. For local dev, ignore. For production, use PostCSS.

### 2. Favicon 404
```
:3000/favicon.ico:1 Failed to load resource: 
the server responded with a status of 404
```

**Fix:** Add favicon.ico to public folder or remove the link from index.html

---

## Token-Efficient Approach

**DON'T:**
- ❌ Read entire codebase
- ❌ Rewrite everything
- ❌ Install new dependencies

**DO:**
- ✅ Target only the files causing issues
- ✅ Minimal changes
- ✅ Quick wins only

---

## Files to Check

1. `index.html` — Look for:
   - `<script src="cdn.tailwindcss.com">` 
   - `<link rel="icon"` or favicon reference

2. `public/` folder — Check if favicon.ico exists

---

## Quick Fixes (Choose One)

### Option A: Ignore (Recommended for Dev)
- These are non-blocking warnings
- Tailwind CDN works fine for local dev
- Favicon 404 doesn't break functionality

### Option B: Fix Favicon Only
Add to `index.html` head:
```html
<link rel="icon" href="data:,">
```
Or create empty `public/favicon.ico`

### Option C: Full Fix (If Time Permits)
1. Install Tailwind via npm: `npm install -D tailwindcss`
2. Create `tailwind.config.js`
3. Remove CDN script from index.html
4. Add favicon

---

## Deliverable

**Report in 3 sentences:**
1. What issues found
2. What fix applied (or why ignored)
3. Token count used

**Max 200 tokens for report.**

---

## Example Report

```
Issues: Tailwind CDN warning (dev-only), favicon 404 (cosmetic).
Fix: Added data-uri favicon to index.html. Ignored Tailwind warning (dev env).
Tokens used: 450
```

---

**REMEMBER:** Token budget is 2,000. Stay efficient. Quick wins only.
