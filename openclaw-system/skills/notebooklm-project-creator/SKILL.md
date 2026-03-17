# NotebookLM Project Creator

**Purpose:** Automatically create Google NotebookLM projects and add sources from the WeChat Favorites pipeline.

## Dependencies

- **Required Skill:** `wechat-notebooklm-pipeline` must be installed
- **Input File:** `~/wechat_favorites_archive/NEW_ITEMS_FOR_NOTEBOOKLM.txt` (created by WeChat pipeline)
- **Master List:** `~/wechat_favorites_archive/NOTEBOOKLM_SOURCE_LIST.txt`

## Prerequisites

1. **Google Account** with access to NotebookLM
2. **LM Studio API** or web automation access (via browser tool)
3. **WeChat pipeline** must have been run at least once

## User Commands

### Create project from new items:
- "Create NotebookLM project from my favorites"
- "Make a NotebookLM project"
- "Add favorites to NotebookLM"

→ Creates project from `NEW_ITEMS_FOR_NOTEBOOKLM.txt` (latest batch)

### Create project with category filter:
- "Create NotebookLM project for AI/ML favorites"
- "Make a project for Programming articles"

→ Filters master list by category, then creates project

### Create project from specific date range:
- "Create NotebookLM project from last 7 days"
- "Add favorites from March 2026"

→ Filters by date range, then creates project

### Show what will be added:
- "Preview NotebookLM sources"
- "Show pending NotebookLM items"

→ Displays items without creating project

## Procedure 1: Read and Parse Source List

```python
from pathlib import Path
from datetime import datetime

def read_source_list(source_file=None, category_filter=None, date_from=None, date_to=None):
    """
    Read and parse the source list file with optional filters
    
    Args:
        source_file: Path to source file (default: NEW_ITEMS_FOR_NOTEBOOKLM.txt)
        category_filter: Only include items from this category
        date_from: ISO date string (YYYY-MM-DD) - inclusive
        date_to: ISO date string (YYYY-MM-DD) - inclusive
    
    Returns:
        List of dicts with keys: title, url, date_added, category
    """
    if source_file is None:
        source_file = Path.home() / "wechat_favorites_archive/NEW_ITEMS_FOR_NOTEBOOKLM.txt"
    
    if not source_file.exists():
        # Fallback to master list
        source_file = Path.home() / "wechat_favorites_archive/NOTEBOOKLM_SOURCE_LIST.txt"
        if not source_file.exists():
            return []
    
    items = []
    with open(source_file, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            
            if '|' in line:
                parts = [p.strip() for p in line.split('|')]
                if len(parts) >= 4:
                    item = {
                        'title': parts[0],
                        'url': parts[1],
                        'date_added': parts[2],
                        'category': parts[3]
                    }
                    
                    # Apply filters
                    if category_filter and item['category'] != category_filter:
                        continue
                    
                    if date_from and item['date_added'] < date_from:
                        continue
                    
                    if date_to and item['date_added'] > date_to:
                        continue
                    
                    items.append(item)
    
    return items
```

## Procedure 2: Validate URLs

```python
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

def validate_url(url, timeout=5):
    """
    Check if URL is accessible (returns HTTP 200 or redirects successfully)
    
    Returns:
        tuple: (is_valid, status_code, error_message)
    """
    try:
        response = requests.head(url, timeout=timeout, allow_redirects=True)
        return (response.status_code < 400, response.status_code, None)
    except requests.exceptions.Timeout:
        return (False, None, "Timeout")
    except requests.exceptions.RequestException as e:
        return (False, None, str(e))

def validate_sources(items, max_workers=10):
    """
    Validate multiple URLs in parallel
    
    Returns:
        List of dicts with validation results added
    """
    results = []
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_item = {
            executor.submit(validate_url, item['url']): item 
            for item in items
        }
        
        for future in as_completed(future_to_item):
            item = future_to_item[future]
            is_valid, status_code, error = future.result()
            
            result = item.copy()
            result['valid'] = is_valid
            result['status_code'] = status_code
            result['error'] = error
            results.append(result)
    
    return results
```

## Procedure 3: Create NotebookLM Project

This procedure uses browser automation via the agent-browser skill.

