import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Sparkles, Clock, CheckCircle, ArrowRight,
  TrendingUp, Users, Target, Globe, Zap, BarChart2,
  RefreshCw, Plus, FileText, ChevronRight
} from 'lucide-react';
import { useInsightStore, useProjectsStore, useAuthStore } from '@/store';
import { supabase } from '@/lib/supabase/client';
import { createInsightRun } from '@/lib/supabase/helpers';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/shared/SEO';

// ─── Research source categories ───────────────────────────────────────────────
const SOURCE_CATEGORIES = [
  { id: 'brand',       name: 'Brand & Market Data',         icon: BarChart2 },
  { id: 'news',        name: 'News & Media Coverage',        icon: Globe     },
  { id: 'audience',    name: 'Audience & Social Signals',    icon: Users     },
  { id: 'competitive', name: 'Competitive Landscape',        icon: Target    },
  { id: 'culture',     name: 'Cultural Context & Trends',    icon: Zap       },
  { id: 'category',    name: 'Category Intelligence',        icon: TrendingUp},
  { id: 'sentiment',   name: 'Consumer Sentiment',           icon: Search    },
  { id: 'digital',     name: 'Platform & Digital Presence',  icon: Globe     },
];

type SourceStatus = 'queued' | 'running' | 'complete' | 'failed';

interface SourceState { id: string; status: SourceStatus; count?: number; }

const EXAMPLE_QUERIES = ['Nike', 'Spotify', 'Oatly', 'Patagonia', 'Airbnb', 'Apple Vision Pro'];

const MOCK_REPORTS = [
  {
    id: '1', subject: 'Nike Air Max — Brand Positioning', status: 'complete' as const,
    executiveSummary: 'Nike Air Max holds a dominant position in lifestyle sneakers with strong associations to innovation, comfort, and street culture.',
    problemStatement: 'Young athletes struggle to find sneakers that balance performance credibility with everyday style.',
    brandArchetype: { archetype: 'The Hero', confidence: 87 },
    confidenceScore: 92, createdAt: '2024-03-07T10:00:00Z',
    sourcesSearched: 847, strategicRoutes: 3,
  },
  {
    id: '2', subject: 'Spotify Wrapped — User Engagement Strategy', status: 'complete' as const,
    executiveSummary: 'Wrapped has become a cultural moment that transcends music, driving identity expression and virality through personal data storytelling.',
    problemStatement: 'Streaming platforms fight for emotional ownership of music identity in an attention-scarce era.',
    brandArchetype: { archetype: 'The Jester', confidence: 74 },
    confidenceScore: 88, createdAt: '2024-03-06T14:30:00Z',
    sourcesSearched: 612, strategicRoutes: 3,
  },
];

