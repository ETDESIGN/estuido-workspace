# Sourcing Agent — Mission Control Dashboard

A Streamlit dashboard for managing manufacturing sourcing requests in Dongguan.

## Quick Start

```bash
cd ~/.openclaw/workspace/sourcing-agent
streamlit run dashboard/dashboard.py --server.port 8501
```

Then open **http://localhost:8501** in your browser.

## Pages

| Page | Description |
|------|-------------|
| 📝 New Request | Submit a new sourcing request with specs & drawing upload |
| 📋 Requests | View, search, filter, approve/reject all requests |
| 🏭 Suppliers | Browse supplier database, filter by capability & rating |
| 📊 Analytics | KPI cards, status distribution, capability heatmap |

## Data Locations

- **Jobs:** `customers/job_XXX.json` and `customers/job_XXX.md`
- **Suppliers:** `suppliers/supplier_XXX.json`
- **Uploads:** `dashboard/uploads/`

## Dependencies

```bash
pip install -r dashboard/requirements.txt
```
