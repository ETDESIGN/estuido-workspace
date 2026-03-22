'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Download, FileJson, FileSpreadsheet } from 'lucide-react'
import { DateRange } from './DateFilter'
import { useExportNotification } from './useCostAlerts'

interface ExportDialogProps {
  currentDateRange: DateRange
}

export function ExportDialog({ currentDateRange }: ExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<'csv' | 'json'>('csv')
  const [dateRange, setDateRange] = useState<DateRange | 'current'>('current')
  const [modelFilter, setModelFilter] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const { notifyExportComplete } = useExportNotification()

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const params = new URLSearchParams()
      params.append('format', format)
      
      // Use current date range or override
      const effectiveDateRange = dateRange === 'current' ? currentDateRange : dateRange
      if (effectiveDateRange !== 'alltime') {
        params.append('dateRange', effectiveDateRange)
      }
      
      // Add model filter if specified
      if (modelFilter.trim()) {
        params.append('model', modelFilter.trim())
      }

      const response = await fetch(`/api/export?${params.toString()}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      // Get filename from Content-Disposition header or generate default
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `cost-analytics-export.${format}`
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/)
        if (match) filename = match[1]
      }
      
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      // Show success notification
      notifyExportComplete(format, 0) // TODO: Get actual record count from response
      
      setOpen(false)
    } catch (error) {
      console.error('Export failed:', error)
      alert(error instanceof Error ? error.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Download className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Export Data</DialogTitle>
          <DialogDescription className="text-slate-400">
            Choose format and filters for your export
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-slate-300">Export Format</Label>
            <RadioGroup
              value={format}
              onValueChange={(v: string) => setFormat(v as 'csv' | 'json')}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="csv"
                  id="csv"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="csv"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-slate-900 p-4 hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 cursor-pointer"
                >
                  <FileSpreadsheet className="mb-2 h-6 w-6 text-green-400" />
                  <span className="text-sm font-medium">CSV</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="json"
                  id="json"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="json"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-slate-700 bg-slate-900 p-4 hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 cursor-pointer"
                >
                  <FileJson className="mb-2 h-6 w-6 text-amber-400" />
                  <span className="text-sm font-medium">JSON</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-3">
            <Label className="text-slate-300">Date Range</Label>
            <RadioGroup
              value={dateRange}
              onValueChange={(v: string) => setDateRange(v as DateRange | 'current')}
              className="grid grid-cols-2 gap-2"
            >
              <div>
                <RadioGroupItem value="current" id="current" className="peer sr-only" />
                <Label
                  htmlFor="current"
                  className="flex items-center justify-center rounded-md border-2 border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 cursor-pointer"
                >
                  Current ({currentDateRange})
                </Label>
              </div>
              <div>
                <RadioGroupItem value="today" id="today" className="peer sr-only" />
                <Label
                  htmlFor="today"
                  className="flex items-center justify-center rounded-md border-2 border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 cursor-pointer"
                >
                  Today
                </Label>
              </div>
              <div>
                <RadioGroupItem value="7days" id="7days" className="peer sr-only" />
                <Label
                  htmlFor="7days"
                  className="flex items-center justify-center rounded-md border-2 border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 cursor-pointer"
                >
                  7 Days
                </Label>
              </div>
              <div>
                <RadioGroupItem value="30days" id="30days" className="peer sr-only" />
                <Label
                  htmlFor="30days"
                  className="flex items-center justify-center rounded-md border-2 border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 cursor-pointer"
                >
                  30 Days
                </Label>
              </div>
              <div>
                <RadioGroupItem value="alltime" id="alltime" className="peer sr-only" />
                <Label
                  htmlFor="alltime"
                  className="flex items-center justify-center rounded-md border-2 border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:bg-slate-800 hover:border-slate-600 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-500/10 cursor-pointer"
                >
                  All Time
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Model Filter */}
          <div className="space-y-3">
            <Label htmlFor="model-filter" className="text-slate-300">
              Model Filter (optional)
            </Label>
            <Input
              id="model-filter"
              placeholder="e.g., kimi, claude, gpt..."
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500"
            />
            <p className="text-xs text-slate-500">
              Filter by model name or provider (case-insensitive)
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isExporting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export {format.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
