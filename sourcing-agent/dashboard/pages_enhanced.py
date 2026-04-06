"""
Sourcing Agent Dashboard - Enhanced Pages
Improved pages with better UI/UX
"""

import streamlit as st
from enhancements import (
    CUSTOM_THEME, PAGE_CONFIG, status_badge, priority_badge,
    metric_card, supplier_card, rfq_tracker, filter_suppliers,
    export_to_csv, info_box, warning_box, success_box
)

# Apply custom theme
for key, value in CUSTOM_THEME.items():
    st.set_page_config(**PAGE_CONFIG)

# ==================================================
# ENHANCED SUPPLIERS PAGE
# ==================================================

def show_suppliers_page_enhanced():
    """Display enhanced suppliers page with better UX"""
    
    st.title("🏭 Supplier Database")
    st.markdown("---")
    
    # Summary metrics
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        metric_card("Total Suppliers", "6", help_text="All suppliers in database")
    with col2:
        metric_card("RFQ Sent", "2", help_text="RFQs sent to suppliers")
    with col3:
        metric_card("Pending", "4", help_text="Awaiting RFQ or response")
    with col4:
        metric_card("Quotes", "0", help_text="Quotations received")
    
    # Search and filters
    st.markdown("### 🔍 Search & Filter")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        search_text = st.text_input("Search suppliers", placeholder="Search by name...")
    
    with col2:
        location_filter = st.selectbox(
            "Filter by location",
            ["All", "Shenzhen", "Dongguan", "Guangzhou"]
        )
    
    with col3:
        status_filter = st.selectbox(
            "Filter by status",
            ["All", "active", "candidate", "pending"]
        )
    
    # Load suppliers (from JSON files)
    import json
    from pathlib import Path
    
    suppliers_dir = Path.home() / '.openclaw' / 'workspace' / 'sourcing-agent' / 'suppliers'
    suppliers = []
    
    for json_file in suppliers_dir.glob('supplier_*.json'):
        try:
            with open(json_file) as f:
                supplier = json.load(f)
                suppliers.append(supplier)
        except:
            pass
    
    # Apply filters
    filtered_suppliers = filter_suppliers(
        suppliers,
        search_text if search_text else None,
        location_filter if location_filter != "All" else None,
        status_filter if status_filter != "All" else None
    )
    
    # Display filtered suppliers
    st.markdown(f"### 📋 Showing {len(filtered_suppliers)} suppliers")
    
    for supplier in filtered_suppliers:
        supplier_card(
            name=supplier.get('name', 'Unknown'),
            match_score=supplier.get('match_score', 0),
            status=supplier.get('status', 'unknown'),
            contact=supplier.get('contact', {}).get('sales_email', 'No email'),
            capabilities=supplier.get('specialties', [])
        )
        st.markdown("---")
    
    # Export button
    if filtered_suppliers:
        export_to_csv(filtered_suppliers, "suppliers.csv")

# ==================================================
# ENHANCED REQUESTS PAGE
# ==================================================

def show_requests_page_enhanced():
    """Display enhanced requests page with better UX"""
    
    st.title("📋 Sourcing Requests")
    st.markdown("---")
    
    # Summary metrics
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        metric_card("Total Jobs", "4", help_text="All sourcing requests")
    with col2:
        metric_card("In Progress", "1", help_text="Active projects")
    with col3:
        metric_card("Completed", "2", help_text="Finished projects")
    with col4:
        metric_card("Pending", "1", help_text="Awaiting action")
    
    # Load jobs
    import json
    from pathlib import Path
    
    customers_dir = Path.home() / '.openclaw' / 'workspace' / 'sourcing-agent' / 'customers'
    jobs = []
    
    for json_file in customers_dir.glob('job_*.json'):
        try:
            with open(json_file) as f:
                job = json.load(f)
                jobs.append(job)
        except:
            pass
    
    # Display jobs
    for job in jobs:
        with st.container():
            col1, col2 = st.columns([4, 1])
            
            with col1:
                st.subheader(f"📄 {job.get('project', 'Unknown')}")
                st.markdown(f"**Customer:** {job.get('customer', 'Unknown')}")
                st.markdown(f"**Status:** {job.get('status', 'Unknown')}")
                st.markdown(f"**Date:** {job.get('date', 'Unknown')}")
            
            with col2:
                if st.button("👁️ View", key=f"view_{job.get('id', '')}"):
                    st.json(job)
            
            st.markdown("---")

# ==================================================
# ENHANCED ANALYTICS PAGE
# ==================================================

def show_analytics_page_enhanced():
    """Display enhanced analytics page with visualizations"""
    
    st.title("📊 Analytics Dashboard")
    st.markdown("---")
    
    # Key metrics
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        metric_card("Active Projects", "1", delta="This week")
    with col2:
        metric_card("Suppliers", "6", delta="New: 2")
    with col3:
        metric_card("RFQs Sent", "2", delta="This week")
    with col4:
        metric_card("Days to Prototype", "18", delta="-2 from yesterday")
    
    # Project timeline
    st.markdown("### ⏰ Project Spider Timeline")
    
    milestones = [
        {"task": "RFQ Preparation", "start": "2026-03-28", "end": "2026-03-28"},
        {"task": "Send RFQs", "start": "2026-03-28", "end": "2026-03-31"},
        {"task": "Collect Quotes", "start": "2026-04-01", "end": "2026-04-05"},
        {"task": "Supplier Selection", "start": "2026-04-08", "end": "2026-04-10"},
        {"task": "Sample Request", "start": "2026-04-10", "end": "2026-04-12"},
        {"task": "Prototype Delivery", "start": "2026-04-12", "end": "2026-04-15"},
    ]
    
    from enhancements import timeline_chart
    timeline_chart(milestones)
    
    # Supplier comparison
    st.markdown("### 🏆 Supplier Comparison")
    
    suppliers_data = [
        {"Supplier": "STW", "Match": 95, "Experience": 90, "Certifications": 85, "Price": 70},
        {"Supplier": "Goochain", "Match": 85, "Experience": 75, "Certifications": 80, "Price": 75},
    ]
    
    import pandas as pd
    import plotly.graph_objects as go
    
    df = pd.DataFrame(suppliers_data)
    
    fig = go.Figure()
    
    for supplier in df['Supplier']:
        data = df[df['Supplier'] == supplier]
        fig.add_trace(go.Scatterpolar(
            r=data[['Match', 'Experience', 'Certifications', 'Price']].values.flatten(),
            theta=['Match', 'Experience', 'Certifications', 'Price'],
            fill='toself',
            name=supplier
        ))
    
    fig.update_layout(
        polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
        showlegend=True,
        title="Supplier Score Comparison"
    )
    
    st.plotly_chart(fig, use_container_width=True)

print("Enhanced pages loaded successfully!")
