import { useMemo } from 'react';
import { mockSessions } from '../data';
import type { TierStats } from '../types';

export function useTierStats(): TierStats[] {
  return useMemo(() => {
    const tierMap = new Map<string, TierStats>();

    mockSessions.forEach(session => {
      const existing = tierMap.get(session.tier);
      if (existing) {
        existing.sessions += 1;
        existing.tokens.input += session.tokens.input;
        existing.tokens.output += session.tokens.output;
        existing.tokens.total += session.tokens.total;
        existing.cost += session.cost;
      } else {
        tierMap.set(session.tier, {
          tier: session.tier,
          sessions: 1,
          tokens: { ...session.tokens },
          cost: session.cost,
          percentage: 0,
        });
      }
    });

    const stats = Array.from(tierMap.values());
    const totalCost = stats.reduce((sum, s) => sum + s.cost, 0);

    return stats.map(stat => ({
      ...stat,
      percentage: totalCost > 0 ? (stat.cost / totalCost) * 100 : 0,
    })).sort((a, b) => b.cost - a.cost);
  }, []);
}
