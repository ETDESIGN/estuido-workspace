'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertSettings } from '@/components/dashboard/AlertSettings'
import { ThemeToggle } from '@/components/dashboard/ThemeToggle'
import { MobileNav } from '@/components/dashboard/MobileNav'
import { NotificationProvider } from '@/components/notifications/NotificationContext'
import { Bell, Palette, Database } from 'lucide-react'

export default function SettingsPage() {
  return (
    <NotificationProvider>
      <div className="p-6 space-y-6 pb-24">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <AlertSettings />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Theme</span>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Source
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Currently using demo data for visualization.
              </p>
              <div className="text-xs text-slate-500 bg-slate-100 p-3 rounded">
                <p>To use real data, configure your OpenClaw gateway connection.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p><strong>ESTUDIO AI Analytics</strong></p>
              <p>Version: 2.0.0</p>
              <p>Built with Next.js + OpenClaw</p>
            </CardContent>
          </Card>
        </div>
        <MobileNav />
      </div>
    </NotificationProvider>
  )
}
