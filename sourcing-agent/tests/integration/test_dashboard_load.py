"""
Integration test: Dashboard module loads without errors.
Verify that all dashboard components can be imported/parsed.
"""

import re
from pathlib import Path

import pytest

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DASHBOARD_DIR = BASE_DIR / "dashboard"


class TestDashboardLoad:
    """Verify the entire dashboard can load."""

    def test_dashboard_py_compiles(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        compile(source, "dashboard.py", "exec")

    def test_enhancements_py_compiles(self):
        source = (DASHBOARD_DIR / "enhancements.py").read_text()
        compile(source, "enhancements.py", "exec")

    def test_pages_quotes_py_compiles(self):
        source = (DASHBOARD_DIR / "pages_quotes.py").read_text()
        compile(source, "pages_quotes.py", "exec")

    def test_quote_generator_compiles(self):
        source = (BASE_DIR / "tools" / "quote_generator.py").read_text()
        compile(source, "quote_generator.py", "exec")

    def test_utils_compiles(self):
        source = (BASE_DIR / "tools" / "utils.py").read_text()
        compile(source, "utils.py", "exec")

    def test_dashboard_imports_streamlit(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        assert "import streamlit" in source

    def test_dashboard_imports_pandas(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        assert "import pandas" in source

    def test_dashboard_imports_plotly(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        assert "plotly" in source

    def test_pages_quotes_imports_quote_generator(self):
        source = (DASHBOARD_DIR / "pages_quotes.py").read_text()
        assert "quote_generator" in source

    def test_all_page_functions_defined(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        pages = [
            "page_new_request", "page_requests", "page_suppliers",
            "page_analytics", "page_supplier_comparison", "main",
        ]
        for page in pages:
            assert re.search(rf"def {page}\s*\(", source), f"Missing: {page}()"

    def test_main_routes_all_pages(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        main = re.search(r"def main\(.*?\):(.*?)(?=\nif __name__|$)", source, re.DOTALL)
        assert main
        body = main.group(1)
        expected = ["New Request", "Requests", "Suppliers", "Quotes", "Analytics", "Compare"]
        for ref in expected:
            assert ref in body, f"main() missing route to: {ref}"
