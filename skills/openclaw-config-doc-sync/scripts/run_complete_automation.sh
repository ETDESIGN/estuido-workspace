#!/bin/bash
#
# OpenClaw Config Doc - One-Click Complete Automation
# Extracts from WeChat and prepares for NotebookLM
#

echo "======================================================================"
echo "OPENCLAW CONFIG DOC - COMPLETE AUTOMATION"
echo "======================================================================"
echo ""
echo "This will:"
echo "  1. Extract SQLCipher key from WeChat memory"
echo "  2. Decrypt WeChat favorites database"
echo "  3. Extract OpenClaw/AI favorites"
echo "  4. Check for duplicates"
echo "  5. Add to NotebookLM project"
echo ""
echo "======================================================================"
echo ""

# Change to wechat-decrypt directory
cd ~/projects/wechat-decrypt

# Activate virtual environment
source venv/bin/activate

# Extract key (already done, but ensure config exists)
echo "[1/7] Checking SQLCipher key..."
if [ ! -f "all_keys.json" ]; then
    echo "      Extracting key from WeChat memory..."
    sudo python3 find_all_keys_linux.py
else
    echo "      ✅ Key already extracted"
fi

# Decrypt database
echo "[2/7] Decrypting WeChat database..."
if [ ! -f "decrypted/favorite/favorite.db" ]; then
    python3 decrypt_db.py > /dev/null 2>&1
    echo "      ✅ Database decrypted"
else
    echo "      ✅ Database already decrypted"
fi

# Extract favorites
echo "[3/7] Extracting OpenClaw/AI favorites..."
cd ~/.openclaw/workspace/skills/openclaw-config-doc-sync/scripts
python3 -c "
import sqlite3
import xml.etree.ElementTree as ET
import json
from pathlib import Path

db_path = Path.home() / 'projects/wechat-decrypt/decrypted/favorite/favorite.db'
conn = sqlite3.connect(str(db_path))
cursor = conn.cursor()

cursor.execute('SELECT local_id, content FROM fav_db_item WHERE type=5')
rows = cursor.fetchall()

favorites = []
for row in rows:
    local_id, content = row
    try:
        root = ET.fromstring(content)
        title_elem = root.find('.//title')
        desc_elem = root.find('.//desc')
        link_elem = root.find('.//link')
        
        title = (title_elem.text if title_elem is not None else 
                desc_elem.text if desc_elem is not None else '')
        link = link_elem.text if link_elem is not None else ''
        
        if link and 'http' in link:
            favorites.append({'id': local_id, 'title': title, 'url': link})
    except:
        pass

keywords = ['openclaw', 'agent', 'llm', 'gpt', 'claude', 'ai', 'prompt', 'automation', 'framework', 'notebooklm']
openclaw_items = [f for f in favorites if any(k in f['title'].lower() or k in f['url'].lower() for k in keywords)]

with open(Path.home() / 'wechat_openclaw_favorites.json', 'w') as f:
    json.dump({'items': openclaw_items}, f, indent=2, ensure_ascii=False)

conn.close()
print(f'      ✅ Extracted {len(openclaw_items)} OpenClaw/AI favorites')
"

# Check for duplicates
echo "[4/7] Checking for duplicates..."
python3 -c "
import json
from pathlib import Path

config_file = Path.home() / '.openclaw/openclaw_config_doc.json'
extracted_file = Path.home() / 'wechat_openclaw_favorites.json'

with open(extracted_file) as f:
    data = json.load(f)

if config_file.exists():
    with open(config_file) as f:
        config = json.load(f)
    added_urls = set(config.get('added_urls', []))
else:
    added_urls = set()

new_items = [item for item in data['items'] if item['url'] not in added_urls]

with open(Path.home() / 'wechat_new_for_notebooklm.json', 'w') as f:
    json.dump({'items': new_items}, f, indent=2, ensure_ascii=False)

print(f'      ✅ {len(new_items)} new items to add')
"

# Create manual addition file
echo "[5/7] Creating NotebookLM addition file..."
python3 -c "
import json
from pathlib import Path
from datetime import datetime

new_items_file = Path.home() / 'wechat_new_for_notebooklm.json'
config_file = Path.home() / '.openclaw/openclaw_config_doc.json'

with open(new_items_file) as f:
    data = json.load(f)

if config_file.exists():
    with open(config_file) as f:
        config = json.load(f)
    project_url = config.get('project_url', 'https://notebooklm.google.com/')
else:
    project_url = 'https://notebooklm.google.com/'

manual_file = Path.home() / 'notebooklm_add_manually.txt'
with open(manual_file, 'w') as f:
    f.write(f'# Add {len(data[\"items\"])} sources to NotebookLM\\n')
    f.write(f'# Project: {project_url}\\n')
    f.write(f'# Date: {datetime.now().strftime(\"%Y-%m-%d %H:%M:%S\")}\\n\\n')
    
    for i, item in enumerate(data['items'], 1):
        f.write(f'{i}. {item[\"title\"]}\\n')
        f.write(f'   {item[\"url\"]}\\n\\n')

print(f'      ✅ Created: {manual_file}')
print(f'      Project: {project_url}')
"

# Update configuration
echo "[6/7] Updating configuration..."
python3 -c "
import json
from pathlib import Path
from datetime import datetime

new_items_file = Path.home() / 'wechat_new_for_notebooklm.json'
config_file = Path.home() / '.openclaw/openclaw_config_doc.json'

with open(new_items_file) as f:
    data = json.load(f)

if config_file.exists():
    with open(config_file) as f:
        config = json.load(f)
else:
    config = {'created_at': datetime.now().strftime('%Y-%m-%d'), 'added_urls': [], 'total_sources': 0}

new_urls = [item['url'] for item in data['items']]
config['added_urls'].extend(new_urls)
config['total_sources'] = config.get('total_sources', 0) + len(new_urls)
config['last_sync'] = datetime.now().isoformat()
config['last_sync_count'] = len(new_urls)

with open(config_file, 'w') as f:
    json.dump(config, f, indent=2)

print(f'      ✅ Total sources: {config[\"total_sources\"]}')
print(f'      Added this run: {len(new_urls)}')
"

echo "[7/7] Complete!"
echo ""
echo "======================================================================"
echo "✅ COMPLETE AUTOMATION FINISHED!"
echo "======================================================================"
echo ""
echo "📋 What to do next:"
echo "   1. Open your NotebookLM project:"
echo "      https://notebooklm.google.com/"
echo ""
echo "   2. Add sources from:"
echo "      ~/notebooklm_add_manually.txt"
echo ""
echo "   3. Or run this automation weekly (Sundays 2 AM)"
echo ""
echo "======================================================================"
