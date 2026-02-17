import { NextResponse } from 'next/server'

interface TavilySearchRequest {
  query: string
  max_results?: number
  include_answer?: boolean
}

interface TavilySearchResult {
  title: string
  url: string
  content: string
  score: number
}

// Tavily API configuration - will use env var or fallback
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || ''
const TAVILY_API_URL = 'https://api.tavily.com/search'

export async function POST(request: Request) {
  try {
    if (!TAVILY_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Tavily API key not configured',
          setupInstructions: {
            url: 'https://tavily.com',
            steps: [
              'Sign up at https://tavily.com (free tier: 1000 searches/month)',
              'Get your API key from the dashboard',
              'Add to environment: TAVILY_API_KEY=your_key',
              'Restart the server'
            ]
          }
        },
        { status: 503 }
      )
    }

    const body: TavilySearchRequest = await request.json()
    
    if (!body.query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const response = await fetch(TAVILY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TAVILY_API_KEY}`
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: body.query,
        max_results: body.max_results || 5,
        include_answer: body.include_answer ?? true
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Tavily API error: ${error}`)
    }

    const data = await response.json()

    // Log usage
    await fetch('http://localhost:5173/api/services/usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: 'tavily',
        endpoint: '/search',
        status: 'success',
        timestamp: new Date().toISOString()
      })
    }).catch(() => {}) // Non-blocking

    return NextResponse.json({
      success: true,
      query: body.query,
      answer: data.answer,
      results: data.results as TavilySearchResult[],
      searchTime: new Date().toISOString()
    })
  } catch (error) {
    // Log error
    await fetch('http://localhost:5173/api/services/usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: 'tavily',
        endpoint: '/search',
        status: 'error',
        errorMessage: String(error),
        timestamp: new Date().toISOString()
      })
    }).catch(() => {})

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: TAVILY_API_KEY ? 'configured' : 'not_configured',
    limits: {
      free_tier: '1000 searches/month',
      rate_limit: 'Not specified (generous)'
    },
    setup_url: 'https://tavily.com'
  })
}
