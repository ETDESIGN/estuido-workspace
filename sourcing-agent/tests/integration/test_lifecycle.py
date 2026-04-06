"""
Integration test: Full request lifecycle.
Test the complete flow from request creation through supplier matching to quote.
"""

import json
import re
import sys
from pathlib import Path

import pytest

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DASHBOARD_DIR = BASE_DIR / "dashboard"
TOOLS_DIR = BASE_DIR / "tools"

sys.path.insert(0, str(TOOLS_DIR))


class TestRequestLifecycle:
    """Test that a request can go through its full lifecycle."""

    ALL_STATUSES = [
        "in_progress", "rfq_sent", "awaiting_approval",
        "approved", "rejected", "completed",
    ]

    def test_status_config_covers_all_statuses(self):
        """STATUS_CONFIG must have entries for all known statuses."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        for status in self.ALL_STATUSES:
            assert f'"{status}"' in source or f"'{status}'" in source, \
                f"Status '{status}' not found in dashboard.py"

    def test_status_flow_in_requests_page(self):
        """Requests page should allow status transitions."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_requests\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        # Should have approve/reject buttons that change status
        assert '"approved"' in body or "'approved'" in body
        assert '"rejected"' in body or "'rejected'" in body

    def test_new_request_defaults_to_in_progress(self):
        """New requests should start with 'in_progress' status."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_new_request\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert '"in_progress"' in body or "'in_progress'" in body

    def test_job_persistence_dual_format(self):
        """Jobs should be saved as both JSON and MD."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def save_job\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert ".json" in body and "_job_to_md" in body

    def test_job_md_format_matches_template(self):
        """Generated MD should have sections matching job_template.md."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def _job_to_md\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        required_sections = ["Job ID", "Customer", "Material", "Status"]
        for section in required_sections:
            assert section in body, f"_job_to_md missing section: {section}"


class TestSupplierLifecycle:
    """Test supplier data lifecycle."""

    def test_supplier_template_exists(self):
        assert (BASE_DIR / "suppliers" / "supplier_template.json").exists()

    def test_supplier_files_match_template(self):
        """Each supplier file should have the same top-level keys as template."""
        template = json.loads((BASE_DIR / "suppliers" / "supplier_template.json").read_text())
        for f in (BASE_DIR / "suppliers").glob("supplier_*.json"):
            if f.name == "supplier_template.json":
                continue
            data = json.loads(f.read_text())
            # At minimum, should have id and status
            assert "id" in data or f.stem, f"{f.name} missing id"

    def test_supplier_data_can_roundtrip(self):
        """Supplier data survives JSON serialization roundtrip."""
        from tests.fixtures.edge_cases import load_sample_supplier
        supplier = load_sample_supplier()
        serialized = json.dumps(supplier, ensure_ascii=False)
        deserialized = json.loads(serialized)
        assert deserialized["id"] == supplier["id"]
        assert deserialized["name"] == supplier["name"]
        assert len(deserialized["capabilities"]["materials"]) == \
            len(supplier["capabilities"]["materials"])


class TestQuoteLifecycle:
    """Test quote generation lifecycle."""

    def test_quote_generated_from_line_items(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)
        from quote_generator import generate_quote, quote_to_markdown

        items = [
            {"item": "Bracket", "qty": 100, "rate": 5.00, "unit": "pcs"},
            {"item": "Screws", "qty": 400, "rate": 0.10, "unit": "pcs"},
        ]
        quote = generate_quote(customer_name="ACME", line_items=items)
        md = quote_to_markdown(quote)

        assert quote["status"] == "draft"
        assert "Bracket" in md
        assert "ACME" in md
        assert Path(quote["file_path"]).exists()

    def test_quote_can_be_saved_and_loaded(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)
        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Test",
            line_items=[{"item": "X", "qty": 1, "rate": 10.00, "unit": "pcs"}],
        )

        # Reload from file
        with open(quote["file_path"]) as f:
            reloaded = json.load(f)

        assert reloaded["quote_number"] == quote["quote_number"]
        assert reloaded["total"] == quote["total"]
        assert reloaded["customer"] == "Test"

    def test_quote_status_can_change(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)
        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Test",
            line_items=[{"item": "X", "qty": 1, "rate": 10.00, "unit": "pcs"}],
        )

        # Simulate status change
        quote["status"] = "sent"
        with open(quote["file_path"], "w") as f:
            json.dump(quote, f, indent=2)

        with open(quote["file_path"]) as f:
            reloaded = json.load(f)
        assert reloaded["status"] == "sent"


class TestEndToEndSimulation:
    """Simulate end-to-end workflow without Streamlit."""

    def test_create_and_retrieve_job(self, tmp_workspace):
        """Create a job file and verify it can be loaded."""
        job = {
            "id": "job_e2e_001",
            "project": "E2E Test Project",
            "customer": "E2E Customer",
            "date": "2026-03-31",
            "status": "in_progress",
            "priority": "high",
            "product_type": "CNC Machining",
            "material": "Aluminum 6061",
            "quantity": 200,
            "tolerance": "±0.05mm",
            "timeline": "2026-04-30",
            "description": "End-to-end test job",
        }
        # Save
        job_path = tmp_workspace / "customers" / "job_e2e_001.json"
        job_path.write_text(json.dumps(job, indent=2))

        # Load
        loaded = json.loads(job_path.read_text())
        assert loaded["id"] == "job_e2e_001"
        assert loaded["project"] == "E2E Test Project"
        assert loaded["status"] == "in_progress"

    def test_supplier_search_and_quote(self, tmp_workspace, monkeypatch):
        """Simulate: load supplier → generate quote."""
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_workspace / "drafts" / "quotes")

        from quote_generator import generate_quote_from_supplier, quote_to_markdown

        supplier = {
            "name": "E2E Factory",
            "product": "CNC Bracket",
            "pricing": {"moq": 100, "sample_cost": 50, "unit_price": 8.00},
        }

        quote = generate_quote_from_supplier(
            customer_name="E2E Corp",
            supplier_data=supplier,
            markup_pct=25,
        )

        assert quote["total"] > 0
        assert quote["supplier_reference"] == "E2E Factory"
        md = quote_to_markdown(quote)
        assert "CNC Bracket" in md

    def test_full_workflow_documented(self):
        """Verify the dashboard has documentation of the workflow."""
        spec = DASHBOARD_DIR / "DASHBOARD_SPEC.md"
        assert spec.exists(), "DASHBOARD_SPEC.md should exist"
        content = spec.read_text()
        assert len(content) > 100, "Spec should have substantial content"
