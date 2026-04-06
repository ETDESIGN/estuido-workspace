"""New Request page — submit a sourcing request."""

import streamlit as st
import time
from datetime import datetime, timedelta
from pathlib import Path

from components.navigation import page_header
from components.badges import priority_badge
from services.requests import load_jobs, save_job, next_job_id

BASE_DIR = Path.home() / ".openclaw" / "workspace" / "sourcing-agent"
UPLOADS_DIR = BASE_DIR / "dashboard" / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

PRIORITY_CONFIG = {
    "medium": {"label": "🟡 Medium", "color": "#F59E0B"},
    "high": {"label": "🔴 High", "color": "#EF4444"},
    "low": {"label": "🟢 Low", "color": "#10B981"},
}


def render():
    """Render the New Request page."""
    page_header("📝 New Sourcing Request",
                "Submit a new manufacturing sourcing request.")

    with st.form("new_request_form", clear_on_submit=True):
        col1, col2 = st.columns(2)

        with col1:
            st.subheader("📋 Project Info")
            customer = st.text_input("Customer Name", placeholder="e.g., Acme Corp")
            project = st.text_input("Project Name", placeholder="e.g., Aluminum Housing v2")
            description = st.text_area("Description", height=120,
                                      placeholder="Describe what you need manufactured...")
            priority = st.selectbox("Priority", ["medium", "high", "low"],
                                   format_func=lambda x: PRIORITY_CONFIG[x]["label"])

        with col2:
            st.subheader("🔧 Technical Specs")
            product_type = st.selectbox("Product Type",
                                       ["CNC Machining", "Plastic Injection", "PCB/PCBA",
                                        "Assembly", "Other"])
            material = st.text_input("Material", placeholder="e.g., Aluminum 6061-T6, FR4, ABS")
            quantity = st.number_input("Quantity", min_value=1, value=100, step=10)
            tolerance = st.text_input("Tolerance", placeholder="e.g., ±0.05mm")
            timeline = st.date_input("Target Delivery Date",
                                    min_value=datetime.now() + timedelta(days=7))

        st.subheader("📎 Drawing Upload")
        drawing_file = st.file_uploader(
            "Upload technical drawing (PDF, PNG, JPG, STEP)",
            type=["pdf", "png", "jpg", "jpeg", "step", "stp", "dxf"],
            help="Technical drawings help suppliers provide accurate quotes"
        )

        submitted = st.form_submit_button("🚀 Submit Request",
                                         use_container_width=True, type="primary")

        if submitted:
            if not customer or not project:
                st.error("❌ Please fill in Customer Name and Project Name")
                return

            with st.spinner("📡 Submitting to Sourcing Agent..."):
                time.sleep(1.5)

                job_id = next_job_id()
                drawing_name = ""
                if drawing_file:
                    ext = Path(drawing_file.name).suffix
                    safe_name = f"{job_id}{ext}"
                    save_path = UPLOADS_DIR / safe_name
                    with open(save_path, "wb") as f:
                        f.write(drawing_file.getbuffer())
                    drawing_name = safe_name

                job = {
                    "id": job_id,
                    "project": project,
                    "customer": customer,
                    "date": datetime.now().strftime("%Y-%m-%d"),
                    "status": "in_progress",
                    "priority": priority,
                    "product_type": product_type,
                    "material": material,
                    "quantity": quantity,
                    "tolerance": tolerance,
                    "timeline": timeline.strftime("%Y-%m-%d"),
                    "description": description,
                    "drawing_file": drawing_name,
                }
                save_job(job)

            st.success(f"✅ **Request submitted!** Job `{job_id}` created.")
            st.balloons()
