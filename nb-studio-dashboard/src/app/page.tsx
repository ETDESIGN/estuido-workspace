'use client';

import useSWR from 'swr';
import { fetchDashboardData } from '@/lib/api';

export default function Dashboard() {
  const { data, error, isLoading } = useSWR('/api/dashboard', fetchDashboardData, {
    refreshInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-white text-xl">Loading Mission Control...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-red-500 text-xl">Error: {error.message}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-white text-xl">No data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🎯 NB Studio Mission Control</h1>
        <p className="text-zinc-400">Last updated: {new Date(data.uplinkTime).toLocaleString()}</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-zinc-900 p-4 rounded-lg">
          <div className="text-zinc-400 text-sm">Total Agents</div>
          <div className="text-2xl font-bold">{data.stats.totalAgents}</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg">
          <div className="text-zinc-400 text-sm">Active Sessions</div>
          <div className="text-2xl font-bold">{data.stats.activeSessions}</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg">
          <div className="text-zinc-400 text-sm">Cost Today</div>
          <div className="text-2xl font-bold">${data.stats.costToday.toFixed(2)}</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg">
          <div className="text-zinc-400 text-sm">Tokens Today</div>
          <div className="text-2xl font-bold">{data.stats.tokensToday.toLocaleString()}</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-lg">
          <div className="text-zinc-400 text-sm">Tasks Completed</div>
          <div className="text-2xl font-bold">{data.stats.tasksCompletedToday}</div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-zinc-900 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">System Health</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-zinc-400 text-sm">CPU</div>
            <div className="text-lg">{data.systemHealth.cpu}%</div>
          </div>
          <div>
            <div className="text-zinc-400 text-sm">Memory</div>
            <div className="text-lg">{data.systemHealth.memory.used}MB / {data.systemHealth.memory.total}MB ({data.systemHealth.memory.percent}%)</div>
          </div>
          <div>
            <div className="text-zinc-400 text-sm">Disk</div>
            <div className="text-lg">{data.systemHealth.disk}%</div>
          </div>
        </div>
      </div>

      {/* Agents */}
      <div className="bg-zinc-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Active Agents</h2>
        <div className="space-y-4">
          {data.agents.map((agent) => (
            <div key={agent.id} className="border border-zinc-800 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold">{agent.name}</span>
                  <span className="text-zinc-400 ml-2">({agent.role})</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  agent.status === 'error' ? 'bg-red-900 text-red-200' :
                  agent.status === 'thinking' ? 'bg-yellow-900 text-yellow-200' :
                  agent.status === 'working' ? 'bg-blue-900 text-blue-200' :
                  'bg-zinc-800 text-zinc-300'
                }`}>
                  {agent.status}
                </span>
              </div>
              <div className="text-zinc-400 text-sm mb-2">{agent.task}</div>
              <div className="text-zinc-500 text-xs">
                Model: {agent.model} | Context: {agent.contextUsed}k / {agent.contextTotal}k tokens
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
