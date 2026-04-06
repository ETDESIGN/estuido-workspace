'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3, FileText, CreditCard, CheckCircle2, TrendingUp,
  Users, Package, Clock, Activity, Loader2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
  AreaChart, Area,
} from 'recharts';

import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const STATUS_COLORS: Record<string, string> = {
  new: '#3b82f6', quoting: '#8b5cf6', quoted: '#06b6d4',
  negotiating: '#f59e0b', ordered: '#10b981', shipped: '#6366f1',
  delivered: '#22c55e', closed: '#6b7280', cancelled: '#ef4444',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: '#6b7280', normal: '#3b82f6', high: '#f59e0b', urgent: '#ef4444',
};

const CHART_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#14b8a6', '#f97316', '#64748b'];

interface KPI {
  totalRequests: number; activeRequests: number; deliveredRequests: number;
  totalQuotes: number; avgUnitPrice: number; acceptedQuotes: number;
  totalFiles: number; totalUsers: number;
}
interface AnalyticsData {
  kpi: KPI;
  byStatus: { status: string; count: number }[];
  byCategory: { product_category: string; count: number }[];
  byPriority: { priority: string; count: number }[];
  trend: { date: string; count: number }[];
  topSuppliers: { supplier_name: string; quote_count: number; avg_price: number; accepted_count: number }[];
  recentActivity: { action: string; details: Record<string, unknown>; created_at: string; user_name: string | null; request_title: string | null }[];
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const min = Math.floor(diff / 60000), hr = Math.floor(diff / 3600000), day = Math.floor(diff / 86400000);
  if (min < 1) return 'Just now'; if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`; return `${day}d ago`;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color?: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
      {label && <p className="font-medium mb-1">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?period=${period}`)
      .then(r => r.json())
      .then(res => { if (res.ok) setData(res.data); })
      .finally(() => setLoading(false));
  }, [period]);

  const kpi = data?.kpi;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader title="Analytics" description="Track your sourcing performance and pipeline health." />
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : data ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Requests', value: kpi?.totalRequests ?? 0, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Active', value: kpi?.activeRequests ?? 0, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Quotes', value: kpi?.totalQuotes ?? 0, icon: CreditCard, color: 'text-secondary', bg: 'bg-secondary/10' },
              { label: 'Delivered', value: kpi?.deliveredRequests ?? 0, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            ].map(item => (
              <Card key={item.label}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</span>
                    <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`size-4 ${item.color}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-black">{item.value.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Avg Quote Price', value: kpi?.avgUnitPrice ? `$${kpi.avgUnitPrice.toFixed(2)}` : '—' },
              { label: 'Accepted Quotes', value: kpi?.acceptedQuotes ?? 0 },
              { label: 'Files Uploaded', value: kpi?.totalFiles ?? 0 },
              ...(kpi && kpi.totalUsers > 0 ? [{ label: 'Total Users', value: kpi.totalUsers }] : []),
            ].map(item => (
              <div key={item.label} className="rounded-xl border border-border p-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-lg font-bold">{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</span>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Status Distribution */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="size-4" /> Requests by Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.byStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data.byStatus} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis dataKey="status" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" name="Requests" radius={[6, 6, 0, 0]}>
                        {data.byStatus.map((entry, i) => (
                          <Cell key={i} fill={STATUS_COLORS[entry.status] || '#64748b'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-12">No requests yet</p>
                )}
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Activity className="size-4" /> Requests by Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.byPriority.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={data.byPriority} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                        dataKey="count" nameKey="priority" paddingAngle={2}
                      >
                        {data.byPriority.map((entry, i) => (
                          <Cell key={i} fill={PRIORITY_COLORS[entry.priority] || '#64748b'} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-12">No requests yet</p>
                )}
                <div className="flex justify-center gap-4 mt-2">
                  {data.byPriority.map(p => (
                    <div key={p.priority} className="flex items-center gap-1.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PRIORITY_COLORS[p.priority] }} />
                      <span className="text-muted-foreground capitalize">{p.priority}</span>
                      <span className="font-bold">{p.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Chart */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <TrendingUp className="size-4" /> Request Trend (30 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data.trend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false}
                      tickFormatter={(v: string) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#colorCount)" strokeWidth={2} name="Requests" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No data in the last 30 days</p>
              )}
            </CardContent>
          </Card>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Categories */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Package className="size-4" /> Top Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.byCategory.length > 0 ? (
                  <div className="space-y-3">
                    {data.byCategory.slice(0, 5).map((cat, i) => {
                      const max = data.byCategory[0].count;
                      const pct = max > 0 ? (cat.count / max) * 100 : 0;
                      return (
                        <div key={cat.product_category}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-medium truncate max-w-[180px]">{cat.product_category}</span>
                            <span className="text-muted-foreground font-bold">{cat.count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No categories yet</p>
                )}
              </CardContent>
            </Card>

            {/* Top Suppliers */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Users className="size-4" /> Top Suppliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.topSuppliers.length > 0 ? (
                  <div className="space-y-3">
                    {data.topSuppliers.map((s, i) => (
                      <div key={s.supplier_name} className="flex items-center gap-3 py-2">
                        <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{s.supplier_name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{s.quote_count} quote{s.quote_count !== 1 ? 's' : ''}</span>
                            {s.avg_price > 0 && <span>· avg ${s.avg_price.toFixed(2)}</span>}
                            {s.accepted_count > 0 && <Badge variant="outline" className="text-[9px] text-emerald-400 border-emerald-400/20">{s.accepted_count} accepted</Badge>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No supplier data yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="size-4" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {data.recentActivity.map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${i === 0 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{a.user_name || 'System'}</span>
                          <span className="text-muted-foreground"> {a.action.replace(/_/g, ' ')}</span>
                          {a.request_title && <span className="text-muted-foreground"> on </span>}
                          {a.request_title && <span className="font-medium">{a.request_title}</span>}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60">{timeAgo(a.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <BarChart3 className="size-10 mb-3 opacity-30" />
            <p className="font-medium">Could not load analytics</p>
            <p className="text-xs mt-1">Check your connection and try again</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
