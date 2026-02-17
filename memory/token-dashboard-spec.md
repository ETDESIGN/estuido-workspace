# Token Tracking Dashboard — Brainstorm

## Goal
Track token consumption across models, identify cost drivers, alert on limits.

## Core Metrics to Track

### Per Session
- Input tokens (user + system)
- Output tokens (model response)
- Cost per session
- Model used
- Duration

### Per Model (Aggregated)
- Total tokens consumed
- Cost per model
- Efficiency ratio (input vs output)
- Success/failure rate

### Per Day/Week/Month
- Daily spend
- Model distribution (% Kimi, % Qwen, % GLM)
- Peak usage times
- Trend analysis

## Alert System

### Thresholds
- **80%** — Yellow alert (monitor)
- **90%** — Orange alert (reduce usage)
- **100%** — Red alert (switch to free tier only)

### Notification Channels
- WhatsApp DM
- Discord
- Daily summary report

## Implementation Approach

### Phase 1 — Basic Tracking
- Parse session logs for token usage
- Store in JSON/CSV
- Simple daily summary

### Phase 2 — Dashboard
- Web dashboard (local or cloud)
- Real-time updates
- Charts/graphs

### Phase 3 — Smart Alerts
- Predictive alerts ("At current rate, limit reached in 3 days")
- Auto-model switching when limits near
- Cost optimization suggestions

## Data Storage

```json
{
  "date": "2026-02-15",
  "sessions": [
    {
      "sessionId": "...",
      "model": "moonshot/kimi-k2.5",
      "inputTokens": 15000,
      "outputTokens": 2500,
      "cost": 0.045,
      "duration": 120
    }
  ],
  "dailyTotals": {
    "inputTokens": 45000,
    "outputTokens": 8000,
    "cost": 0.135
  }
}
```

## Next Steps
1. Create token logger script
2. Set up storage (JSON file or SQLite)
3. Build simple CLI report
4. Expand to dashboard

---
