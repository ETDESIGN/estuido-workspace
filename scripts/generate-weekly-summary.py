#!/usr/bin/env python3
"""
Weekly summary generator - runs every Sunday at 11 PM
"""

import re
from datetime import datetime, timedelta
from pathlib import Path

MEMORY_DIR = Path.home() / ".openclaw" / "workspace" / "memory" / "active"
LEARNINGS_FILE = MEMORY_DIR / "learnings" / "LEARNINGS.md"
ERRORS_FILE = MEMORY_DIR / "learnings" / "ERRORS.md"

def get_week_files():
    """Get all files modified in the last 7 days."""
    week_ago = datetime.now() - timedelta(days=7)
    week_files = []
    for file in MEMORY_DIR.rglob("*.md"):
        mtime = datetime.fromtimestamp(file.stat().st_mtime)
        if mtime > week_ago:
            week_files.append(file)
    return week_files

def categorize_files(files):
    """Group files by category."""
    categories = {"daily": [], "technical": [], "analysis": [], "learnings": [], "tasks": []}
    for file in files:
        if "daily" in str(file):
            categories["daily"].append(file)
        elif "technical" in str(file):
            categories["technical"].append(file)
        elif "analysis" in str(file):
            categories["analysis"].append(file)
        elif "learnings" in str(file):
            categories["learnings"].append(file)
        elif "tasks" in str(file):
            categories["tasks"].append(file)
    return categories

def extract_top_items(file, n=3, pattern=r'\[.*?\].*?(?=\n##|\n\[|$)'):
    """Extract top n items from a file."""
    try:
        if file.exists():
            content = file.read_text()
            entries = re.findall(pattern, content, re.DOTALL)
            return entries[:n]
    except:
        pass
    return []

def generate_weekly_summary():
    """Generate end-of-week summary."""
    week_files = get_week_files()
    categories = categorize_files(week_files)
    week_start = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    week_end = datetime.now().strftime("%Y-%m-%d")
    
    summary = f"""# Weekly Summary - {week_end}
**Period:** {week_start} to {week_end}

## 📊 Week at a Glance
- Total entries: {len(week_files)}
- Daily logs: {len(categories['daily'])}
- Technical docs: {len(categories['technical'])}
- Analysis: {len(categories['analysis'])}

## 🔥 Top Issues This Week
- [Extract from ERRORS.md]
- [ ]
- [ ]

## 🎓 Top Learnings This Week
- [Extract from LEARNINGS.md]
- [ ]
- [ ]

## ✅ Accomplished This Week
### Daily Logs ({len(categories['daily'])} entries)
{chr(10).join([f"- {f.name}" for f in categories['daily'][:5]])}

### Technical Work ({len(categories['technical'])} entries)
{chr(10).join([f"- {f.name}" for f in categories['technical'][:3]])}

## 📋 Next Week's Priorities
1. [ ]
2. [ ]
3. [ ]

---
*Auto-generated {datetime.now().strftime("%Y-%m-%d %H:%M")}*
"""
    output_file = MEMORY_DIR / "daily" / f"SUMMARY-WEEKLY-{week_end}.md"
    output_file.write_text(summary)
    print(f"✅ Weekly summary saved: {output_file}")
    return f"✅ Weekly summary: {len(week_files)} entries"

if __name__ == "__main__":
    generate_weekly_summary()
