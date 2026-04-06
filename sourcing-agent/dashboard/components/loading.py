"""Loading components — spinner with centered message."""

import streamlit as st
from config import Theme


def render_loading_spinner(message: str = "Loading...") -> st.spinner:
    """Render a Streamlit spinner with a centered loading message.

    Uses the design system's PRIMARY color for the spinner accent.

    Args:
        message: Text displayed alongside the spinner.

    Returns:
        A Streamlit spinner context manager.
    """
    color = Theme.colors.PRIMARY
    st.markdown(
        f"""<style>
        .loading-spinner-container {{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: {Theme.spacing.px(6)};
        }}
        .loading-spinner-container .spinner-text {{
            color: {Theme.colors.TEXT_BODY};
            font-size: 14px;
            font-weight: 500;
            margin-top: {Theme.spacing.px(2)};
            font-family: {Theme.typography.FONT_SANS};
        }}
        </style>""",
        unsafe_allow_html=True,
    )

    spinner = st.spinner(message)

    return spinner
