'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Award, DollarSign, Cpu } from 'lucide-react'
import type { Session } from '@/lib/data'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface ModelCostTrend {
  date: string
  [model: string]: string | number
}

interface ModelPerformanceDeepDiveProps {
  sessions: Session[]
}

export function ModelPerformanceDeepDive({ sessions }: ModelPerformanceDeepDiveProps) {
  // Calculate model cost trends over time
  const modelTrends = useMemo(() => {
    const dailyModelCosts = new Map<string, Map<string, number>>()
    const modelSet = new Set<string>()

    // Group sessions by date and model
    for (const session of sessions) {
      const date = new Date(session.updatedAt).toISOString().split('T')[0]
      const modelKey = `${session.modelProvider}/${session.model}`
      modelSet.add(modelKey)

      if (!dailyModelCosts.has(date)) {
        dailyModelCosts.set(date, new Map())
      }
      const dateMap = dailyModelCosts.get(date)!
      dateMap.set(modelKey, (dateMap.get(modelKey) || 0) + session.cost)
    }

    // Convert to array format for chart
    const sortedDates = Array.from(dailyModelCosts.keys()).sort()
    const models = Array.from(modelSet)

    return sortedDates.map(date => {
      const dataPoint: ModelCostTrend = { date }
      const dateMap = dailyModelCosts.get(date)!
      for (const model of models) {
        dataPoint[model] = dateMap.get(model) || 0
      }
      return dataPoint
    })
  }, [sessions])

  // Calculate cost efficiency (cost per 1K tokens)
  const efficiencyData = useMemo(() => {
    const modelStats = new Map<string, { cost: number; tokens: number; sessions: number }>()

    for (const session of sessions) {
      const key = `${session.modelProvider}/${session.model}`
      const existing = modelStats.get(key) || { cost: 0, tokens: 0, sessions: 0 }
      existing.cost += session.cost
      existing.tokens += session.totalTokens
      existing.sessions += 1
      modelStats.set(key, existing)
    }

    const efficiencies = Array.from(modelStats.entries())
      .map(([model, stats]) => ({
        model,
        costPer1KTokens: stats.tokens > 0 ? (stats.cost / stats.tokens) * 1000 : 0,
        totalCost: stats.cost,
        totalTokens: stats.tokens,
        sessions: stats.sessions,
      }))
      .sort((a, b) => a.costPer1KTokens - b.costPer1KTokens)

    return efficiencies
  }, [sessions])

  // Find best value model (lowest cost per token among most used)
  const bestValueModel = useMemo(() => {
    if (efficiencyData.length === 0) return null
    
    // Filter models with at least 2 sessions for significance
    const significantModels = efficiencyData.filter(m => m.sessions >= 2)
    if (significantModels.length === 0) return efficiencyData[0]
    
    return significantModels[0]
  }, [efficiencyData])

  // Get unique models for chart colors
  const models = useMemo(() => {
    if (modelTrends.length === 0) return []
    return Object.keys(modelTrends[0]).filter(key => key !== 'date')
  }, [modelTrends])

  const colors = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899']

  if (sessions.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="py-8 text-center text-slate-400">
          No session data available for performance analysis
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Best Value Recommendation */}
      {bestValueModel && (
        <Card className="bg-gradient-to-br from-green-900/30 to-slate-800/50 border-green-700/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-green-500/20">
                <Award className="h-6 w-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-100">Best Value Model</h3>
                <p className="text-slate-400 mt-1">
                  Based on cost efficiency and usage volume
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-lg px-3 py-1">
                    {bestValueModel.model}
                  </Badge>
                  <div className="flex items-center gap-2 text-slate-300">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    <span>${bestValueModel.costPer1KTokens.toFixed(4)} per 1K tokens</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Cpu className="h-4 w-4 text-slate-400" />
                    <span>{bestValueModel.sessions} sessions</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Trend Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Per-Model Cost Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modelTrends.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={modelTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#64748b"
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#94a3b8' }}
                    formatter={(value) => [`$${Number(value).toFixed(4)}`, 'Cost']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Legend />
                  {models.map((model, index) => (
                    <Line
                      key={model}
                      type="monotone"
                      dataKey={model}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={false}
                      name={model.split('/').pop()}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-400">
              Not enough data for trend analysis
            </div>
          )}
        </CardContent>
      </Card>

      {/* Efficiency Comparison */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Model Efficiency Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {efficiencyData.map((model, index) => (
              <div
                key={model.model}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index === 0 
                    ? 'bg-green-500/10 border border-green-500/30' 
                    : 'bg-slate-700/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                    ${index === 0 ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-300'}
                  `}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-200">{model.model}</p>
                    <p className="text-xs text-slate-400">
                      {model.sessions} sessions • {model.totalTokens.toLocaleString()} tokens
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${index === 0 ? 'text-green-400' : 'text-slate-200'}`}>
                    ${model.costPer1KTokens.toFixed(4)}
                  </p>
                  <p className="text-xs text-slate-400">per 1K tokens</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
