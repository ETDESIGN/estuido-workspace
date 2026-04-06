#!/usr/bin/env python3
"""
Daily summary generator - runs at 11:59 PM
"""

import re
from datetime import datetime, timedelta
from pathlib import Path

MEMORY_DIR = Path.home() / ".openclaw" / "workspace" / "memory" / "active"
HEARTBEAT_FILE = Path.home() / ".openclaw" / "workspace" / "HEARTBEAT.md"

def get_active_tasks():
    """Extract active tasks from HEARTBEAT.md."""
    try:
        if HEARTBEAT_FILE.exists():
            content = HEARTBEAT_FILE.read_text()
            if "Active Tasks to Monitor" in content:
                section = content.split("Active Tasks to Monitor")[1]
                section = section.split("##")[0]
                return section.strip()
    except:
        pass
    return "# No active tasks found"

def get_learnings():
    """Get recent learnings."""
    learnings_file = MEMORY_DIR / "learnings" / "LEARNINGS.md"
    try:
        if learnings_file.exists():
            content = learnings_file.read_text()
            # Get last 3 learnings
            entries = re.findall(r'\[LRN-\d+\].*?(?=\n## |\n\[LRN-|$)', content, re.DOTALL)
            return entries[:3]
    except:
        pass
    return []

def generate_daily_summary():
    """Generate end-of-day summary."""

    today = datetime.now().strftime("%Y-%m-%d")
    today_str = datetime.now().strftime("%Y-%m-%d")

    # Find today's files
    today_files = []
    for file in MEMORY_DIR.rglob("*.md"):
        mtime = datetime.fromtimestamp(file.stat().st_mtime)
        if mtime.strftime("%Y-%m-%d") == today_str:
            today_files.append(file)

    # Group by category
    by_category = {"daily": [], "technical": [], "analysis": [], "learnings": []}
    for file in today_files:
        if "daily" in str(file):
            by_category["daily"].append(file.name)
        elif "technical" in str(file):
            by_category["technical"].append(file.name)
        elif "analysis" in str(file):
            by_category["analysis"].append(file.name)
        elif "learnings" in str(file):
            by_category["learnings"].append(file.name)

    # Get learnings
    learnings = get_learnings()
    learning_summary = "\n".join([f"- {l[:100]}..." for l in learnings[:3]])

    summary = f"""# Daily Summary - {today}

## 📊 Stats
- Files created/modified: {len(today_files)}
- Daily logs: {len(by_category['daily'])}
- Technical docs: {len(by_category['technical'])}
- Analysis: {len(by_category['analysis'])}

## 📝 Today's Entries

### Daily Logs
{chr(10).join([f"- {f}" for f in by_category['daily'][:10]]) if by_category['daily'] else '- None'}

### Technical Docs
{chr(10).join([f"- {f}" for f in by_category['technical'][:5]]) if by_category['technical'] else '- None'}

### Analysis
{chr(10).join([f"- {f}" for f in by_category['analysis'][:5]]) if by_category['analysis'] else '- None'}

## 🔍 Key Learnings
{learning_summary if learning_summary else '- None'}

## 📋 Active Tasks
{get_active_tasks()}

## 📋 Tomorrow's Priorities
1. [From HEARTBEAT.md active tasks]
2.
3.

---
*Auto-generated at {datetime.now().strftime("%H:%M")}*
"""

    # Save summary
    output_dir = MEMORY_DIR / "daily"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / f"SUMMARY-{today}.md"

    output_file.write_text(summary)
    print(f"✅ Daily summary saved: {output_file}")

if __name__ == "__main__":
    generate_daily_summary()
