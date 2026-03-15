# OpenClaw Multi-Agent System Implementation Report
**Research Date:** March 14, 2026  
**Objective:** Build robust, stable, consistent, and efficient agentic system on OpenClaw

---

## Executive Summary

Based on latest research (sources from 1-4 days ago), OpenClaw 2026.2.17+ introduces **deterministic sub-agent spawning** and **structured inter-agent communication**. This report outlines the proven architecture for deploying a complete skilled agent team.

---

## Part 1: Core Architecture Patterns

### 1.1 Multi-Agent Team Structure (Production-Ready)

```
Orchestrator (Dereck/GM)
├── sessions_send → CTO Agent (Coder/Developer)
│   ├── sessions_spawn → coding subagents
│   └── Tools: write, edit, exec, process, browser
├── sessions_send → QA Agent (Reviewer/Tester)
│   ├── sessions_spawn → testing subagents
│   └── Tools: read, browser, sessions_list
├── sessions_send → Warren/HR Agent (Operations)
│   └── Tools: read, sessions_list, cron, exec
└── sessions_send → Researcher Agent (Optional)
    └── Tools: web_search, web_fetch, browser
```

### 1.2 Session Key Convention (Critical)

OpenClaw uses deterministic session keys:
- Main agents: `agent:<agentId>:main`
- Sub-agents: `agent:<agentId>:subagent:<uuid>`
- Channel-specific: `agent:<agentId>:<channel>:group:<id>`

**Communication Pattern:**
```javascript
// Fire-and-forget (async)
sessions_send({
  sessionKey: "agent:cto:main",
  message: "Task assignment",
  timeoutSeconds: 0  // Don't wait for response
})

// Synchronous (wait for completion)
sessions_spawn({
  agentId: "cto",
  task: "Implement feature",
  mode: "run",
  timeoutSeconds: 300
})
```

---

## Part 2: Agent Configuration (openclaw.json)

### 2.1 Recommended Agent List

```json
{
  "agents": {
    "defaults": {
      "workspace": "~/.openclaw/workspace",
      "model": "groq/llama-3.3-70b-versatile",
      "maxConcurrent": 3
    },
    "list": [
      {
        "id": "main",
        "default": true,
        "subagents": {
          "allowAgents": ["cto", "qa", "warren"]
        }
      },
      {
        "id": "cto",
        "workspace": "~/.openclaw/workspace-cto",
        "description": "Lead Developer - coding and architecture",
        "tools": {
          "fs": "read-write",
          "exec": "allow",
          "process": "allow",
          "browser": "allow"
        }
      },
      {
        "id": "qa",
        "workspace": "~/.openclaw/workspace-qa",
        "description": "QA Engineer - testing and validation",
        "tools": {
          "fs": "read-only",
          "browser": "allow",
          "sessions_list": "allow"
        }
      },
      {
        "id": "warren",
        "workspace": "~/.openclaw/workspace-ops",
        "description": "Operations - monitoring and coordination",
        "tools": {
          "cron": "allow",
          "exec": "allow",
          "sessions_list": "allow"
        }
      }
    ]
  },
  "tools": {
    "sessions": {
      "visibility": "all"  // Critical for cross-agent communication
    },
    "agentToAgent": {
      "enabled": true,
      "allow": ["main", "cto", "qa", "warren"]
    }
  },
  "bindings": [
    {
      "agentId": "main",
      "match": {
        "channel": "webchat"
      }
    }
  ]
}
```

### 2.2 Critical Configuration Notes

**From GitHub Issue #29727 (2 weeks ago):**
- Sub-agents require `allowedAgents` in parent agent config
- `tools.sessions.visibility` MUST be set to "all" for cross-agent access
- Config validation passes but runtime may still block — test with actual spawn

---

## Part 3: ClawHub Skills - Recommended for Agent Teams

### 3.1 Essential Skills (March 2026 Rankings)

