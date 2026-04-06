"""Table components — data tables with filtering."""

import streamlit as st
import pandas as pd
from config import Theme


def data_table(df: pd.DataFrame, key: str = "table", page_size: int = 20, height: int = 400):
    """Render a styled data table with pagination info.

    Args:
        df: pandas DataFrame to display
        key: Unique key for Streamlit widget
        page_size: Rows per page (shows full table, crops display)
        height: Max height in pixels

    Returns:
        The DataFrame (for chaining)
    """
    if df.empty:
        st.info("No data to display.")
        return df

    st.markdown(f"**{len(df)} records**", help=f"Showing up to {page_size} rows")
    st.dataframe(
        df,
        use_container_width=True,
        height=height,
        hide_index=True,
    )
    return df
