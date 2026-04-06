"""Navigation components — page headers, breadcrumbs."""

import streamlit as st
from config import Theme


def page_header(title: str, subtitle: str = None, actions=None):
    """Render a page header with optional subtitle and action buttons.

    Args:
        title: Page title
        subtitle: Optional description below title
        actions: Optional list of (label, callback) pairs — renders as buttons in a row
    """
    st.markdown(
        f"""<div class="comp-page-header">
            <h1>{title}</h1>
            {f'<div class="subtitle">{subtitle}</div>' if subtitle else ''}
        </div>""",
        unsafe_allow_html=True,
    )
    if actions:
        cols = st.columns(len(actions))
        for i, (label, _) in enumerate(actions):
            with cols[i]:
                if st.button(label, key=f"action_{label}_{i}"):
                    _()


def breadcrumb(items: list):
    """Render a breadcrumb trail.

    Args:
        items: List of (label, href_or_key) pairs. Last item is current page (no link).
               Example: [("Home", "home"), ("Requests", "requests"), ("RFQ-004", None)]
    """
    parts = []
    for i, (label, _) in enumerate(items):
        is_last = (i == len(items) - 1)
        if is_last:
            parts.append(f'<span style="color: {Theme.colors.TEXT_HEADING}; font-weight: 600;">{label}</span>')
        else:
            parts.append(f'<a href="#">{label}</a><span class="separator">/</span>')
    st.markdown(
        f'<div class="comp-breadcrumb">{"".join(parts)}</div>',
        unsafe_allow_html=True,
    )
