import { useState } from 'react';
import { 
  Share2, 
  Calendar, 
  Clock, 
  TrendingUp,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  CheckCircle,
  AlertCircle,
  Play,
  BarChart3,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';
import { useAmplifyStore, useCraftStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F', maxLength: 2200 },
  { id: 'twitter', name: 'X / Twitter', icon: Twitter, color: '#1DA1F2', maxLength: 280 },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', maxLength: 3000 },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000', maxLength: 5000 },
];

const mockPosts = [
  {
    id: '1',
    projectId: '1',
    assetId: '1',
    platform: 'instagram',
    caption: 'No compromise. Just Air Max. 🏃‍♂️✨\n\nThe sneaker that performs when you need it and turns heads when you don\'t.\n\n#Nike #AirMax #NoCompromise #SneakerCulture',
    hashtags: ['Nike', 'AirMax', 'NoCompromise', 'SneakerCulture'],
    scheduledAt: '2024-03-15T10:00:00Z',
    status: 'scheduled' as const,
    performancePrediction: {
      reach: { min: 50000, max: 75000 },
      engagement: { min: 3.5, max: 5.2 },
    },
  },
  {
    id: '2',
    projectId: '1',
    assetId: '2',
    platform: 'twitter',
    caption: 'Performance meets style. Air Max — for those who refuse to choose. #NoCompromise',
    hashtags: ['NoCompromise'],
    scheduledAt: '2024-03-15T14:00:00Z',
    status: 'draft' as const,
  },
];

const mockAnalytics = {
  totalReach: 125000,
  totalEngagement: 4.2,
  topPerforming: 'instagram',
  scheduledPosts: 8,
  publishedPosts: 12,
};

