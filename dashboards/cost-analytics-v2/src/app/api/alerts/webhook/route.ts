import { NextResponse } from 'next/server'

interface WebhookRequest {
  webhookUrl: string
  title: string
  message: string
  severity: 'info' | 'warning' | 'error'
}

export async function POST(request: Request) {
  try {
    const body: WebhookRequest = await request.json()
    
    if (!body.webhookUrl || !body.title) {
      return NextResponse.json(
        { error: 'Missing required fields: webhookUrl, title' },
        { status: 400 }
      )
    }

    // Determine color based on severity
    const colors: Record<string, number> = {
      info: 0x3498db,    // Blue
      warning: 0xf39c12,  // Orange/Yellow
      error: 0xe74c3c    // Red
    }
    const color = colors[body.severity] || colors.info

    // Try to send to webhook
    try {
      // Detect if it's Discord or Slack
      const isDiscord = body.webhookUrl.includes('discord.com/api/webhooks')
      const isSlack = body.webhookUrl.includes('slack.com')

      let payload: any = {
        content: null,
        embeds: [{
          title: body.title,
          description: body.message,
          color: color,
          timestamp: new Date().toISOString(),
          footer: { text: 'ESTUDIO Cost Analytics' }
        }]
      }

      // Slack format
      if (isSlack) {
        payload = {
          text: body.title,
          attachments: [{
            color: body.severity === 'error' ? '#e74c3c' : body.severity === 'warning' ? '#f39c12' : '#3498db',
            text: body.message,
            footer: 'ESTUDIO Cost Analytics'
          }]
        }
      }

      const response = await fetch(body.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Webhook error: ${response.status} - ${errorText}`)
      }

      return NextResponse.json({
        success: true,
        provider: isDiscord ? 'discord' : isSlack ? 'slack' : 'webhook',
        timestamp: new Date().toISOString()
      })
    } catch (webhookError) {
      return NextResponse.json(
        { error: `Webhook delivery failed: ${webhookError}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Webhook alert error:', error)
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    supported: ['discord', 'slack', 'generic_webhook'],
    setup: 'Configure webhook URL in Alert Settings'
  })
}
