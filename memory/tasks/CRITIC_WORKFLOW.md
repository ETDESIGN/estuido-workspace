# Critic Workflow — Premium Quality Gate

## When to Invoke Critic
- Customer-facing features (dashboards, portals, landing pages)
- Major redesigns or architecture changes
- Any task labeled `quality: premium` by Etia
- NOT for routine bug fixes, internal tools, or minor changes

## The Excellence Loop
```
1. Dev team builds feature → QA checks correctness (tests pass) → CRITIC audits excellence
2. Critic produces scored audit report (5 pillars, each 1-10)
3. Etia reviews audit report → decides which improvements to implement
4. Dev team implements improvements → QA re-tests → CRITIC re-audits
5. Repeat until Critic gives 8+/10 overall → Ship
```

## How to Invoke
```
sessions_spawn(
    agentId: "critic",
    task: "Audit [project/feature] at /path/to/project. Evaluate against 5 pillars: Design, Functionality, UI/UX, Code Quality, Security. Produce scored report with improvement plan."
)
```

## Cost
- Kimi K2.5 via OpenRouter: ~$0.01-0.05 per audit (262k context)
- Only used when needed, not on every task
