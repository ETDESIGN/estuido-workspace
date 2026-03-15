# Task: mem0 System Integration

## Objective
Fully deprecate `qmd` vector search and integrate `mem0` (`memsearch`) directly into the pre-prompt and workflow of the CTO and QA agents.

## Current State
- Location: `~/.openclaw/workspace/agents/`
- Status: NOT_STARTED
- Memory System: `qmd` is deprecated. `mem0` (@mem0/openclaw-mem0) is active.

## Requirements
- [ ] Read `agents/cto.json` and `agents/CTO.md` (and the QA equivalents).
- [ ] Remove any instructions or tool references to `qmd`.
- [ ] Add strict instructions to their personas: "Before writing code or asking the user a question about previous work, you MUST use the `memsearch` tool to query past context."
- [ ] Update `skills/agent-toolkit-cto/SKILL.md` (and QA equivalent) to ensure `memsearch` is documented as the primary memory retrieval tool.

## Execution Constraints
- Do NOT use `kilo` CLI for this task. These are simple configuration files.
- Use your native `read`, `write`, and `edit` tools to modify the JSON and Markdown files directly.

## Acceptance Criteria
- [ ] `qmd` is entirely removed from agent instructions.
- [ ] Agents are explicitly instructed to use `memsearch` proactively.

## Progress Log
### 2026-03-09: Task Assigned to CTO.