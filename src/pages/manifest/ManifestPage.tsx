// src/pages/manifest/ManifestPage.tsx
// The Planner → Creative Director → Craft Queue
//
// Phase 1: STRATEGY — reads Brand Memory from Insight, generates a content plan
//   Shows ALL recommended outputs across every format, prioritised by strategic logic
// Phase 2: SELECT — user picks which outputs they want (add more via chat)
// Phase 3: BRIEF — Creative Director writes brief + script/prompts for each selected item
// Phase 4: CRAFT QUEUE — everything pre-populated and ready to execute in Craft

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Film, Image as ImgIcon, FileText, Music, Users, Zap, Send,
  Check, ChevronRight, Loader2, AlertCircle, ArrowRight, Brain,
  Sparkles, Plus, X, Play, Camera, Layers, Package, Calendar,
  BarChart3, Mic, Monitor, Target, Star, MessageSquare, RefreshCw,
  Clock, CreditCard, Newspaper, Mail, Video,
} from 'lucide-react';
import { useProjectsStore } from '@/store';
import { useBrandMemoryStore } from '@/store/brand-memory.store';
import {
  generateContentPlan,
  writeCreativeBrief,
  buildCraftPayload,
  FORMAT_META,
} from '@/lib/ai/agents/manifest-planner';
import type { ContentPlan, ContentRecommendation } from '@/lib/ai/agents/manifest-planner';
import { SEO } from '@/components/shared/SEO';
import { cn } from '@/lib/utils';
import { useInsightStore } from '@/store';

// ── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Film, Play, Zap, Star, Target, Image: ImgIcon, Layers, Package,
  FileText, Calendar, BarChart3, Clipboard: FileText, Newspaper, Mail,
  Music, Mic, Users, Monitor, Camera, TrendingUp: BarChart3,
  Megaphone: AlertCircle, Video,
};

function OutputIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = ICON_MAP[icon] ?? Sparkles;
  return <Icon className={className ?? 'w-4 h-4'} />;
}

// ── Priority label ────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  must_do:       { label: 'Must Do',        color: '#C9A96E', bg: '#C9A96E15' },
  should_do:     { label: 'Should Do',      color: '#7aaee0', bg: '#7aaee015' },
  nice_to_have:  { label: 'Nice to Have',   color: '#7abf8e', bg: '#7abf8e15' },
};

const URGENCY_CONFIG = {
  immediate:  { label: 'Today',       color: '#e07a7a' },
  this_week:  { label: 'This week',   color: '#C9A96E' },
  this_month: { label: 'This month',  color: '#7abf8e' },
};

// ── Recommendation card ───────────────────────────────────────────────────────

