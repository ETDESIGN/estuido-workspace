'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Cpu, Table, Settings, Plus } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Home', href: '/' },
  { icon: Cpu, label: 'Models', href: '/models' },
  { icon: Table, label: 'Sessions', href: '/sessions' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function MobileNav() {
  const pathname = usePathname()
  const { isDark } = useTheme()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-slate-900/95 dark:bg-slate-800/95 border-t border-slate-700 backdrop-blur-sm">
      <div className="flex items-center justify-around py-2 px-4 safe-area-pb">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[64px] min-h-[44px]
                ${active 
                  ? 'text-purple-400 bg-purple-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function FloatingActionButton() {
  return (
    <button
      className="fixed bottom-20 right-4 z-40 lg:hidden w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Plus className="h-6 w-6" />
    </button>
  )
}
