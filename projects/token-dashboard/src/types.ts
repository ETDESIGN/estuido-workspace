/**
 * Token Tracking Dashboard - Type Definitions
 * ESTUDIO Phase 1 Implementation
 */

export interface TokenSession {
  sessionId: string;
  timestamp: Date;
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
  cost: number;
  duration?: number;
  status: 'success' | 'error' | 'cached';
}

export interface ModelPricing {
  model: string;
  provider: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
  cacheReadCostPer1M?: number;
  cacheWriteCostPer1M?: number;
}

export interface DailyStats {
  date: string;
  totalSessions: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCacheReadTokens: number;
  totalCacheWriteTokens: number;
  totalCost: number;
  modelBreakdown: Record<string, ModelDailyStats>;
}

export interface ModelDailyStats {
  model: string;
  sessions: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}

export interface AlertThreshold {
  level: 'yellow' | 'orange' | 'red';
  percentage: number;
  dailyCostLimit: number;
  monthlyCostLimit: number;
}

export interface Alert {
  id: string;
  timestamp: Date;
  level: 'yellow' | 'orange' | 'red';
  message: string;
  currentSpend: number;
  limit: number;
  acknowledged: boolean;
}

// Default pricing (per 1M tokens) - Update with actual provider pricing
export const DEFAULT_PRICING: ModelPricing[] = [
  {
    model: 'moonshot/kimi-k2.5',
    provider: 'moonshot',
    inputCostPer1M: 0.50,
    outputCostPer1M: 2.00,
  },
  {
    model: 'moonshot/kimi-k2-0905-preview',
    provider: 'moonshot',
    inputCostPer1M: 1.00,
    outputCostPer1M: 4.00,
  },
  {
    model: 'qwen-portal/coder-model',
    provider: 'qwen-portal',
    inputCostPer1M: 0,
    outputCostPer1M: 0,
  },
  {
    model: 'qwen-portal/vision-model',
    provider: 'qwen-portal',
    inputCostPer1M: 0,
    outputCostPer1M: 0,
  },
  {
    model: 'gemini/gemini-2.0-flash',
    provider: 'gemini',
    inputCostPer1M: 0.10,
    outputCostPer1M: 0.40,
  },
];

// Default alert thresholds
export const DEFAULT_THRESHOLDS: AlertThreshold[] = [
  { level: 'yellow', percentage: 80, dailyCostLimit: 8, monthlyCostLimit: 200 },
  { level: 'orange', percentage: 90, dailyCostLimit: 9, monthlyCostLimit: 225 },
  { level: 'red', percentage: 100, dailyCostLimit: 10, monthlyCostLimit: 250 },
];
