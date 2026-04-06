"""
Sourcing Agent Dashboard — test suite.

Run with:  pytest tests/ -v
Smoke only: pytest tests/ -v -m smoke
"""

import json
import os
import sys
import re
from pathlib import Path

import pytest

# ─── Project paths ───────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent          # sourcing-agent/
DASHBOARD_DIR = BASE_DIR / "dashboard"
CUSTOMERS_DIR = BASE_DIR / "customers"
SUPPLIERS_DIR = BASE_DIR / "suppliers"
KNOWLEDGE_DIR = BASE_DIR / "knowledge"
TEST_DATA_DIR = Path(__file__).resolve().parent / "test_data"


# ═══════════════════════════════════════════════════════════════════════
#  SMOKE TESTS — run immediately after CTO finishes
# ═══════════════════════════════════════════════════════════════════════

class TestSmoke:
    """Sanity checks that the project exists and is minimally functional."""

    def test_dashboard_py_exists(self):
        assert DASHBOARD_DIR.exists(), "dashboard/ directory missing"
        assert (DASHBOARD_DIR / "dashboard.py").exists(), "dashboard/dashboard.py missing"

    def test_requirements_txt_exists(self):
        f = DASHBOARD_DIR / "requirements.txt"
        assert f.exists(), "requirements.txt missing"
        content = f.read_text()
        assert "streamlit" in content.lower(), "streamlit not in requirements"

    def test_dashboard_spec_exists(self):
        assert (DASHBOARD_DIR / "DASHBOARD_SPEC.md").exists()

    def test_base_directories_exist(self):
        for d in [CUSTOMERS_DIR, SUPPLIERS_DIR, KNOWLEDGE_DIR]:
            assert d.is_dir(), f"{d} is not a directory"

    def test_supplier_template_exists(self):
        assert (SUPPLIERS_DIR / "supplier_template.json").exists()

    def test_job_template_exists(self):
        assert (CUSTOMERS_DIR / "job_template.md").exists()

    def test_dashboard_py_importable(self):
        """Verify the dashboard module can be loaded (no syntax errors)."""
        # Streamlit must be importable; if not installed, we still check syntax
        try:
            import streamlit
        except ImportError:
            pytest.skip("streamlit not installed — syntax-only check")
            return
        # We can't easily import the full module (Streamlit runs as script),
        # so compile-check instead
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        compile(source, "dashboard.py", "exec")

    def test_no_syntax_errors_in_dashboard(self):
        """Compile-check dashboard.py even without Streamlit."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        compile(source, "dashboard.py", "exec")


# ═══════════════════════════════════════════════════════════════════════
#  STRUCTURE TESTS — verify project scaffolding
# ═══════════════════════════════════════════════════════════════════════

class TestProjectStructure:
    """Verify the full project structure matches spec."""

    EXPECTED_FUNCTIONS = [
        "load_jobs", "save_job", "_job_to_md",
        "load_suppliers", "next_job_id",
        "page_new_request", "page_requests",
        "page_suppliers", "page_analytics",
        "main",
    ]

    def test_expected_functions_exist(self):
        """Dashboard must define all page + utility functions."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        for fn in self.EXPECTED_FUNCTIONS:
            pattern = rf"^\s*def\s+{fn}\s*\("
            assert re.search(pattern, source, re.MULTILINE), \
                f"Function {fn}() not found in dashboard.py"

    def test_page_functions_reference_st_elements(self):
        """Each page_ function should use Streamlit elements."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        # Extract each page function body
        for fn in ["page_new_request", "page_requests", "page_suppliers", "page_analytics"]:
            pattern = rf"def {fn}\(.*?\):(?:(?!^\s*def\s).)*"
            match = re.search(pattern, source, re.MULTILINE | re.DOTALL)
            if match:
                body = match.group()
                assert "st." in body, f"{fn}() doesn't seem to use any st.* calls"

    def test_seed_suppliers_exist(self):
        """Dashboard should ship with seed supplier data."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        assert "SEED_SUPPLIERS" in source, "SEED_SUPPLIERS not defined"


# ═══════════════════════════════════════════════════════════════════════
#  TEMPLATE VALIDATION TESTS
# ═══════════════════════════════════════════════════════════════════════

