"""
Timeline component — lifecycle visualization using Plotly.
Provides horizontal timeline bars and vertical state progress views.
"""

from datetime import datetime
from typing import Optional

import plotly.graph_objects as go


def render_lifecycle_progress(
    current_state: str,
    states_config: dict,
    states_order: list[str],
    height: int = 120,
) -> go.Figure:
    """
    Render a horizontal progress bar showing the lifecycle state.
    Completed states are green, current is blue/pulsing, future is gray.
    """
    current_idx = states_order.index(current_state) if current_state in states_order else 0
    total = len(states_order)

    # Build color sequence
    colors = []
    labels = []
    for i, state in enumerate(states_order):
        cfg = states_config[state]
        if i < current_idx:
            colors.append("#10B981")  # Green — completed
        elif i == current_idx:
            colors.append(cfg["color"])  # Current state color
        else:
            colors.append("#E5E7EB")  # Gray — future
        labels.append(f'{cfg["emoji"]} {cfg["label"]}')

    fig = go.Figure()

    # Add horizontal bar segments
    for i in range(total):
        fig.add_trace(go.Bar(
            x=[1],
            y=[""],
            orientation="h",
            marker_color=colors[i],
            hovertemplate=f"{labels[i]}<extra></extra>",
            showlegend=False,
            text=labels[i],
            textposition="auto",
            textfont=dict(size=9),
        ))

    fig.update_layout(
        barmode="stack",
        height=height,
        margin=dict(t=10, b=10, l=10, r=10),
        xaxis=dict(visible=False),
        yaxis=dict(visible=False),
        showlegend=False,
    )

    return fig


def render_lifecycle_timeline(
    history: list[dict],
    title: str = "Request Lifecycle Timeline",
    height: int = 400,
) -> go.Figure:
    """
    Render a vertical timeline of state transitions for a single request.
    Each entry shows: state emoji, state name, timestamp, who triggered it, notes.
    """
    if not history:
        fig = go.Figure()
        fig.update_layout(
            title=title,
            height=height,
            xaxis=dict(visible=False),
            yaxis=dict(visible=False),
            annotations=[dict(text="No history yet", x=0.5, y=0.5, showarrow=False, font=dict(size=16, color="#9CA3AF"))],
        )
        return fig

    fig = go.Figure()

    # Timeline data
    n = len(history)
    y_positions = list(range(n, 0, -1))  # Top to bottom

    # Central line
    fig.add_trace(go.Scatter(
        x=[0.5, 0.5],
        y=[min(y_positions) - 0.3, max(y_positions) + 0.3],
        mode="lines",
        line=dict(color="#CBD5E1", width=3),
        hoverinfo="skip",
        showlegend=False,
    ))

    # State nodes
    for i, entry in enumerate(history):
        y = y_positions[i]
        state = entry.get("state", "UNKNOWN")
        is_revert = "reverted_from" in entry

        # Color
        color = "#3B82F6" if not is_revert else "#EF4444"

        # Node circle
        fig.add_trace(go.Scatter(
            x=[0.5],
            y=[y],
            mode="markers+text",
            marker=dict(size=18, color=color, line=dict(width=2, color="white")),
            text=[state[:3]],  # Abbreviated state
            textposition="middle center",
            textfont=dict(size=8, color="white", family="monospace"),
            hovertemplate=(
                f"<b>{state}</b><br>"
                f"Time: {entry.get('entered_at', 'N/A')}<br>"
                f"By: {entry.get('entered_by', 'N/A')}<br>"
                f"Note: {entry.get('note', '—')}<extra></extra>"
            ),
            showlegend=False,
        ))

        # Left label: state name
        fig.add_annotation(
            x=0.35, y=y,
            text=f"<b>{state}</b>" + (" ↩️" if is_revert else ""),
            showarrow=False,
            font=dict(size=11, color=color),
            xanchor="right",
        )

        # Right label: timestamp + actor
        ts = entry.get("entered_at", "")
        # Shorten timestamp
        if "T" in ts:
            ts_short = ts.split("T")[1][:5] if "+" not in ts.split("T")[1] else ts.split("T")[1][:8]
        else:
            ts_short = ts[:10]

        right_text = f"{entry.get('entered_by', '?')} · {ts_short}"
        if entry.get("note"):
            right_text += f"<br><i>{entry['note'][:60]}</i>"

        fig.add_annotation(
            x=0.65, y=y,
            text=right_text,
            showarrow=False,
            font=dict(size=9, color="#6B7280"),
            xanchor="left",
        )

    fig.update_layout(
        title=dict(text=title, font=dict(size=14)),
        height=max(height, n * 60 + 80),
        margin=dict(t=40, b=20, l=20, r=20),
        xaxis=dict(visible=False, range=[0, 1]),
        yaxis=dict(visible=False, range=[min(y_positions) - 0.5, max(y_positions) + 0.5]),
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        showlegend=False,
    )

    return fig


