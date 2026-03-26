#!/bin/bash
# Automated Backup System - Critical configs and data
# Backs up agents, gateway config, memory, and workspace configs

BACKUP_ROOT="$HOME/.openclaw/backups"
DATE=$(date '+%Y%m%d')
BACKUP_DIR="$BACKUP_ROOT/$DATE"
mkdir -p "$BACKUP_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "🚀 Starting backup..."

# Backup OpenClaw config
log "📄 Backing up OpenClaw config..."
cp -r ~/.openclaw/openclaw.json "$BACKUP_DIR/" 2>/dev/null

# Backup agents
log "🤖 Backing up agents..."
mkdir -p "$BACKUP_DIR/agents"
cp -r ~/.openclaw/agents/*/agent/*.json "$BACKUP_DIR/agents/" 2>/dev/null

# Backup memory
log "🧠 Backing up memory..."
cp -r ~/.openclaw/workspace/memory "$BACKUP_DIR/" 2>/dev/null
cp ~/.openclaw/workspace/MEMORY.md "$BACKUP_DIR/" 2>/dev/null

# Backup workspace configs
log "📁 Backing up workspace configs..."
cp ~/.openclaw/workspace/{AGENTS.md,TOOLS.md,USER.md,HEARTBEAT.md} "$BACKUP_DIR/" 2>/dev/null

# Backup voice system
log "🎙️  Backing up voice system..."
cp -r ~/.openclaw/workspace/voice-system "$BACKUP_DIR/" 2>/dev/null

# Create archive
log "📦 Creating archive..."
cd "$BACKUP_ROOT"
tar -czf "openclaw-backup-${DATE}.tar.gz" "$DATE/" && rm -rf "$DATE/"

# Cleanup old backups (keep last 7 days)
log "🧹 Cleaning old backups..."
find "$BACKUP_ROOT" -name "openclaw-backup-*.tar.gz" -mtime +7 -delete

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_ROOT/openclaw-backup-${DATE}.tar.gz" | cut -f1)

log "✅ Backup complete: ${BACKUP_ROOT}/openclaw-backup-${DATE}.tar.gz (${BACKUP_SIZE})"
log "📊 Backups retained: $(ls -1 "$BACKUP_ROOT"/*.tar.gz 2>/dev/null | wc -l)"
