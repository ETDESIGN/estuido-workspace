"""
Design System Configuration — Sourcing Agent Dashboard
Centralized color palette, typography, spacing, and CSS generation.

Usage:
    from config import Theme
    Theme.css()          # returns full <style> block
    Theme.colors.PRIMARY  # '#3B82F6'
    Theme.spacing(4)      # '16px'
"""

# ─── Color Palette ────────────────────────────────────────────────────

class Colors:
    """Named color tokens matching the design spec."""
    PRIMARY    = "#3B82F6"   # blue-500   — Actions, links, active states
    SECONDARY  = "#8B5CF6"   # violet-500 — Accents, highlights
    SUCCESS    = "#10B981"   # emerald-500— Approved, completed
    WARNING    = "#F59E0B"   # amber-500  — Pending, attention needed
    DANGER     = "#EF4444"   # red-500    — Blocked, rejected, errors
    NEUTRAL    = "#64748B"   # slate-500  — Secondary text
    BG         = "#F8FAFC"   # slate-50   — Page background
    SURFACE    = "#FFFFFF"   #            — Card backgrounds
    BORDER     = "#E2E8F0"   # slate-200  — Borders, dividers

    # Semantic text colors
    TEXT_HEADING = "#0F172A"  # slate-900
    TEXT_BODY    = "#334155"  # slate-700
    TEXT_CAPTION = "#94A3B8"  # slate-400

    # Status map (used by badges, tables, cards)
    STATUS = {
        "in_progress":      {"color": "#3B82F6", "bg": "#EFF6FF", "label": "In Progress"},
        "rfq_sent":         {"color": "#F59E0B", "bg": "#FFFBEB", "label": "RFQ Sent"},
        "awaiting_approval":{"color": "#8B5CF6", "bg": "#F5F3FF", "label": "Awaiting Approval"},
        "approved":         {"color": "#10B981", "bg": "#ECFDF5", "label": "Approved"},
        "rejected":         {"color": "#EF4444", "bg": "#FEF2F2", "label": "Rejected"},
        "completed":        {"color": "#10B981", "bg": "#ECFDF5", "label": "Completed"},
        "draft":            {"color": "#64748B", "bg": "#F1F5F9", "label": "Draft"},
        "blocked":          {"color": "#EF4444", "bg": "#FEF2F2", "label": "Blocked"},
        "active":           {"color": "#3B82F6", "bg": "#EFF6FF", "label": "Active"},
        "cancelled":        {"color": "#94A3B8", "bg": "#F8FAFC", "label": "Cancelled"},
    }

    # Priority map
    PRIORITY = {
        "p0":    {"color": "#EF4444", "label": "P0 Critical"},
        "p1":    {"color": "#F59E0B", "label": "P1 High"},
        "p2":    {"color": "#3B82F6", "label": "P2 Medium"},
        "p3":    {"color": "#64748B", "label": "P3 Low"},
        "high":  {"color": "#EF4444", "label": "High"},
        "medium":{"color": "#F59E0B", "label": "Medium"},
        "low":   {"color": "#10B981", "label": "Low"},
    }


# ─── Typography ───────────────────────────────────────────────────────

class Typography:
    """System font stack and size scale."""
    FONT_SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    FONT_MONO = "'SF Mono', 'Cascadia Code', 'Fira Code', Consolas, monospace"
    HEADING_COLOR = "#0F172A"
    BODY_COLOR    = "#334155"
    CAPTION_COLOR = "#94A3B8"


# ─── Spacing ──────────────────────────────────────────────────────────

class Spacing:
    """4px base unit spacing scale."""
    _BASE = 4
    _VALUES = {
        0.5: 2,   1: 4,   1.5: 6,   2: 8,   2.5: 10,
        3: 12,    4: 16,  5: 20,    6: 24,  7: 28,
        8: 32,   10: 40,  12: 48,   16: 64,
    }

    @classmethod
    def px(cls, unit: float) -> str:
        """Return pixel string for a spacing unit. E.g. Spacing.px(4) → '16px'."""
        return f"{cls._VALUES.get(unit, int(unit * cls._BASE))}px"

    @classmethod
    def rem(cls, unit: float) -> str:
        """Return rem string. E.g. Spacing.rem(4) → '1rem'."""
        return f"{cls._VALUES.get(unit, int(unit * cls._BASE)) / 16}rem"


# ─── Border Radius ────────────────────────────────────────────────────

