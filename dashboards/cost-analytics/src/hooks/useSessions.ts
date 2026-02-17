import { useMemo } from 'react';
import { mockSessions } from '../data';

export function useSessions() {
  return useMemo(() => mockSessions, []);
}
