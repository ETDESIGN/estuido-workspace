/**
 * Cost Prediction Algorithms
 * Uses simple linear regression on historical cost data
 */

export interface DailyCost {
  date: string
  cost: number
}

export interface PredictionResult {
  predicted7Day: number
  predicted30Day: number
  currentTrend: 'increasing' | 'decreasing' | 'stable'
  confidence: number // 0-1
  dailyAverage: number
  projectedMonthly: number
  budgetStatus: 'under' | 'near' | 'over'
}

/**
 * Calculate linear regression trend
 */
function calculateTrend(data: { x: number; y: number }[]): {
  slope: number
  intercept: number
  r2: number
} {
  const n = data.length
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 }

  const sumX = data.reduce((sum, p) => sum + p.x, 0)
  const sumY = data.reduce((sum, p) => sum + p.y, 0)
  const sumXY = data.reduce((sum, p) => sum + p.x * p.y, 0)
  const sumX2 = data.reduce((sum, p) => sum + p.x * p.x, 0)
  const sumY2 = data.reduce((sum, p) => sum + p.y * p.y, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // Calculate R-squared (confidence)
  const yMean = sumY / n
  const ssTotal = data.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0)
  const ssResidual = data.reduce((sum, p) => {
    const predicted = slope * p.x + intercept
    return sum + Math.pow(p.y - predicted, 2)
  }, 0)
  const r2 = ssTotal === 0 ? 0 : 1 - ssResidual / ssTotal

  return { slope, intercept, r2 }
}

/**
 * Predict costs based on historical data
 */
export function predictCosts(
  dailyCosts: DailyCost[],
  budget: number = 50 // Default $50/month budget
): PredictionResult {
  if (dailyCosts.length < 3) {
    // Not enough data for prediction
    const avg = dailyCosts.reduce((sum, d) => sum + d.cost, 0) / (dailyCosts.length || 1)
    return {
      predicted7Day: avg * 7,
      predicted30Day: avg * 30,
      currentTrend: 'stable',
      confidence: 0.3,
      dailyAverage: avg,
      projectedMonthly: avg * 30,
      budgetStatus: avg * 30 <= budget * 0.8 ? 'under' : avg * 30 <= budget ? 'near' : 'over'
    }
  }

  // Prepare data for regression (x = day index, y = cost)
  const data = dailyCosts.map((d, i) => ({ x: i, y: d.cost }))
  const { slope, intercept, r2 } = calculateTrend(data)

  // Predict next 7 days
  const lastDayIndex = dailyCosts.length - 1
  const predicted7Day = Array.from({ length: 7 }, (_, i) => {
    const dayIndex = lastDayIndex + i + 1
    return Math.max(0, slope * dayIndex + intercept)
  }).reduce((sum, cost) => sum + cost, 0)

  // Predict next 30 days
  const predicted30Day = Array.from({ length: 30 }, (_, i) => {
    const dayIndex = lastDayIndex + i + 1
    return Math.max(0, slope * dayIndex + intercept)
  }).reduce((sum, cost) => sum + cost, 0)

  // Calculate trend
  const recentAvg = dailyCosts.slice(-7).reduce((sum, d) => sum + d.cost, 0) / 7
  const previousAvg = dailyCosts.slice(-14, -7).reduce((sum, d) => sum + d.cost, 0) / 7 || recentAvg
  
  let currentTrend: 'increasing' | 'decreasing' | 'stable'
  const trendChange = recentAvg - previousAvg
  if (Math.abs(trendChange) < 0.01) {
    currentTrend = 'stable'
  } else if (trendChange > 0) {
    currentTrend = 'increasing'
  } else {
    currentTrend = 'decreasing'
  }

  // Calculate daily average
  const dailyAverage = dailyCosts.reduce((sum, d) => sum + d.cost, 0) / dailyCosts.length

  // Determine budget status
  let budgetStatus: 'under' | 'near' | 'over'
  const ratio = predicted30Day / budget
  if (ratio <= 0.8) {
    budgetStatus = 'under'
  } else if (ratio <= 1.0) {
    budgetStatus = 'near'
  } else {
    budgetStatus = 'over'
  }

  return {
    predicted7Day,
    predicted30Day,
    currentTrend,
    confidence: Math.min(0.95, Math.max(0.3, r2)), // Clamp between 0.3 and 0.95
    dailyAverage,
    projectedMonthly: predicted30Day,
    budgetStatus
  }
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}
