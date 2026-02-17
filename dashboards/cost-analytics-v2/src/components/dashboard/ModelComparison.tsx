'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { ModelPerformance } from '@/lib/data'

interface ModelComparisonProps {
  data: ModelPerformance[]
}

export function ModelComparison({ data }: ModelComparisonProps) {
  const formatTokens = (tokens: number | undefined) => {
    if (tokens === undefined || tokens === null) return '0'
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`
    return tokens.toString()
  }

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return '0'
    return num.toLocaleString()
  }

  const formatCost = (cost: number | undefined) => {
    if (cost === undefined || cost === null) return '$0.0000'
    return `$${cost.toFixed(4)}`
  }

  const getTierBadge = (tier: 'PULSE' | 'WORKHORSE' | 'BRAIN') => {
    const colors = {
      PULSE: 'bg-green-500/20 text-green-400 border-green-500/30',
      WORKHORSE: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      BRAIN: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    }
    return (
      <Badge variant="outline" className={colors[tier] || colors.BRAIN}>
        {tier || 'UNKNOWN'}
      </Badge>
    )
  }

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-200">Model Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-center py-8">No model data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-200">Model Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700 hover:bg-slate-700/50">
              <TableHead className="text-slate-400">Model</TableHead>
              <TableHead className="text-slate-400">Provider</TableHead>
              <TableHead className="text-slate-400">Tier</TableHead>
              <TableHead className="text-slate-400 text-right">Sessions</TableHead>
              <TableHead className="text-slate-400 text-right">Avg Tokens</TableHead>
              <TableHead className="text-slate-400 text-right">Total Cost</TableHead>
              <TableHead className="text-slate-400 text-right">Avg Cost/Session</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((model, index) => (
              <TableRow key={index} className="border-slate-700 hover:bg-slate-700/50">
                <TableCell className="font-medium text-slate-200">
                  <div className="flex items-center gap-2">
                    {model.model || 'Unknown'}
                    {model.isMostExpensive && (
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <TrendingUp className="h-3 w-3" />
                        Most Expensive
                      </span>
                    )}
                    {model.isLeastExpensive && (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <TrendingDown className="h-3 w-3" />
                        Least Expensive
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-slate-400">
                  {model.provider || 'Unknown'}
                </TableCell>
                <TableCell>
                  {getTierBadge(model.tier)}
                </TableCell>
                <TableCell className="text-right text-slate-300">
                  {formatNumber(model.totalSessions)}
                </TableCell>
                <TableCell className="text-right text-slate-300">
                  {formatTokens(model.avgTokensPerSession)}
                </TableCell>
                <TableCell className="text-right">
                  <span className={model.tier === 'PULSE' ? 'text-green-400' : model.tier === 'WORKHORSE' ? 'text-amber-400' : 'text-purple-400'}>
                    {formatCost(model.totalCost)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={`${model.isMostExpensive ? 'text-red-400' : model.isLeastExpensive ? 'text-green-400' : 'text-slate-300'}`}>
                    {formatCost(model.avgCostPerSession)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
