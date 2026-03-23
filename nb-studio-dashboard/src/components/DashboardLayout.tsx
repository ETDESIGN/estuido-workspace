'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { clsx } from 'clsx';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      
      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
