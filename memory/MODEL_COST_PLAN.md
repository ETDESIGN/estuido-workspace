# AI Model Cost Plan

## Last Updated: 2026-04-01 ~01:00 HKT

## Main Model (Coding Plan - No API Cost)
- **GLM-5 Turbo** (zai/glm-5-turbo) — via coding plan, monthly flat cost, no per-token API charges
- This is the default model used by the main agent and sub-agents

## OpenRouter API Key (Costs Money, But Some Models FREE)
- OpenRouter key available for additional models
- **Monthly free tier: 1,000,000 tokens** across free models
- Should prioritize free models to minimize costs

## ⚠️ IMPORTANT: KiloCode CLI vs OpenRouter — Different Free Models!

### Free on BOTH (KiloCode CLI + OpenRouter):
- **Xiaomi MIMO V2 Pro** — new model from Xiaomi

### Free on KiloCode CLI only (NOT free on OpenRouter):
- **Minimax** — good for code generation
- **Memo V2** — good for code review
- **Qwen 3.6 Preview** — good for complex reasoning

### Free on OpenRouter only (1M tokens/month):
- (TBD — check OpenRouter free tier for current list)

### NOT free on either:
- Most other models via OpenRouter cost money

## ⚠️ CRITICAL RULE: Token Conservation

### GLM-5 Turbo (Main Agent) — LIMITED TOKENS
- GLM-5 Turbo is free via coding plan, BUT has **limited token budget per month**
- DO NOT waste GLM-5 Turbo tokens on coding tasks
- Reserve GLM-5 Turbo for: conversation, coordination, reasoning, planning, agent orchestration

### Coding Tasks → ALWAYS use KiloCode CLI (unlimited free tokens)
- Unless Etia **explicitly requests** GLM-5 Turbo for a coding task
- KiloCode CLI free models (minimax, memo v2, qwen 3.6, MIMO v2 pro) are UNLIMITED
- Use KiloCode for: file writes, code generation, refactoring, debugging, builds
- This saves GLM-5 Turbo tokens for coordination work

### Routing Rules
- **Coding tasks → KiloCode CLI** (optimized for code: minimax, memo v2, qwen 3.6) — DEFAULT
- **Other/specialized agent tasks → OpenRouter models** (MIMO v2 pro + others)
- **GLM-5 Turbo coding → ONLY when explicitly requested by Etia**

## Cost Priority Strategy
1. **First choice:** GLM-5 Turbo (free, unlimited via coding plan)
2. **Second choice:** KiloCode CLI free models for coding (unlimited)
3. **Third choice:** OpenRouter free models for specialized tasks (1M tokens/month)
4. **Last resort:** Paid models (minimize usage)

## TODO
- [ ] Create a model routing system that automatically prioritizes free models
- [ ] Track monthly free token usage across OpenRouter
- [ ] Configure sub-agents to default to free models
