import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/admin.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Zap,
  CreditCard,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const COLORS = ['#f97316', '#8b5cf6', '#10b981', '#3b82f6', '#f59e0b'];

// Mock data for charts
const userGrowthData = [
  { month: 'Jan', users: 120, active: 80 },
  { month: 'Feb', users: 180, active: 120 },
  { month: 'Mar', users: 250, active: 180 },
  { month: 'Apr', users: 320, active: 240 },
  { month: 'May', users: 450, active: 350 },
  { month: 'Jun', users: 580, active: 480 },
];

const generationData = [
  { day: 'Mon', images: 120, videos: 45, audio: 30 },
  { day: 'Tue', images: 150, videos: 60, audio: 40 },
  { day: 'Wed', images: 180, videos: 75, audio: 50 },
  { day: 'Thu', images: 140, videos: 55, audio: 35 },
  { day: 'Fri', images: 200, videos: 90, audio: 60 },
  { day: 'Sat', images: 250, videos: 120, audio: 80 },
  { day: 'Sun', images: 220, videos: 100, audio: 70 },
];

const revenueData = [
  { month: 'Jan', revenue: 2400, subscriptions: 1800, credits: 600 },
  { month: 'Feb', revenue: 3200, subscriptions: 2400, credits: 800 },
  { month: 'Mar', revenue: 4800, subscriptions: 3600, credits: 1200 },
  { month: 'Apr', revenue: 5600, subscriptions: 4200, credits: 1400 },
  { month: 'May', revenue: 7200, subscriptions: 5400, credits: 1800 },
  { month: 'Jun', revenue: 8800, subscriptions: 6600, credits: 2200 },
];

const moduleUsageData = [
  { name: 'Insight', value: 35, color: '#f97316' },
  { name: 'Manifest', value: 25, color: '#8b5cf6' },
  { name: 'Craft', value: 30, color: '#10b981' },
  { name: 'Amplify', value: 10, color: '#3b82f6' },
];

const planDistribution = [
  { name: 'Free', value: 45, color: '#6b7280' },
  { name: 'Creator', value: 35, color: '#f97316' },
  { name: 'Studio', value: 15, color: '#8b5cf6' },
  { name: 'Enterprise', value: 5, color: '#10b981' },
];

export function AdminAnalyticsPage() {
  const { stats, fetchStats } = useAdminStore();
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-zinc-400">
            Platform performance and usage insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-zinc-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={stats?.totalUsers?.toLocaleString() || '0'}
          change="+12.5%"
          trend="up"
          icon={Users}
          color="orange"
        />
        <MetricCard
          title="Active Users"
          value={stats?.activeUsers?.toLocaleString() || '0'}
          change="+8.2%"
          trend="up"
          icon={Activity}
          color="emerald"
        />
        <MetricCard
          title="AI Generations"
          value={stats?.totalGenerations?.toLocaleString() || '0'}
          change="+24.1%"
          trend="up"
          icon={Zap}
          color="purple"
        />
        <MetricCard
          title="Revenue"
          value={`$${stats?.revenue?.toLocaleString() || '0'}`}
          change="+18.7%"
          trend="up"
          icon={CreditCard}
          color="blue"
        />
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="generations"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            <Zap className="h-4 w-4 mr-2" />
            Generations
          </TabsTrigger>
          <TabsTrigger
            value="revenue"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Revenue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Module Usage */}
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-orange-500" />
                  Module Usage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={moduleUsageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {moduleUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid #27272a',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {moduleUsageData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-zinc-400">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Plan Distribution */}
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Subscription Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        border: '1px solid #27272a',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {planDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-zinc-400">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="month" stroke="#71717a" />
                  <YAxis stroke="#71717a" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#f97316"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    name="Total Users"
                  />
                  <Area
                    type="monotone"
                    dataKey="active"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorActive)"
                    name="Active Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generations" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Daily Generations by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="day" stroke="#71717a" />
                  <YAxis stroke="#71717a" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="images" fill="#f97316" name="Images" />
                  <Bar dataKey="videos" fill="#8b5cf6" name="Videos" />
                  <Bar dataKey="audio" fill="#10b981" name="Audio" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-white">Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="month" stroke="#71717a" />
                  <YAxis stroke="#71717a" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`$${value}`, '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Total Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="subscriptions"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="Subscriptions"
                  />
                  <Line
                    type="monotone"
                    dataKey="credits"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Credit Purchases"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New user signup', user: 'sarah@example.com', time: '2 min ago', type: 'user' },
              { action: 'Image generation', user: 'john@example.com', time: '5 min ago', type: 'generation' },
              { action: 'Upgraded to Creator', user: 'mike@example.com', time: '12 min ago', type: 'subscription' },
              { action: 'Video generation', user: 'emma@example.com', time: '18 min ago', type: 'generation' },
              { action: 'Project created', user: 'alex@example.com', time: '25 min ago', type: 'project' },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={
                      activity.type === 'user'
                        ? 'border-blue-500/30 text-blue-400'
                        : activity.type === 'generation'
                        ? 'border-purple-500/30 text-purple-400'
                        : activity.type === 'subscription'
                        ? 'border-emerald-500/30 text-emerald-400'
                        : 'border-orange-500/30 text-orange-400'
                    }
                  >
                    {activity.type}
                  </Badge>
                  <div>
                    <p className="text-sm text-white">{activity.action}</p>
                    <p className="text-xs text-zinc-500">{activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-zinc-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: 'orange' | 'emerald' | 'purple' | 'blue';
}) {
  const colorClasses = {
    orange: 'bg-orange-500/10 text-orange-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    purple: 'bg-purple-500/10 text-purple-500',
    blue: 'bg-blue-500/10 text-blue-500',
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  trend === 'up' ? 'text-emerald-500 text-sm' : 'text-red-500 text-sm'
                }
              >
                {change}
              </span>
              <span className="text-zinc-500 text-sm">vs last period</span>
            </div>
          </div>
          <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
