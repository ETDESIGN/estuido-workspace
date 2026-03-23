'use client';

import { DashboardLayout } from '@/components';
import { Cpu } from 'lucide-react';

export default function ModelsPage() {
  return (
    <DashboardLayout>
      <div className="text-center py-12">
        <Cpu className="mx-auto mb-4 text-zinc-600" size={64} />
        <h1 className="text-3xl font-bold mb-2 text-white">Models</h1>
        <p className="text-zinc-400 mb-6">Manage AI models and configurations</p>
        <div className="bg-zinc-900 p-6 rounded-lg max-w-md mx-auto">
          <p className="text-zinc-500 text-sm">
            This page will display available models, usage statistics, and configuration options.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
