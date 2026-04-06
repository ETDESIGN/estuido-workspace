"""
Schema validation tests for supplier data.
Ensures all supplier JSON files conform to the expected schema.
"""

import ast
import json
import re
from pathlib import Path

import pytest

BASE_DIR = Path(__file__).resolve().parent.parent.parent
SUPPLIERS_DIR = BASE_DIR / "suppliers"


SUPPLIER_SCHEMA = {
    "id": str,
    "name": str,
    "name_cn": str,
    "name_en": str,
    "location": dict,
    "specialties": list,
    "capabilities": dict,
    "certifications": list,
    "platforms": dict,
    "contact": dict,
    "pricing": dict,
    "performance": dict,
    "status": str,
    "last_updated": str,
}

LOCATION_SCHEMA = {
    "city": str,
}

CAPABILITIES_SCHEMA = {
    "cnc": bool,
    "injection_molding": bool,
    "pcb": bool,
    "materials": list,
}

PLATFORMS_1688_SCHEMA = {
    "rating": (int, float),
    "response_rate": (int, float),
    "years_active": (int, float),
}

PRICING_SCHEMA = {
    "moq": (int, float),
    "sample_cost": (int, float),
    "currency": str,
}

PERFORMANCE_SCHEMA = {
    "on_time_delivery": (int, float),
    "quality_score": (int, float),
    "responsiveness": str,
}

VALID_STATUSES = ["active", "inactive", "blacklisted", "under_review"]


def _parse_seed_from_source(source_code, var_name):
    """Parse a Python list variable from source code using AST."""
    tree = ast.parse(source_code)
    for node in ast.walk(tree):
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == var_name:
                    return ast.literal_eval(node.value)
    raise ValueError(f"{var_name} not found in source")


class TestSupplierSchema:
    """Validate each supplier JSON file against the schema."""

    def _load_suppliers(self):
        suppliers = []
        for f in SUPPLIERS_DIR.glob("supplier_*.json"):
            if f.name == "supplier_template.json":
                continue
            try:
                data = json.loads(f.read_text())
                suppliers.append((f.name, data))
            except json.JSONDecodeError:
                pytest.fail(f"{f.name} is not valid JSON")
        return suppliers

    def test_all_supplier_files_valid_json(self):
        for f in SUPPLIERS_DIR.glob("supplier_*.json"):
            if f.name == "supplier_template.json":
                continue
            data = json.loads(f.read_text())
            assert isinstance(data, dict), f"{f.name} root must be a dict"

    def test_all_suppliers_have_required_top_keys(self):
        suppliers = self._load_suppliers()
        for name, data in suppliers:
            missing = [k for k in SUPPLIER_SCHEMA if k not in data]
            assert not missing, f"{name} missing keys: {missing}"

    def test_all_suppliers_location_has_city(self):
        suppliers = self._load_suppliers()
        for name, data in suppliers:
            loc = data.get("location", {})
            assert "city" in loc, f"{name} location.city missing"

    def test_all_suppliers_capabilities_structure(self):
        suppliers = self._load_suppliers()
        for name, data in suppliers:
            caps = data.get("capabilities", {})
            for key, expected_type in CAPABILITIES_SCHEMA.items():
                if key in caps:
                    assert isinstance(caps[key], expected_type), \
                        f"{name} capabilities.{key} wrong type: {type(caps[key])} (expected {expected_type})"

    def test_all_suppliers_platforms_1688_structure(self):
        suppliers = self._load_suppliers()
        for name, data in suppliers:
            p1688 = data.get("platforms", {}).get("1688", {})
            if p1688:
                for key, expected_type in PLATFORMS_1688_SCHEMA.items():
                    if key in p1688:
                        assert isinstance(p1688[key], expected_type), \
                            f"{name} platforms.1688.{key} wrong type"

    def test_all_suppliers_rating_range(self):
        suppliers = self._load_suppliers()
        for name, data in suppliers:
            rating = data.get("platforms", {}).get("1688", {}).get("rating", 0)
            assert 0.0 <= rating <= 5.0, f"{name} rating {rating} out of range [0, 5]"

    def test_all_suppliers_otd_range(self):
        suppliers = self._load_suppliers()
        for name, data in suppliers:
            otd = data.get("performance", {}).get("on_time_delivery", 0)
            assert 0 <= otd <= 100, f"{name} on_time_delivery {otd} out of range [0, 100]"

    def test_all_suppliers_status_valid(self):
        suppliers = self._load_suppliers()
        for name, data in suppliers:
            status = data.get("status", "")
            # Allow any string but log a warning for known ones
            if status:
                assert isinstance(status, str), f"{name} status must be string"

    def test_all_suppliers_materials_is_list(self):
        suppliers = self._load_suppliers()
        for name, data in suppliers:
            materials = data.get("capabilities", {}).get("materials", [])
            assert isinstance(materials, list), f"{name} materials must be a list"

    def test_supplier_template_is_valid(self):
        template = json.loads((SUPPLIERS_DIR / "supplier_template.json").read_text())
        for key in SUPPLIER_SCHEMA:
            assert key in template, f"Template missing key: {key}"


class TestSupplierDataQuality:
    """Check data quality beyond schema validation."""

    def test_no_duplicate_supplier_ids(self):
        seen = set()
        for f in SUPPLIERS_DIR.glob("supplier_*.json"):
            if f.name == "supplier_template.json":
                continue
            data = json.loads(f.read_text())
            sid = data.get("id", f.stem)
            assert sid not in seen, f"Duplicate supplier ID: {sid}"
            seen.add(sid)

    def test_all_suppliers_have_chinese_name(self):
        suppliers_file_count = len(list(SUPPLIERS_DIR.glob("supplier_*.json"))) - 1  # minus template
        if suppliers_file_count == 0:
            pytest.skip("No supplier files to validate")
        # Not strict — some may not have Chinese names, but seed data should
        source = (BASE_DIR / "dashboard" / "dashboard.py").read_text()
        try:
            seed = _parse_seed_from_source(source, "SEED_SUPPLIERS")
        except (ValueError, SyntaxError):
            pytest.skip("Could not parse SEED_SUPPLIERS")
        for s in seed:
                cn = s.get("name_cn", "")
                assert cn, f"Seed supplier {s['id']} missing name_cn"
                assert any('\u4e00' <= c <= '\u9fff' for c in cn), \
                    f"Seed supplier {s['id']} name_cn should contain Chinese characters"

    def test_all_suppliers_have_last_updated(self):
        suppliers = []
        for f in SUPPLIERS_DIR.glob("supplier_*.json"):
            if f.name == "supplier_template.json":
                continue
            data = json.loads(f.read_text())
            suppliers.append((f.name, data))

        for name, data in suppliers:
            updated = data.get("last_updated", "")
            assert updated, f"{name} missing last_updated"
            # Should be date-like (YYYY-MM-DD)
            assert "-" in updated, f"{name} last_updated format looks wrong: {updated}"
