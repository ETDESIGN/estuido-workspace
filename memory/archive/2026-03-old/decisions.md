# 🎯 Key Decisions Log

## 2026-02-16: MemoryAgent Architecture Approved

**Decision:** Implement dedicated MemoryAgent for long-term memory persistence

**Rationale:**
- Token limits cause context truncation (currently 219k/1M tokens, 21%)
- Conversation history gets compacted/summarized, losing details
- Sub-agents (CTO, QA) lack full context when spawned
- System crashes cause loss of work state
- No persistent memory across sessions

**Approach:**
- Dedicated MemoryAgent using MiniMax (~$0.01/query)
- QMD vector database for semantic search (local, free)
- Structured memory files (human-readable)
- Auto-indexing of conversations
- Context injection for agent spawns

**Consequences:**
- Reduced token usage (30%+ savings expected)
- Better session continuity
- Faster agent onboarding with context
- Crash recovery capability

---

## 2026-02-16: Agent Roster Established

| Agent | Role | Model | Cost |
|-------|------|-------|------|
| GM (Dereck) | Strategy, delegation | Kimi/Gemini | ~$0.01-1.50 |
| CTO | Implementation | KiloCode (free) | $0 |
| QA | Code review, testing | MiniMax | ~$0.01-0.02 |
| Memory | Context persistence | MiniMax | ~$0.01 |

**Rationale:** Cost optimization while maintaining quality

---

## 2026-02-17: MemoryAgent Deployed to Production

**Decision:** Approved and deployed MemoryAgent system after QA review

**Rationale:**
- CTO implementation complete (Phase 1)
- QA review passed with minor fixes applied
- QMD availability checks added for robustness
- File-based fallback ensures functionality even without QMD
- All acceptance criteria met

**Fixes Applied:**
- Added `isQmdAvailable()` runtime check
- Added `ensureQmdCollection()` auto-initialization
- Added `ensureDirectories()` for safe file operations
- Graceful degradation to file-based search

**Status:** Operational and ready for use

---

## 2026-02-17: Provider Balance Tracking Protocol

**Decision:** Record actual provider balances from screenshots to compare with dashboard estimates

**Rationale:**
- Dashboard estimates may drift from actual provider balances
- Need audit trail for cost accuracy verification
- Catch discrepancies early (leaks, errors, miscounts)

**Process:**
1. User sends Kimi/OpenRouter balance screenshot
2. I record: provider, date, balance, total consumed, total recharged
3. Compare with dashboard estimate for same period
4. Flag discrepancies >10%

**Tracking File:** `memory/balance-audit.md`

---

*Log maintained by MemoryAgent. All significant decisions should be recorded here.*
