'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, Trash2, Filter, TrendingUp, Zap, Download, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotifications, type Notification, type NotificationCategory } from './NotificationContext'

const categoryIcons: Record<NotificationCategory, typeof TrendingUp> = {
  cost: TrendingUp,
  'rate-limit': Zap,
  export: Download,
  system: AlertTriangle,
}

const categoryColors: Record<NotificationCategory, string> = {
  cost: 'text-green-400 bg-green-500/20',
  'rate-limit': 'text-amber-400 bg-amber-500/20',
  export: 'text-blue-400 bg-blue-500/20',
  system: 'text-purple-400 bg-purple-500/20',
}

const typeColors = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-blue-500',
}

function NotificationItem({ notification }: { notification: Notification }) {
  const { markAsRead, dismissNotification } = useNotifications()
  const Icon = categoryIcons[notification.category]
  const timeAgo = getTimeAgo(notification.timestamp)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-3 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer border-l-4 ${
        notification.read ? 'border-l-transparent opacity-60' : typeColors[notification.type]
      }`}
      onClick={() => markAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg shrink-0 ${categoryColors[notification.category]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm text-slate-200">{notification.title}</p>
            {!notification.read && (
              <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
            )}
          </div>
          <p className="text-sm text-slate-400 mt-0.5">{notification.message}</p>
          <p className="text-xs text-slate-500 mt-1">{timeAgo}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            dismissNotification(notification.id)
          }}
          className="shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100 opacity-60 transition-opacity"
        >
          <X className="h-4 w-4 text-slate-400 hover:text-slate-200" />
        </button>
      </div>
    </motion.div>
  )
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<NotificationCategory | 'all'>('all')
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications()

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.category === filter)

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-9 w-9 relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-slate-700 z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-slate-100">Notifications</h2>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                      {unreadCount} unread
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="p-2 border-b border-slate-700 flex items-center gap-1 overflow-x-auto">
                <Button
                  variant={filter === 'all' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className={filter === 'all' ? 'bg-slate-700 text-slate-200' : 'text-slate-400'}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'cost' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('cost')}
                  className={filter === 'cost' ? 'bg-slate-700 text-slate-200' : 'text-slate-400'}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Cost
                </Button>
                <Button
                  variant={filter === 'rate-limit' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('rate-limit')}
                  className={filter === 'rate-limit' ? 'bg-slate-700 text-slate-200' : 'text-slate-400'}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Rate Limits
                </Button>
                <Button
                  variant={filter === 'export' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('export')}
                  className={filter === 'export' ? 'bg-slate-700 text-slate-200' : 'text-slate-400'}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Exports
                </Button>
              </div>

              {/* Notifications List */}
              <ScrollArea className="flex-1">
                <AnimatePresence mode="popLayout">
                  {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                      <Bell className="h-12 w-12 mb-4 opacity-30" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    filteredNotifications.map(notification => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))
                  )}
                </AnimatePresence>
              </ScrollArea>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-slate-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="w-full text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear all notifications
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
