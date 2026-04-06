"""
Schema validation tests for quote data format.
Ensures quotes follow the expected structure and formatting rules.
"""

import json
import sys
from pathlib import Path

import pytest

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DRAFTS_DIR = BASE_DIR / "drafts" / "quotes"
TOOLS_DIR = BASE_DIR / "tools"
FIXTURES_DIR = BASE_DIR / "tests" / "fixtures"

sys.path.insert(0, str(TOOLS_DIR))


QUOTE_REQUIRED_KEYS = [
    "quote_number", "date", "valid_until", "customer",
    "currency", "line_items", "subtotal", "total",
    "deposit_amount", "balance_due", "payment_terms", "status",
]

LINE_ITEM_REQUIRED_KEYS = ["item", "qty", "rate", "unit"]

VALID_QUOTE_STATUSES = ["draft", "sent", "accepted", "rejected", "expired"]
VALID_CURRENCIES = ["USD", "EUR", "CNY", "GBP"]


class TestQuoteFormat:
    """Validate quote structure."""

    def test_sample_quote_has_required_keys(self, sample_quote):
        for key in QUOTE_REQUIRED_KEYS:
            assert key in sample_quote, f"Sample quote missing: {key}"

    def test_sample_quote_line_items_have_required_keys(self, sample_quote):
        for i, item in enumerate(sample_quote["line_items"]):
            for key in LINE_ITEM_REQUIRED_KEYS:
                assert key in item, f"Line item {i} missing: {key}"

    def test_quote_number_format(self, sample_quote):
        assert sample_quote["quote_number"].startswith("SQ-")

    def test_quote_date_format(self, sample_quote):
        assert "-" in sample_quote["date"], "Date should be YYYY-MM-DD"
        assert "-" in sample_quote["valid_until"], "valid_until should be YYYY-MM-DD"

    def test_quote_valid_until_after_date(self, sample_quote):
        assert sample_quote["valid_until"] >= sample_quote["date"]

    def test_quote_subtotal_matches_items(self, sample_quote):
        """Subtotal should equal sum of line item totals."""
        if sample_quote["line_items"]:
            expected = sum(item.get("line_total", item.get("qty", 0) * item.get("rate", 0))
                          for item in sample_quote["line_items"])
            assert abs(sample_quote["subtotal"] - expected) < 0.01, \
                f"Subtotal {sample_quote['subtotal']} != computed {expected}"

    def test_quote_deposit_plus_balance_equals_total(self, sample_quote):
        assert abs(sample_quote["deposit_amount"] + sample_quote["balance_due"] - sample_quote["total"]) < 0.01, \
            "deposit + balance != total"

    def test_quote_total_ge_subtotal_minus_discount(self, sample_quote):
        """Total should be >= subtotal - discount (tax adds back)."""
        net = sample_quote["subtotal"] - sample_quote.get("discount_amount", 0)
        assert sample_quote["total"] >= net * 0.99, "Total seems too low"

    def test_quote_line_totals_match(self, sample_quote):
        """Each line item's total should equal qty * rate."""
        for item in sample_quote["line_items"]:
            if "line_total" in item:
                expected = item["qty"] * item["rate"]
                assert abs(item["line_total"] - expected) < 0.01, \
                    f"Line total {item['line_total']} != {item['qty']} * {item['rate']}"


class TestQuoteFormatGenerated:
    """Test format of programmatically generated quotes."""

    def test_generated_quote_format(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)
        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Format Test",
            line_items=[{"item": "Widget", "qty": 100, "rate": 5.00, "unit": "pcs"}],
            tax_pct=10, discount_pct=5,
        )

        # Full schema check
        for key in QUOTE_REQUIRED_KEYS:
            assert key in quote, f"Generated quote missing: {key}"

        assert quote["quote_number"].startswith("SQ-")
        assert quote["status"] == "draft"
        assert quote["currency"] == "USD"
        assert quote["deposit_amount"] + quote["balance_due"] == pytest.approx(quote["total"], rel=1e-6)

    def test_generated_quote_markdown_format(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)
        from quote_generator import generate_quote, quote_to_markdown

        quote = generate_quote(
            customer_name="MD Test",
            line_items=[{"item": "Part", "qty": 10, "rate": 25.00, "unit": "pcs"}],
        )
        md = quote_to_markdown(quote)

        # Markdown format checks
        assert md.startswith("# QUOTE")
        assert "Part" in md
        assert "250.00" in md
        assert "TOTAL" in md
        assert "Payment Terms" in md

    def test_existing_quote_files_valid(self):
        """Any existing quote files in drafts/quotes/ should be valid."""
        if not DRAFTS_DIR.exists():
            pytest.skip("No drafts/quotes directory")
        for f in DRAFTS_DIR.glob("*.json"):
            data = json.loads(f.read_text())
            assert "quote_number" in data, f"{f.name} missing quote_number"
            assert "line_items" in data, f"{f.name} missing line_items"
            assert isinstance(data["line_items"], list), f"{f.name} line_items not a list"


class TestQuoteEdgeCaseFormats:
    """Test edge case quote formats."""

    def test_zero_value_quote(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)
        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Zero Test",
            line_items=[],
        )
        assert quote["total"] == 0.0
        assert quote["deposit_amount"] == 0.0
        assert quote["balance_due"] == 0.0

    def test_single_cent_values(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)
        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Cent Test",
            line_items=[{"item": "Micro", "qty": 1, "rate": 0.01, "unit": "pcs"}],
        )
        assert quote["total"] == 0.01

    def test_large_quantity(self, tmp_path, monkeypatch):
        monkeypatch.setattr("quote_generator.OUTPUT_DIR", tmp_path)
        from quote_generator import generate_quote

        quote = generate_quote(
            customer_name="Bulk Test",
            line_items=[{"item": "Bulk", "qty": 1000000, "rate": 0.01, "unit": "pcs"}],
        )
        assert quote["total"] == 10000.00
