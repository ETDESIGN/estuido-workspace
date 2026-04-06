"""Request/job data service — CRUD operations for sourcing requests."""

import json
import re
from pathlib import Path
from typing import Optional

BASE_DIR = Path.home() / ".openclaw" / "workspace" / "sourcing-agent"
CUSTOMERS_DIR = BASE_DIR / "customers"


def load_jobs() -> list:
    """Load all jobs from JSON and Markdown files in the customers directory.

    Returns:
        List of job dicts.
    """
    jobs = []
    if not CUSTOMERS_DIR.exists():
        return jobs
    # Load JSON files
    for f in sorted(CUSTOMERS_DIR.glob("job_*.json")):
        try:
            with open(f, "r", encoding="utf-8") as fh:
                jobs.append(json.load(fh))
        except (json.JSONDecodeError, IOError):
            continue
    # Also parse Markdown job files
    for f in sorted(CUSTOMERS_DIR.glob("job_*.md")):
        json_path = f.with_suffix(".json")
        if json_path.exists():
            continue  # Already loaded from JSON
        try:
            job = _parse_md_job(f)
            if job:
                jobs.append(job)
        except Exception:
            continue
    return jobs


def _parse_md_job(filepath: Path) -> Optional[dict]:
    """Parse a Markdown job file into a dict.

    Args:
        filepath: Path to the .md file

    Returns:
        Job dict or None
    """
    text = filepath.read_text(encoding="utf-8")
    job = {"source_file": str(filepath)}

    # Extract key-value pairs from YAML-like front matter or ## headings
    for match in re.finditer(r"^\*\*(.+?)\*\*\s*[:：]\s*(.+)$", text, re.MULTILINE):
        key = match.group(1).strip().lower().replace(" ", "_")
        val = match.group(2).strip()
        job[key] = val

    job_id = filepath.stem  # e.g. "job_004"
    job["job_id"] = job_id
    job["status"] = job.get("status", "draft")
    job["project_name"] = job.get("project_name", job.get("project", "Untitled"))
    return job


def save_job(job: dict) -> Path:
    """Save a job to a JSON file.

    Args:
        job: Job dict with a 'job_id' field.

    Returns:
        Path to the saved file.
    """
    CUSTOMERS_DIR.mkdir(parents=True, exist_ok=True)
    jid = job.get("job_id", next_job_id())
    filepath = CUSTOMERS_DIR / f"{jid}.json"
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(job, f, indent=2, ensure_ascii=False)
    return filepath


def next_job_id() -> str:
    """Generate the next job ID in sequence.

    Returns:
        String like 'job_005'
    """
    if not CUSTOMERS_DIR.exists():
        return "job_001"
    existing = [f.stem for f in CUSTOMERS_DIR.glob("job_*.json")]
    nums = []
    for name in existing:
        m = re.search(r"(\d+)", name)
        if m:
            nums.append(int(m.group(1)))
    next_num = max(nums) + 1 if nums else 1
    return f"job_{next_num:03d}"
