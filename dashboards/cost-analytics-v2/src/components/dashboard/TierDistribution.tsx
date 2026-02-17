'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { TierStats } from '@/lib/data'

interface TierDistributionProps {
  data: TierStats[]
}

const COLORS = {
  PULSE: '#22c55e',
  WORKHORSE: '#f59e0b',
  BRAIN: '#a855f7',
}

const TIER_LABELS = {
  PULSE: 'Pulse (Fast & Free)',
  WORKHORSE: 'Workhorse (Balanced)',
  BRAIN: 'Brain (Premium)',
}

export function TierDistribution({ data }: TierDistributionProps) {
  const chartData = data.map(item => ({
    name: TIER_LABELS[item.tier],
    tier: item.tier,
    value: item.sessions,
    cost: item.totalCost,
    percent: item.percentOfTotal,
    color: COLORS[item.tier],
  }))

  const totalCost = data.reduce((sum, t) => sum + t.totalCost, 0)

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-200">Tier Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
                formatter={(value, name, props) => [
                  `${value} sessions (${props.payload.percent.toFixed(1)}%)`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {data.map((tier) => (
            <div key={tier.tier} className="text-center p-2 rounded-lg bg-slate-700/30">
              <div 
                className="text-sm font-semibold"
                style={{ color: COLORS[tier.tier] }}
              >
                {tier.tier}
              </div>
              <div className="text-xs text-slate-400">
                ${tier.totalCost.toFixed(4)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
          <span className="text-sm text-slate-400">Total Cost</span>
          <span className="text-lg font-bold text-green-400">${totalCost.toFixed(4)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
