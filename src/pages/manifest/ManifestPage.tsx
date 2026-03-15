import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Sparkles, Film, Share2, ArrowRight, Clock,
  CheckCircle, Download, RefreshCw, ChevronRight, Plus,
  AlignLeft, Scroll, Users, Upload
} from 'lucide-react';
import { useManifestStore, useInsightStore, useAuthStore } from '@/store';
import { supabase } from '@/lib/supabase/client';
import { createManifestRun } from '@/lib/supabase/helpers';
import { cn } from '@/lib/utils';

// ─── Output types ─────────────────────────────────────────────────────────────
const OUTPUT_TYPES = [
  {
    id: 'strategy_deck', name: 'Strategy Deck', icon: FileText,
    description: 'Full 14-section presentation — brief decode, big idea, platform executions',
    color: '#C9A96E', sections: 14,
  },
  {
    id: 'film_script', name: 'Film Script', icon: Film,
    description: 'Screenplay format — scenes, dialogue, visual notes, character bible',
    color: '#7aaee0', sections: 8,
  },
  {
    id: 'social_system', name: 'Social System', icon: Share2,
    description: 'Content pillars, caption templates, and platform-specific formats',
    color: '#7abf8e', sections: 6,
  },
  {
    id: 'campaign_narrative', name: 'Campaign Narrative', icon: Scroll,
    description: 'Brand manifesto, tone of voice, and narrative architecture',
    color: '#a07ae0', sections: 5,
  },
  {
    id: 'character_doc', name: 'Character Document', icon: Users,
    description: 'Full character bible with backstory, motivation, and voice guide',
    color: '#e07a7a', sections: 4,
  },
];

// ─── Deck sections (for generation progress) ─────────────────────────────────
const DECK_SECTIONS = [
  'Brief Decode', 'Audience Map & Psychology', 'Competitive Landscape',
  'Cultural Tension', 'The Revelation', 'Strategic Manifesto', 'The Big Idea',
  'Creative Voice & Expression', 'Hero Content Concept', 'Content System',
  'Platform Executions', 'Social Content System', 'Measurement Framework', 'Executive Summary',
];

const MOCK_DECKS = [
  {
    id: '1', title: 'Nike Air Max Q4 Campaign', outputType: 'strategy_deck',
    status: 'complete' as const, createdAt: '2024-03-07T12:00:00Z',
    sectionCount: 14, fromInsight: 'Nike Air Max Brand Positioning',
  },
  {
    id: '2', title: 'Spotify Wrapped 2024 Script', outputType: 'film_script',
    status: 'complete' as const, createdAt: '2024-03-06T15:00:00Z',
    sectionCount: 8, fromInsight: 'Spotify Wrapped User Engagement',
  },
];

type SectionStatus = 'queued' | 'running' | 'complete';

