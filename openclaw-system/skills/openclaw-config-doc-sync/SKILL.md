# OpenClaw Config Doc - Weekly Source Sync

**Purpose:** Automatically add OpenClaw/AI agent related links from WeChat favorites to a single NotebookLM project called "OpenClaw Config Doc".

## Key Requirements

- **Single Project:** "OpenClaw Config Doc" (created once, reused forever)
- **Weekly Sync:** Automatic cron job every week
- **Smart Filtering:** Only OpenClaw/AI agent related links
- **No Manual Work:** Fully automated after initial setup

## The Workflow

```
WeChat Favorites → Extract → Filter (OpenClaw/AI only) → Add to "OpenClaw Config Doc"
```

## User Commands

### Setup (one-time):
- "Setup OpenClaw Config Doc"
- "Initialize NotebookLM sync"

→ Creates the NotebookLM project, saves project URL for future runs

### Manual sync (anytime):
- "Sync OpenClaw sources"
- "Update Config Doc"
- "Add new favorites to NotebookLM"

→ Runs sync immediately (useful for testing)

### Check status:
- "Check sync status"
- "Show last sync results"

→ Shows what was added last time

## Configuration File

`~/.openclaw/openclaw_config_doc.json`

```json
{
  "project_url": "https://notebooklm.google.com/project/abc123",
  "project_id": "abc123",
  "created_at": "2026-03-16",
  "last_sync": "2026-03-16T02:55:00",
  "total_sources_added": 45,
  "category_filter": ["AI/ML", "Programming", "System/Config"]
}
```

## Procedure 1: Initial Setup

```python
from pathlib import Path
import json

def setup_project():
    """
    One-time setup: Create "OpenClaw Config Doc" project
    """
    print("="*60)
    print("OPENCLAW CONFIG DOC - SETUP")
    print("="*60)
    
    config_file = Path.home() / ".openclaw/openclaw_config_doc.json"
    
    # Check if already setup
    if config_file.exists():
        with open(config_file, 'r') as f:
            config = json.load(f)
            print(f"✅ Already configured!")
            print(f"   Project URL: {config.get('project_url')}")
            print(f"   Sources added: {config.get('total_sources_added', 0)}")
            return {'status': 'already_configured', 'config': config}
    
    # Create new project via browser
    print("[1/3] Creating NotebookLM project 'OpenClaw Config Doc'...")
    
    # Use browser automation to:
    # 1. Go to https://notebooklm.google.com/
    # 2. Click "Create new project"
    # 3. Name it "OpenClaw Config Doc"
    # 4. Create and extract URL
    
    project_url = create_notebooklm_project("OpenClaw Config Doc")
    project_id = extract_project_id(project_url)
    
    # Save config
    config = {
        "project_url": project_url,
        "project_id": project_id,
        "created_at": datetime.now().strftime('%Y-%m-%d'),
        "last_sync": None,
        "total_sources_added": 0,
        "category_filter": ["AI/ML", "Programming", "System/Config"]
    }
    
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"[2/3] Project created: {project_url}")
    print(f"[3/3] Configuration saved")
    
    return {
        'status': 'created',
        'project_url': project_url,
        'config': config
    }
```

## Procedure 2: Weekly Sync (Main Function)

