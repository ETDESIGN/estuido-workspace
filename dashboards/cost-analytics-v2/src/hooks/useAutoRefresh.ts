import { useEffect, useRef, useState, useCallback } from 'react'

interface UseAutoRefreshOptions {
  interval?: number // milliseconds
  onRefresh?: () => void
  enabled?: boolean
  pauseWhenHidden?: boolean
}

export function useAutoRefresh(options: UseAutoRefreshOptions = {}) {
  const {
    interval = 30000, // 30 seconds default
    onRefresh,
    enabled = true,
    pauseWhenHidden = true
  } = options

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const refresh = useCallback(async () => {
    if (isRefreshing || isPaused) return
    
    setIsRefreshing(true)
    try {
      await onRefresh?.()
      setLastRefresh(new Date())
    } finally {
      setIsRefreshing(false)
    }
  }, [isRefreshing, isPaused, onRefresh])

  // Handle page visibility changes
  useEffect(() => {
    if (!pauseWhenHidden) return

    const handleVisibilityChange = () => {
      const hidden = document.hidden
      setIsPaused(hidden)
      
      if (!hidden && lastRefresh) {
        // Refresh immediately when tab becomes visible if it's been a while
        const timeSinceLastRefresh = Date.now() - lastRefresh.getTime()
        if (timeSinceLastRefresh > interval) {
          refresh()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [pauseWhenHidden, interval, lastRefresh, refresh])

  // Set up auto-refresh interval
  useEffect(() => {
    if (!enabled) return

    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        refresh()
      }
    }, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, interval, isPaused, refresh])

  const start = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        refresh()
      }
    }, interval)
  }, [interval, isPaused, refresh])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const pause = useCallback(() => setIsPaused(true), [])
  const resume = useCallback(() => setIsPaused(false), [])

  return {
    isRefreshing,
    lastRefresh,
    isPaused,
    refresh,
    start,
    stop,
    pause,
    resume
  }
}
