"""
Quote Generator Page for Sourcing Dashboard
Integrated with quote-invoice-workbench skill
"""

import streamlit as st
import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Add parent tools to path
sys.path.insert(0, str(Path(__file__).parent.parent / "tools"))
from quote_generator import generate_quote, generate_quote_from_supplier, quote_to_markdown, OUTPUT_DIR

st.set_page_config(page_title="Quote Generator", page_icon="🧰")

st.title("🧰 Quote Generator")
st.caption("Turn supplier pricing into professional customer quotes")

# Initialize session state
if "quote_items" not in st.session_state:
    st.session_state.quote_items = []

# --- Sidebar: Quick Quote from Supplier ---
with st.sidebar:
    st.header("Quick Quote")
    st.markdown("Generate from supplier data")
    
    # Load available suppliers
    supplier_files = []
    suppliers_dir = Path(__file__).parent.parent / "suppliers"
    if suppliers_dir.exists():
        supplier_files = [f for f in suppliers_dir.glob("*.json")]
    
    if supplier_files:
        with st.expander("From Supplier DB"):
            selected_file = st.selectbox("Supplier file", [f.name for f in supplier_files])
            if st.button("Load Supplier"):
                with open(suppliers_dir / selected_file, "r") as f:
                    data = json.load(f)
                if isinstance(data, list) and len(data) > 0:
                    data = data[0]
                st.session_state["quick_supplier"] = data
                st.success(f"Loaded: {data.get('name', 'Supplier')}")
    
    if st.session_state.get("quick_supplier"):
        sup = st.session_state["quick_supplier"]
        st.markdown(f"**{sup.get('name', 'Supplier')}**")
        pricing = sup.get("pricing", {})
        st.metric("MOQ", pricing.get("moq", "N/A"))
        st.metric("Unit Cost", f"${pricing.get('unit_price', pricing.get('sample_cost', 0))}")
        
        markup = st.slider("Markup %", 0, 100, 30)
        customer = st.text_input("Customer", value="Customer Co.")
        
        if st.button("Generate Quick Quote"):
            quote = generate_quote_from_supplier(
                customer_name=customer,
                supplier_data=sup,
                markup_pct=markup
            )
            md = quote_to_markdown(quote)
            st.session_state["current_quote"] = quote
            st.session_state["current_quote_md"] = md
            st.rerun()

# --- Main Area ---
tab1, tab2, tab3 = st.tabs(["📋 Build Quote", "📄 Quote Preview", "📁 Quote History"])

with tab1:
    st.subheader("Build Custom Quote")
    
    col1, col2 = st.columns(2)
    with col1:
        customer = st.text_input("Customer Name", key="quote_customer", value="Customer Co.")
        currency = st.selectbox("Currency", ["USD", "EUR", "CNY", "GBP"], key="quote_currency")
    with col2:
        tax = st.number_input("Tax %", min_value=0.0, max_value=50.0, value=0.0, step=0.5)
        discount = st.number_input("Discount %", min_value=0.0, max_value=100.0, value=0.0, step=0.5)
    
    st.markdown("---")
    st.markdown("### Line Items")
    
    # Add new item form
    item_col1, item_col2, item_col3, item_col4 = st.columns([3, 1, 1, 1])
    with item_col1:
        new_item_name = st.text_input("Item Description", key="new_item_name")
    with item_col2:
        new_qty = st.number_input("Qty", min_value=1, value=1, key="new_qty")
    with item_col3:
        new_rate = st.number_input("Rate", min_value=0.0, value=0.0, step=0.01, key="new_rate")
    with item_col4:
        new_unit = st.text_input("Unit", value="pcs", key="new_unit")
    
    if st.button("➕ Add Item", type="secondary"):
        if new_item_name and new_rate > 0:
            st.session_state.quote_items.append({
                "item": new_item_name,
                "qty": new_qty,
                "rate": round(new_rate, 2),
                "unit": new_unit
            })
    
    # Display current items
    if st.session_state.quote_items:
        st.markdown("---")
        for i, item in enumerate(st.session_state.quote_items):
            col_a, col_b, col_c, col_d, col_e = st.columns([3, 1, 1, 1, 0.5])
            col_a.write(item["item"])
            col_b.write(f"×{item['qty']}")
            col_c.write(f"${item['rate']:.2f}")
            col_d.write(item["unit"])
            if col_e.button("🗑️", key=f"del_{i}"):
                st.session_state.quote_items.pop(i)
                st.rerun()
    
    # Additional settings
    with st.expander("Advanced Settings"):
        notes = st.text_area("Notes", placeholder="Lead time, special conditions...")
        deposit = st.slider("Deposit %", 0, 100, 30)
        validity = st.number_input("Valid for (days)", min_value=7, max_value=365, value=30)
        supplier_ref = st.text_input("Supplier Reference")
    
    # Generate button
    if st.session_state.quote_items and st.button("🧰 Generate Quote", type="primary"):
        quote = generate_quote(
            customer_name=customer,
            line_items=list(st.session_state.quote_items),
            currency=currency,
            tax_pct=tax,
            discount_pct=discount,
            deposit_pct=deposit,
            valid_days=int(validity),
            supplier_name=supplier_ref,
            notes=notes
        )
        md = quote_to_markdown(quote)
        st.session_state["current_quote"] = quote
        st.session_state["current_quote_md"] = md
        st.success(f"Quote {quote['quote_number']} generated!")
        st.balloons()

with tab2:
    if st.session_state.get("current_quote_md"):
        st.markdown(st.session_state["current_quote_md"])
        
        quote = st.session_state["current_quote"]
        
        col_dl, col_copy = st.columns(2)
        with col_dl:
            st.download_button(
                "📥 Download Markdown",
                data=st.session_state["current_quote_md"],
                file_name=f"{quote['quote_number']}.md",
                mime="text/markdown"
            )
        with col_copy:
            st.download_button(
                "📥 Download JSON",
                data=json.dumps(quote, indent=2, ensure_ascii=False),
                file_name=f"{quote['quote_number']}.json",
                mime="application/json"
            )
    else:
        st.info("Generate a quote first to preview it here.")

with tab3:
    st.subheader("Previous Quotes")
    if OUTPUT_DIR.exists():
        quotes = sorted(OUTPUT_DIR.glob("*.json"), reverse=True)
        if quotes:
            for qf in quotes:
                with open(qf, "r") as f:
                    q = json.load(f)
                with st.expander(f"📄 {q['quote_number']} — {q['customer']} — ${q['total']:.2f}"):
                    st.markdown(f"**Date:** {q['date']} | **Valid Until:** {q['valid_until']}")
                    st.markdown(f"**Status:** {q.get('status', 'draft')}")
                    st.markdown(f"**Payment:** {q['payment_terms']}")
                    if st.button("Load", key=f"load_{q['quote_number']}"):
                        st.session_state["current_quote"] = q
                        st.session_state["current_quote_md"] = quote_to_markdown(q)
                        st.session_state.quote_items = q["line_items"]
                        st.rerun()
        else:
            st.info("No quotes generated yet.")
    else:
        st.info("No quotes directory found.")
