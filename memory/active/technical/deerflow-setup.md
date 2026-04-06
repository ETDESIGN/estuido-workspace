---
tags: deerflow, agent, bytedance, installation, guide, on-demand
type: technical
priority: high
status: active
created: 2026-04-03
updated: 2026-04-03
---

# DeerFlow 2.0 — Installation & Usage Guide

> **ByteDance's open-source SuperAgent harness** — research, code, and create
>
> GitHub: https://github.com/bytedance/deer-flow
> Website: https://deerflow.tech
> License: MIT (free)
> Stars: ~50K

---

## 📋 What is DeerFlow?

DeerFlow is an AI agent orchestration platform that can:
- **Research** topics deeply (web search, crawling, document analysis)
- **Write and execute code** in sandboxed environments
- **Generate content** — reports, slides, web pages
- **Spawn sub-agents** for parallel complex tasks
- **Remember** things across sessions (long-term memory)
- **Connect** to Telegram, Slack, Feishu/Lark

It's built on LangChain + LangGraph (Python) with a Next.js frontend.

**How it differs from OpenClaw:**
- OpenClaw = your personal AI butler (always-on, mobile-first, voice, messaging)
- DeerFlow = your AI research team (on-demand, desktop browser, deep autonomous tasks)

---

## 🖥️ System Requirements

| Component | Required | Our System |
|-----------|----------|------------|
| CPU | Multi-core | ✅ i5-10400 (6 cores) |
| RAM | 8GB+ (16GB recommended) | ⚠️ 16GB (tight when both running) |
| Disk | ~5GB | ✅ 327GB free |
| Python | 3.12+ | ✅ 3.12.3 |
| Node.js | 22+ | ✅ 22.22.0 |
| pnpm | Required | ✅ 10.33.0 |
| uv | Required | ✅ 0.11.2 |
| Docker | Recommended | ✅ 28.2.2 (installed 2026-04-03) |
| nginx | Required | ✅ 1.24.0 (installed 2026-04-03) |

---

## 📁 Installation Location

```
~/deer-flow/                    # Main project directory
├── config.yaml                 # Model & sandbox configuration
├── .env                        # API keys (OpenRouter, OpenAI)
├── deerflow-start.sh           # ← START script
├── deerflow-stop.sh            # ← STOP script
├── scripts/serve.sh            # Official startup script
├── backend/                    # Python backend (LangGraph + Gateway)
│   ├── app/gateway/            # Gateway API (port 8001)
│   └── pyproject.toml          # Python dependencies
├── frontend/                   # Next.js web UI
├── docker/nginx/               # Nginx reverse proxy config
├── skills/                     # Built-in skills (research, slides, etc.)
│   └── public/
│       ├── research/SKILL.md
│       ├── report-generation/SKILL.md
│       ├── slide-creation/SKILL.md
│       └── web-page/SKILL.md
└── logs/                       # Runtime logs (auto-created)
    ├── langgraph.log
    ├── gateway.log
    ├── frontend.log
    └── nginx.log
```

---

## 🚀 Quick Start

### Starting DeerFlow

```bash
# Start all services (takes ~15-20 seconds)
bash ~/deer-flow/deerflow-start.sh

# Or use the official script directly
cd ~/deer-flow && bash scripts/serve.sh --dev
```

### Stopping DeerFlow

```bash
# Stop everything and free ~2-3GB RAM
bash ~/deer-flow/deerflow-stop.sh

# Or from the project directory
cd ~/deer-flow && make stop
```

### Checking Status

```bash
# Check if running
curl -s http://localhost:2026/ | head -3        # Web UI
curl -s http://localhost:8001/health             # API Gateway
curl -s http://localhost:2024/ok                 # LangGraph

# Check RAM usage
free -h | grep Mem
```

### Accessing the Dashboard

Open in your browser: **http://localhost:2026**

| Service | URL |
|---------|-----|
| 🌐 Web UI (Dashboard) | http://localhost:2026 |
| 📡 API Gateway | http://localhost:8001 |
| 🤖 LangGraph | http://localhost:2024 |

---

## 🧠 Configured Models

All models are accessed via **OpenRouter** (single API key shared with OpenClaw):

| Model | ID | Use For |
|-------|----|---------|
| **Claude Sonnet 4.5** | `anthropic/claude-sonnet-4-5` | Main model (reasoning, coding) |
| **GPT-5.2** | `openai/gpt-5.2` | General purpose |
| **DeepSeek V3.2** | `deepseek/deepseek-chat-v3-0324` | Fast, cheap tasks |
| **Gemini 2.5 Flash** | `google/gemini-2.5-flash-preview` | Speed, vision |

### Changing Models

Edit `~/deer-flow/config.yaml` under the `models:` section.

To add a new model:
1. Add entry to `config.yaml`
2. Add API key to `.env` if needed
3. Restart DeerFlow (`bash deerflow-stop.sh && bash deerflow-start.sh`)

---

## 🛠️ Configuration Files

### config.yaml (~/deer-flow/config.yaml)

Key sections:
- `models:` — LLM providers and models
- `sandbox:` — execution environment (local vs Docker)
- `skills:` — skill paths
- `gateway:` — API server settings
- `langgraph:` — LangGraph server settings

### .env (~/deer-flow/.env)

