# OpenRouter Models Guide

> Quick reference for NB Studio - Updated Feb 2026

## Pricing Tiers

| Tier | Price Range | Models |
|------|-------------|--------|
| 🟢 Free | $0 | Various (limited) |
| 💰 Budget | <$0.50/M | DeepSeek V3, Llama |
| ⚡ Mid-Range | $0.50-2/M | Kimi K2.5, MiniMax, Gemini Flash |
| 🔥 Premium | >$2/M | GPT-4o, Claude, Gemini Pro |

---

## Recommended Models for NB Studio

### 💎 Best Value (Free Tier)
| Model | ID | Context | Best For |
|-------|-----|---------|----------|
| Llama 3.3 70B | `groq/llama-3.3-70b-versatile` | 128K | Fast reasoning, general tasks |
| Mixtral 8x7B | `groq/mixtral-8x7b-32768` | 32K | Quick tasks, low cost |

### ⚡ Daily Drivers (Under $2/M)
| Model | ID | Input | Output | Context | Notes |
|-------|-----|-------|--------|--------|-------|
| **Kimi K2.5** | `openrouter/moonshotai/kimi-k2.5` | $0.60 | $2.80 | 256K | ⭐ Best for coding, agent tasks |
| **MiniMax M2.5** | `openrouter/minimax/minimax-m2.5` | $0.40 | $2.20 | 1M | Great for long context |
| Gemini 2.0 Flash | `openrouter/google/gemini-2.0-flash-001` | $0.10 | $0.40 | 1M | Fast, cheap, good reasoning |
| Gemini 2.5 Flash | `openrouter/google/gemini-2.5-flash-preview` | $0.15 | $0.60 | 1M | Latest Flash, multimodal |

### 🔥 Premium (When Needed)
| Model | ID | Input | Output | Context | Notes |
|-------|-----|-------|--------|--------|-------|
| GPT-4o | `openai/gpt-4o` | $2.50 | $10.00 | 128K | Best general purpose |
| Claude 3.5 Sonnet | `anthropic/claude-3.5-sonnet` | $3.00 | $15.00 | 200K | Best for analysis |
| Gemini 2.0 Pro | `google/gemini-2.0-pro` | $1.25 | $5.00 | 2M | Long context, vision |

---

## Cost Comparison (1M tokens)

| Task Size | MiniMax | Kimi K2.5 | Gemini Flash | GPT-4o |
|-----------|---------|------------|--------------|--------|
| 10K input + 2K output | $0.0044 | $0.008 | $0.0018 | $0.045 |
| 100K input + 10K output | $0.026 | $0.066 | $0.016 | $0.35 |
| 1M input + 50K output | $0.15 | $0.30 | $0.08 | $2.00 |

---

## Usage in OpenClaw

### Current Config (Feb 2026)
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "moonshot/kimi-k2.5"  // Default (paid direct)
      }
    }
  }
}
```

### Model Aliases
- `Kimi` → `moonshot/kimi-k2.5` (default)
- `MiniMax` → `openrouter/minimax/minimax-m2.5`
- `Flash` → `openrouter/google/gemini-2.0-flash-001`
- `Flash-Pro` → `openrouter/google/gemini-2.5-flash-preview`
- `Groq-Llama` → `groq/llama-3.3-70b-versatile`
- `Groq-Mixtral` → `groq/mixtral-8x7b-32768`

---

## Switching Models

### This Session Only
```
/model openrouter/moonshotai/kimi-k2.5
```

### Per-Agent Override (agents.json)
```json
{
  "cto": {
    "model": "openrouter/moonshotai/kimi-k2.5"
  }
}
```

---

## Notes

- **OpenRouter markup**: ~10-20% on top of base provider pricing
- **Free tier**: Limited RPM, good for testing
- **Caching**: Some providers cache context - reduces costs
- **Batch API**: Available for some providers at ~50% discount
