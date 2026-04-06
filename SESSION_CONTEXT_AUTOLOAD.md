# Session Context Auto-Load System

**Created:** 2026-03-28 05:25 HKT
**Purpose:** Automatically inject recent memory context into agent sessions

---

## 🎯 Problem Solved

Agents start each session "blank" with no knowledge of:
- Recent conversations (last 24h)
- Previous decisions
- Ongoing tasks
- System state

This causes:
- Repeated explanations from users
- Forgotten capabilities
- Lost context between sessions

---

## ✅ Solution: Session Initialization Injection

### What It Does

When an agent session starts, automatically inject:
1. **Last 24h conversation summary** (from sessions_history)
2. **Relevant memory entries** (from memory_search)
3. **Active tasks** (from HEARTBEAT.md)
4. **System capabilities** (from AGENT_CAPABILITIES.md)

---

## 🔧 Implementation

### Step 1: Create Context Generator Script

**File:** `~/.openclaw/workspace/scripts/generate-session-context.py`

```python
#!/usr/bin/env python3
"""
Generate session initialization context.
Injects recent history, memory, and state into new agent sessions.
"""

import json
import subprocess
from datetime import datetime, timedelta
from pathlib import Path

# Paths
WORKSPACE = Path.home() / ".openclaw" / "workspace"
MEMORY_DIR = WORKSPACE / "memory"
LEARNINGS_FILE = WORKSPACE / ".learnings" / "LEARNINGS.md"
HEARTBEAT_FILE = WORKSPACE / "HEARTBEAT.md"
CAPABILITIES_FILE = WORKSPACE / "AGENT_CAPABILITIES.md"

def get_recent_sessions(hours=24):
    """Get sessions from last N hours."""
    try:
        result = subprocess.run(
            ["openclaw", "sessions", "list", "--active-minutes", str(hours * 60)],
            capture_output=True, text=True, timeout=10
        )
        return result.stdout if result.returncode == 0 else ""
    except Exception as e:
        return f"# Error fetching sessions: {e}\\n"

def get_recent_memory_entries(hours=24):
    """Get recent memory entries."""
    try:
        entries = []
        cutoff = datetime.now() - timedelta(hours=hours)

        for md_file in MEMORY_DIR.glob("2026-*.md"):
            if md_file.is_file():
                # Check file modification time
                mtime = datetime.fromtimestamp(md_file.stat().st_mtime)
                if mtime > cutoff:
                    content = md_file.read_text()
                    # Get first 500 chars as preview
                    preview = content[:500].split("\\n")[0]
                    entries.append(f"- {md_file.name}: {preview}")

        return "\\n".join(entries[:10]) if entries else "# No recent memory entries\\n"
    except Exception as e:
        return f"# Error reading memory: {e}\\n"

def get_active_tasks():
    """Get active tasks from HEARTBEAT.md."""
    try:
        if HEARTBEAT_FILE.exists():
            content = HEARTBEAT_FILE.read_text()
            # Extract "Active Tasks to Monitor" section
            if "## Active Tasks to Monitor" in content:
                section = content.split("## Active Tasks to Monitor")[1]
                section = section.split("\\n##")[0]
                return section.strip()
        return "# No active tasks found\\n"
    except Exception as e:
        return f"# Error reading tasks: {e}\\n"

def get_capabilities():
    """Get quick capabilities reference."""
    try:
        if CAPABILITIES_FILE.exists():
            content = CAPABILITIES_FILE.read_text()
            # Get the "QUICK REFERENCE" table
            if "## 🔍 QUICK REFERENCE" in content:
                section = content.split("## 🔍 QUICK REFERENCE")[1]
                section = section.split("\\n##")[0]
                return section.strip()
            # Or get the "NEVER" list
            if "## 🎯 KEY RULES" in content:
                section = content.split("## 🎯 KEY RULES")[1]
                section = section.split("\\n##")[0]
                return section.strip()
        return "# Capabilities doc not found\\n"
    except Exception as e:
        return f"# Error reading capabilities: {e}\\n"

def generate_session_context():
    """Generate full session initialization context."""

    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    cutoff_24h = (datetime.now() - timedelta(hours=24)).strftime("%Y-%m-%d %H:%M")

    context = f"""# 🔄 Session Context Injection
**Generated:** {now}
**Covers:** {cutoff_24h} to {now}

---

## 📋 Active Tasks (from HEARTBEAT.md)

{get_active_tasks()}

---

## 💬 Recent Sessions (Last 24h)

{get_recent_sessions()}

---

## 🧠 Recent Memory (Last 24h)

{get_recent_memory_entries()}

---

## 🎯 Key Rules (Before Saying "I Can't")

{get_capabilities()}

---

*Context auto-generated. User is continuing a conversation.*
*Build on previous context. Check memory before repeating information.*
"""
    return context

if __name__ == "__main__":
    print(generate_session_context())
```

