# 🧠 MemoryAgent Integration Guide

## Quick Start

### For GM (Main Agent)

```typescript
import { MemoryAgent } from './agents/memory-agent';

// Initialize
const memory = new MemoryAgent();

// On session start - get context
const context = memory.getContextSummary("What was I working on?");
console.log(context);

// During conversation - record messages
memory.recordMessage('user', 'User message here');
memory.recordMessage('assistant', 'Assistant response here');

// Retrieve relevant memories
const results = memory.retrieve("memory system implementation", 5);

// On session end - save summary
memory.summarize('session-id');
```

### For Sub-Agents (CTO, QA)

When spawning agents with context:

```typescript
import { injectContext } from './agents/memory-core';

// Get context for new agent
const result = injectContext('cto-session', 'dashboard implementation');

// Pass context to agent spawn
spawnAgent('cto', {
  context: result.context,
  task: 'TASK-dashboard-batch2'
});
```

---

## Core Functions Reference

### 1. indexConversation(sessionId, messages)
Store conversation chunks to QMD vector database.

```typescript
indexConversation('session-123', [
  { role: 'user', content: 'Hello', timestamp: '2026-02-16T10:00:00Z' },
  { role: 'assistant', content: 'Hi there!', timestamp: '2026-02-16T10:00:05Z' }
]);
```

### 2. retrieveContext(query, limit=5)
Semantic search over all indexed memories.

```typescript
const memories = retrieveContext("token tracking dashboard", 5);
// Returns: [{ content, source, relevance, timestamp }, ...]
```

### 3. summarizeSession(messages)
Create structured summary of conversation.

```typescript
const summary = summarizeSession(messages);
// Returns: { summary, keyPoints, decisions, tasks, participants }
```

### 4. getSessionState()
Read current agent assignments and tasks.

```typescript
const state = getSessionState();
// Returns: { activeAgents, currentTasks, lastUpdate, context }
```

### 5. injectContext(targetSession, query)
Retrieve and format context for a target session.

```typescript
const result = injectContext('target-session', 'What was I working on?');
// Returns: { success, context, sources, relevance }
```

---

## Workflow Integration

### On Session Start

```typescript
const memory = new MemoryAgent();

// 1. Retrieve last context
const state = memory.getState();
console.log(`Active agents: ${state.activeAgents.join(', ')}`);

// 2. Get relevant memories
const context = memory.getContextSummary("What was I working on?");

// 3. Display to user or inject into session
```

### During Conversation

```typescript
// Auto-record messages (every 10 messages, auto-indexes)
memory.recordMessage(role, content);

// Or manual indexing
if (shouldIndex) {
  memory.indexSession('current-session');
}

// Log decisions
memory.logDecision(
  'Use MiniMax for MemoryAgent',
  'Cost optimization - MiniMax is $0.01/query vs Claude at $3/query'
);

// Update tasks
memory.updateTask('TASK-123', 'Implement feature X', 'in_progress');
```

### On Session End

```typescript
// Save session summary
memory.summarize('session-id');

// Update agent state
memory.updateTask('TASK-123', 'Implement feature X', 'completed');

// Index any remaining messages
memory.indexSession('session-id');
```

### Spawning Sub-Agents

```typescript
import { injectContext } from './agents/memory-core';

// Get context for agent
const contextResult = injectContext('new-cto-session', taskDescription);

// Spawn with context
const cto = spawnAgent('cto', {
  context: contextResult.context,
  task: taskId,
  parentSession: currentSessionId
});
```

---

## QMD CLI Commands

```bash
# Search memories
qmd query "memory agent"

# Vector search
qmd vsearch "context persistence"

# List indexed files
qmd ls estudio-memory

# Get specific document
qmd get qmd://estudio-memory/memory/2026-02-16.md

# Update index
qmd update

# Check status
qmd status
```

---

## File Structure

```
memory/
├── YYYY-MM-DD.md              # Daily logs (auto-created)
├── sessions/
│   └── [session-id].md        # Per-session summaries
├── index/                     # QMD index chunks
├── TODO.md                    # Active tasks
├── decisions.md               # Decision log
└── AGENT_STATE.md             # Current agent status

data/qmd/                      # QMD database (auto-managed)
```

---

## Agent Configuration

**File:** `agents/memory.json`

```json
{
  "id": "memory",
  "name": "Memory Manager",
  "model": "openrouter/minimax/minimax-01",
  "cost": "~$0.01 per query"
}
```

---

## Testing

```bash
# Verify structure
cd agents && node -e "require('fs').readdirSync('.').forEach(f => console.log(f))"

# Check QMD status
qmd status

# Test search
qmd query "memory"
```

---

## Cost Breakdown

| Operation | Cost | Notes |
|-----------|------|-------|
| Index to QMD | $0 | Local embeddings (nomic-embed-text) |
| Retrieve context | $0 | Local QMD search |
| Summarize | ~$0.005 | MiniMax for summary generation |
| **Total per session** | **<$0.05** | Estimated |

---

## Troubleshooting

### QMD not found
```bash
# Ensure QMD is installed
qmd status

# If not installed, follow memory/QMD-SETUP.md
```

### No memories retrieved
- Check if QMD collection exists: `qmd ls estudio-memory`
- Verify files are indexed: `qmd update`
- Check index directory: `ls memory/index/`

### TypeScript errors
```bash
# Check for type errors
npx tsc --noEmit agents/memory-core.ts agents/memory-agent.ts
```

---

## Next Steps

1. **Integrate into GM workflow** - Add to session start/end hooks
2. **Test with real conversations** - Index and retrieve actual session data
3. **Tune index interval** - Adjust auto-index frequency based on usage
4. **Monitor costs** - Track actual MiniMax usage
5. **Iterate on retrieval** - Improve query relevance over time

---

*Integration guide for MemoryAgent v1.0*
*Created: 2026-02-16*
