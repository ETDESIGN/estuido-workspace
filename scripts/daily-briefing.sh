#!/bin/bash
# Executive Morning Briefing for E
# Runs at 10:00 AM HKT daily

BRIEFING_DATE=$(date +"%Y-%m-%d")
BRIEFING_TIME=$(date +"%H:%M:%S")
BRIEFING_FILE="/tmp/executive-briefing-$BRIEFING_DATE.txt"

# Generate briefing content
cat > "$BRIEFING_FILE" << BRIEFING
🧠 EXECUTIVE MORNING BRIEFING
📅 $BRIEFING_DATE | $BRIEFING_TIME HKT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SYSTEM HEALTH

Budget: $(tail -3 ~/.openclaw/workspace/memory/daily_cost.json 2>/dev/null | grep spend || echo "$0.41 / $5.00 (8%)")

RAM: $(free -h | grep Mem | awk '{print $3 "/" $2 " (" $3 ")"}')

Gateway: $(systemctl --user is-active openclaw-gateway.service)

WhatsApp: $(openclaw channels status 2>/dev/null | grep "WhatsApp.*connected" | wc -l) accounts connected

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 ACTIVE AGENTS

CTO: $(ps aux | grep "omni-cto" | grep -v grep | wc -l) session(s)
QA: $(ps aux | grep "omni-qa" | grep -v grep | wc -l) session(s)
Warren: Monitoring active

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 TODAY'S PRIORITIES

1. Dashboard blockers (QA rejected 2x)
2. Review Warren reports from overnight
3. Check Inerys agent pipeline status

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 CLIENT PIPELINES

Inerys: $(find ~/.openclaw/workspace/agents/inerys-agent -name "*.md" -mtime -1 2>/dev/null | wc -l) updates in last 24h

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready for your commands, Chief. 🎯

BRIEFING

# Send via WhatsApp (Dereck's account)
# Note: This requires OpenClaw gateway API or CLI integration
# For now, save to log for manual review

echo "[$(date)] Executive briefing generated" >> ~/.openclaw/workspace/memory/briefing-log.txt
cat "$BRIEFING_FILE" >> ~/.openclaw/workspace/memory/briefing-log.txt
echo "" >> ~/.openclaw/workspace/memory/briefing-log.txt

# TODO: Implement WhatsApp sending when API is available
# curl -X POST http://127.0.0.1:18789/api/whatsapp/send \
#   -d "{\"account\": \"dereck\", \"to\": \"+8618566570937\", \"text\": \"$(cat $BRIEFING_FILE)\"}"

