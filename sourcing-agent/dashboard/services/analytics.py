"""Analytics service — KPI calculations and supplier scoring."""

from typing import Optional


def compute_kpis(jobs: list, suppliers: list) -> dict:
    """Compute dashboard KPI metrics.

    Args:
        jobs: List of job dicts
        suppliers: List of supplier dicts

    Returns:
        Dict with KPI values
    """
    total_requests = len(jobs)
    total_suppliers = len(suppliers)
    active = sum(1 for j in jobs if j.get("status") in (
        "in_progress", "rfq_sent", "awaiting_approval", "negotiating"))
    completed = sum(1 for j in jobs if j.get("status") in ("approved", "completed", "delivered"))

    # Average supplier quality score
    quality_scores = [s.get("performance", {}).get("quality_score", 0) for s in suppliers]
    avg_quality = round(sum(quality_scores) / len(quality_scores), 1) if quality_scores else 0

    # Average on-time delivery
    otd_scores = [s.get("performance", {}).get("on_time_delivery", 0) for s in suppliers]
    avg_otd = round(sum(otd_scores) / len(otd_scores), 1) if otd_scores else 0

    return {
        "total_requests": total_requests,
        "total_suppliers": total_suppliers,
        "active": active,
        "completed": completed,
        "avg_quality": avg_quality,
        "avg_on_time_delivery": avg_otd,
        "completion_rate": round(completed / total_requests * 100, 1) if total_requests > 0 else 0,
    }


def compute_supplier_scores(suppliers: list) -> list:
    """Compute a composite score for each supplier.

    Args:
        suppliers: List of supplier dicts

    Returns:
        List of dicts with added 'composite_score' key, sorted descending
    """
    scored = []
    for s in suppliers:
        perf = s.get("performance", {})
        q = perf.get("quality_score", 0) / 5.0 * 40  # 40% weight
        o = perf.get("on_time_delivery", 0) / 100 * 30  # 30% weight
        resp = 5 if perf.get("responsiveness") == "fast" else (
            3 if perf.get("responsiveness") == "medium" else 1)  # 30% weight
        cert_bonus = min(len(s.get("certifications", [])) * 2, 10)

        composite = round(q + o + resp + cert_bonus, 1)
        scored.append({**s, "composite_score": composite})

    return sorted(scored, key=lambda x: x.get("composite_score", 0), reverse=True)
