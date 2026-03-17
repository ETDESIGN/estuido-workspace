#!/usr/bin/env python3
"""
OpenClaw Config Doc - Fully Automated WeChat Sync
Extracts from WeChat database using memory key extraction
"""

import os
import sys
import json
import subprocess
import sqlite3
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime

class WeChatFavoritesExtractor:
    """Extract WeChat favorites using memory key extraction"""

    def __init__(self):
        self.wechat_decrypt_dir = Path.home() / 'projects/wechat-decrypt'
        self.config_file = self.wechat_decrypt_dir / 'config.json'
        self.venv_python = self.wechat_decrypt_dir / 'venv/bin/python3'
        self.input_db = "/home/e/Documents/xwechat_files/wxid_2njjt71zxgh221_58f9/db_storage/favorite/favorite.db"
        self.output_db = "/tmp/favorite_decrypted.db"

    def check_wechat_running(self):
        """Check if WeChat is running"""
        try:
            result = subprocess.run(
                ['pgrep', '-f', 'wechat'],
                capture_output=True,
                text=True
            )
            return bool(result.stdout.strip())
        except:
            return False

    def extract_key(self):
        """Extract SQLCipher key from process memory"""

        print("[1/5] Checking if WeChat is running...")
        if not self.check_wechat_running():
            return None, "WeChat is not running. Please start WeChat first."

        print("      ✅ WeChat is running")

        print("[2/5] Extracting SQLCipher key from process memory...")

        # Check if key already exists in config
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r') as f:
                    config = json.load(f)
                if config.get('keys'):
                    print("      ✅ Using previously extracted key")
                    return config['keys'][0], None
            except:
                pass

        # Extract new key (requires sudo)
        print("      ⚠️  Key extraction requires elevated privileges")
        print("      Running: sudo python3 find_all_keys_linux.py")

        try:
            result = subprocess.run(
                ['sudo', str(self.venv_python), 'find_all_keys_linux.py'],
                cwd=str(self.wechat_decrypt_dir),
                capture_output=True,
                text=True,
                timeout=60
            )

            if result.returncode == 0 and self.config_file.exists():
                with open(self.config_file, 'r') as f:
                    config = json.load(f)
                if config.get('keys'):
                    print("      ✅ Key extracted successfully")
                    return config['keys'][0], None

            return None, "Key extraction failed. Please run manually with sudo."

        except subprocess.CalledProcessError as e:
            return None, f"Key extraction failed: {e.stderr}"
        except Exception as e:
            return None, f"Error: {str(e)}"

    def decrypt_database(self, key):
        """Decrypt WeChat database"""

        print("[3/5] Decrypting database...")

        decrypt_script = self.wechat_decrypt_dir / 'decrypt_db.py'

        try:
            subprocess.run([
                str(self.venv_python),
                str(decrypt_script),
                '--key', key,
                '--input', self.input_db,
                '--output', self.output_db
            ], check=True, capture_output=True, text=True, timeout=120)

            print("      ✅ Database decrypted successfully")
            return self.output_db, None

        except subprocess.CalledProcessError as e:
            return None, f"Decryption failed: {e.stderr}"
        except Exception as e:
            return None, f"Error: {str(e)}"

    def extract_from_xml(self, xml_raw):
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

        title = title.strip().replace('|', '-') if title else "Untitled"
        url = url.strip() if url else ""

        if url and not url.startswith(('http://', 'https://')):
            url = ""

        return (title, url) if url else (None, None)

    def extract_favorites(self, decrypted_db):
        """Extract favorites from decrypted database"""

        print("[4/5] Extracting favorites...")

        try:
            conn = sqlite3.connect(decrypted_db)
            cursor = conn.cursor()

            # Get table names
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [t[0] for t in cursor.fetchall()]

            # Find favorites table
            favorites_table = None
            for possible in ['FavoritesItemTable', 'FavoriteItem', 'Favorites', 'favorite']:
                if possible in tables:
                    favorites_table = possible
                    break

            if not favorites_table:
                return None, f"No favorites table found. Available: {tables}"

            # Extract data
            cursor.execute(f"SELECT * FROM {favorites_table}")
            rows = cursor.fetchall()
            conn.close()

            # Parse favorites
            items = []
            for row in rows:
                # Assuming XML is in column 1 (adjust if needed)
                if len(row) > 1:
                    xml_raw = row[1]
                    title, url = self.extract_from_xml(xml_raw)
                    if url:
                        items.append({
                            'title': title,
                            'url': url,
                            'id': row[0] if len(row) > 0 else None
                        })

            print(f"      ✅ Extracted {len(items)} favorites")
            return items, None

        except Exception as e:
            return None, f"Extraction error: {str(e)}"

    def filter_openclaw_items(self, items):
        """Filter for OpenClaw/AI content"""

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

    def run(self):
        """Main extraction workflow"""

        print("="*60)
        print("WECHAT FAVORITES EXTRACTION - FULL AUTOMATION")
        print("="*60)
        print(f"\n📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

        try:
            # Step 1: Extract key
            key, error = self.extract_key()
            if error:
                return {'status': 'error', 'message': error, 'step': 'key_extraction'}

            # Step 2: Decrypt database
            decrypted_db, error = self.decrypt_database(key)
            if error:
                return {'status': 'error', 'message': error, 'step': 'decryption'}

            # Step 3: Extract favorites
            favorites, error = self.extract_favorites(decrypted_db)
            if error:
                return {'status': 'error', 'message': error, 'step': 'extraction'}

            # Step 4: Filter for OpenClaw/AI
            print("[5/5] Filtering for OpenClaw/AI content...")
            openclaw_items = self.filter_openclaw_items(favorites)
            print(f"      ✅ {len(openclaw_items)} OpenClaw/AI related")

            print("\n" + "="*60)
            print("✅ EXTRACTION COMPLETE!")
            print(f"   Total favorites: {len(favorites)}")
            print(f"   OpenClaw/AI: {len(openclaw_items)}")
            print("="*60)

            return {
                'status': 'success',
                'total_favorites': len(favorites),
                'openclaw_items': len(openclaw_items),
                'items': openclaw_items,
                'decrypted_db': decrypted_db
            }

        except Exception as e:
            return {'status': 'error', 'message': f"Unexpected error: {str(e)}"}


if __name__ == '__main__':
    extractor = WeChatFavoritesExtractor()
    result = extractor.run()

    # Save result
    output_file = Path.home() / "wechat_extraction_result.json"
    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2)

    print(f"\n💾 Result saved to: {output_file}")

    if result['status'] == 'error':
        print(f"\n❌ Error: {result['message']}")
        sys.exit(1)
    else:
        print(f"\n✅ Success! Extracted {result['openclaw_items']} OpenClaw/AI favorites")