```
OPENROUTER_API_KEY=sk-or-v1-...    # OpenRouter (shared with OpenClaw)
OPENAI_API_KEY=sk-proj-...         # OpenAI (fallback)
TAVILY_API_KEY=                     # Web search (optional, free at tavily.com)
```

---

## 📖 How to Use

### 1. Web Dashboard (http://localhost:2026)

The main way to interact with DeerFlow:

1. Open http://localhost:2026 in your browser
2. Select a model from the dropdown (top-right)
3. Type your task in the chat input
4. DeerFlow will plan, research, code, and respond

**Example tasks:**
- "Research the latest developments in quantum computing and write a summary report"
- "Create a landing page for a coffee shop business"
- "Analyze this dataset and generate insights"
- "Write a Python script to scrape weather data"

### 2. Execution Modes

DeerFlow supports different execution modes:
- **Flash** — Fast, single-pass response
- **Standard** — Normal agent execution with tools
- **Pro (Planning)** — Plans first, then executes step-by-step
- **Ultra (Sub-agents)** — Spawns parallel sub-agents for complex tasks

### 3. Built-in Skills

| Skill | What It Does |
|-------|-------------|
| `research` | Deep web research with citations |
| `report-generation` | Generates formatted reports |
| `slide-creation` | Creates presentation slides |
| `web-page` | Builds web pages from descriptions |
| `image-generation` | Generates images |

Skills are loaded progressively (only when needed) to save tokens.

### 4. Long-Term Memory

DeerFlow remembers your preferences and context across sessions. Access via:
- Web UI: **Settings > Memory**
- The more you use it, the better it adapts to your style.

### 5. File Management

Upload files through the web UI for analysis. Files are stored in:
- `~/deer-flow/data/uploads/` — Your uploads
- `~/deer-flow/data/workspace/` — Agent working directory
- `~/deer-flow/data/outputs/` — Generated deliverables

### 6. CLI Chat Commands

From IM channels (Telegram/Slack/Feishu):
| Command | Description |
|---------|-------------|
| `/new` | Start a new conversation |
| `/status` | Show current thread info |
| `/models` | List available models |
| `/memory` | View memory |
| `/help` | Show help |

---

## 💰 Cost

| Component | Cost |
|-----------|------|
| DeerFlow software | **$0** (MIT license) |
| LLM API calls | Varies by model (paid via OpenRouter) |
| Web search (Tavily) | **$0** (free: 1000 searches/month) |
| Docker | **$0** |
| **Estimated monthly** | **$0-20** for personal/light use |

---

## 📊 RAM Management

Your system has **16GB RAM** shared between OpenClaw and DeerFlow:

| State | RAM Used | Recommendation |
|-------|----------|----------------|
| OpenClaw only | ~8.5GB | ✅ Normal (daily driver) |
| OpenClaw + DeerFlow | ~11-13GB | ⚠️ Works but tight |
| DeerFlow heavy task | ~13-15GB | ⚠️ May slow down |

**Best practice:** Stop DeerFlow when not actively using it:
```bash
bash ~/deer-flow/deerflow-stop.sh
```

---

## 📝 Viewing Logs

```bash
# All logs in one place
ls ~/deer-flow/logs/

# Real-time log watching
tail -f ~/deer-flow/logs/gateway.log     # API logs
tail -f ~/deer-flow/logs/langgraph.log   # Agent execution logs
tail -f ~/deer-flow/logs/frontend.log    # Frontend logs
tail -f ~/deer-flow/logs/nginx.log       # Proxy logs
```

---

## 🔧 Troubleshooting

### Port already in use
```bash
bash ~/deer-flow/deerflow-stop.sh
bash ~/deer-flow/deerflow-start.sh
```

### Backend won't start
```bash
cd ~/deer-flow/backend && uv sync
bash ~/deer-flow/deerflow-start.sh
```

### Frontend won't start
```bash
cd ~/deer-flow/frontend && pnpm install
bash ~/deer-flow/deerflow-start.sh
```

### Model API errors
- Check `.env` has valid `OPENROUTER_API_KEY`
- Check your OpenRouter credits: https://openrouter.ai/credits

### Out of memory
```bash
bash ~/deer-flow/deerflow-stop.sh
free -h    # Should free 2-3GB
```

### Docker permission denied
```bash
# Re-add your user to docker group (needs logout/login to take effect)
sudo usermod -aG docker e
# Or use:
sg docker -c "docker ps"
```

---

## 🔄 Updating DeerFlow

```bash
cd ~/deer-flow
git pull
cd backend && uv sync
cd ../frontend && pnpm install
bash ~/deer-flow/deerflow-stop.sh
bash ~/deer-flow/deerflow-start.sh
```

---

## 🔒 Security Note

DeerFlow runs on **localhost only** (127.0.0.1) by default — not accessible from outside your machine. This is intentional and secure. Do NOT expose it to public networks without:
- IP allowlist (iptables)
- Authentication gateway (nginx + auth)
- Network isolation (VLAN)

---

## 📅 What Was Installed (2026-04-03)

| Package | Version |
|---------|---------|
| Docker | 28.2.2 |
| nginx | 1.24.0 |
| DeerFlow | 2.0 (latest from main branch) |
| Python backend | 187 packages via uv |
| Node.js frontend | 1051 packages via pnpm |
| Sandbox mode | Local (host execution) |

---

*Last updated: 2026-04-03*
*Installed by: OpenClaw agent (Bruno)*
