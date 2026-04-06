# Customer Sourcing Request

**Job ID:** job_XXX  
**Customer:** Customer Name  
**Date:** 2026-03-27  
**Status:** in_progress

---

## Customer Requirements

**Project Description:**  
Brief description of what customer needs.

**Quantity:**  
- Prototype: XX units  
- Pilot: XX units  
- Mass Production: XX units

**Timeline:**  
- First samples needed: YYYY-MM-DD  
- Mass production: YYYY-MM-DD

**Budget:**  
$X.XX per unit

---

## Technical Specifications

### Product Type
- [ ] CNC Machining
- [ ] Plastic Injection Molding
- [ ] PCB/PCBA
- [ ] Assembly
- [ ] Other: ___

### Material
**Type:** (e.g., Aluminum 6061-T6, ABS, FR4)

**Specifications:**
- Grade/Alloy: ___
- Color: ___
- Finish: ___

### Dimensions & Tolerances
**Drawing:** [Link to file]

**Critical Dimensions:**
- Dimension 1: XX ± X.XX mm
- Dimension 2: XX ± X.XX mm
- Overall size: XX x XX x XX mm

**Tolerance Class:** (e.g., ±0.05mm, ±0.01mm)

### Surface Finish
- Type: (e.g., anodized Type II, powder coat, as-machined)
- Color/Texture: ___
- Ra value: X.XX μm

### Special Requirements
- [ ] Heat treatment
- [ ] Secondary operations
- [ ] Assembly required
- [ ] Testing/inspection
- [ ] Certification needed

---

## Clarifying Questions

**AI Agent Questions:**
1. Missing: Al-alloy grade (6061 vs 7075)?
2. Missing: Tolerance (±0.05mm or ±0.5mm)?
3. Missing: Anodizing thickness?
4. Missing: Thread specifications?

**Customer Responses:**
- Answer 1: ___
- Answer 2: ___

---

## AI Analysis

**Extracted Specifications:**
```json
{
  "material": "Aluminum 6061-T6",
  "tolerance": "±0.05mm",
  "finish": "Anodized Type II, clear",
  "quantity": {
    "prototype": 10,
    "pilot": 100,
    "production": 1000
  }
}
```

**Chinese Translation:**
```json
{
  "material": "6061-T6铝合金",
  "tolerance": "公差±0.05mm",
  "finish": "阳极氧化二型，透明",
  "quantity": {
    "prototype": "10个（原型）",
    "pilot": "100个（试产）",
    "production": "1000个（量产）"
  }
}
```

**Complexity Assessment:** (Low/Medium/High)  
**Estimated Difficulty:** (1-10)  
**Recommended Suppliers:** CNC specialists in Dongguan

---

## Supplier Search Results

**Factories Found:** X  
**Qualified Suppliers:** Y  
**Quotes Received:** Z

### Supplier 1: Factory Name
**Score:** 85/100  
**Specialties:** CNC, Aluminum  
**Quote:** $X.XX/unit  
**Lead Time:** X days  
**MOQ:** XX units  

### Supplier 2: Factory Name
**Score:** 78/100  
**Specialties:** CNC, various metals  
**Quote:** $X.XX/unit  
**Lead Time:** X days  
**MOQ:** XX units  

---

## Comparison Matrix

| Supplier | Price | Tooling | Lead Time | MOQ | Rating | Location | Notes |
|----------|-------|---------|-----------|-----|--------|----------|-------|
| Factory A | $5.20 | $500 | 7 days | 100 | ⭐⭐⭐⭐ | Dongguan | ISO 9001 |
| Factory B | $4.80 | $400 | 14 days | 500 | ⭐⭐⭐ | Dongguan | Cheaper |
| Factory C | $6.10 | $600 | 5 days | 50 | ⭐⭐⭐⭐⭐ | Shenzhen | Premium |

---

## Recommendation

**Selected Supplier:** Factory A  
**Reasoning:** Best balance of price, quality, and speed  
**Next Steps:** Contact for samples

---

## RFQ Draft (Chinese)

**Draft:** [Link to /workspace/drafts/rfq_XXX.md]  
**Status:** ready/pending/sent  
**Sent Date:** YYYY-MM-DD  
**Follow-up:** YYYY-MM-DD

---

## Communications Log

**2026-03-27:** Initial RFQ sent  
**2026-03-28:** Supplier responded with questions  
**2026-03-29:** Provided additional specs  
**2026-03-30:** Received quote

---

## Final Selection

**Chosen Supplier:** Factory A  
**Final Price:** $X.XX/unit  
**Tooling Cost:** $XXX  
**First Samples:** YYYY-MM-DD  
**Payment Terms:** 30% deposit, 70% before shipment

---

**Last Updated:** 2026-03-27  
**Next Review:** 2026-03-30
