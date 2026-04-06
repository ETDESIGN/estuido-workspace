"""
Planning Service — reads/writes PIPELINE.md and individual ticket .md files.
File-based task management: no database, pure filesystem.
"""

import json
import re
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# ─── Paths ───────────────────────────────────────────────────────────
BASE_DIR = Path.home() / ".openclaw" / "workspace"
TASKS_DIR = BASE_DIR / "memory" / "tasks"
PIPELINE_PATH = TASKS_DIR / "PIPELINE.md"
REQUESTS_DIR = BASE_DIR / "sourcing-agent" / "customers"

# Pipeline stages
PIPELINE_STAGES = ["PLAN", "CODE", "REVIEW", "TEST", "DEPLOY", "DONE", "BLOCKER"]

# Priority order for sorting
PRIORITY_ORDER = {"P0": 0, "P1": 1, "P2": 2, "P3": 3}

# Status emoji map
STATUS_EMOJI = {
    "todo": "⏳ Queued",
    "in-progress": "🔨 In Progress",
    "in_review": "👀 In Review",
    "blocked": "🚫 Blocked",
    "done": "✅ Done",
    "superseded": "⏭️ Superseded",
}

# Time blocks for sprint grouping
TIME_BLOCKS = {
    "morning": {"label": "🌅 Morning", "range": "09:00–12:00"},
    "afternoon": {"label": "☀️ Afternoon", "range": "12:00–15:00"},
    "evening": {"label": "🌙 Evening", "range": "15:00–18:00"},
    "night": {"label": " latenight", "range": "18:00–24:00"},
}


