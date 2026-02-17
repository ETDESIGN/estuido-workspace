'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { ModelStats } from '@/lib/data'

interface ModelUsageChartProps {
  data: ModelStats[]
}

const COLORS = {
  PULSE: '#22c55e',
  WORKHORSE: '#f59e0b',
  BRAIN: '#a855f7',
}

export function ModelUsageChart({ data }: ModelUsageChartProps) {
  const chartData = data.map(item => ({
    name: item.model,
    value: item.sessions,
    tier: item.tier,
    color: COLORS[item.tier],
  }))

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-200">Model Usage Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
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
                formatter={(value, name) => [value, name]}
              />
              <Legend 
                wrapperStyle={{ color: '#94a3b8' }}
                formatter={(value: string) => <span className="text-slate-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-slate-400">PULSE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm text-slate-400">WORKHORSE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm text-slate-400">BRAIN</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
