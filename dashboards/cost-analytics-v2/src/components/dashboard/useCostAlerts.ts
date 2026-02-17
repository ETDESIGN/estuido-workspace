'use client'

import { useEffect, useRef } from 'react'
import { useNotifications } from '../notifications/NotificationContext'
import type { Session } from '@/lib/data'

interface CostThresholdConfig {
  dailyLimit: number
  weeklyLimit: number
  monthlyLimit: number
}

const DEFAULT_THRESHOLDS: CostThresholdConfig = {
  dailyLimit: 1.0,    // $1.00 per day
  weeklyLimit: 5.0,   // $5.00 per week
  monthlyLimit: 20.0, // $20.00 per month
}

export function useCostAlerts(
  sessions: Session[],
  thresholds: CostThresholdConfig = DEFAULT_THRESHOLDS
) {
  const { addNotification } = useNotifications()
  const alertedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (sessions.length === 0) return

    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000
    const oneWeek = 7 * oneDay
    const oneMonth = 30 * oneDay

    // Calculate costs for different time periods
    const dailyCost = sessions
      .filter(s => s.updatedAt >= now - oneDay)
      .reduce((sum, s) => sum + s.cost, 0)

    const weeklyCost = sessions
      .filter(s => s.updatedAt >= now - oneWeek)
      .reduce((sum, s) => sum + s.cost, 0)

    const monthlyCost = sessions
      .filter(s => s.updatedAt >= now - oneMonth)
      .reduce((sum, s) => sum + s.cost, 0)

    // Check daily threshold
    if (dailyCost > thresholds.dailyLimit) {
      const alertId = `daily-${new Date().toISOString().split('T')[0]}`
      if (!alertedRef.current.has(alertId)) {
        addNotification({
          type: 'warning',
          category: 'cost',
          title: 'Daily Cost Threshold Exceeded',
          message: `Daily cost ($${dailyCost.toFixed(2)}) has exceeded the limit of $${thresholds.dailyLimit.toFixed(2)}`,
          data: { cost: dailyCost, threshold: thresholds.dailyLimit, period: 'daily' },
        })
        alertedRef.current.add(alertId)
      }
    }

    // Check weekly threshold
    if (weeklyCost > thresholds.weeklyLimit) {
      const weekStart = new Date(now - oneWeek).toISOString().split('T')[0]
      const alertId = `weekly-${weekStart}`
      if (!alertedRef.current.has(alertId)) {
        addNotification({
          type: 'warning',
          category: 'cost',
          title: 'Weekly Cost Threshold Exceeded',
          message: `Weekly cost ($${weeklyCost.toFixed(2)}) has exceeded the limit of $${thresholds.weeklyLimit.toFixed(2)}`,
          data: { cost: weeklyCost, threshold: thresholds.weeklyLimit, period: 'weekly' },
        })
        alertedRef.current.add(alertId)
      }
    }

    // Check monthly threshold
    if (monthlyCost > thresholds.monthlyLimit) {
      const monthStart = new Date(now - oneMonth).toISOString().slice(0, 7)
      const alertId = `monthly-${monthStart}`
      if (!alertedRef.current.has(alertId)) {
        addNotification({
          type: 'error',
          category: 'cost',
          title: 'Monthly Cost Threshold Exceeded',
          message: `Monthly cost ($${monthlyCost.toFixed(2)}) has exceeded the limit of $${thresholds.monthlyLimit.toFixed(2)}`,
          data: { cost: monthlyCost, threshold: thresholds.monthlyLimit, period: 'monthly' },
        })
        alertedRef.current.add(alertId)
      }
    }
  }, [sessions, thresholds, addNotification])
}

// Hook to show success notification when export completes
export function useExportNotification() {
  const { addNotification } = useNotifications()

  const notifyExportComplete = (format: string, recordCount: number) => {
    addNotification({
      type: 'success',
      category: 'export',
      title: 'Export Complete',
      message: `Successfully exported ${recordCount} records as ${format.toUpperCase()}`,
      data: { format, recordCount },
    })
  }

  return { notifyExportComplete }
}
