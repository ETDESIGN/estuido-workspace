"""Chart components — Plotly chart wrappers."""

import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
from config import Theme


def bar_chart(df, x: str, y: str, title: str = "", color: str = None):
    """Bar chart wrapper.

    Args:
        df: pandas DataFrame
        x: Column name for x-axis
        y: Column name for y-axis
        title: Chart title
        color: Optional hex color
    """
    c = color or Theme.colors.PRIMARY
    fig = px.bar(df, x=x, y=y, title=title, color_discrete_sequence=[c])
    fig.update_layout(
        margin=dict(t=40, b=20, l=20, r=20),
        font_family="Inter, sans-serif",
        showlegend=False,
    )
    st.plotly_chart(fig, use_container_width=True)


def line_chart(df, x: str, y: str, title: str = "", color: str = None):
    """Line chart wrapper.

    Args:
        df: pandas DataFrame
        x: Column name for x-axis
        y: Column name for y-axis (or list of columns)
        title: Chart title
        color: Optional hex color
    """
    c = color or Theme.colors.PRIMARY
    fig = px.line(df, x=x, y=y, title=title)
    fig.update_traces(line_color=c)
    fig.update_layout(
        margin=dict(t=40, b=20, l=20, r=20),
        font_family="Inter, sans-serif",
        showlegend=True if isinstance(y, list) else False,
    )
    st.plotly_chart(fig, use_container_width=True)


def pie_chart(labels: list, values: list, title: str = ""):
    """Pie/donut chart wrapper.

    Args:
        labels: Category names
        values: Category values
        title: Chart title
    """
    colors_list = [Theme.colors.PRIMARY, Theme.colors.SUCCESS, Theme.colors.WARNING,
                   Theme.colors.SECONDARY, Theme.colors.DANGER, Theme.colors.NEUTRAL]
    fig = go.Figure(go.Pie(labels=labels, values=values, hole=0.5,
                           marker=dict(colors=colors_list[:len(labels)])))
    fig.update_layout(
        title=title,
        margin=dict(t=40, b=20, l=20, r=20),
        font_family="Inter, sans-serif",
        showlegend=True,
        legend=dict(orientation="h", yanchor="bottom", y=-0.1),
    )
    st.plotly_chart(fig, use_container_width=True)


def radar_chart(categories: list, values: list, title: str = "", name: str = ""):
    """Radar chart for comparing capabilities.

    Args:
        categories: Axis labels (e.g. ['CNC', 'PCB', 'Molding'])
        values: Values per category (0-100)
        title: Chart title
        name: Series name in legend
    """
    fig = go.Figure(go.Scatterpolar(
        r=values,
        theta=categories,
        fill="toself",
        name=name or "Score",
        line_color=Theme.colors.PRIMARY,
    ))
    fig.update_layout(
        polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
        title=title,
        margin=dict(t=40, b=20, l=20, r=20),
        font_family="Inter, sans-serif",
        showlegend=True,
    )
    st.plotly_chart(fig, use_container_width=True)
