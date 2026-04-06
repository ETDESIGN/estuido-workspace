#!/usr/bin/env python3
"""
Auto-tagging script for memory entries
Adds YAML frontmatter with tags, type, priority
"""

import re
import sys
from datetime import datetime
from pathlib import Path

MEMORY_DIR = Path.home() / ".openclaw" / "workspace" / "memory" / "active"

def detect_tags(filepath):
    """Auto-detect tags from filename and content."""
    tags = []
    content = filepath.read_text()
    filename = filepath.name.lower()

    # Topic detection
    if 'gateway' in filename or 'gateway' in content.lower():
        tags.append('gateway')
    if 'config' in filename or 'config' in content.lower():
        tags.append('config')
    if 'audio' in filename or 'audio' in content.lower() or 'transcri' in content.lower():
        tags.append('audio')
    if 'dashboard' in filename or 'dashboard' in content.lower():
        tags.append('dashboard')
    if 'test' in filename or 'test' in content.lower() or 'qa' in content.lower():
        tags.append('testing')
    if 'task' in filename or 'task' in content.lower():
        tags.append('tasks')
    if 'memory' in filename or 'memory' in content.lower():
        tags.append('memory')
    if 'whisper' in filename or 'whisper' in content.lower():
        tags.append('whisper')

    # Type detection
    if 'error' in filename or 'error' in content.lower():
        tags.append('error')
    if 'learning' in filename or 'learning' in content.lower():
        tags.append('learning')
    if 'setup' in filename or 'setup' in content.lower() or 'install' in content.lower():
        tags.append('setup')
    if 'fix' in filename or 'fix' in content.lower() or 'fix' in content.lower():
        tags.append('fix')

    return tags

def detect_type(filepath):
    """Detect entry type."""
    filename = filepath.name.lower()

    if 'error' in filename:
        return 'error'
    elif 'learning' in filename or 'lrn-' in filename:
        return 'learning'
    elif 'summary' in filename:
        return 'summary'
    elif 'task' in filename:
        return 'task'
    elif 'setup' in filename or 'config' in filename:
        return 'technical'
    elif 'analysis' in filename or 'system' in filename:
        return 'analysis'
    else:
        return 'log'

def detect_priority(tags, entry_type):
    """Detect priority based on tags and type."""
    if 'error' in tags or 'critical' in tags:
        return 'critical'
    elif entry_type == 'learning':
        return 'high'
    elif entry_type == 'task':
        return 'medium'
    else:
        return 'low'

def add_frontmatter(filepath):
    """Add YAML frontmatter to file."""
    content = filepath.read_text()

    # Skip if already has frontmatter
    if content.startswith('---'):
        return False

    tags = detect_tags(filepath)
    entry_type = detect_type(filepath)
    priority = detect_priority(tags, entry_type)

    # Create frontmatter
    frontmatter = f"""---
tags: {', '.join(tags) if tags else 'general'}
type: {entry_type}
priority: {priority}
status: active
created: {datetime.now().strftime('%Y-%m-%d')}
---

"""

    # Write back with frontmatter
    filepath.write_text(frontmatter + content)
    return True

def main():
    """Tag all memory files."""
    print("🏷️  Auto-tagging memory entries...")

    tagged_count = 0
    for md_file in MEMORY_DIR.rglob('*.md'):
        if add_frontmatter(md_file):
            tagged_count += 1
            print(f"  ✓ {md_file.relative_to(MEMORY_DIR.parent.parent)}")

    print(f"\n✅ Tagged {tagged_count} files")

if __name__ == '__main__':
    main()
