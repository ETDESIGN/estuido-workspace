# 📋 RFQ - Project Spider (EXACT Customer Specifications)

**Project:** Spider - Battery Sharing Dock System
**Customer:** Etia
**Date:** 2026-03-28
**Reference:** Meeting Minutes - March 16, 2026
**Current Supplier:** Winnsenn (EOL - Need Replacement)

---

## 🎯 Business Model

**Service Type:** FREE charging for shopping mall customers
**Revenue Model:** Shopping mall pays company directly
**Payment System:** NOT required (no payment processing needed)

---

## 🔧 COMPLETE Specifications (As Requested by Customer)

### Part A: DOCK (Charging Station)

**Exact Dimensions:**
- Width: 135mm
- Height: 200mm
- Depth: 200mm

**Capacity:**
- **12 batteries** per dock (flexible: 10-12)
- Configuration: Can be 1 dock × 12 or 2 docks × 8-10

**Key Features (EXACT SPEC):**

1. **Pogo Pin Charging System**
   - 12 pogo pin charging positions
   - Reinforced mount design (must fix current contact issue)
   - Spring-loaded insertion
   - Battery must stay in dock when held horizontally

2. **Battery Detection**
   - Presence detection switches for each slot
   - Sound emitter when battery properly inserted
   - LED indicators for each slot

3. **Communication Interface** (EXACT DATA REQUIRED)
   - **UART output** to computer system
   - Retrieves data from each battery

4. **Security Features**
   - **Metal latches** (upgrade from plastic - prevents forced removal)
   - Limits grip on battery (anti-theft)

5. **Power Management**
   - Main power input (AC adapter)
   - Distributes power to all 12 battery slots
   - Battery charging: 1-1.5 hours per battery

**Materials:**
- Housing: ABS plastic (or similar)
- Screen printing: 1-2 colors
- Metal latches: Stainless steel

---

### Part B: BATTERY (Removable Power Pack)

**EXACT Specifications from Customer:**

**Battery:**
- **Capacity:** 5,000 mAh (±2000)
- **Type:** Lithium-ion (18650 cells, 4-cell configuration)
- **Charging:** Via pogo pins ONLY (NO USB charging port on battery)
- **Charging Time:** 1-1.5 hours (customer said this is not critical)

**Output:**
- **3 Charging Cables** (integrated):
  - ⚡ Micro USB
  - ⚡ USB-C
  - ⚡ Lightning
- **Voltage:** 5V
- **Current:** 1A (NO fast charging)
- **No power button** - battery must always be ready to charge

**Identification & Feedback:**
- **Unique serial number** per battery
- **LED indicator** for battery level (customer: "not blocking")

**Physical Design:**
- **Metal latch mechanism** (security - prevents forced removal)
- **Redesigned cable channels** (current issue: cables block insertion)
- **Compact form factor**

---

## 🔌 UART Communication Protocol (EXACT SPEC)

**Data to Retrieve from Each Battery:**

1. ✅ **Serial number** (unique ID)
2. ✅ **Battery level** (%)
3. ✅ **Number of battery cycles**
4. ✅ **Battery release** events
5. ✅ **Battery presence** (in dock or not)

**Interface:**
- UART to computer (flexible protocol - customer currently uses UART)
- Retrieves data from all 12 batteries

**Note:** Customer specified ALL these data points. Must implement exactly.

---

## 🔧 Issues to Fix (from Current Product)

**Problem 1: Pogo Pin Contact**
- Current: Have to press down to ensure board makes contact
- Fix: Reinforced pogo pin dock mount

**Problem 2: Plastic Latches**
- Current: Can remove batteries by forcing plastic latches
- Fix: **Metal latches** to prevent forced removal and limit grip

**Problem 3: Cable Management**
- Current: Cables blocking battery from sliding into dock
- Fix: Larger cable channels in battery (see video reference)

**Problem 4: Spring Tension**
- Current: Spring too weak/strong
- Fix: Proper spring tension - battery stays in dock when horizontal

---

## 📦 Production Requirements

### Annual Volume
- **80 docks** per year
- **1,200 batteries** per year

### Breakdown
- Prototype: 10 docks + 120 batteries
- Pilot: 20 docks + 240 batteries
- Mass Production: Ongoing (80 docks + 1,200 batteries/year)

**Note:** Each dock holds 10-12 batteries. Total deployment planned: 80 docks with sufficient batteries to support operation.

### Timeline
- First prototype: **2026-04-15** (18 days from now)
- Pilot production: **2026-05-15**
- Mass production: **2026-06-15**

---

## 💰 Budget & Pricing

**Target Pricing:** Please quote
- Complete dock (assembled, tested)
- Individual battery (assembled, tested)
- Bundle pricing (dock + 12 batteries)

**Payment Terms:**
- Prototype: 100% T/T in advance
- Pilot: 50% deposit, 50% before shipment
- Mass Production: 30% deposit, 70% before shipment

---

## ✅ Required Capabilities

**Supplier Must Have:**

1. **System Integration**
   - Complete dock + battery assembly
   - PCB design and assembly (UART, pogo pins, detection)
   - Plastic injection molding
   - Cable assembly

2. **Battery Expertise**
   - Li-ion battery manufacturing (18650 cells)
   - Battery safety certifications: **UL 2054, IEC 62133, UN38.3**
   - Export certifications: **CE, FCC**

3. **Manufacturing**
   - Plastic molding (dock housing)
   - PCB assembly (surface mount)
   - Cable assembly (3-in-1: Micro USB + USB-C + Lightning)
   - Metal latches
   - Final assembly and testing

4. **Quality**
   - ISO 9001 certification (preferred)
   - Battery testing procedures
   - Safety testing

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
- Major clients/brands
- Experience with similar systems

### 3. Technical Specifications
- Battery cell brand and model (Samsung, LG, etc.)
- PCB design capabilities
- UART implementation approach
- Certificates held (UL, CE, FCC, IEC 62133, UN38.3)
- Quality control procedures

### 4. Design for Issues
- How will you fix pogo pin contact issue?
- Metal latch design?
- Cable channel improvements?
- Spring tension approach?

### 5. References
- Similar projects completed
- Test reports available
- Sample availability and lead time

---

## 🎯 Evaluation Criteria

Quotations will be evaluated on:
- **Price** (25%)
- **Quality & Certifications** (30%)
- **System Integration Capability** (20%)
- **Lead Time** (15%)
- **Communication** (10%)

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

## 📄 Important Notes

**Current Situation:**
- Existing supplier: Winnsenn (EOL product)
- Need replacement with improved design
- Must fix all identified issues

**Critical Requirements:**
- Battery certifications: **UL 2054, IEC 62133, UN38.3** (required)
- Export certifications: **CE, FCC** (required)
- Metal latches (security upgrade)
- Reinforced pogo pin mounts
- UART with ALL 5 data points (serial number, level, cycles, release, presence)

**Reference:**
- Meeting minutes: March 16, 2026
- Current dock: 200×200×135mm
- Current battery: 5,000 mAh, 18650 cells
- Number of batteries per dock: 12 (flexible 10-12)

**Business Model:**
- FREE charging service (shopping mall customers)
- Shopping mall pays company directly
- No payment system needed

---

**Looking forward to your quotation!**

**Best regards,**

**Etia**
*Project Spider - Battery Sharing Dock System*

---

*RFQ Created: 2026-03-28 06:42 HKT*
*Status: Ready to send to suppliers*
*Version: FINAL (Exact customer specifications)*
*Based on: Meeting minutes March 16, 2026*
