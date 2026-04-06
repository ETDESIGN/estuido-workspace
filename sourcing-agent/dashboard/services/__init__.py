"""Services package — data access layer."""

from services.suppliers import load_suppliers, save_supplier, get_supplier
from services.requests import load_jobs, save_job, next_job_id
from services.analytics import compute_kpis, compute_supplier_scores

__all__ = [
    "load_suppliers", "save_supplier", "get_supplier",
    "load_jobs", "save_job", "next_job_id",
    "compute_kpis", "compute_supplier_scores",
]
