import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Bell, Mail, Webhook, AlertTriangle } from 'lucide-react'
import { useNotifications } from '@/components/notifications/NotificationContext'

export interface AlertConfig {
  emailEnabled: boolean
  emailAddress: string
  webhookEnabled: boolean
  webhookUrl: string
  dailyCostThreshold: number
  monthlyBudgetThreshold: number
}

const DEFAULT_CONFIG: AlertConfig = {
  emailEnabled: false,
  emailAddress: '',
  webhookEnabled: false,
  webhookUrl: '',
  dailyCostThreshold: 10,
  monthlyBudgetThreshold: 50,
}

export function AlertSettings() {
  const { addNotification } = useNotifications()
  const [config, setConfig] = useState<AlertConfig>(DEFAULT_CONFIG)
  const [isSaving, setIsSaving] = useState(false)

  // Load config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dashboard_alerts_config')
    if (saved) {
      try {
        setConfig({ ...DEFAULT_CONFIG, ...JSON.parse(saved) })
      } catch (e) {
        console.error('Failed to load alert config:', e)
      }
    }
  }, [])

  const saveConfig = useCallback(() => {
    setIsSaving(true)
    localStorage.setItem('dashboard_alerts_config', JSON.stringify(config))
    
    // Test webhook if enabled
    if (config.webhookEnabled && config.webhookUrl) {
      fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: '🔔 Dashboard alert system test - configuration saved'
        })
      }).catch(() => {
        addNotification({
          type: 'warning',
          category: 'system',
          title: 'Webhook Test Failed',
          message: 'Could not reach webhook URL'
        })
      })
    }

    setTimeout(() => {
      setIsSaving(false)
      addNotification({
        type: 'success',
        category: 'system',
        title: 'Settings Saved',
        message: 'Alert configuration updated'
      })
    }, 500)
  }, [config, addNotification])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alert Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Alerts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-500" />
              <Label htmlFor="email-alerts">Email Alerts</Label>
            </div>
            <Switch
              id="email-alerts"
              checked={config.emailEnabled}
              onCheckedChange={(checked: boolean) =>
                setConfig(prev => ({ ...prev, emailEnabled: checked }))
              }
            />
          </div>
          {config.emailEnabled && (
            <Input
              type="email"
              placeholder="your@email.com"
              value={config.emailAddress}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                emailAddress: e.target.value 
              }))}
            />
          )}
        </div>

        {/* Webhook Alerts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Webhook className="h-4 w-4 text-slate-500" />
              <Label htmlFor="webhook-alerts">Webhook Alerts</Label>
            </div>
            <Switch
              id="webhook-alerts"
              checked={config.webhookEnabled}
              onCheckedChange={(checked: boolean) => 
                setConfig(prev => ({ ...prev, webhookEnabled: checked }))
              }
            />
          </div>
          {config.webhookEnabled && (
            <Input
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={config.webhookUrl}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                webhookUrl: e.target.value 
              }))}
            />
          )}
        </div>

        {/* Thresholds */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Alert Thresholds</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daily-threshold" className="text-xs">
                Daily Cost ($)
              </Label>
              <Input
                id="daily-threshold"
                type="number"
                min={1}
                value={config.dailyCostThreshold}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  dailyCostThreshold: parseFloat(e.target.value) || 0 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-threshold" className="text-xs">
                Monthly Budget ($)
              </Label>
              <Input
                id="monthly-threshold"
                type="number"
                min={1}
                value={config.monthlyBudgetThreshold}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  monthlyBudgetThreshold: parseFloat(e.target.value) || 0 
                }))}
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={saveConfig} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  )
}
