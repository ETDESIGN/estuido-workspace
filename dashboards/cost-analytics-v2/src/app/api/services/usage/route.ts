import { NextResponse } from 'next/server'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'

const LOG_FILE = join(process.env.HOME || '/home/e', '.openclaw', 'logs', 'api-usage.jsonl')

interface ApiUsageEntry {
  timestamp: string
  service: string
  endpoint: string
  tokens?: number
  cost?: number
  status: 'success' | 'error'
  errorMessage?: string
}

export async function POST(request: Request) {
  try {
    const entry: ApiUsageEntry = await request.json()
    
    // Ensure log directory exists
    const logDir = join(process.env.HOME || '/home/e', '.openclaw', 'logs')
    if (!existsSync(logDir)) {
      await import('fs').then(fs => fs.mkdirSync(logDir, { recursive: true }))
    }
    
    // Append to log file
    const logLine = JSON.stringify({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString()
    }) + '\n'
    
    writeFileSync(LOG_FILE, logLine, { flag: 'a' })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const service = searchParams.get('service')
    const days = parseInt(searchParams.get('days') || '7')
    
    if (!existsSync(LOG_FILE)) {
      return NextResponse.json({ entries: [], summary: {} })
    }
    
    const content = readFileSync(LOG_FILE, 'utf-8')
    const entries: ApiUsageEntry[] = content
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line))
      .filter(entry => {
        const entryDate = new Date(entry.timestamp)
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - days)
        return entryDate >= cutoff
      })
    
    if (service) {
      return NextResponse.json({
        entries: entries.filter(e => e.service === service),
        summary: calculateSummary(entries.filter(e => e.service === service))
      })
    }
    
    return NextResponse.json({
      entries,
      summary: calculateSummary(entries)
    })
  } catch (error) {
    return NextResponse.json(
      { entries: [], error: String(error) },
      { status: 500 }
    )
  }
}

function calculateSummary(entries: ApiUsageEntry[]) {
  const byService: Record<string, { requests: number; tokens: number; cost: number; errors: number }> = {}
  
  for (const entry of entries) {
    if (!byService[entry.service]) {
      byService[entry.service] = { requests: 0, tokens: 0, cost: 0, errors: 0 }
    }
    byService[entry.service].requests++
    byService[entry.service].tokens += entry.tokens || 0
    byService[entry.service].cost += entry.cost || 0
    if (entry.status === 'error') {
      byService[entry.service].errors++
    }
  }
  
  return byService
}
