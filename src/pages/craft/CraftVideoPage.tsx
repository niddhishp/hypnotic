// src/pages/craft/CraftVideoPage.tsx — Full Video Production Pipeline
// Script → Settings → Character Design → World Building → Storyboard → Keyframes → Video → Timeline

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Film, ChevronRight, ChevronDown, ChevronUp, Settings2, Users,
  Globe, Package, Check, Loader2, Play, Clapperboard, LayoutGrid,
  Scissors, Music, Download, RefreshCw, AlertCircle, Sparkles,
  Clock, Monitor, Mic, Palette,
} from 'lucide-react';
import { useProjectsStore } from '@/store';
import { useBrandMemoryStore } from '@/store/brand-memory.store';
import { VIDEO_TEMPLATES, VIDEO_STYLES } from '@/lib/craft/prompt-library';
import { SEO } from '@/components/shared/SEO';
import { cn } from '@/lib/utils';

type PipelineStep = 'brief' | 'settings' | 'characters' | 'world' | 'storyboard' | 'keyframes' | 'render' | 'timeline';

const VIDEO_MODELS = [
  { id: 'kling-2.0',    label: 'Kling 2.0',      desc: 'Best cinematic quality',      tier: 'ultra',   credits: 12 },
  { id: 'kling-1.6',    label: 'Kling 1.6',      desc: 'Fast, reliable, great value', tier: 'quality', credits: 8  },
  { id: 'runway-gen4',  label: 'Runway Gen-4',   desc: 'Best for motion control',     tier: 'ultra',   credits: 15 },
  { id: 'luma-dream',   label: 'Luma Dream',     desc: 'Excellent scene coherence',   tier: 'quality', credits: 10 },
  { id: 'sora',         label: 'Sora',           desc: 'OpenAI — natural motion',     tier: 'ultra',   credits: 20 },
];

const GENERATION_WORKFLOWS = [
  { id: 'keyframes-to-video',     label: 'Keyframes → Video',     desc: 'Most cinematic — generates reference images first, then animates between them' },
  { id: 'elements-sequential',    label: 'Elements Sequential',   desc: 'Scene by scene in order — good for narrative films' },
  { id: 'elements-parallel',      label: 'Elements Parallel',     desc: 'Generate all scenes simultaneously — fastest for social content' },
];

const ASPECT_RATIOS = [
  { id: '16:9', label: '16:9', desc: 'Widescreen / TV' },
  { id: '9:16', label: '9:16', desc: 'Vertical / Mobile' },
  { id: '1:1',  label: '1:1',  desc: 'Square / Feed' },
  { id: '4:5',  label: '4:5',  desc: 'Portrait / Stories' },
  { id: '21:9', label: '21:9', desc: 'Cinematic / Ultra-wide' },
];

const TONES = [
  'Dark & Satirical', 'Quiet Humour', 'Warm & Emotional', 'Epic & Cinematic',
  'Raw & Authentic', 'Playful & Light', 'Tense & Dramatic', 'Nostalgic',
  'Aspirational', 'Documentary', 'Surreal', 'Luxurious',
];

const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'hi', label: 'Hindi' },
  { code: 'ta', label: 'Tamil' },   { code: 'te', label: 'Telugu' },
  { code: 'bn', label: 'Bengali' }, { code: 'mr', label: 'Marathi' },
  { code: 'kn', label: 'Kannada' }, { code: 'gu', label: 'Gujarati' },
  { code: 'pa', label: 'Punjabi' }, { code: 'ja', label: 'Japanese' },
];

// ── Step indicator ────────────────────────────────────────────────────────────

const STEPS: { id: PipelineStep; label: string; icon: React.ElementType }[] = [
  { id: 'brief',      label: 'Brief',       icon: Film         },
  { id: 'settings',   label: 'Settings',    icon: Settings2    },
  { id: 'characters', label: 'Characters',  icon: Users        },
  { id: 'world',      label: 'World',       icon: Globe        },
  { id: 'storyboard', label: 'Storyboard',  icon: LayoutGrid   },
  { id: 'keyframes',  label: 'Keyframes',   icon: Clapperboard },
  { id: 'render',     label: 'Video',       icon: Play         },
  { id: 'timeline',   label: 'Timeline',    icon: Scissors     },
];

