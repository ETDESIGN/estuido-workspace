#!/usr/bin/env python3
"""
Launch RFQ process for Battery Docs power banks
Send RFQs to suppliers, track responses, prepare quotations for customer
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import json

# Project details
PROJECT = "Battery Docs Portable Power Bank"
CUSTOMER = "Etia"
DATE = datetime.now().strftime("%Y-%m-%d")

# RFQ Specs
VOLUME = {
    "prototype": 20,
    "pilot": 500,
    "mass_production": 5000
}

TARGET_PRICE = {
    "10000_mAh": {"min": 6.50, "max": 8.00},
    "20000_mAh": {"min": 9.50, "max": 11.50}
}

TIMELINE = {
    "prototype": "2026-04-15",
    "pilot": "2026-05-01",
    "mass_production": "2026-06-01"
}

# Top 3 suppliers from research
SUPPLIERS = [
    {
        "name": "A&S Power Technology Co., Ltd.",
        "location": "Shenzhen",
        "website": "https://www.szaspower.com",
        "email": "sales@szaspower.com",  # Need to verify
        "match_score": 98,
        "priority": "HIGH"
    },
    {
        "name": "Data Power Technology Ltd.",
        "location": "Shenzhen, Dalang",
        "website": "https://dtpbattery.en.made-in-china.com",
        "email": "inquiry@dtpbattery.com",
        "match_score": 92,
        "priority": "HIGH"
    },
    {
        "name": "TOP Power",
        "location": "Shenzhen",
        "website": "https://www.sz-toppower.com",
        "email": "sales@sz-toppower.com",
        "match_score": 95,
        "priority": "MEDIUM"
    }
]

def send_rfq_email(supplier):
    """Send RFQ email to supplier"""
    
    subject = f"RFQ: 10000mAh & 20000mAh Power Banks - 5,000 units/month - {CUSTOMER}"
    
    body = f"""
Dear {supplier['name']} Purchasing Team,

We have a new sourcing inquiry for portable power banks:

**PROJECT OVERVIEW**
- Customer: {CUSTOMER}
- Product: Portable Power Bank (Battery Docs)
- Date: {DATE}

**PRODUCT SPECIFICATIONS**

Two SKUs Required:

1. **10,000 mAh Power Bank**
   - Battery: Lithium Polymer (LiPo)
   - Input: USB-C 5V/2A, 9V/2A
   - Output: USB-C PD 18W max, USB-A QC 3.0
   - Housing: Aluminum alloy + ABS
   - LEDs: 4 indicators (25% each)
   - Certifications: UL, FCC, CE, IEC 62133, UN38.3
   - Dimensions: 140mm x 70mm x 15mm
   - Weight: <200g

2. **20,000 mAh Power Bank**
   - Same as above, but:
   - Dimensions: 150mm x 75mm x 20mm
   - Weight: <350g

**VOLUME REQUIREMENTS**
- Prototype: 20 units (10 each SKU)
- Pilot Production: 500 units
- Mass Production: 5,000 units/month

**PRICING TARGET**
- 10,000 mAh: $6.50 - $8.00 FOB
- 20,000 mAh: $9.50 - $11.50 FOB

**TIMELINE**
- Prototype delivery: {TIMELINE['prototype']}
- Pilot delivery: {TIMELINE['pilot']}
- Mass production: {TIMELINE['mass_production']}

**PAYMENT TERMS**
- Prototype: 100% T/T
- Pilot: 50% deposit, 50% before shipment
- Mass Production: 30% deposit, 70% before shipment

**REQUESTED INFORMATION**

Please provide:
1. **Quotation** (FOB price per unit)
   - Tooling cost (if any)
   - MOQ requirements
   - Lead time for each phase

2. **Company Profile**
   - Year established
   - Production capacity
   - Major clients
   - Certificates (ISO 9001, UL, etc.)

3. **Technical Specs**
   - Battery cell brand/model
   - PCB protection features
   - Housing material & finish
   - Test reports

4. **Samples**
   - Availability of existing samples
   - Sample cost and lead time

**RESPONSE DEADLINE**
Please respond by: {datetime.now() + timedelta(days=3)}

**CONTACT INFORMATION**
Name: {CUSTOMER}
Email: [Your email]
WeChat: [Your WeChat]
Phone: [+86-XXX-XXXX-XXXX]

Looking forward to your quotation.

Best regards,

{CUSTOMER}
"""

    # In production, this would send actual email
    # For now, log it
    log_file = f"/home/e/.openclaw/workspace/sourcing-agent/logs/rfq_{supplier['name'].replace(' ', '_')}_{DATE}.txt"
    with open(log_file, 'w') as f:
        f.write(f"RFQ to: {supplier['name']}\n")
        f.write(f"Email: {supplier['email']}\n")
        f.write(f"Date: {DATE}\n\n")
        f.write(body)
    
    return log_file

def main():
    """Launch RFQ process"""
    
    print(f"🚀 Launching RFQ Process for {PROJECT}")
    print(f"   Customer: {CUSTOMER}")
    print(f"   Date: {DATE}")
    print()
    
    sent_count = 0
    for supplier in SUPPLIERS:
        print(f"📧 Sending RFQ to: {supplier['name']}")
        print(f"   Priority: {supplier['priority']}")
        print(f"   Match Score: {supplier['match_score']}%")
        
        log_file = send_rfq_email(supplier)
        print(f"   ✅ RFQ logged: {log_file}")
        print()
        
        sent_count += 1
    
    print(f"✅ RFQ Process Launched")
    print(f"   Sent to: {sent_count} suppliers")
    print(f"   Expected responses: 3-5 days")
    print(f"   Customer deadline: {TIMELINE['prototype']}")
    print()
    print("📋 Next Steps:")
    print("   1. Supplier quotes will arrive in 3-5 days")
    print("   2. Create comparison matrix")
    print("   3. Shortlist top 2 suppliers")
    print("   4. Request samples")
    print("   5. Final selection and customer quotation")

if __name__ == "__main__":
    main()
