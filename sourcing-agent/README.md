# 🔍 Sourcing Agent Project
## AI-Powered China Manufacturing Sourcing

**Project Start:** 2026-03-27  
**Status:** In Development  
**Owner:** Etia (ESTUDIO)  
**Location:** Dongguan, China  
**Architecture:** Monolithic GLM-5 Turbo + Tool Router

---

## 📋 PROJECT OVERVIEW

### Mission
Build an AI-powered sourcing agent that helps EU/abroad customers find, verify, and communicate with Chinese factories in Dongguan manufacturing hub.

### Vision
Democratize access to Chinese manufacturing by automating the complex, time-consuming process of supplier discovery, verification, and negotiation.

### Target Users
- EU/abroad businesses needing Chinese manufacturing
- Product designers requiring rapid prototyping
- Companies scaling from prototype to mass production
- Technical buyers sourcing complex components (CNC, plastic, PCB)

---

## 🎯 BUSINESS PROBLEM

### Current Pain Points
1. **Language Barrier** - Chinese suppliers, limited English
2. **Verification Complexity** - Trading companies pose as factories
3. **Technical Gaps** - Miscommunication on specs, tolerances, materials
4. **Time Consuming** - Manual sourcing takes 3+ weeks
5. **Quality Risk** - Unknown supplier reliability
6. **Cultural Differences** - Guanxi (relationships) crucial in China

### Our Solution
AI agent that:
- ✅ Searches domestic Chinese platforms (1688, Baidu)
- ✅ Verifies factory legitimacy
- ✅ Translates technical specs (bilingual GLM-5)
- ✅ Generates RFQs in culturally appropriate Chinese
- ✅ Compares quotes side-by-side
- ✅ Manages supplier relationships
- ✅ Provides expert guidance (CNC, plastic, PCB)

### Value Proposition
- **80% Faster** - 2 days vs 3 weeks manual sourcing
- **50% Better Quality** - Verified factories, not trading companies
- **30% Cost Savings** - Direct factory pricing
- **24/7 Availability** - Always-on AI agent

---

## 🏗️ ARCHITECTURE

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mission Control Dashboard                  │
│                    (Streamlit on localhost:8501)              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  GLM-5 Turbo (Main Agent)                   │
│                  Orchestration & Tool Routing                │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼────┐     ┌─────▼────┐     ┌─────▼────┐
    │ Vision  │     │  Search  │     │Translate │
    │  Tool   │     │  Tool    │     │  Tool    │
    └─────────┘     └──────────┘     └──────────┘
         │                 │                 │
    ┌────▼────┐     ┌─────▼────┐     ┌─────▼────┐
    │Drawing  │     │ 1688/    │     │  EN ↔   │
    │Analysis │     │ Baidu    │     │   CN     │
    └─────────┘     └──────────┘     └──────────┘
