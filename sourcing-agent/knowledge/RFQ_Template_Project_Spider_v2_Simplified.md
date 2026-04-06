# 📋 RFQ - Project Spider (Simplified - Free Charging System)

**Project:** Spider - Battery Charging Dock System
**Customer:** Etia
**Date:** 2026-03-28
**RFQ Number:** RFQ-2026-002-SPIDER-v2
**Current Supplier:** Winnsenn (EOL - Need Replacement)

---

## 🎯 Business Model (IMPORTANT)

**Service Type:** FREE charging for customers
**Revenue Model:** Shopping mall pays company directly (lease/rental contract)
**Payment System:** NOT required (no coin, card, or app payment)

**How It Works:**
- Shopping mall installs charging stations
- Customers take batteries → charge phones → return
- FREE service for customers (mall amenity)
- Company receives payment from mall (not per-use)

**Implication:** Keep system simple and cost-effective. Focus on reliability.

---

## 🔧 Complete System Specifications

### Part A: DOCK (Charging Station)

**Dimensions:**
- Width: 135mm
- Height: 200mm
- Depth: 200mm

**Capacity:**
- **10-12 batteries** per dock (flexible)
- Configurable: 1 dock × 12 batteries OR 2 docks × 10 batteries

**Key Features:**

1. **Pogo Pin Charging System**
   - 10-12 pogo pin charging positions
   - Reinforced mount design (fixes current contact issues)
   - Spring-loaded insertion (battery stays in when horizontal)

2. **Battery Detection**
   - Presence detection switches for each slot
   - Sound emitter when battery properly inserted
   - LED indicators for each slot

3. **Communication Interface** (MINIMUM REQUIRED)
   - **UART output** to computer system
   - Retrieves basic data for monitoring/maintenance
   - Simple protocol (keep cost low)

4. **Security Features**
   - **Metal latches** (not plastic) - prevents forced removal
   - Limits grip on battery (anti-theft)

5. **Power Management**
   - Main power input (AC adapter)
   - Distributes power to all battery slots
   - Battery charging: 1-1.5 hours per battery

**Materials:**
- Housing: ABS plastic (or similar)
- Screen printing: 1-2 colors
- Metal latches: Stainless steel

---

### Part B: BATTERY (Removable Power Pack)

**Battery Specifications:**
- **Capacity:** 5,000 mAh (±2000)
- **Type:** Lithium-ion (18650 cells) or LiPo
- **Certifications:** CE, FCC, UL 2054, IEC 62133, UN38.3 (required)

**Charging:**
- **Input:** Via pogo pins (NO USB charging port on battery)
- **Charging location:** Only in dock
- **Charging time:** 1-1.5 hours

**Output:**
- **3 Charging Cables** (integrated):
  - ⚡ Micro USB
  - ⚡ USB-C
  - ⚡ Lightning
- **Voltage:** 5V
- **Current:** 1A (standard charging, no fast charging)
- **Always ON:** No power button (battery always ready)

**Features:**

1. **Identification** (MINIMUM REQUIRED)
   - Each battery has unique serial number
   - Communicated via UART to dock/computer

2. **User Feedback**
   - LED indicator (battery level)
   - Simple visual indication

3. **Physical Design**
   - Metal latch mechanism (security)
   - Redesigned cable channels (prevents blocking)
   - Compact form factor

4. **Data Reporting** (MINIMUM SET via UART):
   - Serial number (unique ID)
   - Battery level (%)
   - Battery presence status

**Note:** No complex cycle counting or event tracking needed. Keep it simple.

---

## 🔌 Communication Protocol (SIMPLIFIED)

**UART Interface (MINIMUM REQUIRED):**

**Purpose:** Basic monitoring and maintenance

**Data Points (per battery):**
- ✅ Serial number (ID)
- ✅ Battery level (%)
- ✅ Battery presence (in dock or not)

**NOT Required:**
- ❌ Charge cycle counting (optional, not critical)
- ❌ Event tracking (optional, not critical)
- ❌ Payment processing (not needed)