```python
def sync_openclaw_sources():
    """
    Weekly sync: Extract WeChat favorites, filter OpenClaw/AI links, add to project
    """
    print("="*60)
    print("OPENCLAW CONFIG DOC - WEEKLY SYNC")
    print("="*60)
    
    config_file = Path.home() / ".openclaw/openclaw_config_doc.json"
    
    # Check if setup
    if not config_file.exists():
        return {
            'status': 'error',
            'message': 'Not configured. Run setup first.',
            'action': 'Say "Setup OpenClaw Config Doc"'
        }
    
    with open(config_file, 'r') as f:
        config = json.load(f)
    
    project_url = config['project_url']
    
    # Step 1: Extract WeChat favorites
    print(f"[1/5] Extracting WeChat favorites...")
    db_result = extract_wechat_favorites()
    
    if db_result.get('status') == 'error':
        if 'database' in db_result.get('message', '').lower():
            return {
                'status': 'error',
                'message': 'WeChat database not accessible',
                'hint': 'Please open WeChat and sign in, then retry',
                'action_required': 'Open WeChat and sign in'
            }
        return db_result
    
    all_items = db_result.get('items', [])
    print(f"      Found {len(all_items)} total favorites")
    
    # Step 2: Filter for OpenClaw/AI related
    print(f"[2/5] Filtering for OpenClaw/AI content...")
    filtered_items = filter_openclaw_items(all_items)
    print(f"      {len(filtered_items)} OpenClaw/AI related")
    
    if not filtered_items:
        return {
            'status': 'no_changes',
            'message': 'No new OpenClaw/AI links found',
            'last_sync': config.get('last_sync')
        }
    
    # Step 3: Check for duplicates
    print(f"[3/5] Checking for already-added sources...")
    new_items = get_only_new_items(filtered_items, project_url)
    print(f"      {len(new_items)} new sources to add")
    
    if not new_items:
        return {
            'status': 'no_changes',
            'message': 'All OpenClaw/AI links already in project',
            'last_sync': config.get('last_sync')
        }
    
    # Step 4: Add to NotebookLM project
    print(f"[4/5] Adding {len(new_items)} sources to project...")
    add_result = add_sources_to_project(project_url, new_items)
    
    # Step 5: Update config
    print(f"[5/5] Updating sync status...")
    config['last_sync'] = datetime.now().isoformat()
    config['total_sources_added'] = config.get('total_sources_added', 0) + len(new_items)
    
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)
    
    # Summary
    print("="*60)
    print(f"✅ SYNC COMPLETE")
    print(f"📁 Project: {project_url}")
    print(f"🆕 Added: {len(new_items)} sources")
    print(f"📊 Total: {config['total_sources_added']} sources")
    print("="*60)
    
    return {
        'status': 'success',
        'project_url': project_url,
        'sources_added': len(new_items),
        'total_sources': config['total_sources_added'],
        'new_items_preview': [
            {'title': i['title'][:50], 'url': i['url'][:50]} 
            for i in new_items[:5]
        ]
    }
```

## Procedure 3: Smart Filtering

```python
def filter_openclaw_items(items):
    """
    Filter items to only OpenClaw/AI agent related content
    """
    openclaw_keywords = [
        'openclaw', 'agent', 'llm', 'gpt', 'claude', 'ai assistant',
        'prompt engineering', 'ai automation', 'agent framework',
        'notebooklm', 'we', 'chatgpt', 'anthropic', 'openai',
        'ai workflow', 'agent system', 'ai agent'
    ]
    
    filtered = []
    for item in items:
        title_lower = item.get('title', '').lower()
        url_lower = item.get('url', '').lower()
        
        # Check if any keyword matches
        if any(k in title_lower or k in url_lower for k in openclaw_keywords):
            filtered.append(item)
    
    return filtered
```

## Procedure 4: Duplicate Detection

```python
def get_only_new_items(new_items, project_url):
    """
    Check which items are already in the project to avoid duplicates
    """
    # Get existing sources from project
    existing_urls = get_existing_source_urls(project_url)
    
    # Return only items not in existing set
    only_new = [
        item for item in new_items 
        if item.get('url') not in existing_urls
    ]
    
    return only_new
```

## Procedure 5: Error Recovery (User Notification)

