# Dashboard Data Connection Guide

## Current Setup

The dashboard now shows **live-generated mock data** that:
- ✅ Updates on each API call (fresh data)
- ✅ Has realistic cost calculations
- ✅ Shows proper model/provider info
- ✅ Spreads sessions across 7 days

## For TRUE Live Data (OpenClaw Gateway)

To connect to your actual OpenClaw sessions:

### Step 1: Get Gateway Token
```bash
# From your OpenClaw config
cat ~/.openclaw/openclaw.json | grep token
```

### Step 2: Add to Vercel Environment
```bash
vercel env add GATEWAY_TOKEN production
# Paste your token

vercel env add GATEWAY_URL production
# Enter: http://your-gateway-ip:18789
```

### Step 3: Redeploy
```bash
vercel --prod
```

## Alternative: Static Data Export

Export your sessions and commit to repo:
```bash
# Copy latest sessions to dashboard
rsync ~/.openclaw/agents/main/sessions/*.jsonl \
  ~/workspace/dashboards/cost-analytics-v2/data/

# Commit and redeploy
git add data/
git commit -m "Update session data"
vercel --prod
```

## Current Data Quality

| Metric | Status |
|--------|--------|
| Sessions | 30 (live generated) |
| Models | 4 types |
| Cost Calculation | ✅ Accurate |
| Date Range | Last 7 days |
| Refresh | On page load |

## Next Improvements

1. **WebSocket** - Real-time updates from gateway
2. **Caching** - Redis for session history
3. **Filtering** - Date range queries

---

**Dashboard:** https://cost-analytics-v2.vercel.app
