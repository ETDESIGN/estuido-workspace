/**
 * Token Tracking Dashboard - Cost Calculator
 * Calculate costs based on token usage and model pricing
 */

import { ModelPricing, TokenSession, DEFAULT_PRICING } from '../types.js';

// In-memory pricing cache
let pricingMap: Map<string, ModelPricing> | null = null;

function getPricingMap(): Map<string, ModelPricing> {
  if (!pricingMap) {
    pricingMap = new Map();
    for (const p of DEFAULT_PRICING) {
      pricingMap.set(p.model, p);
    }
  }
  return pricingMap;
}

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
  cacheReadTokens: number = 0,
  cacheWriteTokens: number = 0
): number {
  const pricing = getPricingMap().get(model);
  
  if (!pricing) {
    console.warn(`No pricing found for model: ${model}, using zero cost`);
    return 0;
  }

  const inputCost = (inputTokens / 1_000_000) * pricing.inputCostPer1M;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputCostPer1M;
  
  let cacheReadCost = 0;
  let cacheWriteCost = 0;
  
  if (pricing.cacheReadCostPer1M !== undefined && cacheReadTokens > 0) {
    cacheReadCost = (cacheReadTokens / 1_000_000) * pricing.cacheReadCostPer1M;
  }
  
  if (pricing.cacheWriteCostPer1M !== undefined && cacheWriteTokens > 0) {
    cacheWriteCost = (cacheWriteTokens / 1_000_000) * pricing.cacheWriteCostPer1M;
  }
  
  return inputCost + outputCost + cacheReadCost + cacheWriteCost;
}

export function calculateSessionCost(session: Partial<TokenSession>): number {
  return calculateCost(
    session.model || 'unknown',
    session.inputTokens || 0,
    session.outputTokens || 0,
    session.cacheReadTokens || 0,
    session.cacheWriteTokens || 0
  );
}

export function addPricing(pricing: ModelPricing): void {
  getPricingMap().set(pricing.model, pricing);
}

export function getPricing(model: string): ModelPricing | undefined {
  return getPricingMap().get(model);
}

export function listPricing(): ModelPricing[] {
  return Array.from(getPricingMap().values());
}
