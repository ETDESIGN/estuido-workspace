'use client';

import { DashboardLayout } from '@/components';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="text-center py-12">
        <Settings className="mx-auto mb-4 text-zinc-600" size={64} />
        <h1 className="text-3xl font-bold mb-2 text-white">Settings</h1>
        <p className="text-zinc-400 mb-6">Configure your dashboard preferences</p>
        <div className="bg-zinc-900 p-6 rounded-lg max-w-md mx-auto">
          <p className="text-zinc-500 text-sm">
            This page will contain user preferences, theme settings, and dashboard configuration options.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
