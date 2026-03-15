// src/pages/insight/InsightPage.tsx
// Chat-first research experience. 6 agents run in parallel → Brand Memory hydrates → Strategic brief appears.

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, CheckCircle, Circle, Loader2, ChevronDown, ChevronUp,
  Users, TrendingUp, Zap, Target, FileText, BarChart3, Brain, AlertCircle,
} from 'lucide-react';
import { useProjectsStore } from '@/store';
import { useBrandMemoryStore } from '@/store/brand-memory.store';
import { runInsightPipeline } from '@/lib/ai/agents/insight-agents';
import type { InsightReport, AgentProgress } from '@/lib/ai/agents/insight-agents';
import { SEO } from '@/components/shared/SEO';
import { cn } from '@/lib/utils';

const EXAMPLES = [
  { label: 'Brand research', prompt: 'Zomato in tier-2 India — what cultural tension is there to own?' },
  { label: 'Campaign problem', prompt: 'Nike Air Max 2025 — how to connect with Gen Z who distrust ads?' },
  { label: 'New launch', prompt: 'Launching a D2C ayurvedic skincare brand for urban millennials' },
  { label: 'Social brief', prompt: 'Myntra Fashion — content strategy that builds community not just sales' },
];

const AGENT_ICONS: Record<string, React.ElementType> = {
  category: TrendingUp, competitor: BarChart3, audience: Users,
  cultural: Zap, opportunity: Target, brief: FileText,
};

function ReportSection({ title, icon: Icon, children, defaultOpen = false }: {
  title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: '#0D0D10' }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/3 transition-colors">
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-[#C9A96E]" />
          <span className="text-sm font-medium text-[#F0EDE8]">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-[#555]" /> : <ChevronDown className="w-4 h-4 text-[#555]" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-white/6 pt-4">{children}</div>}
    </div>
  );
}

function Tag({ children, color = '#C9A96E' }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="inline-block text-[11px] px-2.5 py-1 rounded-full font-medium mr-1.5 mb-1.5"
      style={{ color, background: `${color}18` }}>{children}</span>
  );
}

