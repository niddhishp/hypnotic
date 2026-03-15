import { useState } from 'react';
import {
  Share2, Calendar, Clock, TrendingUp, Play, BarChart3, Eye,
  Heart, MessageCircle, CheckCircle, Plus, ChevronRight, RefreshCw,
  Instagram, Twitter, Linkedin, Youtube, Sparkles, Edit3, Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/shared/SEO';

// ─── Types ────────────────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'x',         name: 'X / Twitter', icon: Twitter,   color: '#1DA1F2' },
  { id: 'linkedin',  name: 'LinkedIn',   icon: Linkedin,   color: '#0A66C2' },
  { id: 'youtube',   name: 'YouTube',    icon: Youtube,    color: '#FF0000' },
];

type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

interface ScheduledPost {
  id: string; platform: string; caption: string;
  scheduledAt: string; status: PostStatus;
  prediction: { reach: [number, number]; engagement: [number, number] };
  metrics?: { impressions: number; likes: number; comments: number };
}

const DEMO_POSTS: ScheduledPost[] = [
  {
    id: '1', platform: 'instagram',
    caption: 'No compromise. Just Air Max. 🏃‍♂️✨\n\nThe sneaker that performs when you need it and turns heads when you don\'t.\n\n#Nike #AirMax #NoCompromise',
    scheduledAt: '2024-03-15T10:00:00Z', status: 'scheduled',
    prediction: { reach: [50000, 75000], engagement: [3.5, 5.2] },
  },
  {
    id: '2', platform: 'x',
    caption: 'Performance meets style. Air Max — for those who refuse to choose. #NoCompromise',
    scheduledAt: '2024-03-15T14:00:00Z', status: 'scheduled',
    prediction: { reach: [20000, 35000], engagement: [2.1, 3.8] },
  },
  {
    id: '3', platform: 'linkedin',
    caption: 'Innovation in motion: how Air Max technology has evolved to redefine what\'s possible in athletic footwear.',
    scheduledAt: '2024-03-14T09:00:00Z', status: 'published',
    prediction: { reach: [15000, 25000], engagement: [4.2, 6.1] },
    metrics: { impressions: 18400, likes: 892, comments: 67 },
  },
  {
    id: '4', platform: 'instagram',
    caption: 'Behind the design. The story of Air Max told by the people who built it. Link in bio.',
    scheduledAt: '2024-03-13T11:00:00Z', status: 'published',
    prediction: { reach: [60000, 80000], engagement: [4.8, 6.5] },
    metrics: { impressions: 71200, likes: 4380, comments: 203 },
  },
];

