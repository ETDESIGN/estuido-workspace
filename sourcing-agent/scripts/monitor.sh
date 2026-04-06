#!/bin/bash
# Sourcing Agent Health Monitor

PROJECT_DIR="$HOME/.openclaw/workspace/sourcing-agent"
LOG_DIR="$PROJECT_DIR/logs"

echo "🔍 Sourcing Agent Health Check"
echo "==============================="
echo ""

# Create log directory if not exists
mkdir -p "$LOG_DIR"

# Check directories
echo "📁 Directory Structure:"
for dir in suppliers customers drafts knowledge; do
    if [ -d "$PROJECT_DIR/$dir" ]; then
        count=$(find "$PROJECT_DIR/$dir" -type f | wc -l)
        echo "  ✅ $dir: $count files"
    else
        echo "  ❌ $dir: MISSING"
    fi
done
echo ""

# Check dashboard
echo "🎛️  Dashboard:"
if [ -f "$PROJECT_DIR/dashboard/dashboard.py" ]; then
    echo "  ✅ dashboard.py exists"
else
    echo "  ❌ dashboard.py NOT FOUND"
fi

# Check if streamlit is running
if pgrep -f "streamlit run dashboard" > /dev/null; then
    echo "  ✅ Dashboard is RUNNING"
else
    echo "  ⚠️  Dashboard is NOT running"
fi
echo ""

# Check OpenClaw agent
echo "🤖 OpenClaw Agent:"
if openclaw status | grep -q "sourcing-agent"; then
    echo "  ✅ Sourcing agent registered"
else
    echo "  ⚠️  Sourcing agent NOT found in config"
fi
echo ""

# Statistics
echo "📊 Statistics:"
jobs=$(find "$PROJECT_DIR/customers" -name "job_*.md" 2>/dev/null | wc -l)
suppliers=$(find "$PROJECT_DIR/suppliers" -name "supplier_*.json" 2>/dev/null | wc -l)
drafts=$(find "$PROJECT_DIR/drafts" -name "rfq_*.md" 2>/dev/null | wc -l)

echo "  Active Jobs: $jobs"
echo "  Suppliers: $suppliers"
echo "  RFQ Drafts: $drafts"
echo ""

# Recent activity
echo "🕐 Recent Activity:"
if [ "$jobs" -gt 0 ]; then
    echo "  Latest job:"
    ls -t "$PROJECT_DIR/customers"/job_*.md | head -1 | xargs basename
fi
echo ""

# System status
echo "⚡ System Status:"
# Check disk space
disk_usage=$(du -sh "$PROJECT_DIR" 2>/dev/null | cut -f1)
echo "  Disk usage: $disk_usage"

# Check file count
total_files=$(find "$PROJECT_DIR" -type f | wc -l)
echo "  Total files: $total_files"
echo ""

echo "==============================="
echo "Health check complete!"
