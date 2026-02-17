# Token Dashboard - Project Plan

**ESTUDIO Lead Developer Phase 1 Implementation**

## ✅ Completed (Phase 1)

### Core Features
- [x] TypeScript project setup with proper module structure
- [x] SQLite database with WAL mode for concurrent access
- [x] Cost calculation engine with configurable pricing
- [x] Session parser supporting JSON and CSV formats
- [x] CLI interface using Commander.js

### Database Schema
- [x] `sessions` - Individual API call records
- [x] `daily_stats` - Aggregated daily statistics
- [x] `alerts` - Spending threshold alerts
- [x] `config` - Settings and configuration

### CLI Commands
- [x] `init` - Database initialization
- [x] `track` - Manual session logging
- [x] `import` - Bulk import from log files
- [x] `report` - Daily/weekly reports (text, JSON, CSV)
- [x] `status` - Quick dashboard overview
- [x] `alerts` - Alert management system
- [x] `pricing` - Model pricing table
- [x] `parse` - Debug log line parsing

### Supported Models
| Model | Provider | Input/1M | Output/1M |
|-------|----------|----------|-----------|
| kimi-k2.5 | Moonshot | $0.50 | $2.00 |
| kimi-k2-0905-preview | Moonshot | $1.00 | $4.00 |
| coder-model | Qwen | FREE | FREE |
| vision-model | Qwen | FREE | FREE |
| gemini-2.0-flash | Google | $0.10 | $0.40 |

### Alert System
- 🟡 Yellow: 80% of daily ($8) or monthly ($200) limit
- 🟠 Orange: 90% of daily ($9) or monthly ($225) limit
- 🔴 Red: 100% of daily ($10) or monthly ($250) limit

## 📁 Project Structure

```
token-dashboard/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── types.ts              # TypeScript definitions
│   ├── db/
│   │   └── index.ts          # SQLite operations
│   ├── parser/
│   │   ├── index.ts          # Session parser
│   │   └── cost.ts           # Cost calculator
│   ├── reports/
│   │   └── index.ts          # Report generator
│   └── alerts/
│       └── index.ts          # Alert system
├── data/
│   └── tokens.db             # SQLite database (created on init)
├── test-log.jsonl            # Sample import file
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

```bash
# Build
cd /home/e/.openclaw/workspace/projects/token-dashboard
npm install
npx tsc

# Initialize
node dist/index.js init

# Track a session
node dist/index.js track -m moonshot/kimi-k2.5 -i 10000 -o 2000

# View status
node dist/index.js status

# Generate report
node dist/index.js report
node dist/index.js report --format json

# Import from log file
node dist/index.js import test-log.jsonl
```

## 📋 Next Phase (Phase 2) Roadmap

### Web Dashboard
- [ ] React + Vite frontend
- [ ] Real-time updates via WebSocket
- [ ] Interactive charts (Recharts or Chart.js)
- [ ] Date range picker
- [ ] Model filter controls

### Enhanced Features
- [ ] Log file tailing (real-time import)
- [ ] Cost predictions based on usage trends
- [ ] Export to Google Sheets / cloud
- [ ] Slack/Discord webhook notifications

### Infrastructure
- [ ] Docker containerization
- [ ] Environment-based configuration
- [ ] Automated backups
- [ ] Multi-project/workspace support

## 🐛 Known Issues / Limitations

1. **No real-time log tailing** - Currently requires manual import or API calls
2. **Local storage only** - SQLite database is local to the machine
3. **Pricing hardcoded** - Model pricing in `types.ts`, update needed for changes
4. **No authentication** - Single-user system

## 📝 Notes for Dereck

The Phase 1 implementation is complete and functional. The system can:
- Track token usage manually or via import
- Calculate costs accurately based on model pricing
- Generate reports in multiple formats
- Alert when approaching spending limits
- Store data persistently in SQLite

For the next phase (web dashboard), we'll need to decide:
1. Local-only dashboard or cloud-deployable?
2. Authentication requirements?
3. Integration with existing OpenClaw session logs (if available)?

The codebase is structured to easily extend - adding new models, report formats, or alert channels is straightforward.
