'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DashboardData } from '@/types';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface UseDashboardStreamResult {
  data: DashboardData | null;
  status: ConnectionStatus;
  error: Error | null;
  reconnect: () => void;
}

export function useDashboardStream(): UseDashboardStreamResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<Error | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10;
  
  // Calculate exponential backoff delay
  const getBackoffDelay = (attempt: number): number => {
    return Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30 seconds
  };

  const connect = useCallback(() => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Clear any pending reconnect
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setStatus('connecting');
    setError(null);

    try {
      const eventSource = new EventSource('/api/dashboard/stream');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setStatus('connected');
        reconnectAttemptsRef.current = 0;
        console.log('[Dashboard] SSE connected');
      };

      eventSource.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'connected') {
            console.log('[Dashboard] Server confirmed connection');
          } else if (message.type === 'update' && message.data) {
            setData(message.data);
          }
        } catch (err) {
          console.error('[Dashboard] Error parsing message:', err);
        }
      };

      eventSource.onerror = (err) => {
        console.error('[Dashboard] SSE error:', err);
        eventSource.close();
        
        // Attempt to reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = getBackoffDelay(reconnectAttemptsRef.current);
          reconnectAttemptsRef.current++;
          
          console.log(`[Dashboard] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
          
          setStatus('connecting');
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          setStatus('error');
          setError(new Error('Failed to reconnect after maximum attempts'));
          console.error('[Dashboard] Max reconnect attempts reached');
        }
      };

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err : new Error('Failed to connect to dashboard stream'));
      console.error('[Dashboard] Connection error:', err);
    }
  }, []);

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  // Cleanup on unmount
  useEffect(() => {
    connect();
    
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return {
    data,
    status,
    error,
    reconnect
  };
}
