#!/bin/bash
#==========================================
# Weekly Git Backup Script
# Backs up workspace to git for version history + offsite push
#==========================================

set -e

WORKSPACE="/home/e/.openclaw/workspace"
BACKUP_MSG="Weekly backup $(date +'%Y-%m-%d %H:%M')"

echo "🚀 Starting weekly git backup..."
cd "$WORKSPACE"

# Add all changes (except ignored files)
git add -A

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "✅ No changes to commit (skipping)"
else
    git commit -m "$BACKUP_MSG"
    echo "✅ Committed: $BACKUP_MSG"
fi

# Optional: Push to remote (uncomment if you set up a remote)
# git push origin master

echo "✅ Weekly backup complete!"
echo "📍 Location: $WORKSPACE/.git"