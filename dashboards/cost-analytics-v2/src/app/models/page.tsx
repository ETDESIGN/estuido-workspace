'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cpu, TrendingUp, DollarSign, Activity } from 'lucide-react'
import { MobileNav } from '@/components/dashboard/MobileNav'

interface ModelStats {
  model: string
  provider: string
  sessions: number
  totalTokens: number
  totalCost: number
  avgCostPerSession: number
}

export default function ModelsPage() {
  const [models, setModels] = useState<ModelStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => {
        // Aggregate by model
        const modelMap = new Map<string, ModelStats>()
        
        data.sessions?.forEach((s: any) => {
          const key = `${s.model}-${s.modelProvider}`
          const existing = modelMap.get(key)
          
          if (existing) {
            existing.sessions += 1
            existing.totalTokens += s.totalTokens
            existing.totalCost += s.cost
          } else {
            modelMap.set(key, {
              model: s.model,
              provider: s.modelProvider,
              sessions: 1,
              totalTokens: s.totalTokens,
              totalCost: s.cost,
              avgCostPerSession: s.cost
            })
          }
        })
        
        // Calculate averages and convert to array
        const stats = Array.from(modelMap.values()).map(m => ({
          ...m,
          avgCostPerSession: m.totalCost / m.sessions
        }))
        
        setModels(stats.sort((a, b) => b.totalCost - a.totalCost))
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-8">Loading models...</div>
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <h1 className="text-2xl font-bold">Models</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <Card key={`${model.model}-${model.provider}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Cpu className="h-5 w-5 text-purple-500" />
                {model.model}
              </CardTitle>
              <p className="text-sm text-slate-500">{model.provider}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  Sessions
                </span>
                <span className="font-semibold">{model.sessions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Tokens
                </span>
                <span className="font-semibold">{model.totalTokens.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Total Cost
                </span>
                <span className="font-semibold text-purple-600">
                  ${model.totalCost.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-sm text-slate-500">Avg/Session</span>
                <span className="text-sm font-medium">
                  ${model.avgCostPerSession.toFixed(4)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <MobileNav />
    </div>
  )
}
