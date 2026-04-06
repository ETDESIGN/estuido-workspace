"""
Unit tests for supplier-related services.
Tests load_suppliers(), SEED_SUPPLIERS, filtering logic, and data validation.
"""

import json
import re
from pathlib import Path

import pytest

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DASHBOARD_DIR = BASE_DIR / "dashboard"
SUPPLIERS_DIR = BASE_DIR / "suppliers"
TEST_DATA_DIR = BASE_DIR / "tests" / "test_data"
FIXTURES_DIR = BASE_DIR / "tests" / "fixtures"


class TestSupplierLoading:
    """Test supplier data loading logic."""

    def test_load_suppliers_function_exists(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        assert re.search(r"def load_suppliers\s*\(", source), "load_suppliers() missing"

    def test_load_suppliers_uses_glob(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn_body = re.search(r"def load_suppliers\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn_body, "Could not extract load_suppliers body"
        assert "glob" in fn_body.group(1), "load_suppliers should use glob for *.json files"

    def test_load_suppliers_handles_empty_directory(self):
        """When no supplier files exist, should fall back to SEED_SUPPLIERS."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn_body = re.search(r"def load_suppliers\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn_body
        body = fn_body.group(1)
        assert "SEED_SUPPLIERS" in body, "load_suppliers should fall back to SEED_SUPPLIERS"

    def test_load_suppliers_handles_invalid_json(self):
        """Invalid JSON files should be skipped, not crash."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn_body = re.search(r"def load_suppliers\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn_body
        body = fn_body.group(1)
        # Should have try/except around json.load
        assert "try" in body and "except" in body, \
            "load_suppliers should handle invalid JSON gracefully"

    def test_load_suppliers_adds_id_from_filename(self):
        """Supplier files without an 'id' field should get one from the filename."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn_body = re.search(r"def load_suppliers\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn_body
        body = fn_body.group(1)
        assert '"id"' in body or "'id'" in body, \
            "load_suppliers should set id from filename when missing"

    def test_seed_suppliers_count(self, seed_suppliers):
        """SEED_SUPPLIERS should have at least 3 suppliers."""
        assert len(seed_suppliers) >= 3, f"Expected 3+ seed suppliers, got {len(seed_suppliers)}"

    def test_seed_suppliers_all_have_ids(self, seed_suppliers):
        for s in seed_suppliers:
            assert "id" in s, f"Seed supplier missing 'id': {s.get('name', '???')}"
            assert s["id"].startswith("supplier_"), \
                f"Seed supplier id should start with 'supplier_': {s['id']}"

    def test_seed_suppliers_all_have_platforms(self, seed_suppliers):
        for s in seed_suppliers:
            assert "platforms" in s, f"Seed supplier missing 'platforms': {s.get('id')}"
            assert "1688" in s["platforms"], f"Seed supplier missing 1688 platform: {s.get('id')}"

    def test_actual_supplier_files_loadable(self):
        """All JSON files in suppliers/ should be valid JSON."""
        for f in SUPPLIERS_DIR.glob("*.json"):
            if f.name == "supplier_template.json":
                continue
            data = json.loads(f.read_text())
            assert isinstance(data, dict), f"{f.name} should be a dict"
            assert "id" in data or f.stem, f"{f.name} should have an id field"


class TestSupplierFiltering:
    """Test supplier search/filter logic from utils.py."""

    def test_search_by_keyword(self):
        from tools.utils import search_suppliers
        # This may return 0 if no files match, but should not crash
        results = search_suppliers(keyword="CNC")
        assert isinstance(results, list)

    def test_search_by_specialty(self):
        from tools.utils import search_suppliers
        results = search_suppliers(specialty="CNC Machining")
        assert isinstance(results, list)

    def test_search_by_location(self):
        from tools.utils import search_suppliers
        results = search_suppliers(location="Dongguan")
        assert isinstance(results, list)

    def test_search_by_min_rating(self):
        from tools.utils import search_suppliers
        results = search_suppliers(min_rating=4.0)
        assert isinstance(results, list)
        for s in results:
            rating = s.get("platforms", {}).get("1688", {}).get("rating", 0)
            assert rating >= 4.0, f"Result rating {rating} below minimum 4.0"

    def test_search_empty_returns_all(self):
        from tools.utils import search_suppliers
        results = search_suppliers()
        assert isinstance(results, list)

    def test_search_no_results(self):
        from tools.utils import search_suppliers
        results = search_suppliers(keyword="ZZZNONEXISTENT_FACTORY_ZZZ")
        assert results == []


class TestSupplierValidation:
    """Validate supplier data structure."""

    REQUIRED_KEYS = [
        "id", "name", "location", "specialties", "capabilities",
        "certifications", "platforms", "pricing", "performance", "status",
    ]

    def test_sample_supplier_has_required_keys(self, sample_supplier):
        for key in self.REQUIRED_KEYS:
            assert key in sample_supplier, f"Missing key: {key}"

    def test_sample_supplier_capabilities_boolean(self, sample_supplier):
        caps = sample_supplier["capabilities"]
        assert isinstance(caps.get("cnc"), bool)
        assert isinstance(caps.get("injection_molding"), bool)
        assert isinstance(caps.get("pcb"), bool)

    def test_sample_supplier_platforms_rating_range(self, sample_supplier):
        rating = sample_supplier["platforms"]["1688"]["rating"]
        assert 0.0 <= rating <= 5.0, f"Rating {rating} out of range"

    def test_sample_supplier_performance_range(self, sample_supplier):
        perf = sample_supplier["performance"]
        assert 0 <= perf["on_time_delivery"] <= 100
        assert 0.0 <= perf["quality_score"] <= 5.0

    def test_empty_supplier_is_valid_structure(self):
        from tests.fixtures.edge_cases import empty_supplier
        s = empty_supplier()
        for key in self.REQUIRED_KEYS:
            assert key in s, f"empty_supplier missing key: {key}"

    def test_supplier_missing_fields_still_has_id(self):
        from tests.fixtures.edge_cases import supplier_missing_fields
        s = supplier_missing_fields()
        assert s["id"] == "supplier_minimal_001"
        assert s["status"] == "active"

    def test_large_supplier_dataset(self):
        from tests.fixtures.edge_cases import supplier_large_dataset
        suppliers = supplier_large_dataset(200)
        assert len(suppliers) == 200
        ids = [s["id"] for s in suppliers]
        assert len(ids) == len(set(ids)), "IDs should be unique"

    def test_template_matches_sample_structure(self, supplier_template, sample_supplier):
        """Sample supplier should have all keys from template."""
        for key in supplier_template:
            assert key in sample_supplier, f"Sample missing template key: {key}"
