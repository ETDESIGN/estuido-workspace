#!/usr/bin/env python3
"""
Generate professional Excel quotation with modern formatting
"""

import sys
sys.path.insert(0, '/home/e/.openclaw/workspace/skills/generate-excel')

from generate_excel import create_excel_file

# Dark Navy theme colors
NAVY_DARK = "1F4E78"      # Header background
WHITE = "FFFFFF"           # Header text
GRAY_LIGHT = "D9D9D9"     # Zebra stripe
ACCENT_BLUE = "4472C4"    # Accent color
GREEN = "008000"          # Total row

def format_currency(amount):
    """Format as Euro currency"""
    return f"€{amount:,.2f}"

# Build the quotation data structure
quotation_data = []

# 1. TITLE SECTION (5 columns)
quotation_data.append([
    {"value": "⚡ FLASH360 - Shared Charging System Quotation", "bold": True, "color": WHITE, "bg_color": NAVY_DARK, "align": "center"}
])
quotation_data.append(["", "", "", "", ""])

# 2. QUOTATION INFO (5 columns)
quotation_data.append([
    {"value": "QUOTATION REFERENCE", "bold": True, "color": NAVY_DARK},
    {"value": "FLASH-2026-0318-001", "bold": True},
    "",
    "",
    ""
])
quotation_data.append([
    {"value": "DATE", "bold": True, "color": NAVY_DARK},
    {"value": "March 18, 2026"},
    "",
    "",
    ""
])
quotation_data.append([
    {"value": "VALID UNTIL", "bold": True, "color": NAVY_DARK},
    {"value": "June 18, 2026", "color": "C00000", "bold": True},
    "",
    "",
    ""
])
quotation_data.append(["", "", "", "", ""])

# 3. COLUMN HEADERS (5 columns)
quotation_data.append([
    {"value": "ITEM #", "bold": True, "color": WHITE, "bg_color": NAVY_DARK, "align": "center"},
    {"value": "DESCRIPTION", "bold": True, "color": WHITE, "bg_color": NAVY_DARK, "align": "center"},
    {"value": "QUANTITY", "bold": True, "color": WHITE, "bg_color": NAVY_DARK, "align": "center"},
    {"value": "UNIT PRICE", "bold": True, "color": WHITE, "bg_color": NAVY_DARK, "align": "right"},
    {"value": "AMOUNT", "bold": True, "color": WHITE, "bg_color": NAVY_DARK, "align": "right"}
])

# 4. HARDWARE ITEMS
# Category header
quotation_data.append([
    {"value": "HARDWARE", "bold": True, "color": WHITE, "bg_color": ACCENT_BLUE},
    {"value": "", "bg_color": ACCENT_BLUE},
    {"value": "", "bg_color": ACCENT_BLUE},
    {"value": "", "bg_color": ACCENT_BLUE},
    {"value": "", "bg_color": ACCENT_BLUE}
])

# Item 1 - Charging Dock
quotation_data.append([
    {"value": "1", "bold": True, "color": NAVY_DARK, "align": "center"},
    {"value": "Charging Dock (8-slot) - Hardware", "bold": True},
    {"value": 80, "align": "center"},
    {"value": 76.80, "align": "right"},
    {"value": "=C8*D8", "align": "right"}  # Formula: Quantity * Unit Price
])

quotation_data.append([
    "",
    {"value": "    Complete docking station with 8 slots, Pogo pin charging, Metal lock, LED indicators", "color": "666666"},
    "",
    "",
    ""
])

# Item 2 - Power Bank
quotation_data.append([
    {"value": "2", "bold": True, "color": NAVY_DARK, "align": "center"},
    {"value": "Power Bank (5000mAh) - Hardware", "bold": True},
    {"value": 2000, "align": "center"},
    {"value": 9.85, "align": "right"},
    {"value": "=C10*D10", "align": "right"}  # Formula
])

quotation_data.append([
    "",
    {"value": "    3-in-1 cables (Micro USB/Type-C/Lightning), UART serial, 4-level LED indicator", "color": "666666"},
    "",
    "",
    ""
])

# 5. SOFTWARE ITEMS
# Category header
quotation_data.append([
    {"value": "SOFTWARE & SERVICES", "bold": True, "color": WHITE, "bg_color": ACCENT_BLUE},
    {"value": "", "bg_color": ACCENT_BLUE},
    {"value": "", "bg_color": ACCENT_BLUE},
    {"value": "", "bg_color": ACCENT_BLUE},
    {"value": "", "bg_color": ACCENT_BLUE}
])