class Radius:
    CARD   = "8px"
    BUTTON = "6px"
    INPUT  = "6px"
    BADGE  = "9999px"  # pill shape
    AVATAR = "50%"


# ─── Theme (facade) ───────────────────────────────────────────────────

class Theme:
    """Unified access to all design tokens."""
    colors    = Colors
    typography = Typography
    spacing   = Spacing
    radius    = Radius

    @staticmethod
    def css(extra: str = "") -> str:
        """Return a full <style> block with the design system CSS.

        Args:
            extra: Additional CSS rules to append inside the style tag.

        Returns:
            HTML <style> string ready for st.markdown(..., unsafe_allow_html=True).
        """
        c = Colors
        r = Radius
        return f"""<style>
/* ── Design System: Component Library ── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Base */
.comp-card {{
    background: {c.SURFACE};
    border: 1px solid {c.BORDER};
    border-radius: {r.CARD};
    padding: {Spacing.px(4)};
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
}}
.comp-card:hover {{
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    border-color: {c.PRIMARY}33;
}}

/* Metric card */
.comp-metric-card {{
    background: {c.SURFACE};
    border: 1px solid {c.BORDER};
    border-radius: {r.CARD};
    padding: {Spacing.px(4)};
    text-align: center;
}}
.comp-metric-card .metric-label {{
    font-size: 13px;
    color: {c.TEXT_CAPTION};
    font-weight: 500;
    margin-bottom: {Spacing.px(1)};
}}
.comp-metric-card .metric-value {{
    font-size: 28px;
    font-weight: 700;
    color: {c.TEXT_HEADING};
    line-height: 1.2;
}}
.comp-metric-card .metric-delta {{
    font-size: 13px;
    font-weight: 500;
    margin-top: {Spacing.px(1)};
}}

/* Status badge */
.comp-badge {{
    display: inline-block;
    padding: 2px 10px;
    border-radius: {r.BADGE};
    font-size: 12px;
    font-weight: 600;
    line-height: 1.6;
}}

/* Section header */
.comp-section-title {{
    font-size: 16px;
    font-weight: 600;
    color: {c.TEXT_HEADING};
    margin-bottom: {Spacing.px(3)};
}}

/* Info card with left border */
.comp-info-card {{
    background: {c.SURFACE};
    border-left: 4px solid {c.PRIMARY};
    border-radius: {r.CARD};
    padding: {Spacing.px(4)};
}}

/* Page header */
.comp-page-header {{
    margin-bottom: {Spacing.px(4)};
}}
.comp-page-header h1 {{
    font-size: 24px;
    font-weight: 700;
    color: {c.TEXT_HEADING};
    margin: 0 0 {Spacing.px(1)} 0;
}}
.comp-page-header .subtitle {{
    font-size: 14px;
    color: {c.TEXT_CAPTION};
}}

/* Sidebar section */
.comp-sidebar-section {{
    margin-bottom: {Spacing.px(4)};
}}
.comp-sidebar-section h3 {{
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94A3B8;
    margin-bottom: {Spacing.px(2)};
}}

/* Data table */
.comp-table {{
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}}
.comp-table th {{
    background: {c.BG};
    padding: {Spacing.px(2)} {Spacing.px(3)};
    font-size: 12px;
    font-weight: 600;
    color: {c.NEUTRAL};
    text-align: left;
    border-bottom: 1px solid {c.BORDER};
}}
.comp-table td {{
    padding: {Spacing.px(2)} {Spacing.px(3)};
    font-size: 13px;
    color: {c.TEXT_BODY};
    border-bottom: 1px solid {c.BORDER};
}}
.comp-table tr:hover td {{
    background: {c.BG};
}}

/* Breadcrumb */
.comp-breadcrumb {{
    font-size: 13px;
    color: {c.NEUTRAL};
    margin-bottom: {Spacing.px(3)};
}}
.comp-breadcrumb a {{
    color: {c.PRIMARY};
    text-decoration: none;
}}
.comp-breadcrumb a:hover {{
    text-decoration: underline;
}}
.comp-breadcrumb .separator {{
    margin: 0 {Spacing.px(2)};
    color: {c.BORDER};
}}

/* Chart container */
.comp-chart {{
    background: {c.SURFACE};
    border: 1px solid {c.BORDER};
    border-radius: {r.CARD};
    padding: {Spacing.px(3)};
}}

{extra}
</style>"""
