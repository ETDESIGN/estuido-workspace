# CTO ↔ QA Collaboration Workflow System

## Overview

Automated workflow for continuous development, testing, and validation using two specialized agents working in concert.

---

## The Loop System

```
┌──────────┐     Build      ┌──────────┐     Review     ┌──────────┐
│   CTO    │ ──────────────▶ │   QA     │ ──────────────▶ │   GM     │
│  (Dev)   │                 │ (Tester) │                 │(Manager) │
└──────────┘                 └──────────┘                 └──────────┘
     ▲                            │
     │         Fix Issues         │
     └────────────────────────────┘
```

---

## Phase 1: Development (CTO)

### CTO Responsibilities:
1. Read TASK.md for requirements
2. Implement feature using KiloCode CLI (free models)
3. Run `npm run dev` and test locally
4. Update TASK.md with completion notes
5. Submit for QA review by updating status

### CTO Trigger for QA:
```markdown
## Progress Log

### [Timestamp]
✅ Feature Complete: [Name]
- Files modified: [list]
- Tests passing: Yes
- Dev server: Running at http://localhost:5173
- **Status: READY_FOR_QA**
```

---

## Phase 2: Validation (QA)

### QA Responsibilities:
1. Monitor TASK.md for READY_FOR_QA status
2. Pull latest code changes
3. Run full test checklist:
   - TypeScript compilation
   - Dev server startup
   - Functional testing
   - Browser console check
   - Responsive design test
   - Edge cases
   - Performance check
   - Security review
4. Write structured review report
5. Update status: PASS / NEEDS_FIX / BLOCKER

### QA Review Format:
```markdown
## QA Review: [Feature Name]

### Status: [PASS / NEEDS_FIX / BLOCKER]

### Test Results:
- [x] TypeScript compiles
- [x] Dev server runs
- [x] Feature works
- [ ] Edge cases handled (found issue)
- [x] Responsive design
- [x] No console errors

### Issues:
1. [HIGH] Missing null check in `Component.tsx:42`
   - **Fix:** Add optional chaining

### Acceptance Criteria:
- [x] Criterion 1
- [x] Criterion 2  
- [ ] Criterion 3 (needs work)

### Next Steps:
- CTO to fix issue #1, then resubmit
```

---

## Phase 3: Decision Points

### If QA Status = PASS
1. QA forwards to GM
2. GM does final verification (quick check)
3. GM approves or requests minor tweaks
4. Feature marked complete

### If QA Status = NEEDS_FIX
1. QA sends specific feedback to CTO
2. CTO fixes issues (using KiloCode)
3. CTO resubmits
4. QA re-reviews
5. Loop continues until PASS

### If QA Status = BLOCKER
1. QA immediately notifies GM
2. GM evaluates blocker
3. GM decides: abort, redesign, or override

---

## Phase 4: GM Approval

### GM Quick Check:
- [ ] QA report reviewed
- [ ] Quick functional test
- [ ] Acceptance criteria met
- [ ] No obvious issues missed

### GM Actions:
- ✅ **Approve** → Merge to production
- ⚠️ **Request Changes** → Back to CTO
- ❌ **Reject** → Cancel feature

---

## Continuous Mode

When no urgent tasks:

1. **CTO** works on next feature from backlog
2. **QA** continuously reviews completed work
3. **Loop** runs automatically
4. **GM** reviews only PASS items

---

## Agent Configuration

### CTO Agent
- **Model:** KiloCode CLI (free models)
- **Role:** Implementation, coding, debugging
- **Tools:** File edit, terminal, KiloCode
- **Cost:** $0 (uses free tier)

### QA Agent
- **Model:** MiniMax (cheap, good for analysis)
- **Role:** Review, testing, validation
- **Tools:** Read, browser (for testing), exec
- **Cost:** ~$0.01-0.02 per review

### GM (Me)
- **Model:** Kimi K2.5 (for decisions)
- **Role:** Strategy, approval, escalation handling
- **Cost:** Only when actively managing

---

## Task Files Structure

```
agents/
├── TASK-[feature].md          # Active tasks
├── TASK-completed.md          # Archive
├── cto.json / CTO.md          # Dev agent config
├── qa.json / QA.md            # QA agent config
└── WORKFLOW.md                # This file
```

---

## Automation Rules

### Auto-Spawn Rules:
- CTO auto-spawns when new task created
- QA auto-spawns when CTO marks READY_FOR_QA
- Both agents run simultaneously when possible

### State Transitions:
```
TODO → IN_PROGRESS (CTO starts)
IN_PROGRESS → READY_FOR_QA (CTO completes)
READY_FOR_QA → IN_REVIEW (QA starts)
IN_REVIEW → NEEDS_FIX / PASS / BLOCKER (QA decides)
NEEDS_FIX → IN_PROGRESS (CTO fixes)
PASS → PENDING_APPROVAL (GM reviews)
PENDING_APPROVAL → COMPLETE / REJECTED (GM decides)
```

### Communication Protocol:
1. **CTO → QA:** Updates TASK.md with READY_FOR_QA
2. **QA → CTO:** Writes review in TASK.md
3. **QA → GM:** Notifies when PASS or BLOCKER
4. **CTO → QA:** Responds to NEEDS_FIX

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Bugs caught by QA | 90%+ | Bugs found in QA vs production |
| Review iterations | <3 | Average loops per feature |
| CTO→QA handoff time | <5 min | Time from READY_FOR_QA to review start |
| QA review time | <10 min | Time to complete full review |
| GM approval time | <2 min | Time to verify and approve PASS items |

---

## Benefits

1. **Quality** - Two sets of eyes on every feature
2. **Speed** - Parallel processing (CTO builds next while QA reviews)
3. **Cost** - QA uses cheap models, CTO uses free models
4. **Reliability** - Systematic validation prevents bugs
5. **Scalability** - Can add more agents as needed

---

## Implementation Checklist

- [x] Create QA agent config
- [x] Create QA agent persona
- [x] Create workflow documentation
- [ ] Test CTO→QA handoff
- [ ] Verify QA can test and review
- [ ] Test QA→GM escalation
- [ ] Run full loop end-to-end
- [ ] Document any issues
- [ ] Optimize based on results

---

_Last updated: 2026-02-16_  
_Status: Implementation Complete, Ready for Testing_  
_Author: Dereck (GM)_
