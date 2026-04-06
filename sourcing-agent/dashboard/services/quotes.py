"""
Quote generation service — wraps the quote-invoice-workbench tool.

Provides a clean interface for the dashboard to generate quotes
without importing Streamlit into the tool layer.
"""

import json
import sys
from pathlib import Path
from io import BytesIO
from datetime import datetime
from typing import Optional

BASE_DIR = Path.home() / ".openclaw" / "workspace" / "sourcing-agent"
SUPPLIERS_DIR = BASE_DIR / "suppliers"
CUSTOMERS_DIR = BASE_DIR / "customers"


def generate_pdf_report(selected_suppliers: list[dict], jobs: list[dict]) -> Optional[bytes]:
    """Generate a professional PDF comparison report using WeasyPrint.

    Returns PDF bytes or None if WeasyPrint is unavailable.
    """
    try:
        from weasyprint import HTML
    except ImportError:
        return None

    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    active = [j for j in jobs if j.get("status") in ("in_progress", "rfq_sent", "awaiting_approval")]

    rows = ""
    for s in selected_suppliers:
        n = s.get("name", s.get("name_en", "Unknown"))
        c = s.get("capabilities", {})
        rows += (
            f"<tr><td><b>{n}</b></td>"
            f"<td>{s.get('location',{}).get('city','?')}</td>"
            f"<td>{s.get('platforms',{}).get('1688',{}).get('rating','?')}</td>"
            f"<td>{s.get('performance',{}).get('quality_score','?')}</td>"
            f"<td>{s.get('performance',{}).get('on_time_delivery','?')}%</td>"
            f"<td>{s.get('platforms',{}).get('1688',{}).get('response_rate','?')}%</td>"
            f"<td>{s.get('pricing',{}).get('moq','?')}</td>"
            f"<td>{'✅' if c.get('cnc') else '—'}</td>"
            f"<td>{'✅' if c.get('injection_molding') else '—'}</td>"
            f"<td>{'✅' if c.get('pcb') else '—'}</td></tr>"
        )

    profiles = ""
    for s in selected_suppliers:
        n = s.get("name", s.get("name_en", "Unknown"))
        profiles += (
            f"<h3>{n}</h3>"
            f"<p>{s.get('name_cn','')} | 📍 {s.get('location',{}).get('city','')}, "
            f"{s.get('location',{}).get('district','')} | "
            f"🔧 {', '.join(s.get('specialties',[]))} | "
            f"🏅 {', '.join(s.get('certifications',[]))}</p>"
            f"<p>📦 {', '.join(s.get('capabilities',{}).get('materials',[]))}</p>"
            f"<p>⏱️ {s.get('platforms',{}).get('1688',{}).get('years_active','?')}yr | "
            f"💰 MOQ:{s.get('pricing',{}).get('moq','?')} | "
            f"Sample:${s.get('pricing',{}).get('sample_cost','?')}</p><hr>"
        )

    job_rows = ""
    for j in (active or jobs[:5]):
        job_rows += (
            f"<tr><td>{j.get('id','')}</td><td>{j.get('project','')}</td>"
            f"<td>{j.get('customer','')}</td><td>{j.get('product_type','')}</td>"
            f"<td>{j.get('quantity','')}</td><td>{j.get('status','')}</td></tr>"
        )

    html_body = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{{font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;margin:40px}}
    h1{{color:#1e40af;border-bottom:3px solid #3b82f6;padding-bottom:8px}}
    h2{{color:#334155;margin-top:24px}}h3{{color:#475569}}
    table{{width:100%;border-collapse:collapse;margin:12px 0;font-size:13px}}
    th{{background:#1e40af;color:#fff;padding:8px 12px;text-align:left}}
    td{{border:1px solid #e2e8f0;padding:6px 12px}}
    tr:nth-child(even){{background:#f8fafc}}
    .m{{color:#64748b;font-size:12px;margin-bottom:20px}}
    .sb{{background:#f1f5f9;border-left:4px solid #3b82f6;padding:16px;margin:16px 0}}
    .ft{{margin-top:40px;padding-top:12px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:11px}}
    </style></head><body>
    <h1>🏭 Supplier Comparison Report</h1>
    <p class="m">Generated: {now} | E-Studio Sourcing Agent</p>
    <div class="sb"><b>Summary:</b> {len(selected_suppliers)} suppliers | {len(active)} active request(s)</div>
    <h2>📊 Comparison Matrix</h2>
    <table><thead><tr><th>Supplier</th><th>City</th><th>Rating</th><th>Quality</th>
    <th>On-Time</th><th>Response</th><th>MOQ</th><th>CNC</th><th>Inj.</th><th>PCB</th>
    </tr></thead><tbody>{rows}</tbody></table>
    <h2>📋 Profiles</h2>{profiles}
    <h2>📋 Active Requests</h2>
    <table><thead><tr><th>ID</th><th>Project</th><th>Customer</th><th>Type</th><th>Qty</th><th>Status</th>
    </tr></thead><tbody>{job_rows}</tbody></table>
    <div class="ft"><p>E-Studio Sourcing Agent — Confidential</p></div></body></html>"""

    buf = BytesIO()
    HTML(string=html_body).write_pdf(buf)
    buf.seek(0)
    return buf.getvalue()
