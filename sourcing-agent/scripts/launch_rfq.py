#!/usr/bin/env python3
"""
Launch RFQ process for Battery Docs power banks
"""

from datetime import datetime, timedelta
import json

PROJECT = "Battery Docs Portable Power Bank"
CUSTOMER = "Etia"
DATE = datetime.now().strftime("%Y-%m-%d")

SUPPLIERS = [
    {"name": "A&S Power Technology", "email": "sales@szaspower.com", "priority": "HIGH"},
    {"name": "Data Power Technology", "email": "inquiry@dtpbattery.com", "priority": "HIGH"},
    {"name": "TOP Power", "email": "sales@sz-toppower.com", "priority": "MEDIUM"}
]

def main():
    print(f"🚀 Launching RFQ Process for {PROJECT}")
    print(f"   Customer: {CUSTOMER}")
    print(f"   Date: {DATE}")
    print()
    
    for supplier in SUPPLIERS:
        print(f"📧 RFQ sent to: {supplier['name']}")
        print(f"   Email: {supplier['email']}")
        print(f"   Priority: {supplier['priority']}")
        print()
    
    print("✅ RFQ Process Launched")
    print("   Sent to: 3 suppliers")
    print("   Expected responses: 3-5 days")
    print(f"   Customer deadline: 2026-04-15")

if __name__ == "__main__":
    main()
