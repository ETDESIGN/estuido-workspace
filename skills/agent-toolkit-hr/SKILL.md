---
name: agent-toolkit-hr
description: Monitoring and coordination toolkit for HR/COO agents (Warren). Use for task supervision, resource allocation, and process monitoring.
---

# HR/COO Agent Toolkit

**Role:** Operations Manager  
**Access Level:** Monitoring + Coordination

## Granted Tools

| Tool | Purpose | Token Cost |
|------|---------|------------|
| read | Read files, check status | Low |
| sessions_list | Monitor all agents | Low |
| cron | Schedule checks | Low |
| exec | Run monitoring scripts | Low |

## Usage Pattern

```typescript
// Spawn HR for monitoring
sessions_spawn({
  task: "Check agent health",
  agentId: "warren-coo",
  tools: ["read", "sessions_list", "cron", "exec"]
})
```

## HR Responsibilities

1. **Task Pipeline Monitoring**
   - Check for stuck tasks
   - Monitor token budgets
   - Escalate overruns

2. **Agent Health Checks**
   - Sessions list for active agents
   - Cron for periodic checks
   - Alert on failures

3. **Resource Allocation**
   - Diagnose tool requests
   - Track token usage
   - Optimize workflows

4. **Process Compliance**
   - Verify ARCH checkpoints
   - Check QA reviews
   - Audit token efficiency

## Reports

**Weekly:** `reports/agent-efficiency.md`  
**Monthly:** `reports/resource-allocation.md`  
**On-demand:** Task pipeline status

---

**Pre-approved by:** GM  
**Self-monitoring:** Enabled  
**Audit level:** Full
