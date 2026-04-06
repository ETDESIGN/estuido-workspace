---
children_hash: 3a2d494f407c9a76f7e072aab651f501933b5ab2a791644954d05bf3a478ff69
compression_ratio: 0.40376569037656906
condensation_order: 3
covers: [business/_index.md, infrastructure/_index.md, project_management/_index.md, structure/_index.md]
covers_token_total: 1434
summary_level: d3
token_count: 579
type: summary
---
# Structural Overview: ESTUDIO Operations

ESTUDIO is a digital operations entity led by E (President) and Dereck (AI GM), operating on a 16GB Linux system with OpenClaw. Operations prioritize extreme cost-efficiency (~$0.41/day) and structured delegation.

## Business and Project Management
*   **Company Profile:** Focuses on project development, sourcing tools, and dashboards.
*   **Project Spider:** Manages Battery Charging Dock sourcing for Etia (Target: 80 docks/1,200 batteries annually).
    *   **Benchmarking:** 500 RMB/dock.
    *   **Suppliers:** STW (95% match) and Goochain (85% match).
    *   **Protocol:** RFQ documentation must exclude internal milestones (April 15, 2026) to maintain leverage.

## Infrastructure
*   **Communication:** Managed via WhatsApp (restricted/account-specific channels) and Discord (bound channels).
*   **System Architecture:**
    *   **Persistence:** Dual-layer approach using Memory-Core (SQLite/sqlite-vec, 455 chunks) and ByteRover Context Tree.
    *   **Gateway:** Managed as a systemd user service; requires OpenAI `text-embedding-3-small` and an active API key.

## Agent Structure and Operational Patterns
*   **Topology:** Dereck (GM/Main) delegates to specialized agents (CTO, QA, Warren, Sourcing, Planner).
*   **Delegation:** Tasks are managed via Lobster pipelines.
*   **Recovery:** Warren handles retries for CTO/QA timeouts; direct human intervention is discouraged.
*   **Operational Standards:**
    *   **Mandatory Verification:** All work must be verified before submission.
    *   **Gateway Discipline:** Restart gateway immediately after `openclaw.json` updates.
    *   **Momentum:** Execute 5-15 minute tasks after idle periods > 2 days.
    *   **Cost Management:** Enforce twice-daily token-tracker cron jobs and prioritize free-tier providers (Groq, GLM, Qwen).

For full details, refer to:
- Business: `business/_index.md`, `company_profile/estudio_profile.md`
- Infrastructure: `infrastructure/_index.md`, `comms_config/communication_channels.md`, `system_config/system_infrastructure.md`
- Project Management: `project_management/_index.md`, `project_spider/project_spider_supplier_sourcing.md`
- Structure: `structure/_index.md`, `agents/agent_topology_and_protocols.md`, `operational_patterns/operational_patterns_and_learnings.md`