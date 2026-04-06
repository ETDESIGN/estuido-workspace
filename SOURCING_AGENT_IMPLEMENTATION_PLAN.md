# Sourcing Agent Implementation Plan
# Monolithic GLM-5 + Tool Router (8-Week MVP)

**Architecture Decision:** Monolithic GLM-5 Turbo with Tool Router  
**Timeline:** 8 weeks (2026-03-28 to 2026-05-23)  
**Budget:** $35-90/month  
**Status:** Ready to implement

---

## 📋 PROJECT STRUCTURE

```
~/.openclaw/
├── agents/
│   └── sourcing-agent/          # NEW AGENT
│       ├── agent/
│       │   ├── config.json       # Agent configuration
│       │   ├── SOUL.md           # Personality/prompt
│       │   ├── IDENTITY.md       # Agent metadata
│       │   └── tools.json        # Available tools
│       ├── sessions/             # Agent sessions
│       └── memory/               # Agent memory
│
├── workspace/
│   ├── sourcing-agent/           # Project workspace
│   │   ├── suppliers/            # Supplier JSON dossiers
│   │   │   ├── supplier_001.json
│   │   │   └── supplier_template.json
│   │   ├── customers/            # Customer requests
│   │   │   ├── job_001_specs.md
│   │   │   └── job_template.md
│   │   ├── drafts/               # RFQ drafts
│   │   ├── knowledge/            # Knowledge base
│   │   │   ├── cnc_terminology.md
│   │   │   ├── plastic_terms.md
│   │   │   └── pcb_terms.md
│   │   ├── tools/                # Custom tools
│   │   │   ├── search_1688.py
│   │   │   ├── verify_supplier.py
│   │   │   └── generate_rfq.py
│   │   └── tests/                # Test cases
│   │
│   └── sourcing-agent-skill/     # OpenClaw skill
│       ├── SKILL.md
│       ├── package.json
│       └── index.js
│
└── notebooklm/
    └── sourcing-research/        # NotebookLM notebook
```

---

## 🎯 WEEK 1-2: FOUNDATION

### **Week 1: Agent Setup & Core Tools**

**Day 1-2: Create Sourcing Agent**
- [ ] Create agent directory structure
- [ ] Configure agent in OpenClaw config
- [ ] Write SOUL.md (bilingual sourcing personality)
- [ ] Write IDENTITY.md
- [ ] Test agent initialization

**Day 3-4: Tool Router Implementation**
- [ ] Create tool routing logic in agent prompt
- [ ] Implement vision tool integration (drawings)
- [ ] Implement translation tool (EN ↔ CN)
- [ ] Implement web search tool (1688/Baidu)
- [ ] Test tool switching

**Day 5-7: Knowledge Base Setup**
- [ ] Create supplier dossier template (JSON)
- [ ] Create customer request template (Markdown)
- [ ] Compile terminology dictionaries:
  - CNC machining terms (EN + CN)
  - Plastic molding terms (EN + CN)
  - PCB terms (EN + CN)
- [ ] Upload to NotebookLM for RAG

**Deliverable End of Week 1:**
- ✅ Sourcing agent exists and responds
- ✅ Can route between tools
- ✅ Has basic knowledge base

---

### **Week 2: Vision & Translation**

**Day 8-10: Drawing Analysis**
- [ ] Implement PDF/image parsing
- [ ] Extract: material, dimensions, tolerances, quantity
- [ ] Save to customer job file (Markdown)
- [ ] Test with real CNC/plastic drawings

**Day 11-12: Chinese Translation**
- [ ] Build technical term translator
- [ ] Test: "±0.05mm tolerance" → "±0.05mm公差"
- [ ] Test: "6061 aluminum" → "6061铝合金"
- [ ] Test: "injection molding" → "注塑"
- [ ] Validate with NotebookLM queries

**Day 13-14: RFQ Draft Generation**
- [ ] Create RFQ template (Chinese)
- [ ] Fill: specs, quantity, timeline, requirements
- [ ] Add culturally appropriate intro/outro
- [ ] Save to /workspace/drafts/
- [ ] HITL approval gate

