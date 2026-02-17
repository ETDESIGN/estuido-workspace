import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useModelStats } from '../hooks/useModelStats';

export function ModelUsageChart() {
  const data = useModelStats();

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
      <h3 className="mb-6 text-lg font-semibold text-white">Tokens by Model</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" stroke="#6b7280" tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#6b7280"
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              formatter={(value: number) => [`${value.toLocaleString()} tokens`, 'Total Tokens']}
            />
            <Bar dataKey="tokens" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
