# Memory System Improvements - CRON Setup

## Cron Jobs to Add

```bash
# Edit crontab
crontab -e

# Add these lines:

# Auto-tag new memory entries every hour
0 * * * * cd ~/.openclaw/workspace && python3 scripts/auto-tag-memory.py >> logs/auto-tag.log 2>&1

# Archive old entries (> 90 days) every Sunday at 3 AM
0 3 * * 0 ~/.openclaw/workspace/scripts/archive-old-memory.sh >> logs/archive.log 2>&1

# Generate daily summary at 11:59 PM
59 23 * * * cd ~/.openclaw/workspace && python3 scripts/generate-daily-summary.py >> logs/daily-summary.log 2>&1

# Generate weekly summary every Sunday at 11 PM
0 23 * * 0 cd ~/.openclaw/workspace && python3 scripts/generate-weekly-summary.py >> logs/weekly-summary.log 2>&1
```

## Quick Install

```bash
# Add all cron jobs at once
cat >> ~/.openclaw/workspace/memory-cron.conf << 'EOF'
0 * * * * cd ~/.openclaw/workspace && python3 scripts/auto-tag-memory.py >> logs/auto-tag.log 2>&1
0 3 * * 0 ~/.openclaw/workspace/scripts/archive-old-memory.sh >> logs/archive.log 2>&1
59 23 * * * cd ~/.openclaw/workspace && python3 scripts/generate-daily-summary.py >> logs/daily-summary.log 2>&1
EOF

# Install crontab
crontab ~/.openclaw/workspace/memory-cron.conf
```

## Verify

```bash
# List current crontab
crontab -l

# Check logs
tail -f ~/.openclaw/workspace/logs/auto-tag.log
tail -f ~/.openclaw/workspace/logs/daily-summary.log
```
