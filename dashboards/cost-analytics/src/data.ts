import type { Model, Session, DailyUsage } from './types';

export const models: Model[] = [
  // Tier 1 - PULSE (Routine)
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    tier: 'pulse',
    provider: 'Google',
    inputCost: 0.10,
    outputCost: 0.40,
    contextWindow: 1000000,
    description: 'Fast, efficient model for routine tasks',
  },
  {
    id: 'groq-llama-3.3-70b',
    name: 'Groq Llama 3.3 70B',
    tier: 'pulse',
    provider: 'Groq',
    inputCost: 0,
    outputCost: 0,
    contextWindow: 128000,
    description: 'Free tier via Groq API',
  },
  {
    id: 'groq-mixtral-8x7b',
    name: 'Groq Mixtral 8x7b',
    tier: 'pulse',
    provider: 'Groq',
    inputCost: 0,
    outputCost: 0,
    contextWindow: 32000,
    description: 'Free tier via Groq API',
  },
  // Tier 2 - WORKHORSE (Moderate)
  {
    id: 'minimax-01',
    name: 'MiniMax-01',
    tier: 'workhorse',
    provider: 'MiniMax',
    inputCost: 1.50,
    outputCost: 3.00,
    contextWindow: 1000000,
    description: 'Balanced performance for moderate complexity',
  },
  {
    id: 'moonshot-v1-8k',
    name: 'Moonshot V1 8K',
    tier: 'workhorse',
    provider: 'Moonshot',
    inputCost: 0.50,
    outputCost: 1.00,
    contextWindow: 8000,
    description: 'Cost-effective for medium tasks',
  },
  // Tier 3 - BRAIN (Complex)
  {
    id: 'kimi-k2.5',
    name: 'Kimi K2.5',
    tier: 'brain',
    provider: 'Moonshot',
    inputCost: 0.50,
    outputCost: 2.40,
    contextWindow: 256000,
    description: 'Premium model for complex reasoning',
    isDefault: true,
  },
];

// Generate mock session data
const generateMockSessions = (): Session[] => {
  const sessions: Session[] = [];
  const now = new Date();
  
  for (let i = 0; i < 100; i++) {
    const model = models[Math.floor(Math.random() * models.length)];
    const inputTokens = Math.floor(Math.random() * 5000) + 100;
    const outputTokens = Math.floor(Math.random() * 3000) + 50;
    
    sessions.push({
      id: `session-${i}`,
      modelId: model.id,
      modelName: model.name,
      tier: model.tier,
      tokens: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens,
      },
      cost: (inputTokens * model.inputCost + outputTokens * model.outputCost) / 1000000,
      timestamp: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      duration: Math.floor(Math.random() * 30000) + 1000,
      status: Math.random() > 0.05 ? 'completed' : 'failed',
    });
  }
  
  return sessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Generate daily usage data
const generateDailyUsage = (sessions: Session[]): DailyUsage[] => {
  const dailyMap = new Map<string, DailyUsage>();
  
  sessions.forEach(session => {
    const date = session.timestamp.toISOString().split('T')[0];
    const existing = dailyMap.get(date);
    
    if (existing) {
      existing.cost += session.cost;
      existing.tokens.input += session.tokens.input;
      existing.tokens.output += session.tokens.output;
      existing.tokens.total += session.tokens.total;
      existing.sessions += 1;
    } else {
      dailyMap.set(date, {
        date,
        cost: session.cost,
        tokens: { ...session.tokens },
        sessions: 1,
      });
    }
  });
  
  return Array.from(dailyMap.values()).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

export const mockSessions = generateMockSessions();
export const mockDailyUsage = generateDailyUsage(mockSessions);