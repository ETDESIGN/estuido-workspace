---
title: System Infrastructure
tags: []
keywords: []
importance: 50
recency: 1
maturity: draft
createdAt: '2026-03-29T20:00:40.126Z'
updatedAt: '2026-03-29T20:00:40.126Z'
---
## Raw Concept
**Task:**
Document system infrastructure and memory configuration

**Changes:**
- Documented memory layers
- Documented communication integrations

**Timestamp:** 2026-03-30

## Narrative
### Structure
Memory uses two layers: memory-core plugin (SQLite/sqlite-vec, 455 chunks, OpenAI text-embedding-3-small) and ByteRover (context tree).

### Highlights
Gateway runs as systemd user service. OpenAI API key required.

## Facts
- **memory_architecture**: Memory uses memory-core plugin with SQLite and sqlite-vec [project]
- **embedding_model**: Embedding model is text-embedding-3-small via OpenAI [project]
