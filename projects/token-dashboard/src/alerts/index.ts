/**
 * Token Tracking Dashboard - Alert System
 * Monitor spending and generate alerts when approaching limits
 */

import { Alert, AlertThreshold, DEFAULT_THRESHOLDS } from '../types.js';
import { getDailyStats, getMonthlyTotal, insertAlert, getUnacknowledgedAlerts, acknowledgeAlert } from '../db/index.js';
import { randomUUID } from 'crypto';

const THRESHOLDS = DEFAULT_THRESHOLDS;

export interface CheckResult {
  triggered: boolean;
  alerts: Alert[];
}

/**
 * Check if spending has crossed any alert thresholds
 */
export function checkAlerts(date: string = getToday()): CheckResult {
  const alerts: Alert[] = [];
  const dailyStats = getDailyStats(date);
  const monthlySpend = getMonthlyTotal(date.substring(0, 7)); // YYYY-MM
  
  const dailySpend = dailyStats?.totalCost || 0;
  
  for (const threshold of THRESHOLDS) {
    // Check daily limit
    const dailyPercentage = (dailySpend / threshold.dailyCostLimit) * 100;
    if (dailyPercentage >= threshold.percentage) {
      const alert = createAlert(
        threshold.level,
        `Daily spending at ${Math.round(dailyPercentage)}% of $${threshold.dailyCostLimit} limit`,
        dailySpend,
        threshold.dailyCostLimit,
        'daily'
      );
      insertAlert(alert);
      alerts.push(alert);
    }
    
    // Check monthly limit
    const monthlyPercentage = (monthlySpend / threshold.monthlyCostLimit) * 100;
    if (monthlyPercentage >= threshold.percentage) {
      const alert = createAlert(
        threshold.level,
        `Monthly spending at ${Math.round(monthlyPercentage)}% of $${threshold.monthlyCostLimit} limit`,
        monthlySpend,
        threshold.monthlyCostLimit,
        'monthly'
      );
      insertAlert(alert);
      alerts.push(alert);
    }
  }
  
  return {
    triggered: alerts.length > 0,
    alerts,
  };
}

/**
 * Create a new alert
 */
function createAlert(
  level: 'yellow' | 'orange' | 'red',
  message: string,
  currentSpend: number,
  limit: number,
  scope: 'daily' | 'monthly'
): Alert {
  return {
    id: randomUUID(),
    timestamp: new Date(),
    level,
    message: `[${scope.toUpperCase()}] ${message}`,
    currentSpend,
    limit,
    acknowledged: false,
  };
}

/**
 * Get all pending (unacknowledged) alerts
 */
export function getPendingAlerts(): Alert[] {
  return getUnacknowledgedAlerts();
}

/**
 * Mark an alert as acknowledged
 */
export function ackAlert(alertId: string): void {
  acknowledgeAlert(alertId);
}

/**
 * Format alert for display
 */
export function formatAlert(alert: Alert): string {
  const emoji = alert.level === 'red' ? '🔴' : alert.level === 'orange' ? '🟠' : '🟡';
  const percentage = ((alert.currentSpend / alert.limit) * 100).toFixed(1);
  return `${emoji} [${alert.level.toUpperCase()}] ${alert.message}\n   Current: $${alert.currentSpend.toFixed(4)} / $${alert.limit} (${percentage}%)`;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}
