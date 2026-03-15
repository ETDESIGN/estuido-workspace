#!/bin/bash
# Sync native file memories to Mem0
# Usage: ./mem0-sync.sh [user_id]

set -e

USER_ID="${1:-estudio}"
API_KEY="m0-GouLJkFH7qy7Z5TDpZdcMPpCjWObCYCuHOZI26Qi"
MEM0_API="https://api.mem0.ai/v1"

# Get all markdown files from memory/ and docs/
echo "Syncing memories to Mem0..."

# Read key files (decisions, AGENT_STATE, MEMORY.md)
FILES=(
    "memory/MEMORY.md"
    "memory/decisions.md"
    "memory/AGENT_STATE.md"
    "AGENTS.md"
    "IDENTITY.md"
    "USER.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Syncing: $file"
        # Extract text content (strip markdown headers partially)
        content=$(head -100 "$file" 2>/dev/null | sed 's/#//g' | tr '\n' ' ' | cut -c1-500)
        
        if [ -n "$content" ]; then
            curl -s -X POST "$MEM0_API/memories/" \
                -H "Authorization: Token $API_KEY" \
                -H "Content-Type: application/json" \
                -d "{\"user_id\": \"$USER_ID\", \"messages\": [{\"role\": \"user\", \"content\": \"$content\"}]}" \
                > /dev/null
            echo "  ✓ $file"
        fi
    fi
done

echo "Done! Memories synced to Mem0."