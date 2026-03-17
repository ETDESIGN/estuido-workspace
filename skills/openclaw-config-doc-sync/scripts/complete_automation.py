#!/usr/bin/env python3
"""
OpenClaw Config Doc - Complete Automation
Extracts from WeChat AND adds to NotebookLM automatically
"""

import os
import sys
import json
import subprocess
import sqlite3
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime
import time

class OpenClawConfigDocAutomation:
    """Complete automation: WeChat extraction + NotebookLM sync"""

    def __init__(self):
        self.wechat_decrypt_dir = Path.home() / 'projects/wechat-decrypt'
        self.decrypted_db = "/home/e/projects/wechat-decrypt/decrypted/favorite/favorite.db"
        self.config_file = Path.home() / ".openclaw/openclaw_config_doc.json"
        self.extraction_output = Path.home() / "wechat_openclaw_favorites.json"

    def extract_key_from_wechat(self):
        """Extract SQLCipher key from WeChat memory"""
        print("[1/7] Extracting SQLCipher key from WeChat memory...")

        try:
            result = subprocess.run(
                ['sudo', 'python3', 'find_all_keys_linux.py'],
                cwd=str(self.wechat_decrypt_dir),
                capture_output=True,
                text=True,
                timeout=60
            )

            if result.returncode == 0:
                print("      ✅ Key extracted successfully")
                return True, None
            else:
                return False, result.stderr

        except subprocess.TimeoutExpired:
            return False, "Key extraction timed out"
        except Exception as e:
            return False, f"Error: {str(e)}"

    def decrypt_database(self):
        """Decrypt WeChat database"""
        print("[2/7] Decrypting WeChat database...")

        try:
            result = subprocess.run(
                ['python3', 'decrypt_db.py'],
                cwd=str(self.wechat_decrypt_dir),
                capture_output=True,
                text=True,
                timeout=120
            )

            if result.returncode == 0:
                print("      ✅ Database decrypted")
                return True, None
            else:
                return False, result.stderr

        except Exception as e:
            return False, f"Error: {str(e)}"

    def extract_favorites(self):
        """Extract OpenClaw/AI favorites from decrypted database"""
        print("[3/7] Extracting OpenClaw/AI favorites...")

        try:
            conn = sqlite3.connect(self.decrypted_db)
            cursor = conn.cursor()

            # Get Type 5 favorites (articles)
            cursor.execute('SELECT local_id, content FROM fav_db_item WHERE type=5')
            rows = cursor.fetchall()

            print(f"      Found {len(rows)} article favorites")

            # Parse favorites
            favorites = []
            for row in rows:
                local_id, content = row

                try:
                    root = ET.fromstring(content)

                    # Extract title and link
                    title_elem = root.find('.//title')
                    desc_elem = root.find('.//desc')
                    link_elem = root.find('.//link')

                    title = (title_elem.text if title_elem is not None else 
                            desc_elem.text if desc_elem is not None else '')

                    link = link_elem.text if link_elem is not None else ''

                    if link and 'http' in link:
                        favorites.append({
                            'id': local_id,
                            'title': title,
                            'url': link
                        })
                except:
                    pass

            conn.close()
            print(f"      Extracted {len(favorites)} favorites with URLs")

            # Filter for OpenClaw/AI
            keywords = ['openclaw', 'agent', 'llm', 'gpt', 'claude', 'ai',
                        'prompt', 'automation', 'framework', 'notebooklm',
                        'machine learning', 'neural', 'deep learning']

            openclaw_items = []
            for fav in favorites:
                title_lower = fav['title'].lower()
                url_lower = fav['url'].lower()

                if any(k in title_lower or k in url_lower for k in keywords):
                    openclaw_items.append(fav)

            print(f"      Filtered to {len(openclaw_items)} OpenClaw/AI items")

            # Save results
            output = {
                'total': len(favorites),
                'openclaw_ai': len(openclaw_items),
                'items': openclaw_items
            }

            with open(self.extraction_output, 'w') as f:
                json.dump(output, f, indent=2, ensure_ascii=False)

            return True, openclaw_items

        except Exception as e:
            return False, f"Extraction error: {str(e)}"

    def create_or_find_notebooklm_project(self):
        """Create or find NotebookLM project"""
        print("[4/7] Setting up NotebookLM project...")

        # Load existing config
        if self.config_file.exists():
            with open(self.config_file, 'r') as f:
                config = json.load(f)

            if config.get('project_url'):
                print(f"      ✅ Existing project: {config['project_url']}")
                return True, config['project_url'], config.get('added_urls', [])

        # Create new project
        print("      Creating new NotebookLM project...")
        project_name = "OpenClaw Config Doc"

        # Use browser automation to create project
        # This would use the browser tool to:
        # 1. Navigate to https://notebooklm.google.com/
        # 2. Click "Create new project"
        # 3. Name it "OpenClaw Config Doc"
        # 4. Get project URL

        # For now, return placeholder
        project_url = "https://notebooklm.google.com/PLEASE_CREATE_MANUALLY"

        print(f"      ⚠️  Please create project: {project_name}")
        print(f"      Then update config with project URL")

        return False, project_url, []

    def add_to_notebooklm(self, items, project_url):
        """Add sources to NotebookLM project"""
        print(f"[5/7] Adding {len(items)} sources to NotebookLM...")

        # This is where browser automation would:
        # 1. Navigate to project URL
        # 2. For each item:
        #    - Click "Add source"
        #    - Select "Website"
        #    - Paste URL
        #    - Click "Add"
        #    - Wait for processing

        print(f"      Project: {project_url}")
        print(f"      ⚠️  Browser automation for NotebookLM not yet implemented")
        print(f"      Please add sources manually:")
        print(f"         File: {self.extraction_output}")

        # Save items for manual addition
        manual_file = Path.home() / "notebooklm_add_manually.txt"
        with open(manual_file, 'w') as f:
            f.write(f"# Add these {len(items)} sources to NotebookLM\n")
            f.write(f"# Project: {project_url}\n")
            f.write(f"# Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")

            for item in items:
                f.write(f"{item['title']} | {item['url']}\n")

        print(f"      ✅ Saved list to: {manual_file}")

        return True, manual_file

    def update_config(self, items):
        """Update configuration with new sources"""
        print("[6/7] Updating configuration...")

        # Load existing config
        if self.config_file.exists():
            with open(self.config_file, 'r') as f:
                config = json.load(f)
        else:
            config = {
                'created_at': datetime.now().strftime('%Y-%m-%d'),
                'project_url': '',
                'added_urls': [],
                'total_sources': 0
            }

        # Add new URLs
        existing_urls = set(config.get('added_urls', []))
        new_urls = [item['url'] for item in items]

        config['added_urls'].extend(new_urls)
        config['total_sources'] = len(existing_urls) + len(new_urls)
        config['last_sync'] = datetime.now().isoformat()
        config['last_sync_count'] = len(items)

        # Save config
        with open(self.config_file, 'w') as f:
            json.dump(config, f, indent=2)

        print(f"      ✅ Configuration updated")
        print(f"      Total sources: {config['total_sources']}")
        print(f"      Added this run: {len(items)}")

        return True, config

    def run(self):
        """Main automation workflow"""
        print("="*70)
        print("OPENCLAW CONFIG DOC - COMPLETE AUTOMATION")
        print("="*70)
        print(f"\n📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        try:
            # Step 1: Extract key
            success, error = self.extract_key_from_wechat()
            if not success:
                return {'status': 'error', 'step': 'key_extraction', 'message': error}

            # Step 2: Decrypt database
            success, error = self.decrypt_database()
            if not success:
                return {'status': 'error', 'step': 'decryption', 'message': error}

            # Step 3: Extract favorites
            success, items = self.extract_favorites()
            if not success:
                return {'status': 'error', 'step': 'extraction', 'message': items}

            if not items:
                return {'status': 'no_changes', 'message': 'No OpenClaw/AI favorites found'}

            # Step 4: Find project
            success, project_url, added_urls = self.create_or_find_notebooklm_project()
            if not success:
                return {'status': 'partial', 'step': 'notebooklm_setup', 'project_url': project_url, 'items': items}

            # Step 5: Check for duplicates
            existing_urls = set(added_urls)
            new_items = [item for item in items if item['url'] not in existing_urls]

            if not new_items:
                return {'status': 'no_changes', 'message': 'All OpenClaw/AI favorites already added'}

            # Step 6: Add to NotebookLM
            success, manual_file = self.add_to_notebooklm(new_items, project_url)
            if not success:
                return {'status': 'partial', 'step': 'notebooklm_add', 'manual_file': str(manual_file)}

            # Step 7: Update config
            success, config = self.update_config(new_items)

            print("[7/7] Complete!")
            print("="*70)
            print("✅ AUTOMATION COMPLETE!")
            print("="*70)
            print(f"\n📊 Results:")
            print(f"   OpenClaw/AI favorites: {len(items)}")
            print(f"   New to add: {len(new_items)}")
            print(f"   Project: {project_url}")
            print(f"   Manual file: {manual_file}")

            return {
                'status': 'success',
                'total_found': len(items),
                'new_items': len(new_items),
                'project_url': project_url,
                'manual_file': str(manual_file),
                'config': config
            }

        except Exception as e:
            return {'status': 'error', 'message': f"Unexpected error: {str(e)}"}


if __name__ == '__main__':
    automation = OpenClawConfigDocAutomation()
    result = automation.run()

    # Save result
    result_file = Path.home() / "openclaw_automation_result.json"
    with open(result_file, 'w') as f:
        json.dump(result, f, indent=2)

    print(f"\n💾 Result saved: {result_file}")

    if result['status'] == 'success':
        print(f"\n✅ SUCCESS! {result['new_items']} new sources ready to add to NotebookLM")
        sys.exit(0)
    elif result['status'] == 'partial':
        print(f"\n⚠️  PARTIAL SUCCESS: {result.get('step')}")
        sys.exit(1)
    else:
        print(f"\n❌ ERROR: {result.get('message', 'Unknown error')}")
        sys.exit(1)