```

### Tech Stack

**Core:**
- **LLM:** GLM-5 Turbo (bilingual, Chinese-optimized)
- **Framework:** OpenClaw (multi-agent orchestration)
- **Language:** Python 3.10+

**Research APIs:**
- **Kimi AI:** Chinese web search ($0.15/1M tokens)
- **Baidu Search:** SerpApi/SearchAPI
- **1688.com:** Web scraping (custom tool)

**Knowledge Base:**
- **NotebookLM:** Source-grounded insights
- **Markdown Files:** Customer requests, terminology
- **JSON Files:** Supplier dossiers

**Communication:**
- **Manual:** WeChat, Email (HITL)
- **Future:** WeChat Work API

**Dashboard:**
- **Framework:** Streamlit
- **Charts:** Plotly/Matplotlib
- **Deploy:** Localhost:8501

---

## 📁 PROJECT STRUCTURE

```
~/.openclaw/
├── agents/
│   └── sourcing-agent/           # MAIN AGENT
│       ├── agent/
│       │   ├── config.json       # Agent configuration
│       │   ├── SOUL.md           # Personality prompt
│       │   ├── IDENTITY.md       # Agent metadata
│       │   └── TOOLS.md          # Available tools
│       ├── sessions/             # Agent session history
│       └── memory/               # Agent learnings
│
├── workspace/
│   └── sourcing-agent/           # PROJECT WORKSPACE
│       ├── dashboard/            # STREAMLIT DASHBOARD
│       │   ├── dashboard.py      # Main app
│       │   ├── requirements.txt  # Dependencies
│       │   ├── DASHBOARD_SPEC.md # Tech spec
│       │   └── README.md         # Setup guide
│       │
│       ├── suppliers/            # SUPPLIER DATABASE
│       │   ├── supplier_template.json
│       │   └── supplier_XXX.json
│       │
│       ├── customers/            # CUSTOMER REQUESTS
│       │   ├── job_template.md
│       │   └── job_XXX.md
│       │
│       ├── drafts/               # RFQ DRAFTS
│       │   └── rfq_XXX.md
│       │
│       ├── knowledge/            # KNOWLEDGE BASE
│       │   ├── cnc_terminology.md
│       │   ├── plastic_terms.md
│       │   └── pcb_terms.md
│       │
│       ├── tools/                # CUSTOM TOOLS
│       │   ├── search_1688.py
│       │   ├── verify_supplier.py
│       │   └── generate_rfq.py
│       │
│       └── tests/                # TEST CASES
│           ├── test_vision.py
│           ├── test_translation.py
│           └── test_integration.py
│
└── notebooklm/
    └── sourcing-research/        # NOTEBOOKLM NOTEBOOK
        └── (3 research sources uploaded)
```

---

## 🔄 WORKFLOW

### End-to-End Process

```
1. CUSTOMER SUBMITS REQUEST
   └─→ Dashboard: New Request form
   └─→ Upload drawing (PDF/Image)
   └─→ Specify requirements

2. AGENT ANALYZES
   ├─→ Vision tool extracts specs
   ├─→ Translate to Chinese
   ├─→ Identify missing info
   └─→ Ask clarifying questions

3. SUPPLIER SEARCH
   ├─→ Search 1688.com
   ├─→ Search Baidu
   ├─→ Rank by score
   └─→ Return top 5

4. VERIFICATION
   ├─→ Check business license
   ├─→ Verify factory status
   ├─→ Check certifications
   └─→ Create dossier

5. RFQ GENERATION
   ├─→ Draft Chinese RFQ
   ├─→ Culturally appropriate
   ├─→ HITL approval
   └─→ Send to suppliers

6. QUOTE COLLECTION
   ├─→ Monitor responses
   ├─→ Parse quotes
   ├─→ Extract key terms
   └─→ Translate to English

7. COMPARISON
   ├─→ Side-by-side matrix
   ├─→ Rank by value
   ├─→ Highlight best options
   └─→ Recommend winner

8. SELECTION
   ├─→ HITL final approval
   ├─→ Place order
   └─→ Track delivery
