"""
Unit tests for quote generation services.
Tests quote_generator.py functions: generate_quote(), quote_to_markdown(), etc.
"""

import json
import os
import sys
from pathlib import Path
from decimal import Decimal, ROUND_HALF_UP

import pytest

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
TOOLS_DIR = BASE_DIR / "tools"
DRAFTS_DIR = BASE_DIR / "drafts" / "quotes"

# Add tools to path
sys.path.insert(0, str(TOOLS_DIR))


class TestQuoteGeneration:
    """Test the generate_quote() function."""

    def test_generate_quote_basic(self, tmp_path, monkeypatch):
        """Generate a basic quote with one line item."""
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)

        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Test Corp",
            line_items=[{"item": "Part A", "qty": 100, "rate": 10.00, "unit": "pcs"}],
        )

        assert quote["customer"] == "Test Corp"
        assert quote["currency"] == "USD"
        assert quote["subtotal"] == 1000.00
        assert quote["total"] == 1000.00
        assert len(quote["line_items"]) == 1
        assert quote["line_items"][0]["line_total"] == 1000.00

    def test_generate_quote_with_tax(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)

        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Test",
            line_items=[{"item": "X", "qty": 10, "rate": 100.00, "unit": "pcs"}],
            tax_pct=10,
        )
        assert quote["tax_amount"] == 100.00
        assert quote["total"] == 1100.00

    def test_generate_quote_with_discount(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)

        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Test",
            line_items=[{"item": "X", "qty": 10, "rate": 100.00, "unit": "pcs"}],
            discount_pct=20,
        )
        assert quote["discount_amount"] == 200.00
        assert quote["total"] == 800.00

    def test_generate_quote_with_discount_and_tax(self, tmp_path, monkeypatch):
        """Discount is applied before tax."""
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)

        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Test",
            line_items=[{"item": "X", "qty": 10, "rate": 100.00, "unit": "pcs"}],
            discount_pct=10,
            tax_pct=10,
        )
        # subtotal=1000, discount=100, after_discount=900, tax=90, total=990
        assert quote["subtotal"] == 1000.00
        assert quote["discount_amount"] == 100.00
        assert quote["tax_amount"] == 90.00
        assert quote["total"] == 990.00

    def test_generate_quote_deposit_calculation(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)

        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Test",
            line_items=[{"item": "X", "qty": 1, "rate": 1000.00, "unit": "pcs"}],
            deposit_pct=30,
        )
        assert quote["deposit_amount"] == 300.00
        assert quote["balance_due"] == 700.00

    def test_generate_quote_saves_to_file(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)

        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Test",
            line_items=[{"item": "X", "qty": 1, "rate": 10.00, "unit": "pcs"}],
        )
        assert "file_path" in quote
        assert Path(quote["file_path"]).exists()

    def test_generate_quote_number_format(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)

        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Test",
            line_items=[{"item": "X", "qty": 1, "rate": 10.00, "unit": "pcs"}],
        )
        assert quote["quote_number"].startswith("SQ-")
        assert len(quote["quote_number"]) > 3

    def test_generate_quote_valid_until(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)

        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Test",
            line_items=[{"item": "X", "qty": 1, "rate": 10.00, "unit": "pcs"}],
            valid_days=30,
        )
        assert "valid_until" in quote
        assert quote["valid_until"] > quote["date"]

    def test_generate_quote_default_status_draft(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)

        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Test",
            line_items=[{"item": "X", "qty": 1, "rate": 10.00, "unit": "pcs"}],
        )
        assert quote["status"] == "draft"

    def test_generate_quote_multiple_items(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)

        from quote_generator import generate_quote

        items = [
            {"item": "Part A", "qty": 100, "rate": 5.00, "unit": "pcs"},
            {"item": "Part B", "qty": 50, "rate": 20.00, "unit": "pcs"},
            {"item": "Setup Fee", "qty": 1, "rate": 200.00, "unit": "lot"},
        ]
        quote = generate_quote(customer_name="Test", line_items=items)
        # Part A: 100*5=500, Part B: 50*20=1000, Setup: 1*200=200 → 1700
        assert quote["subtotal"] == 1700.00

    def test_generate_quote_rounding(self, tmp_path, monkeypatch):
        """Verify decimal rounding is correct."""
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)

        from quote_generator import generate_quote

        # 3 items × $33.33 = $99.99
        quote = generate_quote(
            customer_name="Test",
            line_items=[{"item": "X", "qty": 3, "rate": 33.33, "unit": "pcs"}],
            tax_pct=7.5,
        )
        # subtotal = 99.99, tax = 99.99 * 0.075 = 7.49925 → 7.50
        assert quote["subtotal"] == 99.99
        assert quote["tax_amount"] == 7.50

    def test_generate_quote_from_supplier(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)

        from quote_generator import generate_quote_from_supplier

        supplier_data = {
            "name": "Test Factory",
            "product": "CNC Bracket",
            "pricing": {"moq": 100, "sample_cost": 50, "unit_price": 10.00},
        }
        quote = generate_quote_from_supplier(
            customer_name="Customer Co.",
            supplier_data=supplier_data,
            markup_pct=30,
        )
        # Product: 10.00 * 1.30 = 13.00 per unit × 100 = 1300.00
        # Sample: 50 * 1.30 = 65.00
        # Subtotal = 1300 + 65 = 1365.00
        assert quote["subtotal"] == 1365.00
        assert quote["supplier_reference"] == "Test Factory"
        # Sample: 50 * 1.30 = 65.00
        assert len(quote["line_items"]) == 2

    def test_generate_quote_zero_items(self, tmp_path, monkeypatch):
        """Quote with no items should have zero totals."""
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)

        from quote_generator import generate_quote

        quote = generate_quote(customer_name="Test", line_items=[])
        assert quote["subtotal"] == 0.0
        assert quote["total"] == 0.0


