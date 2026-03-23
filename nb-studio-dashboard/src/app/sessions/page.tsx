'use client';

import { DashboardLayout } from '@/components';
import { MessageSquare } from 'lucide-react';

export default function SessionsPage() {
  return (
    <DashboardLayout>
      <div className="text-center py-12">
        <MessageSquare className="mx-auto mb-4 text-zinc-600" size={64} />
        <h1 className="text-3xl font-bold mb-2 text-white">Sessions</h1>
        <p className="text-zinc-400 mb-6">View and manage your agent sessions</p>
        <div className="bg-zinc-900 p-6 rounded-lg max-w-md mx-auto">
          <p className="text-zinc-500 text-sm">
            This page will display active and historical sessions across all agents.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
