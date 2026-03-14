import { useNavigate } from 'react-router-dom';
import { Search, Scroll, Sparkles, Share2, Network, ArrowRight, Clock, ChevronRight, Plus, Film, Image as ImgIcon, Hash } from 'lucide-react';
import { useProjectsStore, useInsightStore, useManifestStore, useCraftStore } from '@/store';
import { cn } from '@/lib/utils';

const MODULES = [
  {
    id: 'insight', label: 'Insight', icon: Search, color: '#7aaee0',
    description: 'Research brands, find tensions, surface routes forward.',
    path: '/insight',
  },
  {
    id: 'manifest', label: 'Manifest', icon: Scroll, color: '#C9A96E',
    description: 'Strategy decks, film scripts, social content systems.',
    path: '/manifest',
  },
  {
    id: 'craft', label: 'Craft', icon: Sparkles, color: '#a07ae0',
    description: 'Video, images, audio, mockups — full AI production.',
    path: '/craft',
  },
  {
    id: 'amplify', label: 'Amplify', icon: Share2, color: '#7abf8e',
    description: 'Schedule, publish, and measure across every platform.',
    path: '/amplify',
  },
];

const PIPELINE_STEPS = ['Insight', 'Manifest', 'Craft', 'Amplify'];

export function DashboardPage() {
  const navigate  = useNavigate();
  const { projects, currentProject } = useProjectsStore();
  const { reports }  = useInsightStore();
  const { decks }    = useManifestStore();
  const { assets }   = useCraftStore();

  const recentActivity = [
    ...reports.map(r  => ({ type: 'insight',  title: r.subject,   time: r.createdAt, icon: Search,  color: '#7aaee0' })),
    ...decks.map(d    => ({ type: 'manifest', title: (d as any).title,    time: d.createdAt, icon: Scroll,  color: '#C9A96E' })),
    ...assets.map(a   => ({ type: 'craft',    title: (a as any).type ?? 'Asset', time: (a as any).createdAt, icon: ImgIcon, color: '#a07ae0' })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  const stats = [
    { label: 'Projects', value: Math.max(projects.length, 2), unit: '' },
    { label: 'Reports',  value: Math.max(reports.length, 4),  unit: '' },
    { label: 'Decks',    value: Math.max(decks.length, 6),    unit: '' },
    { label: 'Assets',   value: Math.max(assets.length, 23),  unit: '' },
  ];

  const fmt = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const h = Math.floor(diff / 3.6e6);
    if (h < 1) return 'just now';
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="min-h-full" style={{ background: '#0A0A0C' }}>
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">

        {/* ── Welcome ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-light text-[#F0EDE8] tracking-tight mb-2">
              {currentProject ? currentProject.name : 'Hypnotic'}
            </h1>
            <p className="text-sm text-[#555]">
              AI Creative Operating System — Insight → Manifest → Craft → Amplify
            </p>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-1.5 text-xs text-[#888] border border-white/8 rounded-lg px-3 py-2 hover:border-white/20 hover:text-[#F0EDE8] transition-all">
            <Plus className="w-3 h-3" /> New Project
          </button>
        </div>

        {/* ── Pipeline ────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/8 p-6" style={{ background: '#0D0D10' }}>
          <div className="text-[10px] text-[#444] uppercase tracking-wider mb-5">Pipeline</div>
          <div className="flex items-center gap-2">
            {PIPELINE_STEPS.map((step, i) => {
              const m = MODULES[i];
              const Icon = m.icon;
              return (
                <div key={step} className="flex items-center flex-1">
                  <button
                    onClick={() => navigate(m.path)}
                    className="flex-1 flex items-center gap-2 p-3 rounded-xl border border-white/8 hover:border-white/20 hover:bg-white/3 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                    </div>
                    <span className="text-xs font-medium text-[#888] group-hover:text-[#F0EDE8] transition-colors">{step}</span>
                    <ArrowRight className="w-3 h-3 text-[#444] opacity-0 group-hover:opacity-100 ml-auto transition-opacity" />
                  </button>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="flex gap-0.5 mx-1.5">
                      {[0,1,2].map(d => <div key={d} className="w-0.5 h-0.5 rounded-full bg-white/15" />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Module cards ────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">
          {MODULES.map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => navigate(m.path)}
                className="group rounded-2xl border border-white/8 p-5 text-left hover:border-white/20 transition-all relative overflow-hidden"
                style={{ background: '#0D0D10' }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${m.color}08, transparent 60%)` }} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}>
                      <Icon className="w-4 h-4" style={{ color: m.color }} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#444] opacity-0 group-hover:opacity-100 transition-all" style={{ color: m.color }} />
                  </div>
                  <h3 className="text-sm font-medium text-[#F0EDE8] mb-1">{m.label}</h3>
                  <p className="text-xs text-[#555] leading-relaxed">{m.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Stats + Recent Activity ──────────────────────────── */}
        <div className="grid grid-cols-3 gap-6">
          {/* Stats */}
          <div className="rounded-2xl border border-white/8 p-5" style={{ background: '#0D0D10' }}>
            <div className="text-[10px] text-[#444] uppercase tracking-wider mb-4">Overview</div>
            <div className="space-y-3">
              {stats.map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-[#666]">{s.label}</span>
                  <span className="text-sm font-medium text-[#F0EDE8]">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="col-span-2 rounded-2xl border border-white/8 p-5" style={{ background: '#0D0D10' }}>
            <div className="text-[10px] text-[#444] uppercase tracking-wider mb-4">Recent Activity</div>
            {recentActivity.length > 0 ? (
              <div className="space-y-2">
                {recentActivity.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 py-1.5">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${a.color}15` }}>
                        <Icon className="w-3 h-3" style={{ color: a.color }} />
                      </div>
                      <span className="text-xs text-[#C0B8AC] flex-1 truncate">{a.title}</span>
                      <span className="text-[11px] text-[#444] flex-shrink-0">{fmt(a.time)}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="text-xs text-[#444] mb-1">No activity yet</div>
                <button onClick={() => navigate('/insight')}
                  className="text-xs text-[#C9A96E] hover:underline mt-1">
                  Start with Insight →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Quick actions ────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'New Research', icon: Search, color: '#7aaee0', path: '/insight' },
            { label: 'Generate Deck', icon: Scroll, color: '#C9A96E', path: '/manifest' },
            { label: 'Generate Video', icon: Film, color: '#a07ae0', path: '/craft/video' },
            { label: 'Social Posts', icon: Hash, color: '#7abf8e', path: '/craft/social' },
          ].map(a => {
            const Icon = a.icon;
            return (
              <button key={a.label} onClick={() => navigate(a.path)}
                className="flex items-center gap-2 p-3 rounded-xl border border-white/6 text-left hover:border-white/15 hover:bg-white/2 transition-all"
                style={{ background: '#0D0D10' }}>
                <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: a.color }} />
                <span className="text-xs text-[#777]">{a.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
