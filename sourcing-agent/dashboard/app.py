# v0.3.2
"""
Sourcing Agent Dashboard — Entry Point
v0.3.2 — Added authentication gate (C5 FIX)

Usage:
    streamlit run app.py
    
Environment Variables:
    DASHBOARD_PASSWORD  — Required in production. Password to access the dashboard.
"""

import streamlit as st
from datetime import datetime

# C5 FIX: Auth gate
from auth import render_login_gate, logout

# Local imports
from config import Theme
from state import init_state, get_state
from services.suppliers import load_suppliers
from services.requests import load_jobs


def main():
    """Main entry point — sets up page config, sidebar, and routes to pages."""
    st.set_page_config(
        page_title="E-Studio Sourcing — Mission Control",
        page_icon="🏭",
        layout="wide",
        initial_sidebar_state="expanded",
    )

    # C5 FIX: Check authentication FIRST, before anything else
    if not render_login_gate():
        return

    # Inject design system CSS
    st.markdown(Theme.css(), unsafe_allow_html=True)

    # Initialize shared session state
    init_state()

    # ─── Sidebar ──────────────────────────────────────────────────────
    _render_sidebar()

    # ─── Page Routing ─────────────────────────────────────────────────
    page = get_state("current_page", "📋 Requests")

    if "New Request" in page:
        from pages.new_request import render as page_new_request

        page_new_request()
    elif "Requests" in page:
        from pages.requests import render as page_requests

        page_requests()
    elif "Suppliers" in page:
        from pages.suppliers import render as page_suppliers

        page_suppliers()
    elif "Quotes" in page:
        from pages.quotes import render as page_quotes

        page_quotes()
    elif "Analytics" in page:
        from pages.analytics import render as page_analytics

        page_analytics()
    elif "Compare" in page:
        from pages.compare import render as page_compare

        page_compare()
    elif "Home" in page:
        from pages.home import render as page_home

        page_home()
    else:
        from pages.home import render as page_home

        page_home()


def _render_sidebar():
    """Render the sidebar navigation and quick stats."""
    with st.sidebar:
        st.markdown("## 🏭 Mission Control")
        st.caption("E-Studio Sourcing Agent v0.3.2")
        st.divider()

        # Navigation
        page = st.radio(
            "Navigation",
            [
                "🏠 Home",
                "📝 New Request",
                "📋 Requests",
                "🏭 Suppliers",
                "🧰 Quotes",
                "📊 Analytics",
                "🔍 Compare",
            ],
            label_visibility="collapsed",
            key="current_page",
        )

        st.divider()
        st.caption(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M')}")

        # Quick stats
        jobs = load_jobs()
        suppliers = load_suppliers()
        active = len(
            [
                j
                for j in jobs
                if j.get("status") in ("in_progress", "rfq_sent", "awaiting_approval")
            ]
        )
        completed = len(
            [j for j in jobs if j.get("status") in ("approved", "completed")]
        )

        st.divider()
        col_s1, col_s2 = st.columns(2)
        with col_s1:
            st.metric("📋 Requests", len(jobs))
            st.metric("🏭 Suppliers", len(suppliers))
        with col_s2:
            st.metric("🔄 Active", active)
            st.metric("✅ Done", completed)

        st.divider()

        # C5 FIX: Logout button
        if st.button("🚪 Logout", use_container_width=True):
            logout()

        st.divider()

        # Export section
        st.subheader("📥 Export Data")
        if st.button("Export Suppliers CSV", use_container_width=True):
            import pandas as pd

            df_exp = pd.DataFrame(suppliers)
            csv = df_exp.to_csv(index=False)
            st.download_button(
                "Download",
                data=csv,
                file_name=f"suppliers-{datetime.now().strftime('%Y%m%d')}.csv",
                mime="text/csv",
            )
        if st.button("Export Requests CSV", use_container_width=True):
            import pandas as pd

            df_exp = pd.DataFrame(jobs)
            csv = df_exp.to_csv(index=False)
            st.download_button(
                "Download",
                data=csv,
                file_name=f"requests-{datetime.now().strftime('%Y%m%d')}.csv",
                mime="text/csv",
            )


if __name__ == "__main__":
    main()
