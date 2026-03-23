'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Cpu, 
  Settings,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { clsx } from 'clsx';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: MessageSquare, label: 'Sessions', href: '/sessions' },
    { icon: Cpu, label: 'Models', href: '/models' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-2xl">🎯</span>
            <span className="font-bold text-lg text-white whitespace-nowrap">
              NB Studio
            </span>
          </div>
        )}
        {isCollapsed && (
          <div className="flex items-center justify-center w-full">
            <span className="text-2xl">🎯</span>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-zinc-800 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight size={18} className="text-zinc-400" />
            ) : (
              <ChevronLeft size={18} className="text-zinc-400" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800">
        {!isCollapsed ? (
          <div className="text-xs text-zinc-500">
            <div className="font-medium text-zinc-400">ESTUDIO Dashboard</div>
            <div>v0.1.0</div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mx-auto" title="System Online" />
          </div>
        )}
      </div>
    </>
  );

  // Mobile sidebar (overlay)
  if (isMobile) {
    return (
      <>
        {/* Mobile trigger button */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-colors"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Mobile overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <aside
          className={clsx(
            'fixed top-0 left-0 z-50 h-full w-72 bg-zinc-900 border-r border-zinc-800',
            'transform transition-transform duration-300 ease-in-out md:hidden',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex h-full flex-col">
            {/* Close button for mobile */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} className="text-zinc-400" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={clsx(
        'flex flex-col h-screen bg-zinc-900 border-r border-zinc-800',
        'transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {sidebarContent}
    </aside>
  );
}
