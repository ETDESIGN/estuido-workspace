#!/usr/bin/env python3
"""
Add Fred Terrois to customer database
"""

import json
from pathlib import Path

CUSTOMERS_FILE = Path.home() / ".openclaw/workspace/customers/contacts.json"

# Customer data
fred_terrois = {
    "business_name": "Freds Terroirs",
    "website": "freds.hk",
    "contact_name": "Fred Terroirs",
    "phone": "+852 5577 7535",
    "email": "",
    "status": "active",
    "customer_since": "before-2026-03-26",
    "relationship": "good customer, long-term",
    "industry": "E-commerce / Online Grocery",
    "notes": "Built and manages freds.hk website. WordPress + WooCommerce."
}

# Load existing contacts or create new
if CUSTOMERS_FILE.exists():
    data = json.loads(CUSTOMERS_FILE.read_text())
else:
    data = {"contacts": []}

# Check if Fred already exists
exists = False
for i, contact in enumerate(data.get("contacts", [])):
    if contact.get("phone") == fred_terrois["phone"]:
        data["contacts"][i] = fred_terrois
        exists = True
        break

if not exists:
    data.setdefault("contacts", []).append(fred_terrois)

# Save
CUSTOMERS_FILE.write_text(json.dumps(data, indent=2))

print("✅ Fred Terrois added to customer database")
print(f"   Phone: {fred_terrois['phone']}")
print(f"   Business: {fred_terrois['business_name']}")
print(f"   Website: {fred_terrois['website']}")
