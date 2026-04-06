"""Requests page — list and filter all sourcing requests."""

import streamlit as st

from components.navigation import page_header, breadcrumb
from components.forms import search_bar, filter_bar
from components.tables import data_table
from components.badges import status_badge, priority_badge
from services.requests import load_jobs

ALL_STATUSES = ["All", "draft", "in_progress", "rfq_sent", "awaiting_approval",
                "approved", "rejected", "completed"]


def render():
    """Render the Requests page."""
    page_header("📋 All Requests", "View and manage sourcing requests")
    breadcrumb([("Home", None), ("Requests", None)])

    jobs = load_jobs()

    # Filters
    col_search, col_status = st.columns([3, 1])
    with col_search:
        query = search_bar("Search by project or customer...", "req_search")
    with col_status:
        status_filter = st.selectbox("Status", ALL_STATUSES, key="req_status")

    # Apply filters
    filtered = jobs
    if query:
        q = query.lower()
        filtered = [j for j in filtered if
                    q in j.get("project", "").lower() or
                    q in j.get("customer", "").lower() or
                    q in j.get("project_name", "").lower()]
    if status_filter != "All":
        filtered = [j for j in filtered if j.get("status") == status_filter]

    # Display
    if filtered:
        import pandas as pd
        rows = []
        for j in sorted(filtered, key=lambda x: x.get("date", ""), reverse=True):
            rows.append({
                "Job ID": j.get("id", j.get("job_id", "")),
                "Project": j.get("project_name", j.get("project", "")),
                "Customer": j.get("customer", ""),
                "Type": j.get("product_type", ""),
                "Qty": j.get("quantity", ""),
                "Status": j.get("status", "draft"),
                "Priority": j.get("priority", "medium"),
                "Date": j.get("date", ""),
            })
        df = pd.DataFrame(rows)
        data_table(df, key="requests_table")
    else:
        st.info("No requests found matching your filters.")
