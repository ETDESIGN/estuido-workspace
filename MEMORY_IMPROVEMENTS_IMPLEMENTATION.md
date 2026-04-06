# Memory System Improvements Implementation

**Created:** 2026-03-28 05:30 HKT
**Status:** Implementation Phase

---

## ✅ Improvement #1: Memory Consolidation

### Problem
Memory is scattered across 3 locations:
- `~/.openclaw/memory/` (SQLite)
- `~/.openclaw/workspace/memory/` (95+ MD files)
- `~/.openclaw/workspace/.learnings/` (Structured MD)

### Solution: Unified Memory Structure

**New Structure:**
```
~/.openclaw/workspace/memory/
├── active/                    # Current entries (< 90 days)
│   ├── daily/                 # Daily summaries
│   ├── technical/             # Setup, configs, docs
│   ├── analysis/              # System analysis, errors
│   ├── tasks/                 # Task tracking
│   └── learnings/             # Structured learnings
├── archive/                   # Old entries (> 90 days)
│   ├── 2026/02/               # February 2026
│   └── 2026/01/               # January 2026
└── index/
    ├── memory-index.json      # Search index
    └── tags.json              # Tag registry
```

### Migration Script
```bash
#!/bin/bash
# migrate-memory.sh - Consolidate scattered memory

echo "🔄 Consolidating memory structure..."

# Create new directories
mkdir -p ~/.openclaw/workspace/memory/{active/{daily,technical,analysis,tasks,learnings},archive}

# Move daily summaries
mv ~/.openclaw/workspace/memory/DAILY*.md ~/.openclaw/workspace/memory/active/daily/ 2>/dev/null
mv ~/.openclaw/workspace/memory/GM-*.md ~/.openclaw/workspace/memory/active/daily/ 2>/dev/null

# Move technical docs
mv ~/.openclaw/workspace/memory/*setup*.md ~/.openclaw/workspace/memory/active/technical/ 2>/dev/null
mv ~/.openclaw/workspace/memory/*config*.md ~/.openclaw/workspace/memory/active/technical/ 2>/dev/null

# Move analysis
mv ~/.openclaw/workspace/memory/SYSTEM_*.md ~/.openclaw/workspace/memory/active/analysis/ 2>/dev/null
mv ~/.openclaw/workspace/memory/*ANALYSIS*.md ~/.openclaw/workspace/memory/active/analysis/ 2>/dev/null

# Move learnings
cp ~/.openclaw/workspace/.learnings/LEARNINGS.md ~/.openclaw/workspace/memory/active/learnings/
cp ~/.openclaw/workspace/.learnings/ERRORS.md ~/.openclaw/workspace/memory/active/learnings/

echo "✅ Memory consolidated"
```

---

## ✅ Improvement #2: Better Tagging

### Problem
Entries have no consistent tags, making it hard to find related content.

### Solution: Tag Registry System

**Tag Categories:**
```yaml
Topics:
  - gateway
  - config
  - audio
  - transcription
  - dashboard
  - testing
  - delegation
  - memory

Types:
  - error
  - learning
  - task
  - analysis
  - setup
  - fix

Priority:
  - critical
  - high
  - medium
  - low

Status:
  - active
  - resolved
  - pending
  - archived
```

**Implementation:**
```python
# tag-memory.py - Add tags to memory entries
import yaml
from pathlib import Path

FRONTMATTER_TEMPLATE = """---
tags: [{tags}]
type: {type}
priority: {priority}
status: {status}
created: {date}
related: [{related_entries}]
---
"""

def add_tags_to_file(file_path, tags, type, priority):
    """Add YAML frontmatter to markdown file."""
    content = file_path.read_text()

    # Skip if already has frontmatter
    if content.startswith("---"):
        return

    frontmatter = FRONTMATTER_TEMPLATE.format(
        tags=", ".join(tags),
        type=type,
        priority=priority,
        status="active",
        date=datetime.now().isoformat(),
        related_entries=""
    )

    new_content = frontmatter + "\n" + content
    file_path.write_text(new_content)
```

**Auto-Tagging Rules:**
- Title contains "error" → `tags: [error, fix]`
- Title contains "setup" → `tags: [setup, technical]`
- Title contains date → `tags: [daily]`
- File in .learnings/ → `tags: [learning]`

---

## ✅ Improvement #3: Archive Policy

### Problem
Old entries accumulate indefinitely, slowing searches and adding noise.

