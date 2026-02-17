# OpenClaw Tool Profiles - Token Optimization Guide

## The Problem
OpenClaw loads ALL available tools into the system prompt by default (~1-2k tokens wasted).

## The Solution: Strict Tool Profiles

### Profile Configurations

#### 1. CODING Profile (Minimal Tokens)
**Best for:** File editing, coding, terminal work
**Tools:** file-edit, terminal, git only
**Token Savings:** ~1,500 tokens/request

```json
{
  "commands": {
    "native": false,
    "nativeSkills": false
  },
  "tools": {
    "web": { "enabled": false },
    "media": { "enabled": false },
    "browser": { "enabled": false },
    "elevated": { "enabled": true }
  },
  "skills": {
    "allowBundled": false,
    "entries": {
      "git": { "enabled": true },
      "docker": { "enabled": false },
      "code": { "enabled": false }
    }
  }
}
```

**To use:**
```bash
openclaw --profile coding
# Or in config: "profile": "coding"
```

---

#### 2. RESEARCH Profile (Browser + Search)
**Best for:** Web research, documentation, browsing
**Tools:** browser, web-search only
**Token Savings:** ~1,200 tokens/request

```json
{
  "commands": {
    "native": false,
    "nativeSkills": false
  },
  "tools": {
    "web": { 
      "enabled": true,
      "search": { "enabled": true }
    },
    "media": { "enabled": false },
    "browser": { "enabled": true },
    "elevated": { "enabled": false }
  },
  "skills": {
    "allowBundled": false,
    "entries": {}
  }
}
```

**To use:**
```bash
openclaw --profile research
```

---

#### 3. MINIMAL Profile (Essential Only)
**Best for:** Quick chats, simple tasks
**Tools:** NONE (just conversation)
**Token Savings:** ~2,000 tokens/request

```json
{
  "commands": {
    "native": false,
    "nativeSkills": false
  },
  "tools": {
    "web": { "enabled": false },
    "media": { "enabled": false },
    "browser": { "enabled": false },
    "elevated": { "enabled": false }
  },
  "skills": {
    "allowBundled": false,
    "entries": {}
  }
}
```

**To use:**
```bash
openclaw --profile minimal
```

---

#### 4. FULL Profile (Everything)
**Best for:** Complex multi-step tasks
**Tools:** All enabled (current default)
**Token Cost:** ~2,500 tokens/request baseline

```json
{
  "commands": {
    "native": "auto",
    "nativeSkills": "auto"
  },
  "tools": {
    "web": { "enabled": true },
    "media": { "enabled": true },
    "browser": { "enabled": true },
    "elevated": { "enabled": true }
  },
  "skills": {
    "allowBundled": true
  }
}
```

---

## Quick Switching

### Method 1: Environment Variable
```bash
export OPENCLAW_PROFILE=coding
openclaw
```

### Method 2: Command Line
```bash
openclaw --config-profile coding
```

### Method 3: Config File
Edit `~/.openclaw/openclaw.json`:
```json
{
  "profile": "coding"
}
```

---

## Token Savings Calculator

| Profile | Tools Loaded | Tokens/Request | Monthly Savings* |
|---------|--------------|----------------|------------------|
| MINIMAL | 0 | ~500 | ~$15-30 |
| CODING | 3 | ~800 | ~$10-20 |
| RESEARCH | 2 | ~1,000 | ~$8-15 |
| FULL | 15+ | ~2,500 | $0 (baseline) |

*Based on 1000 requests/month on Kimi K2.5

---

## Per-Tool Disable List

If you want fine-grained control, disable specific tools:

```json
{
  "tools": {
    "web": { 
      "enabled": true,
      "search": { 
        "enabled": false  // Disable search, keep other web tools
      }
    },
    "browser": { "enabled": false },
    "media": { "enabled": false },
    "github": { "enabled": false },
    "docker": { "enabled": false }
  }
}
```

---

## Skills Whitelist Mode

To ONLY enable specific skills (block everything else):

```json
{
  "skills": {
    "allowBundled": false,  // Block all bundled skills
    "entries": {
      "git": { "enabled": true },      // Only git
      "code": { "enabled": true },     // Only code skill
      "vercel-deploy": { "enabled": false }
    }
  }
}
```

---

## Recommended Workflow

1. **Start with MINIMAL** for simple questions
2. **Switch to CODING** when editing files
3. **Switch to RESEARCH** when browsing
4. **Use FULL** only when absolutely necessary

---

## Verification

Check which tools are loaded:
```bash
openclaw tools list
```

Check token usage:
```bash
openclaw status --tokens
```
