#!/bin/bash
# Hybrid memory search - combines native file search + Mem0 semantic search
# Usage: ./memory-hybrid.sh "query"

QUERY="$1"
API_KEY="m0-GouLJkFH7qy7Z5TDpZdcMPpCjWObCYCuHOZI26Qi"
USER_ID="estudio"

if [ -z "$QUERY" ]; then
    echo "Usage: $0 <query>"
    exit 1
fi

echo "=== Hybrid Memory Search: $QUERY ==="
echo ""

# 1. Native file search (grep)
echo "📁 Native File Search:"
echo "---"
grep -ri "$QUERY" memory/ docs/ 2>/dev/null | head -5 || echo "(no local matches)"
echo ""

# 2. Mem0 semantic search
echo "🔍 Mem0 Semantic Search:"
echo "---"
result=$(curl -s -X POST "https://api.mem0.ai/v1/memories/search/" \
    -H "Authorization: Token $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"user_id\": \"$USER_ID\", \"query\": \"$QUERY\"}")

echo "$result" | jq -r '.[] | "[\(.score)] \(.memory)"' 2>/dev/null || echo "(no semantic matches)"
echo ""

# Summary
echo "✅ Search complete"