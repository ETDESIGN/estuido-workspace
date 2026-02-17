import { useMemo } from 'react';
import { mockSessions, models } from '../data';

export function useCostSummary() {
  return useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todaySessions = mockSessions.filter(s => s.timestamp >= today);
    const weekSessions = mockSessions.filter(s => s.timestamp >= weekAgo);
    const monthSessions = mockSessions.filter(s => s.timestamp >= monthAgo);

    const todayCost = todaySessions.reduce((sum, s) => sum + s.cost, 0);
    const weekCost = weekSessions.reduce((sum, s) => sum + s.cost, 0);
    const monthCost = monthSessions.reduce((sum, s) => sum + s.cost, 0);

    const totalTokens = mockSessions.reduce(
      (acc, s) => ({
        input: acc.input + s.tokens.input,
        output: acc.output + s.tokens.output,
        total: acc.total + s.tokens.total,
      }),
      { input: 0, output: 0, total: 0 }
    );

    // Calculate savings vs using Brain tier for everything
    const brainModel = models.find(m => m.tier === 'brain' && m.isDefault)!;
    const hypotheticalCost = mockSessions.reduce((sum, s) => {
      const cost = (s.tokens.input * brainModel.inputCost + s.tokens.output * brainModel.outputCost) / 1000000;
      return sum + cost;
    }, 0);
    
    const actualCost = mockSessions.reduce((sum, s) => sum + s.cost, 0);
    const savingsAmount = hypotheticalCost - actualCost;
    const savingsPercentage = hypotheticalCost > 0 ? (savingsAmount / hypotheticalCost) * 100 : 0;

    return {
      today: todayCost,
      thisWeek: weekCost,
      thisMonth: monthCost,
      totalSessions: mockSessions.length,
      totalTokens,
      savingsPercentage,
      savingsAmount,
    };
  }, []);
}
