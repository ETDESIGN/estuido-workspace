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
| write | Write QA reports to files | Low |
| edit | NOT GRANTED - can't modify code | N/A |
| exec | Execute shell commands (npm test, dev server) | Medium |
| browser | Test web interfaces | Medium |
| sessions_list | Query agent sessions | Low |
| process | Kill stuck processes | Low |

## Constraints

- **NO code editing** - QA reviews but doesn't write implementation code
- **Report writing OK** - Can create QA reports
- **Shell execution OK** - Can run tests, dev servers, type checks
- **Browser testing OK** - Can verify web interfaces

## Usage Pattern

```typescript
// Spawn QA with testing toolkit (UPDATED 2026-03-21)
sessions_spawn({
  task: "Review TASK-XXX",
  agentId: "qa",
  tools: ["read", "write", "exec", "browser", "sessions_list", "process"]
})
```

**Tool Access Summary:**
- ✅ read (code review)
- ✅ write (create QA reports)
- ✅ exec (run tests, dev servers, npm commands)
- ✅ browser (web interface testing)
- ✅ sessions_list (check other agents)
- ✅ process (kill stuck processes if needed)
- ❌ edit (cannot modify implementation code)

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