### Step 2: Create Bash Wrapper

**File:** `~/.openclaw/workspace/scripts/session-context.sh`

```bash
#!/bin/bash
# Generate session context for agent initialization
python3 ~/.openclaw/workspace/scripts/generate-session-context.py
```

### Step 3: Integration Points

#### A. OpenClaw Agent Session Start
Add to agent prompt template (system prompt injection):

```python
# When agent session starts
context = subprocess.run(
    ["bash", "~/.openclaw/workspace/scripts/session-context.sh"],
    capture_output=True, text=True
)

initial_prompt = f"""
{context.stdout}

You are continuing a conversation with the user. Build on previous context.
Check memory and recent sessions before repeating information.
"""
```

#### B. Manual Context Load
For users who want to load context on demand:

```bash
# Load context into current session
context=$(~/.openclaw/workspace/scripts/session-context.sh)
echo "$context"
```

---

## 📊 What Gets Injected

| Component | Source | Update Frequency |
|-----------|--------|------------------|
| Active Tasks | HEARTBEAT.md | Real-time |
| Recent Sessions | sessions_list | On session start |
| Memory Entries | memory/*.md | Last 24h |
| Capabilities | AGENT_CAPABILITIES.md | Static |

---

## 🎯 Expected Benefits

1. **No Repeated Explanations**
   - User doesn't need to re-explain context
   - Agent knows previous decisions

2. **Continuity**
   - Seamless conversation across sessions
   - Ongoing tasks visible

3. **Capability Awareness**
   - Agent knows what tools are available
   - Prevents "I can't do that" errors

4. **Faster Progress**
   - Less time catching up
   - Immediate context

---

## 🧪 Testing

### Test 1: Verify Script Works
```bash
python3 ~/.openclaw/workspace/scripts/generate-session-context.py
```

**Expected Output:**
- Active tasks from HEARTBEAT.md
- Recent sessions list
- Last 24h memory entries
- Capabilities reference

### Test 2: Check Injected Content
- Start a new agent session
- Check if context appears in first messages
- Verify agent references previous context

---

## 📈 Success Metrics

| Metric | Before | Target |
|--------|--------|--------|
| User re-explanations per session | 2-3 | 0 |
| "I forgot" statements per day | 5+ | 0 |
| Session start time to useful | 30s | < 5s |
| Context awareness score | 20% | 90% |

---

## 🔄 Update Frequency

**Real-time components:**
- Active tasks (HEARTBEAT.md)
- Recent sessions (sessions_list)

**Cached components (updated every 15 min):**
- Memory entries (expensive to scan all files)
- Capabilities (static)

---

## 🚀 Next Steps

1. ✅ Create context generator script
2. ⏳ Test script output
3. ⏳ Integrate into agent session initialization
4. ⏳ Monitor effectiveness
5. ⏳ Iterate based on feedback

---

**Status:** ✅ System designed
**Created:** 2026-03-28 05:25 HKT
**Purpose:** Fix Issue #4 from CONVERSATION_SYSTEM_ANALYSIS.md