### Solution: Automatic Archive Policy

**Archive Rules:**
```yaml
Archive Triggers:
  - Age > 90 days
  - Status = resolved
  - Not tagged "evergreen"

Keep Active:
  - Tagged "evergreen" (setup docs, configs)
  - Age < 90 days
  - Status = active or pending

Archive Location:
  - ~/.openclaw/workspace/memory/archive/YYYY/MM/
```

**Implementation:**
```bash
#!/bin/bash
# archive-old-memory.sh - Run weekly via cron

AGE_DAYS=90
CUTOFF_DATE=$(date -d "$AGE_DAYS days ago" +%Y-%m-%d)

echo "📦 Archiving memory older than $AGE_DAYS days (before $CUTOFF_DATE)..."

find ~/.openclaw/workspace/memory/active -name "*.md" -type f -mtime +$AGE_DAYS | while read file; do
    # Check if tagged "evergreen"
    if ! grep -q "tags:.*evergreen" "$file"; then
        # Get file date
        file_date=$(stat -c %y "$file" | cut -d' ' -f1)
        year=$(echo $file_date | cut -d'-' -f1)
        month=$(echo $file_date | cut -d'-' -f2)

        # Create archive directory
        mkdir -p ~/.openclaw/workspace/memory/archive/$year/$month

        # Move to archive
        mv "$file" ~/.openclaw/workspace/memory/archive/$year/$month/
        echo "📦 Archived: $file"
    fi
done

echo "✅ Archive complete"
```

**Cron Schedule:**
```bash
# Run every Sunday at 3 AM
0 3 * * 0 ~/.openclaw/workspace/scripts/archive-old-memory.sh
```

---

## ✅ Improvement #4: Auto-Summarization

### Problem
No automatic summaries of daily/weekly activities.

### Solution: Auto-Summarization Scripts

**Daily Summary:**
```python
#!/usr/bin/env python3
# generate-daily-summary.py

import re
from datetime import datetime, timedelta
from pathlib import Path

MEMORY_DIR = Path.home() / ".openclaw" / "workspace" / "memory" / "active"

def generate_daily_summary():
    """Generate end-of-day summary."""

    today = datetime.now().strftime("%Y-%m-%d")
    today_files = list(MEMORY_DIR.rglob(f"*{today}*.md"))

    summary = f"""# Daily Summary - {today}

## 📊 Stats
- Files created/modified: {len(today_files)}
- Active tasks: [count from HEARTBEAT.md]

## 📝 Entries

### Daily Logs
"""

    for file in sorted(today_files):
        if "daily" in str(file) or "GM-" in file.name:
            summary += f"- {file.name}\n"

    summary += "\n### Technical\n"
    for file in sorted(today_files):
        if "setup" in str(file) or "config" in str(file):
            summary += f"- {file.name}\n"

    summary += "\n### Analysis\n"
    for file in sorted(today_files):
        if "ANALYSIS" in file.name or "analysis" in str(file):
            summary += f"- {file.name}\n"

    summary += f"""
## 🔍 Key Learnings
[Extract top 3 from .learnings/LEARNINGS.md]

## 📋 Tomorrow's Priorities
1. [From HEARTBEAT.md active tasks]
2. [ ]
3. [ ]

---
*Auto-generated at {datetime.now().strftime("%H:%M")}*
"""

    output_file = MEMORY_DIR / "daily" / f"SUMMARY-{today}.md"
    output_file.write_text(summary)
    print(f"✅ Daily summary saved: {output_file}")

if __name__ == "__main__":
    generate_daily_summary()
```

