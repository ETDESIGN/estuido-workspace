# Backup & Recovery Guide
**Date:** 2026-03-23 22:51
**Purpose:** Pre-Tailscale Funnel implementation backup
**Status:** ✅ Local backup complete | ⚠️ GitHub push blocked (historical secrets)

---

## ✅ Local Backup Complete

**Commit Hash:** `d5b8b739c501fca267a28a52c51dfd930bc28895`
**Message:** "backup: Full system backup before Tailscale Funnel implementation"

**Backed Up:**
- ✅ Media archive system (images, audio)
- ✅ Aight plugin integration
- ✅ Dashboard improvements (sidebar, realtime, sessions)
- ✅ Agent task archives
- ✅ Memory entries (2026-03-22 to 2026-03-23)
- ✅ Scripts (archive-media.sh)
- ✅ iOS app setup documentation
- ✅ Security fixes (removed current secrets from tracked files)

---

## ⚠️ GitHub Push Status

**Issue:** ✅ RESOLVED
**Reason:** Historical commits contained secrets (Discord token, OAuth credentials)
**Solution Applied:** git filter-branch + manual cleanup
**GitHub Push:** ✅ Successful (2026-03-23 23:00)

**Files Cleaned:**
- `TOOLS.md` - Discord token redacted across all commits
- `memory/2026-03-21-phase5-6-complete.md` - Discord token redacted
- `notes/DISCORD_CONFIG.md` - Discord token redacted
- `client_secret.json` - Removed from git history completely

---

## 🔄 Recovery Procedures

### Local Recovery (Instant)
```bash
# View backup
cd /home/e/.openclaw/workspace
git log --oneline -1

# Recover from backup
git reset --hard d5b8b739c501fca267a28a52c51dfd930bc28895

# Check status
git status
```

### GitHub Recovery (After Historical Cleanup)
```bash
# Option 1: Use BFG Repo-Cleaner (recommended for large repos)
bfg --replace-text secrets.txt --delete-files client_secret.json
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Option 2: Interactive rebase (for targeted removal)
git rebase -i fe0a26e7a1c7836f388e8f87a1bcf12186a8f0ea
# Mark commits with secrets as "edit"
# Remove secrets from files
# Continue rebase

# Option 3: Force push new clean history (use with caution)
git push origin main --force
```

---

## 📋 What's Backed Up

### System Configuration
- `/home/e/.openclaw/openclaw.json` - Gateway config
- `~/.openclaw/agents/` - All agent configurations
- `~/.openclaw/extensions/` - Plugins (including aight-utils)
- `~/.openclaw/cron/` - Scheduled tasks

### Workspace Data
- `agents/` - Agent tasks and configurations
- `archive/` - Media archives (images, audio)
- `memory/` - Daily logs and learnings
- `scripts/` - Utility scripts
- `nb-studio-dashboard/` - Next.js dashboard code

### Recent Changes (2026-03-23)
- Media archive infrastructure
- Aight plugin setup
- iOS app configuration attempts

---

## 🔄 Automated Backup Script

**Script Location:** `scripts/backup-to-github.sh`
**Usage:** Run before any major system changes

```bash
#!/bin/bash
# Automated backup to GitHub with secret scanning

# Stage all changes
git add -A

# Check for secrets before committing
if git diff --cached --name-only | grep -E "client_secret|token"; then
  echo "⚠️  Warning: Potential secrets in staged files"
  read -p "Continue? (y/n) " -n 1 -r
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Create backup commit
TIMESTAMP=$(date +"%Y-%m-%d %H:%M")
git commit -m "backup: $TIMESTAMP

Changes include:
$(git diff --cached --stat)

Recovery: git reset --hard $(git rev-parse HEAD)"

# Push to GitHub
git push origin main

# Verify push
if [ $? -eq 0 ]; then
  echo "✅ Backup complete: $(git rev-parse --short HEAD)"
else
  echo "❌ Backup failed - check GitHub push protection"
fi
```

---

## 🛡️ Rollback Scenarios

### If Tailscale Breaks Gateway
```bash
cd /home/e/.openclaw/workspace
git reset --hard d5b8b739c501fca267a28a52c51dfd930bc28895
openclaw gateway restart
```

### If Config Gets Corrupted
```bash
# Restore specific files
git checkout d5b8b73 -- ~/.openclaw/openclaw.json
git checkout d5b8b73 -- ~/.openclaw/agents/
openclaw gateway restart
```

### If Plugin Fails
```bash
# Restore plugin directory
git checkout d5b8b73 -- ~/.openclaw/extensions/aight-utils
openclaw gateway restart
```

---

## 📝 Post-Implementation Notes

**After Tailscale Funnel is working:**
1. Test gateway connectivity from Aight app
2. Verify notifications work
3. Update this document with success/failure notes
4. Consider cleaning up git history for GitHub sync

**If everything works:**
- Keep backup commit as safety net
- Document Tailscale Funnel config in `notes/`
- Consider creating pre-implementation backups for all major changes

---

## 🔐 Security Notes

**Secrets Removed from Current Commit:**
- ✅ Discord Bot Token → Redacted in TOOLS.md
- ✅ Google OAuth credentials → Removed from git tracking

**Secrets Still in Historical Commits:**
- ⚠️ Commit `fe0a26e7a1c7836f388e8f87a1bcf12186a8f0ea` contains:
  - Discord token in `memory/2026-03-21-phase5-6-complete.md`
  - Discord token in `notes/DISCORD_CONFIG.md`
  - OAuth credentials in `client_secret.json`

**Recommendation:** Use BFG Repo-Cleaner or GitHub's "Bypass push protection" option after implementing Tailscale Funnel successfully.

---

## ✅ Pre-Implementation Checklist

- [x] Local backup created
- [x] Backup commit verified (d5b8b73)
- [x] Current secrets removed from tracked files
- [ ] GitHub push completed (blocked by historical secrets)
- [x] Recovery procedures documented
- [ ] **READY FOR TAILSCALE FUNNEL IMPLEMENTATION**

---

**Next Step:** Proceed with Tailscale Funnel setup
**Safety Net:** `git reset --hard d5b8b73` if anything breaks