export function ManifestPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { decks, addDeck, setCurrentDeck, isGenerating, setIsGenerating } = useManifestStore();
  const { currentReport } = useInsightStore();

  const [outputType, setOutputType]   = useState('strategy_deck');
  const [brief, setBrief]             = useState('');
  const [inputMode, setInputMode]     = useState<'insight' | 'prompt' | 'upload'>('insight');
  const [sectionStates, setSectionStates] = useState<SectionStatus[]>([]);
  const [currentSection, setCurrentSection] = useState('');
  const [progress, setProgress]       = useState(0);

  const displayDecks = [...decks, ...MOCK_DECKS].slice(0, 10);
  const selectedType = OUTPUT_TYPES.find(t => t.id === outputType)!;
  const sectionList  = outputType === 'strategy_deck' ? DECK_SECTIONS : DECK_SECTIONS.slice(0, selectedType.sections);

  const generate = async () => {
    if (inputMode === 'prompt' && !brief.trim()) return;
    setIsGenerating(true);
    setProgress(0);

    const initial: SectionStatus[] = sectionList.map(() => 'queued');
    setSectionStates(initial);

    try {
      // ── Real Edge Function (SSE streaming) ────────────────────────────────
      if (import.meta.env.VITE_SUPABASE_URL && user) {
        const { data: run, error: runErr } = await createManifestRun({
          project_id: '1',
          user_id: user.id,
          output_type: outputType,
          insight_run_id: (currentReport as any)?.id,
          custom_brief: brief || undefined,
          input_type: inputMode,
        });
        if (runErr || !run) throw new Error('Failed to create manifest run');

        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manifest-generate`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({
              runId: run.id,
              insightRunId: (currentReport as any)?.id,
              customBrief: brief || undefined,
              outputType,
              projectId: '1',
            }),
          }
        );

        if (!res.ok || !res.body) throw new Error('Generation stream failed');

        // Read SSE stream
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const lines = text.split("\n").filter((l: string) => l.startsWith("data: "));

          for (const line of lines) {
            try {
              const event = JSON.parse(line.slice(6));
              if (event.type === 'section_start') {
                const idx = sectionList.indexOf(event.title);
                setCurrentSection(event.title);
                setSectionStates(prev => prev.map((s, i) => i === idx ? 'running' : s));
                setProgress(Math.round((idx / sectionList.length) * 90));
              } else if (event.type === 'section_done') {
                const idx = sectionList.indexOf(event.title);
                setSectionStates(prev => prev.map((s, i) => i === idx ? 'complete' : s));
              } else if (event.type === 'complete') {
                setProgress(100);
                addDeck({
                  id: run.id,
                  title: brief || (currentReport ? `${(currentReport as any).subject} — ${selectedType.name}` : `New ${selectedType.name}`),
                  outputType, status: 'complete',
                  createdAt: new Date().toISOString(),
                  sectionCount: sectionList.length,
                  fromInsight: (currentReport as any)?.subject,
                  projectId: '1',
                } as any);
                setBrief('');
              } else if (event.type === 'error') {
                throw new Error(event.message ?? 'Generation failed');
              }
            } catch { /* skip malformed events */ }
          }
        }

      } else {
        // ── Demo mode ────────────────────────────────────────────────────────
        for (let i = 0; i < sectionList.length; i++) {
          setCurrentSection(sectionList[i]);
          setSectionStates(prev => prev.map((s, idx) => idx === i ? 'running' : s));
          setProgress(Math.round((i / sectionList.length) * 90));
          await new Promise(r => setTimeout(r, 380));
          setSectionStates(prev => prev.map((s, idx) => idx === i ? 'complete' : s));
        }
        setProgress(100);
        await new Promise(r => setTimeout(r, 300));
        addDeck({
          id: Date.now().toString(),
          title: brief || (currentReport ? `${(currentReport as any).subject} — ${selectedType.name}` : `New ${selectedType.name}`),
          outputType, status: 'complete',
          createdAt: new Date().toISOString(),
          sectionCount: sectionList.length,
          fromInsight: (currentReport as any)?.subject,
          projectId: '1',
        } as any);
        setBrief('');
      }
    } catch (err) {
      console.error('[manifest] generate error:', err);
    } finally {
      setIsGenerating(false);
      setProgress(0);
      setTimeout(() => { setSectionStates([]); setCurrentSection(''); }, 500);
    }
  };

  const viewDeck = (deck: typeof MOCK_DECKS[0]) => {
    setCurrentDeck(deck as any);
    navigate(`/manifest/${deck.id}`);
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const outputTypeIcon: Record<string, string> = {
    strategy_deck: '📊', film_script: '🎬', social_system: '📱',
    campaign_narrative: '📜', character_doc: '👤',
  };

  return (
    <div className="min-h-full" style={{ background: '#0A0A0C' }}>
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#C9A96E]/15 flex items-center justify-center">
              <Scroll className="w-3 h-3 text-[#C9A96E]" />
            </div>
            <span className="text-[10px] text-[#C9A96E] uppercase tracking-[0.15em] font-medium">Manifest</span>
          </div>
          <h1 className="text-3xl font-light text-[#F0EDE8] tracking-tight">Build the story</h1>
          <p className="text-sm text-[#555] leading-relaxed max-w-lg">
            Transform insights into compelling creative. Generate strategy decks,
            film scripts, social content systems, and campaign narratives.
          </p>
        </div>

        {/* ── Generation form ─────────────────────────────────── */}
        <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: '#0D0D10' }}>
          <div className="p-6 space-y-6">

            {/* Output type grid */}
            <div>
              <div className="text-[10px] text-[#555] uppercase tracking-wider mb-3">Output Type</div>
              <div className="grid grid-cols-5 gap-2">
                {OUTPUT_TYPES.map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.id} onClick={() => setOutputType(t.id)}
                      className={cn(
                        'p-3 border rounded-xl text-left transition-all',
                        outputType === t.id
                          ? 'border-[#C9A96E] bg-[#C9A96E]/8'
                          : 'border-white/8 hover:border-white/15'
                      )}>
                      <Icon className={cn('w-4 h-4 mb-2', outputType === t.id ? 'text-[#C9A96E]' : 'text-[#555]')} />
                      <div className="text-[11px] font-medium text-[#F0EDE8] leading-tight">{t.name}</div>
                    </button>
                  );
                })}
              </div>
              {outputType && (
                <p className="mt-2 text-xs text-[#555]">{selectedType.description}</p>
              )}
            </div>

            {/* Input mode */}
            <div>
              <div className="text-[10px] text-[#555] uppercase tracking-wider mb-3">Input Source</div>
              <div className="flex gap-2">
                {[
                  { id: 'insight', label: 'From Insight', icon: Sparkles, available: !!currentReport },
                  { id: 'prompt',  label: 'Custom Brief', icon: AlignLeft,  available: true },
                  { id: 'upload',  label: 'Upload Brief', icon: Upload,     available: true },
                ].map(m => (
                  <button key={m.id} onClick={() => setInputMode(m.id as any)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all',
                      inputMode === m.id
                        ? 'border-[#C9A96E] bg-[#C9A96E]/10 text-[#F0EDE8]'
                        : m.available
                        ? 'border-white/8 text-[#777] hover:border-white/15'
                        : 'border-white/5 text-[#444] cursor-not-allowed'
                    )}>
                    <m.icon className="w-3 h-3" /> {m.label}
                    {!m.available && <span className="text-[9px] text-[#444] ml-1">(no report)</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Input area */}
            {inputMode === 'insight' && currentReport ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-[#C9A96E]/8 border border-[#C9A96E]/20 rounded-xl">
                <CheckCircle className="w-4 h-4 text-[#C9A96E]" />
                <div>
                  <div className="text-xs font-medium text-[#F0EDE8]">Using Insight report</div>
                  <div className="text-[11px] text-[#C9A96E]/80">{currentReport.subject}</div>
                </div>
              </div>
            ) : inputMode === 'upload' ? (
              <button className="w-full border border-dashed border-white/12 rounded-xl p-5 flex flex-col items-center gap-2 hover:border-white/20 transition-colors">
                <Upload className="w-5 h-5 text-[#444]" />
                <span className="text-xs text-[#777]">Upload PDF, PPTX, or DOCX brief</span>
              </button>
            ) : (
              <textarea value={brief} onChange={e => setBrief(e.target.value)}
                placeholder="Describe your campaign, brand, objectives, and target audience…"
                rows={4}
                disabled={isGenerating}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none disabled:opacity-50 text-sm leading-relaxed" />
            )}

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={isGenerating || (inputMode === 'prompt' && !brief.trim())}
              className="w-full flex items-center justify-center gap-2 bg-[#C9A96E] text-[#08080A] py-3.5 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all"
            >
              {isGenerating
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating…</>
                : <><Sparkles className="w-4 h-4" /> Generate {selectedType.name}</>}
            </button>
          </div>

          {/* Generation progress */}
          {isGenerating && sectionStates.length > 0 && (
            <div className="px-6 pb-6 space-y-4 border-t border-white/5 pt-5">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C9A96E] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-[11px] text-[#C9A96E] w-8 text-right">{progress}%</span>
              </div>

              {currentSection && (
                <div className="text-xs text-[#777]">Generating: <span className="text-[#F0EDE8]">{currentSection}</span></div>
              )}

              <div className="grid grid-cols-2 gap-1.5">
                {sectionStates.map((s, i) => (
                  <div key={i}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] transition-all',
                      s === 'complete' ? 'bg-[#C9A96E]/10 text-[#C9A96E]' :
                      s === 'running'  ? 'bg-white/8 text-[#F0EDE8]' :
                                         'bg-white/3 text-[#444]'
                    )}>
                    {s === 'running'  ? <RefreshCw className="w-3 h-3 animate-spin flex-shrink-0" /> :
                     s === 'complete' ? <CheckCircle className="w-3 h-3 flex-shrink-0" /> :
                                        <div className="w-3 h-3 rounded-full border border-white/15 flex-shrink-0" />}
                    <span className="truncate">{sectionList[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Recent Outputs ──────────────────────────────────── */}
        {displayDecks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] text-[#444] uppercase tracking-wider">Recent Outputs</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="space-y-2">
              {displayDecks.map(deck => (
                <button
                  key={deck.id}
                  onClick={() => viewDeck(deck as any)}
                  className="w-full text-left rounded-xl border border-white/6 p-5 hover:border-white/15 hover:bg-white/2 group transition-all"
                  style={{ background: '#0D0D10' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="text-base">{deck.outputType ? (outputTypeIcon[deck.outputType] ?? '📄') : '📄'}</span>
                        <h3 className="text-sm font-medium text-[#F0EDE8] truncate">{deck.title}</h3>
                        <span className="flex items-center gap-1 text-[10px] text-[#7abf8e] flex-shrink-0">
                          <CheckCircle className="w-3 h-3" /> Complete
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-[#444]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {fmt(deck.createdAt)}
                        </span>
                        <span>{(deck as any).sectionCount} sections</span>
                        {(deck as any).fromInsight && (
                          <span className="text-[#555] truncate">↳ {(deck as any).fromInsight}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={e => e.stopPropagation()}
                        className="p-1.5 text-[#444] hover:text-[#888] hover:bg-white/5 rounded-lg transition-all">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-[#444] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
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
            <div className="text-sm font-medium text-[#F0EDE8] mb-0.5">Work with a creative director</div>
            <div className="text-xs text-[#555]">Have a human expert review and elevate your creative output</div>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-[#C9A96E] border border-[#C9A96E]/25 rounded-lg px-3 py-2 hover:border-[#C9A96E]/50 transition-colors">
            <Plus className="w-3 h-3" /> + Human
          </button>
        </div>

      </div>
    </div>
  );
}