class TaskService:
    """Read/write interface for tasks and the pipeline."""

    def __init__(self, tasks_dir: Path = None, pipeline_path: Path = None):
        self.tasks_dir = tasks_dir or TASKS_DIR
        self.pipeline_path = pipeline_path or PIPELINE_PATH

    # ─── PIPELINE.md ────────────────────────────────────────────────

    def read_pipeline(self) -> dict:
        """Parse PIPELINE.md into a structured dict."""
        if not self.pipeline_path.exists():
            return {"tickets": [], "completed": [], "schedule": []}

        text = self.pipeline_path.read_text(encoding="utf-8")
        result = {
            "tickets": [],
            "completed": [],
            "schedule": [],
            "project": "",
            "session": "",
        }

        # Extract project name
        m = re.search(r"\*\*Current project:\*\*\s*(.+)", text)
        if m:
            result["project"] = m.group(1).strip()

        # Extract work session
        m = re.search(r"\*\*Work session:\*\*\s*(.+)", text)
        if m:
            result["session"] = m.group(1).strip()

        # Parse the active pipeline table
        # Find the table between "| Ticket | Stage |" and the next section
        table_match = re.search(
            r"\| Ticket \| Stage \| Assignee \| Priority \| Status \| Updated \|\n"
            r"(\|.+\|\n)*",
            text,
        )
        if table_match:
            for line in table_match.group(0).strip().split("\n")[2:]:  # skip header + separator
                parts = [p.strip() for p in line.split("|")]
                if len(parts) >= 8:
                    ticket_id = parts[1].split()[0]  # e.g. "T-003 Frontend..." -> "T-003"
                    result["tickets"].append({
                        "ticket_id": ticket_id,
                        "title": parts[1].strip(),
                        "stage": parts[2].strip(),
                        "assignee": parts[3].strip(),
                        "priority": parts[4].strip(),
                        "status": parts[5].strip(),
                        "updated": parts[6].strip(),
                    })

        # Parse completed tickets
        completed_section = re.search(r"## Completed Tickets\n\n(.+?)(?=\n## |\Z)", text, re.DOTALL)
        if completed_section:
            for line in completed_section.group(1).strip().split("\n"):
                if line.startswith("- "):
                    result["completed"].append(line.lstrip("- ").strip())

        # Parse session schedule
        schedule_section = re.search(r"## Session Schedule.*?\n\n(.+?)(?=\n## |\Z)", text, re.DOTALL)
        if schedule_section:
            for line in schedule_section.group(1).strip().split("\n"):
                parts = [p.strip() for p in line.split("|")]
                if len(parts) >= 5 and parts[0]:
                    result["schedule"].append({
                        "time": parts[1].strip(),
                        "block": parts[2].strip(),
                        "lead": parts[3].strip(),
                        "support": parts[4].strip(),
                    })

        return result

    def update_ticket_stage(self, ticket_id: str, new_stage: str, updated_by: str = "dashboard") -> bool:
        """Update a ticket's stage in PIPELINE.md. Validates stage."""
        new_stage = new_stage.upper().strip()
        if new_stage not in PIPELINE_STAGES:
            return False

        text = self.pipeline_path.read_text(encoding="utf-8")

        # Find and replace the ticket's stage in the table
        pattern = rf"(\| {re.escape(ticket_id)}[^\|]*\|)\s*[^|]+\|([^|]+\|[^|]+\|[^|]+\|)"
        new_time = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        def replacer(m):
            return f"{m.group(1)} {new_stage} |{m.group(2)} {new_time} |"

        new_text, count = re.subn(pattern, replacer, text)
        if count == 0:
            return False

        self.pipeline_path.write_text(new_text, encoding="utf-8")
        return True

    # ─── Individual Ticket Files ─────────────────────────────────────

    def list_tickets(self) -> list[dict]:
        """List all ticket .md files with parsed metadata."""
        tickets = []
        for f in sorted(self.tasks_dir.glob("T-*.md")):
            ticket = self._parse_ticket_file(f)
            if ticket:
                tickets.append(ticket)
        return tickets

    def get_ticket(self, ticket_id: str) -> Optional[dict]:
        """Read a specific ticket by ID (e.g. 'T-006')."""
        # Try both with and without file extension
        for pattern in [f"{ticket_id}*.md", f"{ticket_id}*.md"]:
            matches = list(self.tasks_dir.glob(pattern))
            if matches:
                return self._parse_ticket_file(matches[0])
        return None

    def update_ticket_status(self, ticket_id: str, new_status: str, updated_by: str = "dashboard", note: str = "") -> bool:
        """Update a ticket's status field in its .md file."""
        valid_statuses = list(STATUS_EMOJI.keys()) + ["todo", "in-progress", "in_review", "blocked", "done", "superseded"]
        new_status = new_status.lower().strip()
        if new_status not in valid_statuses:
            return False

        # Find the ticket file
        matches = list(self.tasks_dir.glob(f"{ticket_id}*.md"))
        if not matches:
            return False

        filepath = matches[0]
        text = filepath.read_text(encoding="utf-8")

        # Update Status line
        text = re.sub(
            r"\*\*Status:\*\*\s*.+",
            f"**Status:** {new_status}",
            text,
        )

        # Add/update Review Log entry
        now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
        if "## Review Log" in text:
            # Append to review log table
            entry = f"\n| {now} | {updated_by} | — | Status → {new_status}"
            if note:
                entry += f"; {note}"
            entry += " |"
            text = text.rstrip() + entry + "\n"
        else:
            text += f"\n\n## Review Log\n| Date | Reviewer | Verdict | Notes |\n|------|----------|---------|-------|\n| {now} | {updated_by} | — | Status → {new_status}"
            if note:
                text += f"; {note}"
            text += " |\n"

        filepath.write_text(text, encoding="utf-8")
        return True

    def _parse_ticket_file(self, filepath: Path) -> Optional[dict]:
        """Parse a ticket .md file into a structured dict."""
        try:
            text = filepath.read_text(encoding="utf-8")
        except Exception:
            return None

        ticket = {"file": str(filepath), "filename": filepath.name}

        # Extract front-matter fields
        for field in ["Priority", "Assignee", "Dependencies", "Status", "Created", "Project", "Time block"]:
            m = re.search(rf"\*\*{re.escape(field)}:\*\*\s*(.+)", text)
            if m:
                key = field.lower().replace(" ", "_").replace("-", "_")
                ticket[key] = m.group(1).strip()

        # Extract title from first # heading
        m = re.match(r"#\s+(.+)", text)
        if m:
            ticket["title"] = m.group(1).strip()

        # Extract ticket ID from title or filename
        m = re.match(r"(T-\d+)", ticket.get("title", filepath.stem))
        if m:
            ticket["id"] = m.group(1)
        else:
            m = re.match(r"(T-\d+)", filepath.stem)
            if m:
                ticket["id"] = m.group(1)

        # Extract description (first paragraph after ## Description)
        desc_match = re.search(r"## Description\n+(.+?)(?=\n## |\n---|\Z)", text, re.DOTALL)
        if desc_match:
            ticket["description"] = desc_match.group(1).strip()[:500]

        # Extract acceptance criteria (checkboxes)
        criteria = []
        for m in re.finditer(r"- \[([ xX])\]\s*(.+)", text):
            criteria.append({"done": m.group(1).lower() == "x", "text": m.group(2).strip()})
        if criteria:
            ticket["acceptance_criteria"] = criteria

        # Extract files section
        files_match = re.search(r"## Files to Create/Modify\n+(.+?)(?=\n## |\Z)", text, re.DOTALL)
        if files_match:
            ticket["files"] = [f.strip().lstrip("- ") for f in files_match.group(1).strip().split("\n") if f.strip()]

        return ticket

    # ─── Helpers ─────────────────────────────────────────────────────

    def get_pipeline_summary(self) -> dict:
        """Return a summary of the pipeline for the dashboard."""
        pipeline = self.read_pipeline()
        tickets = self.list_tickets()

        # Merge pipeline stage info with ticket details
        for t in tickets:
            for p in pipeline["tickets"]:
                if t.get("id") == p["ticket_id"]:
                    t["stage"] = p["stage"]
                    break

        # Count by stage
        by_stage = {}
        for stage in PIPELINE_STAGES:
            by_stage[stage] = len([t for t in tickets if t.get("stage") == stage])

        # Count by assignee
        by_assignee = {}
        for t in tickets:
            assignee = t.get("assignee", "unassigned")
            # Simplify assignee for grouping (take first before "+")
            primary = assignee.split("+")[0].strip()
            by_assignee[primary] = by_assignee.get(primary, 0) + 1

        # Count by priority
        by_priority = {}
        for t in tickets:
            p = t.get("priority", "P2")
            by_priority[p] = by_priority.get(p, 0) + 1

        return {
            "project": pipeline.get("project", ""),
            "session": pipeline.get("session", ""),
            "tickets": tickets,
            "by_stage": by_stage,
            "by_assignee": by_assignee,
            "by_priority": by_priority,
            "completed": pipeline.get("completed", []),
            "schedule": pipeline.get("schedule", []),
        }

    def get_tasks_by_time_block(self) -> dict:
        """Group tickets by their time block for sprint view."""
        tickets = self.list_tickets()
        groups = {key: [] for key in TIME_BLOCKS}
        groups["unscheduled"] = []

        for t in tickets:
            block_str = t.get("time_block", "")
            matched = False
            for key, info in TIME_BLOCKS.items():
                if key in block_str.lower():
                    groups[key].append(t)
                    matched = True
                    break
            if not matched:
                groups["unscheduled"].append(t)

        return groups


