#!/usr/bin/env python3
"""
OpenClaw Config Doc Sync - Import from WeChat Export
Fallback method when database is encrypted
"""

import re
import json
from pathlib import Path
from datetime import datetime
from html.parser import HTMLParser

class WeChatExportParser(HTMLParser):
    """Parse WeChat favorites export (HTML format)"""

    def __init__(self):
        super().__init__()
        self.items = []
        self.current_title = ""
        self.current_url = ""
        self.in_title = False
        self.in_link = False

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            for attr, value in attrs:
                if attr == 'href':
                    self.current_url = value
                    self.in_link = True

    def handle_data(self, data):
        if self.in_link:
            self.current_title = data.strip()

    def handle_endtag(self, tag):
        if tag == 'a' and self.in_link:
            if self.current_url and self.current_title:
                self.items.append({
                    'title': self.current_title,
                    'url': self.current_url
                })
            self.current_url = ""
            self.current_title = ""
            self.in_link = False


def parse_export_file(file_path):
    """Parse WeChat export file (HTML or TXT)"""
    items = []

    file_path = Path(file_path)

    if file_path.suffix == '.html' or file_path.suffix == '.htm':
        # Parse HTML export
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        parser = WeChatExportParser()
        parser.feed(content)
        items = parser.items

    elif file_path.suffix == '.txt':
        # Parse text file (one URL per line or pipe-delimited)
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue

                # Try pipe-delimited format
                if '|' in line:
                    parts = [p.strip() for p in line.split('|')]
                    if len(parts) >= 2:
                        items.append({
                            'title': parts[0],
                            'url': parts[1],
                            'date_added': parts[2] if len(parts) > 2 else datetime.now().strftime('%Y-%m-%d'),
                            'category': parts[3] if len(parts) > 3 else 'General'
                        })
                else:
                    # Try URL-only format
                    url_match = re.search(r'https?://[^\s]+', line)
                    if url_match:
                        items.append({
                            'title': 'Untitled',
                            'url': url_match.group(0)
                        })

    return items


def filter_openclaw_items(items):
    """Filter for OpenClaw/AI related content"""
    keywords = [
        'openclaw', 'agent', 'llm', 'gpt', 'claude', 'ai assistant',
        'prompt engineering', 'ai automation', 'agent framework',
        'notebooklm', 'chatgpt', 'anthropic', 'openai'
    ]

    filtered = []
    for item in items:
        title_lower = item.get('title', '').lower()
        url_lower = item.get('url', '').lower()

        if any(k in title_lower or k in url_lower for k in keywords):
            filtered.append(item)

    return filtered


def sync_from_export(export_file, config_file=None):
    """Sync OpenClaw sources from WeChat export file"""

    print("="*60)
    print("OPENCLAW CONFIG DOC - SYNC FROM EXPORT")
    print("="*60)

    if config_file is None:
        config_file = Path.home() / ".openclaw/openclaw_config_doc.json"

    # Load config
    if config_file.exists():
        with open(config_file, 'r') as f:
            config = json.load(f)
    else:
        print("❌ Configuration not found. Run setup first.")
        return {'status': 'error', 'message': 'Not configured'}

    # Parse export file
    print(f"[1/4] Parsing export file: {export_file}")
    all_items = parse_export_file(export_file)
    print(f"      Found {len(all_items)} items in export")

    if not all_items:
        print("❌ No items found in export file")
        return {'status': 'error', 'message': 'Empty export file'}

    # Filter for OpenClaw content
    print(f"[2/4] Filtering for OpenClaw/AI content...")
    openclaw_items = filter_openclaw_items(all_items)
    print(f"      {len(openclaw_items)} OpenClaw/AI related")

    if not openclaw_items:
        print("ℹ️  No OpenClaw/AI content found in export")
        return {'status': 'no_changes', 'message': 'No relevant content'}

    # Check for duplicates
    print(f"[3/4] Checking for duplicates...")
    added_urls = set(config.get('added_urls', []))
    new_items = [item for item in openclaw_items if item.get('url') not in added_urls]
    print(f"      {len(new_items)} new to add")

    if not new_items:
        print("ℹ️  All items already added")
        return {
            'status': 'no_changes',
            'message': 'All OpenClaw/AI links already in project'
        }

    # Show what will be added
    print(f"[4/4] Sources to add:")
    for i, item in enumerate(new_items, 1):
        print(f"   {i}. {item.get('title', 'Untitled')[:60]}")
        print(f"      {item.get('url', '')[:70]}")

    print(f"\n✅ Ready to add {len(new_items)} sources!")
    print(f"   Project: {config['project_url']}")

    # Add to config
    if 'added_urls' not in config:
        config['added_urls'] = []
    config['added_urls'].extend([item['url'] for item in new_items])
    config['total_sources'] = config.get('total_sources', 0) + len(new_items)
    config['last_sync'] = datetime.now().isoformat()

    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)

    return {
        'status': 'success',
        'project_url': config['project_url'],
        'sources_added': len(new_items),
        'total_sources': config['total_sources'],
        'new_items': new_items
    }


if __name__ == '__main__':
    import sys

    if len(sys.argv) < 2:
        print("Usage: python3 sync_from_export.py <export_file>")
        print("\nSupported formats:")
        print("  - HTML export from WeChat")
        print("  - TXT file with URLs (one per line)")
        print("  - TXT file with pipe-delimited format:")
        print("    Title | URL | Date | Category")
        sys.exit(1)

    export_file = sys.argv[1]
    result = sync_from_export(export_file)

    if result['status'] == 'success':
        print(f"\n✅ Sync complete!")
        print(f"   Added: {result['sources_added']} sources")
        print(f"   Total: {result['total_sources']} sources")
    elif result['status'] == 'error':
        print(f"\n❌ Error: {result['message']}")
        sys.exit(1)
    else:
        print(f"\nℹ️  {result['message']}")
