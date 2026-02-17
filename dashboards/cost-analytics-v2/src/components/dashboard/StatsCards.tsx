'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Coins, Activity, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import type { TrendData } from '@/lib/data'

interface StatsCardsProps {
  todayCost?: number
  totalTokens?: number
  sessionCount?: number
  savingsPercent?: number
  trends?: {
    cost?: TrendData
    tokens?: TrendData
    sessions?: TrendData
  }
}

function TrendIndicator({ trend }: { trend?: TrendData }) {
  if (!trend) return null
  
  const iconMap = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  }
  
  const colorMap = {
    up: 'text-red-400',
    down: 'text-green-400',
    neutral: 'text-slate-400',
  }
  
  const Icon = iconMap[trend.trend] || Minus
  const color = colorMap[trend.trend] || 'text-slate-400'
  
  return (
    <div className={`flex items-center gap-1 text-xs ${color}`}>
      <Icon className="h-3 w-3" />
      <span>
        {Math.abs(trend.percentChange || 0).toFixed(1)}% vs previous
      </span>
    </div>
  )
}

export function StatsCards({ 
  todayCost = 0, 
  totalTokens = 0, 
  sessionCount = 0, 
  savingsPercent = 0,
  trends 
}: StatsCardsProps) {
  const stats = [
    {
      title: "Today's Cost",
      value: `$${(todayCost || 0).toFixed(4)}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      trend: trends?.cost,
    },
    {
      title: 'Total Tokens',
      value: (totalTokens || 0).toLocaleString(),
      icon: Coins,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      trend: trends?.tokens,
    },
    {
      title: 'Sessions',
      value: (sessionCount || 0).toLocaleString(),
      icon: Activity,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      trend: trends?.sessions,
    },
    {
      title: 'Savings',
      value: `${(savingsPercent || 0).toFixed(1)}%`,
      icon: TrendingDown,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      trend: undefined,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            {stat.trend && <TrendIndicator trend={stat.trend} />}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
