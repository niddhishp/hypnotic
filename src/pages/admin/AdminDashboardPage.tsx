import { useEffect } from 'react';
import { 
  Users, 
  Cpu, 
  CreditCard, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { useAdminStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Mock stats data
const mockStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalProjects: 3456,
  totalGenerations: 12847,
  revenue: 48750,
  revenueGrowth: 23.5,
  userGrowth: 15.2,
  generationGrowth: 42.8,
};

// Mock recent activity
const mockActivity = [
  { id: 1, action: 'New user signup', user: 'john@example.com', time: '2 minutes ago', type: 'user' },
  { id: 2, action: 'Insight report generated', user: 'sarah@agency.com', time: '5 minutes ago', type: 'insight' },
  { id: 3, action: 'Image generated', user: 'mike@brand.com', time: '12 minutes ago', type: 'craft' },
  { id: 4, action: 'Pro plan upgrade', user: 'lisa@studio.com', time: '1 hour ago', type: 'billing' },
  { id: 5, action: 'Strategy deck created', user: 'tom@agency.com', time: '2 hours ago', type: 'manifest' },
];

export default function AdminDashboardPage() {
  const { stats, setStats, setLoadingStats } = useAdminStore();

  useEffect(() => {
    // Simulate fetching stats
    setLoadingStats(true);
    setTimeout(() => {
      setStats(mockStats);
      setLoadingStats(false);
    }, 500);
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers.toLocaleString() || '-',
      change: stats?.userGrowth || 0,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers.toLocaleString() || '-',
      change: 8.3,
      icon: Activity,
      color: 'green',
    },
    {
      title: 'AI Generations',
      value: stats?.totalGenerations.toLocaleString() || '-',
      change: stats?.generationGrowth || 0,
      icon: Cpu,
      color: 'purple',
    },
    {
      title: 'Monthly Revenue',
      value: stats ? `$${stats.revenue.toLocaleString()}` : '-',
      change: stats?.revenueGrowth || 0,
      icon: CreditCard,
      color: 'gold',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
      green: { bg: 'bg-green-500/10', text: 'text-green-500' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
      gold: { bg: 'bg-[#D8A34A]/10', text: 'text-[#D8A34A]' },
      red: { bg: 'bg-red-500/10', text: 'text-red-500' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const colors = getColorClasses(stat.color);
          const isPositive = stat.change >= 0;
          
          return (
            <Card key={stat.title} className="bg-[#0F0F11] border-white/5">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#666] mb-1">{stat.title}</p>
                    <p className="text-2xl font-semibold text-[#F6F6F6]">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {isPositive ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span className={cn(
                        "text-sm",
                        isPositive ? "text-green-500" : "text-red-500"
                      )}>
                        {isPositive ? '+' : ''}{stat.change}%
                      </span>
                      <span className="text-sm text-[#666]">vs last month</span>
                    </div>
                  </div>
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.bg)}>
                    <stat.icon className={cn("w-5 h-5", colors.text)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="bg-[#0F0F11] border-white/5 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium text-[#F6F6F6]">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      activity.type === 'user' && "bg-blue-500",
                      activity.type === 'insight' && "bg-blue-500",
                      activity.type === 'craft' && "bg-purple-500",
                      activity.type === 'manifest' && "bg-green-500",
                      activity.type === 'billing' && "bg-[#D8A34A]",
                    )} />
                    <div>
                      <p className="text-sm text-[#F6F6F6]">{activity.action}</p>
                      <p className="text-xs text-[#666]">{activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#666]">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-[#0F0F11] border-white/5">
          <CardHeader>
            <CardTitle className="text-base font-medium text-[#F6F6F6]">Platform Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#A7A7A7]">API Uptime</span>
                <span className="text-sm text-green-500">99.9%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[99.9%] bg-green-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#A7A7A7]">AI Model Availability</span>
                <span className="text-sm text-green-500">100%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-full bg-green-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#A7A7A7]">Database Performance</span>
                <span className="text-sm text-[#D8A34A]">94%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[94%] bg-[#D8A34A] rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#A7A7A7]">Storage Usage</span>
                <span className="text-sm text-blue-500">67%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[67%] bg-blue-500 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Usage */}
      <Card className="bg-[#0F0F11] border-white/5">
        <CardHeader>
          <CardTitle className="text-base font-medium text-[#F6F6F6]">Module Usage (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Insight', usage: 2847, color: 'bg-blue-500' },
              { name: 'Manifest', usage: 1923, color: 'bg-green-500' },
              { name: 'Craft', usage: 4521, color: 'bg-purple-500' },
              { name: 'Amplify', usage: 1654, color: 'bg-red-500' },
            ].map((module) => (
              <div key={module.name} className="p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-[#666] mb-1">{module.name}</p>
                <p className="text-2xl font-semibold text-[#F6F6F6]">{module.usage.toLocaleString()}</p>
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", module.color)} style={{ width: `${(module.usage / 5000) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
