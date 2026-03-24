# TASK: Cost Prediction Feature

**Assigned To:** CTO Agent
**Priority:** HIGH (Task #3 from pipeline)
**Model:** `zai/glm-5` (free tier)
**Timebox:** 3 hours
**Status:** READY

---

## Objective

Implement ML-based cost forecasting for the OpenClaw dashboard using historical token usage data.

---

## Requirements

### 1. Data Collection
- Extract usage patterns from `/home/e/.openclaw/token-usage.json`
- Parse historical data from memory logs
- Identify usage trends by model/provider

### 2. Prediction Algorithm
- Implement simple linear regression or trend analysis
- Predict daily/weekly costs based on usage patterns
- Calculate free tier exhaustion date
- Project monthly costs

### 3. Dashboard Integration
- Add "Cost Prediction" section to dashboard
- Display projection charts (visual forecast)
- Show days until free tier exhaustion
- Alert when approaching budget limits

### 4. Alert System
- Configure thresholds for warnings
- Trigger alerts at 50%, 75%, 90% of daily/weekly budgets
- Log alerts to memory file

---

## Technical Approach

```typescript
// Pseudo-code structure
interface UsageData {
  date: string;
  model: string;
  tokens: number;
  cost: number;
}

interface Prediction {
  dailyCost: number;
  weeklyCost: number;
  monthlyProjection: number;
  freeTierExhaustion: Date;
  trend: 'increasing' | 'stable' | 'decreasing';
}

// Algorithm
function predictCosts(historicalData: UsageData[]): Prediction {
  // 1. Calculate average daily usage
  // 2. Identify trends
  // 3. Project forward
  // 4. Calculate free tier exhaustion
  // 5. Return prediction object
}
```

---

## Implementation Steps

1. **Create data parser** (`lib/cost-prediction.ts`)
   - Read token-usage.json
   - Parse memory logs
   - Structure usage data

2. **Implement prediction algorithm**
   - Linear regression for trend analysis
   - Moving averages for smoothing
   - Confidence intervals

3. **Build dashboard component**
   - Chart visualization (use existing chart library)
   - Prediction display cards
   - Alert banners

4. **Add API endpoint** (if needed)
   - `/api/costs/prediction`
   - Return prediction JSON

5. **Configure alerts**
   - Threshold checks
   - Memory logging
   - UI notifications

---

## Files to Create/Modify

### New Files
- `nb-studio/dashboard/lib/cost-prediction.ts` - Prediction logic
- `nb-studio/dashboard/components/CostPrediction.tsx` - Dashboard UI
- `nb-studio/dashboard/types/prediction.ts` - TypeScript types

### Modify Files
- `nb-studio/dashboard/app/page.tsx` - Add prediction section
- `nb-studio/dashboard/lib/api.ts` - Add prediction endpoint (optional)
- `nb-studio/dashboard/package.json` - Add dependencies if needed

---

## Acceptance Criteria

1. ✅ Prediction algorithm implemented and tested
2. ✅ Dashboard displays cost predictions
3. ✅ Free tier exhaustion countdown visible
4. ✅ Alert thresholds configured
5. ✅ TypeScript compilation: 0 errors
6. ✅ Dev server runs without errors
7. ✅ Prediction data updates on page refresh

---

## Testing Checklist

Before marking `READY_FOR_QA`:

- [ ] Run `npx tsc --noEmit` - must show 0 errors
- [ ] Start dev server: `npm run dev`
- [ ] Verify dashboard loads at `http://localhost:3000`
- [ ] Check prediction data displays correctly
- [ ] Test with sample historical data
- [ ] Verify alerts trigger at thresholds
- [ ] Check responsive design (mobile)

---

## Notes

- Use `zai/glm-5` for all coding (free tier)
- Focus on simple, accurate predictions
- Don't over-engineer - linear regression is sufficient
- Add comments for complex algorithms
- Follow existing code style in dashboard

---

## Deliverables

1. Working prediction algorithm
2. Dashboard UI component
3. API endpoint (optional)
4. Documentation in code comments
5. **READY_FOR_QA** marker when complete

---

**Task Created:** 2026-03-24 16:58
**Assigned By:** GM (Dereck)
**Deadline:** 3 hours from start
**Review:** QA Agent after completion

*Free tier goal: Maximize GLM-5 usage*
