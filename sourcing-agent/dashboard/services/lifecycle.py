"""
Request Lifecycle Service — state machine for sourcing request workflows.

States:
    DRAFT → SUBMITTED → RFQ_SENT → QUOTES_RECEIVED → REVIEWING →
    APPROVED → SAMPLE_ORDERED → SAMPLE_APPROVED → PO_ISSUED →
    IN_PRODUCTION → QC_PASSED → SHIPPED → DELIVERED → CLOSED

Transitions are validated — you cannot skip states.
Backward transitions are allowed for corrections (with a reason).
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# ─── Paths ───────────────────────────────────────────────────────────
BASE_DIR = Path.home() / ".openclaw" / "workspace"
LIFECYCLE_DIR = BASE_DIR / "sourcing-agent" / "lifecycle"
LIFECYCLE_DIR.mkdir(parents=True, exist_ok=True)

# ─── State Definitions ───────────────────────────────────────────────

LIFECYCLE_STATES = [
    "DRAFT",
    "SUBMITTED",
    "RFQ_SENT",
    "QUOTES_RECEIVED",
    "REVIEWING",
    "APPROVED",
    "SAMPLE_ORDERED",
    "SAMPLE_APPROVED",
    "PO_ISSUED",
    "IN_PRODUCTION",
    "QC_PASSED",
    "SHIPPED",
    "DELIVERED",
    "CLOSED",
]

# Each state maps to: (allowed_next_states, display_config)
STATE_CONFIG = {
    "DRAFT": {
        "next": ["SUBMITTED"],
        "emoji": "📝",
        "label": "Draft",
        "color": "#6B7280",
        "bg": "#F3F4F6",
        "description": "Request is being drafted, not yet submitted",
    },
    "SUBMITTED": {
        "next": ["RFQ_SENT"],
        "emoji": "📤",
        "label": "Submitted",
        "color": "#3B82F6",
        "bg": "#EFF6FF",
        "description": "Request submitted, awaiting RFQ dispatch",
    },
    "RFQ_SENT": {
        "next": ["QUOTES_RECEIVED"],
        "emoji": "📧",
        "label": "RFQ Sent",
        "color": "#F59E0B",
        "bg": "#FFFBEB",
        "description": "RFQ sent to suppliers, waiting for quotes",
    },
    "QUOTES_RECEIVED": {
        "next": ["REVIEWING"],
        "emoji": "📋",
        "label": "Quotes Received",
        "color": "#8B5CF6",
        "bg": "#F5F3FF",
        "description": "Supplier quotes received, ready for review",
    },
    "REVIEWING": {
        "next": ["APPROVED"],
        "emoji": "🔍",
        "label": "Reviewing",
        "color": "#8B5CF6",
        "bg": "#F5F3FF",
        "description": "Quotes and suppliers being reviewed",
    },
    "APPROVED": {
        "next": ["SAMPLE_ORDERED"],
        "emoji": "✅",
        "label": "Approved",
        "color": "#10B981",
        "bg": "#ECFDF5",
        "description": "Supplier selected, sample ordering authorized",
    },
    "SAMPLE_ORDERED": {
        "next": ["SAMPLE_APPROVED"],
        "emoji": "📦",
        "label": "Sample Ordered",
        "color": "#06B6D4",
        "bg": "#ECFEFF",
        "description": "Sample ordered from selected supplier",
    },
    "SAMPLE_APPROVED": {
        "next": ["PO_ISSUED"],
        "emoji": "🏆",
        "label": "Sample Approved",
        "color": "#10B981",
        "bg": "#ECFDF5",
        "description": "Sample received and approved, ready for PO",
    },
    "PO_ISSUED": {
        "next": ["IN_PRODUCTION"],
        "emoji": "📄",
        "label": "PO Issued",
        "color": "#2563EB",
        "bg": "#DBEAFE",
        "description": "Purchase order issued to supplier",
    },
    "IN_PRODUCTION": {
        "next": ["QC_PASSED"],
        "emoji": "🏭",
        "label": "In Production",
        "color": "#F97316",
        "bg": "#FFF7ED",
        "description": "Order is being manufactured",
    },
    "QC_PASSED": {
        "next": ["SHIPPED"],
        "emoji": "✓",
        "label": "QC Passed",
        "color": "#10B981",
        "bg": "#ECFDF5",
        "description": "Quality control inspection passed",
    },
    "SHIPPED": {
        "next": ["DELIVERED"],
        "emoji": "🚚",
        "label": "Shipped",
        "color": "#3B82F6",
        "bg": "#EFF6FF",
        "description": "Goods shipped from supplier",
    },
    "DELIVERED": {
        "next": ["CLOSED"],
        "emoji": "📥",
        "label": "Delivered",
        "color": "#10B981",
        "bg": "#ECFDF5",
        "description": "Goods delivered to customer",
    },
    "CLOSED": {
        "next": [],
        "emoji": "🏁",
        "label": "Closed",
        "color": "#6B7280",
        "bg": "#F3F4F6",
        "description": "Request fully completed and archived",
    },
}

# Build valid transitions: (from_state, to_state) -> allowed
VALID_TRANSITIONS = set()
for state, config in STATE_CONFIG.items():
    for next_state in config["next"]:
        VALID_TRANSITIONS.add((state, next_state))

# Terminal states (no forward transitions)
TERMINAL_STATES = {s for s, cfg in STATE_CONFIG.items() if not cfg["next"]}


class LifecycleService:
    """Manage request lifecycle state transitions with validation and history."""

    def __init__(self, lifecycle_dir: Path = None):
        self.lifecycle_dir = lifecycle_dir or LIFECYCLE_DIR

    # ─── File I/O ────────────────────────────────────────────────────

    def _lifecycle_path(self, request_id: str) -> Path:
        """Get the JSON file path for a request's lifecycle data."""
        safe_id = request_id.replace("/", "_").replace(" ", "_")
        return self.lifecycle_dir / f"{safe_id}.json"

    def get_lifecycle(self, request_id: str) -> Optional[dict]:
        """Load lifecycle state for a request. Returns None if doesn't exist."""
        path = self._lifecycle_path(request_id)
        if not path.exists():
            return None
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return None

    def save_lifecycle(self, request_id: str, data: dict) -> Path:
        """Persist lifecycle data to disk."""
        path = self._lifecycle_path(request_id)
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
        return path

    # ─── State Machine ───────────────────────────────────────────────

    def init_lifecycle(self, request_id: str, initiated_by: str = "system") -> dict:
        """Initialize a new lifecycle for a request. Starts at DRAFT."""
        now = datetime.now(timezone.utc).isoformat()
        data = {
            "request_id": request_id,
            "current_state": "DRAFT",
            "history": [
                {
                    "state": "DRAFT",
                    "entered_at": now,
                    "entered_by": initiated_by,
                    "note": "Lifecycle initialized",
                }
            ],
            "created_at": now,
            "updated_at": now,
        }
        self.save_lifecycle(request_id, data)
        return data

    def transition(
        self,
        request_id: str,
        target_state: str,
        triggered_by: str,
        note: str = "",
    ) -> dict:
        """
        Attempt a state transition. Raises ValueError if invalid.
        Returns the updated lifecycle data.
        """
        target_state = target_state.upper().strip()

        if target_state not in STATE_CONFIG:
            raise ValueError(f"Unknown state: {target_state}. Valid: {', '.join(LIFECYCLE_STATES)}")

        data = self.get_lifecycle(request_id)
        if data is None:
            raise ValueError(f"No lifecycle found for request {request_id}. Call init_lifecycle first.")

        current = data["current_state"]

        # Allow backward transitions with a reason (corrections)
        is_forward = (current, target_state) in VALID_TRANSITIONS
        is_backward = LIFECYCLE_STATES.index(target_state) < LIFECYCLE_STATES.index(current)

        if is_forward:
            pass  # Good
        elif is_backward:
            if not note:
                raise ValueError(
                    f"Backward transition ({current} → {target_state}) requires a reason (note parameter)."
                )
        else:
            raise ValueError(
                f"Invalid transition: {current} → {target_state}. "
                f"Allowed from {current}: {', '.join(STATE_CONFIG[current]['next'])}"
            )

        if current == target_state:
            raise ValueError(f"Already in state {target_state}")

        now = datetime.now(timezone.utc).isoformat()

        # Record transition
        history_entry = {
            "state": target_state,
            "entered_at": now,
            "entered_by": triggered_by,
            "note": note,
        }
        if is_backward:
            history_entry["reverted_from"] = current

        data["history"].append(history_entry)
        data["current_state"] = target_state
        data["updated_at"] = now

        self.save_lifecycle(request_id, data)
        return data

    def get_allowed_transitions(self, request_id: str) -> list[dict]:
        """Get list of states the request can transition to."""
        data = self.get_lifecycle(request_id)
        if data is None:
            return []

        current = data["current_state"]
        if current in TERMINAL_STATES:
            return []

        # Forward transitions
        forward = STATE_CONFIG.get(current, {}).get("next", [])
        # Also allow backward transitions (with note)
        current_idx = LIFECYCLE_STATES.index(current)
        backward = LIFECYCLE_STATES[:current_idx] if current_idx > 0 else []

        result = []
        for s in forward:
            cfg = STATE_CONFIG[s]
            result.append({
                "state": s,
                "direction": "forward",
                "emoji": cfg["emoji"],
                "label": cfg["label"],
                "requires_note": False,
            })
        for s in backward:
            cfg = STATE_CONFIG[s]
            result.append({
                "state": s,
                "direction": "backward",
                "emoji": cfg["emoji"],
                "label": cfg["label"],
                "requires_note": True,
            })
        return result

    def get_progress(self, request_id: str) -> float:
        """Return progress as 0.0–1.0 based on lifecycle position."""
        data = self.get_lifecycle(request_id)
        if data is None:
            return 0.0
        try:
            idx = LIFECYCLE_STATES.index(data["current_state"])
            return round(idx / (len(LIFECYCLE_STATES) - 1), 3)
        except ValueError:
            return 0.0

    def get_timeline(self, request_id: str) -> list[dict]:
        """Get the full history timeline for a request."""
        data = self.get_lifecycle(request_id)
        if data is None:
            return []
        return data.get("history", [])

    # ─── Bulk Operations ─────────────────────────────────────────────

    def list_all_lifecycles(self) -> list[dict]:
        """List all request lifecycles with their current state."""
        results = []
        for f in sorted(self.lifecycle_dir.glob("*.json")):
            try:
                data = json.loads(f.read_text(encoding="utf-8"))
                results.append({
                    "request_id": data.get("request_id", f.stem),
                    "current_state": data.get("current_state", "UNKNOWN"),
                    "progress": self.get_progress(data.get("request_id", f.stem)),
                    "updated_at": data.get("updated_at", ""),
                    "entries": len(data.get("history", [])),
                })
            except (json.JSONDecodeError, OSError):
                continue
        return results

    def get_state_distribution(self) -> dict:
        """Count how many requests are in each state."""
        all_lc = self.list_all_lecycles() if hasattr(self, 'list_all_lifecycles') else []
        all_lc = self.list_all_lifecycles()
        dist = {state: 0 for state in LIFECYCLE_STATES}
        for lc in all_lc:
            state = lc["current_state"]
            if state in dist:
                dist[state] += 1
        return dist
