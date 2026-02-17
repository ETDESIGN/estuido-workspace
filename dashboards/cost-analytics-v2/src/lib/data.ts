// Server-side data utilities - no fs imports here

export interface Session {
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

export interface ModelStats {
  model: string
  provider: string
  sessions: number
  totalTokens: number
  totalCost: number
  avgCostPerSession: number
  tier: 'PULSE' | 'WORKHORSE' | 'BRAIN'
}

export interface DailyCost {
  date: string
  cost: number
  tokens: number
  sessions: number
}

const TIER_CONFIG = {
  PULSE: {
    models: ['gemini-flash', 'groq', 'llama', 'mixtral'],
    color: 'bg-green-500',
    colorClass: 'text-green-500',
  },
  WORKHORSE: {
    models: ['minimax', 'moonshot'],
    color: 'bg-amber-500',
    colorClass: 'text-amber-500',
  },
  BRAIN: {
    models: ['kimi', 'claude', 'gpt-4'],
    color: 'bg-purple-500',
    colorClass: 'text-purple-500',
  },
} as const

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

function getTier(model: string, provider: string): 'PULSE' | 'WORKHORSE' | 'BRAIN' {
  const modelLower = model.toLowerCase()
  const providerLower = provider.toLowerCase()
  
  if (TIER_CONFIG.PULSE.models.some(m => modelLower.includes(m) || providerLower.includes(m))) {
    return 'PULSE'
  }
  if (TIER_CONFIG.WORKHORSE.models.some(m => modelLower.includes(m) || providerLower.includes(m))) {
    return 'WORKHORSE'
  }
  return 'BRAIN'
}

function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = MODEL_PRICING[model] || MODEL_PRICING['default']
  const inputCost = (inputTokens / 1_000_000) * pricing.input
  const outputCost = (outputTokens / 1_000_000) * pricing.output
  return inputCost + outputCost
}

