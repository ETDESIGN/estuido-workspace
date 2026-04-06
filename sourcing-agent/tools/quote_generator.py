#!/usr/bin/env python3
"""
Quote Generator for Sourcing Agent
Turns supplier pricing data into professional customer quotes and invoice drafts.
Integrates with quote-invoice-workbench skill.
"""

import json
import csv
import os
from datetime import datetime, timedelta
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

BASE_DIR = Path(__file__).parent
SKILL_DIR = Path.home() / ".openclaw/workspace/skills/quote-invoice-workbench"
PRICEBOOK = SKILL_DIR / "resources/pricebook.csv"
OUTPUT_DIR = BASE_DIR / ".." / "drafts" / "quotes"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def load_pricebook():
    """Load the default pricebook from the Quote Maker skill."""
    rows = []
    with open(PRICEBOOK, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


def load_suppliers(supplier_file=None):
    """Load supplier data from the sourcing workspace."""
    if supplier_file is None:
        supplier_file = BASE_DIR / ".." / "suppliers" / "supplier_list.json"
    
    path = Path(supplier_file)
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def generate_quote(customer_name, line_items, currency="USD", tax_pct=0, discount_pct=0,
                   deposit_pct=30, payment_terms="30% deposit, 70% before shipment",
                   valid_days=30, supplier_name=None, notes=None):
    """
    Generate a professional quote from line items.
    
    Args:
        customer_name: Client/company name
        line_items: List of dicts with 'item', 'qty', 'rate', 'unit' keys
        currency: Currency code
        tax_pct: Tax percentage
        discount_pct: Discount percentage  
        deposit_pct: Required deposit percentage
        payment_terms: Payment terms string
        valid_days: Quote validity in days
        supplier_name: Supplier reference (optional)
        notes: Additional notes
    
    Returns:
        dict with quote data and file path
    """
    subtotal = Decimal("0")
    for item in line_items:
        qty = Decimal(str(item.get("qty", 1)))
        rate = Decimal(str(item.get("rate", 0)))
        line_total = qty * rate
        item["line_total"] = float(line_total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))
        subtotal += line_total
    
    subtotal = subtotal.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    discount = (subtotal * Decimal(str(discount_pct)) / 100).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    after_discount = (subtotal - discount).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    tax = (after_discount * Decimal(str(tax_pct)) / 100).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    total = (after_discount + tax).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    deposit = (total * Decimal(str(deposit_pct)) / 100).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    balance = (total - deposit).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    
    quote_number = f"SQ-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    valid_until = (datetime.now() + timedelta(days=valid_days)).strftime("%Y-%m-%d")
    
    quote = {
        "quote_number": quote_number,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "valid_until": valid_until,
        "customer": customer_name,
        "supplier_reference": supplier_name,
        "currency": currency,
        "line_items": line_items,
        "subtotal": float(subtotal),
        "discount_pct": discount_pct,
        "discount_amount": float(discount),
        "tax_pct": tax_pct,
        "tax_amount": float(tax),
        "total": float(total),
        "deposit_pct": deposit_pct,
        "deposit_amount": float(deposit),
        "balance_due": float(balance),
        "payment_terms": payment_terms,
        "notes": notes or "",
        "status": "draft"
    }
    
    out_path = OUTPUT_DIR / f"{quote_number}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(quote, f, ensure_ascii=False, indent=2)
    
    quote["file_path"] = str(out_path)
    return quote


