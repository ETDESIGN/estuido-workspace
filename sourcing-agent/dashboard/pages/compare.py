"""Compare page — supplier comparison matrix."""

import streamlit as st
import pandas as pd

from components.navigation import page_header, breadcrumb
from components.charts import radar_chart
from components.badges import status_badge
from services.suppliers import load_suppliers
from services.analytics import compute_supplier_scores


def render():
    """Render the Supplier Comparison page."""
    page_header("🔍 Supplier Comparison Matrix", "Compare suppliers side by side")
    breadcrumb([("Home", None), ("Compare", None)])

    suppliers = load_suppliers()
    scored = compute_supplier_scores(suppliers)

    if not scored:
        st.info("No suppliers to compare.")
        return

    # Supplier selector (multi-select)
    names = [s.get("name", f"Supplier {i+1}") for i, s in enumerate(scored)]
    selected = st.multiselect(
        "Select suppliers to compare (max 5)",
        names,
        default=names[:min(3, len(names))],
        key="compare_select",
    )

    if not selected:
        st.warning("Select at least one supplier to compare.")
        return

    selected_suppliers = [s for s in scored if s.get("name") in selected][:5]

    # Comparison table
    st.subheader("📊 Side-by-Side Comparison")
    rows = []
    for s in selected_suppliers:
        perf = s.get("performance", {})
        rows.append({
            "Supplier": s.get("name", ""),
            "City": s.get("location", {}).get("city", ""),
            "Specialties": ", ".join(s.get("specialties", [])[:3]),
            "Quality": perf.get("quality_score", 0),
            "On-Time %": perf.get("on_time_delivery", 0),
            "Responsiveness": perf.get("responsiveness", "N/A"),
            "MOQ": s.get("pricing", {}).get("moq", "N/A"),
            "Score": s.get("composite_score", 0),
        })
    df = pd.DataFrame(rows)
    st.dataframe(df, use_container_width=True, hide_index=True)

    # Radar chart if 2+ selected
    if len(selected_suppliers) >= 2:
        st.subheader("🕸️ Capability Radar")
        categories = ["Quality", "On-Time", "Responsiveness", "Certifications"]
        for s in selected_suppliers:
            perf = s.get("performance", {})
            vals = [
                perf.get("quality_score", 0) / 5.0 * 100,
                perf.get("on_time_delivery", 0),
                5 if perf.get("responsiveness") == "fast" else (
                    3 if perf.get("responsiveness") == "medium" else 1) * 20,
                min(len(s.get("certifications", [])) * 20, 100),
            ]
            radar_chart(categories, vals,
                       title=s.get("name", "Supplier"),
                       name=s.get("name", ""))
