# Discord Model Fixed - GLM 4.7
**Date:** 2026-03-24 18:35
**Status:** ✅ Configured

---

## 🎯 Configuration Applied

### Discord Channel Model
**Before:** `null` (using default/routing)
**After:** `zai/glm-4.7` ✅

**Why:** User reported Discord was using wrong model (Moonshot/OpenRouter/GLM-5)

---

## 🔧 Changes Made

### 1. openclaw.json
```json
.channels.discord.model = "zai/glm-4.7"
```

### 2. models.json
**Removed:** `zai/glm-5` (doesn't work per user)
**Kept:** `zai/glm-4.7` ✅

**Current models.json:**
- elevenlabs/tts (voice)
- groq/llama-3.3-70b-versatile
- groq/mixtral-8x7b-32768
- moonshot/kimi-k2-0905-preview
- moonshot/kimi-k2.5
- openrouter/moonshotai/kimi-k2.5
- qwen-portal/coder-model
- qwen-portal/vision-model
- **zai/glm-4.7** ✅ (Discord default)

---

## ✅ Working Configuration

**Provider:** ZAI (z.ai)
**Model:** GLM-4.7
**API:** OpenAI-compatible
**Features:**
- Reasoning: true
- Context Window: 204,800 tokens
- Max Tokens: 131,072

**What Works:**
- ✅ Text generation
- ✅ Tool use
- ✅ Long context
- ✅ Stable responses

**What Doesn't Work (per user):**
- ❌ GLM-5 (same provider, different model)
- ❌ OpenRouter models
- ❌ Moonshot models

---

## 🔄 Gateway Restart Required

**Command:** `openclaw gateway restart`
**Status:** Pending (needs restart to apply)

---

## 📋 Verification Steps

After gateway restart:
1. Send message via Discord
2. Check model being used in logs
3. Confirm no 404/tool-use errors
4. Verify responses are from GLM-4.7

---

## 📝 Notes

**User Requirements:**
- Only GLM-4.7 with ZAI API works
- GLM-5 doesn't work (unknown reason)
- OpenRouter/Moonshot have issues

**Configuration:** Hardcoded for Discord channel to prevent routing to wrong models.

---

**Next:** Restart gateway and verify Discord uses zai/glm-4.7