**Weekly Summary:**
```python
#!/usr/bin/env python3
# generate-weekly-summary.py

def generate_weekly_summary():
    """Generate end-of-week summary."""

    week_ago = datetime.now() - timedelta(days=7)
    week_files = []

    for file in MEMORY_DIR.rglob("*.md"):
        mtime = datetime.fromtimestamp(file.stat().st_mtime)
        if mtime > week_ago:
            week_files.append(file)

    # Group by category
    by_category = {"daily": [], "technical": [], "analysis": [], "tasks": []}
    for file in week_files:
        if "daily" in str(file):
            by_category["daily"].append(file)
        elif "technical" in str(file):
            by_category["technical"].append(file)
        elif "analysis" in str(file):
            by_category["analysis"].append(file)
        elif "tasks" in str(file):
            by_category["tasks"].append(file)

    summary = f"""# Weekly Summary - {datetime.now().strftime("%Y-%m-%d")}

## 📊 Week at a Glance
- Total entries: {len(week_files)}
- Daily logs: {len(by_category['daily'])}
- Technical docs: {len(by_category['technical'])}
- Analysis: {len(by_category['analysis'])}

## 🔥 Top 3 Issues This Week
[Extract from ERRORS.md]

## 🎓 Top 3 Learnings This Week
[Extract from LEARNINGS.md]

## ✅ Accomplished
- [List from daily summaries]

## 📋 Next Week's Priorities
1. [ ]
2. [ ]
3. [ ]

---
*Auto-generated*
"""

    output_file = MEMORY_DIR / "SUMMARY-WEEKLY.md"
    output_file.write_text(summary)
    print(f"✅ Weekly summary saved: {output_file}")
```

**Cron Schedule:**
```bash
# Daily summary at 11:59 PM
59 23 * * * ~/.openclaw/workspace/scripts/generate-daily-summary.py

# Weekly summary Sunday at 11 PM
0 23 * * 0 ~/.openclaw/workspace/scripts/generate-weekly-summary.py
```

---

## ✅ Improvement #5: Memory Quality Filter

### Problem
Redundant entries, noise vs signal issues.

### Solution: Quality Scoring & Deduplication

**Quality Score Algorithm:**
```python
def calculate_quality_score(file_path):
    """Calculate memory entry quality score (0-100)."""

    content = file_path.read_text()
    score = 0

    # Length check (too short = low quality)
    words = len(content.split())
    if 50 < words < 2000:
        score += 20
    elif words >= 2000:
        score += 10

    # Has structure (headings, lists)
    if re.search(r'^#+\s', content, re.MULTILINE):
        score += 20  # Has headings
    if re.search(r'^\s*[-*]', content, re.MULTILINE):
        score += 15  # Has lists

    # Has metadata
    if 'tags:' in content or 'priority:' in content:
        score += 15

    # Has code/examples
    if '```' in content or '    ' in content:
        score += 15

    # Not a duplicate
    if not is_duplicate(file_path):
        score += 15

    return min(score, 100)

def is_duplicate(file_path):
    """Check if content is very similar to another entry."""
    # Simple similarity check (can be improved with embeddings)
    content = file_path.read_text()[:500]
    for other in MEMORY_DIR.rglob("*.md"):
        if other == file_path:
            continue
        other_content = other.read_text()[:500]
        similarity = len(set(content) & set(other_content)) / len(set(content) | set(other_content))
        if similarity > 0.8:
            return True
    return False
```

**Quality Thresholds:**
- **90-100:** Evergreen (keep forever)
- **70-89:** High quality (keep 1 year)
- **50-69:** Medium quality (archive after 90 days)
- **< 50:** Low quality (flag for review or delete)

**Deduplication Script:**
```bash
#!/bin/bash
# deduplicate-memory.sh

echo "🔍 Finding duplicates..."

# Find similar files based on content hash
for file in ~/.openclaw/workspace/memory/active/**/*.md; do
    hash=$(md5sum "$file" | cut -d' ' -f1)
    if grep -q "$hash" ~/.openclaw/workspace/memory/.duplicates.txt; then
        echo "📋 Duplicate found: $file"
        mv "$file" ~/.openclaw/workspace/memory/duplicates/
    else
        echo "$hash $file" >> ~/.openclaw/workspace/memory/.duplicates.txt
    fi
done

echo "✅ Deduplication complete"
```

---

## 📊 Implementation Timeline

| Week | Task | Status |
|------|------|--------|
| 1 | Create migration script | ⏳ Todo |
| 1 | Implement tagging system | ⏳ Todo |
| 2 | Set up archive cron | ⏳ Todo |
| 2 | Create auto-summary scripts | ⏳ Todo |
| 3 | Implement quality filter | ⏳ Todo |
| 3 | Test and iterate | ⏳ Todo |

---

## 📈 Expected Results

| Metric | Before | After |
|--------|--------|-------|
| Memory locations | 3 scattered | 1 unified |
| Average file find time | 30s | < 5s |
| Duplicate entries | Unknown | 0 |
| Auto-summaries | 0 | Daily + Weekly |
| Archive clutter | High | Organized |

---

**Status:** 📋 Plan complete, implementation starting
**Created:** 2026-03-28 05:30 HKT
