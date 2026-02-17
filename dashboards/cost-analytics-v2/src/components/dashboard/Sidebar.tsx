'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/providers/ThemeProvider'
import { 
  Activity, 
  Moon, 
  Sun, 
  LayoutDashboard,
  Cpu,
  Table,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Cpu, label: 'Models', href: '/models' },
  { icon: Table, label: 'Sessions', href: '/sessions' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar(_props?: unknown) {
  const { isDark, toggleTheme } = useTheme()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen)

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64'

  return (
    <>
      {/* Mobile Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-800/80 text-white hover:bg-slate-700"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarWidth} bg-slate-800/50 border-r border-slate-700 flex flex-col
        fixed lg:static inset-y-0 left-0 z-40
        transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 shrink-0">
              <Activity className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-lg font-bold text-white truncate">ESTUDIO AI</h1>
                <p className="text-xs text-slate-400 truncate">Analytics Dashboard</p>
              </div>
            )}
            {/* Collapse Toggle - Desktop Only */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="hidden lg:flex ml-auto h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 shrink-0"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          // Handle exact match and root path
          const isActive = pathname === item.href || (item.href === '/' && pathname === '')
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-600/20 text-purple-400'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-2 border-t border-slate-700 space-y-2">
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "sm"}
          onClick={toggleTheme}
          className={`text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 ${isCollapsed ? 'w-full h-10' : 'w-full justify-start gap-3'}`}
          title={isCollapsed ? (isDark ? "Light Mode" : "Dark Mode") : undefined}
        >
          {isDark ? (
            <>
              <Sun className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="text-sm">Light Mode</span>}
            </>
          ) : (
            <>
              <Moon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="text-sm">Dark Mode</span>}
            </>
          )}
        </Button>
      </div>
    </aside>
    </>
  )
}
