# Credit Tracking System - Image Processing Protocol

## Purpose
Extract credit/usage data from Kimi and OpenRouter dashboard screenshots to:
- Verify our own cost calculations
- Track actual vs estimated spending
- Detect discrepancies early
- Build historical spending data

---

## How It Works

### 1. Image Submission
User sends screenshots of:
- **Kimi Dashboard** (platform.moonshot.ai)
- **OpenRouter Dashboard** (openrouter.ai)
- **Groq Dashboard** (console.groq.com) - optional
- **Other providers** as needed

### 2. Data Extraction
I will extract:
```json
{
  "provider": "kimi|openrouter|groq",
  "timestamp": "ISO-8601",
  "credits": {
    "balance": "number",
    "currency": "CNY|USD",
    "total_used": "number",
    "total_granted": "number"
  },
  "usage": {
    "current_period": {
      "tokens_input": "number",
      "tokens_output": "number",
      "cost": "number"
    }
  },
  "rate_limits": {
    "requests_per_minute": "number",
    "tokens_per_minute": "number"
  }
}
```

### 3. Storage Location
```
~/.openclaw/workspace/data/
├── credit-snapshots/
│   ├── kimi/
│   │   ├── 2026-02-16_081500.json
│   │   └── 2026-02-17_093000.json
│   ├── openrouter/
│   │   ├── 2026-02-16_081500.json
│   │   └── ...
│   └── consolidated/
│       └── credit-history.jsonl
```

### 4. Verification & Alerts
Compare extracted data with:
- Our dashboard calculations
- Expected spend based on token logs
- Budget thresholds

Flag discrepancies >10% for review.

---

## Submission Format

Simply send an image with text like:
- "Kimi credit check"
- "OpenRouter balance"
- "Check my credits"

I will:
1. Extract all visible data
2. Timestamp it
3. Save to JSON
4. Compare with our internal tracking
5. Report any discrepancies

---

## Output Format

When you submit an image, I'll reply with:

```
📊 Credit Snapshot - Kimi (2026-02-16 08:15:00)

Extracted Data:
├─ Balance: ¥245.50 CNY
├─ Used Today: ¥12.30
├─ Tokens Today: 15,432 in / 45,891 out
└─ Rate Limit: 500 RPM

Comparison:
├─ Our Estimate: ¥11.80
├─ Actual: ¥12.30
└─ Diff: +4.2% ✅ Within tolerance

Status: 🟢 On track
Next check: Tomorrow or at ¥200 balance
```

---

## Historical Tracking

All snapshots are appended to:
`data/credit-snapshots/consolidated/credit-history.jsonl`

For analysis:
```bash
# View spending trend
cat credit-history.jsonl | jq -s '.[] | select(.provider=="kimi") | {date: .timestamp, balance: .credits.balance}'

# Compare estimated vs actual
node scripts/verify-costs.js
```

---

## Automation Ideas (Future)

- [ ] Scheduled screenshots via browser automation
- [ ] Alert when balance < ¥50
- [ ] Weekly spending report
- [ ] Predictive "days remaining" calculation
- [ ] Cost anomaly detection

---

Ready to accept images. Just send screenshots when you have them!
