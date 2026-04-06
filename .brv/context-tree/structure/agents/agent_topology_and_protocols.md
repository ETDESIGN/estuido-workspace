---
title: Agent Topology and Protocols
tags: []
keywords: []
importance: 50
recency: 1
maturity: draft
createdAt: '2026-03-29T20:00:10.379Z'
updatedAt: '2026-03-29T20:00:10.379Z'
---
## Raw Concept
**Task:**
Document agent topology and operational protocols

**Files:**
- /home/e/.openclaw/workspace/memory/

**Flow:**
Delegation (Dereck/GM) -> Implementation (CTO/QA) -> Monitoring (Warren)

**Timestamp:** 2026-03-29

**Author:** Dereck

## Narrative
### Structure
Main agent topology: Dereck/GM (Main), CTO (Implementation), QA (Testing), Warren (Monitoring), Sourcing Agent, Planner.

### Highlights
Dereck delegates via Lobster pipelines and does not write code directly. If CTO or QA encounters timeouts, Warren handles retries. Direct intervention is discouraged.

### Rules
Hands-off protocol: If CTO/QA timeout, let Warren handle retries, don't take over.

## Facts
- **delegation_method**: Dereck (GM) delegates through Lobster pipelines [project]
- **memory_storage**: Memory is stored in /home/e/.openclaw/workspace/memory/ as markdown files [project]
