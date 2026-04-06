"""
Sourcing Agent — Mission Control Dashboard
Streamlit app for managing sourcing requests, suppliers, and analytics.
"""

import json
import os
import sys
import shutil
import glob
import time
import hashlib
import base64
from datetime import datetime, timedelta
from pathlib import Path
from io import BytesIO

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# ─── Paths ───────────────────────────────────────────────────────────
BASE_DIR = Path.home() / ".openclaw" / "workspace" / "sourcing-agent"
CUSTOMERS_DIR = BASE_DIR / "customers"
SUPPLIERS_DIR = BASE_DIR / "suppliers"
UPLOADS_DIR = BASE_DIR / "dashboard" / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

# ─── Seed data ──────────────────────────────────────────────────────
SEED_SUPPLIERS = [
    {
        "id": "supplier_dalang_precision",
        "name": "Dalang Precision Mfg (大朗精密制造)",
        "name_cn": "大朗精密制造有限公司",
        "name_en": "Dalang Precision Manufacturing Co.",
        "location": {"city": "Dongguan", "district": "Dalang"},
        "specialties": ["CNC Machining", "Aluminum", "Steel"],
        "capabilities": {
            "cnc": True, "injection_molding": False, "pcb": False,
            "materials": ["Aluminum 6061", "Aluminum 7075", "Stainless 304", "Stainless 316"],
            "max_part_size": "800mm x 600mm x 500mm", "tolerance": "±0.01mm"
        },
        "certifications": ["ISO 9001:2015", "IATF 16949"],
        "platforms": {"1688": {"response_rate": 97, "rating": 4.7, "years_active": 8}},
        "pricing": {"moq": 50, "sample_cost": 80, "currency": "USD"},
        "performance": {"on_time_delivery": 96, "quality_score": 4.5, "responsiveness": "fast"},
        "status": "active", "favorite": False, "last_updated": "2026-03-27"
    },
    {
        "id": "supplier_humens_circuit",
        "name": "Humen Circuit Tech (虎门电路科技)",
        "name_cn": "虎门电路科技有限公司",
        "name_en": "Humen Circuit Technology Co.",
        "location": {"city": "Dongguan", "district": "Humen"},
        "specialties": ["PCB", "PCBA", "Electronics Assembly"],
        "capabilities": {
            "cnc": False, "injection_molding": False, "pcb": True,
            "materials": ["FR4", "Aluminum PCB", "Flexible PCB", "Rogers"],
            "max_part_size": "600mm x 400mm", "tolerance": "±0.05mm"
        },
        "certifications": ["ISO 9001:2015", "UL", "IPC-A-600 Class 3"],
        "platforms": {"1688": {"response_rate": 92, "rating": 4.4, "years_active": 6}},
        "pricing": {"moq": 100, "sample_cost": 120, "currency": "USD"},
        "performance": {"on_time_delivery": 91, "quality_score": 4.2, "responsiveness": "medium"},
        "status": "active", "favorite": True, "last_updated": "2026-03-26"
    },
    {
        "id": "supplier_changan_plastics",
        "name": "Changan Plastics (长安塑胶)",
        "name_cn": "长安塑胶模具有限公司",
        "name_en": "Changan Plastics & Mold Co.",
        "location": {"city": "Dongguan", "district": "Changan"},
        "specialties": ["Injection Molding", "Plastic", "Silicone"],
        "capabilities": {
            "cnc": False, "injection_molding": True, "pcb": False,
            "materials": ["ABS", "PC", "PP", "Nylon", "POM", "Silicone"],
            "max_part_size": "1000mm x 800mm", "tolerance": "±0.1mm"
        },
        "certifications": ["ISO 9001:2015", "ISO 14001:2015"],
        "platforms": {"1688": {"response_rate": 95, "rating": 4.6, "years_active": 12}},
        "pricing": {"moq": 500, "sample_cost": 200, "currency": "USD"},
        "performance": {"on_time_delivery": 94, "quality_score": 4.4, "responsiveness": "fast"},
        "status": "active", "favorite": False, "last_updated": "2026-03-25"
    },
    {
        "id": "supplier_qingxi_multi",
        "name": "Qingxi Multi-Process (清溪多工艺)",
        "name_cn": "清溪多工艺制造有限公司",
        "name_en": "Qingxi Multi-Process Manufacturing",
        "location": {"city": "Dongguan", "district": "Qingxi"},
        "specialties": ["CNC", "Injection Molding", "Assembly"],
        "capabilities": {
            "cnc": True, "injection_molding": True, "pcb": False,
            "materials": ["Aluminum 6061", "ABS", "PC", "Steel"],
            "max_part_size": "600mm x 400mm x 300mm", "tolerance": "±0.05mm"
        },
        "certifications": ["ISO 9001:2015"],
        "platforms": {"1688": {"response_rate": 88, "rating": 4.1, "years_active": 3}},
        "pricing": {"moq": 200, "sample_cost": 150, "currency": "USD"},
        "performance": {"on_time_delivery": 87, "quality_score": 3.8, "responsiveness": "slow"},
        "status": "active", "favorite": False, "last_updated": "2026-03-24"
    },
    {
        "id": "supplier_guanlan_pcb",
        "name": "Guanlan PCBA Pro (观澜电路)",
        "name_cn": "观澜电路高科技有限公司",
        "name_en": "Guanlan Circuit Hi-Tech Co.",
        "location": {"city": "Shenzhen", "district": "Guanlan"},
        "specialties": ["PCB", "PCBA", "Cable Assembly"],
        "capabilities": {
            "cnc": False, "injection_molding": False, "pcb": True,
            "materials": ["FR4", "HDI", "Flexible PCB", "Ceramic"],
            "max_part_size": "500mm x 500mm", "tolerance": "±0.025mm"
        },
        "certifications": ["ISO 9001:2015", "ISO 13485", "AS9100D"],
        "platforms": {"1688": {"response_rate": 99, "rating": 4.9, "years_active": 15}},
        "pricing": {"moq": 50, "sample_cost": 100, "currency": "USD"},
        "performance": {"on_time_delivery": 98, "quality_score": 4.8, "responsiveness": "fast"},
        "status": "active", "favorite": True, "last_updated": "2026-03-27"
    },
]

