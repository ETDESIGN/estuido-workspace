"""Supplier data service — CRUD operations for supplier records."""

import json
from pathlib import Path
from typing import Optional

BASE_DIR = Path.home() / ".openclaw" / "workspace" / "sourcing-agent"
SUPPLIERS_DIR = BASE_DIR / "suppliers"


def load_suppliers() -> list:
    """Load all suppliers from JSON files in the suppliers directory.

    Returns:
        List of supplier dicts.
    """
    suppliers = []
    if not SUPPLIERS_DIR.exists():
        return suppliers
    for f in sorted(SUPPLIERS_DIR.glob("supplier_*.json")):
        try:
            with open(f, "r", encoding="utf-8") as fh:
                suppliers.append(json.load(fh))
        except (json.JSONDecodeError, IOError):
            continue
    return suppliers


def get_supplier(supplier_id: str) -> Optional[dict]:
    """Get a single supplier by ID.

    Args:
        supplier_id: The supplier's 'id' field

    Returns:
        Supplier dict or None if not found.
    """
    for s in load_suppliers():
        if s.get("id") == supplier_id:
            return s
    return None


def save_supplier(supplier: dict) -> Path:
    """Save a supplier to a JSON file.

    Args:
        supplier: Supplier dict with an 'id' field.

    Returns:
        Path to the saved file.
    """
    SUPPLIERS_DIR.mkdir(parents=True, exist_ok=True)
    sid = supplier.get("id", "unknown")
    filepath = SUPPLIERS_DIR / f"{sid}.json"
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(supplier, f, indent=2, ensure_ascii=False)
    return filepath