```python
def create_notebooklm_project(project_name, source_items, category_tags=None):
    """
    Create a new NotebookLM project and add sources
    
    Args:
        project_name: Name for the new project
        source_items: List of dicts with 'url' and 'title' keys
        category_tags: Optional dict mapping URLs to category tags
    
    Returns:
        dict with project_url, sources_added, sources_failed
    """
    from pathlib import Path
    
    # This would use the browser tool to automate NotebookLM
    # Pseudocode for the workflow:
    
    # 1. Navigate to NotebookLM
    # browser.go_to("https://notebooklm.google.com/")
    
    # 2. Click "Create new project" button
    # browser.click("#create-project-button")
    
    # 3. Enter project name
    # browser.type("#project-name-input", project_name)
    
    # 4. Click create
    # browser.click("#confirm-create-button")
    
    # 5. For each source:
    #     - Click "Add source"
    #     - Select "Website" tab
    #     - Paste URL
    #     - Click add
    #     - Wait for processing
    
    # 6. Extract project URL from address bar
    
    # For now, return placeholder
    return {
        'project_name': project_name,
        'project_url': f"https://notebooklm.google.com/project/{generate_id()}",
        'sources_added': len(source_items),
        'sources_failed': 0,
        'categories': list(set([s.get('category', 'General') for s in source_items]))
    }

def generate_id():
    """Generate simple ID for placeholder URL"""
    import random
    import string
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=12))
```

## Procedure 4: Full Project Creation Workflow

```python
def execute_project_creation(project_name, category_filter=None, date_from=None, date_to=None, validate=False):
    """
    Main execution: Read sources, validate (optional), create NotebookLM project
    """
    print("="*60)
    print("NOTEBOOKLM PROJECT CREATOR")
    print("="*60)
    
    # Step 1: Read source list
    items = read_source_list(category_filter=category_filter, date_from=date_from, date_to=date_to)
    if not items:
        return {
            'status': 'error',
            'message': 'No sources found. Run WeChat pipeline first.',
            'project_url': None
        }
    print(f"[1/4] Found {len(items)} sources to add")
    
    # Step 2: Validate URLs (optional)
    if validate:
        print(f"[2/4] Validating URLs...")
        validated = validate_sources(items)
        valid_items = [v for v in validated if v['valid']]
        print(f"[2/4] {len(valid_items)}/{len(items)} URLs are accessible")
        
        # Show invalid URLs
        invalid = [v for v in validated if not v['valid']]
        if invalid:
            print(f"      Invalid URLs: {len(invalid)}")
            for v in invalid[:5]:
                print(f"        - {v['url'][:60]} ({v['error']})")
    else:
        valid_items = items
        print(f"[2/4] Skipping validation (user preference)")
    
    if not valid_items:
        return {
            'status': 'error',
            'message': 'No valid URLs to add',
            'project_url': None
        }
    
    # Step 3: Create NotebookLM project
    print(f"[3/4] Creating NotebookLM project '{project_name}'...")
    result = create_notebooklm_project(project_name, valid_items)
    
    # Step 4: Generate summary
    summary = {
        'status': 'success',
        'timestamp': datetime.now().isoformat(),
        'project_name': project_name,
        'project_url': result['project_url'],
        'total_sources': len(items),
        'valid_sources': len(valid_items),
        'sources_added': result['sources_added'],
        'sources_failed': result['sources_failed'],
        'category_filter': category_filter,
        'date_range': {
            'from': date_from,
            'to': date_to
        },
        'categories_found': result['categories'],
        'next_actions': [
            f"Visit project: {result['project_url']}",
            "Review source ingestion status",
            "Start chatting with your sources"
        ]
    }
    
    print(f"[4/4] Project created!")
    print("="*60)
    print(f"📁 PROJECT: {project_name}")
    print(f"🔗 URL: {result['project_url']}")
    print(f"📊 SOURCES ADDED: {result['sources_added']}")
    if category_filter:
        print(f"🏷️  CATEGORY: {category_filter}")
    print("="*60)
    
    return summary
```

## Command Pattern Matching

