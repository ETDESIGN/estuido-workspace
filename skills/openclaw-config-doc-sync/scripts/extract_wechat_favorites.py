#!/home/e/projects/wechat-decrypt/venv/bin/python3
"""
WeChat Favorites Extraction with Memory Key Extraction
Requires elevated privileges to read process memory
"""

import os
import sys
import subprocess
import json
import sqlite3
from pathlib import Path

def check_wechat_running():
    """Check if WeChat is running"""
    try:
        result = subprocess.run(
            ['pgrep', '-f', 'wechat'],
            capture_output=True,
            text=True
        )
        pids = result.stdout.strip().split('\n') if result.stdout.strip() else []
        return pids[0] if pids else None
    except:
        return None

def extract_key_with_elevated_privileges():
    """Extract SQLCipher key from WeChat process memory"""

    wechat_decrypt_dir = Path.home() / 'projects/wechat-decrypt'
    config_file = wechat_decrypt_dir / 'config.json'

    print("="*60)
    print("WECHAT SQLCIPHER KEY EXTRACTION")
    print("="*60)

    # Check if config already exists
    if config_file.exists():
        print(f"\n✅ Configuration file already exists: {config_file}")
        with open(config_file, 'r') as f:
            config = json.load(f)

        if config.get('keys'):
            print(f"   Found {len(config['keys'])} previously extracted keys")
            return config['keys'][0]  # Return first key

    # Check if WeChat is running
    pid = check_wechat_running()
    if not pid:
        return None, "WeChat is not running. Please start WeChat first."

    print(f"\n[1/3] WeChat is running (PID: {pid})")
    print(f"[2/3] Extracting SQLCipher key from process memory...")
    print(f"\n⚠️  This requires elevated privileges to read process memory.")
    print(f"   Please run: sudo python3 {__file__}")

    return None, "Elevated privileges required"

def decrypt_database(key, input_db, output_db):
    """Decrypt WeChat database using extracted key"""

    wechat_decrypt_dir = Path.home() / 'projects/wechat-decrypt'
    decrypt_script = wechat_decrypt_dir / 'decrypt_db.py'
    venv_python = wechat_decrypt_dir / 'venv/bin/python3'

    print(f"[3/3] Decrypting database...")

    try:
        subprocess.run([
            str(venv_python),
            str(decrypt_script),
            '--key', key,
            '--input', input_db,
            '--output', output_db
        ], check=True, capture_output=True, text=True)

        return output_db, None
    except subprocess.CalledProcessError as e:
        return None, f"Decryption failed: {e.stderr}"
    except Exception as e:
        return None, f"Error: {str(e)}"

def extract_favorites_from_decrypted_db(decrypted_db):
    """Extract favorites from decrypted database"""

    print(f"\n[EXTRACTION] Reading favorites from decrypted database...")

    try:
        conn = sqlite3.connect(decrypted_db)
        cursor = conn.cursor()

        # Get table schema
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [t[0] for t in cursor.fetchall()]
        print(f"   Found tables: {tables}")

        # Try different possible table names
        possible_tables = ['FavoritesItemTable', 'FavoriteItem', 'Favorites', 'favorite']

        favorites_table = None
        for table in possible_tables:
            if table in tables:
                favorites_table = table
                break

        if not favorites_table:
            return None, f"No favorites table found. Available: {tables}"

        print(f"   Using table: {favorites_table}")

        # Get schema
        cursor.execute(f"PRAGMA table_info({favorites_table})")
        columns = [col[1] for col in cursor.fetchall()]
        print(f"   Columns: {columns}")

        # Extract data
        cursor.execute(f"SELECT * FROM {favorites_table} LIMIT 5")
        rows = cursor.fetchall()

        print(f"   Sample rows: {len(rows)}")

        conn.close()

        return rows, None

    except Exception as e:
        return None, f"Extraction error: {str(e)}"

def main():
    """Main extraction workflow"""

    print("\n" + "="*60)
    print("WECHAT FAVORITES EXTRACTION - FULL AUTOMATION")
    print("="*60)

    # Step 1: Extract key
    print("\n[STEP 1] Extracting SQLCipher key from memory...")
    key, error = extract_key_with_elevated_privileges()

    if error:
        print(f"❌ {error}")
        print(f"\n💡 Solution: Run with sudo:")
        print(f"   sudo {sys.executable} {__file__}")
        return

    print(f"✅ Key extracted: {key[:16]}...")

    # Step 2: Decrypt database
    print(f"\n[STEP 2] Decrypting WeChat favorites database...")
    input_db = "/home/e/Documents/xwechat_files/wxid_2njjt71zxgh221_58f9/db_storage/favorite/favorite.db"
    output_db = "/tmp/favorite_decrypted.db"

    decrypted_db, error = decrypt_database(key, input_db, output_db)

    if error:
        print(f"❌ {error}")
        return

    print(f"✅ Database decrypted: {decrypted_db}")

    # Step 3: Extract favorites
    print(f"\n[STEP 3] Extracting favorites...")
    favorites, error = extract_favorites_from_decrypted_db(decrypted_db)

    if error:
        print(f"❌ {error}")
        return

    print(f"✅ Extracted {len(favorites) if favorites else 0} favorites")

    # Save results
    output_file = Path.home() / "wechat_favorites_extracted.json"
    with open(output_file, 'w') as f:
        json.dump({
            'status': 'success',
            'key': key,
            'decrypted_db': decrypted_db,
            'favorites_count': len(favorites) if favorites else 0,
            'timestamp': subprocess.check_output(['date', '-Iseconds']).decode().strip()
        }, f, indent=2)

    print(f"\n✅ Results saved to: {output_file}")
    print("="*60)

if __name__ == '__main__':
    main()
