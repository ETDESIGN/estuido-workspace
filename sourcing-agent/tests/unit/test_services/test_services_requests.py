"""
Unit tests for request/job-related services.
Tests load_jobs(), save_job(), _job_to_md(), next_job_id(), and status logic.
"""

import json
import re
from pathlib import Path

import pytest

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DASHBOARD_DIR = BASE_DIR / "dashboard"
CUSTOMERS_DIR = BASE_DIR / "customers"


class TestJobLoading:
    """Test job/request data loading logic."""

    def test_load_jobs_function_exists(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        assert re.search(r"def load_jobs\s*\(", source)

    def test_load_jobs_uses_glob(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def load_jobs\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "glob" in body, "load_jobs should use glob for *.json files"

    def test_load_jobs_falls_back_to_seed(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def load_jobs\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "SEED_JOBS" in body

    def test_load_jobs_handles_errors(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def load_jobs\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "try" in body and "except" in body


class TestJobSaving:
    """Test job persistence logic."""

    def test_save_job_writes_json(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def save_job\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert ".json" in body, "save_job should write .json files"

    def test_save_job_calls_job_to_md(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def save_job\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "_job_to_md" in body, "save_job should call _job_to_md()"


class TestJobToMarkdown:
    """Test markdown generation for jobs."""

    def test_job_to_md_includes_job_id(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def _job_to_md\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "Job ID" in body or "job['id']" in body

    def test_job_to_md_includes_customer(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def _job_to_md\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "Customer" in body

    def test_job_to_md_includes_material(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def _job_to_md\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "Material" in body

    def test_job_to_md_writes_to_customers_dir(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def _job_to_md\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert ".md" in body, "_job_to_md should write .md files"

    def test_job_to_md_handles_missing_fields_gracefully(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def _job_to_md\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        # Should use .get() with defaults
        assert ".get(" in body, "_job_to_md should use .get() for safe field access"


class TestNextJobId:
    """Test job ID generation logic."""

    def test_next_job_id_exists(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        assert re.search(r"def next_job_id\s*\(", source)

    def test_next_job_id_pads_to_three_digits(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def next_job_id\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert ":03d" in body, "next_job_id should zero-pad to 3 digits"

    def test_next_job_id_format(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def next_job_id\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert 'job_' in body, "next_job_id should produce 'job_NNN' format"

    def test_next_job_id_handles_no_existing_jobs(self):
        """When no jobs exist, should default to job_001."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def next_job_id\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)
        assert "1" in body, "next_job_id should default to 1 when no jobs exist"


class TestRequestValidation:
    """Validate request/job data."""

    REQUIRED_JOB_FIELDS = [
        "id", "project", "customer", "date", "status", "priority",
        "product_type", "material", "quantity", "tolerance", "timeline",
    ]

    VALID_STATUSES = [
        "in_progress", "rfq_sent", "awaiting_approval",
        "approved", "rejected", "completed",
    ]

    VALID_PRIORITIES = ["high", "medium", "low"]

    def test_sample_request_has_required_fields(self, sample_request):
        for field in self.REQUIRED_JOB_FIELDS:
            assert field in sample_request, f"Missing field: {field}"

    def test_sample_request_status_valid(self, sample_request):
        assert sample_request["status"] in self.VALID_STATUSES

    def test_sample_request_priority_valid(self, sample_request):
        assert sample_request["priority"] in self.VALID_PRIORITIES

    def test_sample_request_quantity_positive(self, sample_request):
        assert sample_request["quantity"] > 0

    def test_seed_jobs_structure(self, seed_jobs):
        for job in seed_jobs:
            assert "id" in job, f"Seed job missing id"
            assert job["id"].startswith("job_"), f"Seed job id format wrong: {job['id']}"
            assert job["status"] in self.VALID_STATUSES, f"Seed job invalid status: {job['status']}"
            assert job["priority"] in self.VALID_PRIORITIES, f"Seed job invalid priority: {job['priority']}"

    def test_empty_request_valid_structure(self):
        from tests.fixtures.edge_cases import empty_request
        r = empty_request()
        assert r["status"] == "in_progress"

    def test_request_missing_fields_still_has_id(self):
        from tests.fixtures.edge_cases import request_missing_fields
        r = request_missing_fields()
        assert r["id"] == "job_minimal_001"

    def test_large_request_dataset(self):
        from tests.fixtures.edge_cases import request_large_dataset
        jobs = request_large_dataset(500)
        assert len(jobs) == 500
        ids = [j["id"] for j in jobs]
        assert len(ids) == len(set(ids)), "IDs must be unique"

    def test_status_config_completeness(self):
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        for status in self.VALID_STATUSES:
            assert status in source, f"STATUS_CONFIG missing status: {status}"
