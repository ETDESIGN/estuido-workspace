import { useMemo } from 'react';
import { mockSessions } from '../data';

export function useModelStats() {
  return useMemo(() => {
    const modelMap = new Map<string, { name: string; tokens: number }>();

    mockSessions.forEach(session => {
      const existing = modelMap.get(session.modelId);
      if (existing) {
        existing.tokens += session.tokens.total;
      } else {
        modelMap.set(session.modelId, {
          name: session.modelName,
          tokens: session.tokens.total,
        });
      }
    });

    return Array.from(modelMap.values())
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 6);
  }, []);
}
