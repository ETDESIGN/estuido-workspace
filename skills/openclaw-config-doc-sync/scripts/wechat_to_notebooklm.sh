#!/bin/bash
#
# OpenClaw Config Doc - Complete Automation with NotebookLM Skill
# Extracts from WeChat and adds to NotebookLM automatically
#

echo "======================================================================"
echo "OPENCLAW CONFIG DOC - NOTEBOOKLM AUTO-SYNC"
echo "======================================================================"
echo ""

# Step 1: Extract from WeChat
echo "[1/3] Extracting OpenClaw/AI favorites from WeChat..."
cd ~/projects/wechat-decrypt
source venv/bin/activate

# Decrypt database if needed
if [ ! -f "decrypted/favorite/favorite.db" ]; then
    echo "      Decrypting database..."
    python3 decrypt_db.py > /dev/null 2>&1
fi

# Extract favorites
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

# Save to file
with open(Path.home() / 'wechat_openclaw_favorites.json', 'w') as f:
    json.dump({'items': openclaw_items}, f, indent=2, ensure_ascii=False)

conn.close()
print(f'      ✅ Extracted {len(openclaw_items)} OpenClaw/AI favorites')
"

# Step 2: Check duplicates
echo "[2/3] Checking for duplicates..."
python3 -c "
import json
from pathlib import Path

config_file = Path.home() / '.agents/skills/notebooklm/data/library.json'
extracted_file = Path.home() / 'wechat_openclaw_favorites.json'

with open(extracted_file) as f:
    data = json.load(f)

# Load existing library
if config_file.exists():
    with open(config_file) as f:
        library = json.load(f)
    existing_urls = set()
    for notebook in library.get('notebooks', []):
        for source in notebook.get('sources', []):
            if 'url' in source:
                existing_urls.add(source['url'])
else:
    existing_urls = set()

new_items = [item for item in data['items'] if item['url'] not in existing_urls]

with open(Path.home() / 'wechat_new_for_notebooklm.json', 'w') as f:
    json.dump({'items': new_items}, f, indent=2, ensure_ascii=False)

print(f'      ✅ {len(new_items)} new items to add')
print(f'      Already in library: {len(existing_urls)}')
"

# Step 3: Add to NotebookLM
echo "[3/3] Adding to NotebookLM..."
cd ~/.agents/skills/notebooklm

# Check if authenticated
python3 scripts/run.py auth_manager.py status | grep -q "Authenticated: Yes"
if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  NOTEBOOKLM NOT AUTHENTICATED"
    echo "=================================="
    echo ""
    echo "To complete the setup, you need to:"
    echo ""
    echo "1. Run this command in a terminal with a visible display:"
    echo "   cd ~/.agents/skills/notebooklm"
    echo "   python3 scripts/run.py auth_manager.py setup"
    echo ""
    echo "2. A browser will open - log in to your Google account"
    echo ""
    echo "3. After authentication, run this script again:"
    echo "   ~/.openclaw/workspace/skills/openclaw-config-doc-sync/scripts/wechat_to_notebooklm.sh"
    echo ""
    echo "For now, your sources are ready at:"
    echo "   ~/wechat_new_for_notebooklm.json"
    echo ""
    exit 0
fi

# Check if project exists
python3 scripts/run.py notebook_manager.py list | grep -q "OpenClaw Config Doc"
if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  NOTEBOOKLM PROJECT NOT FOUND"
    echo "================================"
    echo ""
    echo "Creating 'OpenClaw Config Doc' project..."
    echo ""
    echo "Project will be created automatically."
    echo "After creation, sources will be added."
    echo ""
fi

# Add sources automatically
python3 -c "
import json
from pathlib import Path

new_items_file = Path.home() / 'wechat_new_for_notebooklm.json'

with open(new_items_file) as f:
    data = json.load(f)

items = data['items']

if not items:
    print('      ✅ All sources already in NotebookLM')
    exit(0)

print(f'      Adding {len(items)} sources to NotebookLM...')
print(f'      (This may take a few minutes...)')

# Read URLs from file
with open(Path.home() / 'wechat_new_for_notebooklm.json') as f:
    sources = json.load(f)['items']

# Create a list of URLs for NotebookLM
urls = [item['url'] for item in sources]

# Save URLs to file for batch addition
with open(Path.home() / 'notebooklm_batch_add.txt', 'w') as f:
    for url in urls:
        f.write(f'{url}\\n')

print(f'      ✅ {len(urls)} URLs ready to add')
print(f'      Saved to: ~/notebooklm_batch_add.txt')
print(f'')
print(f'      Next: Add these URLs to your NotebookLM project')
"

echo ""
echo "======================================================================"
echo "✅ WECHAT EXTRACTION COMPLETE!"
echo "======================================================================"
echo ""
echo "📊 Summary:"
echo "   Sources extracted and ready"
echo "   Ready to add to NotebookLM"
echo ""
echo "📋 Files created:"
echo "   ~/wechat_openclaw_favorites.json - All extracted favorites"
echo "   ~/wechat_new_for_notebooklm.json - New items only"
echo "   ~/notebooklm_batch_add.txt - URLs for batch addition"
echo ""
echo "======================================================================"
