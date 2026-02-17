'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useNotifications, type Notification } from './NotificationContext'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colors = {
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

function Toast({ notification, onDismiss }: { notification: Notification; onDismiss: () => void }) {
  const Icon = icons[notification.type]

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg ${colors[notification.type]}`}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{notification.title}</p>
        <p className="text-sm opacity-90 mt-0.5">{notification.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export function ToastContainer() {
  const { notifications, dismissNotification } = useNotifications()

  // Only show recent notifications as toasts (last 5)
  const recentNotifications = notifications.slice(0, 5)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {recentNotifications.map(notification => (
          <Toast
            key={notification.id}
            notification={notification}
            onDismiss={() => dismissNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
