// src/pages/manifest/ManifestPage.tsx
// Chat-first creative development. User describes what they want to make →
// 6 agents run sequentially → script/deck generated section by section.
// Brand Memory from Insight is automatically injected at every step.

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, CheckCircle, Loader2, AlertCircle, Brain,
  Film, FileText, Users, Globe, Clapperboard, Shield, ChevronDown, ChevronUp,
  Play, Clock, Zap, RefreshCw,
} from 'lucide-react';
import { useProjectsStore } from '@/store';
import { useBrandMemoryStore } from '@/store/brand-memory.store';
import { runManifestPipeline } from '@/lib/ai/agents/manifest-agents';
import type { GeneratedScript, ScriptAgentUpdate, ScriptGenre } from '@/lib/ai/agents/manifest-agents';
import { SEO } from '@/components/shared/SEO';
import { cn } from '@/lib/utils';

// ── Genre options ─────────────────────────────────────────────────────────────

const GENRES: { id: ScriptGenre; label: string; icon: React.ElementType; duration: string; desc: string }[] = [
  { id: 'commercial_30s', label: '30-sec TVC',     icon: Play,        duration: '30 seconds', desc: 'Classic broadcast format' },
  { id: 'commercial_60s', label: '60-sec TVC',     icon: Play,        duration: '60 seconds', desc: 'Extended story arc' },
  { id: 'brand_film',     label: 'Brand Film',     icon: Film,        duration: '2-5 minutes', desc: 'Emotional long-form' },
  { id: 'social_reel',    label: 'Social Reel',    icon: Zap,         duration: '15-60 seconds', desc: 'Platform-native vertical' },
  { id: 'short_film',     label: 'Short Film',     icon: Clapperboard, duration: '5-15 minutes', desc: 'Character-driven narrative' },
  { id: 'documentary',    label: 'Documentary',    icon: FileText,    duration: '3-10 minutes', desc: 'Observational storytelling' },
  { id: 'explainer',      label: 'Explainer',      icon: Globe,       duration: '60-120 seconds', desc: 'Concept-driven clarity' },
];

const AGENT_NAMES: Record<string, { name: string; icon: React.ElementType }> = {
  structure:      { name: 'Narrative Architect',     icon: FileText    },
  characters:     { name: 'Character Builder',       icon: Users       },
  character_lock: { name: 'Consistency Lock',        icon: Brain       },
  world:          { name: 'World Builder',           icon: Globe       },
  scenes:         { name: 'Scene Writer',            icon: Clapperboard },
  quality:        { name: 'Brand Alignment Auditor', icon: Shield      },
};

const EXAMPLES = [
  { label: 'Brand film', prompt: 'A film about a first-generation entrepreneur who never lets go of her roots despite success' },
  { label: 'TVC', prompt: 'Nike — 30-second spot about running as an act of defiance, not fitness' },
  { label: 'Social reel', prompt: 'Zomato delivery person who becomes an unlikely local hero in his building' },
  { label: 'Documentary', prompt: 'The artisans behind handmade goods in a rapidly digitalising market' },
];

// ── Scene card ────────────────────────────────────────────────────────────────

