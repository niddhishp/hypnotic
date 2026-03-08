import { useState } from 'react';
import { Search, Star, Clock, CheckCircle, Filter, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// ─── Types ────────────────────────────────────────────────────────────────────
type ExpertModule = 'insight' | 'manifest' | 'craft' | 'amplify';
type ExpertSkill =
  | 'brand_strategy' | 'market_research' | 'audience_strategy'
  | 'creative_direction' | 'copywriting' | 'screenwriting'
  | 'art_direction' | 'video_editing' | 'motion_design'
  | 'media_planning' | 'performance_marketing';

interface Expert {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarInitials: string;
  avatarColor: string;
  skills: ExpertSkill[];
  modules: ExpertModule[];
  rating: number;
  reviewCount: number;
  responseTimeHours: number;
  minBudget: number;
  isAvailable: boolean;
}

// ─── Static expert data (no real agency attribution) ─────────────────────────
const EXPERTS: Expert[] = [
  {
    id: 'e1',
    name: 'Maya Chen',
    title: 'Brand Strategist',
    bio: '12 years in consumer brand strategy. Specialises in challenger brand positioning and cultural relevance.',
    avatarInitials: 'MC',
    avatarColor: '#3B82F6',
    skills: ['brand_strategy', 'audience_strategy', 'market_research'],
    modules: ['insight', 'manifest'],
    rating: 4.9, reviewCount: 84, responseTimeHours: 4, minBudget: 250,
    isAvailable: true,
  },
  {
    id: 'e2',
    name: 'James Okafor',
    title: 'Creative Director & Copywriter',
    bio: 'Award-winning creative with experience in film, social, and integrated campaigns across FMCG and tech.',
    avatarInitials: 'JO',
    avatarColor: '#22C55E',
    skills: ['creative_direction', 'copywriting', 'screenwriting'],
    modules: ['manifest', 'craft'],
    rating: 4.8, reviewCount: 61, responseTimeHours: 8, minBudget: 350,
    isAvailable: true,
  },
  {
    id: 'e3',
    name: 'Priya Nair',
    title: 'Motion Designer',
    bio: 'Specialises in high-concept motion and visual identity work for digital-first brands.',
    avatarInitials: 'PN',
    avatarColor: '#A855F7',
    skills: ['art_direction', 'motion_design', 'video_editing'],
    modules: ['craft'],
    rating: 4.9, reviewCount: 42, responseTimeHours: 6, minBudget: 200,
    isAvailable: false,
  },
  {
    id: 'e4',
    name: 'Daniel Wu',
    title: 'Performance Marketing Strategist',
    bio: 'Growth marketer with deep expertise in paid social, SEO, and multi-channel campaign analytics.',
    avatarInitials: 'DW',
    avatarColor: '#EF4444',
    skills: ['media_planning', 'performance_marketing'],
    modules: ['amplify'],
    rating: 4.7, reviewCount: 99, responseTimeHours: 2, minBudget: 180,
    isAvailable: true,
  },
  {
    id: 'e5',
    name: 'Sophie Laurent',
    title: 'Cultural Strategist',
    bio: 'Works at the intersection of semiotics, cultural theory, and brand meaning-making.',
    avatarInitials: 'SL',
    avatarColor: '#F59E0B',
    skills: ['brand_strategy', 'audience_strategy'],
    modules: ['insight'],
    rating: 5.0, reviewCount: 28, responseTimeHours: 12, minBudget: 400,
    isAvailable: true,
  },
  {
    id: 'e6',
    name: 'Ravi Sharma',
    title: 'Screenwriter & Director',
    bio: 'Narrative specialist with credits in branded content, documentary, and commercial film.',
    avatarInitials: 'RS',
    avatarColor: '#06B6D4',
    skills: ['screenwriting', 'creative_direction'],
    modules: ['manifest', 'craft'],
    rating: 4.8, reviewCount: 37, responseTimeHours: 24, minBudget: 500,
    isAvailable: true,
  },
];

const MODULE_FILTERS: { id: ExpertModule | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'insight', label: 'Insight' },
  { id: 'manifest', label: 'Manifest' },
  { id: 'craft', label: 'Craft' },
  { id: 'amplify', label: 'Amplify' },
];

const SKILL_LABELS: Record<ExpertSkill, string> = {
  brand_strategy: 'Brand Strategy',
  market_research: 'Market Research',
  audience_strategy: 'Audience Strategy',
  creative_direction: 'Creative Direction',
  copywriting: 'Copywriting',
  screenwriting: 'Screenwriting',
  art_direction: 'Art Direction',
  video_editing: 'Video Editing',
  motion_design: 'Motion Design',
  media_planning: 'Media Planning',
  performance_marketing: 'Performance Marketing',
};

