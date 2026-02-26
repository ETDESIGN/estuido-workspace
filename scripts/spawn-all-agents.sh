#!/bin/bash
# spawn-all-agents.sh - Spawn all agents with KiloCode CLI
# Run this to activate all design/dev/tech agents

echo "🚀 Spawning NB Studio Agent Fleet..."
echo ""

# Check KiloCode CLI availability
if ! command -v kilo &> /dev/null; then
    echo "Installing KiloCode CLI..."
    npm install -g kilocode
fi

# Spawn CTO (Lead Dev) - Already configured
echo "1. Spawning CTO (Lead Developer)..."
kilo --task "Read agents/CTO.md and await tasks. Use GLM-5:free for all coding." \
     --agent cto \
     --model GLM-5:free &

# Spawn Design Agent (Gary)
echo "2. Spawning Design Agent (Gary)..."
kilo --task "Read agents/DESIGN-GARY.md. Use KiloCode for UI/UX tasks. Browser testing enabled." \
     --agent design \
     --model GLM-5:free &

# Spawn Tech/DevOps
echo "3. Spawning Tech/DevOps..."
kilo --task "Read agents/TECH-OPS.md. Monitor backend, deployments, infrastructure." \
     --agent tech \
     --model GLM-5:free &

# Spawn QA (when needed, token-efficient)
echo "4. Spawning QA (read-only)..."
kilo --task "Read agents/QA.md. Standby for code reviews. Use browser for testing." \
     --agent qa \
     --model MiniMax:free &

echo ""
echo "✅ All agents spawned with KiloCode CLI (free models)"
echo "📊 Monitor with: ps aux | grep kilo"
echo "💰 Cost: $0 (free tier only)"
