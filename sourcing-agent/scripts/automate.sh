#!/bin/bash
# Sourcing Agent Automation Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔍 Sourcing Agent Automation${NC}"

# Start dashboard
start_dashboard() {
    echo -e "${YELLOW}🚀 Starting Dashboard${NC}"
    cd "$PROJECT_DIR/dashboard"
    streamlit run dashboard.py --server.port 8501
}

# List jobs
list_jobs() {
    echo -e "${YELLOW}📋 Active Jobs${NC}"
    ls -1 "$PROJECT_DIR/customers"/job_*.md 2>/dev/null | wc -l
}

# List suppliers
list_suppliers() {
    echo -e "${YELLOW}🏭 Suppliers${NC}"
    ls -1 "$PROJECT_DIR/suppliers"/supplier_*.json 2>/dev/null | wc -l
}

# Show stats
stats() {
    echo -e "${YELLOW}📊 Statistics${NC}"
    echo "Jobs: $(ls -1 "$PROJECT_DIR/customers"/job_*.md 2>/dev/null | wc -l)"
    echo "Suppliers: $(ls -1 "$PROJECT_DIR/suppliers"/supplier_*.json 2>/dev/null | wc -l)"
}

case "${1:-help}" in
    "dashboard"|"start") start_dashboard ;;
    "jobs") list_jobs ;;
    "suppliers") list_suppliers ;;
    "stats") stats ;;
    *) 
        echo "Usage: automate.sh {dashboard|jobs|suppliers|stats}"
        ;;
esac