# Item 3 - Payment Integration
quotation_data.append([
    {"value": "3", "bold": True, "color": NAVY_DARK, "align": "center"},
    {"value": "System Payment Integration", "bold": True},
    {"value": 1, "align": "center"},
    {"value": 8800.00, "align": "right"},
    {"value": "=C13*D13", "align": "right"}  # Formula
])

quotation_data.append([
    "",
    {"value": "    Payment gateway, User management, Rental processing", "color": "666666"},
    "",
    "",
    ""
])

# Item 4 - Mobile App
quotation_data.append([
    {"value": "4", "bold": True, "color": NAVY_DARK, "align": "center"},
    {"value": "Mobile Application Development", "bold": True},
    {"value": 1, "align": "center"},
    {"value": 3800.00, "align": "right"},
    {"value": "=C15*D15", "align": "right"}  # Formula
])

quotation_data.append([
    "",
    {"value": "    iOS & Android apps, QR scanning, Real-time tracking, Payment integration", "color": "666666"},
    "",
    "",
    ""
])

# 6. SPACER
quotation_data.append(["", "", "", "", ""])

# 7. SUMMARY SECTION
quotation_data.append([
    "",
    {"value": "Hardware (Docks + Power Banks)", "bold": True, "bg_color": NAVY_DARK, "color": WHITE},
    "",
    "",
    {"value": "=E8+E10", "bold": True, "bg_color": NAVY_DARK, "color": WHITE, "align": "right"}
])

quotation_data.append([
    "",
    {"value": "Software & Integration Services", "bold": True, "bg_color": NAVY_DARK, "color": WHITE},
    "",
    "",
    {"value": "=E13+E15", "bold": True, "bg_color": NAVY_DARK, "color": WHITE, "align": "right"}
])

quotation_data.append([
    "",
    "",
    "",
    "",
    {"value": "", "bg_color": NAVY_DARK}
])

# TOTAL
quotation_data.append([
    "",
    {"value": "TOTAL EXCL. VAT", "bold": True, "color": WHITE, "bg_color": GREEN, "align": "right"},
    "",
    "",
    {"value": "=E18+E19", "bold": True, "color": WHITE, "bg_color": GREEN, "align": "right"}
])

quotation_data.append(["", "", "", "", ""])

# 8. TECHNICAL SPECIFICATIONS (4 columns for side-by-side)
quotation_data.append([
    {"value": "⚙️ TECHNICAL SPECIFICATIONS", "bold": True, "color": NAVY_DARK},
    "",
    "",
    "",
    ""
])
quotation_data.append(["", "", "", "", ""])

quotation_data.append([
    {"value": "Charging Dock (8-slot)", "bold": True, "color": NAVY_DARK},
    "",
    {"value": "Power Bank (5000mAh)", "bold": True, "color": NAVY_DARK},
    "",
    ""
])

specs_data = [
    ("• Pogo pin contact charging system", "• 5000mAh Li-Polymer battery"),
    ("• Metal anti-theft locking mechanism", "• Integrated 3-in-1 cables"),
    ("• LED status indicators (per slot)", "• UART-readable serial number"),
    ("• UART serial communication interface", "• 4-level LED charge indicator"),
    ("• ABS+PC fire-resistant housing", "• Premium cells (Samsung/LG/ATL)"),
    ("• Input: 12V DC power supply", "• CE certified for European market"),
    ("• Output: 5V / 1A per charging slot", "• Pogo pin compatible design")
]

for left_spec, right_spec in specs_data:
    quotation_data.append([left_spec, "", right_spec, "", ""])

quotation_data.append(["", "", "", "", ""])

# 9. PAYMENT & DELIVERY (4 columns)
quotation_data.append([
    {"value": "💳 PAYMENT & DELIVERY", "bold": True, "color": NAVY_DARK},
    "",
    "",
    "",
    ""
])
quotation_data.append(["", "", "", "", ""])

quotation_data.append([
    {"value": "Delivery Terms", "bold": True, "color": NAVY_DARK},
    "",
    {"value": "Payment Schedule", "bold": True, "color": NAVY_DARK},
    "",
    ""
])

quotation_data.append([
    {"value": "Incoterms:", "bold": True},
    "EXW (Ex Works)",
    {"value": "Deposit (50%):", "bold": True},
    format_currency(19222.00),
    ""
])

quotation_data.append([
    {"value": "Lead Time:", "bold": True},
    "4-6 weeks from order confirmation",
    {"value": "Due:", "bold": True},
    "Upon order confirmation",
    ""
])

