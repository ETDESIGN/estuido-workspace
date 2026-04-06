"""Card components — metric cards, info cards, stat rows."""

import streamlit as st
from config import Theme


def metric_card(label: str, value, delta=None, icon: str = "", color: str = None):
    """Render a styled metric card with optional delta and icon.

    Args:
        label: Short description (e.g. 'Total Requests')
        value: The metric value (int, float, or str)
        delta: Optional change indicator (e.g. '+5' or -2.3)
        icon: Optional emoji prefix
        color: Optional hex color for the accent (defaults to PRIMARY)
    """
    c = color or Theme.colors.PRIMARY
    icon_part = f"{icon} " if icon else ""
    st.markdown(
        f"""<div class="comp-card" style="border-top: 3px solid {c};">
            <div class="comp-metric-card">
                <div class="metric-label">{icon_part}{label}</div>
                <div class="metric-value">{value}</div>
                {"<div class='metric-delta'>" + str(delta) + "</div>" if delta else ""}
            </div>
        </div>""",
        unsafe_allow_html=True,
    )


def info_card(title: str, content: str, icon: str = "ℹ️", border_color: str = None):
    """Render an info card with colored left border.

    Args:
        title: Card heading
        content: Body text
        icon: Optional emoji
        border_color: Optional hex color for left border
    """
    c = border_color or Theme.colors.PRIMARY
    st.markdown(
        f"""<div class="comp-info-card" style="border-left-color: {c};">
            <strong>{icon} {title}</strong><br/>
            <span style="color: {Theme.colors.TEXT_BODY};">{content}</span>
        </div>""",
        unsafe_allow_html=True,
    )


def stat_row(metrics: list):
    """Render a horizontal row of metric cards.

    Args:
        metrics: List of dicts with keys: label, value, delta, icon, color
                 Example: [{"label": "Requests", "value": 12, "icon": "📋"}]
    """
    cols = st.columns(len(metrics))
    for i, m in enumerate(metrics):
        with cols[i]:
            metric_card(
                label=m.get("label", ""),
                value=m.get("value", 0),
                delta=m.get("delta"),
                icon=m.get("icon", ""),
                color=m.get("color"),
            )
