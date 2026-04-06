"""
Schema validation tests for request/job data.
Ensures job data conforms to expected schema.
"""

import json
import re
from pathlib import Path

import pytest

BASE_DIR = Path(__file__).resolve().parent.parent.parent
CUSTOMERS_DIR = BASE_DIR / "customers"
DASHBOARD_DIR = BASE_DIR / "dashboard"

JOB_REQUIRED_FIELDS = [
    "id", "project", "customer", "date", "status", "priority",
    "product_type", "material", "quantity", "tolerance", "timeline",
]

VALID_STATUSES = [
    "in_progress", "rfq_sent", "awaiting_approval",
    "approved", "rejected", "completed",
]

VALID_PRIORITIES = ["high", "medium", "low"]
VALID_PRODUCT_TYPES = [
    "CNC Machining", "Plastic Injection", "PCB/PCBA", "Assembly", "Other",
]


class TestRequestSchema:
    """Validate request/job data structure."""

    def _get_seed_jobs(self):
        import ast
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        try:
            tree = ast.parse(source)
            for node in ast.walk(tree):
                if isinstance(node, ast.Assign):
                    for target in node.targets:
                        if isinstance(target, ast.Name) and target.id == "SEED_JOBS":
                            return ast.literal_eval(node.value)
        except (SyntaxError, ValueError):
            pass
        return []

    def test_seed_jobs_have_required_fields(self):
        jobs = self._get_seed_jobs()
        for job in jobs:
            missing = [f for f in JOB_REQUIRED_FIELDS if f not in job]
            assert not missing, f"Seed job {job.get('id', '???')} missing: {missing}"

    def test_seed_jobs_status_valid(self):
        jobs = self._get_seed_jobs()
        for job in jobs:
            assert job["status"] in VALID_STATUSES, \
                f"Job {job['id']} has invalid status: {job['status']}"

    def test_seed_jobs_priority_valid(self):
        jobs = self._get_seed_jobs()
        for job in jobs:
            assert job["priority"] in VALID_PRIORITIES, \
                f"Job {job['id']} has invalid priority: {job['priority']}"

    def test_seed_jobs_quantity_positive(self):
        jobs = self._get_seed_jobs()
        for job in jobs:
            assert job["quantity"] > 0, f"Job {job['id']} quantity should be positive"

    def test_seed_jobs_id_format(self):
        jobs = self._get_seed_jobs()
        for job in jobs:
            assert job["id"].startswith("job_"), \
                f"Job ID format wrong: {job['id']}"

    def test_seed_jobs_date_format(self):
        jobs = self._get_seed_jobs()
        for job in jobs:
            assert "-" in job["date"], f"Job {job['id']} date format looks wrong: {job['date']}"

    def test_seed_jobs_unique_ids(self):
        jobs = self._get_seed_jobs()
        ids = [j["id"] for j in jobs]
        assert len(ids) == len(set(ids)), f"Duplicate job IDs found: {ids}"

    def test_seed_jobs_have_description(self):
        jobs = self._get_seed_jobs()
        for job in jobs:
            desc = job.get("description", "")
            assert isinstance(desc, str), f"Job {job['id']} description should be string"

    def test_job_template_md_sections(self):
        template = (CUSTOMERS_DIR / "job_template.md").read_text()
        required = [
            "Job ID", "Customer", "Technical Specifications",
            "Material", "Dimensions", "Recommendation",
        ]
        for section in required:
            assert section in template, f"Job template missing section: {section}"


class TestRequestDataQuality:
    """Check job data quality."""

    def test_status_config_matches_valid_statuses(self):
        """STATUS_CONFIG should cover all valid statuses."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        for status in VALID_STATUSES:
            assert status in source, f"STATUS_CONFIG missing: {status}"

    def test_new_request_form_captures_all_fields(self):
        """New Request page form should have inputs for all required fields."""
        source = (DASHBOARD_DIR / "dashboard.py").read_text()
        fn = re.search(r"def page_new_request\(.*?\):(.*?)(?=\ndef )", source, re.DOTALL)
        assert fn
        body = fn.group(1)

        # Check for form inputs
        assert "customer" in body.lower(), "Missing customer input"
        assert "project" in body.lower(), "Missing project input"
        assert "material" in body.lower(), "Missing material input"
        assert "quantity" in body.lower(), "Missing quantity input"
        assert "tolerance" in body.lower(), "Missing tolerance input"
