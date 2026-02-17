'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, DollarSign, PiggyBank, Calculator } from 'lucide-react'
import type { CostAnalysis as CostAnalysisType } from '@/lib/data'

interface CostAnalysisProps {
  data: CostAnalysisType
}

export function CostAnalysis({ data }: CostAnalysisProps) {
  const savingsPercent = data.premiumOnlyCost > 0
    ? ((data.savingsVsPremium / data.premiumOnlyCost) * 100)
    : 0

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-200">Cost Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-slate-400">Monthly Projection</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              ${data.monthlyProjection.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Based on current usage rate
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-400">Savings vs Premium</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              ${data.savingsVsPremium.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {savingsPercent.toFixed(1)}% saved by using tiered models
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-700/30">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-slate-400">Cost Comparison Calculator</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Premium Only</div>
              <div className="text-lg font-bold text-purple-400">
                ${data.premiumOnlyCost.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Current Cost</div>
              <div className="text-lg font-bold text-blue-400">
                ${data.currentCost.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">You Saved</div>
              <div className="text-lg font-bold text-green-400">
                ${data.savingsVsPremium.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-slate-400 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Cost per Tier
          </div>
          {data.costPerTier.map((tier) => (
            <div key={tier.tier} className="flex items-center justify-between p-2 rounded bg-slate-700/20">
              <span className="text-sm text-slate-300">{tier.tier}</span>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500">{tier.sessions} sessions</span>
                <span className={`font-medium ${
                  tier.tier === 'PULSE' ? 'text-green-400' :
                  tier.tier === 'WORKHORSE' ? 'text-amber-400' : 'text-purple-400'
                }`}>
                  ${tier.totalCost.toFixed(4)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
