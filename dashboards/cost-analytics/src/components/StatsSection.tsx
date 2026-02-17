import { StatCard } from './StatCard';
import { useCostSummary } from '../hooks/useCostSummary';
import { DollarSign, Activity, Calendar, TrendingDown, type LucideIcon } from 'lucide-react';

interface StatItem {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
  color: 'blue' | 'green' | 'purple' | 'amber';
}

export function StatsSection() {
  const summary = useCostSummary();

  const stats: StatItem[] = [
    {
      title: "Today's Cost",
      value: `$${summary.today.toFixed(4)}`,
      icon: DollarSign,
      trend: '-12%',
      trendUp: false,
      color: 'blue',
    },
    {
      title: 'Total Sessions',
      value: summary.totalSessions.toString(),
      icon: Activity,
      trend: '+8%',
      trendUp: true,
      color: 'green',
    },
    {
      title: 'Total Tokens',
      value: `${(summary.totalTokens.total / 1000).toFixed(1)}K`,
      icon: Calendar,
      trend: '+15%',
      trendUp: true,
      color: 'purple',
    },
    {
      title: 'Savings vs Premium',
      value: `${summary.savingsPercentage.toFixed(1)}%`,
      icon: TrendingDown,
      subtitle: `$${summary.savingsAmount.toFixed(2)} saved`,
      color: 'amber',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