class TestQuoteToMarkdown:
    """Test the quote_to_markdown() function."""

    def _make_quote(self, tmp_path, monkeypatch, **kwargs):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)
        from quote_generator import generate_quote
        return generate_quote(
            customer_name="Test",
            line_items=[{"item": "Part A", "qty": 10, "rate": 50.00, "unit": "pcs"}],
            **kwargs,
        )

    def test_markdown_has_quote_number(self, tmp_path, monkeypatch):
        quote = self._make_quote(tmp_path, monkeypatch)
        from quote_generator import quote_to_markdown
        md = quote_to_markdown(quote)
        assert quote["quote_number"] in md

    def test_markdown_has_customer_name(self, tmp_path, monkeypatch):
        quote = self._make_quote(tmp_path, monkeypatch)
        from quote_generator import quote_to_markdown
        md = quote_to_markdown(quote)
        assert "Test" in md

    def test_markdown_has_line_items_table(self, tmp_path, monkeypatch):
        quote = self._make_quote(tmp_path, monkeypatch)
        from quote_generator import quote_to_markdown
        md = quote_to_markdown(quote)
        assert "| # |" in md  # Table header
        assert "Part A" in md

    def test_markdown_has_total(self, tmp_path, monkeypatch):
        quote = self._make_quote(tmp_path, monkeypatch)
        from quote_generator import quote_to_markdown
        md = quote_to_markdown(quote)
        assert "TOTAL" in md
        assert "500.00" in md

    def test_markdown_has_payment_terms(self, tmp_path, monkeypatch):
        quote = self._make_quote(tmp_path, monkeypatch)
        from quote_generator import quote_to_markdown
        md = quote_to_markdown(quote)
        assert "Payment Terms" in md

    def test_markdown_with_discount(self, tmp_path, monkeypatch):
        quote = self._make_quote(tmp_path, monkeypatch, discount_pct=10)
        from quote_generator import quote_to_markdown
        md = quote_to_markdown(quote)
        assert "Discount" in md
        assert "50.00" in md  # 10% of 500

    def test_markdown_empty_items(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)
        from quote_generator import generate_quote, quote_to_markdown
        quote = generate_quote(customer_name="Test", line_items=[])
        md = quote_to_markdown(quote)
        assert "QUOTE" in md  # At minimum has header


class TestQuoteEdgeCases:
    """Edge case tests for quote operations."""

    def test_quote_fixture_valid(self, sample_quote):
        for key in ["quote_number", "customer", "line_items", "subtotal", "total",
                     "deposit_amount", "balance_due", "payment_terms", "status"]:
            assert key in sample_quote, f"Sample quote missing: {key}"

    def test_quote_zero_items_fixture(self):
        from tests.fixtures.edge_cases import quote_zero_items
        q = quote_zero_items()
        assert q["subtotal"] == 0.0
        assert q["total"] == 0.0
        assert q["line_items"] == []

    def test_quote_discount_and_tax_fixture(self):
        from tests.fixtures.edge_cases import quote_with_discount_and_tax
        q = quote_with_discount_and_tax()
        assert q["discount_pct"] == 10
        assert q["discount_amount"] == 200.0
        assert q["tax_pct"] == 8
        assert q["tax_amount"] == 144.0
        # subtotal=2000, -discount=1800, +tax(8%)=1944
        assert q["total"] == 1944.0
        assert q["deposit_amount"] + q["balance_due"] == pytest.approx(q["total"], rel=1e-6)
