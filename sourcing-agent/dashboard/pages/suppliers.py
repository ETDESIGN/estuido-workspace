"""Suppliers page — supplier database with search and filters."""

import streamlit as st
import pandas as pd

from components.navigation import page_header, breadcrumb
from components.forms import search_bar, filter_bar
from components.tables import data_table
from services.suppliers import load_suppliers


def render():
    """Render the Suppliers page."""
    page_header("🏭 Supplier Database", "Browse and manage supplier records")
    breadcrumb([("Home", None), ("Suppliers", None)])

    suppliers = load_suppliers()

    # Filters
    col_search, col_spec = st.columns([3, 1])
    with col_search:
        query = search_bar("Search suppliers...", "sup_search")
    with col_spec:
        specialties = ["All"] + sorted(set(
            s for sup in suppliers for s in sup.get("specialties", [])))
        spec_filter = st.selectbox("Specialty", specialties, key="sup_spec")

    # Apply filters
    filtered = suppliers
    if query:
        q = query.lower()
        filtered = [s for s in filtered if
                    q in s.get("name", "").lower() or
                    q in s.get("name_cn", "") or
                    q in s.get("location", {}).get("city", "").lower()]
    if spec_filter != "All":
        filtered = [s for s in filtered if spec_filter in s.get("specialties", [])]

    # Display
    if filtered:
        rows = []
        for s in filtered:
            perf = s.get("performance", {})
            rows.append({
                "Name": s.get("name", ""),
                "City": s.get("location", {}).get("city", ""),
                "Specialties": ", ".join(s.get("specialties", [])[:3]),
                "Quality": f"{perf.get('quality_score', 'N/A')}/5.0",
                "On-Time": f"{perf.get('on_time_delivery', 'N/A')}%",
                "MOQ": s.get("pricing", {}).get("moq", "N/A"),
                "Status": s.get("status", "active"),
            })
        df = pd.DataFrame(rows)
        data_table(df, key="suppliers_table")
    else:
        st.info("No suppliers found matching your filters.")
