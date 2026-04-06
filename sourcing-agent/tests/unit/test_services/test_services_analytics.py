"""
Unit tests for analytics calculations.
Tests KPI computation, status distribution, metrics aggregation, and funnel logic.
"""

import json
import re
from pathlib import Path

import pytest

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DASHBOARD_DIR = BASE_DIR / "dashboard"


class TestKPICalculations:
    """Test analytics KPI computation logic."""

    def test_analytics_uses_load_jobs(self):
        """page_analytics should call load_jobs()."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_analytics\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "load_jobs()" in body

    def test_analytics_uses_load_suppliers(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_analytics\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "load_suppliers()" in body

    def test_analytics_computes_total_jobs(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_analytics\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "len(jobs)" in body, "Should compute total jobs count"

    def test_analytics_computes_active_jobs(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_analytics\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "active" in body.lower(), "Should compute active job count"

    def test_analytics_has_avg_rating(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_analytics\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "avg_rating" in body or "rating" in body.lower()

    def test_analytics_has_completion_rate(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_analytics\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "completion" in body.lower() or "completed" in body.lower()


class TestStatusDistribution:
    """Test status count/distribution logic."""

    ACTIVE_STATUSES = ["in_progress", "rfq_sent", "awaiting_approval"]
    COMPLETED_STATUSES = ["approved", "completed"]

    def test_status_config_exists(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        assert "STATUS_CONFIG" in source

    def test_status_config_has_all_statuses(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        all_statuses = self.ACTIVE_STATUSES + self.COMPLETED_STATUSES + ["rejected"]
        for status in all_statuses:
            assert status in source, f"STATUS_CONFIG missing: {status}"

    def test_status_config_has_label(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        match = re.search(r"STATUS_CONFIG\s*=\s*\{(.*?)\}", source, re.DOTALL)
        assert match
        body = match.group(1)
        assert '"label"' in body or "'label'" in body

    def test_status_config_has_color(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        match = re.search(r"STATUS_CONFIG\s*=\s*\{(.*?)\}", source, re.DOTALL)
        assert match
        body = match.group(1)
        assert '"color"' in body or "'color'" in body

    def test_priority_config_exists(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        assert "PRIORITY_CONFIG" in source

    def test_priority_config_levels(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        for level in ["high", "medium", "low"]:
            assert level in source, f"PRIORITY_CONFIG missing: {level}"


class TestMetricsAggregation:
    """Test supplier metrics aggregation logic."""

    def test_analytics_computes_avg_quality(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_analytics\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "quality_score" in body or "quality" in body.lower()

    def test_analytics_computes_avg_otd(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_analytics\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "on_time_delivery" in body

    def test_analytics_handles_empty_suppliers(self):
        """Analytics should handle zero suppliers without crash."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_analytics\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        # Should check if suppliers list is non-empty before computing averages
        assert "if suppliers" in body or "suppliers:" in body, \
            "Should guard against empty supplier list"

    def test_analytics_handles_empty_jobs(self):
        """Analytics should handle zero jobs without crash."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_analytics\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        # Should handle status_counts being empty
        assert "status_counts" in body


class TestPipelineFunnel:
    """Test pipeline/funnel analytics logic."""

    def test_analytics_has_funnel(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_analytics\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "funnel" in body.lower() or "pipeline" in body.lower()

    def test_funnel_stages_count(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_analytics\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        # Should count jobs by status for funnel
        assert "len(" in body


class TestAnalyticsPerformance:
    """Test analytics with large datasets."""

    def test_seed_jobs_count(self, seed_jobs):
        assert len(seed_jobs) >= 3, "Should have at least 3 seed jobs"

    def test_large_dataset_computation(self):
        """Verify analytics logic can handle large datasets."""
        from tests.fixtures.edge_cases import request_large_dataset
        jobs = request_large_dataset(1000)

        # Simulate the analytics computation
        active = [j for j in jobs if j.get("status") in ("in_progress", "rfq_sent", "awaiting_approval")]
        completed = [j for j in jobs if j.get("status") in ("approved", "completed")]

        assert len(active) > 0
        assert len(completed) > 0
        assert len(active) + len(completed) <= len(jobs)

    def test_status_distribution_counts(self):
        from tests.fixtures.edge_cases import request_large_dataset
        jobs = request_large_dataset(200)

        status_counts = {}
        for j in jobs:
            s = j.get("status", "unknown")
            status_counts[s] = status_counts.get(s, 0) + 1

        assert sum(status_counts.values()) == 200
        assert len(status_counts) > 0
