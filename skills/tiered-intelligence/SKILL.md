# Tiered Intelligence Skill

Automatic model routing based on task complexity for cost optimization.

## Overview

This skill implements a three-tier intelligence system:
- **TIER 1 (The Pulse)**: Cheap models for routine/heartbeat tasks
- **TIER 2 (The Workhorse)**: Mid-tier models for moderate complexity  
- **TIER 3 (The Brain)**: Premium models for complex reasoning

## Model Tiers

| Tier | Model | Cost/M | Use For |
|------|-------|--------|---------|
| **Pulse** | Gemini 2.0 Flash | $0.10-0.40 | Heartbeats, greetings, simple Q&A, status checks |
| **Workhorse** | MiniMax-01 | $1.50-3.00 | Summaries, code generation, analysis |
| **Brain** | Kimi K2.5 | Premium | Complex reasoning, debugging, architecture, multi-step |

## Usage

### Automatic Routing

Use the `/route` command followed by your request:

```
/route check my email and calendar for today
```

The skill will classify the task and spawn an appropriate sub-agent.

### Direct Tier Selection

```
/pulse what's the weather like?              → Gemini Flash
/workhorse summarize this article            → MiniMax
/brain design a system architecture          → Kimi K2.5
```

### Manual Model Override

Always available via standard OpenClay aliases:
```
/model Flash        → Gemini 2.0 Flash
/model MiniMax      → MiniMax-01
/model Kimi         → Kimi K2.5 (default)
```

## Task Classification Rules

### TIER 1 - Pulse (Routine)
**Keywords**: check, status, heartbeat, hello, hi, thanks, ok, weather, time, simple
**Patterns**:
- Single-step lookups
- Status checks (email, calendar, system)
- Greetings and acknowledgments
- Simple factual questions
- File reads without analysis

### TIER 2 - Workhorse (Moderate)
**Keywords**: summarize, generate, create, build, analyze, draft, convert, format
**Patterns**:
- Content generation (code, text, summaries)
- Data transformation
- Multi-step but well-defined tasks
- Standard analysis without novel reasoning

### TIER 3 - Brain (Complex)
**Keywords**: debug, design, architect, reason, prove, investigate, troubleshoot, plan
**Patterns**:
- Debugging errors
- System architecture design
- Novel problem-solving
- Multi-step reasoning with dependencies
- When previous tiers failed

## Implementation

The skill uses `sessions_spawn` to delegate to sub-agents with the appropriate model:

```javascript
// Classification logic
if (isRoutineTask(request)) {
  return spawnSubAgent(request, "openrouter/google/gemini-2.0-flash-001");
} else if (isModerateTask(request)) {
  return spawnSubAgent(request, "openrouter/minimax/minimax-01");
} else {
  return spawnSubAgent(request, "moonshot/kimi-k2.5"); // Default
}
```

## Cost Savings

Typical distribution:
- 70% Pulse (routine) @ $0.10/M = $0.07
- 20% Workhorse (moderate) @ $2.25/M = $0.45
- 10% Brain (complex) @ $2.90/M = $0.29

**Blended average: ~$0.81/M vs $2.90/M pure Brain = 72% savings**

## Configuration

Add to `agents.defaults.models` in your OpenClaw config:

```json
{
  "openrouter/google/gemini-2.0-flash-001": { "alias": "Flash" },
  "openrouter/minimax/minimax-01": { "alias": "MiniMax" },
  "moonshot/kimi-k2.5": { "alias": "Kimi" }
}
```

## Commands

| Command | Action |
|---------|--------|
| `/route <task>` | Auto-classify and execute |
| `/pulse <task>` | Force TIER 1 (Flash) |
| `/workhorse <task>` | Force TIER 2 (MiniMax) |
| `/brain <task>` | Force TIER 3 (Kimi K2.5) |
| `/tier status` | Show current routing stats |

## Fallback Behavior

If a cheap tier fails or produces low-quality output:
1. Log the failure
2. Automatically retry with next tier up
3. Track escalation patterns for prompt improvement

## Notes

- Kimi K2.5 remains the **default** for all non-routed requests
- Sub-agents inherit tools from parent session
- Each tier has appropriate timeout limits (Pulse: 30s, Workhorse: 60s, Brain: 120s)