SEED_JOBS = [
    {
        "id": "job_001", "project": "Aluminum Housing v2", "customer": "Acme Corp",
        "date": "2026-03-25", "status": "rfq_sent", "priority": "high",
        "product_type": "CNC Machining", "material": "Aluminum 6061-T6",
        "quantity": 500, "tolerance": "±0.05mm", "timeline": "2026-04-15",
        "description": "Custom aluminum housing for IoT device, anodized black"
    },
    {
        "id": "job_002", "project": "PCB Assembly Batch", "customer": "TechStart Inc",
        "date": "2026-03-26", "status": "in_progress", "priority": "medium",
        "product_type": "PCB/PCBA", "material": "FR4 4-layer",
        "quantity": 1000, "tolerance": "±0.1mm", "timeline": "2026-04-20",
        "description": "Main controller board, SMT + through-hole mixed assembly"
    },
    {
        "id": "job_003", "project": "Plastic Enclosure Proto", "customer": "DesignLab",
        "date": "2026-03-27", "status": "awaiting_approval", "priority": "low",
        "product_type": "Plastic Injection", "material": "ABS White",
        "quantity": 50, "tolerance": "±0.2mm", "timeline": "2026-04-30",
        "description": "Snap-fit enclosure for consumer product, needs draft analysis"
    },
]


# ─── File Watcher ────────────────────────────────────────────────────
def _dir_fingerprint(directory: Path) -> str:
    """Return a hash fingerprint of all files in a directory."""
    h = hashlib.md5()
    for f in sorted(directory.rglob("*")):
        if f.is_file():
            h.update(f.name.encode())
            try:
                h.update(str(f.stat().st_mtime).encode())
            except OSError:
                pass
    return h.hexdigest()


def check_data_freshness():
    """Check if supplier or job data changed. Returns (suppliers_changed, jobs_changed)."""
    if "fp_suppliers" not in st.session_state:
        st.session_state["fp_suppliers"] = _dir_fingerprint(SUPPLIERS_DIR)
        st.session_state["fp_jobs"] = _dir_fingerprint(CUSTOMERS_DIR)
        return False, False
    new_sup = _dir_fingerprint(SUPPLIERS_DIR)
    new_job = _dir_fingerprint(CUSTOMERS_DIR)
    sup_changed = new_sup != st.session_state["fp_suppliers"]
    job_changed = new_job != st.session_state["fp_jobs"]
    st.session_state["fp_suppliers"] = new_sup
    st.session_state["fp_jobs"] = new_job
    return sup_changed, job_changed


