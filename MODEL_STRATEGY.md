# Model Strategy - Cost-Optimized (Updated 2026-02-16)

## Executive Summary
**Priority:** Minimize API costs while maintaining quality. **Claude/expensive models FORBIDDEN** unless E personally requests.

---

## Tier Definitions

### 🧠 BRAIN (Deep Reasoning)
**Model:** `moonshot/kimi-k2.5` (your API)  
**Cost:** $0.80/M tokens  
**Use When:**
- Complex problem solving
- Architecture decisions
- Multi-step reasoning
- Final quality review

**Never use:** Claude, GPT-4, or any model >$2/M tokens

---

### 🐎 WORKHORSE (Daily Tasks)
**Primary:** `openrouter/minimax/minimax-01`  
**Cost:** $1.50/M input, $3.00/M output  
**Fallback:** `openrouter/google/gemini-2.0-flash-001`  
**Cost:** $0.10/M input, $0.40/M output  

**Use When:**
- General questions
- Code review (non-critical)
- Documentation
- Routine analysis

**Decision Rule:** Use MiniMax unless Gemini Flash is 5x+ cheaper for the task.

---

### 💻 DEV AGENT (Implementation)
**Primary:** KiloCode CLI with free tier  
**Models:**
| Alias | Model | Cost |
|-------|-------|------|
| `glm` | GLM-5:free | $0 |
| `minimax` | MiniMax M2.5:free | $0 |
| `llama` | Llama 3.3 70B:free | $0 |
| `deepseek` | DeepSeek R1:free | $0 |

**Use When:**
- Feature implementation
- Bug fixes
- Refactoring
- Testing
- Any coding task

**Mandate:** ALWAYS try KiloCode free models first before using paid APIs.

---

### 🌿 PULSE (Quick/Local)
**Models:**
- **Local:** Ollama + nomic-embed-text (embeddings)
- **Free API:** Groq (Llama 3.3, Mixtral) - unlimited free tier

**Use When:**
- Embeddings/memory
- Quick lookups
- Simple questions
- Heartbeat checks

---

## Decision Flowchart

```
Is this a coding/dev task?
│
├── YES ──▶ Use KiloCode CLI (free models)
│   │
│   └── If KiloCode fails ──▶ Escalate to WORKHORSE
│
└── NO
    │
    ▼
Does this need deep reasoning / architecture?
│
├── YES ──▶ Use BRAIN (Kimi K2.5)
│
└── NO ──▶ Use WORKHORSE (MiniMax/Gemini)
```

---

## Forbidden Models
**NEVER use unless E personally requests:**
- ❌ Claude 3.5/3.7 Sonnet ($3-15/M tokens)
- ❌ GPT-4o ($5-15/M tokens)
- ❌ Any model >$2/M tokens without explicit approval

---

## Cost Comparison (Per 1M Tokens)

| Model | Input | Output | Total (50/50) |
|-------|-------|--------|---------------|
| **GLM-5:free** | $0 | $0 | **$0** ⭐ |
| **MiniMax:free** | $0 | $0 | **$0** ⭐ |
| Gemini 2.0 Flash | $0.10 | $0.40 | $0.25 |
| MiniMax 01 | $1.50 | $3.00 | $2.25 |
| Kimi K2.5 | ~$0.60 | ~$2.40 | ~$1.50 |
| Claude 3.5 | $3.00 | $15.00 | $9.00 ❌ |

---

## Current Configuration

### OpenClaw Configured Models
- ✅ `moonshot/kimi-k2.5` (BRAIN)
- ✅ `openrouter/minimax/minimax-01` (WORKHORSE)
- ✅ `openrouter/google/gemini-2.0-flash-001` (WORKHORSE fallback)
- ✅ `groq/llama-3.3-70b-versatile` (PULSE - free)
- ✅ `groq/mixtral-8x7b-32768` (PULSE - free)

### KiloCode CLI Configured
- ✅ `glm` → GLM-5:free
- ✅ `minimax` → MiniMax M2.5:free
- ✅ `llama` → Llama 3.3 70B:free
- ✅ `deepseek` → DeepSeek R1:free
- ✅ `gemma` → Gemma 3 12B:free
- ✅ `gpt-oss` → GPT-OSS 120B:free

### Local Infrastructure
- ✅ Ollama running (PID 133295)
- ✅ nomic-embed-text for embeddings

---

## Agent Assignments

| Agent | Primary Model | Role |
|-------|--------------|------|
| **Dereck (me)** | Kimi K2.5 | GM, strategy, approval |
| **CTO** | KiloCode free models | Dev work, implementation |
| **Sub-agents** | MiniMax/Gemini Flash | Research, analysis |
| **Heartbeat** | Groq (free) | Periodic checks |

---

## Monthly Cost Target

**Goal:** <$20/month for all AI operations

**Strategy:**
- 90% of dev work → KiloCode free tier ($0)
- 8% routine tasks → MiniMax/Gemini (~$15)
- 2% complex decisions → Kimi K2.5 (~$5)

---

## Emergency Escalation

If a task **requires** Claude/expensive model:
1. Halt and ask E for explicit approval
2. Document why cheaper models failed
3. Get written confirmation before proceeding

---

_Last updated: 2026-02-16_  
_Author: Dereck (GM)_
_Approved by: E (President)_
