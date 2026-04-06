"""Home page — Overview dashboard with KPIs and recent activity."""

import streamlit as st
import pandas as pd
from datetime import datetime

from components.cards import stat_row
from components.charts import pie_chart
from components.badges import status_badge
from components.navigation import page_header
from services.suppliers import load_suppliers
from services.requests import load_jobs
from services.analytics import compute_kpis


def render():
    """Render the Home / Overview page."""
    page_header("🏭 Mission Control", "E-Studio Sourcing Overview")

    jobs = load_jobs()
    suppliers = load_suppliers()
    kpis = compute_kpis(jobs, suppliers)

    # KPI row
    stat_row([
        {"label": "Total Requests", "value": kpis["total_requests"], "icon": "📋",
         "color": "#3B82F6"},
        {"label": "Active", "value": kpis["active"], "icon": "🔄",
         "color": "#F59E0B"},
        {"label": "Completed", "value": kpis["completed"], "icon": "✅",
         "color": "#10B981"},
        {"label": "Suppliers", "value": kpis["total_suppliers"], "icon": "🏭",
         "color": "#8B5CF6"},
        {"label": "Avg Quality", "value": f"{kpis['avg_quality']}/5.0", "icon": "⭐",
         "color": "#F59E0B"},
    ])

    # Two-column layout: recent requests + status distribution
    col_left, col_right = st.columns([2, 1])

    with col_left:
        st.subheader("📋 Recent Requests")
        if jobs:
            recent = sorted(jobs, key=lambda j: j.get("date", ""), reverse=True)[:10]
            for job in recent:
                name = job.get("project_name", job.get("project", "Untitled"))
                status = job.get("status", "draft")
                customer = job.get("customer", "")
                date = job.get("date", "")
                with st.container():
                    cols = st.columns([3, 1, 2, 2])
                    cols[0].markdown(f"**{name}**")
                    cols[1].markdown(f"{customer}")
                    cols[2].markdown(f"`{date}`")
                    with cols[3]:
                        status_badge(status)
        else:
            st.info("No requests yet. Go to **📝 New Request** to create one.")

    with col_right:
        st.subheader("📊 Status Distribution")
        status_counts = {}
        for j in jobs:
            s = j.get("status", "draft")
            status_counts[s] = status_counts.get(s, 0) + 1
        if status_counts:
            pie_chart(
                labels=[s.replace("_", " ").title() for s in status_counts.keys()],
                values=list(status_counts.values()),
            )

    # Quick actions
    st.divider()
    st.subheader("⚡ Quick Actions")
    col_a, col_b, col_c = st.columns(3)
    with col_a:
        if st.button("📝 New Request", use_container_width=True, type="primary"):
            st.session_state["current_page"] = "📝 New Request"
            st.rerun()
    with col_b:
        if st.button("🏭 View Suppliers", use_container_width=True):
            st.session_state["current_page"] = "🏭 Suppliers"
            st.rerun()
    with col_c:
        if st.button("📊 Analytics", use_container_width=True):
            st.session_state["current_page"] = "📊 Analytics"
            st.rerun()