# ─── PDF Generation ─────────────────────────────────────────────────
def generate_pdf_report(selected_suppliers, jobs):
    """Generate a professional PDF comparison report using WeasyPrint."""
    from weasyprint import HTML

    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    active = [j for j in jobs if j.get("status") in ("in_progress", "rfq_sent", "awaiting_approval")]

    rows = ""
    for s in selected_suppliers:
        n = s.get("name", s.get("name_en", "Unknown"))
        c = s.get("capabilities", {})
        rows += f"<tr><td><b>{n}</b></td><td>{s.get('location',{}).get('city','?')}</td>"
        rows += f"<td>{s.get('platforms',{}).get('1688',{}).get('rating','?')}</td>"
        rows += f"<td>{s.get('performance',{}).get('quality_score','?')}</td>"
        rows += f"<td>{s.get('performance',{}).get('on_time_delivery','?')}%</td>"
        rows += f"<td>{s.get('platforms',{}).get('1688',{}).get('response_rate','?')}%</td>"
        rows += f"<td>{s.get('pricing',{}).get('moq','?')}</td>"
        rows += f"<td>{'✅' if c.get('cnc') else '—'}</td>"
        rows += f"<td>{'✅' if c.get('injection_molding') else '—'}</td>"
        rows += f"<td>{'✅' if c.get('pcb') else '—'}</td></tr>"

    profiles = ""
    for s in selected_suppliers:
        n = s.get("name", s.get("name_en", "Unknown"))
        profiles += f"<h3>{n}</h3><p>{s.get('name_cn','')} | 📍 {s.get('location',{}).get('city','')}, {s.get('location',{}).get('district','')} "
        profiles += f"| 🔧 {', '.join(s.get('specialties',[]))} | 🏅 {', '.join(s.get('certifications',[]))}</p>"
        profiles += f"<p>📦 {', '.join(s.get('capabilities',{}).get('materials',[]))}</p>"
        profiles += f"<p>⏱️ {s.get('platforms',{}).get('1688',{}).get('years_active','?')}yr | 💰 MOQ:{s.get('pricing',{}).get('moq','?')} | Sample:${s.get('pricing',{}).get('sample_cost','?')}</p><hr>"

    job_rows = ""
    for j in (active or jobs[:5]):
        sl = STATUS_CONFIG.get(j.get("status", "in_progress"), {}).get("label", "")
        job_rows += f"<tr><td>{j.get('id','')}</td><td>{j.get('project','')}</td><td>{j.get('customer','')}</td><td>{j.get('product_type','')}</td><td>{j.get('quantity','')}</td><td>{sl}</td></tr>"

    html_body = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{{font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;margin:40px}}
    h1{{color:#1e40af;border-bottom:3px solid #3b82f6;padding-bottom:8px}}
    h2{{color:#334155;margin-top:24px}}h3{{color:#475569}}
    table{{width:100%;border-collapse:collapse;margin:12px 0;font-size:13px}}
    th{{background:#1e40af;color:#fff;padding:8px 12px;text-align:left}}
    td{{border:1px solid #e2e8f0;padding:6px 12px}}
    tr:nth-child(even){{background:#f8fafc}}
    .m{{color:#64748b;font-size:12px;margin-bottom:20px}}
    .sb{{background:#f1f5f9;border-left:4px solid #3b82f6;padding:16px;margin:16px 0}}
    .ft{{margin-top:40px;padding-top:12px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:11px}}
    </style></head><body>
    <h1>🏭 Supplier Comparison Report</h1>
    <p class="m">Generated: {now} | E-Studio Sourcing Agent</p>
    <div class="sb"><b>Summary:</b> {len(selected_suppliers)} suppliers | {len(active)} active request(s) | Mission Control Dashboard</div>
    <h2>📊 Comparison Matrix</h2>
    <table><thead><tr><th>Supplier</th><th>City</th><th>Rating</th><th>Quality</th><th>On-Time</th><th>Response</th><th>MOQ</th><th>CNC</th><th>Inj.</th><th>PCB</th></tr></thead><tbody>{rows}</tbody></table>
    <h2>📋 Profiles</h2>{profiles}
    <h2>📋 Active Requests</h2><table><thead><tr><th>ID</th><th>Project</th><th>Customer</th><th>Type</th><th>Qty</th><th>Status</th></tr></thead><tbody>{job_rows}</tbody></table>
    <div class="ft"><p>E-Studio Sourcing Agent — Confidential</p></div></body></html>"""

    buf = BytesIO()
    HTML(string=html_body).write_pdf(buf)
    buf.seek(0)
    return buf.getvalue()


# ─── Helpers ─────────────────────────────────────────────────────────
def load_jobs():
    """Load all jobs from customer MD files + seed data."""
    jobs = []
    # Load from JSON sidecar files (created by dashboard)
    for f in glob.glob(str(CUSTOMERS_DIR / "*.json")):
        try:
            with open(f) as fh:
                jobs.append(json.load(fh))
        except Exception:
            pass
    # Load seed jobs if no real jobs
    if not jobs:
        jobs = SEED_JOBS.copy()
    return jobs


def save_job(job):
    """Save job as JSON sidecar."""
    path = CUSTOMERS_DIR / f"{job['id']}.json"
    with open(path, "w") as f:
        json.dump(job, f, indent=2, ensure_ascii=False)
    # Also create the MD version
    _job_to_md(job)


def _job_to_md(job):
    path = CUSTOMERS_DIR / f"{job['id']}.md"
    md = f"""# Customer Sourcing Request

**Job ID:** {job['id']}
**Customer:** {job.get('customer', 'N/A')}
**Project:** {job.get('project', 'N/A')}
**Date:** {job.get('date', datetime.now().strftime('%Y-%m-%d'))}
**Status:** {job.get('status', 'in_progress')}
**Priority:** {job.get('priority', 'medium')}

---

## Customer Requirements

**Description:**
{job.get('description', 'N/A')}

**Product Type:** {job.get('product_type', 'N/A')}
**Material:** {job.get('material', 'N/A')}
**Quantity:** {job.get('quantity', 'N/A')}
**Tolerance:** {job.get('tolerance', 'N/A')}
**Timeline:** {job.get('timeline', 'N/A')}

**Drawing:** {job.get('drawing_file', 'Not provided')}

---

*Created by Sourcing Agent Dashboard*
"""
    with open(path, "w") as f:
        f.write(md)


def load_suppliers():
    """Load all suppliers from JSON files + seed data."""
    suppliers = []
    for f in glob.glob(str(SUPPLIERS_DIR / "*.json")):
        try:
            with open(f) as fh:
                data = json.load(fh)
                if "id" not in data:
                    data["id"] = Path(f).stem
                suppliers.append(data)
        except Exception:
            pass
    if not suppliers:
        suppliers = SEED_SUPPLIERS.copy()
    return suppliers


def next_job_id():
    """Generate next job ID."""
    jobs = load_jobs()
    nums = []
    for j in jobs:
        try:
            nums.append(int(j.get("id", "job_0").split("_")[1]))
        except (ValueError, IndexError):
            pass
    n = max(nums) + 1 if nums else 1
    return f"job_{n:03d}"


STATUS_CONFIG = {
    "in_progress": {"label": "🔄 In Progress", "color": "#3B82F6", "bg": "#EFF6FF"},
    "rfq_sent": {"label": "📧 RFQ Sent", "color": "#F59E0B", "bg": "#FFFBEB"},
    "awaiting_approval": {"label": "⏳ Awaiting Approval", "color": "#8B5CF6", "bg": "#F5F3FF"},
    "approved": {"label": "✅ Approved", "color": "#10B981", "bg": "#ECFDF5"},
    "rejected": {"label": "❌ Rejected", "color": "#EF4444", "bg": "#FEF2F2"},
    "completed": {"label": "🏁 Completed", "color": "#10B981", "bg": "#ECFDF5"},
}

PRIORITY_CONFIG = {
    "high": {"label": "🔴 High", "color": "#EF4444"},
    "medium": {"label": "🟡 Medium", "color": "#F59E0B"},
    "low": {"label": "🟢 Low", "color": "#10B981"},
}


# ─── Page Renderers ─────────────────────────────────────────────────
def page_new_request():
    st.header("📝 New Sourcing Request")
    st.markdown("Submit a new manufacturing sourcing request. The AI agent will analyze specs, find matching suppliers, and manage RFQs.")

    with st.form("new_request_form", clear_on_submit=True):
        col1, col2 = st.columns(2)

        with col1:
            st.subheader("📋 Project Info")
            customer = st.text_input("Customer Name", placeholder="e.g., Acme Corp")
            project = st.text_input("Project Name", placeholder="e.g., Aluminum Housing v2")
            description = st.text_area("Description", height=120, placeholder="Describe what you need manufactured...")
            priority = st.selectbox("Priority", ["medium", "high", "low"], format_func=lambda x: PRIORITY_CONFIG[x]["label"])

        with col2:
            st.subheader("🔧 Technical Specs")
            product_type = st.selectbox("Product Type", ["CNC Machining", "Plastic Injection", "PCB/PCBA", "Assembly", "Other"])
            material = st.text_input("Material", placeholder="e.g., Aluminum 6061-T6, FR4, ABS")
            quantity = st.number_input("Quantity", min_value=1, value=100, step=10)
            tolerance = st.text_input("Tolerance", placeholder="e.g., ±0.05mm")
            timeline = st.date_input("Target Delivery Date", min_value=datetime.now() + timedelta(days=7))

        st.subheader("📎 Drawing Upload")
        drawing_file = st.file_uploader(
            "Upload technical drawing (PDF, PNG, JPG, STEP)",
            type=["pdf", "png", "jpg", "jpeg", "step", "stp", "dxf"],
            help="Technical drawings help suppliers provide accurate quotes"
        )

        submitted = st.form_submit_button("🚀 Submit Request", use_container_width=True, type="primary")

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

            st.success(f"✅ **Request submitted!** Job `{job_id}` created. The Sourcing Agent is now analyzing your requirements.")
            st.balloons()


def page_requests():
    st.header("📋 All Requests")

    jobs = load_jobs()
    if not jobs:
        st.info("📭 No requests yet. Submit your first sourcing request!")
        return

    # Filters
    col_search, col_status, col_priority = st.columns([2, 1, 1])
    with col_search:
        search = st.text_input("🔍 Search", placeholder="Search by project, customer, or ID...", label_visibility="collapsed")
    with col_status:
        status_filter = st.selectbox("Status", ["All"] + list(STATUS_CONFIG.keys()), format_func=lambda x: STATUS_CONFIG.get(x, {"label": "All"})["label"])
    with col_priority:
        priority_filter = st.selectbox("Priority", ["All", "high", "medium", "low"], format_func=lambda x: PRIORITY_CONFIG.get(x, {"label": "All"})["label"])

    # Filter
    filtered = jobs
    if search:
        q = search.lower()
        filtered = [j for j in filtered if q in j.get("project", "").lower() or q in j.get("customer", "").lower() or q in j.get("id", "").lower()]
    if status_filter != "All":
        filtered = [j for j in filtered if j.get("status") == status_filter]
    if priority_filter != "All":
        filtered = [j for j in filtered if j.get("priority") == priority_filter]

    st.markdown(f"**{len(filtered)}** request(s) shown")

    # Job cards
    for job in filtered:
        status_cfg = STATUS_CONFIG.get(job.get("status", "in_progress"), STATUS_CONFIG["in_progress"])
        prio_cfg = PRIORITY_CONFIG.get(job.get("priority", "medium"), PRIORITY_CONFIG["medium"])

        with st.container():
            col_badge, col_info, col_actions = st.columns([0.15, 1, 0.5])

            with col_badge:
                st.markdown(
                    f"<div style='background:{status_cfg['bg']};border-left:4px solid {status_cfg['color']};padding:12px;border-radius:8px;margin-bottom:8px;'>"
                    f"<div style='font-size:11px;color:#6B7280;'>{job.get('id','')}</div>"
                    f"<div style='font-weight:700;color:{status_cfg['color']};font-size:13px;'>{prio_cfg['label']}</div>"
                    f"</div>",
                    unsafe_allow_html=True
                )

            with col_info:
                st.markdown(f"**{job.get('project', 'Untitled')}** — *{job.get('customer', 'N/A')}*")
                meta_items = []
                if job.get("product_type"):
                    meta_items.append(f"🔧 {job['product_type']}")
                if job.get("material"):
                    meta_items.append(f"🧱 {job['material']}")
                if job.get("quantity"):
                    meta_items.append(f"📦 Qty: {job['quantity']:,}")
                if job.get("timeline"):
                    meta_items.append(f"📅 {job['timeline']}")
                st.caption("  ·  ".join(meta_items))
                if job.get("description"):
                    st.caption(job["description"][:120] + ("..." if len(job.get("description", "")) > 120 else ""))

            with col_actions:
                status_now = job.get("status", "in_progress")
                if status_now in ("in_progress", "rfq_sent"):
                    if st.button("✅ Approve", key=f"approve_{job['id']}", use_container_width=True):
                        job["status"] = "approved"
                        save_job(job)
                        st.success(f"✅ {job['id']} approved!")
                        st.rerun()
                    if st.button("❌ Reject", key=f"reject_{job['id']}", use_container_width=True):
                        job["status"] = "rejected"
                        save_job(job)
                        st.error(f"❌ {job['id']} rejected")
                        st.rerun()
                elif status_now == "awaiting_approval":
                    if st.button("✅ Approve", key=f"approve_{job['id']}", use_container_width=True):
                        job["status"] = "approved"
                        save_job(job)
                        st.success(f"✅ {job['id']} approved!")
                        st.rerun()

                with st.popover("👁️ Details", key=f"detail_{job['id']}"):
                    st.json(job)

        st.divider()


def page_suppliers():
    st.header("🏭 Supplier Database")

    suppliers = load_suppliers()
    if not suppliers:
        st.info("📭 No suppliers in database yet. The Sourcing Agent will populate this as it discovers factories.")
        return

    # Filters
    col_search, col_specialty, col_rating = st.columns([2, 1, 1])
    with col_search:
        search = st.text_input("🔍 Search suppliers", placeholder="Search by name, specialty, location...", label_visibility="collapsed", key="sup_search")
    with col_specialty:
        all_specs = sorted(set(s for sup in suppliers for s in sup.get("specialties", [])))
        spec_filter = st.selectbox("Specialty", ["All"] + all_specs, key="sup_spec")
    with col_rating:
        rating_filter = st.selectbox("Min Rating", ["All", "4.5+", "4.0+", "3.5+"], key="sup_rating")

    # Filter
    filtered = suppliers
    if search:
        q = search.lower()
        filtered = [s for s in filtered if q in s.get("name", "").lower() or q in s.get("name_en", "").lower() or q in s.get("name_cn", "").lower() or q in s.get("location", {}).get("district", "").lower()]
    if spec_filter != "All":
        filtered = [s for s in filtered if spec_filter in s.get("specialties", [])]
    if rating_filter != "All":
        min_r = float(rating_filter.replace("+", ""))
        filtered = [s for s in filtered if (s.get("platforms", {}).get("1688", {}).get("rating", 0) or s.get("performance", {}).get("quality_score", 0)) >= min_r]

    # Toggle favorites
    show_fav_only = st.toggle("⭐ Favorites Only", value=False, key="sup_fav")
    if show_fav_only:
        filtered = [s for s in filtered if s.get("favorite")]

    st.markdown(f"**{len(filtered)}** supplier(s)")

    # Supplier cards
    for sup in filtered:
        rating = sup.get("platforms", {}).get("1688", {}).get("rating", 0) or sup.get("performance", {}).get("quality_score", 0)
        quality = sup.get("performance", {}).get("quality_score", 0)
        otd = sup.get("performance", {}).get("on_time_delivery", 0)
        # Safe access to nested platforms.1688.response_rate
        platforms = sup.get("platforms", {})
        resp = platforms.get("1688", {}).get("response_rate", 0) if isinstance(platforms, dict) else 0
        district = sup.get("location", {}).get("district", "N/A")
        city = sup.get("location", {}).get("city", "Dongguan")
        fav = sup.get("favorite", False)

        is_fav_str = "⭐" if fav else "☆"

        with st.container():
            header_col, rating_col, fav_col = st.columns([1, 0.4, 0.15])

            with header_col:
                st.markdown(f"**{is_fav_str} {sup.get('name', sup.get('name_en', 'Unknown'))}**")
                loc_str = f"📍 {city}, {district}" if district != "N/A" else f"📍 {city}"
                certs = sup.get("certifications", [])
                cert_str = " · ".join([f"🏅 {c}" for c in certs[:3]])
                st.caption(f"{loc_str}  ·  {cert_str}")

            with rating_col:
                # Rating display
                stars = "⭐" * int(rating) + "☆" * (5 - int(rating))
                st.markdown(f"<div style='text-align:center;'>{stars}<br><small>{rating:.1f}/5.0</small></div>", unsafe_allow_html=True)

            with fav_col:
                if st.button("⭐" if not fav else "💡", key=f"fav_{sup['id']}", help="Toggle favorite"):
                    sup["favorite"] = not fav
                    # Persist
                    sup_path = SUPPLIERS_DIR / f"{sup['id']}.json"
                    if sup_path.exists():
                        with open(sup_path, "w") as f:
                            json.dump(sup, f, indent=2, ensure_ascii=False)
                    st.rerun()

            # Capabilities row
            caps = sup.get("capabilities", {})
            cap_tags = []
            if caps.get("cnc"):
                cap_tags.append("🔧 CNC")
            if caps.get("injection_molding"):
                cap_tags.append("🧊 Injection")
            if caps.get("pcb"):
                cap_tags.append("🔌 PCB")
            if cap_tags:
                st.markdown(" ".join([f"`{t}`" for t in cap_tags]))

            # Metrics
            m1, m2, m3, m4 = st.columns(4)
            m1.metric("Quality", f"{quality:.1f}", help="Quality score")
            m2.metric("On-Time", f"{otd}%", help="On-time delivery rate")
            m3.metric("Response", f"{resp}%", help="Response rate on 1688")
            m4.metric("MOQ", f"{sup.get('pricing', {}).get('moq', 'N/A')}", help="Minimum order quantity")

            with st.popover("📂 Full Dossier", key=f"dossier_{sup['id']}"):
                st.json(sup)

            st.divider()


def page_supplier_comparison():
    """Supplier comparison matrix page"""
    st.header("🔍 Supplier Comparison Matrix")
    st.caption("Compare suppliers side-by-side")

    suppliers = load_suppliers()
    if len(suppliers) < 2:
        st.warning("Need at least 2 suppliers to compare")
        return

    # Multi-select suppliers
    supplier_options = {s["id"]: s.get("name", s.get("name_en", "Unknown")) for s in suppliers}
    selected_ids = st.multiselect(
        "Select suppliers to compare (2-4 recommended)",
        options=list(supplier_options.keys()),
        format_func=lambda x: supplier_options[x],
        default=list(supplier_options.keys())[:3]
    )

    if len(selected_ids) < 2:
        st.info("👆 Select at least 2 suppliers to compare")
        return

    # Get selected suppliers
    selected = [s for s in suppliers if s["id"] in selected_ids]

    # Build comparison table
    st.subheader("📊 Quick Comparison")

    metrics = [
        ("Price", "MOQ", lambda s: s.get("pricing", {}).get("moq", "N/A")),
        ("Quality", "Rating", lambda s: s.get("platforms", {}).get("1688", {}).get("rating", "N/A")),
        ("Quality", "Quality Score", lambda s: s.get("performance", {}).get("quality_score", "N/A")),
        ("Quality", "On-Time %", lambda s: s.get("performance", {}).get("on_time_delivery", "N/A")),
        ("Service", "Response %", lambda s: s.get("platforms", {}).get("1688", {}).get("response_rate", "N/A")),
        ("Location", "City", lambda s: s.get("location", {}).get("city", "N/A")),
        ("Capabilities", "CNC", lambda s: "✅" if s.get("capabilities", {}).get("cnc") else "❌"),
        ("Capabilities", "Injection", lambda s: "✅" if s.get("capabilities", {}).get("injection_molding") else "❌"),
        ("Capabilities", "PCB", lambda s: "✅" if s.get("capabilities", {}).get("pcb") else "❌"),
    ]

    # Create comparison DataFrame
    df_data = {}
    for s in selected:
        name = s.get("name", s.get("name_en", "Unknown"))[:20]
        df_data[name] = [func(s) for _, _, func in metrics]

    df = pd.DataFrame(df_data)
    df.index = [f"{cat} - {metric}" for cat, metric, _ in metrics]
    st.dataframe(df, use_container_width=True)

    # Detailed cards
    st.divider()
    cols = st.columns(len(selected))
    for idx, s in enumerate(selected):
        with cols[idx]:
            st.markdown(f"**{s.get('name', s.get('name_en', 'Unknown'))}**")
            rating = s.get("platforms", {}).get("1688", {}).get("rating", 0)
            st.metric("Rating", f"{rating}/5.0")
            st.caption(f"📍 {s.get('location', {}).get('city', 'N/A')}")
            st.caption(f"💰 MOQ: {s.get('pricing', {}).get('moq', 'N/A')}")
            st.caption(f"⭐ Quality: {s.get('performance', {}).get('quality_score', 'N/A')}")

    # Radar chart for visual comparison
    st.subheader("🎯 Capability Radar")

    # Normalize data for radar
    radar_cats = ["Quality", "On-Time", "Response", "MOQ Score", "Experience"]
    radar_data = []
    for s in selected:
        quality = s.get("performance", {}).get("quality_score", 3)
        otd = s.get("performance", {}).get("on_time_delivery", 80) / 20
        resp = s.get("platforms", {}).get("1688", {}).get("response_rate", 80) / 20
        moq_score = max(0, 5 - (s.get("pricing", {}).get("moq", 100) - 50) / 200)
        exp_score = min(5, s.get("platforms", {}).get("1688", {}).get("years_active", 3) / 3)
        radar_data.append({"Supplier": s.get("name_en", s.get("name", "Unknown"))[:20], "Quality": quality, "On-Time": otd, "Response": resp, "MOQ Score": moq_score, "Experience": exp_score})

    fig_radar = go.Figure()
    colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]
    for i, rd in enumerate(radar_data[:4]):
        fig_radar.add_trace(go.Scatterpolar(
            r=[rd["Quality"], rd["On-Time"], rd["Response"], rd["MOQ Score"], rd["Experience"], rd["Quality"]],
            theta=radar_cats + [radar_cats[0]],
            fill="toself",
            name=rd["Supplier"],
            marker_color=colors[i % len(colors)],
        ))
    fig_radar.update_layout(
        polar=dict(radialaxis=dict(visible=True, range=[0, 5])),
        height=400,
        showlegend=True,
        margin=dict(t=30, b=30, l=30, r=30),
    )
    st.plotly_chart(fig_radar, use_container_width=True)

    # Bar chart: side-by-side score comparison
    st.subheader("📏 Score Comparison")
    score_df = pd.DataFrame(radar_data).set_index("Supplier")
    fig_bar = px.bar(
        score_df, barmode="group",
        color_discrete_sequence=px.colors.qualitative.Set2,
    )
    fig_bar.update_layout(height=350, yaxis_title="Score (0-5)", xaxis_title="")
    st.plotly_chart(fig_bar, use_container_width=True)

    st.divider()

    # Export buttons
    col_csv, col_pdf = st.columns(2)
    with col_csv:
        if st.button("📥 Export to CSV", key="export_compare", use_container_width=True):
            export_data = []
            for s in selected:
                row = {"Supplier": s.get("name", s.get("name_en", "Unknown"))}
                for category, metric, func in metrics:
                    row[f"{category} - {metric}"] = func(s)
                export_data.append(row)
            df_export = pd.DataFrame(export_data)
            csv = df_export.to_csv(index=False)
            st.download_button(
                label="Download CSV",
                data=csv,
                file_name=f"comparison-{datetime.now().strftime('%Y%m%d')}.csv",
                mime="text/csv"
            )

    with col_pdf:
        if st.button("📄 Generate PDF Report", key="export_pdf", use_container_width=True, type="primary"):
            with st.spinner("Generating PDF report..."):
                try:
                    jobs = load_jobs()
                    pdf_bytes = generate_pdf_report(selected, jobs)
                    st.download_button(
                        label="⬇️ Download PDF Report",
                        data=pdf_bytes,
                        file_name=f"supplier-comparison-{datetime.now().strftime('%Y%m%d-%H%M')}.pdf",
                        mime="application/pdf",
                        use_container_width=True,
                    )
                    st.success("✅ PDF report generated successfully!")
                except Exception as e:
                    st.error(f"❌ PDF generation failed: {e}")


def page_analytics():
    st.header("📊 Analytics Dashboard")
    st.caption("Overview of your sourcing operations")

    jobs = load_jobs()
    suppliers = load_suppliers()

    # ── File watcher: auto-refresh banner ──
    sup_changed, job_changed = check_data_freshness()
    if sup_changed or job_changed:
        changed_items = []
        if sup_changed:
            changed_items.append("🏭 Supplier data")
        if job_changed:
            changed_items.append("📋 Job data")
        st.info(f"🔄 Data changed detected: {', '.join(changed_items)}. Page data is now current.")

    # Auto-refresh toggle
    auto_refresh = st.toggle("🔄 Auto-refresh (30s)", value=False, key="analytics_refresh")
    if auto_refresh:
        time.sleep(30)
        st.rerun()

    # ── KPI Cards ──
    total_jobs = len(jobs)
    active_jobs = len([j for j in jobs if j.get("status") in ("in_progress", "rfq_sent", "awaiting_approval")])
    completed_jobs = len([j for j in jobs if j.get("status") in ("approved", "completed")])
    total_suppliers = len(suppliers)
    avg_rating = 0
    avg_quality = 0
    avg_otd = 0
    if suppliers:
        ratings = [s.get("platforms", {}).get("1688", {}).get("rating", 0) or s.get("performance", {}).get("quality_score", 0) for s in suppliers]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0
        qualities = [s.get("performance", {}).get("quality_score", 0) for s in suppliers if s.get("performance", {}).get("quality_score")]
        avg_quality = sum(qualities) / len(qualities) if qualities else 0
        otds = [s.get("performance", {}).get("on_time_delivery", 0) for s in suppliers if s.get("performance", {}).get("on_time_delivery")]
        avg_otd = sum(otds) / len(otds) if otds else 0

    c1, c2, c3, c4, c5 = st.columns(5)
    c1.metric("📋 Total Requests", total_jobs)
    c2.metric("🔄 Active", active_jobs)
    c3.metric("✅ Completed", completed_jobs)
    c4.metric("🏭 Suppliers", total_suppliers)
    c5.metric("⭐ Avg Rating", f"{avg_rating:.1f}")

    # Secondary KPI row
    c6, c7, c8 = st.columns(3)
    c6.metric("🎯 Avg Quality", f"{avg_quality:.1f}/5.0", help="Average supplier quality score")
    c7.metric("🚚 On-Time Delivery", f"{avg_otd:.0f}%", help="Average on-time delivery rate")
    c8.metric("📊 Completion Rate", f"{(completed_jobs/total_jobs*100) if total_jobs else 0:.0f}%", help="Requests approved or completed")

    st.divider()

    col_left, col_right = st.columns(2)

    with col_left:
        st.subheader("📈 Request Status Distribution")
        status_counts = {}
        for j in jobs:
            s = j.get("status", "unknown")
            status_counts[s] = status_counts.get(s, 0) + 1

        if status_counts:
            fig = go.Figure(go.Pie(
                labels=[STATUS_CONFIG.get(k, {"label": k})["label"] for k in status_counts.keys()],
                values=list(status_counts.values()),
                marker=dict(colors=[STATUS_CONFIG.get(k, {"color": "#6B7280"})["color"] for k in status_counts.keys()]),
                hole=0.4,
                textinfo="label+percent",
                textposition="outside",
            ))
            fig.update_layout(height=350, margin=dict(t=20, b=20, l=20, r=20), showlegend=False)
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No data yet")

    with col_right:
        st.subheader("📦 Request Volume by Product Type")
        type_counts = {}
        for j in jobs:
            t = j.get("product_type", "Other")
            type_counts[t] = type_counts.get(t, 0) + 1

        if type_counts:
            fig = px.bar(
                x=list(type_counts.keys()),
                y=list(type_counts.values()),
                color=list(type_counts.values()),
                color_continuous_scale=["#3B82F6", "#8B5CF6"],
                text=list(type_counts.values()),
            )
            fig.update_layout(height=350, xaxis_title="", yaxis_title="Count", coloraxis_showscale=False)
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("No data yet")

    st.divider()

    col_l2, col_r2 = st.columns(2)

    with col_l2:
        st.subheader("🏭 Supplier Quality Scores")
        if suppliers:
            sup_names = [s.get("name_en", s.get("name", "Unknown"))[:25] for s in suppliers]
            quality_scores = [s.get("performance", {}).get("quality_score", 0) for s in suppliers]
            otd_scores = [s.get("performance", {}).get("on_time_delivery", 0) / 20 for s in suppliers]
            fig = go.Figure()
            fig.add_trace(go.Bar(name="Quality", x=sup_names, y=quality_scores, marker_color="#3B82F6"))
            fig.add_trace(go.Bar(name="Delivery (÷20)", x=sup_names, y=otd_scores, marker_color="#10B981"))
            fig.update_layout(barmode="group", height=350, yaxis_title="Score", xaxis_title="", margin=dict(t=20, b=80, l=20, r=20), xaxis_tickangle=-30)
            st.plotly_chart(fig, use_container_width=True)

    with col_r2:
        st.subheader("🔧 Supplier Capabilities Map")
        if suppliers:
            cap_data = {"Supplier": [], "CNC": [], "Injection": [], "PCB": []}
            for s in suppliers:
                cap_data["Supplier"].append(s.get("name_en", s.get("name", "?"))[:20])
                cap_data["CNC"].append(1 if s.get("capabilities", {}).get("cnc") else 0)
                cap_data["Injection"].append(1 if s.get("capabilities", {}).get("injection_molding") else 0)
                cap_data["PCB"].append(1 if s.get("capabilities", {}).get("pcb") else 0)
            df = pd.DataFrame(cap_data)
            for col in ["CNC", "Injection", "PCB"]:
                df[col] = df[col].map({1: "✅", 0: "—"})
            st.dataframe(df, hide_index=True, use_container_width=True)

    # ── NEW: Job Pipeline Funnel + Gauges ──
    st.divider()
    col_funnel, col_gauge = st.columns(2)

    with col_funnel:
        st.subheader("🔽 Job Pipeline Funnel")
        pipeline = {
            "In Progress": len([j for j in jobs if j.get("status") == "in_progress"]),
            "RFQ Sent": len([j for j in jobs if j.get("status") == "rfq_sent"]),
            "Awaiting Approval": len([j for j in jobs if j.get("status") == "awaiting_approval"]),
            "Approved/Completed": len([j for j in jobs if j.get("status") in ("approved", "completed")]),
            "Rejected": len([j for j in jobs if j.get("status") == "rejected"]),
        }
        pipeline = {k: v for k, v in pipeline.items() if v > 0}
        if pipeline:
            fig_funnel = go.Figure(go.Funnel(
                y=list(pipeline.keys()), x=list(pipeline.values()),
                textinfo="label+value+percent initial",
                marker=dict(color=["#3B82F6", "#F59E0B", "#8B5CF6", "#10B981", "#EF4444"]),
            ))
            fig_funnel.update_layout(height=350, margin=dict(t=20, b=20, l=20, r=20))
            st.plotly_chart(fig_funnel, use_container_width=True)
        else:
            st.info("No job data for funnel view")

    with col_gauge:
        st.subheader("📊 Performance Gauges")
        if suppliers:
            fig_gauge = go.Figure()
            for idx, (label, value, color) in enumerate([
                ("Quality", avg_quality, "#3B82F6"), ("On-Time %", avg_otd, "#10B981"), ("Rating", avg_rating, "#F59E0B"),
            ]):
                dv = min(value * 20, 100) if label != "On-Time %" else value
                fig_gauge.add_trace(go.Indicator(
                    mode="gauge+number", value=round(dv, 1),
                    title={"text": label, "font": {"size": 12}},
                    gauge=dict(axis=dict(range=[0, 100], tickwidth=1), bar=dict(color=color), bgcolor="white",
                               borderwidth=2, bordercolor="#e2e8f0",
                               steps=[{"range": [0, 60], "color": "#fef2f2"}, {"range": [60, 80], "color": "#fef9c3"}, {"range": [80, 100], "color": "#dcfce7"}]),
                    domain={"row": idx, "column": 0},
                ))
            fig_gauge.update_layout(grid=dict(rows=3, columns=1, pattern="independent"), height=400, margin=dict(t=20, b=20, l=40, r=40))
            st.plotly_chart(fig_gauge, use_container_width=True)
        else:
            st.info("No supplier data for gauges")

    # ── NEW: Supplier Scatter Plot (Price vs Quality) ──
    st.divider()
    st.subheader("📉 Price vs Quality Scatter")
    if suppliers:
        scatter_data = []
        for s in suppliers:
            quality = s.get("performance", {}).get("quality_score", 0)
            moq = s.get("pricing", {}).get("moq", 0)
            resp = s.get("platforms", {}).get("1688", {}).get("response_rate", 0)
            scatter_data.append({
                "Supplier": s.get("name_en", s.get("name", "Unknown"))[:20],
                "Quality Score": quality,
                "MOQ": moq,
                "Response Rate": resp,
                "Type": ", ".join(s.get("specialties", []))[:15],
            })
        df_scatter = pd.DataFrame(scatter_data)
        fig_scatter = px.scatter(
            df_scatter,
            x="MOQ", y="Quality Score",
            size="Response Rate",
            color="Type",
            hover_name="Supplier",
            size_max=50,
            color_discrete_sequence=px.colors.qualitative.Set2,
        )
        fig_scatter.update_layout(height=350, margin=dict(t=20, b=20, l=20, r=20))
        st.plotly_chart(fig_scatter, use_container_width=True)
    else:
        st.info("No supplier data for scatter plot")

    # Recent activity timeline
    st.divider()
    st.subheader("🕐 Recent Activity")
    timeline_data = []
    for j in sorted(jobs, key=lambda x: x.get("date", ""), reverse=True)[:5]:
        timeline_data.append({
            "date": j.get("date", ""),
            "event": f"📋 {j.get('project', 'N/A')}",
            "status": STATUS_CONFIG.get(j.get("status", "in_progress"), STATUS_CONFIG["in_progress"])["label"],
            "customer": j.get("customer", "N/A"),
        })
    if timeline_data:
        df = pd.DataFrame(timeline_data)
        st.dataframe(df, hide_index=True, use_container_width=True)


# ─── Main ────────────────────────────────────────────────────────────
def main():
    st.set_page_config(
        page_title="Sourcing Agent — Mission Control",
        page_icon="🏭",
        layout="wide",
        initial_sidebar_state="expanded",
    )

    # Custom CSS
    st.markdown("""
    <style>
        /* Main container */
        .main .block-container {
            padding-top: 2rem;
        }
        /* Hide default menu */
        #MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        /* Card-like sections */
        section[data-testid="stVerticalBlock"] > div[data-testid="stVerticalBlock"] {
            background: transparent;
        }
        /* Metric cards */
        [data-testid="stMetric"] {
            background: #f8fafc;
            border-radius: 12px;
            padding: 16px;
            border: 1px solid #e2e8f0;
        }
        /* Buttons */
        .stButton > button {
            border-radius: 8px;
        }
        /* Sidebar */
        [data-testid="stSidebar"] {
            background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
        }
        [data-testid="stSidebar"] * {
            color: #e2e8f0 !important;
        }
        [data-testid="stSidebar"] .stRadio label {
            padding: 8px 12px;
            border-radius: 8px;
            margin: 2px 0;
            transition: background 0.2s;
        }
        [data-testid="stSidebar"] .stRadio label:hover {
            background: rgba(255,255,255,0.1);
        }
    </style>
    """, unsafe_allow_html=True)

    # Sidebar
    with st.sidebar:
        st.markdown("## 🏭 Mission Control")
        st.caption("E-Studio Sourcing Agent v0.2")
        st.divider()

        page = st.radio(
            "Navigation",
            ["📝 New Request", "📋 Requests", "🏭 Suppliers", "🧰 Quotes", "📊 Analytics", "🔍 Compare"],
            label_visibility="collapsed",
        )

        st.divider()
        st.caption(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        
        # Quick stats in sidebar with metrics
        jobs = load_jobs()
        suppliers = load_suppliers()
        active = len([j for j in jobs if j.get("status") in ("in_progress", "rfq_sent", "awaiting_approval")])
        completed = len([j for j in jobs if j.get("status") in ("approved", "completed")])
        st.divider()
        
        col_s1, col_s2 = st.columns(2)
        with col_s1:
            st.metric("📋 Requests", len(jobs))
            st.metric("🏭 Suppliers", len(suppliers))
        with col_s2:
            st.metric("🔄 Active", active)
            st.metric("✅ Done", completed)
        
        st.divider()
        
        # Export section
        st.subheader("📥 Export Data")
        if st.button("Export Suppliers CSV", use_container_width=True):
            df_exp = pd.DataFrame(suppliers)
            csv = df_exp.to_csv(index=False)
            st.download_button("Download", data=csv, file_name=f"suppliers-{datetime.now().strftime('%Y%m%d')}.csv", mime="text/csv")
        if st.button("Export Requests CSV", use_container_width=True):
            df_exp = pd.DataFrame(jobs)
            csv = df_exp.to_csv(index=False)
            st.download_button("Download", data=csv, file_name=f"requests-{datetime.now().strftime('%Y%m%d')}.csv", mime="text/csv")

    # Page routing
    if "New Request" in page:
        page_new_request()
    elif "Requests" in page:
        page_requests()
    elif "Suppliers" in page:
        page_suppliers()
    elif "Quotes" in page:
        from pages_quotes import main as page_quotes
        page_quotes()
    elif "Analytics" in page:
        page_analytics()
    elif "Compare" in page:
        page_supplier_comparison()


if __name__ == "__main__":
    main()

# ─── ENHANCEMENTS IMPORT ──────────────────────────────────────────────
try:
    from enhancements import status_badge, priority_badge, metric_card, info_box, warning_box, success_box
    ENHANCEMENTS_AVAILABLE = True
except ImportError:
    ENHANCEMENTS_AVAILABLE = False
    def status_badge(status): st.markdown(f"**{status}**")
    def priority_badge(priority): st.markdown(f"**{priority}**")
    def metric_card(label, value, delta=None, help_text=None): st.metric(label=label, value=value, delta=delta, help=help_text)
    def info_box(title, content, icon="ℹ️"): st.info(f"{icon} **{title}**\n\n{content}")
    def warning_box(message): st.warning(f"⚠️ {message}")
    def success_box(message): st.success(f"✅ {message}")

print(f"Enhancements available: {ENHANCEMENTS_AVAILABLE}")
