#!/bin/bash
# check_memory.sh - Monitor memory usage for Inerys Agent
# Runs hourly via cron

set -e

SANDBOX_DIR="$HOME/.openclaw/workspace/agents/inerys-agent"
LOG_DIR="$SANDBOX_DIR/logs"
MEMORY_LOG="$LOG_DIR/memory_usage.log"

WARNING_THRESHOLD=4  # GB
CRITICAL_THRESHOLD=5  # GB

log() {
    echo "[$(date -u +'%Y-%m-%d %H:%M:%S UTC')] Memory Check: $1" | tee -a "$MEMORY_LOG"
}

# Get memory usage of sandbox directory (in GB)
MEMORY_USAGE=$(du -sBG "$SANDBOX_DIR" 2>/dev/null | grep -oP '\d+' || echo "0")

log "Current usage: ${MEMORY_USAGE}GB"

if [[ $MEMORY_USAGE -ge $CRITICAL_THRESHOLD ]]; then
    log "⛔ CRITICAL: Memory usage at ${MEMORY_USAGE}GB - Exceeds limit!"
    # TODO: Send alert to Dereck
    echo "⚠️ CRITICAL: Inerys Agent memory at ${MEMORY_USAGE}GB - Operations halted"
    exit 1
elif [[ $MEMORY_USAGE -ge $WARNING_THRESHOLD ]]; then
    log "⚠️ WARNING: Memory usage at ${MEMORY_USAGE}GB - Approaching limit"
    # TODO: Send warning alert
else
    log "✅ Memory usage within limits"
fi