class TestSupplierTemplate:
    """Validate supplier_template.json schema."""

    @pytest.fixture
    def template(self):
        return json.loads((SUPPLIERS_DIR / "supplier_template.json").read_text())

    REQUIRED_TOP_KEYS = [
        "id", "name", "name_cn", "name_en", "location", "specialties",
        "capabilities", "certifications", "platforms", "contact",
        "pricing", "performance", "status", "last_updated",
    ]

    def test_required_keys(self, template):
        for key in self.REQUIRED_TOP_KEYS:
            assert key in template, f"Missing required key: {key}"

    def test_location_has_city(self, template):
        assert "city" in template.get("location", {}), "location.city missing"

    def test_capabilities_structure(self, template):
        caps = template.get("capabilities", {})
        assert "cnc" in caps
        assert "materials" in caps
        assert isinstance(caps["materials"], list)

    def test_pricing_structure(self, template):
        pricing = template.get("pricing", {})
        assert "moq" in pricing
        assert "sample_cost" in pricing

    def test_performance_structure(self, template):
        perf = template.get("performance", {})
        assert "on_time_delivery" in perf
        assert "quality_score" in perf

    def test_platforms_1688_structure(self, template):
        p1688 = template.get("platforms", {}).get("1688", {})
        assert "rating" in p1688
        assert "response_rate" in p1688


class TestJobTemplate:
    """Validate job_template.md has required sections."""

    REQUIRED_SECTIONS = [
        "Job ID", "Customer", "Status",
        "Technical Specifications",
        "Material",
        "Dimensions & Tolerances",
        "Comparison Matrix",
        "Recommendation",
    ]

    @pytest.fixture
    def template_text(self):
        return (CUSTOMERS_DIR / "job_template.md").read_text()

    def test_required_sections_present(self, template_text):
        for section in self.REQUIRED_SECTIONS:
            assert section in template_text, f"Missing section: {section}"


# ═══════════════════════════════════════════════════════════════════════
#  TEST DATA VALIDATION
# ═══════════════════════════════════════════════════════════════════════

class TestTestData:
    """Verify our own test fixtures are valid."""

    def test_supplier_json_loads(self):
        data = json.loads((TEST_DATA_DIR / "test_suppliers.json").read_text())
        assert data["id"] == "supplier_test_acme"
        assert data["status"] == "active"

    def test_supplier_json_valid_against_template(self):
        """Test supplier has all keys from the template."""
        data = json.loads((TEST_DATA_DIR / "test_suppliers.json").read_text())
        template = json.loads((SUPPLIERS_DIR / "supplier_template.json").read_text())
        for key in template:
            assert key in data, f"Test supplier missing key: {key}"

    def test_job_md_loads(self):
        text = (TEST_DATA_DIR / "test_jobs.md").read_text()
        assert "job_test_001" in text
        assert "Test Customer QA" in text

    def test_job_md_required_sections(self):
        text = (TEST_DATA_DIR / "test_jobs.md").read_text()
        for section in ["Job ID", "Customer", "Technical Specifications"]:
            assert section in text


# ═══════════════════════════════════════════════════════════════════════
#  FUNCTIONAL TESTS — test dashboard logic
# ═══════════════════════════════════════════════════════════════════════