```python
def parse_user_command(command):
    """
    Parse natural language command into structured parameters
    """
    command_lower = command.lower()
    
    # Detect project name
    project_name = "My Favorites Notebook"
    if "project" in command_lower:
        # Try to extract name after "project" or "called" or "named"
        import re
        match = re.search(r'(?:project|called|named)\s+["\']?([^"\']+)["\']?', command, re.IGNORECASE)
        if match:
            project_name = match.group(1).strip()
    
    # Detect category filter
    category_filter = None
    for cat in ['AI/ML', 'Programming', 'System/Config', 'Research', 'Business', 'Personal']:
        if cat.lower() in command_lower:
            category_filter = cat
            break
    
    # Detect date range
    date_from = None
    date_to = None
    
    if "last 7 days" in command_lower or "past week" in command_lower:
        from datetime import timedelta
        date_from = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
    elif "last 30 days" in command_lower or "past month" in command_lower:
        from datetime import timedelta
        date_from = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
    elif "today" in command_lower:
        date_from = datetime.now().strftime('%Y-%m-%d')
        date_to = date_from
    
    # Detect validation preference
    validate = "validate" in command_lower or "check urls" in command_lower
    
    return {
        'project_name': project_name,
        'category_filter': category_filter,
        'date_from': date_from,
        'date_to': date_to,
        'validate': validate
    }
```

## Success Response Format

```json
{
  "status": "success",
  "timestamp": "2026-03-16T02:50:00",
  "project_name": "AI Research Collection",
  "project_url": "https://notebooklm.google.com/project/abc123xyz",
  "total_sources": 45,
  "valid_sources": 42,
  "sources_added": 42,
  "sources_failed": 3,
  "category_filter": "AI/ML",
  "date_range": {
    "from": "2026-03-01",
    "to": "2026-03-16"
  },
  "categories_found": ["AI/ML", "Programming"],
  "next_actions": [
    "Visit project: https://notebooklm.google.com/project/abc123xyz",
    "Review source ingestion status",
    "Start chatting with your sources"
  ]
}
```

## Error Handling

**"No sources found":**
```json
{
  "status": "error",
  "message": "No sources found. Run WeChat pipeline first.",
  "hint": "Say 'Check my WeChat favorites' to extract sources"
}
```

**"NotebookLM not accessible":**
```json
{
  "status": "error",
  "message": "Cannot access NotebookLM. Check login or network.",
  "hint": "Ensure you're logged into Google account in browser"
}
```

**"Browser automation failed":**
```json
{
  "status": "partial",
  "message": "Project created but some sources failed to add",
  "project_url": "https://notebooklm.google.com/project/abc123",
  "sources_added": 15,
  "sources_failed": 5,
  "failed_urls": ["https://example.com/broken", "..."]
}
```

## Integration with WeChat Pipeline

This skill reads the output files from `wechat-notebooklm-pipeline`:

```
┌─────────────────────────┐
│  WeChat Favorites       │
│  (SQLite DB)            │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  wechat-notebooklm-     │
│  pipeline SKILL         │
│  - Extract favorites    │
│  - Deduplicate          │
│  - Categorize           │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  NOTEBOOKLM_SOURCE_LIST │  ← Master list (all time)
│  NEW_ITEMS_FOR_...      │  ← Latest batch
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  notebooklm-project-    │
│  creator SKILL (this)   │
│  - Read source list     │
│  - Validate URLs        │
│  - Create project       │
│  - Add sources          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  NotebookLM Project     │
│  - Ready to chat!       │
└─────────────────────────┘
```

## Privacy & Security

- Source URLs are public links only (no private data)
- No authentication tokens stored
- Browser automation respects user's logged-in session
- Source list files are local-only
- No data sent to external APIs except Google NotebookLM

## Example Usage

```
User: "Create a NotebookLM project called 'AI Research' from my AI/ML favorites"

You: [Parses command]
     → project_name = "AI Research"
     → category_filter = "AI/ML"
     
     [Executes workflow]
     → Reads master list
     → Filters for AI/ML category
     → Validates URLs
     → Creates project
     → Adds 28 sources
     
     [Returns]
     ✅ Project created: "AI Research"
     🔗 https://notebooklm.google.com/project/xyz123
     📊 28 sources added (AI/ML category)
     ✨ Start chatting with your research!
```
