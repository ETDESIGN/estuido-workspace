#!/usr/bin/env python3
"""
Generate session initialization context.
Injects recent history, memory, and state into new agent sessions.
"""

import subprocess
from datetime import datetime, timedelta
from pathlib import Path

# Paths
WORKSPACE = Path.home() / ".openclaw" / "workspace"
MEMORY_DIR = WORKSPACE / "memory"
HEARTBEAT_FILE = WORKSPACE / "HEARTBEAT.md"
CAPABILITIES_FILE = WORKSPACE / "AGENT_CAPABILITIES.md"

def get_active_tasks():
    """Get active tasks from HEARTBEAT.md."""
    try:
        if HEARTBEAT_FILE.exists():
            content = HEARTBEAT_FILE.read_text()
            # Extract "Active Tasks to Monitor" section
            if "## Active Tasks to Monitor" in content:
                section = content.split("## Active Tasks to Monitor")[1]
                section = section.split("\n##")[0]
                return section.strip()
        return "# No active tasks found\n"
    except Exception as e:
        return f"# Error reading tasks: {e}\n"

def get_recent_memory_entries(hours=24):
    """Get recent memory entries."""
    try:
        entries = []
        cutoff = datetime.now() - timedelta(hours=hours)

        for md_file in MEMORY_DIR.glob("2026-*.md"):
            if md_file.is_file():
                mtime = datetime.fromtimestamp(md_file.stat().st_mtime)
                if mtime > cutoff:
                    content = md_file.read_text()
                    preview = content[:300].split("\n")[0]
                    entries.append(f"- {md_file.name}: {preview}")

        return "\n".join(entries[:8]) if entries else "# No recent memory entries\n"
    except Exception as e:
        return f"# Error reading memory: {e}\n"

def get_capabilities():
    """Get quick capabilities reference."""
    try:
        if CAPABILITIES_FILE.exists():
            content = CAPABILITIES_FILE.read_text()
            if "## 🎯 KEY RULES" in content:
                section = content.split("## 🎯 KEY RULES")[1]
                section = section.split("\n##")[0]
                return section.strip()[:1000]
        return "# Capabilities doc not found\n"
    except Exception as e:
        return f"# Error reading capabilities: {e}\n"

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
