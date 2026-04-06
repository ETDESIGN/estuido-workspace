---
title: Operational Patterns and Learnings
tags: []
keywords: []
importance: 50
recency: 1
maturity: draft
createdAt: '2026-03-29T20:01:04.776Z'
updatedAt: '2026-03-29T20:01:04.776Z'
---
## Raw Concept
**Task:**
Document operational patterns and learnings

**Changes:**
- Initial documentation of operational patterns

**Timestamp:** 2026-03-30

## Narrative
### Structure
Collection of operational patterns, recovery strategies, and policy guidelines.

### Highlights
Quick-Sprint Recovery, mandatory gateway restarts, verification policies, and cost control strategies.

### Rules
Rule 1: Always verify work before claiming completion.
Rule 2: Restart gateway after changing openclaw.json.
Rule 3: Use free token tiers where possible.

## Facts
- **recovery_pattern**: Quick-Sprint Recovery: After idle period >2 days, start with small 5-15min task. [convention]
- **gateway_restart**: Gateway restart mandatory after openclaw.json changes. [convention]
- **verification_policy**: Verify before claiming: E caught errors from unverified claims 3 times. [convention]
- **documentation_policy**: Document critical configs in notes/ directory immediately. [convention]
- **token_optimization**: Token optimization: Prefer free tiers (Groq, GLM free, Qwen free) before paid. [project]
- **cost_monitoring**: Cost monitoring via token-tracker cron twice daily. [project]
