#!/bin/bash
# System Health Monitor - Check all critical services
# Usage: ./system-health-check.sh [--alert]

ALERT_MODE=false
if [[ "$1" == "--alert" ]]; then
    ALERT_MODE=true
fi

LOG_FILE="$HOME/.openclaw/workspace/logs/system-health.log"
mkdir -p "$(dirname "$LOG_FILE")"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_count=0
fail_count=0
warnings=()

check_service() {
    local name="$1"
    local check_command="$2"
    local expected="${3:-running}"
    
    check_count=$((check_count + 1))
    echo -n "Checking $name... "
    
    if eval "$check_command" &>/dev/null; then
        echo -e "${GREEN}✓ OK${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        fail_count=$((fail_count + 1))
        warnings+=("❌ $name is not $expected")
        return 1
    fi
}

echo "=== System Health Check ==="
echo "Time: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Critical Services
check_service "OpenClaw Gateway" "curl -s http://localhost:18789/health"
check_service "WhatsApp Service" "curl -s http://localhost:3000/health"
check_service "fs-watcher" "pgrep -f fs-watcher"

# System Resources
echo ""
echo "=== System Resources ==="

# RAM check
TOTAL_RAM=$(free -m | awk '/Mem:/ {print $2}')
USED_RAM=$(free -m | awk '/Mem:/ {print $3}')
RAM_PERCENT=$((USED_RAM * 100 / TOTAL_RAM))
echo "RAM: ${USED_RAM}M / ${TOTAL_RAM}M (${RAM_PERCENT}%)"

if [[ $RAM_PERCENT -gt 80 ]]; then
    warnings+=("⚠️  RAM usage high: ${RAM_PERCENT}%")
fi

# Disk check
DISK_USAGE=$(df -h ~/.openclaw | awk 'NR==2 {print $5}' | sed 's/%//')
echo "Disk: ${DISK_USAGE}% used"

if [[ $DISK_USAGE -gt 80 ]]; then
    warnings+=("⚠️  Disk usage high: ${DISK_USAGE}%")
fi

# API Budget Check (if script exists)
if [[ -f "$HOME/.openclaw/workspace/scripts/warren-budget-check.sh" ]]; then
    echo ""
    echo "=== API Budget ==="
    bash "$HOME/.openclaw/workspace/scripts/warren-budget-check.sh" 2>/dev/null || echo "Budget check unavailable"
fi

# Summary
echo ""
echo "=== Summary ==="
echo "Checks: $check_count"
echo -e "Failed: ${RED}${fail_count}${NC}"

if [[ ${#warnings[@]} -gt 0 ]]; then
    echo ""
    echo -e "${YELLOW}⚠️  Warnings/Issues:${NC}"
    for warning in "${warnings[@]}"; do
        echo "  $warning"
    done
else
    echo ""
    echo -e "${GREEN}✓ All systems healthy!${NC}"
fi

# Log results
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Health check: $check_count checks, $fail_count failed" >> "$LOG_FILE"

# Send alert if requested and there are failures
if [[ "$ALERT_MODE" == true && $fail_count -gt 0 ]]; then
    # Could send email or notification here
    echo "⚠️  Alert mode: Would send notification"
fi

exit $fail_count