```python
def sync_with_recovery():
    """
    Run sync with automatic error recovery and user notification
    """
    result = sync_openclaw_sources()
    
    if result.get('status') == 'error':
        hint = result.get('hint', '')
        
        if 'WeChat' in hint or 'database' in hint:
            # Send message to user
            send_user_message(
                "🔐 WeChat sign-in required",
                f"The weekly OpenClaw Config Doc sync failed because WeChat is not signed in.\n\n"
                f"Please:\n"
                f"1. Open WeChat\n"
                f"2. Sign in to your account\n"
                f"3. Say 'Sync OpenClaw sources' to retry\n\n"
                f"Project: {result.get('project_url', 'OpenClaw Config Doc')}"
            )
    
    return result

def send_user_message(subject, message):
    """
    Send notification to user via their preferred channel
    """
    # Use sessions_send or messaging tool to notify user
    # This respects user's notification preferences
    pass
```

## Cron Job Setup (Weekly Automation)

```bash
# Add to crontab for weekly execution (every Sunday 2 AM)
0 2 * * 0 /usr/bin/openclaw-agent "Sync OpenClaw sources" > /tmp/openclaw_sync.log 2>&1
```

Or using OpenClaw cron system:

```python
from openclaw.cron import add_job

add_job({
    'name': 'OpenClaw Config Doc Weekly Sync',
    'schedule': '0 2 * * 0',  # Every Sunday 2 AM
    'task': 'Sync OpenClaw sources',
    'on_failure': 'Send user message requesting WeChat sign-in'
})
```

## Success Response Format

```json
{
  "status": "success",
  "timestamp": "2026-03-16T02:55:00",
  "project_url": "https://notebooklm.google.com/project/abc123",
  "sources_added": 7,
  "total_sources": 52,
  "new_items_preview": [
    {
      "title": "Building AI Agents with OpenClaw",
      "url": "https://example.com/openclaw-agents"
    }
  ],
  "next_sync": "2026-03-23T02:00:00"
}
```

## Error Response Format

```json
{
  "status": "error",
  "timestamp": "2026-03-16T02:55:00",
  "message": "WeChat database not accessible",
  "hint": "Please open WeChat and sign in, then retry",
  "action_required": "Open WeChat and sign in",
  "project_url": "https://notebooklm.google.com/project/abc123",
  "retry_command": "Sync OpenClaw sources"
}
```

## Implementation Notes

**Browser Automation:**
- Uses agent-browser skill for NotebookLM interaction
- Only needs to be logged in once (Google session persists)
- Adds sources via "Add source" → "Website" flow

**WeChat Database Access:**
- Read-only access to favorites.db
- Fails gracefully if WeChat not signed in
- Sends user notification when manual intervention needed

**Duplicate Prevention:**
- Maintains list of added URLs in config
- Checks against existing project sources before adding
- Prevents clutter in NotebookLM project

## File Structure

```
~/.openclaw/
├── openclaw_config_doc.json       # Project config & state
└── wechat_favorites_archive/
    ├── NOTEBOOKLM_SOURCE_LIST.txt # All favorites (from other skill)
    └── openclaw_added_urls.txt    # Track added URLs (optional)
```

## Initial Setup Sequence

```
User: "Setup OpenClaw Config Doc"

You:
1. Check if WeChat is accessible
2. Extract favorites once
3. Filter for OpenClaw/AI content
4. Create NotebookLM project "OpenClaw Config Doc"
5. Add initial sources
6. Save config
7. Schedule weekly cron job
8. Confirm ready

Response:
✅ Setup complete!
📁 Project: https://notebooklm.google.com/project/xyz
📊 Added 45 sources
⏰ Next sync: Every Sunday 2 AM
💡 To sync manually: "Sync OpenClaw sources"
```

## Weekly Automation Behavior

**Normal Week:**
```
[Sunday 2 AM] → Sync runs → Adds 3-5 new links → Done
```

**WeChat Not Signed In:**
```
[Sunday 2 AM] → Sync fails → Sends you message:
"🔐 WeChat sign-in required - Please open WeChat and sign in"
```

**No New Links:**
```
[Sunday 2 AM] → Sync runs → No new links → Silent success
```

## Privacy & Security

- Only reads public links from WeChat favorites
- Never accesses private conversations
- Single NotebookLM project (not creating new ones)
- Config stored locally (~/.openclaw/)
- Respects user's Google session (no stored credentials)
