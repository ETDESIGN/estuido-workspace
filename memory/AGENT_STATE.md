# Agent State — Updated 2026-03-31

## Current Mode
- **Role:** Coordinator (NOT coder)
- **Model:** zai/glm-5-turbo (free)
- **Coding tool:** KiloCode CLI (free models, $0)

## Dev Team Status (11 agents)
| Agent | Status | Notes |
|-------|--------|-------|
| main | ✅ Active | Coordinator role |
| planner | ✅ Ready | PM |
| cto | ✅ Ready | Engineering manager |
| frontend-coder | ✅ Ready | Uses KiloCode for coding |
| backend-coder | ✅ Ready | Uses KiloCode for coding |
| qa | ✅ Ready | Uses KiloCode for tests |
| deployer | ✅ Ready | Vercel/Docker |
| warren | ✅ Ready | Operations |
| derek-negotiator | ⚠️ No SOUL.md | Needs initialization |
| sourcing-agent | ⚠️ No SOUL.md | Needs initialization |
| kilocode | ✅ NEW | KiloCode CLI bridge agent |

## Active Projects
1. Customer Sourcing Dashboard — v0.3 on localhost:8501, needs Vercel deploy
2. Project Spider — Osky RFQ, awaiting Etia instruction

## Key Tools
- KiloCode CLI: `/home/e/.npm-global/bin/kilocode` (v7.0.46)
- acpx bridge: `/home/e/.npm-global/bin/acpx`
- ACP: enabled in openclaw.json