quotation_data.append([
    {"value": "Packaging:", "bold": True},
    "Standard export packaging",
    {"value": "Final Payment (50%):", "bold": True},
    format_currency(19222.00),
    ""
])

quotation_data.append([
    {"value": "Warranty:", "bold": True},
    "12 months limited hardware warranty",
    {"value": "Due:", "bold": True},
    "Before shipment",
    ""
])

quotation_data.append(["", "", "", "", ""])

# 10. SERVICES INCLUDED (2 columns)
quotation_data.append([
    {"value": "✅ SERVICES INCLUDED", "bold": True, "color": NAVY_DARK},
    "",
    "",
    "",
    ""
])
quotation_data.append(["", "", "", "", ""])

quotation_data.append([
    {"value": "Hardware Services", "bold": True, "color": NAVY_DARK},
    "",
    {"value": "Software Services", "bold": True, "color": NAVY_DARK},
    "",
    ""
])

services_data = [
    ("✓ Pre-shipment quality inspection", "✓ Payment gateway integration"),
    ("✓ Serial number database management", "✓ iOS & Android app deployment"),
    ("✓ Technical documentation & manuals", "✓ Admin dashboard access"),
    ("✓ 12-month hardware warranty", "✓ 6-month technical support included")
]

for left_service, right_service in services_data:
    quotation_data.append([left_service, "", right_service, "", ""])

quotation_data.append(["", "", "", "", ""])

# 11. CONTACT (2 columns)
quotation_data.append([
    {"value": "📞 CONTACT INFORMATION", "bold": True, "color": NAVY_DARK},
    "",
    "",
    "",
    ""
])
quotation_data.append(["", "", "", "", ""])

quotation_data.append([
    {"value": "Quotation Inquiries", "bold": True, "color": NAVY_DARK},
    "",
    {"value": "Technical Support", "bold": True, "color": NAVY_DARK},
    "",
    ""
])

quotation_data.append([
    "Email: quotation@flash360.example.com",
    "",
    "Email: support@flash360.example.com",
    "",
    ""
])

quotation_data.append([
    "Phone: +33 X XX XX XX XX",
    "",
    "WeChat: Flash360-Tech",
    "",
    ""
])

quotation_data.append([
    "WeChat: Flash360-B2B",
    "",
    "",
    "",
    ""
])

quotation_data.append(["", "", "", "", ""])

# 12. TERMS
quotation_data.append([
    {"value": "📋 TERMS & NOTES", "bold": True, "color": NAVY_DARK},
    "",
    "",
    "",
    ""
])
quotation_data.append(["", "", "", "", ""])

terms_data = [
    "• This quotation is confidential and valid for 90 days from date of issue",
    "• Prices are subject to change without prior notice after expiration date",
    "• All prices exclude VAT unless otherwise stated",
    "• Minimum order quantity: 1 complete system (80 docks + 2000 power banks)"
]

for term in terms_data:
    quotation_data.append([term, "", "", "", ""])

quotation_data.append(["", "", "", "", ""])

# 13. SIGNATURE
quotation_data.append([
    {"value": "✍️ QUOTATION ACCEPTANCE", "bold": True, "color": NAVY_DARK},
    "",
    "",
    "",
    ""
])
quotation_data.append(["", "", "", "", ""])

quotation_data.append([
    {"value": "To proceed with this quotation, please sign and return:"},
    "",
    "",
    "",
    ""
])

quotation_data.append(["", "", "", "", ""])
quotation_data.append(["", "", "", "", ""])

quotation_data.append([
    {"value": "_________________________", "align": "center"},
    "",
    "",
    "",
    {"value": "_________________________", "align": "center"}
])

quotation_data.append([
    {"value": "Authorized Signature", "align": "center"},
    "",
    "",
    "",
    {"value": "Date", "align": "center"}
])

quotation_data.append(["", "", "", "", ""])
quotation_data.append(["", "", "", "", ""])

quotation_data.append([
    {"value": "Company Name: _______________________"},
    "",
    "",
    "",
    {"value": "Email: _______________________", "align": "right"}
])

quotation_data.append([
    {"value": "Phone: _______________________"},
    "",
    "",
    "",
    ""
])

quotation_data.append(["", "", "", "", ""])
quotation_data.append([
    {"value": "Thank you for your business! ⚡", "bold": True, "color": NAVY_DARK, "align": "center"},
    "",
    "",
    "",
    ""
])

# Generate the Excel file
result = create_excel_file(
    filename="Flash360_Quotation_Modern.xlsx",
    sheet_name="Quotation",
    data=quotation_data
)

print(result)
