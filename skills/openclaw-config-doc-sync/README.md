# OpenClaw Config Doc - Weekly Sync

**Automatically sync OpenClaw/AI related WeChat favorites to your NotebookLM project**

## What It Does

Every week, this script:
1. Extracts your WeChat favorites
2. Filters for OpenClaw/AI agent related links
3. Adds new ones to your "OpenClaw Config Doc" NotebookLM project
4. Never creates duplicate projects (uses one project forever)

## Quick Start

### 1. Initial Setup (One Time)

```bash
cd ~/.openclaw/workspace/skills/openclaw-config-doc-sync
python scripts/weekly_sync.py --setup
```

**What happens:**
- Extracts your WeChat favorites
- Filters for OpenClaw/AI content
- Asks you to create "OpenClaw Config Doc" in NotebookLM
- Saves configuration

### 2. Manual Sync (Anytime)

```bash
python scripts/weekly_sync.py
```

### 3. Check Status

```bash
python scripts/weekly_sync.py --status
```

### 4. Setup Weekly Automation

Add to crontab (runs every Sunday 2 AM):

```bash
crontab -e
```

Add line:
```
0 2 * * 0 cd ~/.openclaw/workspace/skills/openclaw-config-doc-sync && python scripts/weekly_sync.py >> /tmp/openclaw_sync.log 2>&1
```

## What Gets Synced

Links related to:
- OpenClaw
- AI agents
- LLMs (GPT, Claude, etc.)
- Prompt engineering
- Agent frameworks
- AI automation
- NotebookLM

## Error Handling

**If WeChat is not signed in:**
- Sync fails gracefully
- Leaves you a message to open WeChat
- You can retry manually anytime

**If no new links:**
- Silent success (no notification)
- Nothing added to project

## Files Created

```
~/.openclaw/
└── openclaw_config_doc.json    # Config & state

~/wechat_favorites_archive/
└── (created by WeChat pipeline skill)
```

## Example Output

```
==============================================================
OPENCLAW CONFIG DOC - WEEKLY SYNC
==============================================================
[1/5] Extracting WeChat favorites...
      Found 234 total favorites
[2/5] Filtering for OpenClaw/AI content...
      47 OpenClaw/AI related
[3/5] Checking for new sources...
      5 new to add
[4/5] Adding 5 sources to project...
      Project: https://notebooklm.google.com/project/abc123

→ Please add these sources in NotebookLM:
   1. Building AI Agents with OpenClaw
      https://example.com/openclaw-agents
   2. Prompt Engineering Guide
      https://example.com/prompts
   ...

Press Enter once sources are added...

[5/5] Updating sync status...

✅ Sync complete!
   Project: https://notebooklm.google.com/project/abc123
   Added: 5 sources
   Total: 52 sources
==============================================================
```

## Troubleshooting

**"WeChat database not found"**
→ Open WeChat and sign in, then retry

**"Not configured"**
→ Run `--setup` first

**"No OpenClaw/AI favorites found"**
→ Save some OpenClaw-related articles to WeChat favorites

## Privacy

- Only reads public links from favorites
- Never accesses private messages
- Config stored locally
- No cloud services except NotebookLM
