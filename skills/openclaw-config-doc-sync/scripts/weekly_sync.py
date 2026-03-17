#!/usr/bin/env python3
"""
OpenClaw Config Doc - Weekly Sync Script

Extracts OpenClaw/AI agent related links from WeChat favorites
and adds them to a single NotebookLM project called "OpenClaw Config Doc".

Usage:
    python weekly_sync.py              # Manual sync
    python weekly_sync.py --setup      # Initial setup
    python weekly_sync.py --status     # Check sync status
"""

import sys
import json
import sqlite3
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional

# Configuration
CONFIG_FILE = Path.home() / ".openclaw/openclaw_config_doc.json"
ARCHIVE_DIR = Path.home() / "wechat_favorites_archive"
OPENCLAW_KEYWORDS = [
    'openclaw', 'agent', 'llm', 'gpt', 'claude', 'ai assistant',
    'prompt engineering', 'ai automation', 'agent framework',
    'notebooklm', 'chatgpt', 'anthropic', 'openai',
    'ai workflow', 'agent system', 'ai agent'
]


class OpenClawConfigSync:
    """Main sync manager"""
    
    def __init__(self):
        self.archive_dir = ARCHIVE_DIR
        self.archive_dir.mkdir(exist_ok=True)
        self.config_file = CONFIG_FILE
        self.config = self.load_config()
    
    def load_config(self) -> Dict:
        """Load configuration"""
        if self.config_file.exists():
            with open(self.config_file, 'r') as f:
                return json.load(f)
        return {}
    
    def save_config(self):
        """Save configuration"""
        self.config_file.parent.mkdir(exist_ok=True)
        with open(self.config_file, 'w') as f:
            json.dump(self.config, f, indent=2)
    
    def locate_database(self) -> Optional[Path]:
        """Find WeChat favorites.db"""
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
                            return db_path
        return None
    
    def extract_from_xml(self, xml_raw: str) -> tuple:
        """Extract title and URL from WeChat XML"""
        if not xml_raw:
            return None, None
        
        title, url = "", ""
        
        try:
            root = ET.fromstring(xml_raw)
            appmsg = root.find('.//appmsg')
            
            if appmsg is not None:
                title_elem = appmsg.find('title')
                url_elem = appmsg.find('url')
                if title_elem is not None:
                    title = title_elem.text or ""
                if url_elem is not None:
                    url = url_elem.text or ""
            
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
        
        # Clean
        title = title.strip().replace('|', '-') if title else "Untitled"
        url = url.strip() if url else ""
        
        if url and not url.startswith(('http://', 'https://')):
            url = ""
        
        return (title, url) if url else (None, None)
    
    def extract_favorites(self) -> Dict:
        """Extract all favorites from WeChat database"""
        db_path = self.locate_database()
        
        if not db_path:
            return {
                'status': 'error',
                'message': 'WeChat database not found. Please open WeChat and sign in.',
                'action_required': 'Open WeChat and sign in'
            }
        
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
            
            items = []
            for row in rows:
                local_id, xml_raw, create_time, update_time = row
                title, url = self.extract_from_xml(xml_raw)
                if url:
                    items.append({
                        'id': local_id,
                        'title': title or 'Untitled',
                        'url': url,
                        'created': datetime.fromtimestamp(create_time).isoformat() if create_time else None,
                        'updated': datetime.fromtimestamp(update_time).isoformat() if update_time else None
                    })
            
            return {'status': 'success', 'items': items}
            
        except sqlite3.DatabaseError as e:
            return {
                'status': 'error',
                'message': f'Database locked or corrupted: {str(e)}',
                'action_required': 'Close WeChat and retry'
            }
        except Exception as e:
            return {
                'status': 'error',
                'message': f'Extraction error: {str(e)}'
            }
    
    def filter_openclaw_items(self, items: List[Dict]) -> List[Dict]:
        """Filter to only OpenClaw/AI related items"""
        filtered = []
        
        for item in items:
            title_lower = item.get('title', '').lower()
            url_lower = item.get('url', '').lower()
            
            if any(k in title_lower or k in url_lower for k in OPENCLAW_KEYWORDS):
                filtered.append(item)
        
        return filtered
    
    def get_new_items(self, items: List[Dict]) -> List[Dict]:
        """Get only items not yet added to project"""
        if not self.config.get('added_urls'):
            return items
        
        added_urls = set(self.config['added_urls'])
        
        return [item for item in items if item.get('url') not in added_urls]
    
    def setup_project(self):
        """Setup - Create NotebookLM project"""
        print("="*60)
        print("OPENCLAW CONFIG DOC - SETUP")
        print("="*60)
        
        if self.config.get('project_url'):
            print(f"✅ Already configured!")
            print(f"   Project: {self.config['project_url']}")
            print(f"   Sources: {self.config.get('total_sources', 0)}")
            return {'status': 'already_configured', 'config': self.config}
        
        print("[1/4] Extracting WeChat favorites...")
        extract_result = self.extract_favorites()
        
        if extract_result.get('status') == 'error':
            print(f"❌ {extract_result['message']}")
            return extract_result
        
        all_items = extract_result['items']
        print(f"      Found {len(all_items)} total favorites")
        
        print("[2/4] Filtering for OpenClaw/AI content...")
        openclaw_items = self.filter_openclaw_items(all_items)
        print(f"      {len(openclaw_items)} OpenClaw/AI related")
        
        if not openclaw_items:
            print("❌ No OpenClaw/AI favorites found")
            return {'status': 'error', 'message': 'No relevant favorites found'}
        
        print("[3/4] Creating NotebookLM project 'OpenClaw Config Doc'...")
        print("      → Please complete this in browser:")
        print("      1. Go to https://notebooklm.google.com/")
        print("      2. Click 'Create new project'")
        print("      3. Name it 'OpenClaw Config Doc'")
        print("      4. Create project")
        
        project_url = input("\nEnter project URL: ").strip()
        
        if not project_url:
            print("❌ Setup cancelled")
            return {'status': 'cancelled', 'message': 'No project URL provided'}
        
        print("[4/4] Saving configuration...")
        self.config['project_url'] = project_url
        self.config['project_id'] = project_url.split('/')[-1]
        self.config['created_at'] = datetime.now().strftime('%Y-%m-%d')
        self.config['added_urls'] = [item['url'] for item in openclaw_items]
        self.config['total_sources'] = len(openclaw_items)
        self.config['last_sync'] = datetime.now().isoformat()
        
        self.save_config()
        
        print(f"\n✅ Setup complete!")
        print(f"   Project: {project_url}")
        print(f"   Sources: {len(openclaw_items)}")
        print(f"   Next sync: Manual ('python weekly_sync.py') or via cron")
        
        return {
            'status': 'created',
            'project_url': project_url,
            'sources_added': len(openclaw_items),
            'config': self.config
        }
    
    def sync(self):
        """Weekly sync - Add new sources to project"""
        print("="*60)
        print("OPENCLAW CONFIG DOC - WEEKLY SYNC")
        print("="*60)
        
        if not self.config.get('project_url'):
            return {
                'status': 'error',
                'message': 'Not configured. Run --setup first'
            }
        
        print(f"[1/5] Extracting WeChat favorites...")
        extract_result = self.extract_favorites()
        
        if extract_result.get('status') == 'error':
            action = extract_result.get('action_required', '')
            if 'sign in' in action.lower():
                print(f"❌ {extract_result['message']}")
                print(f"\n📧 Please: {action}")
                print(f"   Then run: python weekly_sync.py")
                return {
                    'status': 'error',
                    'message': extract_result['message'],
                    'action_required': extract_result.get('action_required'),
                    'notify_user': True
                }
            return extract_result
        
        all_items = extract_result['items']
        print(f"      Found {len(all_items)} total favorites")
        
        print(f"[2/5] Filtering for OpenClaw/AI content...")
        openclaw_items = self.filter_openclaw_items(all_items)
        print(f"      {len(openclaw_items)} OpenClaw/AI related")
        
        if not openclaw_items:
            print("ℹ️  No OpenClaw/AI favorites found")
            return {
                'status': 'no_changes',
                'message': 'No OpenClaw/AI favorites found'
            }
        
        print(f"[3/5] Checking for new sources...")
        new_items = self.get_new_items(openclaw_items)
        print(f"      {len(new_items)} new to add")
        
        if not new_items:
            print("ℹ️  All sources already added")
            return {
                'status': 'no_changes',
                'message': 'All OpenClaw/AI links already in project',
                'last_sync': self.config.get('last_sync')
            }
        
        print(f"[4/5] Adding {len(new_items)} sources to project...")
        print(f"      Project: {self.config['project_url']}")
        print("\n→ Please add these sources in NotebookLM:")
        for i, item in enumerate(new_items, 1):
            print(f"   {i}. {item['title'][:50]}")
            print(f"      {item['url'][:60]}")
        
        # Simulate adding (in real implementation, use browser automation)
        input("\nPress Enter once sources are added...")
        
        print(f"[5/5] Updating sync status...")
        
        # Update added URLs
        if 'added_urls' not in self.config:
            self.config['added_urls'] = []
        self.config['added_urls'].extend([item['url'] for item in new_items])
        self.config['total_sources'] = self.config.get('total_sources', 0) + len(new_items)
        self.config['last_sync'] = datetime.now().isoformat()
        
        self.save_config()
        
        print(f"\n✅ Sync complete!")
        print(f"   Project: {self.config['project_url']}")
        print(f"   Added: {len(new_items)} sources")
        print(f"   Total: {self.config['total_sources']} sources")
        
        return {
            'status': 'success',
            'project_url': self.config['project_url'],
            'sources_added': len(new_items),
            'total_sources': self.config['total_sources'],
            'new_items': new_items[:5]
        }
    
    def status(self):
        """Show sync status"""
        print("="*60)
        print("OPENCLAW CONFIG DOC - STATUS")
        print("="*60)
        
        if not self.config:
            print("ℹ️  Not configured. Run --setup first")
            return
        
        print(f"Project: {self.config.get('project_url', 'Not set')}")
        print(f"Created: {self.config.get('created_at', 'Unknown')}")
        print(f"Last sync: {self.config.get('last_sync', 'Never')}")
        print(f"Total sources: {self.config.get('total_sources', 0)}")
        print("="*60)


def main():
    """CLI entry point"""
    sync = OpenClawConfigSync()
    
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        
        if cmd == '--setup':
            result = sync.setup_project()
        elif cmd == '--status':
            sync.status()
            return
        elif cmd == '--help':
            print("Usage: python weekly_sync.py [--setup|--status|--help]")
            return
        else:
            print(f"Unknown command: {cmd}")
            sys.exit(1)
    else:
        result = sync.sync()
    
    # Handle error that needs user notification
    if result.get('status') == 'error' and result.get('notify_user'):
        print(f"\n⚠️  USER NOTIFICATION REQUIRED")
        print(f"Please: {result.get('action_required', 'Check WeChat')}")
        sys.exit(1)


if __name__ == '__main__':
    main()
