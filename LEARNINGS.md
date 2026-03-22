# Agent Learnings - ESTUDIO

**Last Updated:** 2026-03-21

---

## GM (Dereck) Learnings

### 2026-03-21: QA Subagent Tool Access Limits

**Issue:** QA subagents spawned at depth >1 lack file/exec access
- First QA review (09:05): Hit tool limits, couldn't verify implementation
- Second QA review (12:15): Same issue, no output

**Root Cause:** Subagent mode with `capabilities=none` at depth 2-3
- Available: sessions_list, sessions_history, sessions_send, sessions_spawn
- Missing: exec (shell), read (file system), write

**Solution Applied:** GM performed manual verification
- Read code files directly
- Ran TypeScript compilation check
- Verified dev server status
- Generated QA reports directly

**Result:** Both tasks approved (Sidebar + Real-time, Feature 4)

**Learning:**
- ✅ For code reviews requiring file access, use main session or GM
- ✅ Subagent QA best for: documentation review, API testing, workflow validation
- ✅ Complex QA tasks: Execute directly rather than delegate to depth-limited subagents

**Process Change:**
- Updated workflow: GM now performs manual QA for complex tasks
- Faster execution (30 min vs 60+ min)
- Better quality control

---

### 2026-03-21: TypeScript Verification Critical

**Finding:** CTO marked Feature 4 complete but had 5 TypeScript errors
- Missing dependencies: framer-motion, radix-ui packages
- Type errors in 3 files (untyped parameters)

**Impact:** HTTP 500 error, server couldn't compile

**Solution:** GM fixed all issues
- Installed missing dependencies
- Added type annotations to all untyped parameters
- Verified 0 compilation errors

**Learning:**
- ✅ **Always** run `npx tsc --noEmit` before marking task complete
- ✅ Add to CTO checklist: "Verify TypeScript compilation"
- ✅ QA checklist must include: "No TypeScript errors"

**Prevention:** Update CTO.md task completion checklist

---

### 2026-03-21: GM Execution vs Subagent Delegation

**Observation:** Direct execution faster than subagent delegation for fixes
- GM executed both fixes: ~30 minutes total
- Subagent would have taken: 45-60 min + potential tool issues

**When to Delegate:**
- ✅ Complex feature implementation (CTO with KiloCode)
- ✅ Long-running tasks (>1 hour)
- ✅ Parallel work needed

**When to Execute Directly:**
- ✅ Quick fixes (<30 min)
- ✅ Dependency installation
- ✅ Type error fixes
- ✅ QA verification requiring file access

**Learning:** Match task complexity to delegation depth

---

## CTO Learnings

### 2026-03-21: Task Completion Verification

**Issue:** Feature 4 marked READY_FOR_QA but had compilation errors
- Missing dependencies not installed
- TypeScript type errors present

**Root Cause:** Incomplete verification checklist
- Dev server not tested
- TypeScript compilation not checked

**Prevention:**
1. Run `npx tsc --noEmit` - must show 0 errors
2. Start dev server and verify accessible
3. Test core functionality in browser
4. Then mark READY_FOR_QA

**Learning:** Complete verification before QA handoff

---

## QA Learnings

### 2026-03-21: Tool Access Awareness

**Issue:** QA subagent couldn't complete file-based reviews
- No read access to source files
- No exec access to run commands

**Workaround:** GM performed manual verification

**Learning:**
- ✅ QA requires file/exec access for code reviews
- ✅ Subagent mode limited to session management
- ✅ Plan reviews based on available tools

**Best Practice:** Clarify tool requirements before spawning QA

---

## System Learnings

### Dashboard Development Velocity

**Completed Today:**
- Sidebar + Real-time Updates: QA PASS
- Feature 4 (Data Visualization): QA PASS

**Time:** GM verification ~30 min for both

**Quality:** Both tasks production-ready

**Learning:** Current workflow efficient when GM handles complex QA

---

### Free Tier Strategy

**Current Mode:** ULTRA LOW COST (GLM-4.7)

**Usage Today:**
- Model: GLM-4.7 (zai/glm-4.7)
- Session context: ~90K tokens
- Subagent sessions: 2 (CTO, 2 QA)

**Cost:** Well within $5/day threshold

**Recommendation:** Use GLM-5/KiloCode for Feature 5 tomorrow to maximize free tier

---

*Maintained by GM (Dereck)*
*Updated: 2026-03-21 18:00*