type View = 'queue' | 'calendar' | 'analytics';

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function fmtNum(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function getPlatform(id: string) {
  return PLATFORMS.find(p => p.id === id) ?? PLATFORMS[0];
}

function PostCard({ post }: { post: ScheduledPost }) {
  const p = getPlatform(post.platform);
  const PIcon = p.icon;
  const statusColors: Record<PostStatus, string> = {
    draft:     'text-[#777] bg-white/5',
    scheduled: 'text-[#C9A96E] bg-[#C9A96E]/10',
    published: 'text-[#7abf8e] bg-[#7abf8e]/10',
    failed:    'text-red-400 bg-red-400/10',
  };
  const statusLabels: Record<PostStatus, string> = {
    draft: 'Draft', scheduled: 'Scheduled', published: 'Published', failed: 'Failed',
  };

  return (
    <div className="rounded-xl border border-white/8 overflow-hidden hover:border-white/15 transition-all"
      style={{ background: '#0D0D10' }}>
      <SEO title="Amplify — Publish & Schedule" noIndex />
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <PIcon className="w-3.5 h-3.5" style={{ color: p.color }} />
          <span className="text-xs font-medium text-[#F0EDE8]">{p.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-[11px] px-2 py-0.5 rounded-full', statusColors[post.status])}>
            {statusLabels[post.status]}
          </span>
          <span className="text-[11px] text-[#444] flex items-center gap-1">
            <Clock className="w-3 h-3" /> {fmt(post.scheduledAt)}
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Caption */}
        <p className="text-xs text-[#C0B8AC] leading-relaxed mb-4 line-clamp-3 whitespace-pre-line">
          {post.caption}
        </p>

        {/* Prediction or Metrics */}
        {post.metrics ? (
          <div className="flex items-center gap-5 text-xs text-[#555]">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {fmtNum(post.metrics.impressions)}</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {fmtNum(post.metrics.likes)}</span>
            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {fmtNum(post.metrics.comments)}</span>
            <span className="ml-auto text-[11px] text-[#7abf8e] bg-[#7abf8e]/10 px-2 py-0.5 rounded-full">
              {((post.metrics.likes / post.metrics.impressions) * 100).toFixed(1)}% eng.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-[11px] text-[#555]">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-3 h-3" />
              <span>Est. {fmtNum(post.prediction.reach[0])}–{fmtNum(post.prediction.reach[1])} reach</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              <span>{post.prediction.engagement[0]}–{post.prediction.engagement[1]}% eng.</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 pb-3">
        <button className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-[#666] hover:text-[#F0EDE8] hover:bg-white/5 rounded-lg transition-all">
          <Edit3 className="w-3 h-3" /> Edit
        </button>
        {post.status === 'draft' && (
          <button className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-[#C9A96E] hover:text-[#F0EDE8] hover:bg-[#C9A96E]/10 rounded-lg transition-all">
            <Send className="w-3 h-3" /> Schedule
          </button>
        )}
        {post.status === 'scheduled' && (
          <button className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] text-[#666] hover:text-[#F0EDE8] hover:bg-white/5 rounded-lg transition-all">
            <RefreshCw className="w-3 h-3" /> Reschedule
          </button>
        )}
      </div>
    </div>
  );
}

export function AmplifyPage() {
  const [view, setView] = useState<View>('queue');
  const [activePlatforms, setActivePlatforms] = useState<string[]>(['instagram', 'x', 'linkedin', 'youtube']);
  const [posts] = useState<ScheduledPost[]>(DEMO_POSTS);

  const filteredPosts = posts.filter(p => activePlatforms.includes(p.platform));
  const scheduled  = filteredPosts.filter(p => p.status === 'scheduled');
  const published  = filteredPosts.filter(p => p.status === 'published');

  const totalReach = published.reduce((acc, p) => acc + (p.metrics?.impressions ?? 0), 0);
  const totalLikes = published.reduce((acc, p) => acc + (p.metrics?.likes ?? 0), 0);

  // Simple 7-day calendar grid
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <div className="min-h-full" style={{ background: '#0A0A0C' }}>
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#C9A96E]/15 flex items-center justify-center">
                <Share2 className="w-3 h-3 text-[#C9A96E]" />
              </div>
              <span className="text-[11px] text-[#C9A96E] uppercase tracking-[0.15em] font-medium">Amplify</span>
            </div>
            <h1 className="text-3xl font-light text-[#F0EDE8] tracking-tight">Publish & measure</h1>
            <p className="text-sm text-[#555]">Schedule approved assets across platforms. Predict performance. Iterate.</p>
          </div>
          <button className="flex items-center gap-1.5 bg-[#C9A96E] text-[#08080A] rounded-xl px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Schedule Post
          </button>
        </div>

        {/* ── Platform connectors ─────────────────────────────── */}
        <div className="flex items-center gap-2">
          {PLATFORMS.map(p => {
            const Icon = p.icon;
            const active = activePlatforms.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => setActivePlatforms(prev =>
                  prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]
                )}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all',
                  active ? 'border-white/20 text-[#F0EDE8] bg-white/5' : 'border-white/6 text-[#555] hover:border-white/15'
                )}>
                <Icon className="w-3.5 h-3.5" style={{ color: active ? p.color : undefined }} />
                {p.name}
                {active && <span className="w-1.5 h-1.5 rounded-full ml-0.5" style={{ background: p.color }} />}
              </button>
            );
          })}
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-white/10 text-xs text-[#555] hover:border-white/20 hover:text-[#888] transition-all ml-1">
            <Plus className="w-3 h-3" /> Connect
          </button>
        </div>

        {/* ── Stats row ───────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Scheduled', value: scheduled.length, unit: 'posts', color: '#C9A96E' },
            { label: 'Published', value: published.length, unit: 'posts', color: '#7abf8e' },
            { label: 'Total Reach', value: fmtNum(totalReach), unit: 'impressions', color: '#7aaee0' },
            { label: 'Total Likes', value: fmtNum(totalLikes), unit: 'engagements', color: '#a07ae0' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-white/8 p-4" style={{ background: '#0D0D10' }}>
              <div className="text-[11px] text-[#444] uppercase tracking-wider mb-1">{s.label}</div>
              <div className="text-2xl font-light mb-0.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-[#444]">{s.unit}</div>
            </div>
          ))}
        </div>

        {/* ── View tabs ───────────────────────────────────────── */}
        <div className="flex items-center gap-1 border-b border-white/8">
          {(['queue', 'calendar', 'analytics'] as View[]).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={cn(
                'px-4 py-2.5 text-xs font-medium capitalize transition-all border-b-2 -mb-px',
                view === v ? 'border-[#C9A96E] text-[#C9A96E]' : 'border-transparent text-[#555] hover:text-[#888]'
              )}>{v}</button>
          ))}
        </div>

        {/* ── Queue view ──────────────────────────────────────── */}
        {view === 'queue' && (
          <div className="space-y-6">
            {scheduled.length > 0 && (
              <div>
                <div className="text-[11px] text-[#444] uppercase tracking-wider mb-3">Scheduled ({scheduled.length})</div>
                <div className="grid grid-cols-2 gap-3">
                  {scheduled.map(p => <PostCard key={p.id} post={p} />)}
                </div>
              </div>
            )}
            {published.length > 0 && (
              <div>
                <div className="text-[11px] text-[#444] uppercase tracking-wider mb-3">Published ({published.length})</div>
                <div className="grid grid-cols-2 gap-3">
                  {published.map(p => <PostCard key={p.id} post={p} />)}
                </div>
              </div>
            )}
            {filteredPosts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/8 rounded-2xl">
                <Share2 className="w-8 h-8 text-[#333] mb-3" />
                <div className="text-sm text-[#555] mb-1">No posts scheduled</div>
                <p className="text-xs text-[#444]">Approve assets in Craft to schedule them here</p>
              </div>
            )}
          </div>
        )}

        {/* ── Calendar view ───────────────────────────────────── */}
        {view === 'calendar' && (
          <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: '#0D0D10' }}>
            <div className="grid grid-cols-7 border-b border-white/5">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="px-3 py-2 text-[11px] text-[#444] uppercase tracking-wider text-center border-r border-white/5 last:border-0">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {weekDays.map((d, i) => {
                const dayPosts = posts.filter(p => new Date(p.scheduledAt).toDateString() === d.toDateString());
                const isToday = d.toDateString() === today.toDateString();
                return (
                  <div key={i} className={cn(
                    'min-h-[140px] p-3 border-r border-b border-white/5 last:border-r-0',
                    isToday && 'bg-[#C9A96E]/3'
                  )}>
                    <div className={cn(
                      'text-xs font-medium mb-2 w-6 h-6 flex items-center justify-center rounded-full',
                      isToday ? 'bg-[#C9A96E] text-[#08080A]' : 'text-[#666]'
                    )}>
                      {d.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayPosts.map(p => {
                        const platform = getPlatform(p.platform);
                        const PIcon = platform.icon;
                        return (
                          <div key={p.id}
                            className="flex items-center gap-1 px-1.5 py-1 rounded text-[11px] text-[#888] truncate"
                            style={{ background: `${platform.color}15` }}>
                            <PIcon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: platform.color }} />
                            <span className="truncate">{new Date(p.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Analytics view ──────────────────────────────────── */}
        {view === 'analytics' && (
          <div className="space-y-4">
            {published.map(post => {
              if (!post.metrics) return null;
              const p = getPlatform(post.platform);
              const PIcon = p.icon;
              const engRate = ((post.metrics.likes / post.metrics.impressions) * 100).toFixed(2);
              const barW = Math.min((post.metrics.impressions / 100000) * 100, 100);
              return (
                <div key={post.id} className="rounded-xl border border-white/8 p-5" style={{ background: '#0D0D10' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <PIcon className="w-4 h-4" style={{ color: p.color }} />
                      <span className="text-sm font-medium text-[#F0EDE8]">{p.name}</span>
                      <span className="text-[11px] text-[#444]">{fmt(post.scheduledAt)}</span>
                    </div>
                    <span className="text-[11px] text-[#7abf8e] bg-[#7abf8e]/10 px-2 py-0.5 rounded-full">Published</span>
                  </div>
                  <p className="text-xs text-[#666] mb-4 line-clamp-2">{post.caption}</p>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { label: 'Impressions', value: fmtNum(post.metrics.impressions), icon: Eye },
                      { label: 'Likes', value: fmtNum(post.metrics.likes), icon: Heart },
                      { label: 'Comments', value: fmtNum(post.metrics.comments), icon: MessageCircle },
                    ].map(m => (
                      <div key={m.label}>
                        <div className="text-[11px] text-[#444] mb-0.5">{m.label}</div>
                        <div className="text-base font-light text-[#F0EDE8]">{m.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${barW}%`, background: p.color }} />
                    </div>
                    <span className="text-[11px] text-[#555]">{engRate}% eng. rate</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── +Human CTA ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/6 p-5 flex items-center justify-between"
          style={{ background: '#0D0D10' }}>
          <div>
            <div className="text-sm font-medium text-[#F0EDE8] mb-0.5">Work with a media planner</div>
            <div className="text-xs text-[#555]">Expert optimisation for reach, timing, and platform strategy</div>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-[#C9A96E] border border-[#C9A96E]/25 rounded-lg px-3 py-2 hover:border-[#C9A96E]/50 transition-colors">
            <Plus className="w-3 h-3" /> + Human
          </button>
        </div>

      </div>
    </div>
  );
}
