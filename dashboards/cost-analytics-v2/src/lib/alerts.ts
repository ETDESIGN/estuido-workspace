/**
 * Alert checking logic
 */

import type { AlertConfig } from '@/components/dashboard/AlertSettings'

export interface AlertCheck {
  type: 'daily_cost' | 'monthly_budget' | 'token_spike'
  title: string
  message: string
  severity: 'warning' | 'error'
  timestamp: number
}

interface AlertCheckInput {
  dailyCost: number
  monthlyCost: number
  tokenUsage: number
  previousTokenUsage: number
  config: AlertConfig
}

export function checkAlerts(input: AlertCheckInput): AlertCheck[] {
  const alerts: AlertCheck[] = []
  const now = Date.now()

  // Daily cost threshold
  if (input.dailyCost > input.config.dailyCostThreshold) {
    alerts.push({
      type: 'daily_cost',
      title: 'Daily Cost Threshold Exceeded',
      message: `Daily cost ($${input.dailyCost.toFixed(2)}) exceeded threshold ($${input.config.dailyCostThreshold})`,
      severity: 'warning',
      timestamp: now
    })
  }

  // Monthly budget threshold (80% warning, 100% error)
  const budgetRatio = input.monthlyCost / input.config.monthlyBudgetThreshold
  if (budgetRatio >= 1.0) {
    alerts.push({
      type: 'monthly_budget',
      title: 'Monthly Budget Exceeded',
      message: `Monthly cost ($${input.monthlyCost.toFixed(2)}) exceeded budget ($${input.config.monthlyBudgetThreshold})`,
      severity: 'error',
      timestamp: now
    })
  } else if (budgetRatio >= 0.8) {
    alerts.push({
      type: 'monthly_budget',
      title: 'Monthly Budget Warning',
      message: `Monthly cost at ${(budgetRatio * 100).toFixed(0)}% of budget`,
      severity: 'warning',
      timestamp: now
    })
  }

  // Token usage spike (>50K tokens in 1 hour)
  const tokenDelta = input.tokenUsage - input.previousTokenUsage
  if (tokenDelta > 50000) {
    alerts.push({
      type: 'token_spike',
      title: 'Token Usage Spike',
      message: `Unusual token usage: ${tokenDelta.toLocaleString()} tokens in last hour`,
      severity: 'warning',
      timestamp: now
    })
  }

  return alerts
}

export async function sendAlertNotification(
  alert: AlertCheck,
  config: AlertConfig
): Promise<void> {
  const promises: Promise<void>[] = []

  // Email alert (placeholder - would use Resend API)
  if (config.emailEnabled && config.emailAddress) {
    promises.push(
      fetch('/api/alerts/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: config.emailAddress,
          subject: alert.title,
          message: alert.message
        })
      }).then(() => {}).catch(() => {})
    )
  }

  // Webhook alert (Discord/Slack)
  if (config.webhookEnabled && config.webhookUrl) {
    const color = alert.severity === 'error' ? 0xff0000 : 0xffaa00
    promises.push(
      fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: alert.title,
            description: alert.message,
            color: color,
            timestamp: new Date(alert.timestamp).toISOString(),
            footer: { text: 'ESTUDIO Cost Analytics' }
          }]
        })
      }).then(() => {}).catch(() => {})
    )
  }

  await Promise.all(promises)
}

export function loadAlertConfig(): AlertConfig {
  if (typeof window === 'undefined') {
    return {
      emailEnabled: false,
      emailAddress: '',
      webhookEnabled: false,
      webhookUrl: '',
      dailyCostThreshold: 10,
      monthlyBudgetThreshold: 50
    }
  }

  const saved = localStorage.getItem('dashboard_alerts_config')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse alert config:', e)
    }
  }

  return {
    emailEnabled: false,
    emailAddress: '',
    webhookEnabled: false,
    webhookUrl: '',
    dailyCostThreshold: 10,
    monthlyBudgetThreshold: 50
  }
}
