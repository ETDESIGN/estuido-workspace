import { NextResponse } from 'next/server'

interface PollinationsImageRequest {
  prompt: string
  width?: number
  height?: number
  seed?: number
  nologo?: boolean
}

export async function POST(request: Request) {
  try {
    const body: PollinationsImageRequest = await request.json()
    
    if (!body.prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Construct Pollinations URL
    const params = new URLSearchParams()
    if (body.width) params.set('width', String(body.width))
    if (body.height) params.set('height', String(body.height))
    if (body.seed) params.set('seed', String(body.seed))
    if (body.nologo) params.set('nologo', 'true')

    const encodedPrompt = encodeURIComponent(body.prompt)
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`

    // Log usage
    await fetch('http://localhost:5173/api/services/usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: 'pollinations',
        endpoint: '/prompt',
        status: 'success',
        timestamp: new Date().toISOString()
      })
    }).catch(() => {}) // Non-blocking

    return NextResponse.json({
      success: true,
      url: pollinationsUrl,
      prompt: body.prompt,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
