# QMD Configuration for ESTUDIO

> Local semantic search with Ollama embeddings

## Status

✅ **QMD Installed:** v0.9.0  
✅ **Collection Created:** estudio-memory  
✅ **Files Indexed:** 3  
✅ **Embeddings:** 6 vectors (nomic-embed-text via Ollama)  
✅ **Search:** Working (BM25 + vector)

## Usage

### Search Commands

```bash
# Text search (BM25)
qmd search "token tracking"

# Vector search (semantic)
qmd vsearch "memory system"

# Hybrid search
qmd query "deployment issues"

# List collection
qmd ls estudio-memory

# Get specific document
qmd get qmd://estudio-memory/future-tasks.md

# Check status
qmd status
```

## Configuration

### Environment Variables
```bash
export PATH="$HOME/.bun/bin:$HOME/.local/bin:$PATH"
export OLLAMA_URL="http://localhost:11434"
```

### Collection Details
- **Name:** estudio-memory
- **Path:** ~/.openclaw/workspace/memory
- **Pattern:** **/*.md
- **Index:** ~/.cache/qmd/index.sqlite

## MCP Mode (Future)

To enable MCP for agents:
```bash
qmd mcp
```

This starts a Model Context Protocol server for agent integration.

## Maintenance

### Update Index
```bash
qmd update
```

### Regenerate Embeddings
```bash
qmd embed
```

### Add More Collections
```bash
qmd collection add ~/Projects --name projects --mask "**/*.md"
```

## Integration with OpenClaw

QMD can be used via:
1. Direct CLI commands
2. MCP mode (for agents)
3. Custom scripts

---
*Setup completed: 2026-02-16*
*Last updated: 2026-02-16*
