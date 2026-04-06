"""
Shared pytest fixtures for the sourcing-agent test suite.
"""

import json
import os
import re
import tempfile
from pathlib import Path

import pytest


# ─── Paths ───────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
DASHBOARD_DIR = BASE_DIR / "dashboard"
CUSTOMERS_DIR = BASE_DIR / "customers"
SUPPLIERS_DIR = BASE_DIR / "suppliers"
KNOWLEDGE_DIR = BASE_DIR / "knowledge"
TOOLS_DIR = BASE_DIR / "tools"
TESTS_DIR = Path(__file__).resolve().parent
FIXTURES_DIR = TESTS_DIR / "fixtures"
TEST_DATA_DIR = TESTS_DIR / "test_data"


@pytest.fixture
def base_dir():
    return BASE_DIR


@pytest.fixture
def dashboard_dir():
    return DASHBOARD_DIR


@pytest.fixture
def suppliers_dir():
    return SUPPLIERS_DIR


@pytest.fixture
def customers_dir():
    return CUSTOMERS_DIR


@pytest.fixture
def fixtures_dir():
    return FIXTURES_DIR


@pytest.fixture
def sample_supplier():
    with open(FIXTURES_DIR / "sample_supplier.json") as f:
        return json.load(f)


@pytest.fixture
def sample_request():
    with open(FIXTURES_DIR / "sample_request.json") as f:
        return json.load(f)


@pytest.fixture
def sample_quote():
    with open(FIXTURES_DIR / "sample_quote.json") as f:
        return json.load(f)


@pytest.fixture
def supplier_template():
    with open(SUPPLIERS_DIR / "supplier_template.json") as f:
        return json.load(f)


@pytest.fixture
def seed_suppliers():
    """Parse SEED_SUPPLIERS from dashboard.py source."""
    import ast
    source = DASHBOARD_DIR.joinpath("dashboard.py").read_text()
    tree = ast.parse(source)
    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == "SEED_SUPPLIERS":
                    return ast.literal_eval(node.value)
    pytest.fail("SEED_SUPPLIERS not found in dashboard.py")


@pytest.fixture
def seed_jobs():
    """Parse SEED_JOBS from dashboard.py source."""
    import ast
    source = DASHBOARD_DIR.joinpath("dashboard.py").read_text()
    tree = ast.parse(source)
    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == "SEED_JOBS":
                    return ast.literal_eval(node.value)
    pytest.fail("SEED_JOBS not found in dashboard.py")


@pytest.fixture
def tmp_workspace(tmp_path):
    """Create a temporary workspace with required directories."""
    for d in ["customers", "suppliers", "knowledge", "dashboard/uploads", "drafts/quotes"]:
        (tmp_path / d).mkdir(parents=True, exist_ok=True)
    return tmp_path


@pytest.fixture
def tmp_supplier_file(tmp_workspace):
    """Create a supplier file in a temp workspace, return (path, data)."""
    data = {
        "id": "supplier_tmp_001",
        "name": "Temp Supplier",
        "name_en": "Temp Supplier Ltd.",
        "location": {"city": "Shenzhen", "district": "Baoan"},
        "specialties": ["CNC"],
        "capabilities": {"cnc": True, "injection_molding": False, "pcb": False, "materials": []},
        "certifications": [], "platforms": {"1688": {"rating": 4.0, "response_rate": 90, "years_active": 3}},
        "contact": {}, "pricing": {"moq": 50, "sample_cost": 30, "currency": "USD"},
        "performance": {"on_time_delivery": 85, "quality_score": 4.0, "responsiveness": "medium"},
        "status": "active", "last_updated": "2026-03-31",
    }
    path = tmp_workspace / "suppliers" / "supplier_tmp_001.json"
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False))
    return path, data


@pytest.fixture
def tmp_job_file(tmp_workspace):
    """Create a job JSON file in a temp workspace, return (path, data)."""
    data = {
        "id": "job_tmp_001",
        "project": "Temp Project",
        "customer": "Temp Customer",
        "date": "2026-03-31",
        "status": "in_progress",
        "priority": "high",
        "product_type": "CNC Machining",
        "material": "Aluminum 6061",
        "quantity": 100,
        "tolerance": "±0.05mm",
        "timeline": "2026-04-30",
        "description": "Temporary test job",
    }
    path = tmp_workspace / "customers" / "job_tmp_001.json"
    path.write_text(json.dumps(data, indent=2))
    return path, data


# ─── pytest marks ───────────────────────────────────────────────────
def pytest_configure(config):
    config.addinivalue_line("markers", "smoke: Smoke tests (run after CTO finishes)")
    config.addinivalue_line("markers", "unit: Unit tests")
    config.addinivalue_line("markers", "integration: Integration tests")
    config.addinivalue_line("markers", "slow: Slow tests (may take >1s)")
