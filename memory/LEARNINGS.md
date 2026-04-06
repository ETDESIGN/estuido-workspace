# Learnings Log

Continuous improvement through reflection and adaptation.

---

## 2026-03-28 — Re-engagement Pattern After Idle Periods

**Context:**
- Returned from 6-day idle period
- Completed 3 features in single day (Cost Prediction, Real-time Refresh, Sidebar Navigation)
- All features passed GM QA review on first attempt

**What Went Well:**
- Quick re-engagement: delivered immediately upon return
- Timeboxing effectiveness: Cost Prediction completed in 5-minute timebox
- Clear scoping: Sidebar Navigation assigned with 3-hour timebox
- Quality maintained: 100% QA pass rate despite break

**What Could Be Improved:**
- No proactive communication during 6-day idle gap
- No handoff or status update before going idle
- Reactive rather than proactive engagement

**Lesson Learned:**
> **"Quick-Sprint Recovery" Pattern:** After any idle period >2 days, lead with a small, well-defined task (5-15 min timebox) to rebuild momentum before tackling larger features. The quick win re-establishes flow and confidence. However, idle periods should include proactive status updates or handoff notes to prevent team uncertainty.

**Action Items:**
- Before any planned idle period >1 day: post status update with expected return
- Upon return: start with smallest available task to rebuild velocity
- Maintain communication rhythm even during low-activity periods

**Tags:** #reactivation #timeboxing #communication #qa-quality

---

---

## 2026-03-31 — Coordinator Role & KiloCode Integration

**Context:**
- Lost 8 hours due to subagent spawn failures + getting sidetracked
- Coded entire dashboard directly instead of using dev team (wrong approach)
- Hit rate limit from excessive token usage
- Etia gave clear corrective feedback multiple times

**What Went Wrong:**
- Tried to code directly instead of delegating to dev team
- Assumed subagent timeout = total failure (was wrong — they had produced files)
- Got sidetracked with quotation files during a priority sprint
- Didn't know about KiloCode CLI for free coding

**What Went Right:**
- Quickly researched and configured KiloCode integration
- Consolidated memory and did retrospective when asked
- Verified all free models work ($0 coding cost)
- Created proper documentation (RETROSPECTIVE, RULES, BUSINESS_CONTEXT)

**Lesson Learned:**
> **"Coordinator, Not Coder" Pattern:** My value is in planning, delegating, monitoring, and merging — not in writing code. All coding should go through KiloCode CLI with free models. The dev team exists for a reason. Trust the system.

**Action Items:**
- Always use dev team for implementation tasks
- Use `kilo run` for any code changes
- Check subagent output before assuming failure
- Keep focused on priority task until done
- Deploy customer-facing apps to Vercel, not localhost

**Tags:** #coordination #kilocode #cost-optimization #dev-team

---

## 2026-03-31 — Subagent Timeout ≠ Failure

**Context:**
- Spawned 4 subagents (CTO, frontend-coder, backend-coder, QA)
- All "timed out" after 10 min
- Assumed total failure, redid everything myself

**What Actually Happened:**
- CTO created config.py and state.py before timeout
- Frontend-coder completed successfully (component library, 8 files)
- Backend-coder created planning.py, lifecycle.py, timeline.py before timeout
- QA burned 103k tokens but may have written test files

**Lesson Learned:**
> **"Timeout Check" Pattern:** When a subagent times out, immediately run `find /project -newer /reference_file -type f` to see what was actually written. Most timeouts are just time limits, not total failures. Always check before redoing work.

**Tags:** #subagents #timeout #efficiency
