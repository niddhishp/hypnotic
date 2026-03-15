// src/pages/amplify/AmplifyPage.tsx
// The distribution and optimisation layer.
// Content / Queue / Analytics / Channels

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Calendar, BarChart3, Plug, Plus, ArrowRight,
  Image as ImgIcon, Film, Music, FileText, Check, Clock,
  Instagram, Twitter, Linkedin, Youtube, Send,
  Sparkles, Eye, Edit3, MoreVertical, TrendingUp,
  TrendingDown, Minus, AlertCircle, Globe, Zap,
  ChevronRight, RefreshCw, ExternalLink, Star,
} from 'lucide-react';
import { useProjectsStore, useCraftStore } from '@/store';
import { useBrandMemoryStore } from '@/store/brand-memory.store';
import { AgentActivityIndicator } from '@/components/shared/AgentActivityIndicator';
import { SEO } from '@/components/shared/SEO';
import { cn } from '@/lib/utils';

type Tab = 'content' | 'queue' | 'analytics' | 'channels';

// ── Platform config ───────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: Instagram,  color: '#E1306C', connected: false,
    supports: ['image', 'video', 'reel', 'story'], maxCaption: 2200 },
  { id: 'linkedin',  label: 'LinkedIn',  icon: Linkedin,   color: '#0A66C2', connected: false,
    supports: ['image', 'video', 'document', 'text'], maxCaption: 3000 },
  { id: 'twitter',   label: 'X / Twitter', icon: Twitter, color: '#1DA1F2', connected: false,
    supports: ['image', 'video', 'text'], maxCaption: 280 },
  { id: 'youtube',   label: 'YouTube',   icon: Youtube,    color: '#FF0000', connected: false,
    supports: ['video'], maxCaption: 5000 },
  { id: 'tiktok',    label: 'TikTok',    icon: Film,       color: '#010101', connected: false,
    supports: ['video'], maxCaption: 2200 },
  { id: 'facebook',  label: 'Facebook',  icon: Globe,      color: '#1877F2', connected: false,
    supports: ['image', 'video', 'text'], maxCaption: 63206 },
];

// ── Content item types ────────────────────────────────────────────────────────

type ContentStatus = 'from_craft' | 'draft' | 'approved' | 'scheduled' | 'live' | 'failed';

interface ContentItem {
  id:            string;
  title:         string;
  type:          'image' | 'video' | 'audio' | 'document';
  status:        ContentStatus;
  platforms:     string[];
  caption?:      string;
  scheduledAt?:  string;
  publishedAt?:  string;
  thumbnailBg:   string;
  fromManifest?: boolean;
  variants?:     { platform: string; caption: string; status: 'ready' | 'needs_review' }[];
  performance?: {
    reach:       number;
    engagement:  number;
    clicks:      number;
    delta:       'up' | 'down' | 'flat';
  };
}

// ── Mock content (replace with Supabase query on craft_assets) ────────────────

