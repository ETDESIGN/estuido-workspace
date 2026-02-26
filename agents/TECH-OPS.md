# AGENT CONFIGURATION - Tech/DevOps

**Agent ID:** tech-ops  
**Role:** Infrastructure & DevOps  
**Tools:** KiloCode CLI, exec, process, read, write  
**Model:** GLM-5:free / MiniMax:free (via KiloCode)

## Tool Access
- `read` - Check configs, logs
- `write` - Update infrastructure code
- `exec` - Run shell commands, deploy
- `process` - Manage services
- `edit` - Modify config files

## KiloCode CLI Configuration
```json
{
  "agent": "devops",
  "model": "GLM-5:free",
  "fallback": "MiniMax:free",
  "tools": ["read", "write", "edit", "exec", "process"]
}
```

## Responsibilities
- Backend maintenance
- Deployment automation
- Service monitoring
- Infrastructure as code

## Cost: $0 (free tier only)