**Deliverable End of Week 2:**
- ✅ Can analyze drawings
- ✅ Can translate specs to Chinese
- ✅ Can generate RFQ draft
- ✅ HITL gate works

---

## 🔍 WEEK 3-4: SUPPLIER DISCOVERY

### **Week 3: 1688.com Integration**

**Day 15-17: 1688 Search Tool**
- [ ] Research 1688.com search patterns
- [ ] Implement search_1688.py tool
- [ ] Parse results: supplier name, rating, MOQ
- [ ] Extract: 诚信通 status, worker count, years active
- [ ] Test searches: "CNC加工 东莞", "注塑 5G通信"

**Day 18-19: Baidu Search Integration**
- [ ] Implement Baidu search via SerpApi/SearchAPI
- [ ] Search: "东莞CNC工厂", "深圳注塑厂"
- [ ] Extract factory websites, contact info
- [ ] Cross-reference with 1688 results

**Day 20-21: Supplier Ranking**
- [ ] Implement scoring algorithm:
  - 诚信通 verified: +20 points
  - 3+ years active: +10 points
  - Response rate >95%: +15 points
  - Good ratings: +10 points
  - Factory (not trading): +20 points
- [ ] Rank suppliers by score
- [ ] Return top 5 for review

**Deliverable End of Week 3:**
- ✅ Can search 1688.com
- ✅ Can search Baidu
- ✅ Can rank suppliers

---

### **Week 4: Verification & Dossiers**

**Day 22-24: Basic Verification**
- [ ] Implement verify_supplier.py tool
- [ ] Check business license (SAMR lookup if possible)
- [ ] Verify address matches Google/Baidu Maps
- [ ] Check certifications (ISO 9001 mentioned?)
- [ ] Flag red flags (trading company patterns)

**Day 25-26: Supplier Dossiers**
- [ ] Create JSON dossier for each supplier:
  ```json
  {
    "id": "supplier_001",
    "name": "Factory Name",
    "location": "Dongguan",
    "specialties": ["CNC", "Aluminum"],
    "certifications": ["ISO 9001"],
    "rating": 4.5,
    "moq": 100,
    "contact": {
      "wechat": "...",
      "email": "...",
      "phone": "..."
    },
    "last_updated": "2026-03-27"
  }
  ```
- [ ] Save to /workspace/suppliers/
- [ ] Link to customer jobs

**Day 27-28: Pre-RFQ Validator**
- [ ] Implement spec completeness check:
  - Material specified? (6061 vs 7075)
  - Tolerance specified? (±0.05mm)
  - Surface finish? (Ra 1.6)
  - Quantity? (prototyping vs MP)
- [ ] Ask clarifying questions
- [ ] Wait for customer response
- [ ] Update job file

**Deliverable End of Week 4:**
- ✅ Can verify suppliers
- ✅ Creates supplier dossiers
- ✅ Validates specs before RFQ

---

## 🎨 WEEK 5-6: CORE FEATURES

### **Week 5: WeChat Voice Transcription**

**Day 29-31: Voice Ingestion**
- [ ] Integrate Groq Whisper API
- [ ] Accept audio from WhatsApp
- [ ] Transcribe to text
- [ ] Extract technical specs
- [ ] Translate to English
- [ ] Save to customer job

**Day 32-33: Message Parsing**
- [ ] Extract: material, price, lead time, MOQ
- [ ] Identify questions from supplier
- [ ] Flag urgent issues
- [ ] Format for customer review

**Day 34-35: Testing**
- [ ] Test with real WeChat voice notes
- [ ] Measure accuracy
- [ ] Refine extraction logic
- [ ] Document workflow

**Deliverable End of Week 5:**
- ✅ Can transcribe WeChat voice notes
- ✅ Extracts supplier responses
- ✅ Translates to English

---

### **Week 6: Quote Comparison**