const MOCK_CONTENT: ContentItem[] = [
  {
    id: 'c1', title: 'Brand film — Hero shot', type: 'video', status: 'from_craft',
    platforms: ['instagram', 'youtube'], thumbnailBg: 'from-[#1A1A2A] to-[#2A1A2A]',
    fromManifest: true,
    caption: 'Every great journey begins with a single step. Meet the people behind the brand. 🎬',
    variants: [
      { platform: 'instagram', caption: 'Every great journey begins with a single step. 🎬 #BrandFilm #Story', status: 'ready' },
      { platform: 'youtube',   caption: 'The story behind our brand — a short film about why we do what we do.',  status: 'ready' },
    ],
  },
  {
    id: 'c2', title: 'Campaign visual — Hero', type: 'image', status: 'from_craft',
    platforms: ['instagram', 'linkedin'], thumbnailBg: 'from-[#1A2A1A] to-[#2A1A1A]',
    fromManifest: true,
    caption: 'The image that anchors the campaign.',
    variants: [
      { platform: 'instagram', caption: 'Bold. Minimal. Unmistakably us. ✦ #Campaign #Launch', status: 'ready' },
      { platform: 'linkedin',  caption: 'Proud to unveil our new campaign direction. Full story in comments.', status: 'needs_review' },
    ],
  },
  {
    id: 'c3', title: 'Product reel — Lifestyle', type: 'video', status: 'scheduled',
    platforms: ['instagram'], thumbnailBg: 'from-[#2A1A1A] to-[#1A2A2A]',
    scheduledAt: 'Tomorrow, 11:00 AM',
    caption: 'Made for the way you live.',
    performance: { reach: 0, engagement: 0, clicks: 0, delta: 'flat' },
  },
  {
    id: 'c4', title: 'Behind the scenes', type: 'video', status: 'live',
    platforms: ['instagram', 'twitter'], thumbnailBg: 'from-[#1A1A2A] to-[#2A2A1A]',
    publishedAt: '2 days ago',
    performance: { reach: 12400, engagement: 847, clicks: 234, delta: 'up' },
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ContentStatus }) {
  const cfg = {
    from_craft: { label: 'From Craft',  color: '#a07ae0', bg: '#a07ae015' },
    draft:      { label: 'Draft',       color: '#555555', bg: '#55555515' },
    approved:   { label: 'Approved',    color: '#7abf8e', bg: '#7abf8e15' },
    scheduled:  { label: 'Scheduled',  color: '#C9A96E', bg: '#C9A96E15' },
    live:       { label: 'Live',        color: '#7abf8e', bg: '#7abf8e20' },
    failed:     { label: 'Failed',      color: '#e07a7a', bg: '#e07a7a15' },
  }[status] ?? { label: status, color: '#555', bg: '#55555515' };
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
      style={{ color: cfg.color, background: cfg.bg }}>
      {cfg.label}
    </span>
  );
}

function PlatformIcon({ platformId, size = 'sm' }: { platformId: string; size?: 'sm' | 'md' }) {
  const p = PLATFORMS.find(p => p.id === platformId);
  if (!p) return null;
  const Icon = p.icon;
  const s = size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
  return <Icon className={s} style={{ color: p.color }} />;
}