```

---

## 📊 IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2) ✅ PLANNED
- [x] Create agent structure
- [ ] Implement tool router
- [ ] Connect vision tool
- [ ] Build knowledge base
- [ ] **Dashboard: MVP** ← **NOW**

### Phase 2: Discovery (Week 3-4)
- [ ] 1688.com search tool
- [ ] Baidu search integration
- [ ] Supplier ranking
- [ ] Basic verification
- [ ] Supplier dossiers

### Phase 3: Core Features (Week 5-6)
- [ ] WeChat voice transcription
- [ ] Quote parser
- [ ] Comparison matrix
- [ ] Pre-RFQ validator

### Phase 4: Testing (Week 7-8)
- [ ] End-to-end testing
- [ ] Shadow run (historical data)
- [ ] User acceptance testing
- [ ] Documentation
- [ ] Launch

---

## 🎛️ DASHBOARD

### Access
**URL:** http://localhost:8501  
**Start:** `streamlit run dashboard/dashboard.py`

### Pages

**1. New Request**
Submit sourcing requests with file upload

**2. Requests**
View all jobs, approve RFQs, track status

**3. Suppliers**
Browse database, search, filter, view dossiers

**4. Analytics**
Metrics, charts, statistics

---

## 🔧 TOOLS & CAPABILITIES

### Vision Tool
- **Input:** PDF, Image (PNG, JPG)
- **Output:** Extracted specs (material, dimensions, tolerances)
- **Model:** Multimodal LLM (GLM-5 Vision or Claude 3.5)

### Translation Tool
- **Input:** English technical specs
- **Output:** Chinese manufacturing terminology
- **Model:** GLM-5 Turbo (bilingual)

### Search Tool
- **Platforms:** 1688.com, Baidu
- **Output:** Supplier list with rankings
- **Method:** Web scraping + API

### Verification Tool
- **Input:** Supplier name, license
- **Output:** Verification report
- **Data:** SAMR database, Maps

### RFQ Generator
- **Input:** Specs + supplier list
- **Output:** Chinese RFQ email/WeChat text
- **Features:** Cultural appropriateness, completeness

---

## 📚 KNOWLEDGE BASE

### Terminology Dictionaries

**CNC Machining** (`knowledge/cnc_terminology.md`)
- Materials (Aluminum 6061, 7075, Stainless Steel)
- Processes (Milling, Turning, EDM)
- Tolerances (Standard, Precision, High Precision)
- Surface Finishes (Anodizing, Plating, Polishing)
- Quality Terms (CMM, FAI, GD&T)

**Plastic Molding** (`knowledge/plastic_terms.md`)
- Materials (ABS, Polycarbonate, PP, POM)
- Processes (Injection, Blow, Compression)
- Mold specs (Cavities, Hot runner, Cold runner)
- Defects (Flash, Sink marks, Warpage)

**PCB** (`knowledge/pcb_terms.md`)
- Stack-up (Layers, Material, Thickness)
- Surface finish (HASL, ENIG, OSP)
- Design rules (Trace width, Via size)
- Testing (Flying probe, Bed of nails)

### Supplier Dossiers

**Format:** JSON
```json
{
  "id": "supplier_001",
  "name": "Factory Name",
  "location": "Dongguan",
  "specialties": ["CNC", "Aluminum"],
  "certifications": ["ISO 9001"],
  "rating": 4.5,
  "contact": {...},
  "performance": {...}
}
```

---

## 🚀 GETTING STARTED

### For Developers

**Setup:**
```bash
# Clone/create project structure
cd ~/.openclaw/workspace/sourcing-agent

# Install dependencies
pip install -r dashboard/requirements.txt

# Start dashboard
streamlit run dashboard/dashboard.py
```

**Run Agent:**
```bash
# Via OpenClaw
openclaw chat --agent sourcing-agent

# Or spawn sub-agent
sessions_spawn -t "Analyze this drawing" -m sourcing-agent
```

### For Users

**Access Dashboard:**
1. Open terminal
2. Run: `streamlit run ~/.openclaw/workspace/sourcing-agent/dashboard/dashboard.py`
3. Open browser: `http://localhost:8501`
4. Submit sourcing request

**View Progress:**
1. Navigate to "Requests" page
2. Click job ID
3. View status, suppliers, quotes

---

## 📈 SUCCESS METRICS

### Technical
- Drawing analysis accuracy: >90%
- Translation accuracy: >95%
- Supplier search success: >80%
- End-to-end time: <48 hours (vs 3 weeks manual)

### Business
- Cost savings: >20% vs manual sourcing
- Customer satisfaction: >4.5/5
- Suppliers found: 3-5 per request
- Quote comparison: Clear winner identified

### System
- Monthly cost: <$90
- Response time: <5 minutes
- Uptime: >95%

---

## ⚠️ RISKS & MITIGATION

### Risk 1: Translation Errors
**Impact:** Wrong parts manufactured  
**Mitigation:** Dual-language spec table, HITL approval

### Risk 2: Trading Company Detection
**Impact:** Higher prices, middlemen  
**Mitigation:** Cross-reference multiple sources, physical verification

