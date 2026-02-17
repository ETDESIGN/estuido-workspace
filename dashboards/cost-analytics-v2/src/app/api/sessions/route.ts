import { NextResponse } from 'next/server'

// Pricing config
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'kimi-k2.5': { input: 0.6, output: 2.4 },
  'kimi-k2': { input: 0.5, output: 2.0 },
  'moonshot-v1': { input: 0.5, output: 2.0 },
  'minimax': { input: 0.3, output: 1.2 },
  'minimax-m2.5': { input: 0.4, output: 2.2 },
  'gemini-flash': { input: 0, output: 0 },
  'gemini-2.0-flash': { input: 0, output: 0 },
  'groq-llama': { input: 0, output: 0 },
  'llama-3.3-70b': { input: 0, output: 0 },
  'claude-3-opus': { input: 15.0, output: 75.0 },
  'claude-3-sonnet': { input: 3.0, output: 15.0 },
  'claude-3-haiku': { input: 0.25, output: 1.25 },
  'gpt-4': { input: 30.0, output: 60.0 },
  'gpt-4-turbo': { input: 10.0, output: 30.0 },
  'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
  'default': { input: 0.5, output: 2.0 },
}

const TIER_CONFIG = {
  PULSE: { models: ['gemini-flash', 'groq', 'llama', 'mixtral'] },
  WORKHORSE: { models: ['minimax', 'moonshot'] },
  BRAIN: { models: ['kimi', 'claude', 'gpt-4'] },
} as const

type Tier = 'PULSE' | 'WORKHORSE' | 'BRAIN'

function getTier(model: string, provider: string): Tier {
  const m = model.toLowerCase()
  const p = provider.toLowerCase()
  if (TIER_CONFIG.PULSE.models.some(x => m.includes(x) || p.includes(x))) return 'PULSE'
  if (TIER_CONFIG.WORKHORSE.models.some(x => m.includes(x) || p.includes(x))) return 'WORKHORSE'
  return 'BRAIN'
}

function calculateCost(model: string, input: number, output: number): number {
  const pricing = MODEL_PRICING[model] || MODEL_PRICING['default']
  return Math.round(((input / 1e6) * pricing.input + (output / 1e6) * pricing.output) * 10000) / 10000
}

// Generate consistent data ONCE per day based on seed
function generateConsistentData() {
  const sessions = []
  const now = Date.now()
  const models = [
    { name: 'kimi-k2.5', provider: 'moonshot', tier: 'BRAIN' as Tier },
    { name: 'minimax-m2.5', provider: 'openrouter', tier: 'WORKHORSE' as Tier },
    { name: 'gemini-2.0-flash', provider: 'openrouter', tier: 'PULSE' as Tier },
    { name: 'llama-3.3-70b', provider: 'groq', tier: 'PULSE' as Tier },
  ]
  
  // Use deterministic "random" based on day
  const daySeed = Math.floor(now / (24 * 60 * 60 * 1000))
  
  for (let i = 0; i < 30; i++) {
    // Deterministic pseudo-random
    const seed = daySeed + i
    const pseudoRandom = Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000)
    
    const modelIndex = Math.floor(pseudoRandom * models.length)
    const model = models[modelIndex]
    const inputTokens = Math.floor(pseudoRandom * 40000) + 2000
    const outputTokens = Math.floor(pseudoRandom * 15000) + 500
    const hoursAgo = Math.floor(pseudoRandom * 168)
    
    sessions.push({
      sessionKey: `sess-${daySeed}-${i}`,
      sessionId: `sess-${Math.abs(seed).toString(36).substr(0, 9)}`,
      model: model.name,
      modelProvider: model.provider,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      updatedAt: now - (hoursAgo * 60 * 60 * 1000),
      tier: model.tier,
      cost: calculateCost(model.name, inputTokens, outputTokens),
    })
  }
  
  return sessions.sort((a, b) => b.updatedAt - a.updatedAt)
}

// Cache for 5 minutes
let cachedSessions: any[] | null = null
let cacheTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function GET() {
  try {
    const now = Date.now()
    
    // Return cached data if valid
    if (cachedSessions && (now - cacheTime) < CACHE_TTL) {
      return NextResponse.json({
        sessions: cachedSessions,
        meta: {
          source: 'cached',
          cachedAt: new Date(cacheTime).toISOString(),
          expiresIn: Math.round((CACHE_TTL - (now - cacheTime)) / 1000) + 's',
          sessions: cachedSessions.length,
        }
      })
    }
    
    // Generate new consistent data
    cachedSessions = generateConsistentData()
    cacheTime = now
    
    return NextResponse.json({
      sessions: cachedSessions,
      meta: {
        source: 'generated',
        note: 'Data refreshes every 5 minutes',
        sessions: cachedSessions.length,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    return NextResponse.json({
      sessions: [],
      error: String(error),
      meta: { source: 'error' }
    }, { status: 500 })
  }
}
