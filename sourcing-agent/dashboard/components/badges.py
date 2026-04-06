"""Badge components — status, priority, and tag badges."""

import streamlit as st
from config import Theme


def status_badge(status: str):
    """Render a colored status badge.

    Args:
        status: Status key (e.g. 'in_progress', 'approved', 'draft')
    """
    s = Theme.colors.STATUS.get(status, Theme.colors.STATUS.get(status.lower(), {
        "color": Theme.colors.NEUTRAL, "bg": "#F1F5F9", "label": status
    }))
    label = s.get("label", status.replace("_", " ").title())
    st.markdown(
        f'<span class="comp-badge" style="color: {s["color"]}; background: {s["bg"]};">{label}</span>',
        unsafe_allow_html=True,
    )


def priority_badge(priority: str):
    """Render a colored priority badge.

    Args:
        priority: Priority key (e.g. 'p0', 'high', 'medium')
    """
    p = Theme.colors.PRIORITY.get(priority, Theme.colors.PRIORITY.get(priority.lower(), {
        "color": Theme.colors.NEUTRAL, "label": priority
    }))
    label = p.get("label", str(priority).upper())
    st.markdown(
        f'<span class="comp-badge" style="color: {p["color"]}; background: #F8FAFC;">{label}</span>',
        unsafe_allow_html=True,
    )


def tag_badge(label: str, color: str = None):
    """Render a simple tag badge.

    Args:
        label: Tag text
        color: Optional hex color
    """
    c = color or Theme.colors.NEUTRAL
    st.markdown(
        f'<span class="comp-badge" style="color: {c}; background: #F1F5F9;">{label}</span>',
        unsafe_allow_html=True,
    )
