'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ChartTypeToggle } from '@/components/dashboard/ChartTypeToggle'
import type { ChartType } from '@/components/dashboard/ChartTypeToggle'
import type { DailyCost } from '@/lib/data'

interface CostChartProps {
  data: DailyCost[]
}

const chartProps = {
  grid: { strokeDasharray: '3 3' as const, stroke: '#334155' },
  xAxis: { stroke: '#94a3b8', fontSize: 12, tickLine: false, axisLine: false },
  yAxis: {
    stroke: '#94a3b8', fontSize: 12, tickLine: false, axisLine: false,
    tickFormatter: (value: number) => `$${value.toFixed(2)}`,
  },
  tooltip: {
    contentStyle: {
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '8px',
      color: '#e2e8f0',
    },
    formatter: (value: number | undefined) => [`$${Number(value ?? 0).toFixed(4)}`, 'Cost'],
  },
}

export function CostChart({ data }: CostChartProps) {
  const [chartType, setChartType] = useState<ChartType>('area')

  const formattedData = data.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  if (!data || data.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-slate-200">Cost Over Time</CardTitle>
          <ChartTypeToggle value={chartType} onChange={setChartType} />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-slate-500">
            No cost data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={formattedData}>
            <CartesianGrid {...chartProps.grid} />
            <XAxis dataKey="date" {...chartProps.xAxis} />
            <YAxis {...chartProps.yAxis} />
            <Tooltip {...chartProps.tooltip} />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        )
      case 'bar':
        return (
          <BarChart data={formattedData}>
            <CartesianGrid {...chartProps.grid} />
            <XAxis dataKey="date" {...chartProps.xAxis} />
            <YAxis {...chartProps.yAxis} />
            <Tooltip {...chartProps.tooltip} />
            <Bar dataKey="cost" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        )
      case 'area':
        return (
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...chartProps.grid} />
            <XAxis dataKey="date" {...chartProps.xAxis} />
            <YAxis {...chartProps.yAxis} />
            <Tooltip {...chartProps.tooltip} />
            <Area
              type="monotone"
              dataKey="cost"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#colorCost)"
            />
          </AreaChart>
        )
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-slate-200">Cost Over Time</CardTitle>
        <ChartTypeToggle value={chartType} onChange={setChartType} />
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
