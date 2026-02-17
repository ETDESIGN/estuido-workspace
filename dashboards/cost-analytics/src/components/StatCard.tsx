import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
  color: 'blue' | 'green' | 'purple' | 'amber';
}

const colorClasses = {
  blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  green: 'from-green-500/20 to-green-600/10 border-green-500/30',
  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
};

const iconColors = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  purple: 'text-purple-500',
  amber: 'text-amber-500',
};

export function StatCard({ title, value, icon: Icon, trend, trendUp, subtitle, color }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${colorClasses[color]} p-6 backdrop-blur-sm transition-all hover:scale-[1.02]`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
          )}
          {trend && (
            <p className={`mt-2 text-sm ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
              {trend} from last week
            </p>
          )}
        </div>
        <div className={`rounded-xl bg-gray-800/50 p-3 ${iconColors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
