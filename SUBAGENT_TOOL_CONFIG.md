# Subagent Tool Access - CONFIGURATION REQUIRED

**Date:** 2026-03-21 21:40
**Status:** ⚠️ Config files created, but subagents still lack tools
**Issue:** OpenClaw system not granting tools to subagents despite config

---

## 🔍 What We Tried

### Attempt 1: Created Agent Config Files
**Files created:**
- `/home/e/.openclaw/agents/cto/agent/config.json`
- `/home/e/.openclaw/agents/qa/agent/config.json`
- `/home/e/.openclaw/agents/warren/agent/config.json`

**Contents:**
```json
{
  "tools": ["read", "write", "edit", "exec", "memory_search"]
}
```

**Result:** ❌ Subagent still only has session tools

---

### Attempt 2: Test with New Config
**Task:** CTO create file with new config
**Result:** ❌ Still no file tools

**CTO reported:**
```
Available tools in this subagent:
- sessions_list
- sessions_history
- sessions_send
- sessions_spawn
```

**Missing tools:**
- ❌ write
- ❌ read
- ❌ exec
- ❌ edit

---

## 📚 Documentation Findings

**From OpenClaw docs (web search):**
> "By default, sub-agents get all tools except session tools and system tools"

**Expected behavior:** Subagents SHOULD have file/exec tools
**Actual behavior:** Subagents ONLY have session tools

**This is backwards from documented behavior.**

---

## 🔧 Possible Causes

### 1. Tool Deny List
There may be a system-level tool deny list preventing subagent access to file/exec tools.

**Location:** Unknown (possibly OpenClaw config)
**Action:** Search for tool restrictions

---

### 2. Subagent Mode Configuration
`sessions_spawn` may be creating subagents in a restricted mode by default.

**Possible fix:** Need to pass tool permissions explicitly in spawn call

---

### 3. OpenClaw Version/Configuration
Current OpenClaw configuration may have subagents locked down for security.

**Check:** OpenClaw version, security settings, tool policies

---

## 🎯 Next Actions

### Option A: Explicit Tool Granting (TRY NOW)
Check if `sessions_spawn` accepts tool permissions parameter:

```javascript
sessions_spawn(
  agentId: "cto",
  tools: ["write", "read", "exec", "edit"],
  task: "..."
)
```

---

### Option B: OpenClaw Config Investigation
Search for and modify:
- `/home/e/.openclaw/openclaw_config.json` (if exists)
- Tool allow/deny lists
- Subagent permission settings

---

### Option C: Accept Limitation (FALLBACK)
Proceed with current architecture:
- GM (main agent) has all tools
- Subagents coordinate but don't execute
- CTO "delegates" to GM for actual work

---

## 📊 Current State

**Main Agent (Dereck):**
- ✅ Has: read, write, edit, exec, search, browser
- ✅ Can do actual work

**Subagents (CTO, QA, Warren):**
- ❌ Only have: sessions_list, sessions_history, sessions_send, sessions_spawn
- ❌ Cannot: read files, write files, run commands

**Impact:** True 4-Manager autonomy not achievable with current configuration

---

*Config created but not effective - System investigation needed*
*GM: Dereck | Date: 2026-03-21*
