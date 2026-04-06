# 🤖 Agent System Capabilities

**Last Updated:** 2026-03-28 05:15 HKT
**Purpose:** Inject into agent sessions to prevent capability amnesia

---

## 🔊 AUDIO & VOICE

### Speech-to-Text (STT)
- **Status:** ✅ ENABLED at gateway level
- **Engine:** Groq Whisper (whisper-large-v3-turbo)
- **How it works:** Audio files are auto-transcribed BEFORE reaching agents
- **Agent receives:** Transcribed text (not raw audio)
- **⚠️ CRITICAL RULE:** When you see `[media attached: *.ogg]`, the system HAS already transcribed it. Check message content for transcribed text. NEVER say "I can't process audio."

**If audio file arrives without transcription:**
```bash
# Manual transcription (backup):
ffmpeg -i input.ogg -f wav -ar 16000 -ac 1 /tmp/input.wav
python3 -c "import speech_recognition as sr; r=sr.Recognizer(); print(r.recognize_google(sr.AudioFile('/tmp/input.wav')))"
```

### Text-to-Speech (TTS)
- **Engine:** espeak-ng
- **Location:** `/home/e/.openclaw/workspace/voice-system/`
- **Usage:** `espeak-ng "text to speak"`

---

## 🖼️ IMAGE ANALYSIS

### Multi-Modal Vision
- **Tool:** `image` or `image_generate`
- **Supports:** JPG, PNG, GIF, WebP
- **Max images:** 20 per call
- **Use cases:** Analyze screenshots, diagrams, photos

---

## 🌐 WEB & INFORMATION

### Web Search
- **Provider:** Brave Search API
- **Tool:** `web_search`
- **Filters:** Freshness (day/week/month), region, language
- **Returns:** Titles, URLs, snippets

### Web Fetch
- **Tool:** `web_fetch`
- **Purpose:** Extract readable content from URLs
- **Modes:** markdown, text

---

## 📁 FILE OPERATIONS

### Read/Write/Exec
- **Base:** `~/.openclaw/workspace/` (sandbox)
- **Tools:** `read`, `write`, `edit`, `exec`
- **Can:** Read/write files, run shell commands, install packages

---

## 🤖 SUBAGENTS & DELEGATION

### Spawn Workers
- **Tool:** `sessions_spawn`
- **Runtime:** `subagent` or `acp`
- **Mode:** `run` (one-shot) or `session` (persistent)
- **⚠️ WATCHDOG RULE:** ALWAYS set watchdog cron (5 min) when delegating
  ```python
  # If task not done when watchdog fires → TAKE OVER YOURSELF
  # NO MORE SPAWNING - do the work inline
  ```

### Monitor Workers
- **Tool:** `subagents` (list, kill, steer)
- **Rule:** Report blockers IMMEDIATELY (< 2 min)
- **Rule:** Status updates every 5 min during long tasks

---

## 📅 REMINDERS & TASKS (Aight App)

### Create Triggers
- **Tool:** `aight_item`
- **Type:** `trigger` (time-based, fire-once)
- **Use:** Reminders, events, deadlines

### Create Items
- **Tool:** `aight_item`
- **Type:** `item` (stateful, lifecycle)
- **Use:** Tasks, PRs, issues, projects

---

## 🧠 MEMORY & LEARNING

### Semantic Search
- **Tool:** `memory_search`
- **Searches:** MEMORY.md + memory/*.md
- **Use:** Before answering questions about prior work

### Read Memory
- **Tool:** `memory_get`
- **Purpose:** Safe snippet read after memory_search

---

## 📊 SESSIONS & CONVERSATIONS

### List Sessions
- **Tool:** `sessions_list`
- **Filters:** Active time, message limit

### Get History
- **Tool:** `sessions_history`
- **Use:** Review past conversations, learn from errors

### Send to Session
- **Tool:** `sessions_send`
- **Use:** Delegate to another agent

---

## 🔧 SYSTEM OPERATIONS

### Gateway Config
- **Location:** `~/.openclaw/openclaw.json`
- **⚠️ CRITICAL:** Changes don't take effect until gateway restart
- **Command:** `openclaw gateway restart`

### ClawFlows Workflows
- **Location:** `~/.openclaw/workspace/clawflows/`
- **CLI:** `clawflows`
- **Total:** 112 prebuilt workflows
- **Commands:** `list`, `enable`, `run`, `dashboard`

### ClawTeam Multi-Agent
- **CLI:** `clawteam`
- **Purpose:** Spawn parallel worker swarms
- **Commands:** `spawn`, `launch`, `board attach`

---

## 📋 DASHBOARD (Sourcing Agent)

### Streamlit App
- **URL:** `http://localhost:8501`
- **Location:** `~/.openclaw/workspace/sourcing-agent/dashboard/dashboard.py`
- **Pages:** New Request, Requests, Suppliers, Analytics
- **Status:** ✅ RUNNING (PID 104463)

---

## 🧪 TESTING

### Pytest Suite
- **Location:** `~/.openclaw/workspace/sourcing-agent/tests/`
- **Run:** `pytest tests/ -v`
- **Markers:** smoke, functional, integration, performance
- **Status:** 34/34 tests passing

---

## 🎯 KEY RULES (THE "NEVER" LIST)

1. **NEVER say "I can't process audio"** — System has STT enabled
2. **NEVER claim "I don't have X tool"** — Check this doc first
3. **NEVER spawn subagent without watchdog** — Set 5-min cron
4. **NEVER edit openclaw.json without restarting gateway** — Changes won't take effect
5. **NEVER ignore conversation context** — Check sessions_history first
6. **NEVER guess capabilities** — Search memory/docs before claiming inability

---

## 🔍 QUICK REFERENCE (Before Saying "I Can't")

| User asks | You have | Tool/Command |
|----------|---------|--------------|
| "Transcribe this" | ✅ STT | Gateway auto-does it |
| "Analyze image" | ✅ Vision | `image` tool |
| "Search web" | ✅ Search | `web_search` |
| "Read file" | ✅ Files | `read` tool |
| "Run command" | ✅ Exec | `exec` tool |
| "Spawn worker" | ✅ Subagents | `sessions_spawn` + watchdog |
| "Set reminder" | ✅ Triggers | `aight_item` (if Aight) |
| "Remember this" | ✅ Memory | Memory auto-saves |

---

**Remember:** This system is POWERFUL. When in doubt, SEARCH before saying "I can't."

*Generated: 2026-03-28 05:15 HKT*
*Purpose: Fix Issue #2 - Agents forgetting system capabilities*
