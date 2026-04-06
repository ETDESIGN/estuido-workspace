# TASK: Cost Prediction Feature

**Task ID:** TASK_DASHBOARD_PREDICTION  
**Assigned to:** CTO Agent (ongoing improvement)  
**Priority:** HIGH  
**Model:** KiloCode CLI (GLM-5:free)  
**Cost:** $0  
**Timebox:** 4 hours  
**Status:** READY_FOR_QA (Completed 2026-03-28 09:07 HKT)

---

## Objective

Implement ML-based cost prediction for the dashboard using historical data trends.

## Acceptance Criteria

- [ ] Cost prediction algorithm (linear regression on historical data)
- [ ] Predict next 7 days cost based on past 30 days
- [ ] Visual indicator: On track / Over budget warning
- [ ] Prediction card in dashboard showing:
  - Projected monthly cost
  - Projected vs budget comparison
  - Trend arrow (increasing/decreasing/stable)
- [ ] Confidence interval (±X%)

## Technical Requirements

1. Create `src/lib/prediction.ts` - Prediction algorithms
2. Create `src/components/dashboard/CostPrediction.tsx` - UI component
3. Use simple linear regression (no external ML libs needed)
4. Integrate into main page

## Algorithm

```typescript
// Simple linear regression
function predictCost(historicalData: {date: string, cost: number}[]) {
  // Calculate trend line
  // Return: {predicted7Day, predicted30Day, trend, confidence}
}
```

## Deliverables

1. `src/lib/prediction.ts` - Core prediction logic
2. `src/components/dashboard/CostPrediction.tsx` - UI component
3. Updated `page.tsx` to include prediction card
4. **MARK AS:** `READY_FOR_QA` when done

## Cost Constraint

**MUST USE:** KiloCode CLI with free models only
- GLM-5:free (primary)
- MiniMax:free (fallback)
- NO paid models

## Ongoing Task Note

This is part of **continuous dashboard improvement**. After completion:
- Mark as READY_FOR_QA
- Then pick next task from TASK_DASHBOARD_PIPELINE.md
- **NEVER STOP** - always have next task ready

---

**Next tasks in queue:**
1. Alert System (email/webhook)
2. PDF Export
3. User Authentication
