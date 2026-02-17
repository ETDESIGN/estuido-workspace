'use client'

import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { predictCosts, formatCurrency, type DailyCost } from '@/lib/prediction'
import { useMemo } from 'react'

interface CostPredictionProps {
  dailyCosts: DailyCost[]
  budget?: number
}

export function CostPrediction({ dailyCosts, budget = 50 }: CostPredictionProps) {
  const prediction = useMemo(() => {
    return predictCosts(dailyCosts, budget)
  }, [dailyCosts, budget])

  const getTrendIcon = () => {
    switch (prediction.currentTrend) {
      case 'increasing':
        return <TrendingUp className="h-5 w-5 text-red-500" />
      case 'decreasing':
        return <TrendingDown className="h-5 w-5 text-green-500" />
      default:
        return <Minus className="h-5 w-5 text-slate-500" />
    }
  }

  const getBudgetIcon = () => {
    switch (prediction.budgetStatus) {
      case 'under':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'near':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'over':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  }

  const getBudgetMessage = () => {
    switch (prediction.budgetStatus) {
      case 'under':
        return 'On track with budget'
      case 'near':
        return 'Approaching budget limit'
      case 'over':
        return 'Projected to exceed budget'
    }
  }

  const confidencePercent = Math.round(prediction.confidence * 100)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {getTrendIcon()}
          Cost Prediction
          <span className="text-xs font-normal text-slate-500 ml-auto">
            {confidencePercent}% confidence
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Projected Monthly */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Projected Monthly
          </span>
          <span className={`text-2xl font-bold ${
            prediction.budgetStatus === 'over' ? 'text-red-500' :
            prediction.budgetStatus === 'near' ? 'text-yellow-500' :
            'text-green-500'
          }`}>
            {formatCurrency(prediction.projectedMonthly)}
          </span>
        </div>

        {/* Budget Status */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
          {getBudgetIcon()}
          <span className="text-sm font-medium">{getBudgetMessage()}</span>
          <span className="text-xs text-slate-500 ml-auto">
            Budget: {formatCurrency(budget)}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-500">Next 7 Days</span>
            <p className="text-lg font-semibold">
              {formatCurrency(prediction.predicted7Day)}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-500">Daily Average</span>
            <p className="text-lg font-semibold">
              {formatCurrency(prediction.dailyAverage)}
            </p>
          </div>
        </div>

        {/* Trend Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Trend:</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            prediction.currentTrend === 'increasing' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            prediction.currentTrend === 'decreasing' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
          }`}>
            {prediction.currentTrend.charAt(0).toUpperCase() + prediction.currentTrend.slice(1)}
          </span>
        </div>

        {/* Data Quality Warning */}
        {dailyCosts.length < 7 && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            ⚠️ Limited data. Prediction accuracy improves with more historical data.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
