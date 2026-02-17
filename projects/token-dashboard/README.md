# 🎛️ Token Tracking Dashboard

**ESTUDIO Phase 1 — Basic Token Tracking System**

A CLI-based dashboard for tracking OpenClaw API token usage and costs across multiple LLM providers.

## Features

- ✅ **Session Logging**: Manual entry or import from log files
- ✅ **Cost Calculation**: Automatic cost computation based on model pricing
- ✅ **SQLite Storage**: Persistent local database
- ✅ **Daily/Weekly Reports**: Text, JSON, and CSV output formats
- ✅ **Alert System**: Threshold-based alerts for spending limits
- ✅ **Model Breakdown**: Per-model cost analysis

## Supported Models

| Model | Input (per 1M) | Output (per 1M) |
|-------|---------------|-----------------|
| moonshot/kimi-k2.5 | $0.50 | $2.00 |
| moonshot/kimi-k2-0905-preview | $1.00 | $4.00 |
| gemini/gemini-2.0-flash | $0.10 | $0.40 |
| qwen-portal/* | FREE | FREE |

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Initialize database
npm run track -- init

# Log a session manually
npm run track -- track -m moonshot/kimi-k2.5 -i 1000 -o 500

# View today's status
npm run track -- status

# Generate daily report
npm run track -- report

# Generate weekly report
npm run track -- report --week

# Check alerts
npm run track -- alerts --check
```

## CLI Commands

### `init`
Initialize the SQLite database.

### `track`
Manually log a token session.

```bash
token-dashboard track -m <model> -i <input_tokens> -o <output_tokens> [options]

Options:
  -m, --model <model>      Model name (required)
  -i, --input <tokens>     Input tokens (required)
  -o, --output <tokens>    Output tokens (required)
  -c, --cache-read <n>     Cache read tokens (default: 0)
  -w, --cache-write <n>    Cache write tokens (default: 0)
  -d, --duration <sec>     Session duration
  --cost <amount>          Override calculated cost
```

### `import`
Import sessions from a log file (JSON lines or CSV).

```bash
token-dashboard import <file_path>
```

### `report`
Generate daily or weekly reports.

```bash
token-dashboard report [options]

Options:
  -d, --date <date>     Date (YYYY-MM-DD), default: today
  -w, --week            Show weekly report
  -f, --format <fmt>    Output: text, json, csv (default: text)
```

### `status`
Quick overview of current spending and pending alerts.

### `alerts`
Check and manage spending alerts.

```bash
token-dashboard alerts [options]

Options:
  -c, --check           Check for new alerts
  -l, --list            List all pending alerts
  -a, --acknowledge <id> Acknowledge alert by ID
```

### `pricing`
Display the model pricing table.

### `parse`
Test parsing a log line (debugging).

```bash
token-dashboard parse '<json_or_csv_line>'
```

## Data Storage

All data is stored locally in SQLite:
- **Database**: `data/tokens.db`
- **Format**: WAL mode for better concurrency

## Alert Thresholds

| Level | Daily Limit | Monthly Limit | Action |
|-------|-------------|---------------|--------|
| 🟡 Yellow | 80% ($8) | 80% ($200) | Monitor |
| 🟠 Orange | 90% ($9) | 90% ($225) | Reduce usage |
| 🔴 Red | 100% ($10) | 100% ($250) | Switch to free tier |

## Project Structure

```
token-dashboard/
├── src/
│   ├── index.ts          # CLI entry point
│   ├── types.ts          # TypeScript definitions
│   ├── db/
│   │   └── index.ts      # SQLite operations
│   ├── parser/
│   │   ├── index.ts      # Session parser
│   │   └── cost.ts       # Cost calculator
│   ├── reports/
│   │   └── index.ts      # Report generator
│   └── alerts/
│       └── index.ts      # Alert system
├── data/                 # SQLite database
├── package.json
└── tsconfig.json
```

## Roadmap

### Phase 1 ✅ (Current)
- [x] Basic CLI interface
- [x] SQLite storage
- [x] Cost calculation
- [x] Daily/weekly reports
- [x] Alert system

### Phase 2 (Upcoming)
- [ ] Web dashboard (React)
- [ ] Real-time log tailing
- [ ] Interactive charts
- [ ] Export to cloud storage

### Phase 3 (Future)
- [ ] Predictive spending alerts
- [ ] Auto-model switching
- [ ] Cost optimization suggestions
- [ ] Multi-project support

## License

MIT — ESTUDIO Internal Tool
