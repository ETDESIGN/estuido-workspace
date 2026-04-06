# 🚀 Quick Start Guide
## Sourcing Agent - Get Started in 5 Minutes

---

## 📋 Prerequisites

**Required:**
- ✅ Python 3.10+
- ✅ OpenClaw installed
- ✅ GLM-5 Turbo configured
- ✅ Internet connection

**Optional:**
- Streamlit (for dashboard)
- NotebookLM (for research)

---

## ⚡ Quick Start (3 Steps)

### Step 1: Access Dashboard

```bash
# Navigate to project
cd ~/.openclaw/workspace/sourcing-agent

# Start dashboard
streamlit run dashboard/dashboard.py
```

**Open browser:** http://localhost:8501

### Step 2: Submit Request

1. Click **"New Request"** in sidebar
2. Fill in project details
3. Upload drawing (PDF/Image)
4. Click **"🚀 Submit Request"**

### Step 3: Monitor Progress

1. Click **"Requests"** in sidebar
2. Find your job
3. Click **"View Details"**
4. Watch status update

---

## 🎯 Common Tasks

### Submit New Sourcing Request

**Via Dashboard:**
1. New Request → Fill form → Upload drawing → Submit

**Via Agent:**
```bash
openclaw chat --agent sourcing-agent
"I need to source CNC aluminum brackets, 100 units, ±0.05mm tolerance"
```

### View Suppliers

**Via Dashboard:**
1. Suppliers page → Browse database

**Via Files:**
```bash
ls ~/.openclaw/workspace/sourcing-agent/suppliers/
cat ~/.openclaw/workspace/sourcing-agent/suppliers/supplier_001.json
```

### Check Job Status

**Via Dashboard:**
1. Requests page → Find job → View details

**Via Files:**
```bash
ls ~/.openclaw/workspace/sourcing-agent/customers/
cat ~/.openclaw/workspace/sourcing-agent/customers/job_001.md
```

### Run Agent Manually

```bash
# Via OpenClaw
openclaw chat --agent sourcing-agent

# Via sub-agent spawn
sessions_spawn -t "Analyze this drawing and find suppliers" -m sourcing-agent
```

---

## 🔧 Troubleshooting

### Dashboard Won't Start

**Problem:** Port 8501 already in use  
**Solution:**
```bash
# Find process
lsof -i :8501

# Kill it
kill -9 <PID>

# Restart
streamlit run dashboard/dashboard.py
```

### Agent Not Responding

**Problem:** OpenClaw gateway not running  
**Solution:**
```bash
# Check status
openclaw status

# Restart gateway
openclaw restart

# Try again
openclaw chat --agent sourcing-agent
```

### File Not Found

**Problem:** Directory structure missing  
**Solution:**
```bash
# Create structure
mkdir -p ~/.openclaw/workspace/sourcing-agent/{suppliers,customers,drafts,knowledge,tools,tests}

# Copy templates
cp ~/.openclaw/workspace/sourcing-agent/customers/job_template.md \
   ~/.openclaw/workspace/sourcing-agent/customers/job_001.md
```

### Translation Errors

**Problem:** Wrong technical terms  
**Solution:**
```bash
# Check terminology
cat ~/.openclaw/workspace/sourcing-agent/knowledge/cnc_terminology.md

# Query NotebookLM
~/.local/bin/notebooklm ask "Translate 'anodized Type II' to Chinese manufacturing terms"
```

---

## 📊 What to Expect

### Timeline

**Immediate (0-5 min):**
- Dashboard loads
- Submit request
- Job file created

**Short-term (5-30 min):**
- Agent analyzes drawing
- Extracts specifications
- Identifies missing info
- Asks clarifying questions

**Medium-term (30 min - 2 hours):**
- Agent searches suppliers
- Verifies factories
- Creates dossiers
- Generates RFQ

**Long-term (2-48 hours):**
- Sends RFQ to suppliers
- Waits for responses
- Collects quotes
- Compares options
- Recommends winner

### Output

**You Get:**
1. Job file with all specs
2. 3-5 verified suppliers
3. Supplier dossiers (JSON)
4. Chinese RFQ draft
5. Quote comparison matrix
6. Recommendation

---

## 🎓 Next Steps

### Learn More

**Documentation:**
- `README.md` - Full project documentation
- `SOURCING_AGENT_IMPLEMENTATION_PLAN.md` - 8-week roadmap
- `dashboard/DASHBOARD_SPEC.md` - Dashboard technical spec

**Knowledge Base:**
- `knowledge/cnc_terminology.md` - CNC terms
- `knowledge/plastic_terms.md` - Plastic terms
- `knowledge/pcb_terms.md` - PCB terms

### Customize

**Add New Terminology:**
```bash
# Edit knowledge base
nano ~/.openclaw/workspace/sourcing-agent/knowledge/cnc_terminology.md

# Upload to NotebookLM
~/.local/bin/notebooklm source add knowledge/cnc_terminology.md
```

**Add Supplier:**
```bash
# Copy template
cp ~/.openclaw/workspace/sourcing-agent/suppliers/supplier_template.json \
   ~/.openclaw/workspace/sourcing-agent/suppliers/supplier_XXX.json

# Edit details
nano suppliers/supplier_XXX.json
```

**Create Custom Tool:**
```bash
# Create tool script
nano ~/.openclaw/workspace/sourcing-agent/tools/my_tool.py

# Make executable
chmod +x tools/my_tool.py

# Test
python tools/my_tool.py
```

---

## 💡 Tips

### Best Practices

1. **Always Upload Drawings** - Vision tool extracts accurate specs
2. **Be Specific** - "Aluminum 6061" not just "Aluminum"
3. **Check Tolerances** - ±0.05mm vs ±0.5mm = 10x price difference
4. **Review RFQ** - HITL approval before sending
5. **Verify Suppliers** - Check dossiers before selecting

### Common Mistakes

❌ **Don't:** "I need a metal part"  
✅ **Do:** "CNC machined aluminum 6061 bracket, ±0.05mm, 100 units"

❌ **Don't:** "Cheapest price"  
✅ **Do:** "Balance price, quality, and lead time"

❌ **Don't:** Skip verification  
✅ **Do:** Always verify factory status

---

## 🆘 Need Help?

### Check Status

```bash
# System health
openclaw status

# Dashboard running?
ps aux | grep streamlit

# Agent accessible?
openclaw chat --agent sourcing-agent "test"
```

### View Logs

```bash
# Agent logs
openclaw logs sourcing-agent

# Dashboard logs
# (In terminal where streamlit is running)

# System logs
tail -f ~/.openclaw/workspace/logs/*.log
```

### Reset Everything

```bash
# Stop dashboard
# Ctrl+C in dashboard terminal

# Restart OpenClaw
openclaw restart

# Clear cache
rm -rf ~/.openclaw/workspace/sourcing-agent/__pycache__

# Start fresh
streamlit run dashboard/dashboard.py
```

---

## 📞 Support

**Documentation:** See `README.md` for full details  
**Issues:** Check troubleshooting section  
**Questions:** Consult knowledge base

---

**Happy Sourcing!** 🚀

*Last Updated: 2026-03-27*
