# WeChat Favorites → NotebookLM Pipeline

**Purpose:** Extract WeChat favorites, maintain a deduplicated URL list file, and prepare structured data for automatic ingestion into Google NotebookLM projects.

## Technical Environment

- **OS:** Ubuntu (Linux)
- **WeChat Version:** wechat-universal (official Linux client)
- **Database:** SQLite3/SQLCipher at `~/Documents/xwechat_files/[WXID]/Favorites/favorites.db`
- **Archive Directory:** `~/wechat_favorites_archive/`
- **Critical Output File:** `NOTEBOOKLM_SOURCE_LIST.txt` (the pipeline source of truth)

## Core Output Requirement: The Master List File

You MUST maintain a primary file at:
```
~/wechat_favorites_archive/NOTEBOOKLM_SOURCE_LIST.txt
```

This file format is STRICT:
- One entry per line
- Format: `TITLE | URL | DATE_ADDED | CATEGORY`
- Pipe-delimited (`|`) for easy parsing
- UTF-8 encoding
- Chronological order (newest at bottom)
- NO duplicates (check URL field before appending)

Example line:
```
Building AI Agents with LLMs | https://example.com/ai-agents | 2026-03-16 | AI/ML
```

## Database Schema

Table: `FavoritesItemTable`
Key fields: `localId`, `xml` (contains title/url), `sourceCreateTime`, `updateTime`

## Procedure 1: Database Location (Auto-Discovery)

```python
from pathlib import Path

def locate_database():
    """Find WeChat favorites.db on Ubuntu"""
    search_paths = [
        Path.home() / "Documents/xwechat_files",
        Path.home() / ".local/share/WeChat_Data/xwechat_files", 
        Path.home() / ".config/wechat/xwechat_files",
    ]
    
    for base in search_paths:
        if base.exists():
            for wxid_folder in base.iterdir():
                if wxid_folder.is_dir():
                    db_path = wxid_folder / "Favorites/favorites.db"
                    if db_path.exists():
                        return db_path, wxid_folder.name
    return None, None
```

## Procedure 2: XML Extraction (Get Title + URL)

```python
import xml.etree.ElementTree as ET
import re

def extract_from_xml(xml_raw):
    """Mandatory: Extract clean title and URL from WeChat XML"""
    if not xml_raw:
        return None, None
    
    title, url = "", ""
    
    # Try 1: Standard XML parsing
    try:
        root = ET.fromstring(xml_raw)
        
        # appmsg structure (most common for articles)
        appmsg = root.find('.//appmsg')
        if appmsg is not None:
            title_elem = appmsg.find('title')
            url_elem = appmsg.find('url')
            if title_elem is not None:
                title = title_elem.text or ""
            if url_elem is not None:
                url = url_elem.text or ""
        
        # Direct fields fallback
        if not title:
            title_elem = root.find('.//title')
            if title_elem is not None:
                title = title_elem.text or ""
        if not url:
            url_elem = root.find('.//url')
            if url_elem is not None:
                url = url_elem.text or ""
        
    except ET.ParseError:
        pass
    
    # Try 2: Regex fallback for malformed XML
    if not title:
        match = re.search(r'<title>([^<]+)</title>', xml_raw)
        if match:
            title = match.group(1)
    if not url:
        match = re.search(r'<url>([^<]+)</url>', xml_raw)
        if match:
            url = match.group(1)
        # Also check for CDATA
        if not url and 'CDATA' in xml_raw:
            cdata_match = re.search(r'https?://[^\s<>"{}|\\^`\[\]]+', xml_raw)
            if cdata_match:
                url = cdata_match.group(0)
    
    # Clean title
    title = title.strip().replace('|', '-') if title else "Untitled"
    url = url.strip() if url else ""
    
    # Validate URL
    if url and not url.startswith(('http://', 'https://')):
        url = ""
    
    return (title, url) if url else (None, None)
```

## Procedure 3: The Critical List File Manager

```python
import os
from datetime import datetime
from pathlib import Path