export function InsightPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { reports, addReport, setCurrentReport, isResearching, setIsResearching } = useInsightStore();
  const { currentProject } = useProjectsStore();

  const [query, setQuery]             = useState('');
  const [error, setError]             = useState<string | null>(null);
  const [sourceStates, setSourceStates] = useState<SourceState[]>([]);
  const [progress, setProgress]       = useState(0);

  const displayReports = [...reports, ...MOCK_REPORTS].slice(0, 10);

  const startResearch = async () => {
    if (!query.trim()) return;
    setIsResearching(true);
    setError(null);
    setProgress(0);

    const initial: SourceState[] = SOURCE_CATEGORIES.map(c => ({ id: c.id, status: 'queued' }));
    setSourceStates(initial);

    try {
      const projectId = currentProject?.id;

      // ── If Supabase is configured, use real Edge Function ──────────────────
      if (import.meta.env.VITE_SUPABASE_URL && user) {
        // 1. Create insight_run record
        const { data: run, error: runErr } = await createInsightRun({
          project_id: projectId ?? 'default',
          user_id: user.id,
          subject: query,
        });
        if (runErr || !run) throw new Error('Failed to create research run');

        // 2. Animate source categories while waiting
        const animatePromise = (async () => {
          for (let i = 0; i < SOURCE_CATEGORIES.length; i++) {
            setSourceStates(prev => prev.map(s =>
              s.id === SOURCE_CATEGORIES[i].id ? { ...s, status: 'running' } : s
            ));
            setProgress(Math.round((i / SOURCE_CATEGORIES.length) * 80));
            await new Promise(r => setTimeout(r, 600));
            setSourceStates(prev => prev.map(s =>
              s.id === SOURCE_CATEGORIES[i].id
                ? { ...s, status: 'complete', count: Math.floor(Math.random() * 80) + 20 } : s
            ));
          }
        })();

        // 3. Call Edge Function
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/insight-research`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({
              subject: query,
              projectId: projectId ?? run.id,
              runId: run.id,
            }),
          }
        );

        await animatePromise;

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error ?? 'Research failed');
        }

        setProgress(95);
        await new Promise(r => setTimeout(r, 300));
        setProgress(100);

        // 4. Fetch completed report
        const { data: completedRun } = await (supabase as any)
          .from('insight_runs')
          .select('*')
          .eq('id', run.id)
          .single();

        if (completedRun) {
          addReport({
            id: completedRun.id,
            projectId: completedRun.project_id,
            subject: completedRun.subject,
            status: 'complete',
            executiveSummary: completedRun.executive_summary,
            problemStatement: completedRun.problem_statement,
            brandArchetype: completedRun.brand_archetype,
            confidenceScore: completedRun.confidence_score,
            strategicRoutes: completedRun.strategic_routes,
            createdAt: completedRun.created_at,
          } as any);
        }

      } else {
        // ── Demo mode (no Supabase configured) ──────────────────────────────
        for (let i = 0; i < SOURCE_CATEGORIES.length; i++) {
          setSourceStates(prev => prev.map(s =>
            s.id === SOURCE_CATEGORIES[i].id ? { ...s, status: 'running' } : s
          ));
          setProgress(Math.round((i / SOURCE_CATEGORIES.length) * 85));
          await new Promise(r => setTimeout(r, 480));
          setSourceStates(prev => prev.map(s =>
            s.id === SOURCE_CATEGORIES[i].id
              ? { ...s, status: 'complete', count: Math.floor(Math.random() * 80) + 20 } : s
          ));
        }
        setProgress(95);
        await new Promise(r => setTimeout(r, 400));
        setProgress(100);

        addReport({
          id: Date.now().toString(),
          subject: query,
          status: 'complete',
          executiveSummary: `Demo research for "${query}". Add VITE_SUPABASE_URL and API keys in Settings to enable live AI research.`,
          problemStatement: 'Target audiences seek authentic connections with brands that reflect their values.',
          brandArchetype: { archetype: 'The Creator', confidence: 78 },
          confidenceScore: 75,
          createdAt: new Date().toISOString(),
          sourcesSearched: 8,
          projectId: projectId ?? 'default',
        } as any);
      }

      setQuery('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Research failed. Please try again.');
    } finally {
      setIsResearching(false);
      setProgress(0);
      setTimeout(() => setSourceStates([]), 600);
    }
  };

  const viewReport = (report: typeof MOCK_REPORTS[0]) => {
    setCurrentReport(report as any);
    navigate(`/insight/${report.id}`);
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="min-h-full" style={{ background: '#0A0A0C' }}>
      <SEO title="Insight — Brand Research" noIndex />
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#C9A96E]/15 flex items-center justify-center">
              <Search className="w-3 h-3 text-[#C9A96E]" />
            </div>
            <span className="text-[11px] text-[#C9A96E] uppercase tracking-[0.15em] font-medium">Insight</span>
          </div>
          <h1 className="text-3xl font-light text-[#F0EDE8] tracking-tight">
            What do you want to understand?
          </h1>
          <p className="text-sm text-[#555] leading-relaxed max-w-lg">
            Enter a brand, idea, product, or campaign problem. Hypnotic will research it,
            find the tension, and give you strategic routes forward.
          </p>
        </div>

        {/* ── Research Input ──────────────────────────────────── */}
        <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: '#0D0D10' }}>
          <div className="p-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !isResearching && startResearch()}
                  placeholder="Brand name / campaign problem / strategic question…"
                  disabled={isResearching}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/50 disabled:opacity-50 text-sm transition-colors"
                />
              </div>
              <button
                onClick={startResearch}
                disabled={!query.trim() || isResearching}
                className="flex items-center gap-2 bg-[#C9A96E] text-[#08080A] px-5 py-3 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all"
              >
                {isResearching
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Researching…</>
                  : <><Sparkles className="w-4 h-4" /> Run Research</>}
              </button>
            </div>

            {/* Example queries */}
            {!isResearching && (
              <div className="mt-4 flex flex-wrap gap-2">
                {EXAMPLE_QUERIES.map(q => (
                  <button key={q} onClick={() => setQuery(q)}
                    className="px-3 py-1.5 rounded-full border border-white/8 text-xs text-[#555] hover:border-white/20 hover:text-[#999] transition-all">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                <span>⚠</span> {error}
              </div>
            )}
          </div>

          {/* Research progress */}
          {isResearching && sourceStates.length > 0 && (
            <div className="px-6 pb-6 space-y-4">
              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C9A96E] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }} />
                </div>
                <span className="text-[11px] text-[#C9A96E] w-8 text-right">{progress}%</span>
              </div>

              {/* Source category grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sourceStates.map(s => {
                  const cat = SOURCE_CATEGORIES.find(c => c.id === s.id)!;
                  const Icon = cat.icon;
                  return (
                    <div key={s.id}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] transition-all',
                        s.status === 'complete' ? 'bg-[#C9A96E]/10 text-[#C9A96E]' :
                        s.status === 'running'  ? 'bg-white/8 text-[#F0EDE8]' :
                                                   'bg-white/3 text-[#444]'
                      )}>
                      {s.status === 'running'
                        ? <RefreshCw className="w-3 h-3 animate-spin flex-shrink-0" />
                        : s.status === 'complete'
                        ? <CheckCircle className="w-3 h-3 flex-shrink-0" />
                        : <Icon className="w-3 h-3 flex-shrink-0" />}
                      <span className="truncate">{cat.name}</span>
                      {s.count && s.status === 'complete' && (
                        <span className="ml-auto text-[11px] opacity-60">{s.count}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Recent Reports ──────────────────────────────────── */}
        {displayReports.length > 0 && (
          <div className="space-y-4">
            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[11px] text-[#444] uppercase tracking-wider">Recent Reports</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="space-y-2">
              {displayReports.map(report => (
                <button
                  key={report.id}
                  onClick={() => viewReport(report as any)}
                  className="w-full text-left rounded-xl border border-white/6 p-5 hover:border-white/15 hover:bg-white/2 group transition-all"
                  style={{ background: '#0D0D10' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3 className="text-sm font-medium text-[#F0EDE8] truncate">{report.subject}</h3>
                        {report.status === 'complete' && (
                          <span className="flex items-center gap-1 text-[11px] text-[#7abf8e] flex-shrink-0">
                            <CheckCircle className="w-3 h-3" /> Complete
                          </span>
                        )}
                      </div>

                      {report.executiveSummary && (
                        <p className="text-xs text-[#666] line-clamp-1 mb-2.5 leading-relaxed">
                          {report.executiveSummary}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-[11px] text-[#444]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {fmt(report.createdAt)}
                        </span>
                        {report.confidenceScore && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> {report.confidenceScore}% confidence
                          </span>
                        )}
                        {(report as any).sourcesSearched && (
                          <span>{(report as any).sourcesSearched} sources</span>
                        )}
                        {report.brandArchetype && (
                          <span className="px-2 py-0.5 bg-[#C9A96E]/10 text-[#C9A96E] rounded-full text-[11px]">
                            {report.brandArchetype.archetype}
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[#444] opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity mt-0.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── +Human CTA ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/6 p-5 flex items-center justify-between"
          style={{ background: '#0D0D10' }}>
          <div>
            <div className="text-sm font-medium text-[#F0EDE8] mb-0.5">Work with a strategist</div>
            <div className="text-xs text-[#555]">Have a human expert review and expand your research</div>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-[#C9A96E] border border-[#C9A96E]/25 rounded-lg px-3 py-2 hover:border-[#C9A96E]/50 transition-colors">
            <Plus className="w-3 h-3" /> + Human
          </button>
        </div>

      </div>
    </div>
  );
}
