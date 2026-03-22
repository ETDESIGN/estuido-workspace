import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface ServiceStatus {
  name: string
  provider: string
  tier: 'free' | 'paid' | 'mixed'
  status: 'healthy' | 'warning' | 'critical' | 'unknown'
  limits?: {
    requests?: { current: number; max: number; period: 'day' | 'month' }
    tokens?: { current: number; max: number; period: 'day' | 'month' }
    cost?: { current: number; max: number; currency: string }
  }
  lastChecked: string
  error?: string
}

// Mock data - in production, fetch from actual APIs
const services: ServiceStatus[] = [
  {
    name: 'Brave Search',
    provider: 'brave',
    tier: 'free',
    status: 'critical',
    limits: {
      requests: { current: 55, max: 2000, period: 'month' }
    },
    lastChecked: new Date().toISOString(),
    error: 'Rate limit exceeded (429)'
  },
  {
    name: 'Tavily (Fallback)',
    provider: 'tavily',
    tier: 'free',
    status: 'healthy',
    limits: {
      requests: { current: 0, max: 1000, period: 'month' }
    },
    lastChecked: new Date().toISOString()
  },
  {
    name: 'Moonshot (Kimi)',
    provider: 'moonshot',
    tier: 'paid',
    status: 'healthy',
    limits: {
      tokens: { current: 97048, max: 1000000, period: 'month' },
      cost: { current: 18.50, max: 50, currency: 'USD' }
    },
    lastChecked: new Date().toISOString()
  },
  {
    name: 'Groq',
    provider: 'groq',
    tier: 'free',
    status: 'healthy',
    limits: {
      tokens: { current: 450000, max: 500000, period: 'day' }
    },
    lastChecked: new Date().toISOString()
  },
  {
    name: 'OpenRouter',
    provider: 'openrouter',
    tier: 'mixed',
    status: 'healthy',
    limits: {
      cost: { current: 0.30, max: 5, currency: 'USD' }
    },
    lastChecked: new Date().toISOString()
  },
  {
    name: 'KiloCode',
    provider: 'kilocode',
    tier: 'free',
    status: 'healthy',
    lastChecked: new Date().toISOString()
  },
  // NB Studio Services
  {
    name: 'NB Studio Gateway',
    provider: 'openclaw',
    tier: 'free',
    status: 'healthy',
    lastChecked: new Date().toISOString()
  },
  {
    name: 'NB Studio fs-watcher',
    provider: 'nb-studio',
    tier: 'free',
    status: 'healthy',
    lastChecked: new Date().toISOString()
  }
]

// Try to read NB Studio dashboard data
let nbStudioData: string | null = null
try {
  const dashboardPath = '/home/e/nb-studio/00_MISSION_CONTROL/DASHBOARD.md'
  if (fs.existsSync(dashboardPath)) {
    nbStudioData = fs.readFileSync(dashboardPath, 'utf-8')
  }
} catch (e) {
  // Ignore errors
}

export async function GET() {
  return NextResponse.json({
    services,
    summary: {
      total: services.length,
      healthy: services.filter(s => s.status === 'healthy').length,
      warning: services.filter(s => s.status === 'warning').length,
      critical: services.filter(s => s.status === 'critical').length,
      estimatedMonthlyCost: 24.80,
      budget: 50,
      budgetUsed: 49.6
    },
    nbStudio: nbStudioData ? {
      hasData: true,
      preview: nbStudioData.substring(0, 500)
    } : null,
    lastUpdated: new Date().toISOString()
  })
}
