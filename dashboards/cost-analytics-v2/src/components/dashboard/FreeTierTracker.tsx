'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  DollarSign,
  Activity,
  Search,
  Brain,
  Code,
  Image as ImageIcon
} from 'lucide-react'

interface Service {
  name: string
  provider: string
  tier: 'free' | 'paid' | 'mixed'
  status: 'healthy' | 'warning' | 'critical' | 'unknown'
  limits?: {
    requests?: { current: number; max: number; period: 'day' | 'month' }
    tokens?: { current: number; max: number; period: 'day' | 'month' }
    cost?: { current: number; max: number; currency: string }
  }
  lastChecked: string
  error?: string
}

interface ServicesData {
  services: Service[]
  summary: {
    total: number
    healthy: number
    warning: number
    critical: number
    estimatedMonthlyCost: number
    budget: number
    budgetUsed: number
  }
  lastUpdated: string
}

const serviceIcons: Record<string, React.ReactNode> = {
  brave: <Search className="h-4 w-4" />,
  tavily: <Search className="h-4 w-4" />,
  moonshot: <Brain className="h-4 w-4" />,
  groq: <Activity className="h-4 w-4" />,
  openrouter: <Activity className="h-4 w-4" />,
  kilocode: <Code className="h-4 w-4" />,
  pollinations: <ImageIcon className="h-4 w-4" />
}

export function FreeTierTracker() {
  const [data, setData] = useState<ServicesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/services/health')
      if (!response.ok) throw new Error('Failed to fetch')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: Service['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-slate-500" />
    }
  }

  const getStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const calculatePercentage = (current: number, max: number) => {
    return Math.min(100, Math.round((current / max) * 100))
  }

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 text-slate-400 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
        <AlertDescription className="text-red-400">
          Failed to load service status: {error}
        </AlertDescription>
      </Alert>
    )
  }

  if (!data) return null

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-slate-200 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          External Services Health
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            Updated: {new Date(data.lastUpdated).toLocaleTimeString()}
          </span>
          <button
            onClick={fetchData}
            className="p-1 rounded hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">{data.summary.healthy}</div>
            <div className="text-xs text-slate-400">Healthy</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-amber-400">{data.summary.warning}</div>
            <div className="text-xs text-slate-400">Warning</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{data.summary.critical}</div>
            <div className="text-xs text-slate-400">Critical</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">${data.summary.estimatedMonthlyCost.toFixed(2)}</div>
            <div className="text-xs text-slate-400">Monthly Est.</div>
          </div>
        </div>

        {/* Budget Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Monthly Budget</span>
            <span className="text-slate-300">${data.summary.estimatedMonthlyCost.toFixed(2)} / ${data.summary.budget}</span>
          </div>
          <Progress 
            value={data.summary.budgetUsed} 
            className="h-2 bg-slate-700"
          />
          <p className="text-xs text-slate-500">
            {data.summary.budgetUsed < 50 ? 'On track' : data.summary.budgetUsed < 80 ? 'Monitor usage' : 'Approaching limit'}
          </p>
        </div>

        {/* Service List */}
        <div className="space-y-3">
          {data.services.map((service) => (
            <div 
              key={service.provider}
              className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {serviceIcons[service.provider] || <Activity className="h-4 w-4 text-slate-400" />}
                <div>
                  <div className="font-medium text-slate-200">{service.name}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                    <span className="text-slate-500">
                      {service.tier === 'free' ? 'Free tier' : service.tier === 'paid' ? 'Paid' : 'Mixed'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Limits Display */}
                {service.limits && (
                  <div className="text-right">
                    {service.limits.requests && (
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400">
                          {service.limits.requests.current.toLocaleString()} / {service.limits.requests.max.toLocaleString()}
                        </div>
                        <Progress 
                          value={calculatePercentage(service.limits.requests.current, service.limits.requests.max)}
                          className="h-1 w-24 bg-slate-700"
                        />
                      </div>
                    )}
                    {service.limits.tokens && (
                      <div className="text-xs text-slate-400">
                        {(service.limits.tokens.current / 1000).toFixed(0)}K / {(service.limits.tokens.max / 1000).toFixed(0)}K tokens
                      </div>
                    )}
                    {service.limits.cost && (
                      <div className="text-xs text-slate-400">
                        ${service.limits.cost.current.toFixed(2)} / ${service.limits.cost.max}
                      </div>
                    )}
                  </div>
                )}

                {getStatusIcon(service.status)}
              </div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {data.services.some(s => s.status === 'critical' || s.status === 'warning') && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Active Alerts</h4>
            {data.services
              .filter(s => s.status === 'critical' || s.status === 'warning')
              .map(service => (
                <Alert 
                  key={service.provider}
                  className={service.status === 'critical' 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : 'bg-amber-500/10 border-amber-500/30'
                  }
                >
                  <AlertDescription className={service.status === 'critical' ? 'text-red-400' : 'text-amber-400'}>
                    <strong>{service.name}:</strong> {service.error || 'Approaching limits'}
                  </AlertDescription>
                </Alert>
              ))
            }
          </div>
        )}
      </CardContent>
    </Card>
  )
}
