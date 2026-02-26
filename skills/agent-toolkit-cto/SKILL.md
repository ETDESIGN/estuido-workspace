---
name: agent-toolkit-cto
description: Full tool access for CTO (Lead Developer) agents. Use when spawning CTO for coding, architecture, or DevOps tasks.
---

# CTO Agent Toolkit

**Role:** Lead Developer  
**Access Level:** Full (with accountability)

## Granted Tools

| Tool | Purpose | Token Cost |
|------|---------|------------|
| read | Read files, analyze code | Low |
| write | Create new files | Low |
| edit | Modify existing files | Low |
| exec | Run shell commands | Medium |
| sessions_list | Query OpenClaw sessions | Low |
| sessions_spawn | Spawn sub-agents | High |
| process | Manage processes | Medium |
| browser | Web automation | Medium |

## Usage Pattern

```typescript
// Spawn CTO with full toolkit
sessions_spawn({
  task: "Implement feature X",
  agentId: "cto",
  tools: ["read", "write", "edit", "exec", "sessions_list", "sessions_spawn", "process", "browser"]
})
```

## Constraints

1. **Token Budget:** Check TASK.md for limit
2. **Time Limit:** 2-4 hours per task
3. **Report:** Must report token usage in READY_FOR_QA
4. **Escalation:** Architecture decisions → GM

## When to Use This Toolkit

✅ Building features  
✅ Refactoring code  
✅ DevOps/automation  
✅ Debugging  
✅ Architecture review

## When NOT to Use

❌ Production deploy (GM only)  
❌ Security-sensitive changes (escalate)  
❌ Cross-project changes (GM approval)

---

**Pre-approved by:** GM  
**HR tracking:** Enabled  
**Audit level:** Full
