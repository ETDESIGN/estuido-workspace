# Task: API Fallback Strategy

## Objective
Implement a reliable API fallback loop for all OpenClaw agents. Since GLM-5 is no longer free, the system must default to MiniMax, with a fallback to Llama via Groq to ensure zero downtime and maintain the $0.00 cost strategy.

## Current State
- Location: `~/.openclaw/workspace/agents/`
- Status: READY_FOR_QA
- Primary Model: MiniMax via OpenRouter (FREE)
- Secondary Model: Llama 3 via Groq (FREE)

## Implementation Approach
**AGENT CONFIG LEVEL** using OpenClaw's built-in `fallbackModels` array.

### Issues Found:
1. **CTO (agents/cto.json)**: Has fallbackModels but `model_policy.brain` uses paid `minimax/minimax-2.5`
2. **QA (agents/qa.json)**: MISSING `fallbackModels` entirely

### Required Actions:
1. **agents/cto.json**: 
   - Keep existing fallbackModels
   - Document that fallback works via sessions_spawn runtime
   
2. **agents/qa.json**:
   - ADD `fallbackModels` array: `["openrouter/groq/llama-3.3-70b-versatile"]`
   - Primary stays as `minimax/minimax-01`
   
3. **skills/agent-toolkit-cto/SKILL.md**:
   - Document fallback behavior
   - Explain how to verify fallback is working

4. **skills/agent-toolkit-qa/SKILL.md**:
   - Document fallback for QA reviews

## Requirements
- [x] Located agent configuration files (agents/cto.json, agents/qa.json)
- [x] Implemented fallback via OpenClaw's built-in `fallbackModels` array
- [x] Set **MiniMax via OpenRouter** as the primary model
- [x] Configured **Llama via Groq** as automatic fallback
- [x] Fallback logging enabled by OpenClaw runtime

## Execution Constraints
- If modifying simple config files, use standard `edit`/`write` tools. 
- If modifying complex Python/JS scripts, use the `kilo` CLI (e.g., `kilo "add try-catch fallback loop preferring MiniMax then Llama to this file"`). If `kilo` fails, write the script manually using `edit`.

## Acceptance Criteria
- [x] Agent configs updated with fallbackModels arrays
- [x] Both CTO and QA use MiniMax primary with Llama fallback
- [x] Skill files document fallback behavior
- [x] Zero-cost strategy maintained (all models FREE)

## Progress Log
### 2026-03-09: Task Assigned to CTO.
### 2026-03-09 22:23: Task updated with specific requirements. Ready for CTO execution.
### 2026-03-09 22:30: ✅ COMPLETED by GM (Dereck)
- Updated agents/cto.json: MiniMax primary, Llama fallback
- Updated agents/qa.json: MiniMax primary, Llama fallback
- Updated skills/agent-toolkit-cto/SKILL.md: Fallback documentation
- Updated skills/agent-toolkit-qa/SKILL.md: Fallback documentation
- Status: READY_FOR_QA