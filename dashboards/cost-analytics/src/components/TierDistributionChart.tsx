import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTierStats } from '../hooks/useTierStats';
import { TIER_COLORS } from '../types';

export function TierDistributionChart() {
  const stats = useTierStats();

  const data = stats.map((stat) => ({
    name: stat.tier.charAt(0).toUpperCase() + stat.tier.slice(1),
    value: stat.cost,
    percentage: stat.percentage,
  }));

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
      <h3 className="mb-6 text-lg font-semibold text-white">Cost by Tier</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={TIER_COLORS[entry.name.toLowerCase() as keyof typeof TIER_COLORS]} 
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              formatter={(value: number, name: string, props: any) => [
                `$${value.toFixed(4)} (${props.payload.percentage.toFixed(1)}%)`,
                name,
              ]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-gray-300">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
