# TOOLS.md — Tool Reference

## KiloCode CLI (Primary Coding Tool)
All coding must use KiloCode with free models.

### Commands
```bash
# Non-interactive coding task
kilo run -m kilo/qwen/qwen3.6-plus-preview:free "task" --cwd /path/to/project --format json

# Continue a session
kilo run -m kilo/minimax/minimax-m2.5:free "next task" --session ses_abc123

# List available models
kilo models
```

### Free Models (Cost: $0)
- `kilo/qwen/qwen3.6-plus-preview:free` — Best overall (complex tasks)
- `kilo/minimax/minimax-m2.5:free` — Fast (simple changes)
- `kilo/xiaomi/mimo-v2-pro:free` — Code generation
- `kilo/nvidia/nemotron-3-super-120b-a12b:free` — Large context
- `kilo/x-ai/grok-code-fast-1:optimized:free` — Speed

## ACP Integration
OpenClaw can spawn KiloCode via `sessions_spawn` with `runtime="acp"`.

## acpx CLI
Bridge between OpenClaw and ACP agents:
```bash
acpx kilocode "create a React component for..."
```

## Dev Team Pipeline
```
Main (GLM-5) → CTO (GLM-5 plans) → Coding Agents (KiloCode executes) → QA (KiloCode tests) → Deployer
```
