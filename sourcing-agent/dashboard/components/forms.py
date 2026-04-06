"""Form components — search bars, filter bars."""

import streamlit as st


def search_bar(placeholder: str = "Search...", key: str = "search"):
    """Render a search input bar.

    Args:
        placeholder: Hint text
        key: Unique Streamlit key

    Returns:
        Search query string
    """
    return st.text_input("🔍", placeholder=placeholder, key=key, label_visibility="collapsed")


def filter_bar(filters: list, key_prefix: str = "filter"):
    """Render a row of filter dropdowns.

    Args:
        filters: List of dicts: {"label": str, "options": list, "key": str}
        key_prefix: Prefix for Streamlit keys

    Returns:
        Dict of {key: selected_value}
    """
    if not filters:
        return {}
    cols = st.columns(len(filters))
    results = {}
    for i, f in enumerate(filters):
        with cols[i]:
            results[f["key"]] = st.selectbox(
                f.get("label", f["key"]),
                f["options"],
                key=f"{key_prefix}_{f['key']}",
            )
    return results
