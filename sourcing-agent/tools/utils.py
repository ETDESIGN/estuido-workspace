"""
Sourcing Agent Utility Functions

Common helper functions used across the sourcing agent tools.
"""

import json
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional


# Paths
PROJECT_DIR = Path.home() / ".openclaw/workspace/sourcing-agent"
SUPPLIERS_DIR = PROJECT_DIR / "suppliers"
CUSTOMERS_DIR = PROJECT_DIR / "customers"
DRAFTS_DIR = PROJECT_DIR / "drafts"
KNOWLEDGE_DIR = PROJECT_DIR / "knowledge"


def load_supplier(supplier_id: str) -> Optional[Dict]:
    """
    Load supplier data from JSON file.
    
    Args:
        supplier_id: Supplier ID (e.g., "supplier_001")
    
    Returns:
        Supplier dictionary or None if not found
    """
    supplier_file = SUPPLIERS_DIR / f"{supplier_id}.json"
    
    if not supplier_file.exists():
        return None
    
    with open(supplier_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_supplier(supplier_data: Dict) -> str:
    """
    Save supplier data to JSON file.
    
    Args:
        supplier_data: Supplier dictionary
    
    Returns:
        Supplier ID
    """
    supplier_id = supplier_data.get('id', f"supplier_{datetime.now().strftime('%Y%m%d%H%M%S')}")
    supplier_file = SUPPLIERS_DIR / f"{supplier_id}.json"
    
    with open(supplier_file, 'w', encoding='utf-8') as f:
        json.dump(supplier_data, f, indent=2, ensure_ascii=False)
    
    return supplier_id


def list_suppliers() -> List[Dict]:
    """
    List all suppliers.
    
    Returns:
        List of supplier dictionaries
    """
    suppliers = []
    
    for supplier_file in SUPPLIERS_DIR.glob("supplier_*.json"):
        with open(supplier_file, 'r', encoding='utf-8') as f:
            suppliers.append(json.load(f))
    
    return suppliers


def search_suppliers(
    keyword: str = "",
    specialty: str = "",
    location: str = "",
    min_rating: float = 0.0
) -> List[Dict]:
    """
    Search suppliers with filters.
    
    Args:
        keyword: Search in name, specialties
        specialty: Filter by specialty
        location: Filter by city
        min_rating: Minimum rating
    
    Returns:
        Filtered list of suppliers
    """
    suppliers = list_suppliers()
    filtered = []
    
    for supplier in suppliers:
        # Keyword search
        if keyword:
            text = f"{supplier.get('name_en', '')} {supplier.get('name_cn', '')} {' '.join(supplier.get('specialties', []))}"
            if keyword.lower() not in text.lower():
                continue
        
        # Specialty filter
        if specialty and specialty not in supplier.get('specialties', []):
            continue
        
        # Location filter
        if location and supplier.get('location', {}).get('city') != location:
            continue
        
        # Rating filter
        rating = supplier.get('platforms', {}).get('1688', {}).get('rating', 0)
        if rating < min_rating:
            continue
        
        filtered.append(supplier)
    
    return filtered


def create_job_id() -> str:
    """Generate unique job ID."""
    return f"job_{datetime.now().strftime('%Y%m%d_%H%M%S')}"


def load_job(job_id: str) -> Optional[str]:
    """
    Load job markdown file.
    
    Args:
        job_id: Job ID
    
    Returns:
        Job content or None if not found
    """
    job_file = CUSTOMERS_DIR / f"{job_id}.md"
    
    if not job_file.exists():
        return None
    
    with open(job_file, 'r', encoding='utf-8') as f:
        return f.read()


def save_job(job_id: str, content: str) -> None:
    """
    Save job markdown file.
    
    Args:
        job_id: Job ID
        content: Markdown content
    """
    job_file = CUSTOMERS_DIR / f"{job_id}.md"
    
    with open(job_file, 'w', encoding='utf-8') as f:
        f.write(content)


def list_jobs() -> List[str]:
    """
    List all job IDs.
    
    Returns:
        List of job IDs
    """
    jobs = []
    
    for job_file in CUSTOMERS_DIR.glob("job_*.md"):
        jobs.append(job_file.stem)
    
    return jobs


def parse_tolerance(tolerance_str: str) -> Dict:
    """
    Parse tolerance string.
    
    Args:
        tolerance_str: e.g., "±0.05mm", "+0.1/-0.05mm"
    
    Returns:
        Dictionary with value, unit, type
    """
    # Match ±0.05mm, +0.1/-0.05mm, etc.
    match = re.search(r'([±+\-0-9.]+)\s*([a-zA-Z]+)', tolerance_str)
    
    if not match:
        return {"raw": tolerance_str}
    
    return {
        "value": match.group(1),
        "unit": match.group(2),
        "raw": tolerance_str
    }


def translate_material(material_en: str) -> str:
    """
    Translate material from English to Chinese.
    
    Args:
        material_en: English material name
    
    Returns:
        Chinese material name
    """
    # Common translations
    translations = {
        "aluminum 6061": "6061铝合金",
        "aluminum 6061-t6": "6061-T6铝合金",
        "aluminum 7075": "7075铝合金",
        "stainless steel 304": "304不锈钢",
        "stainless steel 316": "316不锈钢",
        "abs": "ABS塑料",
        "polycarbonate": "聚碳酸酯",
        "pom": "聚甲醛（POM）"
    }
    
    return translations.get(material_en.lower(), material_en)


def format_currency(amount: float, currency: str = "USD") -> str:
    """
    Format currency amount.
    
    Args:
        amount: Amount
        currency: Currency code
    
    Returns:
        Formatted string
    """
    return f"{currency} ${amount:.2f}"


def calculate_days_between(date1, date2) -> int:
    """
    Calculate days between two dates.
    
    Args:
        date1: First date
        date2: Second date
    
    Returns:
        Number of days
    """
    if isinstance(date1, str):
        date1 = datetime.strptime(date1, "%Y-%m-%d").date()
    if isinstance(date2, str):
        date2 = datetime.strptime(date2, "%Y-%m-%d").date()
    
    return (date2 - date1).days


if __name__ == "__main__":
    # Test utils
    print("Testing utils...")
    
    # Test supplier search
    suppliers = search_suppliers(specialty="CNC", min_rating=4.0)
    print(f"Found {len(suppliers)} CNC suppliers with 4+ rating")
    
    # List jobs
    jobs = list_jobs()
    print(f"Total jobs: {len(jobs)}")