**Day 36-38: Quote Parser**
- [ ] Parse supplier quotes (email/WeChat)
- [ ] Extract: unit price, tooling cost, lead time, MOQ
- [ ] Normalize to common units
- [ ] Calculate total cost (including tooling)

**Day 39-40: Comparison Matrix**
- [ ] Generate side-by-side comparison:
  ```
  Supplier | Price | Tooling | Lead Time | MOQ | Rating | Notes
  Factory A | $5.20 | $500   | 7 days   | 100 | ⭐⭐⭐⭐ | ISO 9001
  Factory B | $4.80 | $400   | 14 days  | 500 | ⭐⭐⭐ | Cheaper
  Factory C | $6.10 | $600   | 5 days   | 50  | ⭐⭐⭐⭐⭐ | Premium
  ```
- [ ] Highlight best options
- [ ] Add recommendations

**Day 41-42: Selection Logic**
- [ ] Rank by: price + rating + speed
- [ ] Factor in: MOQ, certifications, location
- [ ] Generate recommendation
- [ ] HITL approval for final selection

**Deliverable End of Week 6:**
- ✅ Can parse quotes
- ✅ Generates comparison matrix
- ✅ Recommends suppliers

---

## 🧪 WEEK 7-8: TESTING & LAUNCH

### **Week 7: Integration Testing**

**Day 43-45: End-to-End Flow**
- [ ] Test: Customer spec → Analysis → RFQ → Quotes → Selection
- [ ] Test with real historical data
- [ ] Measure time savings
- [ ] Identify bottlenecks

**Day 46-47: HITL Optimization**
- [ ] Test all approval gates
- [ ] Ensure clear prompts
- [ ] Test escalation paths
- [ ] Document decision points

**Day 48-49: Error Handling**
- [ ] Test: No suppliers found
- [ ] Test: Translation failures
- [ ] Test: Verification red flags
- [ ] Add fallback behaviors

**Deliverable End of Week 7:**
- ✅ Full flow works end-to-end
- ✅ HITL gates smooth
- ✅ Errors handled gracefully

---

### **Week 8: Shadow Run & Launch**

**Day 50-52: Shadow Run**
- [ ] Take past sourcing job (real data)
- [ ] Run through MVP
- [ ] Compare: Factories found? Time taken? Accuracy?
- [ ] Document improvements

**Day 53-54: Refinement**
- [ ] Fix issues from shadow run
- [ ] Optimize prompts
- [ ] Improve knowledge base
- [ ] Update documentation

**Day 55-56: Launch Preparation**
- [ ] Create user guide
- [ ] Record demo video
- [ ] Set up monitoring
- [ ] Prepare handoff to CTO for maintenance

**Deliverable End of Week 8:**
- ✅ MVP validated
- ✅ Documentation complete
- ✅ Ready for production use

---

## 📊 SUCCESS METRICS

**Technical:**
- [ ] Drawing analysis accuracy: >90%
- [ ] Translation accuracy: >95%
- [ ] Supplier search success: >80%
- [ ] End-to-end time: <48 hours (vs 3 weeks manual)

**Business:**
- [ ] Cost savings: >20% vs manual sourcing
- [ ] Customer satisfaction: >4.5/5
- [ ] Suppliers found: 3-5 per request
- [ ] Quote comparison: Clear winner identified

**System:**
- [ ] Monthly cost: <$90
- [ ] Response time: <5 minutes
- [ ] Uptime: >95%

---

## 🔄 PHASE 2 (POST-MVP)

**When to upgrade:**
- 10+ active customers
- Budget allows $200-500/month
- Need specialized expertise

**Add:**
1. Vector DB (Pinecone) for semantic search
2. Sub-agents (Spec Analyzer, Verification, Negotiation)
3. WeChat Work API automation
4. Trading Company Detector (Qichacha API)
5. DFM Advisor (Claude 3.5 Sonnet)

---

**Created:** 2026-03-27  
**Status:** Ready for implementation  
**Next:** Assign to CTO at 09:00 standup (2026-03-28)
