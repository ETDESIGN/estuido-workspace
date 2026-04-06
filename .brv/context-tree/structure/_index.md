---
children_hash: 2652ff9c196734ddfd01f6be4a2a5cfe4841df5d53d802fb5619865859f288a8
compression_ratio: 0.6987087517934003
condensation_order: 2
covers: [agents/_index.md, operational_patterns/_index.md]
covers_token_total: 697
summary_level: d2
token_count: 487
type: summary
---
## Structural Summary: Agents and Operational Patterns

This overview consolidates agent management protocols and operational efficiency guidelines.

### Agent Topology and Protocols (Reference: `agent_topology_and_protocols.md`)
The system utilizes a structured delegation hierarchy to manage workflows:
*   **Topology:** Dereck (GM/Main) acts as the central delegator, supported by CTO (Implementation), QA (Testing), Warren (Monitoring), a Sourcing Agent, and a Planner.
*   **Operational Flow:** Dereck delegates tasks via **Lobster pipelines** rather than direct code intervention.
*   **Recovery Protocol:** To maintain system stability, direct intervention is discouraged. If the CTO or QA agents encounter timeouts, Warren is designated to handle retries. 
*   **Storage:** Agent memory is centralized at `/home/e/.openclaw/workspace/memory/`.

### Operational Patterns and Learnings (Reference: `operational_patterns_and_learnings.md`)
These patterns define the standard operating procedures for system maintenance and cost discipline:
*   **Stability & Configuration:**
    *   **Mandatory Verification:** All work must be verified for accuracy before submission.
    *   **Gateway Management:** Any modifications to `openclaw.json` require an immediate gateway restart.
    *   **Documentation:** Critical configuration changes must be logged in the `notes/` directory.
*   **Workflow Efficiency:**
    *   **Momentum Recovery:** After idle periods exceeding two days, execute a brief (5-15 minute) task to re-establish operational momentum.
*   **Cost Management:**
    *   **Tier Strategy:** Prioritize free token providers (e.g., Groq, GLM, Qwen).
    *   **Monitoring:** Enforce cost discipline via the twice-daily token-tracker cron job.

**Core Rules Summary:**
1.  Verify all work prior to claiming completion.
2.  Restart the gateway after `openclaw.json` updates.
3.  Adhere strictly to free-tier token optimization protocols.