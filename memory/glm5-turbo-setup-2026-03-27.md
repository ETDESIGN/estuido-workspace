# GLM-5 Turbo Setup - 2026-03-27

**Time**: 03:59 HKT / 19:59 UTC  
**Action**: Added GLM-5 Turbo to OpenClaw configuration  
**Status**: ✅ Complete

---

## 🎯 What Was Done

### 1. Added GLM-5 Turbo Model
- **Model ID**: `glm-5-turbo`
- **Provider**: ZAI (same as GLM-4.7)
- **API Key**: Same existing Zai account
- **Base URL**: `https://api.z.ai/api/coding/paas/v4`

### 2. Configuration Changes
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "zai/glm-5-turbo"
      }
    }
  },
  "models": {
    "providers": {
      "zai": {
        "models": [
          {
            "id": "glm-5-turbo",
            "name": "GLM-5 Turbo",
            "api": "openai-completions",
            "reasoning": true,
            "contextWindow": 204800,
            "maxTokens": 131072
          }
        ]
      }
    }
  }
}
```

### 3. Model Priority
1. **Primary**: `zai/glm-5-turbo` (new default)
2. **Fallback**: `zai/glm-4.7` (still available)

---

## 📊 Model Specifications

### GLM-5 Turbo
- **Context Window**: 204,800 tokens
- **Max Tokens**: 131,072
- **Reasoning**: Enabled
- **Cost**: Free tier (same API key)
- **Speed**: Faster than GLM-5 (optimizations)

### GLM-4.7 (Fallback)
- **Context Window**: 204,800 tokens
- **Max Tokens**: 131,072
- **Reasoning**: Enabled
- **Status**: Available as backup

---

## 🔄 Gateway Restart

**Command**: `systemctl --user restart openclaw-gateway.service`  
**Status**: ✅ Active and running

---

## 🧪 Testing

To verify GLM-5 Turbo is working:

```bash
# Use the model directly
openclaw chat --model zai/glm-5-turbo

# Or use the alias
openclaw chat --model GLM5-Turbo
```

---

## 📝 Notes

- GLM-5 Turbo uses the same OpenAI-compatible API format as GLM-4.7
- No additional API keys or configuration needed
- Automatic fallback to GLM-4.7 if GLM-5 Turbo fails
- Both models share the same free tier allocation

---

*Configuration completed by Dereck (Chief of Staff)*
