#!/bin/bash
# Automated backup to GitHub with secret scanning
# Usage: ./scripts/backup-to-github.sh

set -e

echo "🔄 Starting backup to GitHub..."

# Check we're in the workspace
if [ ! -f "TOOLS.md" ]; then
  echo "❌ Error: Must run from workspace root"
  exit 1
fi

# Stage all changes
echo "📦 Staging changes..."
git add -A

# Check for potential secrets in staged files
echo "🔍 Scanning for secrets..."
STAGED_FILES=$(git diff --cached --name-only)
SECRET_COUNT=0

if echo "$STAGED_FILES" | grep -qiE "client_secret|token\.json|\.pem|\.key"; then
  echo "⚠️  Warning: Potential secret files detected:"
  echo "$STAGED_FILES" | grep -iE "client_secret|token\.json|\.pem|\.key"
  echo ""
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Backup aborted"
    exit 1
  fi
fi

# Check commit message
TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
COMMIT_MSG="backup: $TIMESTAMP"

# Create backup commit
echo "💾 Creating commit..."
git commit -m "$COMMIT_MSG

Changes include:
$(git diff --cached --stat)

Recovery: git reset --hard $(git rev-parse HEAD)" || {
  echo "ℹ️  No changes to commit"
  exit 0
}

# Get short commit hash
COMMIT_HASH=$(git rev-parse --short HEAD)

# Push to GitHub
echo "📤 Pushing to GitHub..."
if git push origin main; then
  echo ""
  echo "✅ Backup complete!"
  echo "   Commit: $COMMIT_HASH"
  echo "   Time: $TIMESTAMP"
  echo ""
  echo "To restore: git reset --hard $COMMIT_HASH"
else
  echo ""
  echo "❌ GitHub push failed"
  echo "   Local backup created: $COMMIT_HASH"
  echo "   Check GitHub push protection rules"
  exit 1
fi
