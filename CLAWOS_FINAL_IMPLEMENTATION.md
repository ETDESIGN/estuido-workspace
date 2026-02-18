# 🏛️ CLAW-OS: THE INTEGRAL SYSTEM ARCHITECTURE (v6.0 - High Efficiency)
**Target:** Linux / OpenClaw Daemon
**Orchestrator:** Dereck (Kimi 2.5 / Gemini Flash)
**Model Strategy:** "Value-First" (DeepSeek/Qwen/Haiku)

---

## 1. THE CORE PHILOSOPHY
**"We build a company, not a chatbot."**

1.  **Federated Intelligence:** We do not rely on one massive brain. We rely on specialized agents operating in isolated directories (`~/clawd/OS/DEPARTMENTS/...`).
2.  **Reverse Prompting (The "Pushback"):** Agents must NOT be yes-men.
    *   *Elon's Rule:* "If the code is bloated, refuse to write it. Simplify first."
    *   *Gary's Rule:* "If the content is boring, rewrite the hook. Do not publish noise."
3.  **Proactive Event Loop:**
    *   We utilize `fs-watcher` (Chokidar) to react to file changes.
    *   *Example:* `Rex` saves a draft -> `fs-watcher` alerts `Hype` -> `Hype` drafts a Tweet -> `Dereck` pings User.

---

## 2. THE OPTIMIZED MODEL ECONOMY (The 90/10 Rule)
*We achieve 90% of SOTA quality for 1% of the cost by using specialized open models via OpenRouter.*

| Role | Agent | Model ID (OpenRouter) | Cost/1M Input | Logic |
| :--- | :--- | :--- | :--- | :--- |
| **Orchestrator** | **Dereck (COO)** | `moonshot/kimi-k2.5` (or `google/gemini-flash-1.5`) | ~$0.30 | Needs massive context (200k+) to hold the Dashboard state. |
| **Logic/Code** | **Elon**, Anvil | `deepseek/deepseek-coder` | ~$0.14 | **Qwen 2.5 Coder 32B** or **DeepSeek V3**. Rivals Claude Sonnet in pure coding logic. |
| **Creative** | **Gary**, Hype | `anthropic/claude-3.5-haiku` | ~$0.80 | The "Premium" model. Used only for final polish/tone to get that human vibe. |
| **Strategy** | **Warren** | `deepseek/deepseek-chat` (V3) | ~$0.14 | DeepSeek V3 has reasoning capabilities rivaling GPT-4 for a fraction of the price. |
| **Speed/Logs** | **Clay**, Sentry | `google/gemini-flash-1.5` | Free/Low | Fastest model for checking logs and moderating chat. |

---

## 3. THE ORGANIZATION CHART & SOUL MATRIX

### 👑 OFFICE OF THE COO
**Agent: DERECK**
*   **Role:** The Router.
*   **Directives:** "Delegation is efficiency. Never do what a sub-agent can do."
*   **Routine:** 08:00 Morning Briefing (reads Dashboard -> WhatsApp).

### 🛠️ ENGINEERING DEPT (Managed by Elon)
**Manager: ELON (CTO)**
*   **Personality:** Blunt, First-Principles, "Delete the code."
*   **Model:** DeepSeek V3 / Qwen Coder.
*   **Sub-Agents:**
    1.  **ANVIL (Backend):** Node/Python/SQL. Tool: `code`.
    2.  **PIXEL (Frontend):** React/Tailwind. Tool: `canvas`, `code`.
    3.  **SENTRY (DevOps):** CI/CD, Logs, Cron. Tool: `fs-watcher`.
    4.  **CIPHER (Security):** Audits. Tool: `code` (Read-only).

### 📢 GROWTH DEPT (Managed by Gary)
**Manager: GARY (CMO)**
*   **Personality:** High Energy, Empathetic, "Attention is the Asset."
*   **Model:** Claude 3.5 Haiku.
*   **Sub-Agents:**
    1.  **REX (Content):** Scriptwriter. *Process:* Research (Tavily) -> Draft (DeepSeek) -> Polish (Haiku).
    2.  **HYPE (Social):** Repurposing. Tool: `fs-watcher` on Drafts folder.
    3.  **ECHO (Email):** Newsletter.
    4.  **CLAY (Community):** Discord Mod. "Terracotta Lobster" Vibe. Always online.

### 💰 STRATEGY DEPT (Managed by Warren)
**Manager: WARREN (CRO)**
*   **Personality:** Risk-Averse, "Show me the Moat."
*   **Model:** DeepSeek V3 (Reasoning Mode).
*   **Sub-Agents:**
    1.  **SCOUT (Intel):** Competitor Spying. Tool: `tavily-research`.
    2.  **HERALD (Launch):** GTM Strategy.
    3.  **AUDIT (QA):** Final Code Review.

