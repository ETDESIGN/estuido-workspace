"""
Sourcing Agent Dashboard - Enhanced Theme and Configuration
Custom theme for better UI/UX
"""

# Custom Theme Configuration
CUSTOM_THEME = {
    "base": "dark",  # or "light"
    "primaryColor": "#FF6B6B",  # Red accent
    "backgroundColor": "#1E1E1E",
    "secondaryBackgroundColor": "#252525",
    "textColor": "#FAFAFA",
    "font": "sans serif",
}

# Enhanced page configurations
PAGE_CONFIG = {
    "page_title": "Sourcing Agent Mission Control",
    "page_icon": "🎯",
    "layout": "wide",
    "initial_sidebar_state": "expanded",
}

# Status badge colors
STATUS_COLORS = {
    "active": "🟢",
    "pending": "🟡",
    "completed": "✅",
    "cancelled": "❌",
    "rfq_sent": "📧",
    "awaiting": "⏳",
    "quote_received": "💰",
}

# Priority colors
PRIORITY_COLORS = {
    "high": "🔴",
    "medium": "🟠",
    "low": "🟢",
}

# Progress indicators
def get_progress_bar(percent, color="red"):
    """Create a progress bar with percentage"""
    import streamlit as st
    st.progress(percent / 100)
    st.caption(f"{percent}% complete")

# Status badge
def status_badge(status):
    """Display a status badge with emoji"""
    emoji = STATUS_COLORS.get(status.lower(), "⚪")
    st.markdown(f"{emoji} **{status}**")

# Priority badge
def priority_badge(priority):
    """Display a priority badge with emoji"""
    emoji = PRIORITY_COLORS.get(priority.lower(), "⚪")
    st.markdown(f"{emoji} **{priority} priority**")

# Metrics card
def metric_card(label, value, delta=None, help_text=None):
    """Display a styled metric card"""
    import streamlit as st
    st.metric(label=label, value=value, delta=delta, help=help_text)

# Info box
def info_box(title, content, icon="ℹ️"):
    """Display an information box"""
    import streamlit as st
    st.info(f"{icon} **{title}**\n\n{content}")

# Warning box
def warning_box(message):
    """Display a warning message"""
    import streamlit as st
    st.warning(f"⚠️ {message}")

# Success box
def success_box(message):
    """Display a success message"""
    import streamlit as st
    st.success(f"✅ {message}")

# Error box
def error_box(message):
    """Display an error message"""
    import streamlit as st
    st.error(f"❌ {message}")

# Supplier card
def supplier_card(name, match_score, status, contact, capabilities):
    """Display a supplier information card"""
    import streamlit as st
    
    with st.container():
        col1, col2, col3 = st.columns([3, 1, 1])
        
        with col1:
            st.subheader(f"🏭 {name}")
            st.caption(f"Match Score: **{match_score}%**")
            
        with col2:
            status_badge(status)
            
        with col3:
            if st.button("📧 Email", key=f"email_{name}"):
                st.info(f"Email: {contact}")
            if st.button("📞 Call", key=f"call_{name}"):
                st.info(f"Phone: [Contact info]")
        
        with st.expander("📋 Capabilities"):
            for cap in capabilities:
                st.markdown(f"• {cap}")

# RFQ tracker
def rfq_tracker(suppliers):
    """Display RFQ status tracking for all suppliers"""
    import streamlit as st
    from datetime import datetime
    
    st.subheader("📊 RFQ Status Tracker")
    
    # Summary metrics
    total = len(suppliers)
    sent = sum(1 for s in suppliers if s.get('rfq_sent', False))
    responses = sum(1 for s in suppliers if s.get('response', '') != '')
    
    col1, col2, col3 = st.columns(3)
    with col1:
        metric_card("Total Suppliers", total)
    with col2:
        metric_card("RFQs Sent", sent)
    with col3:
        metric_card("Responses", responses)
    
    # Supplier list with status
    for supplier in suppliers:
        with st.container():
            col1, col2, col3, col4 = st.columns([3, 2, 2, 2])
            
            with col1:
                st.write(f"**{supplier['name']}**")
            
            with col2:
                if supplier.get('rfq_sent', False):
                    status_badge("RFQ Sent")
                else:
                    status_badge("Pending")
            
            with col3:
                if supplier.get('response', '') != '':
                    status_badge("Quote Received")
                else:
                    status_badge("Awaiting")
            
            with col4:
                if st.button("📋 Details", key=f"details_{supplier['name']}"):
                    st.json(supplier)

# Search/filter functionality
def filter_suppliers(suppliers, search_text, location_filter, status_filter):
    """Filter suppliers based on search and filters"""
    filtered = suppliers
    
    if search_text:
        filtered = [s for s in filtered if search_text.lower() in s['name'].lower()]
    
    if location_filter:
        filtered = [s for s in filtered if s.get('location', {}).get('city', '') == location_filter]
    
    if status_filter:
        filtered = [s for s in filtered if s.get('status', '') == status_filter]
    
    return filtered

# Export functionality
def export_to_csv(data, filename="suppliers.csv"):
    """Export data to CSV"""
    import streamlit as st
    import pandas as pd
    
    df = pd.DataFrame(data)
    csv = df.to_csv(index=False)
    
    st.download_button(
        label="📥 Download CSV",
        data=csv,
        file_name=filename,
        mime="text/csv"
    )

# Timeline visualization
def timeline_chart(milestones):
    """Display project timeline as a chart"""
    import streamlit as st
    import pandas as pd
    import plotly.express as px
    
    df = pd.DataFrame(milestones)
    
    fig = px.timeline(
        df,
        x_start="start",
        x_end="end",
        y="task",
        title="Project Timeline"
    )
    
    st.plotly_chart(fig, use_container_width=True)

print("Dashboard enhancements loaded successfully!")
