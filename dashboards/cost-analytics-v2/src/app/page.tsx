'use client'

import { useState, useEffect, useCallback } from 'react'
import { processSessions, getStats, getModelStats, getModelPerformance, getDailyCosts, filterSessionsByDateRange, getTrendData } from '@/lib/data'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { CostChart } from '@/components/dashboard/CostChart'
import { ModelUsageChart } from '@/components/dashboard/ModelUsageChart'
import { SessionsTable } from '@/components/dashboard/SessionsTable'
import { ModelComparison } from '@/components/dashboard/ModelComparison'
import { DateFilter, type DateRange } from '@/components/dashboard/DateFilter'
import { Separator } from '@/components/ui/separator'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { ThemeToggle } from '@/components/dashboard/ThemeToggle'
import { Button } from '@/components/ui/button'
import { FreeTierTracker } from '@/components/dashboard/FreeTierTracker'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { ExportDialog } from '@/components/dashboard/ExportDialog'
import { NotificationProvider } from '@/components/notifications/NotificationContext'
import { NotificationsPanel } from '@/components/notifications/NotificationsPanel'
import { ToastContainer } from '@/components/notifications/Toast'
import { useCostAlerts } from '@/components/dashboard/useCostAlerts'
import { ModelPerformanceDeepDive } from '@/components/dashboard/ModelPerformanceDeepDive'
import { ModelUsageHeatmap } from '@/components/dashboard/ModelUsageHeatmap'
import { useGatewaySocket } from '@/hooks/useGatewaySocket'
import { useAutoRefresh } from '@/hooks/useAutoRefresh'
import { useNotifications } from '@/components/notifications/NotificationContext'
import { CostPrediction } from '@/components/dashboard/CostPrediction'
import { MobileNav } from '@/components/dashboard/MobileNav'

interface Session {
  sessionKey: string
  sessionId: string
  model: string
  modelProvider: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  updatedAt: number
  tier: string
  cost: number
}

// Inner component that uses notifications
function DashboardContent() {
  const { addNotification } = useNotifications()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>('7days')
  const [baselineTotalCost, setBaselineTotalCost] = useState<number | null>(null)
  const [budget, setBudget] = useState<number>(50)

  // Load budget from localStorage on mount (read from AlertSettings config)
  useEffect(() => {
    const saved = localStorage.getItem('dashboard_alerts_config')
    if (saved) {
      try {
        const config = JSON.parse(saved)
        if (config.monthlyBudgetThreshold) {
          setBudget(config.monthlyBudgetThreshold)
        }
      } catch (e) {
        console.error('Failed to load budget:', e)
      }
    }
  }, [])

  // Save budget to localStorage when changed
  const handleBudgetChange = (newBudget: number) => {
    setBudget(newBudget)
    localStorage.setItem('costBudget', newBudget.toString())
  }

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsRefreshing(true)
    try {
      const response = await fetch('/api/sessions')
      const data = await response.json()
      
      const currentSessions = data.sessions || []
      const newTotalCost = currentSessions.reduce((sum: number, s: Session) => sum + (s.cost || 0), 0)
      
      // Set baseline on first load
      if (baselineTotalCost === null) {
        setBaselineTotalCost(newTotalCost)
      }
      
      // Check for significant cost changes from baseline (more than $5 or 50%)
      if (baselineTotalCost !== null && baselineTotalCost > 0) {
        const change = newTotalCost - baselineTotalCost
        const percentChange = change / baselineTotalCost
        if (change > 5 || percentChange > 0.5) {
          addNotification({
            type: 'warning',
            category: 'cost',
            title: 'Cost Increase Alert',
            message: `Cost changed by $${change.toFixed(2)} (${(percentChange * 100).toFixed(1)}%)`
          })
          // Update baseline to avoid repeated alerts
          setBaselineTotalCost(newTotalCost)
        }
      }
      
      setSessions(currentSessions)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [baselineTotalCost, addNotification])

  // Auto-refresh every 30 seconds
  const { isPaused } = useAutoRefresh({
    interval: 30000,
    onRefresh: () => fetchData(false),
    enabled: true,
    pauseWhenHidden: true
  })

  // Gateway WebSocket connection
  const { isConnected } = useGatewaySocket({
    onMessage: (message) => {
      if (message.type === 'session_update' || message.type === 'cost_update') {
        fetchData(false)
      }
    }
  })

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleManualRefresh = () => {
    fetchData(true)
  }

  const processedSessions = processSessions(
    sessions.reduce((acc, s) => {
      acc[s.sessionKey] = {
        sessionId: s.sessionId,
        model: s.model,
        modelProvider: s.modelProvider,
        inputTokens: s.inputTokens,
        outputTokens: s.outputTokens,
        totalTokens: s.totalTokens,
        updatedAt: s.updatedAt,
      }
      return acc
    }, {} as Record<string, unknown>)
  )

  const filteredSessions = filterSessionsByDateRange(processedSessions, dateRange)

  // Enable cost alerts
  useCostAlerts(filteredSessions)

  const stats = getStats(filteredSessions)
  const modelStats = getModelStats(filteredSessions)
  const modelPerformance = getModelPerformance(filteredSessions)
  const dailyCosts = getDailyCosts(filteredSessions, dateRange === 'alltime' ? 365 : dateRange === '30days' ? 30 : dateRange === '7days' ? 7 : 1)

  const trendRange = dateRange === 'alltime' ? '30days' : dateRange
  const trends = {
    cost: getTrendData(filteredSessions, 'cost', trendRange),
    tokens: getTrendData(filteredSessions, 'tokens', trendRange),
    sessions: getTrendData(filteredSessions, 'sessions', trendRange),
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <Sidebar />
      
      <div className="flex-1 overflow-auto pb-24">
        <div className="container mx-auto p-6 space-y-6">
          <header className="flex items-center justify-between pl-12 lg:pl-0">
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                  {isPaused && ' (paused)'}
                </span>
              )}
              {/* Connection Status */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                {isConnected ? (
                  <>
                    <Wifi className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-500">Polling</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="h-9 w-9"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <NotificationsPanel />
              <ExportDialog currentDateRange={dateRange} />
              <ThemeToggle />
            </div>
          </header>

          <Separator className="bg-slate-200 dark:bg-slate-700" />

          <DateFilter value={dateRange} onChange={setDateRange} />

          <StatsCards 
            todayCost={stats.todayCost}
            totalTokens={stats.totalTokens}
            sessionCount={stats.sessionCount}
            savingsPercent={stats.savingsPercent}
            trends={trends}
          />

          <CostPrediction dailyCosts={dailyCosts} budget={budget} />

          <div className="grid gap-6 md:grid-cols-2">
            <CostChart data={dailyCosts} />
            <ModelUsageChart data={modelStats} />
          </div>

          <ModelComparison data={modelPerformance} />

          <div className="grid gap-6 md:grid-cols-2">
            <ModelPerformanceDeepDive sessions={filteredSessions} />
            <ModelUsageHeatmap sessions={filteredSessions} />
          </div>

          <FreeTierTracker />

          <SessionsTable sessions={filteredSessions} />
        </div>
      </div>
      
      <ToastContainer />
    </div>
  )
}

// Main Dashboard component with NotificationProvider
export default function Dashboard() {
  return (
    <NotificationProvider>
      <DashboardContent />
      <MobileNav />
    </NotificationProvider>
  )
}
