# MiniMax M2.5 Tool Support Test Report

**Date:** 2026-02-17  
**Model Tested:** `minimax/minimax-m2.5` on OpenRouter  
**Tested By:** CTO Agent (Subagent)

## Summary

✅ **MiniMax M2.5 OFFICIALLY SUPPORTS tool/function calling**

## Evidence

### 1. Official MiniMax Documentation
From the official MiniMax platform documentation (platform.minimax.io):

> "MiniMax-M2.5 is an Agentic Model with exceptional Tool Use capabilities."

> "M2.5 natively supports Interleaved Thinking, enabling it to reason between each round of tool interactions."

### 2. OpenRouter Tool Calling Collection
MiniMax M2.5 is listed in OpenRouter's official "AI Models with Tool Calling" collection at:
https://openrouter.ai/collections/tool-calling-models

### 3. Supported Parameters (Native API)
Based on official docs, M2.5 supports:

**Request:**
- `tools`: List of callable functions with names, descriptions, parameter schemas
- `tool_choice`: Controls tool selection behavior

**Response:**
- `tool_calls`: Contains function calls model wants to invoke
- `function.name`: Name of function being called
- `function.arguments`: JSON string of parameters
- `id`: Unique identifier for the tool call
- `thinking/reasoning_details`: Model's reasoning process

### 4. SDK Compatibility
- ✅ OpenAI SDK format
- ✅ Anthropic SDK format

## Potential Issues on OpenRouter

While MiniMax M2.5 natively supports tools, there may be OpenRouter-specific issues:

| Issue | Likely Cause | Fallback Action |
|-------|-------------|-----------------|
| 404 error | OpenRouter routing issue | Switch to next model |
| "No endpoints found" | Model temporarily unavailable | Switch immediately |
| Tool calls not returned | OpenRouter proxy limitation | Mark as tool-unavailable |

## Recommendation

✅ **Include MiniMax M2.5 in the fallback chain** but with tool validation:
1. First request should test tool support
2. If tool_calls absent → mark `toolsUnavailable`
3. Fall back to next model in chain

## Testing Notes

Direct API testing was limited due to no OPENROUTER_API_KEY in environment. However, documentation confirms native tool support. Production fallback system should include runtime validation.

---
**Next Steps:** Implement fallback chain with runtime tool validation as specified in TASK-fallback-strategy.md
