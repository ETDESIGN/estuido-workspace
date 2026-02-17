export type ModelTier = 'pulse' | 'workhorse' | 'brain';

export interface Model {
  id: string;
  name: string;
  tier: ModelTier;
  provider: string;
  inputCost: number;
  outputCost: number;
  contextWindow: number;
  description?: string;
  isDefault?: boolean;
}

export interface TokenUsage {
  input: number;
  output: number;
  total: number;
}

export interface Session {
  id: string;
  modelId: string;
  modelName: string;
  tier: ModelTier;
  tokens: TokenUsage;
  cost: number;
  timestamp: Date;
  duration?: number;
  status: 'completed' | 'in_progress' | 'failed';
}

export interface DailyUsage {
  date: string;
  cost: number;
  tokens: TokenUsage;
  sessions: number;
}

export interface TierStats {
  tier: ModelTier;
  sessions: number;
  tokens: TokenUsage;
  cost: number;
  percentage: number;
}

export interface CostSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalSessions: number;
  totalTokens: TokenUsage;
  savingsPercentage: number;
  savingsAmount: number;
}

export const TIER_COLORS = {
  pulse: '#22c55e',
  workhorse: '#f59e0b',
  brain: '#d946ef',
};