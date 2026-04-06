"""Analytics page — charts and KPI metrics."""

import streamlit as st
import pandas as pd
from collections import Counter

from components.navigation import page_header, breadcrumb
from components.cards import stat_row
from components.charts import bar_chart, line_chart, pie_chart
from services.suppliers import load_suppliers
from services.requests import load_jobs
from services.analytics import compute_kpis, compute_supplier_scores


def render():
    """Render the Analytics page."""
    page_header("📊 Analytics Dashboard", "Sourcing metrics and insights")
    breadcrumb([("Home", None), ("Analytics", None)])

    jobs = load_jobs()
    suppliers = load_suppliers()
    kpis = compute_kpis(jobs, suppliers)

    # KPI cards
    stat_row([
        {"label": "Total Requests", "value": kpis["total_requests"], "icon": "📋"},
        {"label": "Completion Rate", "value": f"{kpis['completion_rate']}%", "icon": "📈",
         "color": "#10B981" if kpis["completion_rate"] > 50 else "#F59E0B"},
        {"label": "Avg Quality", "value": f"{kpis['avg_quality']}/5.0", "icon": "⭐"},
        {"label": "Avg On-Time", "value": f"{kpis['avg_on_time_delivery']}%", "icon": "⏱️"},
    ])

    st.divider()

    col_left, col_right = st.columns(2)

    with col_left:
        # Status distribution
        st.subheader("📋 Request Status")
        status_counts = Counter(j.get("status", "draft") for j in jobs)
        if status_counts:
            df_status = pd.DataFrame([
                {"Status": k.replace("_", " ").title(), "Count": v}
                for k, v in status_counts.items()
            ])
            bar_chart(df_status, x="Status", y="Count", title="")

    with col_right:
        # Supplier specialty distribution
        st.subheader("🏭 Supplier Capabilities")
        spec_counts = Counter(
            s for sup in suppliers for s in sup.get("specialties", []))
        if spec_counts:
            df_spec = pd.DataFrame([
                {"Specialty": k, "Count": v}
                for k, v in spec_counts.most_common(10)
            ])
            bar_chart(df_spec, x="Specialty", y="Count", title="",
                     color="#8B5CF6")

    # Supplier rankings
    st.divider()
    st.subheader("🏆 Top Suppliers")
    scored = compute_supplier_scores(suppliers)
    if scored:
        rows = []
        for s in scored[:10]:
            rows.append({
                "Rank": scored.index(s) + 1,
                "Supplier": s.get("name", ""),
                "Quality": f"{s.get('performance', {}).get('quality_score', 0)}/5.0",
                "On-Time": f"{s.get('performance', {}).get('on_time_delivery', 0)}%",
                "Composite": s.get("composite_score", 0),
            })
        st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)
