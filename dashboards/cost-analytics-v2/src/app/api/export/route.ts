import { NextResponse } from 'next/server'
import fs from 'fs'
import { processSessions, sessionsToCSV, filterSessionsByDateRange, filterSessionsByModel, Session } from '@/lib/data'

const SESSIONS_PATH = '/home/e/.openclaw/agents/main/sessions/sessions.json'

function readSessionsData(): Record<string, unknown> {
  try {
    const data = fs.readFileSync(SESSIONS_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

function sessionsToJSON(sessions: Session[]): string {
  return JSON.stringify({
    exportDate: new Date().toISOString(),
    totalSessions: sessions.length,
    sessions: sessions.map(s => ({
      sessionId: s.sessionId,
      model: s.model,
      provider: s.modelProvider,
      tier: s.tier,
      inputTokens: s.inputTokens,
      outputTokens: s.outputTokens,
      totalTokens: s.totalTokens,
      cost: s.cost,
      costFormatted: `$${s.cost.toFixed(6)}`,
      updatedAt: s.updatedAt,
      updatedAtFormatted: new Date(s.updatedAt).toISOString(),
    })),
    summary: {
      totalCost: sessions.reduce((sum, s) => sum + s.cost, 0),
      totalTokens: sessions.reduce((sum, s) => sum + s.totalTokens, 0),
      avgCostPerSession: sessions.length > 0 ? sessions.reduce((sum, s) => sum + s.cost, 0) / sessions.length : 0,
      tierBreakdown: {
        PULSE: sessions.filter(s => s.tier === 'PULSE').length,
        WORKHORSE: sessions.filter(s => s.tier === 'WORKHORSE').length,
        BRAIN: sessions.filter(s => s.tier === 'BRAIN').length,
      },
    },
  }, null, 2)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const format = searchParams.get('format') || 'csv'
    const dateRange = searchParams.get('dateRange') as 'today' | '7days' | '30days' | 'alltime' | null
    const modelFilter = searchParams.get('model') || ''
    
    // Validate format
    if (format !== 'csv' && format !== 'json') {
      return NextResponse.json(
        { error: 'Invalid format. Use "csv" or "json"' },
        { status: 400 }
      )
    }
    
    // Read and process sessions
    const rawData = readSessionsData()
    let sessions = processSessions(rawData)
    
    // Apply date range filter if specified
    if (dateRange && dateRange !== 'alltime') {
      const validRanges = ['today', '7days', '30days']
      if (!validRanges.includes(dateRange)) {
        return NextResponse.json(
          { error: 'Invalid dateRange. Use "today", "7days", "30days", or "alltime"' },
          { status: 400 }
        )
      }
      sessions = filterSessionsByDateRange(sessions, dateRange)
    }
    
    // Apply model filter if specified
    if (modelFilter.trim()) {
      sessions = filterSessionsByModel(sessions, modelFilter)
    }
    
    // Generate filename based on filters
    const parts: string[] = ['sessions-export']
    if (dateRange && dateRange !== 'alltime') parts.push(dateRange)
    if (modelFilter.trim()) parts.push(modelFilter.toLowerCase().replace(/\s+/g, '-'))
    const filename = `${parts.join('-')}.${format}`
    
    // Generate export content based on format
    if (format === 'json') {
      const json = sessionsToJSON(sessions)
      return new NextResponse(json, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    } else {
      const csv = sessionsToCSV(sessions)
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    }
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export sessions' },
      { status: 500 }
    )
  }
}
