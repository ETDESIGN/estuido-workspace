import { NextResponse } from 'next/server'

interface EmailRequest {
  to: string
  subject: string
  message: string
}

// Resend API - free tier: 100 emails/day
const RESEND_API_KEY = process.env.RESEND_API_KEY

export async function POST(request: Request) {
  try {
    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Resend API key not configured' },
        { status: 503 }
      )
    }

    const body: EmailRequest = await request.json()
    
    if (!body.to || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, message' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'ESTUDIO Alerts <alerts@estudio.ai>',
        to: body.to,
        subject: body.subject,
        text: body.message,
        html: `<p>${body.message}</p>`
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Resend API error: ${error}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      messageId: data.id,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: RESEND_API_KEY ? 'configured' : 'not_configured',
    provider: 'resend',
    free_tier: '100 emails/day',
    setup_url: 'https://resend.com'
  })
}