**Goal:** Keep UART simple and cost-effective. Just enough for basic monitoring.

---

## 📦 Production Requirements

### Annual Volume
- **80 docks** per year
- **2,000 batteries** per year

### Timeline
- **Prototype:** 10 docks + 50 batteries
- **Pilot:** 20 docks + 200 batteries
- **Mass Production:** Ongoing (80 docks + 2,000 batteries/year)

### Target Date
- First prototype: **2026-04-15**
- Pilot production: **2026-05-15**
- Mass production: **2026-06-15**

---

## 💰 Budget & Pricing

**Target Pricing:** (Please quote)
- Complete dock (assembled, tested)
- Individual battery (assembled, tested)
- Bundle pricing (dock + 12 batteries)

**Payment Terms:**
- Prototype: 100% T/T
- Pilot: 50% deposit, 50% before shipment
- Mass Production: 30% deposit, 70% before shipment

---

## ✅ Required Capabilities

**Supplier Must Have:**

1. **System Integration Experience**
   - Can assemble complete dock + battery system
   - Experience with electromechanical products
   - PCB design and assembly

2. **Battery Expertise**
   - Li-ion/LiPo battery manufacturing
   - Battery safety certifications (UL, IEC 62133, UN38.3)
   - Quality control

3. **Manufacturing Capabilities:**
   - Plastic injection molding (dock housing)
   - PCB assembly
   - Cable assembly (3-in-1 charging cables)
   - Final assembly and testing

4. **Simplified Design Focus:**
   - Cost-effective solutions
   - Reliable for commercial deployment
   - No unnecessary features

---

## 📋 Information Required from Supplier

Please provide:

### 1. Quotation
- Unit price: Dock (FOB Shenzhen/Dongguan)
- Unit price: Battery (FOB Shenzhen/Dongguan)
- Bundle pricing: Dock + 12 batteries
- Tooling cost (if any)
- MOQ requirements
- Lead time: Prototype, Pilot, Mass Production

### 2. Company Profile
- Year established
- Employee count
- Production capacity (docks/month, batteries/month)
- Major clients (brands)
- Experience with battery charging systems

### 3. Technical Capabilities
- Battery cell brand and model
- PCB design capabilities
- Certificates held (UL, CE, FCC, etc.)
- Quality control procedures

### 4. Design Approach
- How would you implement simplified UART?
- Cost-reduction suggestions?
- Reliability features for mall deployment?

---

## 🎯 Evaluation Criteria

Your quotation will be evaluated on:
- **Price** (30%)
- **Quality & Certifications** (25%)
- **Reliability** (20%)
- **System Integration** (15%)
- **Communication** (10%)

---

## 📞 Response Information

**Response Deadline:** 2026-03-31 (3 days from now)

**Contact:**
- Name: Etia
- Project: Spider (Battery Charging Dock System)
- Email: [customer email]
- WeChat: [customer wechat]
- Phone: [+86-XXX-XXXX-XXXX]

---

## 📄 Important Notes

**Business Model:**
- FREE charging service (no payment system)
- Shopping mall deployment
- Simple and reliable
- Cost-effective solution

**Current Situation:**
- Existing supplier: Winnsenn (EOL product)
- Need replacement with improved design
- Issues to fix: pogo pin contact, plastic latches

**Improvements Needed:**
- Reinforced pogo pin mount
- Metal security latches
- Improved cable management
- Simplified communication (UART minimum)

**Reference:**
- Meeting minutes: March 16, 2026
- Current dock: 200×200×135mm
- Current battery: 5,000 mAh

---

**Looking forward to your cost-effective quotation!**

**Best regards,**

**Etia**
*Project Spider - Battery Charging Dock System*

---

*RFQ Created: 2026-03-28 06:40 HKT*
*Status: Ready to send to suppliers*
*Version: v2 (Simplified - UART minimum, no payment system)*
