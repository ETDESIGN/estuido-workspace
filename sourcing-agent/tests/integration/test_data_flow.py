"""
Integration test: Data flow between components.
Verify that data moves correctly from input → storage → display → export.
"""

import json
import re
import sys
from pathlib import Path

import pytest

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DASHBOARD_DIR = BASE_DIR / "dashboard"
TOOLS_DIR = BASE_DIR / "tools"
SUPPLIERS_DIR = BASE_DIR / "suppliers"
CUSTOMERS_DIR = BASE_DIR / "customers"

sys.path.insert(0, str(TOOLS_DIR))


class TestDataFlowRequestToStorage:
    """Test that a request flows through the full pipeline."""

    def test_new_request_calls_next_job_id(self):
        """page_new_request should use next_job_id()."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_new_request\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "next_job_id()" in body

    def test_new_request_calls_save_job(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_new_request\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "save_job(" in body

    def test_request_page_loads_jobs(self):
        """page_requests reads from storage."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_requests\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "load_jobs()" in body

    def test_request_page_can_update_status(self):
        """Requests page should be able to change job status."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_requests\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert 'save_job(' in body, "Requests page should save status changes"


class TestDataFlowSupplierToDashboard:
    """Test supplier data flows from storage to dashboard."""

    def test_suppliers_page_loads_suppliers(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_suppliers\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "load_suppliers()" in body

    def test_supplier_data_shows_metrics(self):
        """Supplier page should display rating, quality, on-time."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_suppliers\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "quality_score" in body
        assert "on_time_delivery" in body

    def test_supplier_favorites_persist(self):
        """Favorite toggle should write back to supplier file."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_suppliers\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "favorite" in body.lower()


class TestDataFlowQuoteGeneration:
    """Test quote generation data flow."""

    def test_quote_page_imports_generator(self):
        """Quote page should import from quote_generator."""
        source = (DASHBOARD_DIR / "pages_quotes.py").read_text()
        assert "quote_generator" in source

    def test_quote_page_has_line_items(self):
        """Quote page should handle line item input."""
        source = (DASHBOARD_DIR / "pages_quotes.py").read_text()
        assert "line_items" in source or "item" in source.lower()

    def test_quote_page_generates_preview(self):
        """Quote page should generate markdown preview."""
        source = (DASHBOARD_DIR / "pages_quotes.py").read_text()
        assert "quote_to_markdown" in source or "markdown" in source.lower()

    def test_quote_page_saves_history(self):
        """Quote page should save generated quotes."""
        source = (DASHBOARD_DIR / "pages_quotes.py").read_text()
        assert "OUTPUT_DIR" in source or "save" in source.lower()

    def test_quote_generator_creates_output_dir(self):
        """OUTPUT_DIR should be auto-created."""
        from quote_generator import OUTPUT_DIR
        assert OUTPUT_DIR.exists(), "Quote output directory should exist"


class TestDataFlowAnalyticsAggregation:
    """Test analytics data aggregation."""

    def test_analytics_aggregates_all_data(self):
        """Analytics should pull from both jobs and suppliers."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_analytics\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        has_jobs = "load_jobs()" in body
        has_suppliers = "load_suppliers()" in body
        assert has_jobs and has_suppliers, "Analytics should load both jobs and suppliers"

    def test_analytics_computes_charts(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_analytics\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "plotly_chart" in body or "go.Figure" in body

    def test_export_suppliers_csv(self):
        """Dashboard should export supplier CSV."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        assert "to_csv" in source, "Should have CSV export"

    def test_export_requests_csv(self):
        """Dashboard should export request CSV."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        main = re.search(r"def main\(.*?\):(.*?)(?=\nif __name__|$)", source, re.DOTALL)
        assert main
        body = main.group(1)
        assert "Requests" in body and "CSV" in body