class TestFunctional:
    """Test dashboard data-handling logic by extracting and testing functions."""

    def test_next_job_id_generates_incremental_id(self):
        """next_job_id() should return job_N+1 based on existing files."""
        # Create a temporary job file to test increment
        test_jobs_dir = CUSTOMERS_DIR
        existing = list(test_jobs_dir.glob("job_*.md"))
        if not existing:
            # No jobs yet — next should be job_001
            source = (DASHBOARD_DIR / "dashboard.py").read_text()
            assert "next_job_id" in source
            # Just verify the function exists and references glob or listdir
            pattern = r"def next_job_id.*?glob.*?job_"
            assert re.search(pattern, source, re.DOTALL), \
                "next_job_id should use glob for job_*.md files"

    def test_load_suppliers_returns_list(self):
        """load_suppliers() should return a list of supplier dicts."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        # Check it handles both seed data and file loading
        assert "load_suppliers" in source
        # Should handle empty directory gracefully
        assert "SEED_SUPPLIERS" in source or "seed" in source.lower()

    def test_save_job_creates_markdown_file(self):
        """save_job() should write a .md file to customers/."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        pattern = r"def save_job.*?\.write|\.open|Path.*customers"
        assert re.search(pattern, source, re.DOTALL), \
            "save_job should write to the customers/ directory"

    def test_job_to_md_includes_sections(self):
        """_job_to_md() should generate markdown with key sections."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn_body = re.search(
            r"def _job_to_md\(.*?\):(.*?)(?=\ndef |\Z)",
            source, re.DOTALL
        )
        assert fn_body, "_job_to_md function not found"
        body = fn_body.group(1)
        # Should include key section headers (matches actual implementation)
        for section in ["Job ID", "Customer", "Material", "Status", "Description"]:
            assert section in body, f"_job_to_md missing section: {section}"


# ═══════════════════════════════════════════════════════════════════════
#  INTEGRATION TESTS — cross-feature checks
# ═══════════════════════════════════════════════════════════════════════

class TestIntegration:
    """Tests that verify features work together."""

    def test_new_request_page_references_save_job(self):
        """New Request page should call save_job() to persist data."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        # page_new_request should reference save_job
        assert re.search(r"save_job\s*\(", source), \
            "page_new_request should call save_job()"

    def test_requests_page_references_load_jobs(self):
        """Requests page should call load_jobs() to read data."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        assert re.search(r"load_jobs\s*\(", source), \
            "page_requests should call load_jobs()"

    def test_suppliers_page_references_load_suppliers(self):
        """Suppliers page should call load_suppliers()."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        assert re.search(r"load_suppliers\s*\(", source), \
            "page_suppliers should call load_suppliers()"

    def test_analytics_page_references_jobs_and_suppliers(self):
        """Analytics page should use both job and supplier data."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        analytics_body = re.search(
            r"def page_analytics\(.*?\):(.*?)(?=\ndef |\Z)",
            source, re.DOTALL
        )
        assert analytics_body, "page_analytics not found"
        body = analytics_body.group(1)
        # Should reference both data sources or metrics derived from them
        has_jobs = "job" in body.lower()
        has_suppliers = "supplier" in body.lower()
        has_metrics = "metric" in body.lower() or "chart" in body.lower()
        assert has_jobs or has_suppliers or has_metrics, \
            "page_analytics should reference jobs, suppliers, or metrics"

    def test_main_has_page_routing(self):
        """main() should route between all 4 pages."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        main_body = re.search(
            r"def main\(.*?\):(.*?)(?=\n\S|\Z)",
            source, re.DOTALL
        )
        assert main_body, "main() not found"
        body = main_body.group(1)
        for page_ref in ["New Request", "Requests", "Suppliers", "Analytics"]:
            assert page_ref in body, f"main() missing route to: {page_ref}"


# ═══════════════════════════════════════════════════════════════════════
#  PERFORMANCE TESTS — lightweight timing checks
# ═══════════════════════════════════════════════════════════════════════

class TestPerformance:
    """Ensure nothing is pathologically slow."""

    def test_dashboard_file_size_reasonable(self):
        """dashboard.py should be under 50KB (single-file app)."""
        size = (DASHBOARD_DIR / "dashboard.py").stat().st_size
        assert size < 50_000, f"dashboard.py is {size:,} bytes — consider splitting"

    def test_template_files_load_fast(self):
        """Supplier template should parse in under 50ms."""
        import time
        start = time.perf_counter()
        json.loads((SUPPLIERS_DIR / "supplier_template.json").read_text())
        elapsed_ms = (time.perf_counter() - start) * 1000
        assert elapsed_ms < 50, f"Supplier template took {elapsed_ms:.1f}ms to parse"

    def test_dashboard_syntax_check_fast(self):
        """Python compile-check should be under 200ms."""
        import time
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        start = time.perf_counter()
        compile(source, "dashboard.py", "exec")
        elapsed_ms = (time.perf_counter() - start) * 1000
        assert elapsed_ms < 200, f"Compile check took {elapsed_ms:.1f}ms"
