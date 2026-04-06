#!/bin/bash
# Memory Consolidation Script

echo "🔄 Consolidating memory structure..."

MEMORY_BASE=~/.openclaw/workspace/memory

# Create new directories
mkdir -p "$MEMORY_BASE/active/daily"
mkdir -p "$MEMORY_BASE/active/technical"
mkdir -p "$MEMORY_BASE/active/analysis"
mkdir -p "$MEMORY_BASE/active/tasks"
mkdir -p "$MEMORY_BASE/active/learnings"
mkdir -p "$MEMORY_BASE/archive"

# Move daily summaries
echo "📁 Organizing daily summaries..."
find "$MEMORY_BASE" -maxdepth 1 -name "DAILY*.md" -type f -exec mv {} "$MEMORY_BASE/active/daily/" \; 2>/dev/null
find "$MEMORY_BASE" -maxdepth 1 -name "GM-*SUMMARY*.md" -type f -exec mv {} "$MEMORY_BASE/active/daily/" \; 2>/dev/null
find "$MEMORY_BASE" -maxdepth 1 -name "GM-MORNING*.md" -type f -exec mv {} "$MEMORY_BASE/active/daily/" \; 2>/dev/null
find "$MEMORY_BASE" -maxdepth 1 -name "GM-MIDDAY*.md" -type f -exec mv {} "$MEMORY_BASE/active/daily/" \; 2>/dev/null
find "$MEMORY_BASE" -maxdepth 1 -name "GM-EOD*.md" -type f -exec mv {} "$MEMORY_BASE/active/daily/" \; 2>/dev/null

# Move technical docs
echo "🔧 Organizing technical docs..."
find "$MEMORY_BASE" -maxdepth 1 -name "*setup*.md" -type f -exec mv {} "$MEMORY_BASE/active/technical/" \; 2>/dev/null
find "$MEMORY_BASE" -maxdepth 1 -name "*config*.md" -type f -exec mv {} "$MEMORY_BASE/active/technical/" \; 2>/dev/null
find "$MEMORY_BASE" -maxdepth 1 -name "*whisper*.md" -type f -exec mv {} "$MEMORY_BASE/active/technical/" \; 2>/dev/null

# Move analysis
echo "📊 Organizing analysis..."
find "$MEMORY_BASE" -maxdepth 1 -name "SYSTEM_*.md" -type f -exec mv {} "$MEMORY_BASE/active/analysis/" \; 2>/dev/null
find "$MEMORY_BASE" -maxdepth 1 -name "*ANALYSIS*.md" -type f -exec mv {} "$MEMORY_BASE/active/analysis/" \; 2>/dev/null
find "$MEMORY_BASE" -maxdepth 1 -name "*CONVERSATION*.md" -type f -exec mv {} "$MEMORY_BASE/active/analysis/" \; 2>/dev/null

# Copy learnings
echo "🎓 Organizing learnings..."
if [ -f ~/.openclaw/workspace/.learnings/LEARNINGS.md ]; then
    cp ~/.openclaw/workspace/.learnings/LEARNINGS.md "$MEMORY_BASE/active/learnings/"
fi
if [ -f ~/.openclaw/workspace/.learnings/ERRORS.md ]; then
    cp ~/.openclaw/workspace/.learnings/ERRORS.md "$MEMORY_BASE/active/learnings/"
fi

# Move remaining dated files to daily
echo "📅 Moving remaining dated files..."
find "$MEMORY_BASE" -maxdepth 1 -name "2026-*.md" -type f -exec mv {} "$MEMORY_BASE/active/daily/" \; 2>/dev/null

echo "✅ Memory consolidated!"
echo ""
echo "📊 Summary:"
echo "  Daily summaries: $(ls -1 "$MEMORY_BASE/active/daily/" 2>/dev/null | wc -l) files"
echo "  Technical docs: $(ls -1 "$MEMORY_BASE/active/technical/" 2>/dev/null | wc -l) files"
echo "  Analysis: $(ls -1 "$MEMORY_BASE/active/analysis/" 2>/dev/null | wc -l) files"
echo "  Learnings: $(ls -1 "$MEMORY_BASE/active/learnings/" 2>/dev/null | wc -l) files"