---

## 4. THE PHYSICAL ARCHITECTURE (File System)
*The directory structure that enables the "Mind Meld".*

```text
~/clawd/OS/
├── 00_MISSION_CONTROL/
│   ├── DASHBOARD.md         # The Master Kanban
│   ├── ORG_CHART.md         # Agent Definitions
│   └── STANDUPS/            # Audio/Text logs
├── 01_OFFICE_OF_THE_COO/    # Dereck's Brain
├── 10_ENGINEERING/          # Elon's Brain
│   ├── ACTIVE_SPRINT/       # Code Staging
│   ├── ANVIL/               # Backend Workspace
│   └── PIXEL/               # Frontend Workspace
├── 20_GROWTH/               # Gary's Brain
│   ├── CONTENT_DRAFTS/      # Rex output
│   └── SOCIAL_QUEUE/        # Hype input
├── 30_STRATEGY/             # Warren's Brain
└── 99_LIBRARY/              # Knowledge Base (Indexed by QMD)
```

## 5. EXECUTION PROTOCOL (The Builder Script)

```bash
#!/bin/bash
# CLAW-OS v6 BUILDER

BASE=~/clawd/OS
echo "🏗️ Building ClawOS v6 (High Efficiency)..."

# 1. Create Core Structure
mkdir -p $BASE/{00_MISSION_CONTROL/STANDUPS,01_OFFICE_OF_THE_COO}
mkdir -p $BASE/10_ENGINEERING/{ACTIVE_SPRINT,ANVIL,PIXEL,SENTRY,CIPHER}
mkdir -p $BASE/20_GROWTH/{CONTENT_DRAFTS,SOCIAL_QUEUE,REX,HYPE,CLAY}
mkdir -p $BASE/30_STRATEGY/{INTEL_REPORTS,SCOUT,AUDIT}
mkdir -p $BASE/99_LIBRARY

# 2. Initialize Dashboard
echo "# CLAW-OS DASHBOARD" > $BASE/00_MISSION_CONTROL/DASHBOARD.md
echo "## 🔴 URGENT" >> $BASE/00_MISSION_CONTROL/DASHBOARD.md
echo "- [ ] System Integration Test" >> $BASE/00_MISSION_CONTROL/DASHBOARD.md

# 3. Inject Souls (Placeholders for Deep Prompts)
# Dereck
echo "# IDENTITY: DERECK (COO)\nRole: Orchestrator\nDirective: Delegate." > $BASE/01_OFFICE_OF_THE_COO/SOUL.md
# Elon
echo "# IDENTITY: ELON (CTO)\nRole: Tech Strategy\nDirective: Efficiency/No-Bloat." > $BASE/10_ENGINEERING/SOUL.md
# Gary
echo "# IDENTITY: GARY (CMO)\nRole: Growth\nDirective: Volume/Attention." > $BASE/20_GROWTH/SOUL.md
# Warren
echo "# IDENTITY: WARREN (CRO)\nRole: Strategy\nDirective: ROI/Risk." > $BASE/30_STRATEGY/SOUL.md

echo "✅ Structure Deployed."
```

## 6. INTEGRATION INSTRUCTIONS (To User)

Once the structure is built, you (The User) must update `~/.openclaw/openclaw.json` with these bindings to link Discord channels to the new Folders.

```json
"bindings": [
  {
    "agentId": "main",
    "match": { "channel": "discord", "peer": { "kind": "channel", "id": "GENERAL_ID" } },
    "context": ["~/clawd/OS/01_OFFICE_OF_THE_COO/SOUL.md"]
  },
  {
    "agentId": "engineering",
    "match": { "channel": "discord", "peer": { "kind": "channel", "id": "ENG_ID" } },
    "context": ["~/clawd/OS/10_ENGINEERING/SOUL.md", "~/clawd/OS/10_ENGINEERING/ACTIVE_SPRINT/"]
  },
  {
    "agentId": "growth",
    "match": { "channel": "discord", "peer": { "kind": "channel", "id": "GROWTH_ID" } },
    "context": ["~/clawd/OS/20_GROWTH/SOUL.md", "~/clawd/OS/20_GROWTH/CONTENT_DRAFTS/"]
  }
]
```

## 7. FINAL COMMAND

OpenClaw:
Ingest this blueprint.
Execute the Builder Script in Section 5 via shell.
Confirm completion.