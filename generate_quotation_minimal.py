#!/usr/bin/env python3
"""
Generate minimalist Excel quotation - clean, simple, professional
"""

import sys
sys.path.insert(0, '/home/e/.openclaw/workspace/skills/generate-excel')

from generate_excel import create_excel_file

def format_currency(amount):
    """Format as Euro currency"""
    return f"€{amount:,.2f}"

# Build clean, minimalist quotation
quotation_data = []

# 1. HEADER - Simple, centered
quotation_data.append([
    {"value": "FLASH360", "bold": True, "align": "center"}
])
quotation_data.append([
    {"value": "Shared Charging System Quotation", "align": "center"}
])
quotation_data.append([""])

# 2. QUOTATION INFO - Simple table
quotation_data.append([
    {"value": "Quotation Reference:", "bold": True},
    {"value": "FLASH-2026-0318-001"},
    {"value": "", "align": "center"},
    {"value": "Date:", "bold": True},
    {"value": "March 18, 2026"}
])

quotation_data.append([
    {"value": "Valid Until:", "bold": True},
    {"value": "June 18, 2026"},
    {"value": "", "align": "center"},
    {"value": "", "align": "center"},
    {"value": "", "align": "center"}
])

quotation_data.append([""])

# 3. TABLE HEADER - Clean, bold
quotation_data.append([
    {"value": "Item", "bold": True, "align": "center"},
    {"value": "Description", "bold": True, "align": "center"},
    {"value": "Quantity", "bold": True, "align": "center"},
    {"value": "Unit Price", "bold": True, "align": "center"},
    {"value": "Amount", "bold": True, "align": "center"}
])

# 4. LINE ITEMS - Clean, minimal
# Item 1
quotation_data.append([
    {"value": "1", "align": "center"},
    "Charging Dock (8-slot)",
    {"value": 80, "align": "center"},
    {"value": 76.80, "align": "right"},
    {"value": "=C9*D9", "align": "right"}
])

# Item 2
quotation_data.append([
    {"value": "2", "align": "center"},
    "Power Bank (5000mAh)",
    {"value": 2000, "align": "center"},
    {"value": 9.85, "align": "right"},
    {"value": "=C10*D10", "align": "right"}
])

# Item 3
quotation_data.append([
    {"value": "3", "align": "center"},
    "System Payment Integration",
    {"value": 1, "align": "center"},
    {"value": 8800.00, "align": "right"},
    {"value": "=C11*D11", "align": "right"}
])

# Item 4
quotation_data.append([
    {"value": "4", "align": "center"},
    "Mobile Application Development",
    {"value": 1, "align": "center"},
    {"value": 3800.00, "align": "right"},
    {"value": "=C12*D12", "align": "right"}
])

quotation_data.append([""])

# 5. SUMMARY - Clean table
quotation_data.append([
    {"value": "", "align": "center"},
    {"value": "", "align": "center"},
    {"value": "", "align": "center"},
    {"value": "Subtotal:", "bold": True, "align": "right"},
    {"value": "=SUM(E9:E12)", "bold": True, "align": "right"}
])

quotation_data.append([
    {"value": "", "align": "center"},
    {"value": "", "align": "center"},
    {"value": "", "align": "center"},
    {"value": "VAT (20%):", "align": "right"},
    {"value": "=E13*0.20", "align": "right"}
])

quotation_data.append([
    {"value": "", "align": "center"},
    {"value": "", "align": "center"},
    {"value": "", "align": "center"},
    {"value": "Total:", "bold": True, "align": "right"},
    {"value": "=E13+E14", "bold": True, "align": "right"}
])

quotation_data.append([""])

# 6. NOTES - Simple, clean
quotation_data.append([
    {"value": "Notes:", "bold": True}
])

quotation_data.append([
    {"value": "• This quotation is valid for 90 days from date of issue"}
])

quotation_data.append([
    {"value": "• Delivery: 4-6 weeks from order confirmation (EXW)"}
])

quotation_data.append([
    {"value": "• Payment: 50% deposit, 50% before shipment"}
])

quotation_data.append([
    {"value": "• Warranty: 12 months on hardware"}
])

quotation_data.append([""])

# 7. TERMS - Clean
quotation_data.append([
    {"value": "Terms & Conditions:", "bold": True}
])

quotation_data.append([
    {"value": "All prices exclude VAT. Minimum order: 1 complete system (80 docks + 2000 power banks)."}
])

quotation_data.append([""])

# 8. SIGNATURE - Simple
quotation_data.append([
    {"value": "Accepted by:", "bold": True}
])

quotation_data.append([
    {"value": "___________________________"},
    {"value": "", "align": "center"},
    {"value": "", "align": "center"},
    {"value": "", "align": "center"},
    {"value": "Date: ___________________________", "align": "right"}
])

quotation_data.append([
    {"value": "Company: _____________________________"},
    {"value": "", "align": "center"},
    {"value": "", "align": "center"},
    {"value": "", "align": "center"},
    {"value": "Email: ___________________________", "align": "right"}
])

quotation_data.append([""])
quotation_data.append([
    {"value": "Thank you for your business!", "align": "center"}
])

# Generate the Excel file
result = create_excel_file(
    filename="Flash360_Quotation_Minimal.xlsx",
    sheet_name="Quotation",
    data=quotation_data
)

print(result)