| Skill | Downloads | Use Case | Install |
|-------|-----------|----------|---------|
| **capability-evolver** | 35K | Self-improving capabilities | `claw install capability-evolver` |
| **self-improving-agent** | 15K | Learns from interactions | `claw install self-improving-agent` |
| **wacli** | 16K | WhatsApp integration | `claw install wacli` |
| **gog** | 14K | Gmail/Calendar/Drive | `claw install gog` |
| **cursor-agent** | - | Cursor CLI integration | `claw install cursor-agent` |
| **skill-creator** | - | Create custom skills | `claw install skill-creator` |

### 3.2 Team-Specific Skills

**For CTO (Developer):**
- `cursor-agent` - Cursor CLI integration
- `git` - Advanced Git workflows
- `docker` - Container management
- `code` - Code generation patterns

**For QA (Tester):**
- `agent-toolkit-qa` - QA audit toolkit
- `browser` - Enhanced browser automation
- `summarize` - Test result summaries

**For Warren (Operations):**
- `cron` - Job scheduling
- `fs-watcher` - File monitoring
- `healthcheck` - System monitoring

**Install All:**
```bash
# Core team skills
claw install capability-evolver
claw install self-improving-agent

# Role-specific
claw install cursor-agent
claw install git
claw install docker
claw install agent-toolkit-qa
claw install cron
claw install fs-watcher
```

---

## Part 4: Agent Directory Structure

### 4.1 Per-Agent Workspace

```
~/.openclaw/
├── agents/
│   ├── main/
│   │   ├── agent/
│   │   │   ├── AGENTS.md      # Agent instructions
│   │   │   ├── SOUL.md        # Personality/tone
│   │   │   └── TOOLS.md       # Tool configurations
│   │   └── sessions/
│   ├── cto/
│   │   ├── agent/
│   │   │   ├── AGENTS.md      # CTO persona
│   │   │   ├── SOUL.md        # Developer mindset
│   │   │   └── TOOLS.md       # Coding tools
│   │   └── sessions/
│   ├── qa/
│   │   ├── agent/
│   │   │   ├── AGENTS.md      # QA persona
│   │   │   ├── SOUL.md        # Testing mindset
│   │   │   └── TOOLS.md       # Read-only tools
│   │   └── sessions/
│   └── warren/
│       ├── agent/
│       │   ├── AGENTS.md      # Operations persona
│       │   ├── SOUL.md        # Coordination mindset
│       │   └── TOOLS.md       # Monitoring tools
│       └── sessions/
├── workspace/                  # Shared workspace
│   ├── memory/                 # Daily logs
│   ├── docs/                   # Process documentation
│   └── agents/                 # Task definitions
├── openclaw.json              # Main configuration
└── HEARTBEAT.md               # Monitoring checklist
```

### 4.2 AGENTS.md Template (Per Agent)

```markdown
# AGENTS.md - [Agent Name]

## Role
[CTO/QA/Warren/etc.]

## Reports To
[GM/Who manages this agent]

## Scope
- [What this agent does]
- [What it doesn't do]

## Tools
[Available tools and permissions]

## Workflow
[How tasks flow to/from this agent]

## Escalation
[When to escalate to parent]
```

---

## Part 5: Production Deployment Checklist

### 5.1 Pre-Deployment (Git Install Required)

```bash
# 1. Verify Git-based installation
openclaw update status
# Should show: Install: git (~/openclaw-system)

# 2. Validate configuration
openclaw gateway config.get
openclaw agents list

# 3. Test agent spawning
openclaw sessions spawn --agent-id cto --message "test" --dry-run
```

### 5.2 Security Hardening

**From Production Best Practices (1 week ago):**
- Always enable sandbox: `workspaceAccess: "ro"` or `"none"`
- Allowlist exec commands
- Require approval for: email, tweets, file deletion
- Set `tools.sessions.visibility: "all"` for multi-agent only

### 5.3 Monitoring Setup

