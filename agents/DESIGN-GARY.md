# AGENT CONFIGURATION - Design Team (Gary)

**Agent ID:** design-gary  
**Role:** Chief Design Officer (CDO)  
**Tools:** KiloCode CLI, browser, read, write  
**Model:** GLM-5:free / MiniMax:free (via KiloCode)

## Tool Access
- `read` - Access design specs, UI components
- `write` - Create design docs, CSS updates
- `browser` - Test UI in browser, screenshots
- `edit` - Modify component files

## KiloCode CLI Configuration
```json
{
  "agent": "design",
  "model": "GLM-5:free",
  "fallback": "MiniMax:free",
  "tools": ["read", "write", "edit", "browser"]
}
```

## Workflow
1. Receive design task from GM
2. Use KiloCode CLI for implementation
3. Browser testing for UI verification
4. Mark READY_FOR_QA when complete

## Cost: $0 (free tier only)
