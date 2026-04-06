"""
Shared session state management for the Sourcing Dashboard.

Centralizes all st.session_state initialization and access
so that every page sees the same canonical state keys.

Usage:
    from state import init_state, get_state, set_state

    init_state()          # call once in app.py main()
    jobs = get_state("jobs")
    set_state("jobs", new_jobs)
"""

import streamlit as st

# ─── Canonical state keys ─────────────────────────────────────────────
STATE_KEYS = {
    # Navigation
    "current_page": "📋 Requests",
    # Data caches
    "jobs": None,
    "suppliers": None,
    # File-watcher fingerprints
    "fp_suppliers": None,
    "fp_jobs": None,
    # UI toggles
    "auto_refresh": False,
    "show_favorites_only": False,
    # Filters (serializable dicts)
    "request_filters": {"search": "", "status": "All", "priority": "All"},
    "supplier_filters": {"search": "", "specialty": "All", "min_rating": "All"},
}


def init_state() -> None:
    """Ensure all expected session_state keys exist with defaults.

    Safe to call multiple times -- existing values are preserved.
    """
    for key, default in STATE_KEYS.items():
        if key not in st.session_state:
            st.session_state[key] = default


def get_state(key: str, default=None):
    """Retrieve a value from session_state with an optional fallback."""
    return st.session_state.get(key, default)


def set_state(key: str, value) -> None:
    """Write a value into session_state."""
    st.session_state[key] = value


def invalidate_cache(which: str = "all") -> None:
    """Force data reload on next page render.

    Args:
        which: 'suppliers', 'jobs', or 'all'.
    """
    if which in ("all", "suppliers"):
        set_state("suppliers", None)
        set_state("fp_suppliers", None)
    if which in ("all", "jobs"):
        set_state("jobs", None)
        set_state("fp_jobs", None)
