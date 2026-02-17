# TASK: Alert System

**Task ID:** TASK_DASHBOARD_ALERTS  
**Assigned to:** CTO Agent (continuous improvement)  
**Priority:** HIGH  
**Model:** KiloCode CLI (GLM-5:free)  
**Cost:** $0  
**Timebox:** 3 hours  
**Status:** NOT_STARTED

---

## Objective

Implement alert system for cost thresholds and important events.

## Acceptance Criteria

- [ ] Email alerts when daily cost exceeds threshold ($10)
- [ ] Webhook alerts (Discord/Slack compatible)
- [ ] Alert configuration UI in Settings
- [ ] Alert history log
- [ ] Enable/disable alerts per type

## Alert Types

1. **Cost Threshold**
   - Daily cost > $X
   - Monthly projection > budget
   
2. **Model Usage**
   - Expensive model used (Kimi, GPT-4)
   - Token usage spike (>100K in 1 hour)
   
3. **System**
   - API errors (rate limits)
   - Gateway disconnections

## Technical Requirements

1. Create `src/lib/alerts.ts` - Alert logic
2. Create `src/components/dashboard/AlertSettings.tsx` - Config UI
3. Create `src/app/api/alerts/send/route.ts` - Email/webhook API
4. Add alert checks to useCostAlerts hook

## Email Provider

Use Resend (free tier: 100 emails/day)
- Sign up: https://resend.com
- API key needed

## Deliverables

1. Alert system core logic
2. Settings UI for configuration
3. API endpoint for sending alerts
4. Alert history component
5. **MARK AS:** `READY_FOR_QA` when done

## Cost Constraint

**MUST USE:** KiloCode CLI with free models only
- GLM-5:free (primary)
- MiniMax:free (fallback)
- NO paid models

## Reminder

This is **continuous improvement** - after this:
- Pick next task from pipeline
- Never let queue empty

---

**Next after this:** PDF Export feature
