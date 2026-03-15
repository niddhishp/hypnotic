import { useState } from 'react';
import { Search, Star, Clock, CheckCircle, Filter, Users, Sparkles, MessageSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/shared/SEO';

type Module = 'all' | 'insight' | 'manifest' | 'craft' | 'amplify';

const MODULE_COLORS: Record<string, string> = {
  insight: '#7aaee0', manifest: '#C9A96E', craft: '#a07ae0', amplify: '#7abf8e',
};

const EXPERTS = [
  {
    id: 'e1', name: 'Maya Chen', title: 'Brand Strategist',
    bio: '12 years in consumer brand strategy. Specialises in challenger brand positioning and cultural relevance frameworks.',
    initials: 'MC', color: '#7aaee0',
    skills: ['Brand Strategy', 'Audience Research', 'Market Positioning'],
    modules: ['insight', 'manifest'],
    rating: 4.9, reviews: 84, responseHours: 4, minBudget: 250, available: true,
  },
  {
    id: 'e2', name: 'James Okafor', title: 'Creative Director',
    bio: 'Award-winning creative with 15 years across film, social, and integrated campaigns. FMCG, tech, luxury.',
    initials: 'JO', color: '#C9A96E',
    skills: ['Creative Direction', 'Copywriting', 'Screenwriting'],
    modules: ['manifest', 'craft'],
    rating: 4.8, reviews: 61, responseHours: 8, minBudget: 350, available: true,
  },
  {
    id: 'e3', name: 'Priya Nair', title: 'Performance Marketing Lead',
    bio: 'Ex-Meta, ex-Google. Built and scaled performance teams across D2C brands and enterprise. $50M+ in managed spend.',
    initials: 'PN', color: '#7abf8e',
    skills: ['Media Planning', 'Performance Marketing', 'Analytics Strategy'],
    modules: ['amplify'],
    rating: 4.9, reviews: 112, responseHours: 2, minBudget: 400, available: true,
  },
  {
    id: 'e4', name: 'Tom Andreessen', title: 'Motion Designer & Art Director',
    bio: 'Motion design and art direction for digital campaigns. Former Wieden+Kennedy. Specialises in brand world-building.',
    initials: 'TA', color: '#a07ae0',
    skills: ['Art Direction', 'Motion Design', 'Video Editing'],
    modules: ['craft'],
    rating: 4.7, reviews: 43, responseHours: 12, minBudget: 300, available: false,
  },
  {
    id: 'e5', name: 'Sara Kim', title: 'Cultural Strategist',
    bio: 'Cultural insight and trend analysis for campaigns. Worked with Nike, Apple, and emerging fashion brands.',
    initials: 'SK', color: '#e0a87a',
    skills: ['Cultural Strategy', 'Trend Analysis', 'Social Strategy'],
    modules: ['insight', 'manifest'],
    rating: 4.8, reviews: 57, responseHours: 6, minBudget: 280, available: true,
  },
  {
    id: 'e6', name: 'Luca Ferrari', title: 'Screenwriter & Script Editor',
    bio: 'Commercial and branded content screenwriter. Cannes Lions winner. Specialises in emotional storytelling for brands.',
    initials: 'LF', color: '#7aaee0',
    skills: ['Screenwriting', 'Brand Narrative', 'Storyboarding'],
    modules: ['manifest', 'craft'],
    rating: 4.9, reviews: 38, responseHours: 24, minBudget: 500, available: true,
  },
];

interface HireModalProps {
  expert: typeof EXPERTS[0];
  onClose: () => void;
}

function HireModal({ expert, onClose }: HireModalProps) {
  const [step, setStep] = useState<'brief' | 'confirm'>('brief');
  const [task, setTask] = useState('');
  const [budget, setBudget] = useState(expert.minBudget.toString());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <SEO title="+Human — Expert Marketplace" noIndex />
      <div className="w-[460px] rounded-2xl border border-white/10 overflow-hidden" style={{ background: '#0D0D10' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
              style={{ background: `${expert.color}20`, color: expert.color }}>
              {expert.initials}
            </div>
            <div>
              <div className="text-sm font-medium text-[#F0EDE8]">Hire {expert.name}</div>
              <div className="text-[11px] text-[#555]">{expert.title}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-[#888] text-xl leading-none">×</button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Task Description</label>
            <textarea value={task} onChange={e => setTask(e.target.value)}
              placeholder="Describe what you need the expert to produce, review, or enhance…"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none" />
          </div>
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Budget (credits)</label>
            <input type="number" value={budget} onChange={e => setBudget(e.target.value)} min={expert.minBudget}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E]/40" />
            <div className="text-[11px] text-[#444] mt-1">Minimum: {expert.minBudget} credits · Avg response: {expert.responseHours}h</div>
          </div>
          <button
            onClick={() => { if (task.trim()) onClose(); }}
            disabled={!task.trim()}
            className="w-full bg-[#C9A96E] text-[#08080A] rounded-xl py-3 text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity">
            Send Hire Request
          </button>
        </div>
      </div>
    </div>
  );
}

export function MarketplacePage() {
  const [activeModule, setActiveModule] = useState<Module>('all');
  const [searchQuery, setSearchQuery]   = useState('');
  const [hiringExpert, setHiringExpert] = useState<typeof EXPERTS[0] | null>(null);

  const filtered = EXPERTS.filter(e => {
    const matchesModule = activeModule === 'all' || e.modules.includes(activeModule);
    const matchesSearch = !searchQuery || [e.name, e.title, ...e.skills].some(s =>
      s.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesModule && matchesSearch;
  });

  return (
    <div style={{ background: '#0A0A0C' }} className="min-h-full">
      {hiringExpert && <HireModal expert={hiringExpert} onClose={() => setHiringExpert(null)} />}

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#C9A96E]/15 flex items-center justify-center">
              <Users className="w-3 h-3 text-[#C9A96E]" />
            </div>
            <span className="text-[11px] text-[#C9A96E] uppercase tracking-[0.15em] font-medium">+Human</span>
          </div>
          <h1 className="text-3xl font-light text-[#F0EDE8] tracking-tight">Expert Enhancement</h1>
          <p className="text-sm text-[#555] max-w-lg leading-relaxed">
            At any point in your pipeline, bring in a verified specialist to review, elevate, or expand what the AI has built.
          </p>
        </div>

        {/* ── Filters ──────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444]" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search experts or skills…"
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40" />
          </div>

          {/* Module filter */}
          <div className="flex items-center gap-1.5">
            {(['all', 'insight', 'manifest', 'craft', 'amplify'] as Module[]).map(m => (
              <button key={m} onClick={() => setActiveModule(m)}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize',
                  activeModule === m
                    ? 'text-[#08080A]'
                    : 'text-[#555] border border-white/8 hover:border-white/20 hover:text-[#888]'
                )}
                style={activeModule === m ? {
                  background: m === 'all' ? '#C9A96E' : MODULE_COLORS[m],
                  color: '#08080A',
                } : {}}>
                {m === 'all' ? 'All Experts' : m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Expert grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(expert => (
            <div key={expert.id}
              className="rounded-2xl border border-white/6 overflow-hidden hover:border-white/15 transition-all group"
              style={{ background: '#0D0D10' }}>
              {/* Expert header */}
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0"
                      style={{ background: `${expert.color}18`, color: expert.color, border: `1px solid ${expert.color}25` }}>
                      {expert.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#F0EDE8]">{expert.name}</div>
                      <div className="text-[11px] text-[#555]">{expert.title}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className={cn('w-1.5 h-1.5 rounded-full', expert.available ? 'bg-[#7abf8e]' : 'bg-[#555]')} />
                    <span className="text-[11px] text-[#444]">{expert.available ? 'Available' : 'Busy'}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#666] leading-relaxed mb-3 line-clamp-2">{expert.bio}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {expert.skills.map(s => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-[#666]">{s}</span>
                  ))}
                </div>

                {/* Module badges */}
                <div className="flex flex-wrap gap-1">
                  {expert.modules.map(m => (
                    <span key={m} className="text-[11px] px-1.5 py-0.5 rounded-md font-medium"
                      style={{ background: `${MODULE_COLORS[m]}15`, color: MODULE_COLORS[m] }}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats + actions */}
              <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[11px] text-[#555]">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#C9A96E]" fill="#C9A96E" />
                    {expert.rating} ({expert.reviews})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ~{expert.responseHours}h
                  </span>
                  <span>from {expert.minBudget} credits</span>
                </div>
                <button
                  onClick={() => expert.available && setHiringExpert(expert)}
                  disabled={!expert.available}
                  className={cn(
                    'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-medium transition-all',
                    expert.available
                      ? 'bg-[#C9A96E] text-[#08080A] hover:opacity-90'
                      : 'bg-white/5 text-[#444] cursor-not-allowed'
                  )}>
                  <Plus className="w-3 h-3" /> Hire
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/8 rounded-2xl">
            <Users className="w-8 h-8 text-[#333] mx-auto mb-3" />
            <div className="text-sm text-[#555]">No experts match your filters</div>
          </div>
        )}

      </div>
    </div>
  );
}