export function AmplifyPage() {
  const { posts, addPost } = useAmplifyStore();
  const { assets } = useCraftStore();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [caption, setCaption] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [viewingPost, setViewingPost] = useState<typeof mockPosts[0] | null>(null);
  const [showPredictions, setShowPredictions] = useState(false);

  const displayPosts = posts.length > 0 ? posts : mockPosts;

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSchedule = () => {
    if (!caption.trim() || selectedPlatforms.length === 0) return;

    const newPost = {
      id: Date.now().toString(),
      projectId: '1',
      assetId: selectedAsset || '1',
      platform: selectedPlatforms[0],
      caption,
      hashtags: caption.match(/#\w+/g) || [],
      scheduledAt: scheduleDate || new Date().toISOString(),
      status: 'scheduled' as const,
      performancePrediction: {
        reach: { min: 25000, max: 50000 },
        engagement: { min: 2.5, max: 4.5 },
      },
    };

    addPost(newPost);
    setCaption('');
    setSelectedPlatforms(['instagram']);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full mb-4">
          <Share2 className="w-4 h-4 text-red-500" />
          <span className="text-xs font-medium text-red-500 uppercase tracking-wider">Amplify Module</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#F6F6F6] mb-2">
          Launch with confidence
        </h1>
        <p className="text-[#A7A7A7] max-w-lg mx-auto">
          Schedule, publish, and optimize content across all platforms. 
          Predict performance before you post.
        </p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#0F0F11] border-white/5">
          <CardContent className="p-4">
            <div className="text-2xl font-semibold text-[#F6F6F6]">
              {mockAnalytics.totalReach.toLocaleString()}
            </div>
            <div className="text-xs text-[#666]">Total Reach</div>
          </CardContent>
        </Card>
        <Card className="bg-[#0F0F11] border-white/5">
          <CardContent className="p-4">
            <div className="text-2xl font-semibold text-[#F6F6F6]">
              {mockAnalytics.totalEngagement}%
            </div>
            <div className="text-xs text-[#666]">Avg Engagement</div>
          </CardContent>
        </Card>
        <Card className="bg-[#0F0F11] border-white/5">
          <CardContent className="p-4">
            <div className="text-2xl font-semibold text-[#F6F6F6]">
              {mockAnalytics.scheduledPosts}
            </div>
            <div className="text-xs text-[#666]">Scheduled</div>
          </CardContent>
        </Card>
        <Card className="bg-[#0F0F11] border-white/5">
          <CardContent className="p-4">
            <div className="text-2xl font-semibold text-[#F6F6F6]">
              {mockAnalytics.publishedPosts}
            </div>
            <div className="text-xs text-[#666]">Published</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Composer */}
        <Card className="bg-[#0F0F11] border-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-[#F6F6F6]">
              Create Post
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm text-[#A7A7A7] mb-2">Platforms</label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-all",
                      selectedPlatforms.includes(platform.id)
                        ? "border-red-500 bg-red-500/10 text-red-500"
                        : "border-white/10 bg-white/5 text-[#A7A7A7] hover:bg-white/10"
                    )}
                  >
                    <platform.icon className="w-4 h-4" />
                    {platform.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm text-[#A7A7A7] mb-2">
                Caption
                <span className="ml-2 text-xs text-[#666]">
                  {caption.length} / {Math.max(...selectedPlatforms.map(p => platforms.find(pl => pl.id === p)?.maxLength || 2200))}
                </span>
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#F6F6F6] placeholder:text-[#666] focus:outline-none focus:border-red-500/50 resize-none"
              />
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-sm text-[#A7A7A7] mb-2">Schedule</label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#F6F6F6] focus:outline-none focus:border-red-500/50"
              />
            </div>

            {/* Predictions Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div 
                onClick={() => setShowPredictions(!showPredictions)}
                className={cn(
                  "w-10 h-5 rounded-full transition-colors relative",
                  showPredictions ? 'bg-red-500' : 'bg-white/10'
                )}
              >
                <div className={cn(
                  "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                  showPredictions ? 'left-6' : 'left-1'
                )} />
              </div>
              <span className="text-sm text-[#A7A7A7]">Predict performance</span>
            </label>

            {/* Predictions Preview */}
            {showPredictions && (
              <div className="p-4 bg-red-500/10 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-500">Performance Prediction</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-[#666]">Estimated Reach</div>
                    <div className="text-lg font-medium text-[#F6F6F6]">25K - 50K</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#666]">Engagement Rate</div>
                    <div className="text-lg font-medium text-[#F6F6F6]">2.5% - 4.5%</div>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleSchedule}
              disabled={!caption.trim() || selectedPlatforms.length === 0}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Post
            </Button>
          </CardContent>
        </Card>

        {/* Content Calendar */}
        <Card className="bg-[#0F0F11] border-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-[#F6F6F6] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#A7A7A7]" />
              Upcoming Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayPosts.map((post) => {
                const platform = platforms.find(p => p.id === post.platform);
                return (
                  <div 
                    key={post.id}
                    onClick={() => setViewingPost(post as any)}
                    className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {platform && (
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${platform.color}20` }}
                        >
                          <platform.icon className="w-4 h-4" style={{ color: platform.color }} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#F6F6F6] line-clamp-2 mb-1">{post.caption}</p>
                        <div className="flex items-center gap-3 text-xs text-[#666]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.scheduledAt ? formatDate(post.scheduledAt) : 'Not scheduled'}
                          </span>
                          {post.status === 'scheduled' ? (
                            <span className="text-red-500">Scheduled</span>
                          ) : (
                            <span className="text-[#A7A7A7]">Draft</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Post Viewer Dialog */}
      <Dialog open={!!viewingPost} onOpenChange={() => setViewingPost(null)}>
        <DialogContent className="max-w-lg bg-[#0F0F11] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-[#F6F6F6]">Post Preview</DialogTitle>
          </DialogHeader>
          {viewingPost && (
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-[#F6F6F6] whitespace-pre-wrap">{viewingPost.caption}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#666]">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(viewingPost.scheduledAt)}
                </span>
                <span className="capitalize">{viewingPost.status}</span>
              </div>
              {viewingPost.performancePrediction && (
                <div className="p-4 bg-red-500/10 rounded-lg">
                  <div className="text-sm font-medium text-red-500 mb-2">Predicted Performance</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-[#666]">Reach</div>
                      <div className="text-[#F6F6F6]">
                        {viewingPost.performancePrediction.reach.min.toLocaleString()} - {viewingPost.performancePrediction.reach.max.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#666]">Engagement</div>
                      <div className="text-[#F6F6F6]">
                        {viewingPost.performancePrediction.engagement.min}% - {viewingPost.performancePrediction.engagement.max}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button className="flex-1 bg-red-500 hover:bg-red-600">
                  <Play className="w-4 h-4 mr-2" />
                  Publish Now
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-white/10 text-[#F6F6F6] hover:bg-white/5"
                  onClick={() => setViewingPost(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
