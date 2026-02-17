'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Session } from '@/lib/data'

interface HeatmapCell {
  hour: number
  day: number
  dayName: string
  value: number
  sessions: number
}

interface ModelUsageHeatmapProps {
  sessions: Session[]
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function ModelUsageHeatmap({ sessions }: ModelUsageHeatmapProps) {
  const heatmapData = useMemo(() => {
    // Initialize grid: 7 days x 24 hours
    const grid: HeatmapCell[][] = Array.from({ length: 7 }, (_, day) =>
      Array.from({ length: 24 }, (_, hour) => ({
        hour,
        day,
        dayName: DAYS[day],
        value: 0,
        sessions: 0,
      }))
    )

    // Populate with session data
    for (const session of sessions) {
      const date = new Date(session.updatedAt)
      const day = date.getDay()
      const hour = date.getHours()
      
      grid[day][hour].value += session.cost
      grid[day][hour].sessions += 1
    }

    return grid
  }, [sessions])

  // Find max value for color scaling
  const maxValue = useMemo(() => {
    let max = 0
    for (const day of heatmapData) {
      for (const cell of day) {
        max = Math.max(max, cell.value)
      }
    }
    return max || 1
  }, [heatmapData])

  // Get color intensity based on value
  const getColor = (value: number) => {
    if (value === 0) return 'bg-slate-800'
    const intensity = Math.min(value / maxValue, 1)
    if (intensity < 0.2) return 'bg-blue-900/50'
    if (intensity < 0.4) return 'bg-blue-800/60'
    if (intensity < 0.6) return 'bg-blue-700/70'
    if (intensity < 0.8) return 'bg-blue-600/80'
    return 'bg-blue-500'
  }

  // Format hour label
  const formatHour = (hour: number) => {
    if (hour === 0) return '12a'
    if (hour < 12) return `${hour}a`
    if (hour === 12) return '12p'
    return `${hour - 12}p`
  }

  if (sessions.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="py-8 text-center text-slate-400">
          No session data available for heatmap
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-200">Usage Heatmap (Time of Day)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex mb-1">
              <div className="w-12" /> {/* Day label spacer */}
              {HOURS.filter((_, i) => i % 3 === 0).map(hour => (
                <div key={hour} className="flex-1 text-xs text-slate-500 text-center">
                  {formatHour(hour)}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="space-y-1">
              {heatmapData.map((dayData, dayIndex) => (
                <div key={dayIndex} className="flex items-center">
                  <div className="w-12 text-xs text-slate-400 font-medium">
                    {DAYS[dayIndex]}
                  </div>
                  <div className="flex-1 flex gap-0.5">
                    {dayData.map((cell, hourIndex) => (
                      <div
                        key={hourIndex}
                        className={`
                          flex-1 h-8 rounded-sm ${getColor(cell.value)}
                          hover:ring-2 hover:ring-blue-400/50 transition-all cursor-pointer
                        `}
                        title={`${cell.dayName} ${formatHour(cell.hour)}: ${cell.sessions} sessions, $${cell.value.toFixed(4)}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <span className="text-xs text-slate-500">Low</span>
              <div className="flex gap-0.5">
                <div className="w-4 h-4 rounded-sm bg-slate-800" />
                <div className="w-4 h-4 rounded-sm bg-blue-900/50" />
                <div className="w-4 h-4 rounded-sm bg-blue-800/60" />
                <div className="w-4 h-4 rounded-sm bg-blue-700/70" />
                <div className="w-4 h-4 rounded-sm bg-blue-600/80" />
                <div className="w-4 h-4 rounded-sm bg-blue-500" />
              </div>
              <span className="text-xs text-slate-500">High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
