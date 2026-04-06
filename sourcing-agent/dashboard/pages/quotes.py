"""Quotes page — wrapper for existing pages_quotes.py."""

import sys
from pathlib import Path

# Add dashboard dir to path so we can import the existing module
DASH_DIR = Path(__file__).parent.parent
if str(DASH_DIR) not in sys.path:
    sys.path.insert(0, str(DASH_DIR))


def render():
    """Render the Quotes page by delegating to the existing pages_quotes module."""
    try:
        from pages_quotes import main as page_quotes
        page_quotes()
    except ImportError:
        import streamlit as st
        st.warning("Quotes module not available. Check that pages_quotes.py exists.")
