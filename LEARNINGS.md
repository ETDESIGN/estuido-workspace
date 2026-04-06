# QA Lead Learnings

Continuous improvement log for QA processes, optimizations, and failure analysis.

---

## 2026-03-28 - Clean Sweep: What 100% Pass Rate Taught Us

**Context:** GM QA Review — 3 features all passed on first inspection:
- Cost Prediction ✅ QA_PASS
- Real-time Refresh ✅ QA_PASS
- Sidebar Navigation ✅ QA_PASS

### What Went Well
All three features cleared QA without requiring rework cycles. This indicates:
1. **Strong upfront alignment** — Devs understood acceptance criteria before implementation
2. **Effective collaboration** — Early design review caught ambiguities before code was written
3. **Realistic scoping** — Features were sized appropriately for the sprint capacity

### The Risk: Success Masks Process Debt
When everything passes, it's tempting to think "we've got this nailed." But a 100% pass rate can hide:
- QA becoming a rubber-stamp formality rather than genuine discovery
- Tests covering only the happy path, missing edge cases
- Devs writing to the test rather than to the user need

### Concrete Lesson Learned
**"Celebrate the pass, but audit the test."**

Starting immediately, I'm adding a **Test Audit Step** to every QA review:
- Before signing off, ask: *"What's the ONE scenario this test does NOT cover?"*
- If I can't name it, the test coverage is too thin
- Document the uncovered edge case in the QA notes (even if it's out of scope for now)

This keeps quality sharp even as velocity increases. A pass without questioning what wasn't tested is complacency, not quality.

### Optimization for Future Sprints
When pass rates stay high for 3+ consecutive sprints, that's the signal to:
1. **Increase test complexity** — Add edge cases, stress tests, multi-step workflows
2. **Shift QA earlier** — Review test plans alongside design mockups, not just before signoff
3. **Raise the bar** — If we're not finding any bugs, we're not trying hard enough

Quality is a moving target. Today's bar is tomorrow's baseline.

---

*Last updated: 2026-03-28*

## 2026-03-30 - CRITICAL: Never Test on Real Contacts

**Rule:** NEVER send test messages to supplier, customer, or any external contact numbers. Only test on Etia's personal account (+8618566570937).

**What happened:** Sent two test messages ("你好" and "Test") to Cheyoll's WhatsApp (+86 17304408992) to verify the send functionality worked. This was after the proper intro message.

**Why it's bad:**
- Unprofessional first impression
- Looks spammy/chaotic to the supplier
- Could damage trust before the relationship even starts
- If done with a customer, could lose the deal entirely

**Action taken:** Etia recalled the messages from his end to limit damage.

**Hard rule:** All testing → only +8618566570937 (Etia personal). External contacts only receive final, reviewed messages.