function RecommendationCard({
  rec, selected, onToggle, onBrief, briefing,
}: {
  rec: ContentRecommendation;
  selected: boolean;
  onToggle: () => void;
  onBrief: () => void;
  briefing: boolean;
}) {
  const meta     = FORMAT_META[rec.format];
  const priority = PRIORITY_CONFIG[rec.priority];
  const urgency  = URGENCY_CONFIG[rec.urgency];
  const [open, setOpen] = useState(false);

  const routeColors: Record<string, string> = {
    video:    '#C9A96E', image: '#7aaee0', audio: '#a07ae0',
    document: '#7abf8e', avatar: '#e07aa0', social: '#e0a07a',
  };
  const routeColor = routeColors[meta.craftRoute] ?? '#888';

  return (
    <div className={cn(
      'rounded-2xl border transition-all overflow-hidden',
      selected ? 'border-[#C9A96E]/30' : 'border-white/6 hover:border-white/12'
    )} style={{ background: selected ? 'rgba(201,169,110,0.04)' : '#0D0D10' }}>

      {/* Top row */}
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <button onClick={onToggle}
          className={cn('mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all',
            selected ? 'bg-[#C9A96E] border-[#C9A96E]' : 'border-white/20 hover:border-white/40'
          )}>
          {selected && <Check className="w-3 h-3 text-[#08080A]" />}
        </button>

        {/* Icon */}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${routeColor}15` }}>
          <OutputIcon icon={meta.icon} className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-medium text-[#F0EDE8]">{rec.title}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ color: priority.color, background: priority.bg }}>{priority.label}</span>
          </div>
          <p className="text-[11px] text-[#555] leading-relaxed">{rec.rationale}</p>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/8 text-[#444] capitalize">
              {meta.craftRoute}
            </span>
            <span className="flex items-center gap-1 text-[10px]" style={{ color: urgency.color }}>
              <Clock className="w-3 h-3" />{urgency.label}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[#444]">
              <CreditCard className="w-3 h-3" />{meta.creditCost} credits
            </span>
            <span className="text-[10px] text-[#333]">{meta.timeToComplete}</span>
          </div>
        </div>

        {/* Expand */}
        <button onClick={() => setOpen(o => !o)} className="text-[#444] hover:text-[#888] transition-colors mt-1">
          {open ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded: rationale + brief CTA */}
      {open && (
        <div className="px-4 pb-4 border-t border-white/4 pt-3 space-y-3">
          <div>
            <p className="text-[11px] text-[#444] uppercase tracking-wider mb-1">Objective</p>
            <p className="text-xs text-[#888]">{rec.objective}</p>
          </div>
          <div>
            <p className="text-[11px] text-[#444] uppercase tracking-wider mb-1">Insight backing</p>
            <p className="text-xs text-[#666] italic">"{rec.insightBacking}"</p>
          </div>

          {rec.creativeBrief ? (
            <div className="rounded-xl border border-[#7abf8e]/20 p-3 bg-[#7abf8e]/5">
              <p className="text-[11px] text-[#7abf8e] font-medium mb-2">Creative Brief Written</p>
              <p className="text-xs font-medium text-[#F0EDE8] mb-1">"{rec.creativeBrief.headline}"</p>
              <p className="text-[11px] text-[#555]">{rec.creativeBrief.direction}</p>
            </div>
          ) : selected ? (
            <button onClick={onBrief} disabled={briefing}
              className="flex items-center gap-2 px-3 py-2 bg-[#C9A96E] text-[#08080A] rounded-xl text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-all">
              {briefing
                ? <><Loader2 className="w-3 h-3 animate-spin" />Writing brief…</>
                : <><Sparkles className="w-3 h-3" />Write creative brief</>}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ── Craft queue item ──────────────────────────────────────────────────────────

function CraftQueueItem({ rec, onExecute }: { rec: ContentRecommendation; onExecute: () => void }) {
  const meta = FORMAT_META[rec.format];
  const routeColors: Record<string, string> = {
    video: '#C9A96E', image: '#7aaee0', audio: '#a07ae0',
    document: '#7abf8e', avatar: '#e07aa0', social: '#e0a07a',
  };
  const color = routeColors[meta.craftRoute] ?? '#888';

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-white/6 hover:border-white/12 transition-all"
      style={{ background: '#0D0D10' }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15` }}>
        <OutputIcon icon={meta.icon} className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[#F0EDE8] truncate">{rec.title}</p>
        {rec.creativeBrief && (
          <p className="text-[10px] text-[#555] truncate">"{rec.creativeBrief.headline}"</p>
        )}
      </div>
      <span className={cn('text-[10px] px-2 py-1 rounded-full border capitalize',
        rec.craftPayload ? 'border-[#7abf8e]/30 text-[#7abf8e] bg-[#7abf8e]/8' : 'border-white/8 text-[#444]'
      )}>
        {rec.craftPayload ? 'Ready' : 'Pending brief'}
      </span>
      {rec.craftPayload && (
        <button onClick={onExecute}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#C9A96E] text-[#08080A] rounded-lg text-[11px] font-medium hover:opacity-90 transition-all">
          Execute <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type Phase = 'strategy' | 'select' | 'brief' | 'queue';

export function ManifestPage() {
  const navigate = useNavigate();
  const { currentProject } = useProjectsStore();
  const brandMemory = useBrandMemoryStore();
  const { reports } = useInsightStore();

  const [phase, setPhase]               = useState<Phase>('strategy');
  const [plan, setPlan]                 = useState<ContentPlan | null>(null);
  const [selected, setSelected]         = useState<Set<string>>(new Set());
  const [briefingId, setBriefingId]     = useState<string | null>(null);
  const [recs, setRecs]                 = useState<ContentRecommendation[]>([]);
  const [generating, setGenerating]     = useState(false);
  const [errorMsg, setErrorMsg]         = useState('');

  // Chat
  const [chatInput, setChatInput]       = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'director'; text: string }[]>([]);

  const memory = currentProject ? brandMemory.getMemory(currentProject.id) : null;
  const hasInsight = memory && (memory.completeness ?? 0) >= 25;

  // Generate content plan
  const handleGeneratePlan = () => {
    if (!currentProject) { setErrorMsg('Select a project first.'); return; }
    if (!hasInsight) { setErrorMsg('Run Insight first to generate a research-backed plan.'); return; }

    try {
      const contentPlan = generateContentPlan(currentProject.id);
      setPlan(contentPlan);
      setRecs(contentPlan.recommendations);
      setPhase('select');
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Could not generate plan.');
    }
  };

  const handleToggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBrief = async (rec: ContentRecommendation) => {
    if (!currentProject) return;
    setBriefingId(rec.id);
    try {
      const brief   = await writeCreativeBrief(rec, currentProject.id);
      const payload = buildCraftPayload(rec, brief);
      setRecs(prev => prev.map(r => r.id === rec.id
        ? { ...r, creativeBrief: brief, craftPayload: payload, status: 'briefed' }
        : r
      ));
    } finally {
      setBriefingId(null);
    }
  };

  const handleBriefAll = async () => {
    if (!currentProject) return;
    setGenerating(true);
    const tooBrief = recs.filter(r => selected.has(r.id) && !r.creativeBrief);
    for (const rec of tooBrief) {
      setBriefingId(rec.id);
      await handleBrief(rec);
    }
    setBriefingId(null);
    setGenerating(false);
    setPhase('queue');
  };

  const handleExecute = (rec: ContentRecommendation) => {
    const payload = rec.craftPayload;
    if (!payload) return;

    const meta = FORMAT_META[rec.format];
    // Navigate to craft page with payload in state
    navigate(`/craft/${meta.craftRoute}`, {
      state: { craftPayload: payload, fromManifest: true, title: rec.title },
    });
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', text: chatInput }]);
    const input = chatInput;
    setChatInput('');

    // Simulate Creative Director response
    setTimeout(() => {
      const response = input.toLowerCase().includes('add')
        ? `I'll add that to the plan. Based on your brief, I recommend a ${input.includes('tiktok') ? 'TikTok-native series' : 'new output variant'} — want me to write the creative brief for it now?`
        : input.toLowerCase().includes('remove') || input.toLowerCase().includes('delete')
        ? "Removed from the plan. Anything else you'd like to adjust?"
        : `Good instinct. ${memory?.brief?.bigIdea ? `Given the '${memory.brief.bigIdea}' direction, ` : ''}I'd suggest ${input.trim()}. Want me to add this to the queue and write the brief?`;
      setChatMessages(prev => [...prev, { role: 'director', text: response }]);
    }, 600);
  };

  const selectedRecs   = recs.filter(r => selected.has(r.id));
  const briefedRecs    = selectedRecs.filter(r => r.craftPayload);
  const allBriefed     = selectedRecs.length > 0 && briefedRecs.length === selectedRecs.length;

  return (
    <div className="min-h-full" style={{ background: '#0A0A0C' }}>
      <SEO title="Manifest" noIndex />

      <div className="flex h-[calc(100vh-64px)]">

        {/* ── Main content ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#C9A96E]/15 text-[#C9A96E] uppercase tracking-wider">Manifest</span>
                {/* Phase indicator */}
                <div className="flex items-center gap-1">
                  {(['strategy', 'select', 'brief', 'queue'] as Phase[]).map((p, i) => (
                    <div key={p} className="flex items-center gap-1">
                      <button onClick={() => plan && setPhase(p)}
                        className={cn('text-[11px] px-2 py-0.5 rounded-lg transition-all',
                          phase === p ? 'text-[#C9A96E]' : 'text-[#333] hover:text-[#555]'
                        )}>
                        {p === 'strategy' ? 'Plan' : p === 'select' ? 'Select' : p === 'brief' ? 'Brief' : 'Execute'}
                      </button>
                      {i < 3 && <ChevronRight className="w-3 h-3 text-[#222]" />}
                    </div>
                  ))}
                </div>
              </div>

              {phase === 'strategy' && (
                <>
                  <h1 className="text-2xl font-light text-[#F0EDE8]">Build the content plan</h1>
                  <p className="text-sm text-[#555] mt-1 max-w-lg leading-relaxed">
                    The Planner reads your Insight research and recommends the exact outputs your brand should create — across every format. Then the Creative Director writes the briefs.
                  </p>
                </>
              )}
              {phase === 'select' && (
                <>
                  <h1 className="text-2xl font-light text-[#F0EDE8]">Select what to make</h1>
                  <p className="text-sm text-[#555] mt-1">
                    {recs.length} outputs recommended. Select the ones you want to execute. Use the chat to add, remove, or modify.
                  </p>
                </>
              )}
              {phase === 'brief' && (
                <>
                  <h1 className="text-2xl font-light text-[#F0EDE8]">Creative direction</h1>
                  <p className="text-sm text-[#555] mt-1">
                    The Creative Director writes scripts, design prompts, and briefs for each selected output. Everything then pre-populates in Craft.
                  </p>
                </>
              )}
              {phase === 'queue' && (
                <>
                  <h1 className="text-2xl font-light text-[#F0EDE8]">Ready to execute</h1>
                  <p className="text-sm text-[#555] mt-1">
                    Every output is briefed and pre-populated in Craft. Select an output to start generating.
                  </p>
                </>
              )}
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{errorMsg}
              </div>
            )}

            {/* ── Phase: Strategy ──────────────────────────────────────── */}
            {phase === 'strategy' && (
              <div className="space-y-6">
                {hasInsight ? (
                  <>
                    {/* Brand Memory summary */}
                    <div className="rounded-2xl border border-[#C9A96E]/20 p-5" style={{ background: 'rgba(201,169,110,0.04)' }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-4 h-4 text-[#C9A96E]" />
                        <span className="text-sm font-medium text-[#C9A96E]">Insight brief loaded</span>
                        <span className="text-[11px] text-[#444] ml-auto">{memory!.completeness}% complete</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        {memory!.persona && (
                          <div>
                            <p className="text-[10px] text-[#555] mb-1">Archetype</p>
                            <p className="text-[#C9A96E] font-medium">{memory!.persona.archetype}</p>
                          </div>
                        )}
                        {memory!.audience && (
                          <div>
                            <p className="text-[10px] text-[#555] mb-1">Audience</p>
                            <p className="text-[#C0B8AC]">{memory!.audience.name}</p>
                          </div>
                        )}
                        {memory!.brief?.bigIdea && (
                          <div>
                            <p className="text-[10px] text-[#555] mb-1">Big Idea</p>
                            <p className="text-[#C0B8AC] line-clamp-2">{memory!.brief.bigIdea}</p>
                          </div>
                        )}
                      </div>
                      {memory!.brief?.problemStatement && (
                        <div className="mt-3 pt-3 border-t border-white/6">
                          <p className="text-[10px] text-[#555] mb-1">Problem Statement</p>
                          <p className="text-xs text-[#F0EDE8] italic">"{memory!.brief.problemStatement}"</p>
                        </div>
                      )}
                    </div>

                    <button onClick={handleGeneratePlan}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-[#C9A96E] text-[#08080A] rounded-2xl text-sm font-medium hover:opacity-90 transition-all">
                      <Sparkles className="w-5 h-5" />
                      Generate content plan from Insight
                    </button>
                  </>
                ) : (
                  <div className="text-center py-16 rounded-2xl border border-dashed border-white/8">
                    <Brain className="w-10 h-10 text-[#333] mx-auto mb-4" />
                    <p className="text-base font-light text-[#555] mb-2">No Insight research yet</p>
                    <p className="text-sm text-[#333] mb-6">Run Insight first to get a research-backed content plan.</p>
                    <button onClick={() => navigate('/insight')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#7aaee0]/15 text-[#7aaee0] rounded-xl text-sm hover:opacity-90 transition-all mx-auto">
                      Go to Insight <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-[11px] text-[#444] uppercase tracking-wider mb-3">Or start with a specific output</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Brand Film',        route: 'video',    icon: Film      },
                      { label: 'Campaign Visual',   route: 'image',    icon: ImgIcon   },
                      { label: 'Strategy Deck',     route: 'document', icon: FileText  },
                      { label: 'Social Content',    route: 'social',   icon: Zap       },
                      { label: 'Brand Music',       route: 'audio',    icon: Music     },
                      { label: 'AI Ambassador',     route: 'avatar',   icon: Users     },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <button key={item.route} onClick={() => navigate(`/craft/${item.route}`)}
                          className="flex items-center gap-2 p-3 rounded-xl border border-white/6 hover:border-white/15 text-xs text-[#555] hover:text-[#888] transition-all">
                          <Icon className="w-3.5 h-3.5" />{item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Phase: Select ────────────────────────────────────────── */}
            {phase === 'select' && plan && (
              <div className="space-y-6">
                {/* Strategic thesis */}
                <div className="px-4 py-3 rounded-xl border border-white/6" style={{ background: '#0D0D10' }}>
                  <p className="text-[11px] text-[#555] uppercase tracking-wider mb-1">Strategic thesis</p>
                  <p className="text-sm text-[#F0EDE8] italic">"{plan.strategicThesis}"</p>
                </div>

                {/* Must Do */}
                {plan.mustDo.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-3.5 h-3.5 text-[#C9A96E]" />
                      <p className="text-xs font-medium text-[#C9A96E] uppercase tracking-wider">Must Do</p>
                      <span className="text-[11px] text-[#444]">{plan.mustDo.length} outputs — strategic foundation</span>
                    </div>
                    <div className="space-y-2">
                      {plan.mustDo.map(rec => (
                        <RecommendationCard key={rec.id} rec={recs.find(r => r.id === rec.id) ?? rec}
                          selected={selected.has(rec.id)} onToggle={() => handleToggle(rec.id)}
                          onBrief={() => handleBrief(rec)} briefing={briefingId === rec.id} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Should Do */}
                {plan.shouldDo.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ChevronRight className="w-3.5 h-3.5 text-[#7aaee0]" />
                      <p className="text-xs font-medium text-[#7aaee0] uppercase tracking-wider">Should Do</p>
                      <span className="text-[11px] text-[#444]">{plan.shouldDo.length} outputs — high-leverage</span>
                    </div>
                    <div className="space-y-2">
                      {plan.shouldDo.map(rec => (
                        <RecommendationCard key={rec.id} rec={recs.find(r => r.id === rec.id) ?? rec}
                          selected={selected.has(rec.id)} onToggle={() => handleToggle(rec.id)}
                          onBrief={() => handleBrief(rec)} briefing={briefingId === rec.id} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Nice to Have */}
                {plan.niceToDo.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Plus className="w-3.5 h-3.5 text-[#7abf8e]" />
                      <p className="text-xs font-medium text-[#7abf8e] uppercase tracking-wider">Nice to Have</p>
                      <span className="text-[11px] text-[#444]">{plan.niceToDo.length} outputs — enhancement layer</span>
                    </div>
                    <div className="space-y-2">
                      {plan.niceToDo.map(rec => (
                        <RecommendationCard key={rec.id} rec={recs.find(r => r.id === rec.id) ?? rec}
                          selected={selected.has(rec.id)} onToggle={() => handleToggle(rec.id)}
                          onBrief={() => handleBrief(rec)} briefing={briefingId === rec.id} />
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                {selected.size > 0 && (
                  <div className="sticky bottom-4 pt-2">
                    <button onClick={() => setPhase('brief')}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#C9A96E] text-[#08080A] rounded-2xl text-sm font-medium hover:opacity-90 transition-all shadow-xl">
                      Brief {selected.size} selected output{selected.size > 1 ? 's' : ''} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Phase: Brief ─────────────────────────────────────────── */}
            {phase === 'brief' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  {selectedRecs.map(rec => (
                    <RecommendationCard key={rec.id} rec={recs.find(r => r.id === rec.id) ?? rec}
                      selected={true} onToggle={() => handleToggle(rec.id)}
                      onBrief={() => handleBrief(rec)} briefing={briefingId === rec.id} />
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setPhase('select')}
                    className="flex items-center gap-1.5 px-4 py-2.5 border border-white/10 rounded-xl text-xs text-[#666] hover:border-white/20 transition-all">
                    ← Back
                  </button>
                  <button onClick={handleBriefAll} disabled={generating || allBriefed}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all">
                    {generating
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Writing briefs…</>
                      : allBriefed
                      ? <><Check className="w-4 h-4" />All briefed — proceed to Craft</>
                      : <><Sparkles className="w-4 h-4" />Write all creative briefs</>
                    }
                  </button>
                  {allBriefed && (
                    <button onClick={() => setPhase('queue')}
                      className="px-4 py-2.5 bg-[#7abf8e] text-[#08080A] rounded-xl text-xs font-medium hover:opacity-90 transition-all">
                      To queue →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── Phase: Queue ─────────────────────────────────────────── */}
            {phase === 'queue' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#F0EDE8]">{selectedRecs.length} outputs ready</p>
                  <button onClick={() => setPhase('select')}
                    className="text-xs text-[#555] hover:text-[#888] transition-colors flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Modify selection
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedRecs.map(rec => (
                    <CraftQueueItem key={rec.id} rec={recs.find(r => r.id === rec.id) ?? rec}
                      onExecute={() => handleExecute(rec)} />
                  ))}
                </div>

                <div className="pt-2">
                  <button onClick={() => navigate('/craft')}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 transition-all">
                    Open Craft Studio <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Creative Director chat ──────────────────────────── */}
        {(phase === 'select' || phase === 'brief') && (
          <div className="w-72 flex-shrink-0 border-l border-white/8 flex flex-col" style={{ background: '#0D0D10' }}>
            <div className="p-4 border-b border-white/6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#C9A96E]/15 flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5 text-[#C9A96E]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#F0EDE8]">Creative Director</p>
                  <p className="text-[10px] text-[#555]">Chat to adjust the plan</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-[11px] text-[#444] leading-relaxed">
                    Ask me to add outputs, remove items, change direction, or write a specific brief.
                  </p>
                  <div className="mt-4 space-y-1.5">
                    {[
                      'Add a TikTok series',
                      'Remove the press release',
                      'I want a Diwali campaign angle',
                      'Make the brand film shorter',
                    ].map(s => (
                      <button key={s} onClick={() => setChatInput(s)}
                        className="block w-full text-left text-[11px] text-[#555] hover:text-[#888] px-2 py-1.5 rounded-lg hover:bg-white/4 transition-all">
                        "{s}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={cn('text-xs leading-relaxed', msg.role === 'user' ? 'text-[#F0EDE8]' : 'text-[#888]')}>
                  {msg.role === 'director' && (
                    <span className="text-[10px] text-[#C9A96E] block mb-1">Creative Director</span>
                  )}
                  <p className={cn('px-3 py-2 rounded-xl', msg.role === 'user' ? 'bg-[#C9A96E]/10 text-[#F0EDE8]' : 'bg-white/5')}>
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-white/6">
              <div className="flex gap-2">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  placeholder="Adjust the plan…"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/40 transition-colors" />
                <button onClick={handleChat} disabled={!chatInput.trim()}
                  className="p-2 bg-[#C9A96E] text-[#08080A] rounded-xl hover:opacity-90 disabled:opacity-40 transition-all">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
