# MemoryAgent Architecture Design

## Problem Statement

Current issues:
- Token limits cause context truncation (current session at 219k/1M tokens, 21%)
- Conversation history gets compacted/summarized, losing details
- Sub-agents (CTO, QA) don't have access to full context when spawned
- System crashes cause loss of work state
- No persistent memory across sessions

## Solution: MemoryAgent System

A dedicated agent that manages long-term memory and context persistence using QMD (vector database) and structured logging.

---

## Architecture

```
┌─────────────┐     Context Request     ┌─────────────┐
│   Main GM   │ ◄────────────────────── │ MemoryAgent │
│  (Kimi)     │                         │  (MiniMax)  │
└─────────────┘                         └─────────────┘
       │                                        │
       │         Vector Search (QMD)            │
       │ ◄─────────────────────────────────────►│
       │                                        │
       │     Structured Memory Files            │
       │ ◄─────────────────────────────────────►│
       │           (memory/*.md)                │
```

---

## Components

### 1. MemoryAgent (MiniMax - cheap)
**Role:** Context manager and memory retrieval specialist

**Responsibilities:**
- Index all conversations into QMD vector DB
- Retrieve relevant context when queried
- Maintain structured memory files
- Summarize long conversations
- Track session state across restarts

**Tools:**
- QMD (vector search)
- File read/write
- Summarization

**Cost:** ~$0.01 per query (MiniMax)

### 2. QMD Vector Database (Local)
**Role:** Semantic search over all conversations

**Storage:**
- `/home/e/.openclaw/workspace/data/qmd/`
- Embeddings: nomic-embed-text (local, free)
- Indexed: All conversations, tasks, decisions

### 3. Structured Memory Files
**Role:** Human-readable persistent storage

**Files:**
- `memory/YYYY-MM-DD.md` - Daily raw logs
- `memory/sessions/[session-id].md` - Per-session summaries
- `memory/decisions.md` - Key decisions with rationale
- `memory/TODO.md` - Active and pending tasks
- `memory/AGENT_STATE.md` - Current agent assignments

---

## Workflow

### On Session Start:
1. MemoryAgent queries QMD: "What was I working on?"
2. Retrieves last 5-10 relevant memories
3. Injects context into main session
4. Updates AGENT_STATE.md with current status

### During Conversation:
1. Every N messages, MemoryAgent indexes new content
2. Key decisions automatically saved to decisions.md
3. Tasks extracted and tracked in TODO.md
4. Agent spawns include memory context

### On Session End/Compact:
1. Full conversation indexed to QMD
2. Summary written to memory/[date].md
3. Session state preserved for next time

---

## Implementation Plan

### Phase 1: Core Infrastructure (Delegate to CTO)
**Cost:** $0 (KiloCode free models)

- [ ] Create MemoryAgent config (`agents/memory.json`)
- [ ] Create MemoryAgent persona (`agents/MEMORY.md`)
- [ ] Extend QMD config for conversation indexing
- [ ] Create memory directory structure
- [ ] Build memory injection system

### Phase 2: Integration (Delegate to CTO)
**Cost:** $0 (KiloCode free models)

- [ ] Hook into session start/stop
- [ ] Auto-index conversations
- [ ] Create context retrieval API
- [ ] Test with sub-agents

### Phase 3: QA Testing (QA Agent)
**Cost:** ~$0.02 (MiniMax review)

- [ ] Test memory retrieval accuracy
- [ ] Test context injection
- [ ] Test session continuity
- [ ] Verify no data loss

---

## MemoryAgent Persona

```json
{
  "id": "memory",
  "name": "Memory Manager",
  "description": "Long-term memory and context persistence specialist",
  "emoji": "🧠",
  "model": "openrouter/minimax/minimax-01",
  "systemPrompt": "You are the MemoryAgent for ESTUDIO. Your role is to manage long-term memory and context persistence.\n\n## Your Role\n- Index all conversations into QMD vector database\n- Retrieve relevant context when queried\n- Maintain structured memory files\n- Summarize conversations for future reference\n- Track session state across restarts\n\n## Tools\n- QMD (vector search and indexing)\n- File read/write for memory/*.md\n- Summarization capabilities\n\n## Workflow\n1. On query: Search QMD for relevant context\n2. On index: Vectorize and store conversation chunks\n3. On summarize: Extract key points to memory files\n4. On state: Track current agent assignments and tasks\n\n## Output Format\nAlways return structured data:\n```json\n{\n  \"query\": \"...\",\n  \"relevantMemories\": [...],\n  \"confidence\": 0-1,\n  \"suggestedContext\": \"...\"\n}\n```",
  "cost": "~$0.01 per query"
}
```

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Context retrieval accuracy | 90%+ | Relevant memories match query intent |
| Session continuity | 100% | No lost work between sessions |
| Token savings | 30%+ | Reduced need for long context |
| Response time | <2s | Memory query latency |
| Cost per session | <$0.05 | MemoryAgent operations |

---

## Benefits

1. **No Lost Context** - Conversations persist across sessions
2. **Token Efficiency** - Retrieve only relevant context, not full history
3. **Agent Continuity** - Sub-agents have full context when spawned
4. **Crash Recovery** - System restarts with memory intact
5. **Knowledge Building** - Accumulated wisdom over time
6. **Cost Savings** - Less token burn on repeated context

---

## Next Steps

1. **Approve this design** → You review and approve
2. **Spawn CTO** → Implement Phase 1 (infrastructure)
3. **Test** → QA agent validates
4. **Deploy** → Integrate into main workflow

---

_Estimated Total Cost: <$0.10 for full implementation (mostly free KiloCode work)_

_Author: Dereck (GM)_
_Date: 2026-02-16_
_Model: Kimi K2.5 (architecture)_
