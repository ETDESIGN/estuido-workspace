# 🏭 Research & Sourcing Agent - Comprehensive Plan

**Project:** Create AI-powered sourcing agent for Dongguan manufacturing business  
**Target:** EU/abroad customers → China factories (1688.com)  
**Focus:** High-quality, efficient, professional sourcing workflow  
**Date:** 2026-03-27  
**Status:** Research Phase - Version 1.0

---

## 📊 Market Context

### Dongguan Manufacturing Hub
- **Location:** Pearl River Delta, Guangdong Province
- **Specialties:** Plastic molding, CNC machining, electronics/PCB
- **Advantage:** Complete supply chain ecosystem
- **Challenge:** Language barrier, supplier verification, quality control

### 1688.com Ecosystem
- **Platform:** Alibaba's domestic wholesale marketplace
- **Scale:** Millions of suppliers, factories, trading companies
- **Key Features:**
  - 诚信通 (Chengxintong): Verified membership tier
  - Powerful Merchant icon: Direct factory verification
  - Real-time chat (1688 Chat)
  - Supplier ratings/reviews
  - Transaction history

---

## 🔍 Phase 1: Supplier Discovery & Filtering

### Search Strategy
1. **Keyword Research** (Chinese + English)
   - Industry terms: 塑料件, CNC加工, PCB打样
   - Technical specs: 材质, 公差, 产量
   - Regional: 东莞, 深圳, 广东

2. **1688.com Advanced Filters**
   - Business type: Manufacturer (not trading company)
   - Verification: 诚信通, Powerful Merchant
   - Capacity: Worker count (51-100+ for small/medium)
   - Certifications: ISO 9001, IATF 16949
   - Trade history: Minimum 3 years
   - Response rate: >95%
   - On-time delivery: >90%

3. **Initial Screening**
   - Check for medals/awards on profile
   - Verify business license exists
   - Confirm factory address matches 1688 listing
   - Review transaction volume
   - Assess response speed

---

## ✅ Phase 2: Supplier Verification

### Document Validation
1. **Business License (营业执照)**
   - Use SAMR (State Administration for Market Regulation) database
   - Verify: Company name, registration number, legal rep
   - Check: Business scope includes target products
   - Confirm: Registration is active (not revoked)

2. **Factory Audit Checklist**
   - Physical address verification (Google Maps/Baidu Maps)
   - Equipment inventory (CNC machines, injection molding machines)
   - Quality certifications (ISO, IATF, UL, CE)
   - Production capacity (units/day, lead times)
   - Staff qualifications (engineers, QC inspectors)

3. **Red Flags to Watch**
   - Trading company posing as factory
   - Fake or expired certifications
   - Negative reviews/complaints
   - Unresponsive to inquiries
   - Refuses factory visit
   - Demands 100% upfront payment
   - No physical address

---

## 💬 Phase 3: Communication Strategy

### Channel Selection
1. **1688 Chat** (First contact)
   - Built-in to platform
   - Instant messaging
   - Good for initial inquiry

2. **WeChat** (Ongoing relationship)
   - Preferred by Chinese suppliers
   - Voice messages popular
   - Video call capability
   - File sharing (drawings, specs)

3. **Email** (Formal documentation)
   - Purchase orders (POs)
   - Technical specifications
   - Contracts
   - Shipping documents

### Communication Best Practices
- **Guanxi (关系):** Build relationship before negotiating
- **Time zone:** China Standard Time (UTC+8)
- **Language:** Simplified Chinese preferred
- **Response acknowledgment:** Always confirm receipt
- **Voice messages:** Common and acceptable on WeChat
- **Small talk:** Builds trust (weather, local news)
- **Gift giving:** Small tokens appreciated

---

## 📋 Phase 4: Technical Requirements Handling

### For Plastic Parts
1. **Required Specifications:**
   - Material type (ABS, PP, PC, etc.)
   - Color (Pantone/RAL code)
   - Wall thickness
   - Tolerance (±0.1mm typical)
   - Surface finish (glossy, matte, textured)
   - Molding process (injection, blow, compression)
   - Quantity (prototype, pilot, mass production)

2. **Documentation Needed:**
   - 3D CAD files (STEP format)
   - 2D drawings (PDF with GD&T)
   - Material specifications (data sheet)
   - Prototype samples for reference

### For CNC Machining
1. **Required Specifications:**
   - Material (aluminum, steel, stainless, brass, plastic)
   - File format: STEP + PDF
   - Tolerances: ±0.005" (±0.13mm) standard, tighter on request
   - Surface finish: as-machined, anodized, plated
   - Quantity breakdown: proto/MP quantities
   - Critical dimensions (CTQs)
   - Inspection requirements (FAI, CMM, AQL)

