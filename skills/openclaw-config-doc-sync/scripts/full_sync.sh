#!/bin/bash
#
# OpenClaw Config Doc - One-Click WeChat Sync
# This script handles the full automation including sudo prompts
#

echo "============================================================"
echo "OPENCLAW CONFIG DOC - AUTOMATED WECHAT SYNC"
echo "============================================================"
echo ""
echo "This will:"
echo "  1. Extract SQLCipher key from WeChat memory (requires sudo)"
echo "  2. Decrypt WeChat favorites database"
echo "  3. Extract OpenClaw/AI related favorites"
echo "  4. Add them to your NotebookLM project"
echo ""
echo "⚠️  You will be prompted for your password once."
echo "============================================================"
echo ""

# Check if WeChat is running
if ! pgrep -f wechat > /dev/null; then
    echo "❌ WeChat is not running!"
    echo "   Please start WeChat first, then run this script again."
    exit 1
fi

echo "✅ WeChat is running"
echo ""

# Change to wechat-decrypt directory
cd ~/projects/wechat-decrypt

# Activate virtual environment
source venv/bin/activate

# Extract key (requires sudo)
echo "[1/4] Extracting SQLCipher key from WeChat memory..."
echo "⚠️  Sudo password required for process memory access"
echo ""

if sudo python3 find_all_keys_linux.py; then
    echo "✅ Key extracted successfully"
else
    echo "❌ Key extraction failed"
    exit 1
fi

echo ""
echo "[2/4] Decrypting database..."

# Decrypt database
if python3 decrypt_db.py \
    --key "$(jq -r '.keys[0]' config.json)" \
    --input /home/e/Documents/xwechat_files/wxid_2njjt71zxgh221_58f9/db_storage/favorite/favorite.db \
    --output /tmp/favorite_decrypted.db; then
    echo "✅ Database decrypted"
else
    echo "❌ Decryption failed"
    exit 1
fi

echo ""
echo "[3/4] Extracting favorites..."

# Run Python extraction script
cd ~/.openclaw/workspace/skills/openclaw-config-doc-sync/scripts
python3 auto_extract_wechat.py

if [ $? -eq 0 ]; then
    echo "✅ Favorites extracted"
else
    echo "❌ Extraction failed"
    exit 1
fi

echo ""
echo "[4/4] Syncing to NotebookLM..."

# Sync to NotebookLM
python3 sync_from_export.py ~/wechat_extraction_result.json

if [ $? -eq 0 ]; then
    echo "✅ Sync complete!"
else
    echo "❌ Sync failed"
    exit 1
fi

echo ""
echo "============================================================"
echo "✅ ALL DONE!"
echo "============================================================"
echo ""
echo "Your OpenClaw/AI favorites have been:"
echo "  ✅ Extracted from WeChat"
echo "  ✅ Decrypted"
echo "  ✅ Filtered"
echo "  ✅ Added to NotebookLM project"
echo ""
echo "Project: https://notebooklm.google.com/project/ocl_20260316_030106"
echo ""
echo "============================================================"