```bash
# Create HEARTBEAT.md
cat > ~/.openclaw/HEARTBEAT.md << 'EOF'
# HEARTBEAT.md

## Checks (every 2 hours)
- [ ] CTO agent responding
- [ ] QA agent responding
- [ ] Subagent sessions active
- [ ] Task queue not blocked

## Actions
09:00 - Morning standup & task assignment
12:00 - Midday progress check
15:00 - QA review & unblocking
18:00 - EOD summary & planning
EOF
```

---

## Part 6: Known Issues & Fixes (March 2026)

### 6.1 GitHub Issue #29727 - Sub-Agent "allowed: none"

**Problem:** Config validates but runtime blocks sub-agents

**Fix:**
```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "subagents": {
          "allowAgents": ["cto", "qa", "warren"]
        }
      }
    ]
  },
  "tools": {
    "sessions": {
      "visibility": "all"
    }
  }
}
```

### 6.2 GitHub Issue #24019 - Manual Device Pairing

**Problem:** Sub-agents require manual approval for device pairing

**Workaround:** Pre-approve devices or run `openclaw devices approve <id>`

### 6.3 GitHub Issue #30861 - Agent Context Contamination

**Problem:** Multi-agent setups can leak context between agents

**Fix:** Use separate workspaces + hard context resets between iterations (Ralph Orchestrator pattern)

---

## Part 7: Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Verify Git-based OpenClaw install
- [ ] Install ClawHub CLI: `npm install -g @clawhub/cli`
- [ ] Install essential skills (capability-evolver, self-improving-agent)
- [ ] Create agent directory structure
- [ ] Configure openclaw.json with agent list

### Phase 2: Agent Setup (Week 1-2)
- [ ] Create CTO agent with coding tools
- [ ] Create QA agent with read-only tools
- [ ] Create Warren/HR agent with monitoring tools
- [ ] Write AGENTS.md and SOUL.md for each
- [ ] Test cross-agent communication

### Phase 3: Workflow Integration (Week 2)
- [ ] Implement task assignment pipeline
- [ ] Set up HEARTBEAT.md monitoring
- [ ] Configure cron jobs for periodic checks
- [ ] Test full CTO→QA→GM workflow

### Phase 4: Production Hardening (Week 3)
- [ ] Enable sandbox mode
- [ ] Set up approval gates for sensitive ops
- [ ] Configure logging and monitoring
- [ ] Document runbooks

---

## Part 8: Key Resources

### Official Documentation
- ClawHub: https://clawhub.com
- OpenClaw Docs: https://openclawcn.com/en/docs/
- GitHub: https://github.com/openclaw/openclaw

### Community Resources (Recent)
- "5 OpenClaw Sub-Agent Configurations That 10x Your Workflow" (xCloud, 1 day ago)
- "How I Built a Deterministic Multi-Agent Dev Pipeline" (DEV Community, 3 days ago)
- "OpenClaw Multi-Agent Orchestration Advanced Guide" (zenvanriel.com, 4 days ago)
- "Building an Agent OS: Technical Blueprint" (xugj520.cn, 16 hours ago)

### Recommended Skills Marketplace
- LobeHub: https://lobehub.com/skills
- ClawHub CLI: `clawhub search [query]`

---

## Conclusion

The latest OpenClaw (2026.2.17+) provides enterprise-grade multi-agent orchestration. Key success factors:

1. **Git-based installation** (enables auto-updates)
2. **Proper agent configuration** (openclaw.json with allowAgents)
3. **Session visibility settings** (tools.sessions.visibility: "all")
4. **ClawHub skills** (capability-evolver, self-improving-agent)
5. **Separate workspaces** (prevents context contamination)
6. **HEARTBEAT monitoring** (ensures system health)

With these patterns, ESTUDIO can deploy a robust, stable, and efficient multi-agent system.

---

**Next Step:** Approve Phase 1 implementation or request specific agent configuration assistance.
