# 📋 RFQ Template - Project Spider (Battery Sharing Dock System)

**Project Name:** Spider - Battery Sharing Dock System
**Customer:** Etia
**Date:** 2026-03-28
**RFQ Number:** RFQ-2026-002-SPIDER
**Current Supplier:** Winnsenn (EOL - Need Replacement)

---

## 🎯 Project Overview

**System Description:**
Battery sharing dock system for commercial deployment. Users rent battery packs from docks to charge their devices. Each dock holds 10-12 batteries and communicates with a central computer for tracking.

**Application:**
- Commercial venues (cafes, airports, malls, hotels)
- Battery rental/sharing economy
- Integration with customer app/system

**Annual Volume:**
- **80 docks** per year
- **2,000 batteries** per year

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
   - Reinforced mount design (prevents contact issues)
   - Spring-loaded insertion (battery stays in when horizontal)

2. **Battery Detection**
   - Presence detection switches for each slot
   - Sound emitter when battery properly inserted
   - LED indicators for each slot

3. **Communication Interface**
   - **UART output** to computer system
   - Retrieves data from each battery

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
- **Cells:** 18650 configuration (similar to current design)
- **Certifications:** CE, FCC, UL 2054, IEC 62133, UN38.3 (required)

**Charging:**
- **Input:** Via pogo pins (NO USB charging port on battery)
- **Charging location:** Only in dock
- **Charging time:** 1-1.5 hours (not critical spec)

**Output:**
- **3 Charging Cables** (integrated):
  - ⚡ Micro USB
  - ⚡ USB-C
  - ⚡ Lightning
- **Voltage:** 5V
- **Current:** 1A (no fast charging)
- **Always ON:** No power button (battery always ready)

**Features:**
1. **Unique Identification**
   - Each battery has unique serial number
   - Communicated via UART to dock/computer

2. **User Feedback**
   - LED indicator (battery level)
   - Non-blocking indicator

3. **Physical Design**
   - Metal latch mechanism (security)
   - Redesigned cable channels (prevents blocking)
   - Compact form factor

4. **Data Reporting** (via UART):
   - Serial number (unique ID)
   - Battery level (%)
   - Number of charge cycles
   - Battery release events
   - Battery presence status

---

## 🔌 Communication Protocol

**UART Interface:**
- Dock retrieves data from each battery
- Sends to computer system
- Data points per battery:
  - Serial number
  - Battery level
  - Cycle count
  - Release/presence events

---

## 📦 Production Requirements

### Annual Volume
- **80 docks** (first order: prototype quantities)
- **2,000 batteries** (first order: prototype quantities)

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

**Target Pricing:**
- Please quote for:
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
   - Experience with multi-component electromechanical products
   - PCB design and assembly in-house

2. **Battery Expertise**
   - Li-ion/LiPo battery manufacturing
   - Battery safety certifications (UL, IEC 62133, UN38.3)
   - Quality control for battery packs

3. **Manufacturing Capabilities:**
   - Plastic injection molding (dock housing)
   - PCB assembly (surface mount)
   - Cable assembly (3-in-1 charging cables)
   - Final assembly and testing

4. **Quality Assurance:**
   - ISO 9001 certification (preferred)
   - Testing procedures for batteries
   - Safety testing for electrical systems

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
- Experience with battery sharing systems or similar

### 3. Technical Capabilities
- Battery cell brand and model (Samsung, LG, etc.)
- PCB design capabilities
- Certificates held (UL, CE, FCC, ISO)
- Quality control procedures

### 4. References
- Similar projects completed
- Test reports available
- Sample availability

### 5. Timeline
- Prototype lead time
- Sample availability
- Mass production capacity

---

## 🎯 Evaluation Criteria

Your quotation will be evaluated on:
- **Price** (25%)
- **Quality & Certifications** (30%)
- **System Integration Capability** (20%)
- **Lead Time** (15%)
- **Communication & Location** (10%)

---

## 📞 Response Information

**Response Deadline:** 2026-03-31 (3 days from now)

**Contact:**
- Name: Etia
- Project: Spider (Battery Sharing Dock System)
- Email: [customer email]
- WeChat: [customer wechat]
- Phone: [+86-XXX-XXXX-XXXX]

---

## 📄 Notes

**Current Situation:**
- Existing supplier (Winnsenn) has EOL product
- Need replacement with improved design
- Existing dock has contact issues (pogo pin mount) - must be fixed
- Existing plastic latches fail - must be metal

**Improvements Needed:**
- Reinforced pogo pin mount (better contact)
- Metal security latches (prevent forced removal)
- Improved cable management (prevent blocking)

**Reference:**
- Meeting minutes: March 16, 2026
- Current product dock dimensions: 200×200×135mm
- Current battery capacity: 5,000 mAh

---

**Looking forward to your quotation!**

**Best regards,**

**Etia**
*Project Spider - Battery Sharing Dock System*

---

*RFQ Created: 2026-03-28*
*Status: Ready to send to qualified suppliers*