function SceneCard({ scene }: { scene: GeneratedScript['scenes'][0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/6 overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/3 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#555] font-mono w-6">{scene.sceneNumber}</span>
          <span className="text-xs font-mono text-[#C9A96E] uppercase tracking-wide truncate max-w-xs">{scene.heading}</span>
          {scene.brandMoment && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#C9A96E]/15 text-[#C9A96E]">brand</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#444] flex items-center gap-1"><Clock className="w-3 h-3" />{scene.duration}</span>
          {open ? <ChevronUp className="w-3.5 h-3.5 text-[#555]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#555]" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-white/6 pt-3 space-y-3">
          <p className="text-sm text-[#C0B8AC] leading-relaxed font-mono">{scene.action}</p>
          {scene.dialogue && scene.dialogue.length > 0 && (
            <div className="space-y-2 pl-4 border-l border-white/8">
              {scene.dialogue.map((d, i) => (
                <div key={i}>
                  <p className="text-[11px] text-[#C9A96E] font-medium uppercase">{d.character}</p>
                  <p className="text-xs text-[#888] italic">"{d.line}"</p>
                  {d.direction && <p className="text-[10px] text-[#444]">({d.direction})</p>}
                </div>
              ))}
            </div>
          )}
          <div className="pt-1 border-t border-white/4">
            <p className="text-[10px] text-[#444] uppercase tracking-wider mb-1">Visual note for Craft</p>
            <p className="text-[11px] text-[#555] font-mono">{scene.visualNote}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#444] uppercase tracking-wider mb-1">Emotional beat</p>
            <p className="text-[11px] text-[#888] italic">{scene.emotionalBeat}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Quality score bar ─────────────────────────────────────────────────────────

function ScoreBar({ label, value, color = '#C9A96E' }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-[#555]">{label}</span>
        <span className="text-[11px] font-medium" style={{ color }}>{value}/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function ManifestPage() {
  const navigate = useNavigate();
  const { currentProject } = useProjectsStore();
  const brandMemory = useBrandMemoryStore();

  const [input, setInput]       = useState('');
  const [genre, setGenre]       = useState<ScriptGenre>('brand_film');
  const [phase, setPhase]       = useState<'idle' | 'running' | 'complete' | 'error'>('idle');
  const [agentLog, setAgentLog] = useState<ScriptAgentUpdate[]>([]);
  const [script, setScript]     = useState<GeneratedScript | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedGenre = GENRES.find(g => g.id === genre)!;
  const memory = currentProject ? brandMemory.getMemory(currentProject.id) : null;

  // Use brief from Brand Memory if available
  const briefPlaceholder = memory?.brief?.problemStatement
    ? `From Insight: "${memory.brief.problemStatement.slice(0, 80)}…" — or describe your own brief`
    : EXAMPLES[0].prompt;

  const handleRun = async () => {
    if (!input.trim() || phase === 'running') return;
    if (!currentProject) { setErrorMsg('Select a project first.'); return; }

    setPhase('running'); setErrorMsg(''); setScript(null); setAgentLog([]);

    // Prepend brief from Brand Memory if it exists
    let fullBrief = input.trim();
    if (memory?.brief?.problemStatement && !input.includes(memory.brief.problemStatement)) {
      fullBrief = `Strategic brief: ${memory.brief.problemStatement}\n\nCreative direction: ${memory.brief.bigIdea}\n\nInput: ${input.trim()}`;
    }

    try {
      const result = await runManifestPipeline({
        brief:     fullBrief,
        genre,
        duration:  selectedGenre.duration,
        projectId: currentProject.id,
        onAgentUpdate: (update) => setAgentLog(prev => {
          const idx = prev.findIndex(a => a.agentId === update.agentId);
          if (idx >= 0) { const copy = [...prev]; copy[idx] = update; return copy; }
          return [...prev, update];
        }),
      });
      setScript(result);
      setPhase('complete');
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Script generation failed.');
      setPhase('error');
    }
  };

  return (
    <div className="min-h-full" style={{ background: '#0A0A0C' }}>
      <SEO title="Manifest" noIndex />
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#C9A96E]/15 text-[#C9A96E] uppercase tracking-wider">Manifest</span>
            {memory && memory.completeness > 0 && (
              <span className="text-[11px] text-[#555] flex items-center gap-1">
                <Brain className="w-3 h-3 text-[#C9A96E]" />
                Brand memory active ({memory.persona?.archetype} · {memory.audience?.name})
              </span>
            )}
          </div>
          <h1 className="text-2xl font-light text-[#F0EDE8]">What do you want to make?</h1>
          <p className="text-sm text-[#555] mt-1 max-w-lg leading-relaxed">
            Describe the story or campaign. Six agents build structure, characters, world, and scenes — then a Brand Alignment Auditor checks the brand is an enabler, never the hero.
          </p>
        </div>

        {/* Genre selector */}
        <div>
          <p className="text-[11px] text-[#555] uppercase tracking-wider mb-2">Format</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GENRES.map(g => {
              const Icon = g.icon;
              return (
                <button key={g.id} onClick={() => setGenre(g.id)}
                  className={cn('flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all',
                    genre === g.id ? 'border-[#C9A96E]/40 bg-[#C9A96E]/6' : 'border-white/6 hover:border-white/15'
                  )}>
                  <div className="flex items-center gap-1.5 w-full">
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: genre === g.id ? '#C9A96E' : '#555' }} />
                    <span className={cn('text-xs font-medium truncate', genre === g.id ? 'text-[#C9A96E]' : 'text-[#888]')}>
                      {g.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#444]">{g.duration}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input */}
        <div className="space-y-3">
          <div className="relative">
            <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleRun(); }}
              disabled={phase === 'running'} rows={4}
              placeholder={briefPlaceholder}
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors resize-none pr-28 leading-relaxed" />
            <button onClick={handleRun} disabled={!input.trim() || phase === 'running'}
              className="absolute right-3 bottom-3 flex items-center gap-1.5 px-4 py-2.5 bg-[#C9A96E] text-[#08080A] rounded-xl text-xs font-medium hover:opacity-90 disabled:opacity-40 transition-all">
              {phase === 'running'
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Writing</>
                : <><Sparkles className="w-3.5 h-3.5" />Generate</>}
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
              <span className="text-[11px] text-[#333] self-center">⌘+Enter to generate</span>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{errorMsg}
          </div>
        )}

        {/* Agent pipeline */}
        {agentLog.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] text-[#444] uppercase tracking-wider">
              {phase === 'running' ? 'Writing…' : 'Complete'}
            </p>
            <div className="space-y-1.5">
              {agentLog.map(a => {
                const cfg = AGENT_NAMES[a.agentId] ?? { name: a.agentName, icon: Sparkles };
                const Icon = cfg.icon;
                return (
                  <div key={a.agentId} className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs transition-all',
                    a.status === 'complete' && 'border-[#7abf8e]/20 bg-[#7abf8e]/4',
                    a.status === 'running'  && 'border-[#C9A96E]/20 bg-[#C9A96E]/4',
                    a.status === 'failed'   && 'border-red-500/20 bg-red-500/4',
                  )}>
                    {a.status === 'complete' && <CheckCircle className="w-3.5 h-3.5 text-[#7abf8e] flex-shrink-0" />}
                    {a.status === 'running'  && <Loader2 className="w-3.5 h-3.5 text-[#C9A96E] animate-spin flex-shrink-0" />}
                    {a.status === 'failed'   && <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                    <Icon className="w-3.5 h-3.5 text-[#555] flex-shrink-0" />
                    <span className={cn(
                      a.status === 'complete' ? 'text-[#7abf8e]' :
                      a.status === 'running'  ? 'text-[#C9A96E]' : 'text-[#555]'
                    )}>{cfg.name}</span>
                    {a.status === 'running' && (
                      <span className="text-[10px] text-[#444] ml-auto">working…</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Script output */}
        {script && phase === 'complete' && (
          <div className="space-y-5">

            {/* Title + quality scores */}
            <div className="rounded-2xl border border-[#C9A96E]/20 p-5" style={{ background: 'rgba(201,169,110,0.04)' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-light text-[#F0EDE8]">{script.title}</h2>
                  <p className="text-[11px] text-[#555] mt-1">{selectedGenre.label} · {script.duration}</p>
                </div>
                <button onClick={() => navigate('/craft/video')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#C9A96E] text-[#08080A] rounded-xl text-xs font-medium hover:opacity-90 transition-all">
                  <Film className="w-3.5 h-3.5" /> Take to Craft
                </button>
              </div>
              <div className="space-y-2.5">
                <ScoreBar label="Brief alignment" value={script.alignmentScore} color="#7aaee0" />
                <ScoreBar label="Brand as enabler" value={script.brandEnablerScore} color="#7abf8e" />
                <ScoreBar label="Emotional resonance" value={script.emotionalScore} color="#C9A96E" />
              </div>
            </div>

            {/* Narrative structure */}
            <div className="rounded-2xl border border-white/6 p-5" style={{ background: '#0D0D10' }}>
              <p className="text-[11px] text-[#555] uppercase tracking-wider mb-3">Narrative Structure</p>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] text-[#444] mb-1">Logline</p>
                  <p className="text-sm text-[#F0EDE8] italic">"{script.structure.logline}"</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#444] mb-1">Central conflict</p>
                  <p className="text-sm text-[#C0B8AC]">{script.structure.centralConflict}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#444] mb-1">Brand moment</p>
                  <p className="text-sm text-[#C9A96E]">{script.structure.brandMoment}</p>
                </div>
              </div>
            </div>

            {/* Characters */}
            {script.characters.protagonist && (
              <div className="rounded-2xl border border-white/6 p-5" style={{ background: '#0D0D10' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-[#C9A96E]" />
                  <p className="text-[11px] text-[#555] uppercase tracking-wider">Characters</p>
                  <span className="text-[10px] text-[#333] ml-auto">Locked into Brand Memory</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[#F0EDE8]">{script.characters.protagonist.name}</span>
                      <span className="text-[10px] text-[#C9A96E] bg-[#C9A96E]/10 px-1.5 py-0.5 rounded-full">{script.characters.protagonist.archetype}</span>
                    </div>
                    <p className="text-xs text-[#555]">Fear: {script.characters.protagonist.fear}</p>
                    <p className="text-xs text-[#555]">Contradiction: {script.characters.protagonist.contradiction}</p>
                    <p className="text-xs text-[#555]">Visual signature: {script.characters.protagonist.physicalSignature}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Scenes */}
            <div>
              <p className="text-[11px] text-[#555] uppercase tracking-wider mb-3">{script.scenes.length} Scenes</p>
              <div className="space-y-2">
                {script.scenes.map(scene => <SceneCard key={scene.sceneNumber} scene={scene} />)}
              </div>
            </div>

            {/* World Bible */}
            <div className="rounded-2xl border border-white/6 p-5" style={{ background: '#0D0D10' }}>
              <p className="text-[11px] text-[#555] uppercase tracking-wider mb-3">World Bible</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  ['Setting',    script.worldBible.setting],
                  ['Aesthetic',  script.worldBible.aestheticDirection],
                  ['Lighting',   script.worldBible.lightingPhilosophy],
                  ['Soundscape', script.worldBible.soundscape],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <p className="text-[10px] text-[#444] mb-0.5">{k}</p>
                    <p className="text-[#888]">{v as string}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA row */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setPhase('idle'); setScript(null); setAgentLog([]); }}
                className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl text-xs text-[#666] hover:border-white/20 hover:text-[#999] transition-all">
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </button>
              <button onClick={() => navigate('/craft')}
                className="flex items-center justify-center gap-2 py-3 bg-[#C9A96E] text-[#08080A] rounded-xl text-xs font-medium hover:opacity-90 transition-all">
                Generate visuals in Craft <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