### Risk 3: Cultural Miscommunication
**Impact:** Offended suppliers, lost opportunities  
**Mitigation:** GLM-5 cultural training, polite phrasing, Guanxi-building

### Risk 4: Supplier Fraud
**Impact:** Financial loss, delivery failure  
**Mitigation:** Verification checks, deposits only, LC for large orders

---

## 🔮 FUTURE ROADMAP

### Phase 2 (Post-MVP)
**When:** 10+ active customers, $200-500/month budget

**Features:**
- Vector DB (Pinecone) for semantic search
- Sub-agents (Spec Analyzer, Verification, Negotiation)
- WeChat Work API automation
- Trading Company Detector (Qichacha API)
- DFM Advisor (Claude 3.5)

### Phase 3 (Production Scale)
**When:** 50+ users, enterprise features

**Features:**
- Multi-user support
- Role-based access
- API for third-party integration
- Mobile apps (iOS/Android)
- Advanced analytics

---

## 📞 SUPPORT & CONTACT

### Project Team
- **Owner:** Etia (ESTUDIO)
- **GM:** Dereck (Orchestrator)
- **CTO:** Engineering lead
- **QA:** Quality assurance

### Troubleshooting

**Dashboard won't start:**
```bash
# Check port
lsof -i :8501

# Kill process
kill -9 <PID>

# Restart
streamlit run dashboard/dashboard.py
```

**Agent not responding:**
```bash
# Check OpenClaw status
openclaw status

# Restart gateway
openclaw restart
```

**File not found:**
```bash
# Verify structure
ls -la ~/.openclaw/workspace/sourcing-agent/

# Check permissions
chmod 644 suppliers/*.json
chmod 644 customers/*.md
```

---

## 📝 CHANGELOG

### 2026-03-27
- ✅ Project initiated
- ✅ Architecture decided (Monolithic GLM-5)
- ✅ Implementation plan created
- ✅ Templates created (supplier, customer)
- ✅ Knowledge base started (CNC terminology)
- ✅ Dashboard spec completed
- ✅ CTO spawned for dashboard build
- ✅ Documentation created

### Upcoming
- [ ] Dashboard MVP (Tonight)
- [ ] Agent implementation (Week 1-2)
- [ ] Supplier search (Week 3-4)
- [ ] Core features (Week 5-6)
- [ ] Testing & launch (Week 7-8)

---

## 📖 RELATED DOCUMENTS

### Planning
- `SOURCING_AGENT_IMPLEMENTATION_PLAN.md` - 8-week roadmap
- `SOURCING_AGENT_PLAN.md` - Original research (6-phase workflow)
- `SOURCING_AGENT_RESEARCH_ADDENDUM.md` - Expanded research (Kimi, Baidu, NotebookLM)

### Specifications
- `dashboard/DASHBOARD_SPEC.md` - Dashboard technical spec
- `customers/job_template.md` - Customer request format
- `suppliers/supplier_template.json` - Supplier dossier format

### Knowledge
- `knowledge/cnc_terminology.md` - CNC terms (EN ↔ CN)
- Notebooks in NotebookLM: "Sourcing Agent Research"

---

## 🎯 SUCCESS CRITERIA

### MVP (Week 8)
- [ ] Dashboard functional on localhost
- [ ] Can submit request via dashboard
- [ ] Agent analyzes drawing
- [ ] Agent finds 3-5 suppliers
- [ ] Agent generates RFQ
- [ ] Agent compares quotes
- [ ] End-to-end <48 hours
- [ ] Customer satisfaction >4.5/5

### Production (6 months)
- [ ] 50+ active users
- [ ] 500+ requests processed
- [ ] $100K+ in sourcing value
- [ ] 20%+ cost savings vs manual
- [ ] <5 minute response time
- [ ] 99% uptime

---

**Last Updated:** 2026-03-27 23:00 HKT  
**Document Version:** 1.0  
**Status:** Active Development  
**Next Review:** 2026-03-30

---

*This documentation will be updated as the project evolves. All changes are tracked in git.*
