'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { MobileNav } from '@/components/dashboard/MobileNav'

interface Session {
  sessionKey: string
  sessionId: string
  model: string
  modelProvider: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  updatedAt: number
  tier: 'PULSE' | 'WORKHORSE' | 'BRAIN'
  cost: number
}

const TIER_COLORS = {
  PULSE: 'bg-green-100 text-green-800',
  WORKHORSE: 'bg-amber-100 text-amber-800',
  BRAIN: 'bg-purple-100 text-purple-800',
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => {
        setSessions(data.sessions || [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-8">Loading sessions...</div>
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sessions</h1>
        <p className="text-sm text-slate-500">{sessions.length} total sessions</p>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead className="text-right">Tokens</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.sessionKey}>
                  <TableCell className="font-medium">{session.model}</TableCell>
                  <TableCell className="text-slate-600">{session.modelProvider}</TableCell>
                  <TableCell>
                    <Badge className={TIER_COLORS[session.tier]} variant="secondary">
                      {session.tier}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {session.totalTokens.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${session.cost.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {format(new Date(session.updatedAt), 'MMM d, HH:mm')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <MobileNav />
    </div>
  )
}
