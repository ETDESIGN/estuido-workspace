#!/bin/bash
# Start FS-Watcher for Tool Request Pipeline
# Add to crontab or systemd for auto-start

cd /home/e/.openclaw/workspace/skills/fs-watcher
exec node fs-watcher.js --config triggers-tool-requests.json
