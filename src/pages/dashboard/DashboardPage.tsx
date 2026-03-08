import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  FileText, 
  Image, 
  Share2, 
  Network,
  ArrowRight,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useProjectsStore, useInsightStore, useManifestStore, useCraftStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const modules = [
  { 
    id: 'insight', 
    name: 'Insight', 
    description: 'Research brands, find tensions',
    icon: Search, 
    color: '#3B82F6',
    path: '/insight'
  },
  { 
    id: 'manifest', 
    name: 'Manifest', 
    description: 'Build strategy decks & scripts',
    icon: FileText, 
    color: '#22C55E',
    path: '/manifest'
  },
  { 
    id: 'craft', 
    name: 'Craft', 
    description: 'Generate images, video & audio',
    icon: Image, 
    color: '#A855F7',
    path: '/craft'
  },
  { 
    id: 'amplify', 
    name: 'Amplify', 
    description: 'Schedule & publish content',
    icon: Share2, 
    color: '#EF4444',
    path: '/amplify'
  },
];

const recentActivity = [
  { type: 'insight', title: 'Nike Campaign Research', time: '2 hours ago', status: 'complete' },
  { type: 'manifest', title: 'Q4 Strategy Deck', time: '5 hours ago', status: 'complete' },
  { type: 'craft', title: 'Hero Image Generation', time: '1 day ago', status: 'approved' },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { projects, currentProject } = useProjectsStore();
  const { reports } = useInsightStore();
  const { decks } = useManifestStore();
  const { assets } = useCraftStore();

  const stats = [
    { label: 'Projects', value: projects.length, icon: Network },
    { label: 'Research', value: reports.length, icon: Search },
    { label: 'Decks', value: decks.length, icon: FileText },
    { label: 'Assets', value: assets.length, icon: Image },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#F6F6F6] mb-2">
            {currentProject ? currentProject.name : 'Welcome to Hypnotic'}
          </h1>
          <p className="text-[#A7A7A7]">
            {currentProject 
              ? 'Continue working on your creative pipeline'
              : 'Select a project or create a new one to get started'
            }
          </p>
        </div>
        <Button 
          onClick={() => navigate('/insight')}
          className="bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          New Research
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-[#0F0F11] border-white/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[#A7A7A7]" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-[#F6F6F6]">{stat.value}</div>
                  <div className="text-xs text-[#666]">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-lg font-medium text-[#F6F6F6] mb-4">Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module) => (
            <Card 
              key={module.id}
              className="bg-[#0F0F11] border-white/5 hover:border-white/10 cursor-pointer group transition-all"
              onClick={() => navigate(module.path)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${module.color}20` }}
                  >
                    <module.icon className="w-6 h-6" style={{ color: module.color }} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#666] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-medium text-[#F6F6F6] mb-1">{module.name}</h3>
                <p className="text-sm text-[#A7A7A7]">{module.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-[#0F0F11] border-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-[#F6F6F6] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#A7A7A7]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-[#666]">
                No recent activity
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'complete' ? 'bg-green-500' : 
                      activity.status === 'approved' ? 'bg-[#D8A34A]' : 'bg-blue-500'
                    }`} />
                    <div>
                      <div className="text-sm text-[#F6F6F6]">{activity.title}</div>
                      <div className="text-xs text-[#666] capitalize">{activity.type}</div>
                    </div>
                  </div>
                  <div className="text-xs text-[#666]">{activity.time}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-[#0F0F11] border-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-[#F6F6F6] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#A7A7A7]" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start border-white/10 text-[#F6F6F6] hover:bg-white/5"
              onClick={() => navigate('/insight')}
            >
              <Search className="w-4 h-4 mr-3 text-[#3B82F6]" />
              Start new research
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-white/10 text-[#F6F6F6] hover:bg-white/5"
              onClick={() => navigate('/manifest')}
            >
              <FileText className="w-4 h-4 mr-3 text-[#22C55E]" />
              Create strategy deck
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-white/10 text-[#F6F6F6] hover:bg-white/5"
              onClick={() => navigate('/craft')}
            >
              <Image className="w-4 h-4 mr-3 text-[#A855F7]" />
              Generate creative assets
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-white/10 text-[#F6F6F6] hover:bg-white/5"
              onClick={() => navigate('/workspace')}
            >
              <Network className="w-4 h-4 mr-3 text-[#D8A34A]" />
              Open workspace
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
