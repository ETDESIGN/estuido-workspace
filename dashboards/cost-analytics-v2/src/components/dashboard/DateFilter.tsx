'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

export type DateRange = 'today' | '7days' | '30days' | 'alltime'

interface DateFilterProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

const OPTIONS: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: 'alltime', label: 'All Time' },
]

export function DateFilter({ value, onChange }: DateFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-slate-400" />
      <div className="flex gap-1">
        {OPTIONS.map((option) => (
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
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