export function processSessions(rawData: Record<string, unknown>): Session[] {
  const sessions: Session[] = []
  
  for (const [key, value] of Object.entries(rawData)) {
    const session = value as Record<string, unknown>
    const model = (session.model as string) || 'unknown'
    const provider = (session.modelProvider as string) || 'unknown'
    const inputTokens = (session.inputTokens as number) || 0
    const outputTokens = (session.outputTokens as number) || 0
    const totalTokens = (session.totalTokens as number) || inputTokens + outputTokens
    
    sessions.push({
      sessionKey: key,
      sessionId: (session.sessionId as string) || key,
      model,
      modelProvider: provider,
      inputTokens,
      outputTokens,
      totalTokens,
      updatedAt: (session.updatedAt as number) || Date.now(),
      tier: getTier(model, provider),
      cost: calculateCost(model, inputTokens, outputTokens),
    })
  }
  
  return sessions.sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getStats(sessions: Session[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTimestamp = today.getTime()
  
  const todaySessions = sessions.filter(s => s.updatedAt >= todayTimestamp)
  const todayCost = todaySessions.reduce((sum, s) => sum + s.cost, 0)
  const totalTokens = sessions.reduce((sum, s) => sum + s.totalTokens, 0)
  const sessionCount = sessions.length
  
  const brainCost = sessions.filter(s => s.tier === 'BRAIN').reduce((sum, s) => sum + s.cost, 0)
  const pulseCost = sessions.filter(s => s.tier === 'PULSE').reduce((sum, s) => sum + s.cost, 0)
  const savings = brainCost > 0 ? ((brainCost - pulseCost) / brainCost) * 100 : 0
  
  return {
    todayCost,
    totalTokens,
    sessionCount,
    savingsPercent: Math.max(0, Math.min(100, savings)),
  }
}

export function getModelStats(sessions: Session[]): ModelStats[] {
  const modelMap = new Map<string, Session[]>()
  
  for (const session of sessions) {
    const key = `${session.modelProvider}/${session.model}`
    const existing = modelMap.get(key) || []
    existing.push(session)
    modelMap.set(key, existing)
  }
  
  const stats: ModelStats[] = []
  
  for (const [key, modelSessions] of modelMap) {
    const [provider, model] = key.split('/')
    const totalCost = modelSessions.reduce((sum, s) => sum + s.cost, 0)
    const totalTokens = modelSessions.reduce((sum, s) => sum + s.totalTokens, 0)
    
    stats.push({
      model,
      provider,
      sessions: modelSessions.length,
      totalTokens,
      totalCost,
      avgCostPerSession: totalCost / modelSessions.length,
      tier: modelSessions[0].tier,
    })
  }
  
  return stats.sort((a, b) => b.totalCost - a.totalCost)
}

export function getDailyCosts(sessions: Session[], days = 30): DailyCost[] {
  const dailyMap = new Map<string, { cost: number; tokens: number; sessions: number }>()
  
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    dailyMap.set(dateStr, { cost: 0, tokens: 0, sessions: 0 })
  }
  
  for (const session of sessions) {
    const date = new Date(session.updatedAt)
    const dateStr = date.toISOString().split('T')[0]
    
    if (dailyMap.has(dateStr)) {
      const existing = dailyMap.get(dateStr)!
      existing.cost += session.cost
      existing.tokens += session.totalTokens
      existing.sessions += 1
    }
  }
  
  return Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      cost: data.cost,
      tokens: data.tokens,
      sessions: data.sessions,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function getTierColor(tier: 'PULSE' | 'WORKHORSE' | 'BRAIN'): string {
  return TIER_CONFIG[tier].color
}

export function getTierColorClass(tier: 'PULSE' | 'WORKHORSE' | 'BRAIN'): string {
  return TIER_CONFIG[tier].colorClass
}

export interface TierStats {
  tier: 'PULSE' | 'WORKHORSE' | 'BRAIN'
  sessions: number
  totalCost: number
  totalTokens: number
  percentOfTotal: number
}

export function getTierStats(sessions: Session[]): TierStats[] {
  const totalSessions = sessions.length
  const tierMap = new Map<'PULSE' | 'WORKHORSE' | 'BRAIN', { sessions: number; cost: number; tokens: number }>()
  
  tierMap.set('PULSE', { sessions: 0, cost: 0, tokens: 0 })
  tierMap.set('WORKHORSE', { sessions: 0, cost: 0, tokens: 0 })
  tierMap.set('BRAIN', { sessions: 0, cost: 0, tokens: 0 })
  
  for (const session of sessions) {
    const existing = tierMap.get(session.tier)!
    existing.sessions += 1
    existing.cost += session.cost
    existing.tokens += session.totalTokens
  }
  
  return Array.from(tierMap.entries()).map(([tier, data]) => ({
    tier,
    sessions: data.sessions,
    totalCost: data.cost,
    totalTokens: data.tokens,
    percentOfTotal: totalSessions > 0 ? (data.sessions / totalSessions) * 100 : 0,
  }))
}

export interface CostAnalysis {
  costPerTier: TierStats[]
  monthlyProjection: number
  savingsVsPremium: number
  premiumOnlyCost: number
  currentCost: number
}

export function getCostAnalysis(sessions: Session[], daysInPeriod: number): CostAnalysis {
  const tierStats = getTierStats(sessions)
  const totalCost = sessions.reduce((sum, s) => sum + s.cost, 0)
  const avgDailyCost = daysInPeriod > 0 ? totalCost / daysInPeriod : totalCost
  const monthlyProjection = avgDailyCost * 30
  
  const avgBrainCost = sessions.filter(s => s.tier === 'BRAIN').length > 0
    ? sessions.filter(s => s.tier === 'BRAIN').reduce((sum, s) => sum + s.cost, 0) / sessions.filter(s => s.tier === 'BRAIN').length
    : 0.01
  
  const premiumOnlyCost = sessions.length * avgBrainCost
  const savingsVsPremium = premiumOnlyCost - totalCost
  
  return {
    costPerTier: tierStats,
    monthlyProjection,
    savingsVsPremium: Math.max(0, savingsVsPremium),
    premiumOnlyCost,
    currentCost: totalCost,
  }
}

export interface ModelPerformance {
  model: string
  provider: string
  tier: 'PULSE' | 'WORKHORSE' | 'BRAIN'
  avgTokensPerSession: number
  totalSessions: number
  totalCost: number
  avgCostPerSession: number
  isMostExpensive: boolean
  isLeastExpensive: boolean
}

export function getModelPerformance(sessions: Session[]): ModelPerformance[] {
  const modelMap = new Map<string, Session[]>()
  
  for (const session of sessions) {
    const key = `${session.modelProvider}/${session.model}`
    const existing = modelMap.get(key) || []
    existing.push(session)
    modelMap.set(key, existing)
  }
  
  const performances: ModelPerformance[] = []
  
  for (const [key, modelSessions] of modelMap) {
    const [provider, model] = key.split('/')
    const totalTokens = modelSessions.reduce((sum, s) => sum + s.totalTokens, 0)
    const totalCost = modelSessions.reduce((sum, s) => sum + s.cost, 0)
    
    performances.push({
      model,
      provider,
      tier: modelSessions[0].tier,
      avgTokensPerSession: totalTokens / modelSessions.length,
      totalSessions: modelSessions.length,
      totalCost,
      avgCostPerSession: totalCost / modelSessions.length,
      isMostExpensive: false,
      isLeastExpensive: false,
    })
  }
  
  if (performances.length > 0) {
    const sortedByCost = [...performances].sort((a, b) => b.avgCostPerSession - a.avgCostPerSession)
    const mostExpensiveModel = sortedByCost[0].model
    const leastExpensiveModel = sortedByCost[sortedByCost.length - 1].model
    
    for (const p of performances) {
      p.isMostExpensive = p.model === mostExpensiveModel
      p.isLeastExpensive = p.model === leastExpensiveModel
    }
  }
  
  return performances.sort((a, b) => b.totalSessions - a.totalSessions)
}

export function filterSessionsByDateRange(
  sessions: Session[],
  range: 'today' | '7days' | '30days' | 'alltime'
): Session[] {
  if (range === 'alltime') {
    return sessions
  }
  
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  
  let startDate: Date
  
  switch (range) {
    case 'today':
      startDate = now
      break
    case '7days':
      startDate = new Date(now)
      startDate.setDate(startDate.getDate() - 7)
      break
    case '30days':
      startDate = new Date(now)
      startDate.setDate(startDate.getDate() - 30)
      break
  }
  
  const startTimestamp = startDate.getTime()
  return sessions.filter(s => s.updatedAt >= startTimestamp)
}

export function filterSessionsByModel(sessions: Session[], searchTerm: string): Session[] {
  if (!searchTerm.trim()) return sessions
  const term = searchTerm.toLowerCase()
  return sessions.filter(
    s => s.model.toLowerCase().includes(term) || s.modelProvider.toLowerCase().includes(term)
  )
}

export interface TrendData {
  current: number
  previous: number
  percentChange: number
  trend: 'up' | 'down' | 'neutral'
}

export function getTrendData(
  sessions: Session[],
  metric: 'cost' | 'tokens' | 'sessions',
  currentRange: 'today' | '7days' | '30days'
): TrendData {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  
  let currentStart: Date
  let previousStart: Date
  let periodLength: number
  
  switch (currentRange) {
    case 'today':
      currentStart = now
      previousStart = new Date(now)
      previousStart.setDate(previousStart.getDate() - 1)
      periodLength = 1
      break
    case '7days':
      currentStart = new Date(now)
      currentStart.setDate(currentStart.getDate() - 7)
      previousStart = new Date(currentStart)
      previousStart.setDate(previousStart.getDate() - 7)
      periodLength = 7
      break
    case '30days':
      currentStart = new Date(now)
      currentStart.setDate(currentStart.getDate() - 30)
      previousStart = new Date(currentStart)
      previousStart.setDate(previousStart.getDate() - 30)
      periodLength = 30
      break
  }
  
  const currentEnd = currentRange === 'today' ? new Date(now.getTime() + 86400000) : now
  const previousEnd = currentStart
  
  const currentSessions = sessions.filter(
    s => s.updatedAt >= currentStart.getTime() && s.updatedAt < currentEnd.getTime()
  )
  const previousSessions = sessions.filter(
    s => s.updatedAt >= previousStart.getTime() && s.updatedAt < previousEnd.getTime()
  )
  
  let currentValue: number
  let previousValue: number
  
  switch (metric) {
    case 'cost':
      currentValue = currentSessions.reduce((sum, s) => sum + s.cost, 0)
      previousValue = previousSessions.reduce((sum, s) => sum + s.cost, 0)
      break
    case 'tokens':
      currentValue = currentSessions.reduce((sum, s) => sum + s.totalTokens, 0)
      previousValue = previousSessions.reduce((sum, s) => sum + s.totalTokens, 0)
      break
    case 'sessions':
      currentValue = currentSessions.length
      previousValue = previousSessions.length
      break
  }
  
  const percentChange = previousValue > 0 
    ? ((currentValue - previousValue) / previousValue) * 100 
    : currentValue > 0 ? 100 : 0
  
  let trend: 'up' | 'down' | 'neutral'
  if (Math.abs(percentChange) < 1) {
    trend = 'neutral'
  } else if (percentChange > 0) {
    trend = 'up'
  } else {
    trend = 'down'
  }
  
  return {
    current: currentValue,
    previous: previousValue,
    percentChange,
    trend,
  }
}

export function sessionsToCSV(sessions: Session[]): string {
  const headers = [
    'Session ID',
    'Model',
    'Provider',
    'Tier',
    'Input Tokens',
    'Output Tokens',
    'Total Tokens',
    'Cost',
    'Updated At',
  ]
  
  const rows = sessions.map(s => [
    s.sessionId,
    s.model,
    s.modelProvider,
    s.tier,
    s.inputTokens.toString(),
    s.outputTokens.toString(),
    s.totalTokens.toString(),
    s.cost.toFixed(6),
    new Date(s.updatedAt).toISOString(),
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')
  
  return csvContent
}