def quote_to_markdown(quote):
    """Convert a quote dict to a formatted markdown document."""
    lines = []
    lines.append(f"# QUOTE {quote['quote_number']}")
    lines.append("")
    lines.append(f"**Date:** {quote['date']}  ")
    lines.append(f"**Valid Until:** {quote['valid_until']}  ")
    lines.append(f"**Customer:** {quote['customer']}  ")
    if quote.get("supplier_reference"):
        lines.append(f"**Supplier Ref:** {quote['supplier_reference']}  ")
    lines.append(f"**Currency:** {quote['currency']}")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Line Items")
    lines.append("")
    lines.append("| # | Item | Qty | Unit | Rate | Total |")
    lines.append("|---|------|-----|------|------|-------|")
    for i, item in enumerate(quote["line_items"], 1):
        lines.append(f"| {i} | {item['item']} | {item.get('qty', 1)} | {item.get('unit', 'pcs')} | {quote['currency']} {item['rate']:.2f} | {quote['currency']} {item['line_total']:.2f} |")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append(f"| | | |")
    lines.append(f"|---|---|---|")
    lines.append(f"| **Subtotal** | | {quote['currency']} **{quote['subtotal']:.2f}** |")
    if quote['discount_pct'] > 0:
        lines.append(f"| Discount ({quote['discount_pct']}%) | | -{quote['currency']} {quote['discount_amount']:.2f} |")
    if quote['tax_pct'] > 0:
        lines.append(f"| Tax ({quote['tax_pct']}%) | | {quote['currency']} {quote['tax_amount']:.2f} |")
    lines.append(f"| **TOTAL** | | {quote['currency']} **{quote['total']:.2f}** |")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Payment Terms")
    lines.append(f"- {quote['payment_terms']}")
    lines.append(f"- Deposit: **{quote['currency']} {quote['deposit_amount']:.2f}** ({quote['deposit_pct']}%)")
    lines.append(f"- Balance due: **{quote['currency']} {quote['balance_due']:.2f}**")
    lines.append("")
    if quote.get("notes"):
        lines.append("## Notes")
        lines.append(quote["notes"])
        lines.append("")
    lines.append("---")
    lines.append(f"*Quote generated by Sourcing Agent • {datetime.now().strftime('%Y-%m-%d %H:%M')}*")
    
    return "\n".join(lines)


def generate_quote_from_supplier(customer_name, supplier_data, markup_pct=30, 
                                  quantity=None, currency="USD", **kwargs):
    """
    Generate a customer quote from supplier pricing with markup.
    
    Args:
        customer_name: End customer name
        supplier_data: Dict with supplier info and pricing (moq, sample_cost, unit_price)
        markup_pct: Markup percentage on supplier prices
        quantity: Override quantity (default: supplier MOQ)
        currency: Currency
        **kwargs: Passed to generate_quote()
    """
    moq = quantity or supplier_data.get("pricing", {}).get("moq", 100)
    unit_cost = supplier_data.get("pricing", {}).get("unit_price", 
                supplier_data.get("pricing", {}).get("sample_cost", 0))
    
    # Calculate customer price with markup
    customer_rate = float(unit_cost * (1 + markup_pct / 100))
    supplier_name = supplier_data.get("name", supplier_data.get("company", "Unknown Supplier"))
    
    line_items = [{
        "item": f"{supplier_data.get('product', 'Custom Product')} (via {supplier_name})",
        "qty": moq,
        "rate": round(customer_rate, 2),
        "unit": "pcs"
    }]
    
    # Add sample cost if available
    sample_cost = supplier_data.get("pricing", {}).get("sample_cost")
    if sample_cost:
        line_items.append({
            "item": f"Sample (via {supplier_name})",
            "qty": 1,
            "rate": float(sample_cost * (1 + markup_pct / 100)),
            "unit": "lot"
        })
    
    return generate_quote(
        customer_name=customer_name,
        line_items=line_items,
        currency=currency,
        supplier_name=supplier_name,
        **kwargs
    )


if __name__ == "__main__":
    # Demo: generate a sample quote
    demo_supplier = {
        "name": "Shenzhen Best Mfg Co.",
        "product": "CNC Aluminum Housing",
        "pricing": {"moq": 200, "sample_cost": 150, "unit_price": 12.50}
    }
    
    quote = generate_quote_from_supplier(
        customer_name="Osky Industries",
        supplier_data=demo_supplier,
        markup_pct=35,
        notes="Includes tooling amortization over 200 units. Lead time: 15 business days."
    )
    
    md = quote_to_markdown(quote)
    print(md)
    
    # Save markdown
    md_path = OUTPUT_DIR / f"{quote['quote_number']}.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md)
    print(f"\n✅ Quote saved to: {md_path}")
