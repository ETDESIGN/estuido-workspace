#!/bin/bash
# Dev Pipeline Quick Commands
# Usage: bash dev-pipeline.sh [status|plan|assign|review|deploy]

ACTION="$1"
TASKS_DIR="/home/e/.openclaw/workspace/memory/tasks"
PIPELINE="$TASKS_DIR/PIPELINE.md"

case "$ACTION" in
  status)
    echo "=== PIPELINE STATUS ==="
    echo ""
    echo "TODO:"
    grep -l 'Status:.*todo' "$TASKS_DIR"/T-*.md 2>/dev/null | xargs -I{} basename {} .md || echo "  (none)"
    echo ""
    echo "IN PROGRESS:"
    grep -l 'Status:.*in-progress' "$TASKS_DIR"/T-*.md 2>/dev/null | xargs -I{} basename {} .md || echo "  (none)"
    echo ""
    echo "IN REVIEW:"
    grep -l 'Status:.*review' "$TASKS_DIR"/T-*.md 2>/dev/null | xargs -I{} basename {} .md || echo "  (none)"
    echo ""
    echo "DONE:"
    grep -l 'Status:.*done' "$TASKS_DIR"/T-*.md 2>/dev/null | xargs -I{} basename {} .md || echo "  (none)"
    echo ""
    echo "BLOCKED:"
    grep -l 'Status:.*blocked' "$TASKS_DIR"/T-*.md 2>/dev/null | xargs -I{} basename {} .md || echo "  (none)"
    ;;
  *)
    echo "Usage: bash dev-pipeline.sh [status|plan|assign|review|deploy]"
    ;;
esac