function StepNav({ current, completed, onNavigate }: {
  current: PipelineStep;
  completed: PipelineStep[];
  onNavigate: (s: PipelineStep) => void;
}) {
  const currentIdx = STEPS.findIndex(s => s.id === current);
  return (
    <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-1">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isDone = completed.includes(step.id);
        const isActive = step.id === current;
        const isReachable = i <= currentIdx || isDone;
        return (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => isReachable && onNavigate(step.id)}
              disabled={!isReachable}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all',
                isActive  && 'bg-[#C9A96E]/15 text-[#C9A96E] border border-[#C9A96E]/30',
                isDone && !isActive && 'text-[#7abf8e] hover:bg-white/4 cursor-pointer',
                !isDone && !isActive && isReachable && 'text-[#555] hover:bg-white/4 cursor-pointer',
                !isReachable && 'text-[#333] cursor-not-allowed',
              )}>
              {isDone && !isActive ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
              <span className="whitespace-nowrap">{step.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-[#222] flex-shrink-0 mx-0.5" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function CraftVideoPage() {
  const { currentProject } = useProjectsStore();
  const brandMemory = useBrandMemoryStore();
  const memory = currentProject ? brandMemory.getMemory(currentProject.id) : null;

  const [step, setStep]                 = useState<PipelineStep>('brief');
  const [completed, setCompleted]       = useState<PipelineStep[]>([]);

  // Brief
  const [script, setScript]             = useState('');
  const [selectedTemplate, setTemplate] = useState<string | null>(null);

  // Settings
  const [language, setLanguage]         = useState('en');
  const [aspect, setAspect]             = useState('16:9');
  const [resolution, setResolution]     = useState('1080p');
  const [model, setModel]               = useState('kling-2.0');
  const [workflow, setWorkflow]         = useState('keyframes-to-video');
  const [style, setStyle]               = useState('cinematic');
  const [tone, setTone]                 = useState('Warm & Emotional');
  const [generateAudio, setGenAudio]    = useState(true);

  // Characters + World
  const [charDescription, setCharDesc] = useState('');
  const [worldNotes, setWorldNotes]    = useState('');
  const [propsNotes, setPropsNotes]    = useState('');

  // Storyboard
  const [storyboardConfirmed, setBoardConfirmed] = useState(false);
  const [generating, setGenerating]              = useState(false);
  const [genStep, setGenStep]                     = useState('');

  // Mock storyboard data
  const storyboardRows = script
    ? [
        { shot: 1, scene: 'Opening', duration: '8s',  action: 'Establishing wide shot — world introduced',                    status: 'ready' },
        { shot: 2, scene: 'Act 1',   duration: '12s', action: 'Protagonist introduced in their everyday environment',          status: 'ready' },
        { shot: 3, scene: 'Act 1',   duration: '10s', action: 'Inciting moment — something shifts',                           status: 'ready' },
        { shot: 4, scene: 'Act 2',   duration: '15s', action: 'Rising tension — the challenge becomes real',                   status: 'ready' },
        { shot: 5, scene: 'Act 2',   duration: '12s', action: 'Brand moment — appears as an enabler, quietly',                status: 'ready' },
        { shot: 6, scene: 'Act 3',   duration: '13s', action: 'Resolution — transformation, not triumph',                     status: 'ready' },
      ]
    : [];

  const [keyframesGenerated, setKeyframesGenerated] = useState<Record<number, 'pending' | 'generating' | 'done' | 'failed'>>({});
  const [videosGenerated, setVideosGenerated]        = useState<Record<number, 'pending' | 'generating' | 'done' | 'failed'>>({});

  const advance = (from: PipelineStep, to: PipelineStep) => {
    setCompleted(prev => [...new Set([...prev, from])]);
    setStep(to);
  };

  const simulateGeneration = async (
    label: string,
    items: number[],
    setter: React.Dispatch<React.SetStateAction<Record<number, 'pending' | 'generating' | 'done' | 'failed'>>>,
    onDone: () => void
  ) => {
    setGenerating(true);
    for (const item of items) {
      setGenStep(`${label} ${item}…`);
      setter(p => ({ ...p, [item]: 'generating' }));
      await new Promise(r => setTimeout(r, 1200));
      setter(p => ({ ...p, [item]: 'done' }));
    }
    setGenerating(false);
    setGenStep('');
    onDone();
  };

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors";
  const selectClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E]/50 transition-colors appearance-none";

  return (
    <div className="min-h-full" style={{ background: '#0A0A0C' }}>
      <SEO title="Video Generation" noIndex />
      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="flex items-center gap-2 mb-6">
          <Film className="w-4 h-4 text-[#C9A96E]" />
          <h1 className="text-lg font-light text-[#F0EDE8]">Video Production</h1>
          {memory?.brief?.bigIdea && (
            <span className="text-[11px] text-[#555] ml-2">Brief: {memory.brief.bigIdea.slice(0, 50)}…</span>
          )}
        </div>

        <StepNav current={step} completed={completed} onNavigate={setStep} />

        {/* ── Step: Brief ──────────────────────────────────────────────────── */}
        {step === 'brief' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-light text-[#F0EDE8] mb-1">What's the video about?</h2>
              <p className="text-sm text-[#555]">Paste your script, use a template, or describe the video in plain language.</p>
            </div>

            {/* Template grid */}
            <div>
              <p className="text-[11px] text-[#555] uppercase tracking-wider mb-2">Start with a template</p>
              <div className="grid grid-cols-2 gap-2">
                {VIDEO_TEMPLATES.filter(t => t.isFeatured).slice(0, 4).map(t => (
                  <button key={t.id}
                    onClick={() => { setTemplate(t.id); setScript(t.prompt.slice(0, 300) + '…'); }}
                    className={cn('text-left p-3 rounded-xl border transition-all',
                      selectedTemplate === t.id ? 'border-[#C9A96E]/40 bg-[#C9A96E]/6' : 'border-white/6 hover:border-white/15'
                    )}>
                    <p className={cn('text-xs font-medium mb-0.5', selectedTemplate === t.id ? 'text-[#C9A96E]' : 'text-[#F0EDE8]')}>{t.label}</p>
                    <p className="text-[10px] text-[#444] leading-relaxed">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] text-[#555] uppercase tracking-wider mb-2">Script or brief</p>
              <textarea value={script} onChange={e => setScript(e.target.value)} rows={8}
                placeholder="Paste your full script here, or describe the video: 'A 30-second ad about a chai brand that celebrates morning routines in small-town India. Emotional, quiet, family-centred.'"
                className={`${inputClass} resize-none leading-relaxed font-mono text-[13px]`} />
            </div>

            <button onClick={() => { if (script.trim()) advance('brief', 'settings'); }}
              disabled={!script.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all">
              Continue to Settings <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Step: Settings ───────────────────────────────────────────────── */}
        {step === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-light text-[#F0EDE8] mb-1">Production Settings</h2>
              <p className="text-sm text-[#555]">Configure the technical and aesthetic parameters before generation begins.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className={selectClass}>
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Aspect Ratio</label>
                <div className="flex gap-1.5 flex-wrap">
                  {ASPECT_RATIOS.map(ar => (
                    <button key={ar.id} onClick={() => setAspect(ar.id)}
                      className={cn('px-2.5 py-1.5 rounded-lg border text-[11px] transition-all',
                        aspect === ar.id ? 'border-[#C9A96E]/40 bg-[#C9A96E]/10 text-[#C9A96E]' : 'border-white/8 text-[#555] hover:border-white/20'
                      )}>
                      {ar.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Video Model</label>
              <div className="space-y-2">
                {VIDEO_MODELS.map(m => (
                  <button key={m.id} onClick={() => setModel(m.id)}
                    className={cn('w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all',
                      model === m.id ? 'border-[#C9A96E]/40 bg-[#C9A96E]/6' : 'border-white/6 hover:border-white/15'
                    )}>
                    <div className="flex items-center gap-3">
                      <div className={cn('w-2 h-2 rounded-full', model === m.id ? 'bg-[#C9A96E]' : 'bg-white/15')} />
                      <div>
                        <span className={cn('text-xs font-medium', model === m.id ? 'text-[#C9A96E]' : 'text-[#F0EDE8]')}>{m.label}</span>
                        <span className="text-[10px] text-[#555] ml-2">{m.desc}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full',
                        m.tier === 'ultra' ? 'text-[#C9A96E] bg-[#C9A96E]/10' : 'text-[#7abf8e] bg-[#7abf8e]/10'
                      )}>{m.tier}</span>
                      <span className="text-[10px] text-[#444]">{m.credits} credits</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Generation Workflow</label>
              <div className="space-y-2">
                {GENERATION_WORKFLOWS.map(wf => (
                  <button key={wf.id} onClick={() => setWorkflow(wf.id)}
                    className={cn('w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all',
                      workflow === wf.id ? 'border-[#C9A96E]/40 bg-[#C9A96E]/6' : 'border-white/6 hover:border-white/15'
                    )}>
                    <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', workflow === wf.id ? 'bg-[#C9A96E]' : 'bg-white/15')} />
                    <div>
                      <p className={cn('text-xs font-medium', workflow === wf.id ? 'text-[#C9A96E]' : 'text-[#F0EDE8]')}>{wf.label}</p>
                      <p className="text-[10px] text-[#555] mt-0.5">{wf.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Visual Style</label>
                <select value={style} onChange={e => setStyle(e.target.value)} className={selectClass}>
                  {VIDEO_STYLES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className={selectClass}>
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-white/6" style={{ background: '#0D0D10' }}>
              <div className="flex items-center gap-3">
                <Mic className="w-4 h-4 text-[#555]" />
                <div>
                  <p className="text-xs font-medium text-[#F0EDE8]">Generate Audio</p>
                  <p className="text-[11px] text-[#555]">Auto-generate voiceover and music for this video</p>
                </div>
              </div>
              <button onClick={() => setGenAudio(a => !a)}
                className={cn('w-10 h-5 rounded-full transition-all relative', generateAudio ? 'bg-[#C9A96E]' : 'bg-white/15')}>
                <span className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all', generateAudio ? 'right-0.5' : 'left-0.5')} />
              </button>
            </div>

            <button onClick={() => advance('settings', 'characters')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 transition-all">
              Design Characters <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Step: Characters ─────────────────────────────────────────────── */}
        {step === 'characters' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-light text-[#F0EDE8] mb-1">Character Design</h2>
              <p className="text-sm text-[#555]">Define the visual appearance of each character. This locks them for consistency across all generated frames.</p>
            </div>

            {memory?.characters && memory.characters.length > 0 && (
              <div className="px-4 py-3 rounded-xl bg-[#7abf8e]/8 border border-[#7abf8e]/20">
                <p className="text-xs font-medium text-[#7abf8e] mb-1">Characters from Brand Memory</p>
                {memory.characters.map(c => (
                  <p key={c.id} className="text-[11px] text-[#555]">{c.name} · {c.role} · {c.physicalDescription}</p>
                ))}
              </div>
            )}

            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Protagonist</label>
              <textarea value={charDescription} onChange={e => setCharDesc(e.target.value)} rows={4}
                placeholder="Describe your main character: age, appearance, clothing signature, posture, energy. Be specific — this description locks the character's visual identity across all shots.

Example: Indian woman, late 30s, short natural hair with grey streaks, always wearing a hand-woven cotton dupatta, warm eyes, strong hands. She carries herself like someone who has earned her confidence slowly."
                className={`${inputClass} resize-none font-mono text-[13px] leading-relaxed`} />
            </div>

            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Supporting Characters (optional)</label>
              <textarea rows={2}
                placeholder="Describe any supporting characters briefly…"
                className={`${inputClass} resize-none`} />
            </div>

            <button onClick={() => advance('characters', 'world')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 transition-all">
              Build the World <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Step: World ──────────────────────────────────────────────────── */}
        {step === 'world' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-light text-[#F0EDE8] mb-1">World & Props</h2>
              <p className="text-sm text-[#555]">Define the visual environment and key objects. These become consistent across all shots.</p>
            </div>

            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">World / Environment</label>
              <textarea value={worldNotes} onChange={e => setWorldNotes(e.target.value)} rows={4}
                placeholder="Describe the visual world: locations, time of day, light quality, architectural character, colour temperature.

Example: A small Rajasthan town at golden hour. Ochre walls, soft dust, neem trees. The evening call to prayer can be heard in the distance. Everyone knows everyone. Time moves differently here."
                className={`${inputClass} resize-none font-mono text-[13px] leading-relaxed`} />
            </div>

            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Key Props & Objects</label>
              <textarea value={propsNotes} onChange={e => setPropsNotes(e.target.value)} rows={2}
                placeholder="List any specific objects that appear in multiple shots and must remain visually consistent…"
                className={`${inputClass} resize-none`} />
            </div>

            <button
              onClick={async () => {
                advance('world', 'storyboard');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 transition-all">
              Generate Storyboard <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Step: Storyboard ─────────────────────────────────────────────── */}
        {step === 'storyboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-light text-[#F0EDE8] mb-1">Storyboard</h2>
              <p className="text-sm text-[#555]">The storyboard agent has read your full script and broken it into shots. Review before keyframe generation.</p>
            </div>

            <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: '#0D0D10' }}>
              <div className="grid grid-cols-12 px-4 py-2 border-b border-white/6 bg-white/3">
                {['Shot', 'Scene', 'Duration', 'Key Action'].map(h => (
                  <span key={h} className={cn('text-[11px] text-[#444] uppercase tracking-wider', h === 'Key Action' ? 'col-span-7' : 'col-span-' + (h === 'Shot' ? '1' : '2'))}>{h}</span>
                ))}
              </div>
              {storyboardRows.map((row, i) => (
                <div key={i} className="grid grid-cols-12 px-4 py-3 border-b border-white/4 last:border-0 items-center">
                  <span className="col-span-1 text-xs font-mono text-[#C9A96E]">{row.shot}</span>
                  <span className="col-span-2 text-xs text-[#555]">{row.scene}</span>
                  <span className="col-span-2 text-xs text-[#555] flex items-center gap-1"><Clock className="w-3 h-3" />{row.duration}</span>
                  <span className="col-span-7 text-xs text-[#888]">{row.action}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/6" style={{ background: '#0D0D10' }}>
              <div>
                <p className="text-xs font-medium text-[#F0EDE8]">Total runtime: ~70 seconds</p>
                <p className="text-[11px] text-[#555]">6 shots · ready for keyframe generation</p>
              </div>
              <span className="text-[11px] text-[#7abf8e] flex items-center gap-1"><Check className="w-3 h-3" />Storyboard complete</span>
            </div>

            <div>
              <p className="text-[11px] text-[#555] uppercase tracking-wider mb-2">Keyframe Generation Options</p>
              <div className="space-y-2">
                {[
                  { label: 'Generate all 6 keyframes at once',              value: 'all'     },
                  { label: 'Generate shots 1–3 first, then continue',       value: 'half'    },
                  { label: 'Generate shots 1–2 as a style preview',         value: 'preview' },
                ].map(opt => (
                  <button key={opt.value} onClick={() => {
                    setBoardConfirmed(true);
                    const shots = opt.value === 'all' ? [1,2,3,4,5,6] : opt.value === 'half' ? [1,2,3] : [1,2];
                    const initial: Record<number, 'pending' | 'generating' | 'done' | 'failed'> = {};
                    [1,2,3,4,5,6].forEach(n => { initial[n] = shots.includes(n) ? 'pending' : 'pending'; });
                    setKeyframesGenerated(initial);
                    advance('storyboard', 'keyframes');
                    setTimeout(() => {
                      simulateGeneration('Keyframe', shots, setKeyframesGenerated, () => {});
                    }, 200);
                  }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/6 hover:border-white/20 text-left transition-all">
                    <span className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0" />
                    <span className="text-xs text-[#888]">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step: Keyframes ──────────────────────────────────────────────── */}
        {step === 'keyframes' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-light text-[#F0EDE8] mb-1">Keyframe Generation</h2>
              <p className="text-sm text-[#555]">Reference images for each shot. These lock the visual style before video generation begins.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {storyboardRows.map(row => {
                const status = keyframesGenerated[row.shot];
                return (
                  <div key={row.shot} className="rounded-xl border border-white/6 overflow-hidden" style={{ background: '#0D0D10' }}>
                    <div className={cn(
                      'aspect-video flex items-center justify-center',
                      status === 'done' ? 'bg-gradient-to-br from-[#1A1A2A] to-[#2A1A1A]' :
                      status === 'generating' ? 'bg-[#C9A96E]/5' : 'bg-white/3'
                    )}>
                      {status === 'generating' && <Loader2 className="w-5 h-5 text-[#C9A96E] animate-spin" />}
                      {status === 'done' && (
                        <div className="w-full h-full flex items-center justify-center relative">
                          <Clapperboard className="w-6 h-6 text-[#555]" />
                          <span className="absolute bottom-1 right-1 text-[10px] text-[#7abf8e]">✓</span>
                        </div>
                      )}
                      {!status && <span className="text-[10px] text-[#333]">Shot {row.shot}</span>}
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] text-[#555] truncate">{row.action.slice(0, 40)}…</p>
                      <p className="text-[10px] font-mono text-[#444] mt-0.5">{row.duration}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {Object.values(keyframesGenerated).every(s => s === 'done') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#7abf8e]/20 bg-[#7abf8e]/5">
                  <p className="text-xs font-medium text-[#7abf8e]">All 6 keyframes generated</p>
                  <span className="text-[11px] text-[#555]">Ready for video generation</span>
                </div>

                <p className="text-[11px] text-[#555] uppercase tracking-wider">Video Generation Options</p>
                {[
                  { label: 'Generate all 6 videos',             value: 'all'     },
                  { label: 'Generate segments 1–3 first',       value: 'half'    },
                  { label: 'Generate segments 1–2 as test run', value: 'preview' },
                ].map(opt => (
                  <button key={opt.value} onClick={() => {
                    const shots = opt.value === 'all' ? [1,2,3,4,5,6] : opt.value === 'half' ? [1,2,3] : [1,2];
                    const initial: Record<number, 'pending' | 'generating' | 'done' | 'failed'> = {};
                    [1,2,3,4,5,6].forEach(n => { initial[n] = 'pending'; });
                    setVideosGenerated(initial);
                    advance('keyframes', 'render');
                    setTimeout(() => {
                      simulateGeneration('Video segment', shots, setVideosGenerated, () => {
                        setTimeout(() => advance('render', 'timeline'), 500);
                      });
                    }, 200);
                  }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/6 hover:border-white/20 text-left transition-all">
                    <span className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0" />
                    <span className="text-xs text-[#888]">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step: Render (video generation) ─────────────────────────────── */}
        {step === 'render' && (
          <div className="space-y-6">
            <h2 className="text-base font-light text-[#F0EDE8] mb-1">Video Generation</h2>

            <div className="rounded-2xl border border-white/6 overflow-hidden" style={{ background: '#0D0D10' }}>
              <div className="grid grid-cols-12 px-4 py-2 border-b border-white/6 bg-white/3">
                {['Segment', 'Description', 'Status'].map(h => (
                  <span key={h} className={cn('text-[11px] text-[#444] uppercase tracking-wider', h === 'Description' ? 'col-span-7' : 'col-span-2' + (h === 'Status' ? ' text-right' : ''))}>{h}</span>
                ))}
              </div>
              {storyboardRows.map(row => {
                const status = videosGenerated[row.shot];
                return (
                  <div key={row.shot} className="grid grid-cols-12 px-4 py-3 border-b border-white/4 last:border-0 items-center">
                    <span className="col-span-2 text-xs text-[#C9A96E] font-mono">{row.shot}</span>
                    <span className="col-span-7 text-xs text-[#555]">{row.action.slice(0, 50)}…</span>
                    <span className={cn('col-span-3 text-xs text-right',
                      status === 'done' ? 'text-[#7abf8e]' :
                      status === 'generating' ? 'text-[#C9A96E]' : 'text-[#333]'
                    )}>
                      {status === 'done' ? '✓ Done' : status === 'generating' ? <><Loader2 className="w-3 h-3 inline animate-spin mr-1" />Generating</> : '—'}
                    </span>
                  </div>
                );
              })}
            </div>

            {generating && (
              <div className="flex items-center gap-2 text-xs text-[#C9A96E]">
                <Loader2 className="w-4 h-4 animate-spin" />
                {genStep}
              </div>
            )}
          </div>
        )}

        {/* ── Step: Timeline ───────────────────────────────────────────────── */}
        {step === 'timeline' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-light text-[#F0EDE8] mb-1">Timeline Editor</h2>
                <p className="text-sm text-[#555]">All shots assembled. Trim, reorder, and render.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A96E] text-[#08080A] rounded-xl text-xs font-medium hover:opacity-90 transition-all">
                <Download className="w-3.5 h-3.5" /> Render Final Video
              </button>
            </div>

            {/* Shot list */}
            <div className="space-y-1.5">
              {storyboardRows.map(row => (
                <div key={row.shot} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/6 hover:border-white/12 transition-all" style={{ background: '#0D0D10' }}>
                  <span className="text-[11px] font-mono text-[#C9A96E] w-5">{row.shot}</span>
                  <div className="w-12 h-7 rounded bg-gradient-to-r from-[#1A1A2A] to-[#2A1A1A] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[#7abf8e]" />
                  </div>
                  <span className="text-xs text-[#555] flex-1 truncate">{row.action}</span>
                  <span className="text-[11px] text-[#444] font-mono flex items-center gap-1"><Clock className="w-3 h-3" />{row.duration}</span>
                </div>
              ))}
            </div>

            {/* Timeline bar */}
            <div className="rounded-2xl border border-white/6 p-4 overflow-x-auto" style={{ background: '#0D0D10' }}>
              <p className="text-[11px] text-[#444] mb-3">Timeline · Total: ~70s</p>
              <div className="flex gap-1 h-12">
                {storyboardRows.map(row => {
                  const width = parseInt(row.duration) / 70 * 100;
                  return (
                    <div key={row.shot} className="rounded-lg flex items-center justify-center text-[10px] font-medium cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ width: `${width}%`, minWidth: 40, background: `rgba(201,169,110,${0.12 + row.shot * 0.05})`, border: '1px solid rgba(201,169,110,0.2)' }}>
                      <span className="text-[#C9A96E] font-mono">S{row.shot}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setStep('brief'); setCompleted([]); setScript(''); setKeyframesGenerated({}); setVideosGenerated({}); }}
                className="flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl text-xs text-[#666] hover:border-white/20 transition-all">
                <RefreshCw className="w-3.5 h-3.5" /> New video
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-[#C9A96E] text-[#08080A] rounded-xl text-xs font-medium hover:opacity-90 transition-all">
                <Download className="w-3.5 h-3.5" /> Render & export
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
