"""
Supplier Comparison Matrix - Add-on for Sourcing Agent Dashboard
Add this to dashboard.py to enable side-by-side supplier comparison
"""

def page_supplier_comparison():
    """New page: Compare suppliers side-by-side"""
    st.header("🔍 Supplier Comparison Matrix")
    st.caption("Compare suppliers across multiple dimensions")

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

    # Build comparison data
    comparison_data = []

    metrics = [
        ("Price", "MOQ", lambda s: s.get("pricing", {}).get("moq", "N/A")),
        ("Price", "Sample Cost", lambda s: s.get("pricing", {}).get("sample_cost", "N/A")),
        ("Quality", "Rating", lambda s: s.get("platforms", {}).get("1688", {}).get("rating", "N/A")),
        ("Quality", "Quality Score", lambda s: s.get("performance", {}).get("quality_score", "N/A")),
        ("Quality", "On-Time Delivery", lambda s: s.get("performance", {}).get("on_time_delivery", "N/A")),
        ("Service", "Response Rate", lambda s: s.get("platforms", {}).get("1688", {}).get("response_rate", "N/A")),
        ("Service", "Responsiveness", lambda s: s.get("performance", {}).get("responsiveness", "N/A")),
        ("Location", "City", lambda s: s.get("location", {}).get("city", "N/A")),
        ("Location", "District", lambda s: s.get("location", {}).get("district", "N/A")),
        ("Capabilities", "CNC", lambda s: "✅" if s.get("capabilities", {}).get("cnc") else "❌"),
        ("Capabilities", "Injection Molding", lambda s: "✅" if s.get("capabilities", {}).get("injection_molding") else "❌"),
        ("Capabilities", "PCB", lambda s: "✅" if s.get("capabilities", {}).get("pcb") else "❌"),
    ]

    # Create comparison table
    st.subheader("📊 Comparison Table")

    # Build DataFrame
    df_data = {}
    for s in selected:
        name = s.get("name", s.get("name_en", "Unknown"))[:20]
        df_data[name] = [
            f"{category} - {metric}"
            for category, metric, _ in metrics
        ]

    df = pd.DataFrame(df_data)

    # Add metric labels
    metric_labels = [f"{category} - {metric}" for category, metric, _ in metrics]
    df.index = metric_labels

    # Display with styling
    st.dataframe(df, use_container_width=True)

    # Detailed comparison cards
    st.divider()
    st.subheader("📋 Detailed Breakdown")

    cols = st.columns(len(selected))
    for idx, s in enumerate(selected):
        with cols[idx]:
            st.markdown(f"**{s.get('name', s.get('name_en', 'Unknown'))}**")

            # Rating badge
            rating = s.get("platforms", {}).get("1688", {}).get("rating", 0)
            st.metric("Rating", f"{rating}/5.0")

            # Key metrics
            st.caption(f"📍 {s.get('location', {}).get('city', 'N/A')}")
            st.caption(f"💰 MOQ: {s.get('pricing', {}).get('moq', 'N/A')}")
            st.caption(f"⭐ Quality: {s.get('performance', {}).get('quality_score', 'N/A')}")
            st.caption(f"🚚 On-Time: {s.get('performance', {}).get('on_time_delivery', 'N/A')}%")

            # Capabilities
            caps = s.get('capabilities', {})
            cap_str = " | ".join([
                "🔧 CNC" if caps.get('cnc') else "",
                "🧊 Injection" if caps.get('injection_molding') else "",
                "🔌 PCB" if caps.get('pcb') else ""
            ])
            st.caption(cap_str)

    # Recommendation
    st.divider()
    st.subheader("🎯 Recommendation")

    # Score each supplier
    scores = {}
    for s in selected:
        score = 0
        score += s.get("performance", {}).get("quality_score", 0) * 20
        score += s.get("platforms", {}).get("1688", {}).get("rating", 0) * 10
        score += s.get("performance", {}).get("on_time_delivery", 0) / 5
        score -= s.get("pricing", {}).get("moq", 100) / 10
        scores[s.get("name", s.get("name_en", "Unknown"))] = score

    # Find best
    best = max(scores, key=scores.get)
    st.success(f"🏆 **Best Overall:** {best}")

    # Export
    if st.button("📥 Export Comparison to CSV"):
        export_data = []
        for s in selected:
            row = {"Supplier": s.get("name", s.get("name_en", "Unknown"))}
            for category, metric, func in metrics:
                key = f"{category} - {metric}"
                row[key] = func(s)
            export_data.append(row)

        df_export = pd.DataFrame(export_data)
        csv = df_export.to_csv(index=False)
        st.download_button(
            label="Download CSV",
            data=csv,
            file_name=f"supplier-comparison-{datetime.now().strftime('%Y%m%d')}.csv",
            mime="text/csv"
        )

# Add this to main() page routing:
# elif "Compare" in page:
#     page_supplier_comparison()
