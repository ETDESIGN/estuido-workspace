import { NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { AnalyticsReport } from '@/components/pdf/AnalyticsReport'

interface ExportRequest {
  dateRange: string
  sessions: Array<{
    sessionKey: string
    model: string
    totalTokens: number
    cost: number
    updatedAt: number
  }>
}

export async function POST(request: Request) {
  try {
    const body: ExportRequest = await request.json()
    
    if (!body.sessions || body.sessions.length === 0) {
      return NextResponse.json(
        { error: 'No sessions data to export' },
        { status: 400 }
      )
    }

    // Calculate summary stats
    const totalCost = body.sessions.reduce((sum, s) => sum + (s.cost || 0), 0)
    const totalTokens = body.sessions.reduce((sum, s) => sum + (s.totalTokens || 0), 0)
    const sessionCount = body.sessions.length

    // Prepare report data
    const reportData = {
      title: 'ESTUDIO AI Analytics Report',
      generatedAt: new Date().toISOString(),
      dateRange: body.dateRange || 'All time',
      totalCost,
      totalTokens,
      sessionCount,
      sessions: body.sessions
    }

    // Generate PDF
    const stream = await renderToStream(<AnalyticsReport data={reportData} />)
    
    // Convert stream to buffer
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
      const buf = typeof chunk === 'string' ? Buffer.from(chunk) : chunk
      chunks.push(buf)
    }
    const buffer = Buffer.concat(chunks)

    // Return PDF
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="estudio-analytics-${Date.now()}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF export error:', error)
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    format: 'PDF (A4)',
    content: [
      'Header with title and date',
      'Summary statistics (cost, tokens, sessions)',
      'Sessions table (first 30 rows)',
      'Footer with branding'
    ],
    usage: 'POST with { dateRange, sessions[] }'
  })
}