const MODULE_STYLES: Record<ExpertModule, { text: string; bg: string }> = {
  insight:  { text: 'text-blue-400',   bg: 'bg-blue-500/10'   },
  manifest: { text: 'text-green-400',  bg: 'bg-green-500/10'  },
  craft:    { text: 'text-purple-400', bg: 'bg-purple-500/10' },
  amplify:  { text: 'text-red-400',    bg: 'bg-red-500/10'    },
};

// ─── Expert card ──────────────────────────────────────────────────────────────
function ExpertCard({ expert }: { expert: Expert }) {
  const [hired, setHired] = useState(false);

  return (
    <Card className="bg-[#0F0F11] border-white/5 hover:border-white/10 transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
            style={{ background: `${expert.avatarColor}33`, border: `1px solid ${expert.avatarColor}66` }}
          >
            <span style={{ color: expert.avatarColor }}>{expert.avatarInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-semibold text-[#F6F6F6] truncate">{expert.name}</h3>
              {expert.isAvailable ? (
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500" title="Available" />
              ) : (
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#666]" title="Unavailable" />
              )}
            </div>
            <p className="text-xs text-[#A7A7A7]">{expert.title}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-3.5 h-3.5 text-[#D8A34A] fill-[#D8A34A]" />
            <span className="text-xs font-medium text-[#F6F6F6]">{expert.rating.toFixed(1)}</span>
            <span className="text-xs text-[#666]">({expert.reviewCount})</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-[#A7A7A7] leading-relaxed mb-4 line-clamp-2">{expert.bio}</p>

        {/* Module chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {expert.modules.map((m) => (
            <span key={m} className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${MODULE_STYLES[m].text} ${MODULE_STYLES[m].bg}`}>
              {m}
            </span>
          ))}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {expert.skills.slice(0, 3).map((s) => (
            <Badge key={s} variant="secondary" className="text-[10px] bg-white/5 text-[#A7A7A7] border-0">
              {SKILL_LABELS[s]}
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#666]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {expert.responseTimeHours}h response
            </span>
            <span>From ${expert.minBudget}</span>
          </div>
          <Button
            size="sm"
            disabled={!expert.isAvailable || hired}
            onClick={() => setHired(true)}
            className={hired
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/20 cursor-default'
              : 'bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]'}
          >
            {hired ? <><CheckCircle className="w-3.5 h-3.5 mr-1.5" />Requested</> : '+ Hire'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState<ExpertModule | 'all'>('all');

  const filtered = EXPERTS.filter((e) => {
    const matchesModule = moduleFilter === 'all' || e.modules.includes(moduleFilter);
    const q = search.toLowerCase();
    const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.title.toLowerCase().includes(q)
      || e.skills.some((s) => SKILL_LABELS[s].toLowerCase().includes(q));
    return matchesModule && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D8A34A]/10 rounded-full mb-3">
          <Users className="w-4 h-4 text-[#D8A34A]" />
          <span className="text-xs font-medium text-[#D8A34A] uppercase tracking-wider">+Human</span>
        </div>
        <h1 className="text-2xl font-semibold text-[#F6F6F6] mb-2">Human Enhancement</h1>
        <p className="text-sm text-[#A7A7A7] max-w-lg">
          Layer world-class human expertise on top of your AI output. Matched to your current module and task.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experts, skills, specialisms…"
            className="pl-10 bg-white/5 border-white/10 text-[#F6F6F6] placeholder:text-[#666] focus:border-[#D8A34A]/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#666]" />
          <div className="flex gap-1">
            {MODULE_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setModuleFilter(f.id as typeof moduleFilter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  moduleFilter === f.id
                    ? 'bg-[#D8A34A] text-[#0B0B0D]'
                    : 'bg-white/5 text-[#A7A7A7] hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-2 text-sm text-[#666]">
        <Sparkles className="w-4 h-4 text-[#D8A34A]" />
        <span>
          <span className="text-[#F6F6F6] font-medium">{filtered.length}</span> experts available
          {moduleFilter !== 'all' && ` in ${moduleFilter}`}
        </span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-[#666]" />
          </div>
          <p className="text-[#A7A7A7] text-sm mb-1">No experts match your search</p>
          <p className="text-[#666] text-xs">Try broadening your filters</p>
        </div>
      )}
    </div>
  );
}