def render_multi_request_gantt(
    lifecycles: list[dict],
    states_config: dict,
    states_order: list[str],
    height: int = 400,
) -> go.Figure:
    """
    Render a Gantt-like view showing multiple requests and their progress.
    Each request is a horizontal bar colored by current state.
    """
    if not lifecycles:
        fig = go.Figure()
        fig.update_layout(
            title="Request Progress Overview",
            height=height,
            xaxis=dict(visible=False),
            yaxis=dict(visible=False),
            annotations=[dict(text="No requests tracked yet", x=0.5, y=0.5, showarrow=False)],
        )
        return fig

    # Sort by progress (ascending so most advanced at top)
    sorted_lc = sorted(lifecycles, key=lambda x: x.get("progress", 0), reverse=True)

    request_ids = [lc["request_id"] for lc in sorted_lc]
    progresses = [lc.get("progress", 0) for lc in sorted_lc]
    states = [lc.get("current_state", "DRAFT") for lc in sorted_lc]

    colors = []
    for s in states:
        colors.append(states_config.get(s, {}).get("color", "#6B7280"))

    fig = go.Figure()
    for i, (req_id, progress, color, state) in enumerate(zip(request_ids, progresses, colors, states)):
        label = f"{req_id} — {states_config.get(state, {}).get('label', state)}"
        emoji = states_config.get(state, {}).get("emoji", "")
        fig.add_trace(go.Bar(
            y=[label],
            x=[progress * 100],
            orientation="h",
            marker_color=color,
            hovertemplate=f"{emoji} {state} — {progress*100:.0f}%<extra></extra>",
            showlegend=False,
            text=f"{emoji} {progress*100:.0f}%",
            textposition="outside",
            textfont=dict(size=10),
        ))

    fig.update_layout(
        barmode="stack",
        title=dict(text="Request Progress Overview", font=dict(size=14)),
        height=max(height, len(sorted_lc) * 45 + 80),
        margin=dict(t=40, b=30, l=20, r=80),
        xaxis=dict(
            title="Progress %",
            range=[0, 105],
            tickformat=",.0f",
            gridcolor="#F1F5F9",
        ),
        yaxis=dict(
            categoryorder="total ascending",
            gridcolor="#F1F5F9",
        ),
        showlegend=False,
        plot_bgcolor="white",
    )

    return fig


def render_pipeline_kanban(
    by_stage: dict,
    stages_order: list[str],
    height: int = 500,
) -> go.Figure:
    """
    Render a pipeline kanban-style bar chart showing ticket counts per stage.
    """
    stages = [s for s in stages_order if by_stage.get(s, 0) > 0]
    counts = [by_stage.get(s, 0) for s in stages]

    if not stages:
        fig = go.Figure()
        fig.update_layout(
            height=height,
            xaxis=dict(visible=False),
            yaxis=dict(visible=False),
            annotations=[dict(text="No tickets in pipeline", x=0.5, y=0.5, showarrow=False)],
        )
        return fig

    # Color gradient from red (PLAN) to green (DONE)
    stage_colors = {
        "PLAN": "#6366F1",
        "CODE": "#3B82F6",
        "REVIEW": "#F59E0B",
        "TEST": "#F97316",
        "DEPLOY": "#10B981",
        "DONE": "#059669",
        "BLOCKER": "#EF4444",
    }

    colors = [stage_colors.get(s, "#94A3B8") for s in stages]

    fig = go.Figure(go.Bar(
        x=stages,
        y=counts,
        marker_color=colors,
        text=counts,
        textposition="auto",
        textfont=dict(size=14, color="white", family="monospace"),
        hovertemplate="<b>%{x}</b><br>%{y} ticket(s)<extra></extra>",
    ))

    fig.update_layout(
        title=dict(text="Pipeline Overview", font=dict(size=14)),
        height=height,
        yaxis=dict(
            title="Tickets",
            gridcolor="#F1F5F9",
            tickformat=",d",
        ),
        xaxis=dict(gridcolor="#F1F5F9"),
        plot_bgcolor="white",
        showlegend=False,
    )

    return fig
