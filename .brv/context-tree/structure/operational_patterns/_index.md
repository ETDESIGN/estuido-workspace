---
children_hash: 8d590104b0498e2944133243b40a5581c3b87ea0d1a1e8a15f47a9a7548e52fe
compression_ratio: 0.8717201166180758
condensation_order: 1
covers: [operational_patterns_and_learnings.md]
covers_token_total: 343
summary_level: d1
token_count: 299
type: summary
---
# Operational Patterns and Learnings Summary

This entry outlines core operational strategies and policy guidelines designed to maintain system stability and cost efficiency. For comprehensive details, refer to the full `operational_patterns_and_learnings.md` document.

### Core Operational Policies
*   **Verification:** Mandatory verification of work is required before claiming completion to prevent recurring error patterns.
*   **Gateway Management:** Restart the gateway immediately following any modifications to `openclaw.json`.
*   **Documentation:** All critical configurations must be logged to the `notes/` directory as they occur.

### Recovery and Optimization Strategies
*   **Quick-Sprint Recovery:** Following idleness exceeding two days, initialize workflows with a short, 5-15 minute task to re-establish momentum.
*   **Cost Control:** Prioritize free token tiers (e.g., Groq, GLM, Qwen) over paid options.
*   **Monitoring:** Maintain strict cost discipline via twice-daily execution of the token-tracker cron job.

### Key Rules
1.  Verify all work before submission.
2.  Restart gateway after `openclaw.json` updates.
3.  Strict adherence to free-tier token optimization.