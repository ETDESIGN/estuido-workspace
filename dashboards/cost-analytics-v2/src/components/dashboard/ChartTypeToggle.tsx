'use client'

import { Button } from '@/components/ui/button'
import { BarChart3, LineChart, AreaChart } from 'lucide-react'

export type ChartType = 'line' | 'bar' | 'area'

interface ChartTypeToggleProps {
  value: ChartType
  onChange: (type: ChartType) => void
}

const OPTIONS: { value: ChartType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'line', label: 'Line', icon: LineChart },
  { value: 'bar', label: 'Bar', icon: BarChart3 },
  { value: 'area', label: 'Area', icon: AreaChart },
]

export function ChartTypeToggle({ value, onChange }: ChartTypeToggleProps) {
  return (
    <div className="flex gap-1">
      {OPTIONS.map((option) => {
        const Icon = option.icon
        return (
          <Button
            key={option.value}
            variant={value === option.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChange(option.value)}
            className={
              value === option.value
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }
          >
            <Icon className="h-4 w-4 mr-1.5" />
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