2. **DFM Feedback Needed:**
   - Design optimizations for manufacturability
   - Cost-saving suggestions
   - Material alternatives
   - Tooling considerations

### For PCB Manufacturing
1. **Required Specifications:**
   - Gerber files
   - BOM (bill of materials)
   - Stack-up details
   - Solder mask color
   - Surface finish (HASL, ENIG, OSP)
   - Copper weight
   - Impedance control (if needed)
   - Testing requirements (flying probe, bed of nails)

2. **Special Considerations:**
   - Min hole size (0.2mm typical)
   - Trace width/space
   - Layer count
   - Panelization
   - Lead time (prototype vs production)

---

## 🔍 Phase 5: Due Diligence & Quality Assurance

### Sample Evaluation
1. **Request Samples**
   - Initial samples (free or low cost)
   - Verify quality first-hand
   - Check tolerances with calipers/micrometer
   - Test functionality if applicable

2. **Third-Party Inspection**
   - SGS, Intertek, Bureau Veritas
   - Pre-shipment inspection (PSI)
   - During production inspection (DUPRO)
   - Container loading check (CLC)

### Pricing & Payment
1. **Price Analysis**
   - Compare 3-5 suppliers
   - Understand price breakdown (material, labor, overhead)
   - Negotiate volume discounts
   - Check for hidden costs (tooling, shipping)

2. **Payment Terms**
   - Standard: 30% deposit, 70% before shipment
   - New suppliers: Consider letter of credit (LC)
   - Western Union: HIGH RISK - avoid for large orders
   - Alibaba Trade Assurance: Safer option

---

## 🎯 Proposed Agent Architecture

### Core Capabilities
1. **Research Module**
   - 1688.com search & filter
   - Multi-language queries (CN/EN)
   - Supplier database building
   - Price comparison engine

2. **Verification Module**
   - Business license lookup (SAMR API)
   - Factory audit checklist
   - Red flag detection
   - Review sentiment analysis

3. **Communication Module**
   - 1688 Chat integration
   - WeChat API (if available)
   - Email template generator
   - Translation (EN ↔ CN)

4. **Technical Module**
   - CAD file analysis
   - DFM checklist generator
   - Spec sheet builder
   - RFQ (Request for Quotation) creator

5. **Project Management Module**
   - Supplier comparison matrix
   - Quote tracking
   - Sample order management
   - Production timeline monitoring

### Workflow Design
```
Customer Request → Analysis & Translation → 1688 Search 
→ Filter & Screen → Verify Suppliers → Contact (WeChat/1688 Chat) 
→ Request Quotes → Analyze Responses → Select Suppliers 
→ Order Samples → Quality Check → Production Monitoring → Delivery
```

---

## 📱 Tool Integration Ideas

1. **1688.com APIs**
   - Product search
   - Supplier info
   - Real-time chat

2. **WeChat Automation**
   - Automated messaging
   - Translation
   - File sharing

3. **SAMR Database API**
   - Business license verification
   - Company status check

4. **Translation Services**
   - Baidu Translate API
   - DeepL API
   - Local LLM for technical terms

5. **Quality Tracking**
   - Google Maps (factory verification)
   - Baidu Maps
   - Satellite imagery

---

## 🎓 Learning & Improvement

### Data Sources
1. **Customer Feedback**
   - Quality issues
   - Delivery problems
   - Communication gaps

2. **Supplier Performance**
   - On-time delivery rate
   - Quality pass rate
   - Responsiveness

3. **Market Trends**
   - Material pricing
   - Lead time changes
   - New technologies

### Continuous Improvement
- Track success rate per supplier
- Maintain blacklist of problematic suppliers
- Build preferred supplier database
- Refine search filters based on outcomes

---

## 🚀 Implementation Roadmap

### Phase 1: MVP (Minimum Viable Product)
- Basic 1688.com search
- Supplier screening checklist
- Simple quote request generator
- Manual verification workflow

### Phase 2: Automation
- Automated supplier search
- License verification API
- WeChat integration (if available)
- Quote comparison matrix

### Phase 3: Intelligence
- ML-based supplier scoring
- Price trend prediction
- Risk assessment
- Automated DFM feedback

---

## 📝 Next Steps

1. **Review this plan** with Etia (you) this evening
2. **Add your insights** from your experience
3. **Refine architecture** based on feedback
4. **Prioritize features** for MVP
5. **Select technology stack**
6. **Begin development**

---

*Research conducted: 2026-03-27*
*Research sources: 1688.com guides, Chinese supplier verification best practices, technical sourcing resources, WeChat business etiquette*
*Status: Ready for review and refinement*