export function InsightPage() {
  const navigate = useNavigate();
  const { currentProject } = useProjectsStore();
  const brandMemory = useBrandMemoryStore();
  const [input, setInput]       = useState('');
  const [phase, setPhase]       = useState<'idle' | 'running' | 'complete' | 'error'>('idle');
  const [agents, setAgents]     = useState<AgentProgress[]>([]);
  const [report, setReport]     = useState<InsightReport | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const memory = currentProject ? brandMemory.getMemory(currentProject.id) : null;

  const handleRun = async () => {
    if (!input.trim() || phase === 'running') return;
    if (!currentProject) { setErrorMsg('Select a project first (top bar) to save your research.'); return; }
    setPhase('running'); setErrorMsg(''); setReport(null);
    brandMemory.initMemory(currentProject.id, input.split(' ').slice(0, 3).join(' '));
    await runInsightPipeline({
      subject: input.trim(), projectId: currentProject.id, userId: '',
      onProgress: (a) => setAgents([...a]),
      onComplete: (r) => { setReport(r); setPhase('complete'); },
      onError:   (e) => { setErrorMsg(e); setPhase('error'); },
    });
  };

  return (
    <div className="min-h-full" style={{ background: '#0A0A0C' }}>
      <SEO title="Insight" noIndex />
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#7aaee0]/15 text-[#7aaee0] uppercase tracking-wider">Insight</span>
            {memory && memory.completeness > 0 && (
              <span className="text-[11px] text-[#555]">Brand memory {memory.completeness}% complete</span>
            )}
          </div>
          <h1 className="text-2xl font-light text-[#F0EDE8]">What do you want to understand?</h1>
          <p className="text-sm text-[#555] mt-1 max-w-lg leading-relaxed">
            Six research agents run in parallel then synthesise into a strategic brief that feeds directly into Manifest.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-3">
          <div className="relative">
            <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleRun(); }}
              disabled={phase === 'running'} rows={3} placeholder="Nike Air Max 2025 — what cultural tension is there to own with Gen Z?"
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors resize-none pr-28 leading-relaxed" />
            <button onClick={handleRun} disabled={!input.trim() || phase === 'running'}
              className="absolute right-3 bottom-3 flex items-center gap-1.5 px-4 py-2.5 bg-[#C9A96E] text-[#08080A] rounded-xl text-xs font-medium hover:opacity-90 disabled:opacity-40 transition-all">
              {phase === 'running'
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Running</>
                : <><Sparkles className="w-3.5 h-3.5" />Research</>}
            </button>
          </div>
          {phase === 'idle' && (
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map(ex => (
                <button key={ex.label} onClick={() => setInput(ex.prompt)}
                  className="text-[11px] px-3 py-1.5 rounded-xl border border-white/8 text-[#555] hover:border-white/20 hover:text-[#888] transition-all">
                  {ex.label}
                </button>
              ))}
              <span className="text-[11px] text-[#333] self-center">⌘+Enter to run</span>
            </div>
          )}
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{errorMsg}
          </div>
        )}

        {/* Agent progress */}
        {agents.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] text-[#444] uppercase tracking-wider">
              {phase === 'running' ? 'Agents running…' : `Complete · ${report?.processingTimeMs ? Math.round(report.processingTimeMs / 1000) + 's' : ''}`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {agents.map(a => {
                const Icon = AGENT_ICONS[a.id] ?? Brain;
                return (
                  <div key={a.id} className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs transition-all',
                    a.status === 'complete' && 'border-[#7abf8e]/25 bg-[#7abf8e]/5',
                    a.status === 'running'  && 'border-[#C9A96E]/25 bg-[#C9A96E]/5',
                    a.status === 'queued'   && 'border-white/6',
                    a.status === 'failed'   && 'border-red-500/25 bg-red-500/5',
                  )}>
                    {a.status === 'complete' && <CheckCircle className="w-3.5 h-3.5 text-[#7abf8e] flex-shrink-0" />}
                    {a.status === 'running'  && <Loader2 className="w-3.5 h-3.5 text-[#C9A96E] animate-spin flex-shrink-0" />}
                    {a.status === 'queued'   && <Circle className="w-3.5 h-3.5 text-[#333] flex-shrink-0" />}
                    {a.status === 'failed'   && <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                    <span className={cn('truncate text-[11px]',
                      a.status === 'complete' ? 'text-[#7abf8e]' : a.status === 'running' ? 'text-[#C9A96E]' : 'text-[#444]'
                    )}>{a.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Report */}
        {report && phase === 'complete' && (
          <div className="space-y-4">
            {/* Strategic Brief */}
            <div className="rounded-2xl border border-[#C9A96E]/20 p-6" style={{ background: 'rgba(201,169,110,0.04)' }}>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-[#C9A96E]" />
                <span className="text-sm font-medium text-[#C9A96E]">Strategic Brief</span>
                <span className="text-[11px] text-[#444] ml-auto">Confidence: {report.confidenceScore}%</span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5">Problem Statement</p>
                  <p className="text-base font-light text-[#F0EDE8] leading-relaxed italic">"{report.strategicBrief.problemStatement}"</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5">Big Idea</p>
                  <p className="text-sm font-medium text-[#C9A96E]">{report.strategicBrief.bigIdea}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#555] uppercase tracking-wider mb-2">Strategic Routes</p>
                  <div className="space-y-2">
                    {report.strategicBrief.strategicRoutes.map(route => (
                      <div key={route.id} className={cn('p-3 rounded-xl border',
                        route.id === report.strategicBrief.recommendedRoute
                          ? 'border-[#C9A96E]/30 bg-[#C9A96E]/5' : 'border-white/6')}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-[#F0EDE8]">{route.label}</span>
                          {route.id === report.strategicBrief.recommendedRoute && (
                            <span className="text-[10px] text-[#C9A96E] bg-[#C9A96E]/15 px-1.5 py-0.5 rounded-full">Recommended</span>
                          )}
                          <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full ml-auto',
                            route.riskLevel === 'low' ? 'text-[#7abf8e] bg-[#7abf8e]/10' :
                            route.riskLevel === 'high' ? 'text-red-400 bg-red-400/10' : 'text-[#C9A96E] bg-[#C9A96E]/10'
                          )}>{route.riskLevel} risk</span>
                        </div>
                        <p className="text-xs text-[#555]">{route.oneLiner}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => navigate('/manifest')}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 transition-all">
                  Take to Manifest <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Detail sections */}
            <ReportSection title={`Brand Archetype: ${report.opportunitySpace.archetypeMatch.archetype}`} icon={Target}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-[#C9A96E]" style={{ width: `${report.opportunitySpace.archetypeMatch.confidence}%` }} />
                  </div>
                  <span className="text-xs text-[#555]">{report.opportunitySpace.archetypeMatch.confidence}% confidence</span>
                </div>
                <p className="text-sm text-[#C0B8AC] leading-relaxed">{report.opportunitySpace.archetypeMatch.rationale}</p>
                <div className="flex flex-wrap mt-1">{report.opportunitySpace.archetypeMatch.traits.map(t => <Tag key={t}>{t}</Tag>)}</div>
              </div>
            </ReportSection>

            <ReportSection title="Audience Psychographics" icon={Users}>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#F0EDE8]">{report.audienceProfile.primaryPersona.name}</span>
                  <span className="text-xs text-[#555]">{report.audienceProfile.primaryPersona.age}</span>
                </div>
                <p className="text-sm text-[#C0B8AC] leading-relaxed">{report.audienceProfile.primaryPersona.description}</p>
                <div>
                  <p className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5">Their paradox</p>
                  <p className="text-sm text-[#C0B8AC]">{report.audienceProfile.audienceParadox}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5">Unspoken desire</p>
                  <p className="text-sm text-[#F0EDE8] italic">"{report.audienceProfile.unspokenDesire}"</p>
                </div>
              </div>
            </ReportSection>

            <ReportSection title="Cultural Tension" icon={Zap}>
              <div className="space-y-3">
                <p className="text-base font-light text-[#F0EDE8] italic">"{report.culturalTension.tension}"</p>
                <p className="text-sm text-[#C0B8AC] leading-relaxed">{report.culturalTension.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-white/6"><p className="text-[11px] text-[#555] mb-1">One side</p><p className="text-xs text-[#888]">{report.culturalTension.onOneSide}</p></div>
                  <div className="p-3 rounded-xl border border-white/6"><p className="text-[11px] text-[#555] mb-1">Other side</p><p className="text-xs text-[#888]">{report.culturalTension.onOtherSide}</p></div>
                </div>
                <div><p className="text-[11px] text-[#555] uppercase tracking-wider mb-1">Why act now</p><p className="text-sm text-[#C0B8AC]">{report.culturalTension.timing}</p></div>
              </div>
            </ReportSection>

            <ReportSection title="Competitive Whitespace" icon={BarChart3}>
              <div className="space-y-3">
                <div><p className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5">The gap nobody owns</p><p className="text-sm font-medium text-[#C9A96E]">{report.competitorLandscape.whitespace}</p></div>
                <div><p className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5">What everyone says (avoid)</p><div className="flex flex-wrap">{(report.competitorLandscape.competitorClichés ?? []).map(c => <Tag key={c} color="#e07a7a">{c}</Tag>)}</div></div>
                <div><p className="text-[11px] text-[#555] uppercase tracking-wider mb-1.5">How to win</p><p className="text-sm text-[#C0B8AC]">{report.competitorLandscape.winCondition}</p></div>
              </div>
            </ReportSection>
          </div>
        )}

        {/* Brand Memory status */}
        {phase === 'complete' && memory && memory.completeness > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/6" style={{ background: '#0D0D10' }}>
            <Brain className="w-4 h-4 text-[#C9A96E]" />
            <div className="flex-1">
              <p className="text-xs font-medium text-[#F0EDE8]">Brand Memory updated</p>
              <p className="text-[11px] text-[#555]">Archetype, audience, and brief now inform Manifest + Craft automatically</p>
            </div>
            <span className="text-xs text-[#C9A96E]">{memory.completeness}% complete</span>
          </div>
        )}
      </div>
    </div>
  );
}
