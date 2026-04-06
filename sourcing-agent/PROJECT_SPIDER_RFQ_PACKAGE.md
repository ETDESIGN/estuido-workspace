# 📊 Project Spider - RFQ Package Summary

**Date:** 2026-03-28 06:55 HKT
**Customer:** Etia
**Project:** Spider - Battery Charging Dock System

---

## ✅ RFQ Documents Ready

### 1. Professional RFQ for Suppliers
**File:** `RFQ_FOR_SUPPLIERS.txt`
**Format:** Plain text (ready to send)
**Sections:** 10 complete sections with all specifications
**Status:** ✅ READY TO SEND

### 2. Detailed RFQ Template
**File:** `knowledge/RFQ_Template_Project_Spider_FINAL.md`
**Format:** Markdown (detailed version)
**Contains:** Complete specifications, issues, requirements
**Status:** ✅ COMPLETE

### 3. Supplier Database
**Location:** `suppliers/` directory
**Suppliers Found:**
- STW - Shared power bank stations (95% match)
- Goochain - Pogo pin docks (85% match)
- Plus 4 additional candidates

---

## 📋 Complete Specifications Documented

### DOCK (Charging Station)
- Dimensions: 135×200×200mm
- Capacity: 10-12 batteries (flexible)
- Pogo pin charging system (12 positions)
- UART communication (5 data points)
- Metal security latches
- Sound emitter, LED indicators
- ABS plastic housing

### BATTERY (Removable Power Pack)
- Capacity: 5,000 mAh (18650 cells)
- Charging: Pogo pins only (no USB port)
- Output: 3 cables (Micro USB + USB-C + Lightning)
- Voltage: 5V, Current: 1A
- Unique serial number per battery
- LED indicator, metal latches

### UART Data Points (All 5 Required)
1. Serial number
2. Battery level (%)
3. Number of charge cycles
4. Battery release events
5. Battery presence status

### Production Requirements
- Annual: 80 docks + 1,200 batteries
- Prototype: 10 docks + 120 batteries (by April 15)
- Pilot: 20 docks + 240 batteries (by May 15)
- Mass Production: 80 docks/year + 1,200 batteries/year (from June 15)

### Issues to Fix
1. Pogo pin contact → Reinforced mount
2. Security latches → Metal (not plastic)
3. Cable management → Larger channels
4. Spring tension → Proper tension

### Certifications Required
- UL 2054 (battery safety)
- IEC 62133 (transport)
- UN38.3 (shipping)
- CE (Europe)
- FCC (USA)

---

## 📞 Internal Information (NOT for Suppliers)

**Price Benchmark:**
- Dock (empty): ~500 RMB
- Battery: TBD
- **DO NOT share with suppliers**

**Current Supplier:**
- Winnsenn (EOL product)
- Need replacement

---

## 🚀 Next Steps for Customer

1. **Review RFQ document** (`RFQ_FOR_SUPPLIERS.txt`)
2. **Send to suppliers** (via email, 1688.com, Made-in-China.com)
3. **Collect quotations** (expected in 3-5 days)
4. **Create comparison matrix** (evaluate based on criteria)
5. **Select top suppliers** (for prototype phase)
6. **Order prototypes** (target: April 15 delivery)

---

## 📁 File Locations

**RFQ Documents:**
- `~/.openclaw/workspace/sourcing-agent/RFQ_FOR_SUPPLIERS.txt` (READY TO SEND)
- `~/.openclaw/workspace/sourcing-agent/knowledge/RFQ_Template_Project_Spider_FINAL.md` (detailed)

**Supplier Database:**
- `~/.openclaw/workspace/sourcing-agent/suppliers/` (6 suppliers)

**Tracking:**
- `~/.openclaw/workspace/sourcing-agent/PROJECT_SPIDER_SUPPLIER_SEARCH.md`
- `~/.openclaw/workspace/sourcing-agent/BATTERY_DOCS_RFQ_TRACKER.md`

**Mission Control:**
- Dashboard: http://localhost:8501
- Job: job_004 (in Mission Control)

---

**Status:** ✅ RFQ PACKAGE READY FOR CUSTOMER REVIEW

*All customer requirements documented exactly as specified*
*Ready to send to suppliers for quotation*
