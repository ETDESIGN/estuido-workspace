import { useSessions } from '../hooks/useSessions';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const statusIcons = {
  completed: CheckCircle,
  failed: XCircle,
  in_progress: Clock,
};

const statusColors = {
  completed: 'text-green-400',
  failed: 'text-red-400',
  in_progress: 'text-amber-400',
};

const tierColors = {
  pulse: 'text-green-400 bg-green-500/10',
  workhorse: 'text-amber-400 bg-amber-500/10',
  brain: 'text-fuchsia-400 bg-fuchsia-500/10',
};

export function SessionsTable() {
  const sessions = useSessions();

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
      <h3 className="mb-6 text-lg font-semibold text-white">Recent Sessions</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="pb-3 text-left text-sm font-medium text-gray-400">Time</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-400">Model</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-400">Tier</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-400">Tokens</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-400">Cost</th>
              <th className="pb-3 text-center text-sm font-medium text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.slice(0, 10).map((session) => {
              const StatusIcon = statusIcons[session.status];
              return (
                <tr key={session.id} className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30">
                  <td className="py-3 text-sm text-gray-400">
                    {format(session.timestamp, 'MMM d, HH:mm')}
                  </td>
                  <td className="py-3 text-sm text-white">{session.modelName}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tierColors[session.tier]}`}>
                      {session.tier}
                    </span>
                  </td>
                  <td className="py-3 text-right text-sm text-gray-300">
                    {session.tokens.total.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-sm text-gray-300">
                    ${session.cost.toFixed(6)}
                  </td>
                  <td className="py-3 text-center">
                    <StatusIcon className={`mx-auto h-4 w-4 ${statusColors[session.status]}`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
