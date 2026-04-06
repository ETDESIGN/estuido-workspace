"""Edge-case fixture factories for testing."""

import json
from copy import deepcopy
from pathlib import Path

FIXTURES_DIR = Path(__file__).resolve().parent


def load_sample_supplier():
    with open(FIXTURES_DIR / "sample_supplier.json") as f:
        return json.load(f)


def load_sample_request():
    with open(FIXTURES_DIR / "sample_request.json") as f:
        return json.load(f)


def load_sample_quote():
    with open(FIXTURES_DIR / "sample_quote.json") as f:
        return json.load(f)


# ─── Supplier edge cases ────────────────────────────────────────────

def empty_supplier():
    """Minimal valid supplier with all required keys but empty values."""
    return {
        "id": "", "name": "", "name_cn": "", "name_en": "",
        "location": {"city": "", "district": "", "address": ""},
        "specialties": [], "capabilities": {"cnc": False, "injection_molding": False, "pcb": False, "materials": []},
        "certifications": [], "platforms": {"1688": {"rating": 0, "response_rate": 0, "years_active": 0}},
        "contact": {}, "pricing": {"moq": 0, "sample_cost": 0, "currency": "USD"},
        "performance": {"on_time_delivery": 0, "quality_score": 0, "responsiveness": "unknown"},
        "status": "active", "last_updated": "2026-03-31",
    }


def supplier_missing_fields():
    """Supplier with many optional fields removed."""
    return {
        "id": "supplier_minimal_001",
        "name": "Minimal Supplier",
        "status": "active",
    }


def supplier_large_dataset(count=200):
    """Generate N suppliers for performance testing."""
    suppliers = []
    base = load_sample_supplier()
    for i in range(count):
        s = deepcopy(base)
        s["id"] = f"supplier_large_{i:04d}"
        s["name"] = f"Large Supplier #{i}"
        s["name_en"] = f"Large Supplier {i} Ltd."
        s["platforms"]["1688"]["rating"] = round(3.0 + (i % 30) / 10, 1)
        s["performance"]["quality_score"] = round(3.0 + (i % 20) / 10, 1)
        suppliers.append(s)
    return suppliers


# ─── Request/Job edge cases ─────────────────────────────────────────

def empty_request():
    """Minimal valid request."""
    return {
        "id": "", "project": "", "customer": "",
        "date": "", "status": "in_progress", "priority": "medium",
        "product_type": "", "material": "", "quantity": 0,
        "tolerance": "", "timeline": "", "description": "",
    }


def request_missing_fields():
    """Request with only required fields."""
    return {"id": "job_minimal_001", "status": "in_progress"}


def request_large_dataset(count=500):
    """Generate N requests for performance testing."""
    requests = []
    statuses = ["in_progress", "rfq_sent", "awaiting_approval", "approved", "completed", "rejected"]
    priorities = ["high", "medium", "low"]
    types = ["CNC Machining", "Plastic Injection", "PCB/PCBA", "Assembly"]
    for i in range(count):
        r = {
            "id": f"job_large_{i:04d}",
            "project": f"Large Project #{i}",
            "customer": f"Customer {(i % 20)}",
            "date": f"2026-03-{(i % 28) + 1:02d}",
            "status": statuses[i % len(statuses)],
            "priority": priorities[i % len(priorities)],
            "product_type": types[i % len(types)],
            "material": "Aluminum 6061",
            "quantity": 50 + i * 10,
            "tolerance": "±0.05mm",
            "timeline": "2026-04-30",
            "description": f"Large dataset test request #{i}",
        }
        requests.append(r)
    return requests


# ─── Quote edge cases ───────────────────────────────────────────────

def quote_zero_items():
    """Quote with no line items."""
    return {
        "quote_number": "SQ-ZERO",
        "date": "2026-03-31", "valid_until": "2026-04-30",
        "customer": "Test", "currency": "USD",
        "line_items": [], "subtotal": 0.0, "discount_pct": 0, "discount_amount": 0.0,
        "tax_pct": 0, "tax_amount": 0.0, "total": 0.0,
        "deposit_pct": 30, "deposit_amount": 0.0, "balance_due": 0.0,
        "payment_terms": "Net 30", "notes": "", "status": "draft",
    }


def quote_with_discount_and_tax():
    """Quote with non-zero discount and tax."""
    return {
        "quote_number": "SQ-DISCOUNT-TAX",
        "date": "2026-03-31", "valid_until": "2026-04-30",
        "customer": "Test Customer", "currency": "USD",
        "line_items": [
            {"item": "Part A", "qty": 100, "rate": 10.00, "unit": "pcs", "line_total": 1000.00},
            {"item": "Part B", "qty": 50, "rate": 20.00, "unit": "pcs", "line_total": 1000.00},
        ],
        "subtotal": 2000.00, "discount_pct": 10, "discount_amount": 200.0,
        "tax_pct": 8, "tax_amount": 144.0, "total": 1944.0,
        "deposit_pct": 30, "deposit_amount": 583.20, "balance_due": 1360.80,
        "payment_terms": "30% deposit, 70% before shipment", "notes": "Test discount + tax",
        "status": "draft",
    }
