---
name: agent-toolkit-qa
description: Read-only audit toolkit for QA agents. Use for code review, testing, and validation tasks.
---

# QA Agent Toolkit

**Role:** Quality Assurance  
**Access Level:** Read-Only (Audit)

## Granted Tools

| Tool | Purpose | Token Cost |
|------|---------|------------|
| read | Read files, analyze code | Low |
| browser | Test web interfaces | Medium |
| sessions_list | Query agent sessions | Low |

## Explicitly NOT Granted

- write/edit (can't modify code)
- exec (can't run commands)
- process (can't kill processes)
- sessions_spawn (can't spawn agents)

## Usage Pattern

```typescript
// Spawn QA with read-only toolkit
sessions_spawn({
  task: "Review TASK-XXX",
  agentId: "qa",
  tools: ["read", "browser", "sessions_list"]
})
```

## QA Process

1. Read TASK.md and code
2. Analyze against acceptance criteria
3. Test via browser (if applicable)
4. Write report: PASS / NEEDS_FIX / BLOCKER
5. **Never write code**

## Report Format

```markdown
## QA Review: [TASK-ID]

**Status:** PASS / NEEDS_FIX / BLOCKER  
**Tokens Used:** XXX  

### Findings
- [ ] Criteria 1: [Pass/Fail]
- [ ] Criteria 2: [Pass/Fail]

### Issues Found
[Details if NEEDS_FIX or BLOCKER]

### Recommendations
[Improvements, even if PASS]
```

---

## Model Fallback Strategy

The QA agent uses a **zero-cost fallback chain** for reliable code review:

| Priority | Model | Provider | Status |
|----------|-------|----------|--------|
| 1 | MiniMax | OpenRouter | Primary (FREE) |
| 2 | Llama 3.3 70B | Groq | Fallback (FREE) |

### How Fallback Works

1. **Primary attempt:** MiniMax via OpenRouter
2. **If 5xx/timeout/rate-limit:** Automatic retry with Llama via Groq
3. **If all fail:** Escalate to GM

All fallbacks are logged to console for monitoring.

### Configuration

```json
{
  "model": "openrouter/minimax/minimax-01",
  "fallbackModels": ["openrouter/groq/llama-3.3-70b-versatile"]
}
```

---

**Pre-approved by:** GM  
**HR tracking:** Enabled  
**Audit level:** Full