function ContentCard({ item, onApprove, onSchedule, onView }: {
  item: ContentItem;
  onApprove: () => void;
  onSchedule: () => void;
  onView: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-white/6 overflow-hidden hover:border-white/10 transition-all"
      style={{ background: '#0D0D10' }}>
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.thumbnailBg} flex items-center justify-center flex-shrink-0`}>
          {item.type === 'video' && <Film className="w-5 h-5 text-white/30" />}
          {item.type === 'image' && <ImgIcon className="w-5 h-5 text-white/30" />}
          {item.type === 'audio' && <Music className="w-5 h-5 text-white/30" />}
          {item.type === 'document' && <FileText className="w-5 h-5 text-white/30" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <p className="text-xs font-medium text-[#F0EDE8] truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <StatusBadge status={item.status} />
                <div className="flex items-center gap-1">
                  {item.platforms.map(p => <PlatformIcon key={p} platformId={p} />)}
                </div>
              </div>
            </div>
            <button onClick={() => setExpanded(e => !e)}
              className="text-[#444] hover:text-[#888] transition-colors p-1 flex-shrink-0">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          {item.caption && (
            <p className="text-[11px] text-[#555] line-clamp-2 leading-relaxed">{item.caption}</p>
          )}

          {item.scheduledAt && (
            <p className="text-[11px] text-[#C9A96E] mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {item.scheduledAt}
            </p>
          )}

          {item.publishedAt && item.performance && (
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[11px] text-[#444]">{item.publishedAt}</span>
              <span className="text-[11px] text-[#555] flex items-center gap-1">
                <Eye className="w-3 h-3" /> {item.performance.reach.toLocaleString()}
              </span>
              <span className={cn(
                'text-[11px] flex items-center gap-0.5',
                item.performance.delta === 'up' ? 'text-[#7abf8e]' : item.performance.delta === 'down' ? 'text-red-400' : 'text-[#444]'
              )}>
                {item.performance.delta === 'up' && <TrendingUp className="w-3 h-3" />}
                {item.performance.delta === 'down' && <TrendingDown className="w-3 h-3" />}
                {item.performance.delta === 'flat' && <Minus className="w-3 h-3" />}
                {item.performance.engagement.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Variants */}
      {expanded && item.variants && (
        <div className="border-t border-white/5 px-4 py-3 space-y-2">
          <p className="text-[10px] text-[#444] uppercase tracking-wider mb-2">
            Platform variants — written by Distribution Strategist
          </p>
          {item.variants.map(v => {
            const platform = PLATFORMS.find(p => p.id === v.platform);
            const Icon = platform?.icon ?? Globe;
            return (
              <div key={v.platform} className="flex items-start gap-2.5">
                <Icon className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: platform?.color }} />
                <div className="flex-1">
                  <p className="text-[11px] text-[#888] leading-relaxed">{v.caption}</p>
                </div>
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0',
                  v.status === 'ready' ? 'text-[#7abf8e] bg-[#7abf8e]/10' : 'text-[#C9A96E] bg-[#C9A96E]/10'
                )}>{v.status === 'ready' ? '✓' : 'Review'}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      {(item.status === 'from_craft' || item.status === 'draft') && (
        <div className="border-t border-white/5 px-4 py-2.5 flex items-center gap-2">
          <button onClick={onApprove}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7abf8e]/15 text-[#7abf8e] rounded-lg text-[11px] font-medium hover:bg-[#7abf8e]/25 transition-all">
            <Check className="w-3 h-3" /> Approve
          </button>
          <button onClick={onSchedule}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A96E]/15 text-[#C9A96E] rounded-lg text-[11px] font-medium hover:bg-[#C9A96E]/25 transition-all">
            <Calendar className="w-3 h-3" /> Schedule
          </button>
          <button onClick={onView}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[#555] rounded-lg text-[11px] hover:text-[#888] transition-all ml-auto">
            <Edit3 className="w-3 h-3" /> Edit
          </button>
        </div>
      )}
    </div>
  );
}

// ── Analytics cards ───────────────────────────────────────────────────────────

function AnalyticCard({ label, value, delta, color }: {
  label: string; value: string; delta: string; color: string;
}) {
  return (
    <div className="p-4 rounded-2xl border border-white/6" style={{ background: '#0D0D10' }}>
      <p className="text-[11px] text-[#444] mb-2">{label}</p>
      <p className="text-2xl font-light" style={{ color }}>{value}</p>
      <p className="text-[11px] text-[#7abf8e] mt-1">{delta}</p>
    </div>
  );
}

// ── Channel card ──────────────────────────────────────────────────────────────

function ChannelCard({ platform, onConnect }: {
  platform: typeof PLATFORMS[0];
  onConnect: () => void;
}) {
  const Icon = platform.icon;
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/6 hover:border-white/12 transition-all"
      style={{ background: '#0D0D10' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${platform.color}15` }}>
        <Icon className="w-4.5 h-4.5" style={{ color: platform.color }} />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-[#F0EDE8]">{platform.label}</p>
        <p className="text-[11px] text-[#444]">
          {platform.connected ? 'Connected · Last sync 2 min ago' : 'Not connected'}
        </p>
      </div>
      <button
        onClick={onConnect}
        className={cn(
          'text-[11px] px-3 py-1.5 rounded-xl border transition-all font-medium',
          platform.connected
            ? 'border-white/8 text-[#444] hover:border-white/20 hover:text-[#666]'
            : 'border-white/10 text-[#777] hover:border-[#C9A96E]/40 hover:text-[#C9A96E]'
        )}>
        {platform.connected ? 'Manage' : 'Connect'}
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function AmplifyPage() {
  const navigate = useNavigate();
  const { currentProject } = useProjectsStore();
  const { assets } = useCraftStore();
  const brandMemory = useBrandMemoryStore();

  const [tab, setTab] = useState<Tab>('content');
  const [content, setContent] = useState<ContentItem[]>(MOCK_CONTENT);
  const [optimising, setOptimising] = useState(false);
  const [calendarView, setCalendarView] = useState(false);

  const memory = currentProject ? brandMemory.getMemory(currentProject.id) : null;

  const fromCraft    = content.filter(c => c.status === 'from_craft' || c.status === 'draft');
  const inProgress   = content.filter(c => c.status === 'approved' || c.status === 'scheduled');
  const published    = content.filter(c => c.status === 'live' || c.status === 'failed');
  const connectedPlatforms = PLATFORMS.filter(p => p.connected);

  const handleApprove = (id: string) => {
    setContent(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
  };

  const handleSchedule = (id: string) => {
    setContent(prev => prev.map(c => c.id === id ? { ...c, status: 'scheduled', scheduledAt: 'Tomorrow, 11:00 AM' } : c));
  };

  const handleOptimise = async () => {
    setOptimising(true);
    await new Promise(r => setTimeout(r, 2000));
    setOptimising(false);
  };

  const TABS: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'content',   label: 'Content',   icon: LayoutGrid, count: content.length },
    { id: 'queue',     label: 'Queue',     icon: Calendar,   count: inProgress.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3   },
    { id: 'channels',  label: 'Channels',  icon: Plug,       count: connectedPlatforms.length },
  ];

  return (
    <div className="min-h-full" style={{ background: '#0A0A0C' }}>
      <SEO title="Amplify" noIndex />
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#7abf8e]/15 text-[#7abf8e] uppercase tracking-wider">
              Amplify
            </span>
            <AgentActivityIndicator agentId="distribution" isActive={optimising} />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-light text-[#F0EDE8]">Make it travel</h1>
              <p className="text-sm text-[#555] mt-1">
                {fromCraft.length > 0
                  ? `${fromCraft.length} pieces from Craft waiting to publish`
                  : 'All content from Craft appears here, ready to schedule and publish'}
              </p>
            </div>
            <button onClick={handleOptimise} disabled={optimising}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#7abf8e]/30 text-[#7abf8e] rounded-xl text-xs font-medium hover:bg-[#7abf8e]/8 disabled:opacity-50 transition-all">
              <Zap className="w-3.5 h-3.5" />
              {optimising ? 'Optimising…' : 'Optimise all'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-white/6 pb-0">
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-all border-b-2 -mb-px',
                  active ? 'border-[#7abf8e] text-[#F0EDE8]' : 'border-transparent text-[#444] hover:text-[#777]'
                )}>
                <Icon className="w-3.5 h-3.5" />
                {t.label}
                {t.count !== undefined && t.count > 0 && (
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                    active ? 'bg-[#7abf8e]/20 text-[#7abf8e]' : 'bg-white/6 text-[#555]'
                  )}>{t.count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── TAB: Content ── */}
        {tab === 'content' && (
          <div className="space-y-6">

            {/* From Craft */}
            {fromCraft.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#a07ae0]" />
                    <p className="text-xs font-medium text-[#F0EDE8]">From Craft</p>
                    <span className="text-[11px] text-[#444]">— variants written by Distribution Strategist</span>
                  </div>
                  <button onClick={() => navigate('/craft')}
                    className="text-[11px] text-[#555] hover:text-[#888] transition-colors flex items-center gap-1">
                    Add more in Craft <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {fromCraft.map(item => (
                    <ContentCard key={item.id} item={item}
                      onApprove={() => handleApprove(item.id)}
                      onSchedule={() => handleSchedule(item.id)}
                      onView={() => {}} />
                  ))}
                </div>
              </div>
            )}

            {/* In Progress */}
            {inProgress.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-3.5 h-3.5 text-[#C9A96E]" />
                  <p className="text-xs font-medium text-[#F0EDE8]">In Progress</p>
                  <span className="text-[11px] text-[#444]">— approved and scheduled</span>
                </div>
                <div className="space-y-3">
                  {inProgress.map(item => (
                    <ContentCard key={item.id} item={item}
                      onApprove={() => {}} onSchedule={() => {}} onView={() => {}} />
                  ))}
                </div>
              </div>
            )}

            {/* Published */}
            {published.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-3.5 h-3.5 text-[#7abf8e]" />
                  <p className="text-xs font-medium text-[#F0EDE8]">Published</p>
                </div>
                <div className="space-y-3">
                  {published.map(item => (
                    <ContentCard key={item.id} item={item}
                      onApprove={() => {}} onSchedule={() => {}} onView={() => {}} />
                  ))}
                </div>
              </div>
            )}

            {/* New idea shortcut */}
            <div className="rounded-2xl border border-dashed border-white/8 p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/4 flex items-center justify-center flex-shrink-0">
                <Plus className="w-5 h-5 text-[#333]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#555]">New content idea?</p>
                <p className="text-[11px] text-[#333] mt-0.5">Hypnotic creates content in Craft. Brief the agents and they'll generate it for you.</p>
              </div>
              <button onClick={() => navigate('/craft')}
                className="flex items-center gap-2 px-4 py-2 bg-white/6 text-[#777] rounded-xl text-xs hover:bg-white/10 hover:text-[#999] transition-all ml-auto flex-shrink-0">
                Go to Craft <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: Queue / Calendar ── */}
        {tab === 'queue' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-light text-[#F0EDE8]">
                {inProgress.length} post{inProgress.length !== 1 ? 's' : ''} scheduled
              </p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCalendarView(false)}
                  className={cn('px-3 py-1.5 rounded-xl text-[11px] transition-all',
                    !calendarView ? 'bg-white/8 text-[#F0EDE8]' : 'text-[#444] hover:text-[#777]')}>
                  List
                </button>
                <button onClick={() => setCalendarView(true)}
                  className={cn('px-3 py-1.5 rounded-xl text-[11px] transition-all',
                    calendarView ? 'bg-white/8 text-[#F0EDE8]' : 'text-[#444] hover:text-[#777]')}>
                  Calendar
                </button>
              </div>
            </div>

            {calendarView ? (
              /* Calendar view */
              <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: '#0D0D10' }}>
                <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                  <p className="text-xs font-medium text-[#F0EDE8]">March 2026</p>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-[#444] hover:text-[#888] transition-colors">‹</button>
                    <button className="p-1.5 text-[#444] hover:text-[#888] transition-colors">›</button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-0">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <div key={d} className="px-2 py-2 text-center text-[10px] text-[#333] border-b border-white/4">
                      {d}
                    </div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 4; // March 2026 starts on Sunday
                    const hasPost = [16, 17, 21].includes(day);
                    return (
                      <div key={i}
                        className={cn(
                          'aspect-square p-1.5 border-r border-b border-white/4 last:border-r-0 relative',
                          day === 16 && 'bg-[#7abf8e]/5',
                          day < 1 || day > 31 && 'opacity-20'
                        )}>
                        {day > 0 && day <= 31 && (
                          <>
                            <p className={cn('text-[10px]', day === 16 ? 'text-[#7abf8e]' : 'text-[#333]')}>{day}</p>
                            {hasPost && (
                              <div className="mt-0.5 h-1 rounded-full bg-[#C9A96E]" />
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* List view */
              <div className="space-y-3">
                {inProgress.length > 0 ? inProgress.map(item => (
                  <div key={item.id}
                    className="flex items-center gap-3 p-4 rounded-2xl border border-white/6"
                    style={{ background: '#0D0D10' }}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.thumbnailBg} flex items-center justify-center flex-shrink-0`}>
                      {item.type === 'video' && <Film className="w-4 h-4 text-white/30" />}
                      {item.type === 'image' && <ImgIcon className="w-4 h-4 text-white/30" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-[#F0EDE8]">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.scheduledAt && (
                          <span className="text-[11px] text-[#C9A96E] flex items-center gap-1">
                            <Clock className="w-3 h-3" />{item.scheduledAt}
                          </span>
                        )}
                        <div className="flex gap-1">
                          {item.platforms.map(p => <PlatformIcon key={p} platformId={p} />)}
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                )) : (
                  <div className="text-center py-12 text-[#333]">
                    <Calendar className="w-8 h-8 mx-auto mb-3" />
                    <p className="text-sm">No posts scheduled yet</p>
                    <p className="text-[11px] mt-1">Approve content in the Content tab to schedule</p>
                  </div>
                )}
              </div>
            )}

            {/* Optimal timing tip */}
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-[#7abf8e]/20 bg-[#7abf8e]/5">
              <Zap className="w-4 h-4 text-[#7abf8e] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-[#7abf8e]">Distribution Strategist recommendation</p>
                <p className="text-[11px] text-[#555] mt-0.5 leading-relaxed">
                  {memory?.audience?.name
                    ? `For ${memory.audience.name} (${memory.audience.age}): best engagement windows are Tuesday–Thursday, 11am–1pm and 7–9pm IST.`
                    : 'Run Insight to get audience-specific optimal posting times.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Analytics ── */}
        {tab === 'analytics' && (
          <div className="space-y-6">
            {/* Agent answer — the three questions */}
            <div className="rounded-2xl border border-[#7abf8e]/20 p-5" style={{ background: 'rgba(122,191,142,0.04)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-[#7abf8e]" />
                <p className="text-sm font-medium text-[#7abf8e]">Distribution Strategist — this week's read</p>
              </div>
              <div className="space-y-3">
                {[
                  { q: 'What performed best?',      a: 'Behind the scenes video — 12.4K reach, 6.8% engagement. Authentic format resonates with your audience.' },
                  { q: 'What should you make more of?', a: 'Short-form video with personal narrative. Your audience responds to story, not product.' },
                  { q: 'What should you stop?',     a: 'Static product photography alone. It underperforms your video content 3:1 in engagement.' },
                ].map(({ q, a }) => (
                  <div key={q} className="flex gap-3">
                    <span className="text-[#C9A96E] text-xs flex-shrink-0 pt-0.5">→</span>
                    <div>
                      <p className="text-xs font-medium text-[#F0EDE8]">{q}</p>
                      <p className="text-[11px] text-[#555] mt-0.5 leading-relaxed">{a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <AnalyticCard label="Total reach"      value="28.4K" delta="+18% this week" color="#7aaee0" />
              <AnalyticCard label="Engagements"      value="1,847" delta="+24% this week" color="#C9A96E" />
              <AnalyticCard label="Link clicks"      value="342"   delta="+9% this week"  color="#a07ae0" />
              <AnalyticCard label="Engagement rate"  value="6.5%"  delta="+1.2pp"         color="#7abf8e" />
            </div>

            {/* Published content performance */}
            <div>
              <p className="text-xs font-medium text-[#F0EDE8] mb-3">Content performance</p>
              <div className="space-y-2">
                {published.map(item => item.performance && (
                  <div key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/6"
                    style={{ background: '#0D0D10' }}>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.thumbnailBg} flex items-center justify-center flex-shrink-0`}>
                      {item.type === 'video' && <Film className="w-3.5 h-3.5 text-white/30" />}
                      {item.type === 'image' && <ImgIcon className="w-3.5 h-3.5 text-white/30" />}
                    </div>
                    <p className="text-xs text-[#888] flex-1 truncate">{item.title}</p>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="text-[#555] flex items-center gap-1"><Eye className="w-3 h-3" />{item.performance.reach.toLocaleString()}</span>
                      <span className="text-[#7abf8e] flex items-center gap-1"><TrendingUp className="w-3 h-3" />{item.performance.engagement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Channels ── */}
        {tab === 'channels' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-light text-[#F0EDE8]">
                {connectedPlatforms.length} of {PLATFORMS.length} platforms connected
              </p>
            </div>

            <div className="space-y-2">
              {PLATFORMS.map(p => (
                <ChannelCard key={p.id} platform={p} onConnect={() => {}} />
              ))}
            </div>

            <div className="rounded-2xl border border-white/6 p-4 flex items-start gap-3" style={{ background: '#0D0D10' }}>
              <AlertCircle className="w-4 h-4 text-[#C9A96E] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-[#F0EDE8]">OAuth required for publishing</p>
                <p className="text-[11px] text-[#555] mt-0.5 leading-relaxed">
                  Connect platforms via their official OAuth flow. Hypnotic uses official APIs and never stores your credentials.
                  Tokens are encrypted and expire after the platform's standard refresh window.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
