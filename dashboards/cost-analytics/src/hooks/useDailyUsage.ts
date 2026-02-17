import { useMemo } from 'react';
import { mockDailyUsage } from '../data';

export function useDailyUsage() {
  return useMemo(() => mockDailyUsage, []);
}
