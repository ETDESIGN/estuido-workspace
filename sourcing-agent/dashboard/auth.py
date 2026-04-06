"""
C5 FIX: Simple password gate for Streamlit dashboard.

Uses environment variable DASHBOARD_PASSWORD or a configurable password.
Full integration with Next.js auth is Phase 2.
"""

import hashlib
import os
import streamlit as st


def _hash_password(password: str) -> str:
    """Hash a password with a salt derived from the app name."""
    salt = "estudio-streamlit-dashboard-v1"
    return hashlib.sha256(f"{salt}:{password}".encode()).hexdigest()


def _get_expected_hash() -> str | None:
    """Get the expected password hash from environment."""
    password = os.environ.get("DASHBOARD_PASSWORD")
    if password:
        return _hash_password(password)
    return None


def check_authentication() -> bool:
    """
    Check if user is authenticated. Returns True if authenticated.
    
    If no DASHBOARD_PASSWORD is set, authentication is disabled
    (useful for local development only).
    """
    expected_hash = _get_expected_hash()

    # No password configured — allow access (dev mode)
    # In production, DASHBOARD_PASSWORD should always be set
    if not expected_hash:
        if os.environ.get("NODE_ENV") == "production":
            st.error(
                "⚠️ **Security Warning**: DASHBOARD_PASSWORD is not set. "
                "Please configure it for production use."
            )
        return True

    # Check session state
    if st.session_state.get("authenticated", False):
        return True

    return False


def render_login_gate():
    """
    Render a login form. Returns True if login successful.
    Call this at the top of your main() function.
    """
    expected_hash = _get_expected_hash()

    # No password configured — skip gate
    if not expected_hash:
        return True

    # Already authenticated
    if st.session_state.get("authenticated", False):
        return True

    st.markdown(
        """
        <div style="display:flex;justify-content:center;align-items:center;min-height:80vh;">
            <div style="text-align:center;max-width:400px;width:100%;">
        """,
        unsafe_allow_html=True,
    )

    st.title("🔒 Dashboard Access")
    st.caption("E-Studio Internal Sourcing Dashboard")

    password = st.text_input(
        "Password",
        type="password",
        key="login_password",
        label_visibility="collapsed",
        placeholder="Enter dashboard password",
    )

    if password:
        if _hash_password(password) == expected_hash:
            st.session_state["authenticated"] = True
            st.rerun()
        else:
            st.error("Invalid password. Please try again.")

    st.markdown("</div></div>", unsafe_allow_html=True)
    return False


def logout():
    """Clear authentication state."""
    st.session_state["authenticated"] = False
    st.rerun()
