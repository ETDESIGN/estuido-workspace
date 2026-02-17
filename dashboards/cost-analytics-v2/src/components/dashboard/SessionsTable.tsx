'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { Session } from '@/lib/data'
import { getTierColorClass } from '@/lib/data'

interface SessionsTableProps {
  sessions: Session[]
}

export function SessionsTable({ sessions }: SessionsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredSessions = sessions.filter(s => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    return (
      s.model.toLowerCase().includes(term) ||
      s.modelProvider.toLowerCase().includes(term) ||
      s.tier.toLowerCase().includes(term)
    )
  })

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`
    return tokens.toString()
  }

  const getTierBadge = (tier: 'PULSE' | 'WORKHORSE' | 'BRAIN') => {
    const colors = {
      PULSE: 'bg-green-500/20 text-green-400 border-green-500/30',
      WORKHORSE: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      BRAIN: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    }
    return (
      <Badge variant="outline" className={colors[tier]}>
        {tier}
      </Badge>
    )
  }

  const getTierRowClass = (tier: 'PULSE' | 'WORKHORSE' | 'BRAIN') => {
    const classes = {
      PULSE: 'hover:bg-green-500/5',
      WORKHORSE: 'hover:bg-amber-500/5',
      BRAIN: 'hover:bg-purple-500/5',
    }
    return classes[tier]
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-slate-200">Recent Sessions</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by model..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/50">
                <TableHead className="text-slate-400">Model</TableHead>
                <TableHead className="text-slate-400">Provider</TableHead>
                <TableHead className="text-slate-400">Tier</TableHead>
                <TableHead className="text-slate-400 text-right">Tokens</TableHead>
                <TableHead className="text-slate-400 text-right">Cost</TableHead>
                <TableHead className="text-slate-400">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                    No sessions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSessions.slice(0, 50).map((session) => (
                  <TableRow 
                    key={session.sessionId} 
                    className={`border-slate-700 ${getTierRowClass(session.tier)}`}
                  >
                    <TableCell className="font-medium text-slate-200">
                      {session.model}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {session.modelProvider}
                    </TableCell>
                    <TableCell>
                      {getTierBadge(session.tier)}
                    </TableCell>
                    <TableCell className="text-right text-slate-300">
                      {formatTokens(session.totalTokens)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={getTierColorClass(session.tier)}>
                        ${session.cost.toFixed(4)}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {formatTimestamp(session.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        {filteredSessions.length > 50 && (
          <div className="text-center text-sm text-slate-400 py-2">
            Showing 50 of {filteredSessions.length} sessions
          </div>
        )}
      </CardContent>
    </Card>
  )
}