class NotebookLMListManager:
    """
    Manages the NOTEBOOKLM_SOURCE_LIST.txt file
    Ensures: deduplication, proper formatting, append-only for new items
    """
    
    def __init__(self):
        self.archive_dir = Path.home() / "wechat_favorites_archive"
        self.archive_dir.mkdir(exist_ok=True)
        self.list_file = self.archive_dir / "NOTEBOOKLM_SOURCE_LIST.txt"
        self.new_items_file = self.archive_dir / "NEW_ITEMS_FOR_NOTEBOOKLM.txt"
    
    def load_existing_urls(self):
        """Load set of existing URLs for deduplication check"""
        existing = set()
        if not self.list_file.exists():
            return existing
        
        with open(self.list_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if '|' in line:
                    parts = line.split('|')
                    if len(parts) >= 2:
                        url = parts[1].strip()
                        existing.add(url)
        return existing
    
    def categorize(self, title, url):
        """Simple keyword-based categorization for NotebookLM organization"""
        title_lower = title.lower()
        categories = {
            'AI/ML': ['ai', 'llm', 'model', 'gpt', 'claude', 'neural', 'machine learning', 'openclaw'],
            'Programming': ['code', 'python', 'javascript', 'github', 'api', 'script'],
            'System/Config': ['ubuntu', 'linux', 'config', 'setup', 'install', 'docker'],
            'Research': ['paper', 'study', 'research', 'arxiv', 'survey'],
            'Business': ['startup', 'marketing', 'product', 'saas', 'revenue'],
            'Personal': ['health', 'life', 'travel', 'food', 'recipe']
        }
        
        for cat, keywords in categories.items():
            if any(k in title_lower or k in url.lower() for k in keywords):
                return cat
        return "General"
    
    def append_new_items(self, new_items):
        """
        CRITICAL FUNCTION: Append only new, deduplicated items to master list
        Also creates a separate NEW_ITEMS file for immediate NotebookLM processing
        """
        existing_urls = self.load_existing_urls()
        truly_new = []
        appended_count = 0
        
        today = datetime.now().strftime('%Y-%m-%d')
        
        # Open master file in append mode
        with open(self.list_file, 'a', encoding='utf-8') as master_f:
            for item in new_items:
                url = item.get('url', '').strip()
                title = item.get('title', 'Untitled').strip()
                
                # Skip if no URL or already exists
                if not url or url in existing_urls:
                    continue
                
                # Skip duplicates within this batch
                if url in [i['url'] for i in truly_new]:
                    continue
                
                category = self.categorize(title, url)
                
                # Format: TITLE | URL | DATE | CATEGORY
                line = f"{title} | {url} | {today} | {category}\n"
                master_f.write(line)
                
                truly_new.append({
                    'title': title,
                    'url': url,
                    'date': today,
                    'category': category,
                    'line': line.strip()
                })
                appended_count += 1
        
        # Create the NEW_ITEMS file for immediate processing
        if truly_new:
            with open(self.new_items_file, 'w', encoding='utf-8') as f:
                f.write(f"# NEW ITEMS FOR NOTEBOOKLM - {today}\n")
                f.write(f"# Total: {len(truly_new)} items\n\n")
                for item in truly_new:
                    f.write(f"{item['line']}\n")
        
        return truly_new, appended_count
    
    def get_stats(self):
        """Return current list statistics"""
        if not self.list_file.exists():
            return 0, 0
        
        total = 0
        categories = {}
        with open(self.list_file, 'r', encoding='utf-8') as f:
            for line in f:
                if '|' in line:
                    total += 1
                    parts = line.split('|')
                    if len(parts) >= 4:
                        cat = parts[3].strip()
                        categories[cat] = categories.get(cat, 0) + 1
        return total, categories
    
    def read_list_for_notebooklm(self):
        """Return clean list for NotebookLM ingestion"""
        if not self.list_file.exists():
            return []
        
        items = []
        with open(self.list_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if '|' in line:
                    parts = [p.strip() for p in line.split('|')]
                    if len(parts) >= 4:
                        items.append({
                            'title': parts[0],
                            'url': parts[1],
                            'date_added': parts[2],
                            'category': parts[3]
                        })
        return items
```

## Procedure 4: Full Extraction Workflow

```python
import sqlite3
import json
from datetime import datetime

def execute_full_sync():
    """
    Main execution: Extract from WeChat, update list file, prepare for NotebookLM
    """
    print("="*60)
    print("WECHAT FAVORITES → NOTEBOOKLM PIPELINE")
    print("="*60)
    
    # Step 1: Locate database
    db_path, wxid = locate_database()
    if not db_path:
        return {
            'status': 'error',
            'message': 'WeChat database not found. Check if WeChat is installed and logged in.',
            'list_file': None
        }
    print(f"[1/5] Database found: {db_path}")
    
    # Step 2: Connect and extract
    try:
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        cursor.execute("""
            SELECT localId, xml, sourceCreateTime, updateTime 
            FROM FavoritesItemTable 
            ORDER BY updateTime DESC
        """)
        rows = cursor.fetchall()
        conn.close()
        print(f"[2/5] Retrieved {len(rows)} raw records from database")
    except Exception as e:
        return {'status': 'error', 'message': f'Database error: {str(e)}'}
    
    # Step 3: Parse all items
    parsed_items = []
    for row in rows:
        local_id, xml_raw, create_time, update_time = row
        title, url = extract_from_xml(xml_raw)
        if url: # Only keep items with valid URLs
            parsed_items.append({
                'id': local_id,
                'title': title or 'Untitled',
                'url': url,
                'created': datetime.fromtimestamp(create_time).isoformat() if create_time else None,
                'updated': datetime.fromtimestamp(update_time).isoformat() if update_time else None
            })
    print(f"[3/5] Parsed {len(parsed_items)} valid URL items")
    
    # Step 4: Update list manager (CRITICAL STEP)
    list_manager = NotebookLMListManager()
    new_items, count = list_manager.append_new_items(parsed_items)
    total, categories = list_manager.get_stats()
    print(f"[4/5] List file updated: +{count} new items (total: {total})")
    
    # Step 5: Generate summary and NotebookLM-ready output
    summary = {
        'status': 'success',
        'timestamp': datetime.now().isoformat(),
        'wechat_account': wxid,
        'total_items_in_list': total,
        'new_items_added': count,
        'categories': categories,
        'list_file_location': str(list_manager.list_file),
        'new_items_file': str(list_manager.new_items_file) if new_items else None,
        'notebooklm_ready': len(new_items) > 0,
        'new_items_preview': [
            {'title': i['title'][:60], 'url': i['url'][:80], 'category': i['category']} 
            for i in new_items[:10]
        ]
    }
    
    # Also save JSON metadata for automation
    meta_file = list_manager.archive_dir / "last_sync_metadata.json"
    with open(meta_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print(f"[5/5] Sync complete. Output: {list_manager.list_file}")
    print("="*60)
    print(f"📋 TOTAL IN LIST: {total}")
    print(f"🆕 NEW THIS RUN: {count}")
    print(f"📁 Master list: {list_manager.list_file}")
    if new_items:
        print(f"🚀 New items file: {list_manager.new_items_file}")
    print("="*60)
    
    return summary
```

## User Commands (Trigger Words)

When user says any variation of these, execute the appropriate function:

### Extraction commands:
- "Check my WeChat favorites"
- "Update favorites list"
- "Sync favorites"
- "Run WeChat pipeline"
- "Update NotebookLM sources"

→ Execute: `execute_full_sync()`

### Status commands:
- "Show favorite stats"
- "How many favorites do I have"
- "List categories"

→ Execute: `NotebookLMListManager().get_stats()`

### Readiness check:
- "Show list file"
- "What's in the NotebookLM list"

→ Return: First 20 lines of `NOTEBOOKLM_SOURCE_LIST.txt`

### Force full rebuild:
- "Rebuild list from scratch"
- "Clear and resync"

→ Delete `NOTEBOOKLM_SOURCE_LIST.txt`, then run full sync

## Output File Specifications

### Primary File: NOTEBOOKLM_SOURCE_LIST.txt
- **Location:** `~/wechat_favorites_archive/NOTEBOOKLM_SOURCE_LIST.txt`
- **Format:** `TITLE | URL | DATE_ADDED | CATEGORY`
- **Encoding:** UTF-8
- **Line endings:** LF (Unix)
- **Sorting:** Chronological (oldest top, newest bottom)
- **Deduplication:** URL field is unique key

### Secondary File: NEW_ITEMS_FOR_NOTEBOOKLM.txt
- Created only when new items found
- Content: Same format as master list
- Purpose: Feed this file directly to NotebookLM "Add Sources" automation
- Auto-deleted: Overwritten on each run (contains only current batch)

### Metadata: last_sync_metadata.json
- Full JSON summary of last run
- Used for automation tracking

## NotebookLM Integration Preparation

The list file is designed for this next workflow step:

```
User: "Create NotebookLM project from my favorites"
→ You (OpenClaw) will:
  1. Read NOTEBOOKLM_SOURCE_LIST.txt
  2. Filter by category if requested
  3. Use Google LM Studio skill to:
     - Create project "OpenClaw Config Doc" (or user-specified name)
     - Add each URL as a source via NotebookLM API/web automation
  4. Return: Project URL + source count added
```

## Mandatory Checks Before Each Run

- [ ] Database file exists and is readable
- [ ] Archive directory exists (create if not)
- [ ] Master list file exists (create empty if not)
- [ ] Deduplication set loaded successfully
- [ ] At least one item has valid URL after parsing

## Error Handling

**"WeChat is running, database locked":**
→ Return: `{'status': 'locked', 'message': 'Close WeChat and retry', 'retry_in': '5 minutes'}`

**"No new items found":**
→ Return: `{'status': 'no_changes', 'total_items': X, 'message': 'List is up to date'}`

**"Database encrypted":**
→ Attempt SQLCipher with empty password, then return specific error if failed

**"Zero valid URLs extracted":**
→ Check XML parsing, return debug sample of raw XML for diagnosis

## Success Response Format

Always end with this structure:

```json
{
  "status": "success",
  "list_file": "/home/user/wechat_favorites_archive/NOTEBOOKLM_SOURCE_LIST.txt",
  "total_items": 450,
  "new_items_added": 12,
  "new_items_file": "/home/user/wechat_favorites_archive/NEW_ITEMS_FOR_NOTEBOOKLM.txt",
  "categories": {"AI/ML": 120, "Programming": 89, "General": 241},
  "ready_for_notebooklm": true,
  "next_step": "Create NotebookLM project and add sources from NEW_ITEMS_FOR_NOTEBOOKLM.txt"
}
```

## Privacy & Security

- Database is read-only access (never write to WeChat DB)
- List file is local only (no cloud upload)
- URLs are public links only (no private data extraction)
- Respect robots.txt when later crawling for NotebookLM
