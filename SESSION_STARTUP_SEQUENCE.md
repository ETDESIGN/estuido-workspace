# Session Startup Protocol

**Purpose:** Ensure every session starts with complete system awareness  
**Status:** MANDATORY for all agents  
**Last Updated:** 2026-03-29

---

## The Problem

Every new session, agents forget:
- What tools are installed
- What integrations exist
- What projects are active
- System constraints (RAM, budget)
- Recent decisions and context

This leads to:
- Claiming things work without checking
- Proposing solutions that already exist
- Asking about already-configured systems
- Wasting tokens re-learning

---

## The Solution: Session Startup Sequence

### Phase 1: Critical Files (READ FIRST)

Before responding to ANY user message, read in order:

```
1. SOUL.md              - Who you are, your role, operating principles
2. IDENTITY.md          - Your name, role, vibe
3. MEMORY.md            - Memory system overview
4. USER.md              - How E works, preferences, constraints
5. HEARTBEAT.md         - Active systems, recent changes
6. LEARNINGS.md         - What you've learned (mistakes to avoid)
7. TOOLS.md             - Available tools and access levels
```

### Phase 2: System Inventory

Check what's ACTUALLY available:

```bash
# Voice system
ls -la voice-system/scripts/ | grep -E "\.sh$" | wc -l  # Should be 10+
which spd-say                    # TTS available
which arecord                    # Recording available
python3 -c "import speech_recognition; print('STT OK')"  # STT available

# Search systems
which qmd                        # BM25 + vector search
./scripts/memory-search.sh --test 2>&1 | grep -q "OK" && echo "Native memory OK"

# Cost monitoring
cat ~/.config/llvm-project/clangd/cost-monitor.log 2>/dev/null | tail -5

# Active projects
ls -d sourcing-agent/ 2>/dev/null && echo "Sourcing agent exists"
ls -d mission-control/ 2>/dev/null && echo "Mission Control exists"
```

### Phase 3: Integration Status

```bash
# Gateway
cat ~/.openclaw/openclaw.json | jq -r '.agents.list[]'  # All agents
cat ~/.openclaw/openclaw.json | jq -r '.tools.audio.enabled'  # Audio transcription

# Connected services
cat ~/.openclaw/openclaw.json | jq -r '.integrations // {}' | grep -E "(discord|google|whatsapp)"

# Active sessions
sessions_list --kinds agent --limit 5
```

### Phase 4: Resource Awareness

```bash
# RAM (critical constraint!)
free -h  # Total: 5GB, check available

# Today's budget
cat ~/.config/cost-monitor/today.txt 2>/dev/null || echo "~$0.41/day"

# Project status
ls -la sourcing-agent/ | head -10  # Last activity
```

### Phase 5: Recent Context

```bash
# Today's memory
cat memory/$(date +%Y-%m-%d).md 2>/dev/null | head -50

# Latest learnings
cat LEARNINGS.md 2>/dev/null

# Recent changes
git log --oneline -5 2>/dev/null
```

---

## Session Startup Checklist

Print this to internal state before responding:

```
═══ SESSION STARTUP COMPLETE ═══

📍 Identity: [Name from IDENTITY.md]
🎯 Role: [Role from SOUL.md]
👤 User: [E's preferences from USER.md]

🔧 AVAILABLE TOOLS:
  ✅ Voice Input: arecord + speech_recognition
  ✅ Voice Output: spd-say (espeak-ng)
  ✅ Memory: Native semantic + QMD BM25
  ✅ Search: qmd + memory_search
  ✅ Cost Monitor: Active ($0.41/day)
  ✅ Gateway Audio: Groq Whisper enabled
  ✅ Integrations: [List from openclaw.json]

⚠️  CONSTRAINTS:
  💾 RAM: 5GB total (check free -h)
  💰 Budget: $5/day target
  🌐 Online: Google STT requires internet

📂 ACTIVE PROJECTS:
  - sourcing-agent/ [Status]
  - mission-control/ [Status]
  - [Others from ls]

📝 RECENT DECISIONS:
  - [From memory/$(date +%Y-%m-%d).md]
  - [From LEARNINGS.md]

═════════════════════════════════
```

---

## Implementation

### Option 1: Manual (Current)

At start of EVERY session, run:

```bash
# Read critical files
cat SOUL.md IDENTITY.md MEMORY.md USER.md HEARTBEAT.md LEARNINGS.md TOOLS.md

# Check system
which spd-say arecord qmd
python3 -c "import speech_recognition; print('STT OK')"

# Show active projects
ls -d */ | head -10
```

### Option 2: Automated (RECOMMENDED)

Create `session-startup.sh`:

```bash
#!/bin/bash
echo "═══ SESSION STARTUP ═══"
echo ""
echo "📖 Reading critical files..."
for f in SOUL.md IDENTITY.md MEMORY.md USER.md HEARTBEAT.md LEARNINGS.md TOOLS.md; do
    [ -f "$f" ] && echo "  ✅ $f" || echo "  ❌ $f missing"
done

echo ""
echo "🔧 Checking tools..."
which spd-say >/dev/null && echo "  ✅ TTS (spd-say)" || echo "  ❌ TTS missing"
which arecord >/dev/null && echo "  ✅ Recording (arecord)" || echo "  ❌ Recording missing"
python3 -c "import speech_recognition" 2>/dev/null && echo "  ✅ STT (Google)" || echo "  ❌ STT missing"
which qmd >/dev/null && echo "  ✅ QMD search" || echo "  ⚠️  QMD not in PATH"

echo ""
echo "💾 Resources:"
free -h | grep "Mem:" | awk '{printf "  RAM: %s / %s\n", $3, $2}'

echo ""
echo "📂 Active projects:"
ls -d */ 2>/dev/null | grep -v "node_modules" | head -5

echo "═════════════════════════════════"
```

### Option 3: Built into SOUL.md

Add this to SOUL.md (under "Continuity"):

```markdown
## Session Startup (MANDATORY)

Before responding to ANY user message:

1. Read: SOUL.md, IDENTITY.md, MEMORY.md, USER.md, HEARTBEAT.md, LEARNINGS.md, TOOLS.md
2. Check: which spd-say arecord qmd
3. Verify: python3 -c "import speech_recognition"
4. Report: free -h (RAM available)
5. Context: cat memory/$(date +%Y-%m-%d).md | head -30

This takes ~5 seconds and saves hours of confusion.
```

---

## Quick Reference Card

Create `SESSION_CONTEXT.txt` in home dir:

```
VOICE:
- Input: voice-simple.sh, voice-verify.sh
- Output: linux-voice.sh (uses spd-say)
- System: voice-system/ (10 scripts)
- Gateway: Groq Whisper enabled

MEMORY:
- Native: memory_search tool
- QMD: qmd search (BM25 + vectors)
- Scripts: ./scripts/memory-*.sh

PROJECTS:
- sourcing-agent/ - Active development
- mission-control/ - Dashboard builderz
- customers/ - Client work

CONSTRAINTS:
- RAM: 5GB total
- Budget: $5/day target
- Online: Google STT needs internet

INTEGRATIONS:
- Discord: ESTUDIO Bot (3 channels)
- Google: caneles2hk@gmail.com (connected)
- WhatsApp: Gateway enabled
```

---

## Enforcement

### Agent Responsibility

Before FIRST response in session:

1. ✅ Read critical files (7 files, ~5 seconds)
2. ✅ Run system checks (which/verify, ~2 seconds)
3. ✅ Load today's context (memory, ~2 seconds)
4. ✅ Only THEN respond to user

Total time: ~10 seconds  
Cost: Saved by not re-learning every session

### Validation

If an agent claims something works without checking:
- ❌ "QMD is working" → Must run: `qmd status`
- ❌ "Voice output is ready" → Must run: `which spd-say`
- ❌ "That script exists" → Must run: `ls -la script.sh`

**Never claim without verification.**

---

## Examples

### ❌ BAD Session Start

```
User: "Can you transcribe this audio?"
Agent: "Sure! Let me check what tools we have..."
[Spends 5 minutes re-learning system]
```

### ✅ GOOD Session Start

```
[Agent starts session]
→ Reads SOUL.md, IDENTITY.md, MEMORY.md (5s)
→ Runs: which spd-say arecord speech_recognition (2s)
→ Checks: free -h, qmd status (2s)
→ Context: memory/2026-03-29.md (2s)

User: "Can you transcribe this audio?"
Agent: "Yes. You have:
- Gateway: Groq Whisper (auto-transcribes)
- Local: Google STT via speech_recognition
- Scripts: voice-simple.sh, voice-verify.sh

Want me to use gateway or local transcription?"
```

---

## Success Metrics

### Before This Protocol
- ❌ Agent forgets tools every session
- ❌ Re-learns system 3-4x per session
- ❌ Claims broken things work
- ❌ Wastes 10,000+ tokens re-discovering

### After This Protocol
- ✅ Agent knows full capabilities at start
- ✅ 10-second startup saves hours
- ✅ Verifies before claiming
- ✅ Context-aware from first message

---

## Maintenance

Update this file when:
- New tools added
- Projects created/deleted
- Integrations change
- Constraints updated
- Agent roles modified

---

**Created:** 2026-03-29  
**Owner:** All agents  
**Status:** MANDATORY

---

*This protocol prevents amnesia. Use it every session.*
