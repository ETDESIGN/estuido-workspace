#!/bin/bash
# search-inerys-memory.sh
# STRICTLY LOCAL memory search for Inerys Agent
# SANDBOXED: Only searches ~/.openclaw/workspace/agents/inerys-agent/
# NEVER accesses global memory or other client data

set -e

# SANDBOX PATH - DO NOT MODIFY
SANDBOX_DIR="$HOME/.openclaw/workspace/agents/inerys-agent"

# Validate we're in sandbox
if [[ ! -d "$SANDBOX_DIR" ]]; then
    echo "Error: Inerys sandbox directory not found"
    exit 1
fi

# Usage function
usage() {
    echo "Usage: $0 <search_term> [--file-type <type>] [--context-lines <n>]"
    echo ""
    echo "Searches ONLY within Inerys sandbox:"
    echo "  - $SANDBOX_DIR"
    echo ""
    echo "Options:"
    echo "  search_term        Text to search for"
    echo "  --file-type        Filter by file extension (md, json, sh, txt)"
    echo "  --context-lines    Number of context lines (default: 2)"
    echo ""
    echo "Examples:"
    echo "  $0 'Sephora'"
    echo "  $0 'status: Contacted' --file-type json"
    echo "  $0 'GRS-certified' --context-lines 3"
    exit 1
}

# Parse arguments
SEARCH_TERM=""
FILE_TYPE=""
CONTEXT_LINES=2

if [[ $# -eq 0 ]]; then
    usage
fi

SEARCH_TERM="$1"
shift

while [[ $# -gt 0 ]]; do
    case $1 in
        --file-type)
            FILE_TYPE="$2"
            shift 2
            ;;
        --context-lines)
            CONTEXT_LINES="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Build grep command
GREP_CMD="grep -r -i --color=never"

# Add context lines
GREP_CMD="$GREP_CMD -C $CONTEXT_LINES"

# Add file type filter if specified
if [[ -n "$FILE_TYPE" ]]; then
    GREP_CMD="$GREP_CMD --include=*.${FILE_TYPE}"
fi

# Execute search within SANDBOX ONLY
echo "Searching Inerys memory for: $SEARCH_TERM"
echo "Sandbox: $SANDBOX_DIR"
echo "---"

cd "$SANDBOX_DIR" || exit 1

# Run grep with error handling
if eval "$GREP_CMD \"$SEARCH_TERM\" . 2>/dev/null"; then
    echo "---"
    echo "Search completed"
else
    echo "No matches found"
fi

# SECURITY CHECK: Verify we never left sandbox
CURRENT_DIR=$(pwd)
if [[ "$CURRENT_DIR" != "$SANDBOX_DIR"* ]]; then
    echo "⚠️  SECURITY WARNING: Left sandbox directory!"
    echo "Current: $CURRENT_DIR"
    echo "Expected: $SANDBOX_DIR"
    exit 1
fi