# ─── Standup Tracker ─────────────────────────────────────────────────

STANDUP_DIR = BASE_DIR / "sourcing-agent" / "standups"

def save_standup(agent: str, did: str, doing: str, blockers: str, date: str = None) -> Path:
    """Save a daily standup entry. Returns the file path."""
    STANDUP_DIR.mkdir(parents=True, exist_ok=True)
    date = date or datetime.now().strftime("%Y-%m-%d")
    filepath = STANDUP_DIR / f"{date}.md"

    # Read existing or create new
    if filepath.exists():
        text = filepath.read_text(encoding="utf-8")
    else:
        text = f"# Daily Standup — {date}\n\n"

    now = datetime.now(timezone.utc).strftime("%H:%M UTC")
    entry = f"\n## {agent} ({now})\n\n"
    entry += f"**What I did:** {did}\n\n"
    entry += f"**What I'm doing:** {doing}\n\n"
    entry += f"**Blockers:** {blockers or 'None'}\n"

    # Append entry (avoid duplicates for same agent on same day)
    if f"## {agent} " in text:
        # Replace existing entry for this agent today
        pattern = rf"## {re.escape(agent)}[^\n]*\n\n.*?(?=\n## |\Z)"
        text = re.sub(pattern, entry.strip() + "\n", text, flags=re.DOTALL)
    else:
        text += entry

    filepath.write_text(text, encoding="utf-8")
    return filepath


def load_standups(days: int = 7) -> list[dict]:
    """Load recent standup entries."""
    STANDUP_DIR.mkdir(parents=True, exist_ok=True)
    entries = []
    from datetime import timedelta
    cutoff = datetime.now() - timedelta(days=days)

    for f in sorted(STANDUP_DIR.glob("*.md"), reverse=True):
        # Parse date from filename
        try:
            date_str = f.stem
            date = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            continue

        if date < cutoff:
            continue

        text = f.read_text(encoding="utf-8")
        # Parse individual entries
        for m in re.finditer(r"## (.+?) \((.+?)\)\n\n\*\*What I did:\*\*\s*(.+?)\n\n\*\*What I'm doing:\*\*\s*(.+?)\n\n\*\*Blockers:\*\*\s*(.+?)(?=\n## |\Z)", text, re.DOTALL):
            entries.append({
                "date": date_str,
                "agent": m.group(1).strip(),
                "time": m.group(2).strip(),
                "did": m.group(3).strip(),
                "doing": m.group(4).strip(),
                "blockers": m.group(5).strip(),
            })

    return entries
