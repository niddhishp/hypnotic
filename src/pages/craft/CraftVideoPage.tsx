import { useState } from 'react';
import {
  Upload, Plus, RefreshCw, Play, Download, Send, ChevronDown,
  Sparkles, Check, Edit3, Film, X, Pause, Volume2, Maximize2,
  ChevronLeft, ChevronRight, Grid, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VIDEO_MODELS, IMAGE_MODELS, getTierColor, type CraftModel } from '@/lib/craft/models';

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = 'canvas' | 'script' | 'characters' | 'storyboard' | 'timeline';

const STAGES: { id: Stage; label: string }[] = [
  { id: 'canvas',     label: 'Canvas'     },
  { id: 'script',     label: 'Script'     },
  { id: 'characters', label: 'Characters' },
  { id: 'storyboard', label: 'Storyboard' },
  { id: 'timeline',   label: 'TimeLine'   },
];

const RESOLUTIONS = ['16:9', '9:16', '1:1'] as const;
const QUALITIES   = ['720p', '1080p', '4K'] as const;
const DURATIONS   = ['Auto (5s)', 'Auto (8s)', 'Auto (12s)', '5s', '10s'] as const;

interface Entity {
  id: string; name: string; type: 'character' | 'scene';
  description: string; color: string;
}

interface Shot {
  id: string; num: number; description: string;
  entities: string[];
  images: Array<{ status: 'empty' | 'generating' | 'done' }>;
  video: { status: 'empty' | 'generating' | 'done' | 'error'; duration?: string };
  approved: boolean;
}

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_ENTITIES: Entity[] = [
  { id: 'public-figure',    name: 'Public-Figure',    type: 'character', color: '#7aaee0',
    description: 'A stylized minimalist character, reminiscent of R. K. Laxman\'s editorial cartoons. He floats in a void. A white, translucent \'reputation cloth\' flows from his head.' },
  { id: 'the-world',        name: 'The-World',        type: 'character', color: '#e07a7a',
    description: 'Minimalist monochrome ink illustration of a symbolic Indian male figure representing media and public opinion. He has a slightly dishevelled appearance.' },
  { id: 'mind-void',        name: 'Mind-Void',        type: 'scene',     color: '#a07ae0',
    description: 'An infinite, pitch-black space representing the internal psychological landscape. Deep space with swirling ink patterns.' },
  { id: 'the-world-scene',  name: 'The-World-Scene',  type: 'scene',     color: '#C9A96E',
    description: 'A stark, pure white environment where The World resides. Minimalist ink wash landscape.' },
  { id: 'ink-footprints',   name: 'Ink-Footprints',   type: 'scene',     color: '#7abf8e',
    description: 'Detailed footprints made of liquid ink on a white surface, spreading and fading.' },
];

const DEMO_SHOTS: Shot[] = [
  {
    id: 's1', num: 1, approved: true,
    entities: ['public-figure', 'the-world-scene', 'ink-footprints'],
    description: `0-3s: Wide shot — [@The-World-Scene] white void. [@Public-Figure] stands centered, motionless, facing forward with calm composure.
3-7s: Medium shot — camera slowly circles behind [@Public-Figure]. Faint [@Ink-Footprints] begin to materialise softly on the ground behind him, one by one.
7-10s: Close-up — the ink footprints on the ground, appearing silently, growing slightly darker. [@Public-Figure]'s feet visible at top of frame, unmoving.
10-12s: Medium shot — back to frontal view of [@Public-Figure], expression neutral, unaware. The footprints behind him continue to multiply quietly.`,
    images: [{ status: 'done' }, { status: 'done' }],
    video: { status: 'done', duration: '12s' },
  },
  {
    id: 's2', num: 2, approved: false,
    entities: ['public-figure', 'ink-footprints'],
    description: `0-3s: Medium shot — [@Public-Figure] turns and notices the footprints behind him. He crouches slightly, reaching down toward them.
3-6s: Close-up — his hand sweeping across the floor where [@Ink-Footprints] lie. The ink smears and fades as he wipes.
6-9s: Extreme close-up — the wiped area. The footprints are mostly gone but faint grey ghost-shadows linger on the white surface.
9-12s: Medium wide shot — [@Public-Figure] stands upright, examining the floor. The ghost shadows of [@Ink-Footprints] remain visible behind him.`,
    images: [{ status: 'done' }, { status: 'empty' }],
    video: { status: 'error' },
  },
  {
    id: 's3', num: 3, approved: false,
    entities: ['the-world', 'public-figure', 'ink-footprints'],
    description: `0-3s: Medium shot — [@The-World] materialises from the edge of the white void [@The-World-Scene], stepping calmly into the frame with one hand extended forward.
3-6s: Close-up — [@The-World]'s finger descends and presses onto one of the remaining [@Ink-Footprints] on the floor.
6-10s: Top-down wide shot — the pressed footprint erupts, ink spreading like liquid in water, branching outward across the floor in fractal patterns.`,
    images: [{ status: 'done' }, { status: 'empty' }],
    video: { status: 'empty' },
  },
];

const SAMPLE_SCRIPT = `FADE IN:

INT. THE WORLD-SCENE — WHITE VOID — DAY

A pure white environment, infinite in every direction.
No walls. No horizon. Just whiteness.

PUBLIC-FIGURE stands centered, motionless, facing forward.
Calm. Composed. Unaware.

                         NARRATOR (V.O.)
               Every public figure walks a path.
               Some paths are chosen. Others are written.

Faint INK FOOTPRINTS begin materialising softly on the ground behind him.
One by one. Like ink soaking into paper.

CUT TO:

CLOSE-UP — The footprints growing slightly darker.
PUBLIC-FIGURE's feet visible at top of frame. Unmoving.

                         NARRATOR (V.O.)
               But what happens when those paths
               start to write themselves?

MEDIUM SHOT — back to frontal view.
PUBLIC-FIGURE's expression: neutral. Unaware. Still.

THE WORLD appears at frame edge, watching.

FADE TO:`;

// ─── Model Dropdown ───────────────────────────────────────────────────────────

function ModelDropdown({ models, selected, onSelect, label }: {
  models: CraftModel[]; selected: CraftModel;
  onSelect: (m: CraftModel) => void; label?: string;
}) {
  const [open, setOpen] = useState(false);
  const tc = getTierColor(selected.tier);
  return (
    <div className="relative">
      {label && <div className="text-[9px] text-[#555] uppercase tracking-wider mb-1">{label}</div>}
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/3 hover:border-white/20 transition-colors text-[11px] w-full">
        <span className="font-medium text-[#F0EDE8] truncate flex-1 text-left">{selected.name}</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded flex-shrink-0" style={{ color: tc, background: `${tc}18` }}>{selected.tier.toUpperCase()}</span>
        <ChevronDown className={cn('w-3 h-3 text-[#555] flex-shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute bottom-full left-0 mb-1 w-80 bg-[#111115] border border-white/12 rounded-xl shadow-2xl z-[100] overflow-hidden">
          <div className="p-1.5 max-h-80 overflow-y-auto space-y-0.5">
            {models.map(m => {
              const tc2 = getTierColor(m.tier);
              return (
                <button key={m.id} onClick={() => { onSelect(m); setOpen(false); }}
                  className={cn('w-full text-left p-2.5 rounded-lg transition-all hover:bg-white/5',
                    selected.id === m.id && 'bg-[#C9A96E]/10 border border-[#C9A96E]/20'
                  )}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-[#F0EDE8]">{m.name}</span>
                    <div className="flex items-center gap-1">
                      {m.new && <span className="text-[8px] px-1 py-0.5 rounded bg-[#7abf8e]/15 text-[#7abf8e]">NEW</span>}
                      {m.recommended && <span className="text-[8px] px-1 py-0.5 rounded bg-[#C9A96E]/15 text-[#C9A96E]">★ REC</span>}
                      <span className="text-[9px] px-1 py-0.5 rounded" style={{ color: tc2, background: `${tc2}18` }}>{m.tier}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#555] mb-1.5">{m.description}</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(m.capabilities).filter(([,v]) => v).slice(0, 4).map(([k]) => (
                      <span key={k} className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-[#555]">{k.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                    ))}
                    {m.maxDuration && <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-[#555]">up to {m.maxDuration}s</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

function RightPanel({ stage, entities, chatMsgs, chatInput, onChatInput, onChatSend,
  videoModel, onVideoModel, imageModel, onImageModel,
  resolution, onResolution, quality, onQuality, duration, onDuration, audioEnabled, onAudioToggle,
}: {
  stage: Stage; entities: Entity[];
  chatMsgs: Array<{ role: string; text: string }>;
  chatInput: string; onChatInput: (v: string) => void; onChatSend: () => void;
  videoModel: CraftModel; onVideoModel: (m: CraftModel) => void;
  imageModel: CraftModel; onImageModel: (m: CraftModel) => void;
  resolution: string; onResolution: (v: string) => void;
  quality: string; onQuality: (v: string) => void;
  duration: string; onDuration: (v: string) => void;
  audioEnabled: boolean; onAudioToggle: () => void;
}) {
  const [resOpen, setResOpen] = useState(false);
  const [qualOpen, setQualOpen] = useState(false);
  const [durOpen, setDurOpen] = useState(false);

  const renderWithEntities = (text: string) => {
    return text.split(/(@[\w-]+)/g).map((part, i) => {
      if (part.startsWith('@')) {
        const eid = part.slice(1).toLowerCase();
        const entity = entities.find(e => e.name.toLowerCase() === eid);
        if (entity) return <span key={i} style={{ color: entity.color, fontWeight: 600 }}>{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const agentLabel = stage === 'script' ? 'Screenwriter Agent' :
    stage === 'characters' ? 'Character Agent' :
    stage === 'storyboard' ? 'Director Agent' :
    stage === 'timeline'   ? 'Editor Agent'   : 'Director Agent';

  return (
    <div className="w-[300px] flex flex-col border-l border-white/8 flex-shrink-0" style={{ background: '#0D0D10' }}>
      {/* Entity thumbnails */}
      <div className="p-3 border-b border-white/8">
        <div className="flex gap-1.5 flex-wrap">
          {entities.map(e => (
            <div key={e.id} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center"
                style={{ borderColor: `${e.color}30` }}>
                <span className="text-[8px] font-semibold" style={{ color: e.color }}>
                  {e.name.split('-').map(w => w[0]).join('').slice(0, 2)}
                </span>
              </div>
              <span className="text-[7px] text-[#555] w-10 text-center truncate leading-tight">{e.name.split('-')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {chatMsgs.map((m, i) => (
          <div key={i} className={m.role === 'agent' ? '' : 'flex justify-end'}>
            {m.role === 'agent' ? (
              <div>
                {i === 0 && <div className="text-[9px] text-[#444] mb-1.5 font-medium uppercase tracking-wide">{agentLabel}</div>}
                <div className="text-[11px] text-[#A0998F] leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                  {renderWithEntities(m.text)}
                </div>
              </div>
            ) : (
              <div className="bg-[#C9A96E]/12 border border-[#C9A96E]/20 rounded-xl rounded-tr-none px-3 py-2 text-[11px] text-[#F0EDE8] max-w-[90%]">
                {m.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Model + settings */}
      <div className="border-t border-white/8 p-3 space-y-2">
        {stage === 'storyboard' || stage === 'timeline' || stage === 'canvas' ? (
          <ModelDropdown models={VIDEO_MODELS} selected={videoModel} onSelect={onVideoModel} label="Video Model" />
        ) : stage === 'characters' ? (
          <ModelDropdown
            models={IMAGE_MODELS.filter(m => ['auto','seedream-4-5','seedream-5-lite','mystic-2-5','flux-2-pro'].includes(m.id))}
            selected={imageModel} onSelect={onImageModel} label="Image Model"
          />
        ) : null}

        {/* Resolution/Quality/Duration/Audio */}
        <div className="flex gap-1">
          {/* Resolution */}
          <div className="relative flex-1">
            <button onClick={() => { setResOpen(!resOpen); setQualOpen(false); setDurOpen(false); }}
              className="w-full flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg border border-white/10 bg-white/3 hover:border-white/20 text-[10px] text-[#C0B8AC]">
              {resolution} <ChevronDown className="w-2.5 h-2.5 text-[#555]" />
            </button>
            {resOpen && (
              <div className="absolute bottom-full left-0 mb-1 bg-[#111115] border border-white/12 rounded-lg shadow-xl z-50 w-20">
                {RESOLUTIONS.map(r => (
                  <button key={r} onClick={() => { onResolution(r); setResOpen(false); }}
                    className={cn('w-full px-3 py-1.5 text-[10px] text-left hover:bg-white/5', resolution === r && 'text-[#C9A96E]')}>
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Quality */}
          <div className="relative flex-1">
            <button onClick={() => { setQualOpen(!qualOpen); setResOpen(false); setDurOpen(false); }}
              className="w-full flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg border border-white/10 bg-white/3 hover:border-white/20 text-[10px] text-[#C0B8AC]">
              {quality} <ChevronDown className="w-2.5 h-2.5 text-[#555]" />
            </button>
            {qualOpen && (
              <div className="absolute bottom-full left-0 mb-1 bg-[#111115] border border-white/12 rounded-lg shadow-xl z-50 w-24">
                {QUALITIES.map(q => (
                  <button key={q} onClick={() => { onQuality(q); setQualOpen(false); }}
                    className={cn('w-full px-3 py-1.5 text-[10px] text-left hover:bg-white/5', quality === q && 'text-[#C9A96E]')}>
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Duration */}
          <div className="relative flex-[1.4]">
            <button onClick={() => { setDurOpen(!durOpen); setResOpen(false); setQualOpen(false); }}
              className="w-full flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg border border-white/10 bg-white/3 hover:border-white/20 text-[10px] text-[#C0B8AC] whitespace-nowrap">
              {duration} <ChevronDown className="w-2.5 h-2.5 text-[#555]" />
            </button>
            {durOpen && (
              <div className="absolute bottom-full right-0 mb-1 bg-[#111115] border border-white/12 rounded-lg shadow-xl z-50 w-28">
                {DURATIONS.map(d => (
                  <button key={d} onClick={() => { onDuration(d); setDurOpen(false); }}
                    className={cn('w-full px-3 py-1.5 text-[10px] text-left hover:bg-white/5', duration === d && 'text-[#C9A96E]')}>
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Audio */}
          <button onClick={onAudioToggle}
            className={cn('px-2.5 py-1.5 rounded-lg border text-[10px] transition-all flex items-center gap-1 whitespace-nowrap',
              audioEnabled ? 'border-[#C9A96E]/40 bg-[#C9A96E]/10 text-[#C9A96E]' : 'border-white/10 bg-white/3 text-[#555]')}>
            <Volume2 className="w-3 h-3" />
            <span>Audio</span>
          </button>
        </div>

        {stage === 'storyboard' && (
          <div className="text-[9px] text-[#555] bg-white/3 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
            <span>Storyboard Estimation</span>
            <span className="text-[#C9A96E] font-medium">~920 credits</span>
          </div>
        )}
      </div>

      {/* Chat input */}
      <div className="p-3 pt-0 flex gap-2">
        <input value={chatInput} onChange={e => onChatInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && chatInput.trim()) onChatSend(); }}
          placeholder={
            stage === 'storyboard' ? 'Tell the director what to shoot…' :
            stage === 'characters' ? 'Describe a character or scene…' :
            stage === 'script'     ? 'Tell the screenwriter your idea…' :
            stage === 'timeline'   ? 'Tell the editor how to cut…' :
            'Chat with your agent…'
          }
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40"
        />
        <button onClick={onChatSend}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#C9A96E] text-[#08080A] hover:opacity-90 flex-shrink-0">
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Canvas Stage ─────────────────────────────────────────────────────────────

function CanvasStage({ onNext }: { onNext: () => void }) {
  const [idea, setIdea] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const STYLES = [
    { id: 'minimalist-ink', label: 'Minimalist Ink',  emoji: '🖊️', rec: true  },
    { id: 'cinematic',      label: 'Cinematic',        emoji: '🎬', rec: false },
    { id: 'documentary',    label: 'Documentary',      emoji: '📹', rec: false },
    { id: 'animation',      label: 'Animation',        emoji: '✏️', rec: false },
    { id: 'commercial',     label: 'Commercial',       emoji: '📱', rec: false },
    { id: 'neo-noir',       label: 'Neo-Noir',         emoji: '🌑', rec: false },
  ];

  return (
    <div className="flex-1 flex items-start justify-start px-12 py-10 overflow-y-auto">
      <div className="w-full max-w-xl space-y-8">
        <div>
          <div className="text-[10px] text-[#555] uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
            <Film className="w-3 h-3 text-[#C9A96E]" /> Video Studio
          </div>
          <h1 className="text-2xl font-light text-[#F0EDE8] mb-2 tracking-tight">What's your film about?</h1>
          <p className="text-sm text-[#555]">Describe your idea, or import a script. Your style agent will help refine the vision.</p>
        </div>

        <div className="relative">
          <textarea value={idea} onChange={e => setIdea(e.target.value)}
            placeholder="A public figure walks through a white void, unaware that his past is leaving ink footprints behind him…"
            rows={4}
            className="w-full bg-white/4 border border-white/12 rounded-2xl px-5 py-4 text-sm text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none leading-relaxed"
          />
          <div className="absolute bottom-3 left-4 flex gap-2">
            <button className="flex items-center gap-1.5 text-[11px] text-[#666] hover:text-[#999] px-2.5 py-1.5 rounded-lg border border-white/8 bg-white/3 hover:bg-white/5 transition-all">
              <Upload className="w-3 h-3" /> Upload Script
            </button>
            <button className="flex items-center gap-1.5 text-[11px] text-[#666] hover:text-[#999] px-2.5 py-1.5 rounded-lg border border-white/8 bg-white/3 hover:bg-white/5 transition-all">
              <Layers className="w-3 h-3" /> Upload Storyboard
            </button>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-[#555] uppercase tracking-wider mb-3">
            Visual Style <span className="text-[#444] normal-case ml-1">(recommended by style agent)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {STYLES.map(s => (
              <button key={s.id} onClick={() => setSelectedStyle(s.id === selectedStyle ? '' : s.id)}
                className={cn('p-3 rounded-xl border text-left transition-all relative',
                  selectedStyle === s.id ? 'border-[#C9A96E] bg-[#C9A96E]/10' : 'border-white/8 bg-white/3 hover:border-white/15'
                )}>
                {s.rec && <span className="absolute top-2 right-2 text-[8px] text-[#C9A96E] bg-[#C9A96E]/15 px-1 py-0.5 rounded">REC</span>}
                <div className="text-xl mb-1.5">{s.emoji}</div>
                <div className="text-xs font-medium text-[#F0EDE8]">{s.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onNext} disabled={!idea.trim()}
            className="flex items-center gap-2 bg-[#C9A96E] text-[#08080A] rounded-xl px-6 py-3 text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity">
            <Sparkles className="w-4 h-4" /> Create Project
          </button>
          <span className="text-xs text-[#555]">AI will generate a script from your idea</span>
        </div>
      </div>
    </div>
  );
}

// ─── Script Stage ─────────────────────────────────────────────────────────────

function ScriptStage() {
  const [script, setScript] = useState(SAMPLE_SCRIPT);
  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex-1 rounded-xl border border-white/10 overflow-hidden flex flex-col" style={{ background: '#0A0A0C' }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8 bg-white/2">
          <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-[#999]">Screenwriter</div>
          <button className="ml-auto p-1.5 rounded-lg hover:bg-white/8 transition-colors">
            <Maximize2 className="w-3.5 h-3.5 text-[#555]" />
          </button>
        </div>
        <div className="px-5 py-2 border-b border-white/5">
          <span className="text-[11px] text-[#666]">Script</span>
        </div>
        <textarea value={script} onChange={e => setScript(e.target.value)}
          className="flex-1 bg-transparent px-10 py-5 text-[13px] text-[#C0B8AC] focus:outline-none resize-none leading-[1.9]"
          style={{ fontFamily: "'Courier Prime', 'Courier New', monospace" }}
          placeholder="Enter your story script here, or chat with the Agent to auto-generate the script…"
        />
      </div>
    </div>
  );
}

// ─── Characters Stage ─────────────────────────────────────────────────────────

function CharactersStage({ entities, selectedEntity, onSelectEntity }: {
  entities: Entity[]; selectedEntity: Entity | null; onSelectEntity: (e: Entity | null) => void;
}) {
  if (selectedEntity) {
    return (
      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnail strip */}
        <div className="w-16 flex flex-col items-center pt-3 gap-2 border-r border-white/8" style={{ background: '#080810' }}>
          <button onClick={() => onSelectEntity(null)}
            className="w-10 h-10 rounded-lg border border-white/8 hover:bg-white/5 flex items-center justify-center text-[#555] hover:text-[#999] transition-all">
            <Plus className="w-4 h-4" />
          </button>
          {entities.map(e => (
            <button key={e.id} onClick={() => onSelectEntity(e)}
              className={cn('w-10 h-10 rounded-lg border flex items-center justify-center transition-all',
                selectedEntity.id === e.id ? 'border-[#C9A96E]/60' : 'border-white/8 hover:border-white/20'
              )}>
              <span className="text-[8px] font-semibold" style={{ color: e.color }}>
                {e.name.slice(0, 2).toUpperCase()}
              </span>
            </button>
          ))}
        </div>

        {/* Main canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8">
            <button className="flex items-center gap-1.5 text-[11px] text-[#C9A96E] bg-[#C9A96E]/15 border border-[#C9A96E]/30 rounded-lg px-3 py-1.5">
              <Check className="w-3 h-3" /> Chosen
            </button>
            {['Use as Reference', 'Local Inpaint', 'Regenerate', 'Generate 3-view'].map(action => (
              <button key={action} className="text-[11px] text-[#888] border border-white/10 rounded-lg px-3 py-1.5 hover:border-white/20 hover:text-[#F0EDE8] transition-all">
                {action}
              </button>
            ))}
            <button onClick={() => onSelectEntity(null)} className="ml-auto p-1.5 hover:bg-white/8 rounded-lg">
              <X className="w-4 h-4 text-[#555]" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center" style={{ background: '#F2F0EC' }}>
            <div className="text-[#aaa] text-sm">Character image — {selectedEntity.name}</div>
          </div>
        </div>

        {/* Right info panel */}
        <div className="w-72 border-l border-white/8 p-5 flex flex-col gap-4 overflow-y-auto" style={{ background: '#0D0D10' }}>
          <div>
            <h2 className="text-base font-light text-[#F0EDE8] mb-2">{selectedEntity.name}</h2>
            <p className="text-[12px] text-[#888] leading-relaxed">{selectedEntity.description}</p>
          </div>
          <div>
            <div className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Multi-view Reference</div>
            <div className="flex gap-2">
              {['Main View', 'Multi-view'].map(label => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className="w-16 h-14 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                    <Grid className="w-4 h-4 text-[#444]" />
                  </div>
                  <span className="text-[9px] text-[#555]">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto">
            <textarea placeholder="Enter your prompt here" rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-[11px] text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none" />
          </div>
        </div>
      </div>
    );
  }

  const characters = entities.filter(e => e.type === 'character');
  const scenes     = entities.filter(e => e.type === 'scene');

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl space-y-10">
        {/* Characters */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-light text-[#F0EDE8]">Character</h2>
            <button className="flex items-center gap-1.5 text-[11px] text-[#666] border border-white/8 rounded-lg px-3 py-1.5 hover:border-white/15 hover:text-[#999] transition-all">
              <Plus className="w-3 h-3" /> Add Character
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {characters.map(c => (
              <button key={c.id} onClick={() => onSelectEntity(c)}
                className="rounded-xl border border-white/8 overflow-hidden hover:border-white/20 transition-all text-left bg-[#0F0F14]">
                {/* Multi-view strip */}
                <div className="h-44 flex" style={{ background: '#F0EDE8' }}>
                  <div className="w-2/5 border-r border-[#DDD] flex items-center justify-center">
                    <span className="text-[#aaa] text-xs">front</span>
                  </div>
                  <div className="flex-1 grid grid-cols-3">
                    {['3/4','side','back'].map(v => (
                      <div key={v} className="border-r border-[#DDD] last:border-0 flex items-center justify-center">
                        <span className="text-[#bbb] text-[10px]">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-4 pt-3 pb-1">
                  <div className="text-sm font-medium text-[#F0EDE8] mb-1">{c.name}</div>
                </div>
                <div className="px-4 pb-3">
                  <p className="text-[11px] text-[#666] mb-3 line-clamp-2">{c.description}</p>
                  <div className="flex gap-3">
                    {[['Upload', Upload], ['Edit', Edit3], ['Redo', RefreshCw]].map(([label, Icon]) => (
                      <span key={label as string} className="flex items-center gap-1 text-[11px] text-[#666]">
                        {/* @ts-ignore */}
                        <Icon className="w-3 h-3" /> + {label}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scenes */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-light text-[#F0EDE8]">Scene</h2>
            <button className="flex items-center gap-1.5 text-[11px] text-[#666] border border-white/8 rounded-lg px-3 py-1.5 hover:border-white/15 hover:text-[#999] transition-all">
              <Plus className="w-3 h-3" /> Add Scene
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {scenes.map(s => (
              <button key={s.id} onClick={() => onSelectEntity(s)}
                className="rounded-xl border border-white/8 overflow-hidden hover:border-white/20 transition-all text-left bg-[#0F0F14]">
                <div className="h-44 grid grid-cols-2 grid-rows-2 gap-px bg-[#080810]">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="bg-[#1a1a22] flex items-center justify-center">
                      <span className="text-[#333] text-[9px]">{i+1}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3">
                  <div className="text-sm font-medium text-[#F0EDE8] mb-1">{s.name}</div>
                  <p className="text-[11px] text-[#666] mb-3 line-clamp-2">{s.description}</p>
                  <div className="flex gap-3">
                    {[['Upload', Upload], ['Edit', Edit3], ['Redo', RefreshCw]].map(([label, Icon]) => (
                      <span key={label as string} className="flex items-center gap-1 text-[11px] text-[#666]">
                        {/* @ts-ignore */}
                        <Icon className="w-3 h-3" /> + {label}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Storyboard Stage ─────────────────────────────────────────────────────────

function StoryboardStage({ shots, entities, onShotsChange }: {
  shots: Shot[]; entities: Entity[]; onShotsChange: (s: Shot[]) => void;
}) {
  const renderDesc = (text: string) =>
    text.split(/(@[\w-]+)/g).map((part, i) => {
      if (part.startsWith('@')) {
        const entity = entities.find(e => `@${e.name.toLowerCase()}` === part.toLowerCase());
        if (entity) return <span key={i} style={{ color: entity.color }}>{part.slice(1, entity.name.length + 1)}</span>;
        // Try bracket format [@...]
      }
      return <span key={i}>{part.replace(/\[@/g,'@').replace(/\]/g,'')}</span>;
    });

  const generateVideo = (shotId: string) => {
    onShotsChange(shots.map(s => s.id === shotId ? { ...s, video: { status: 'generating' } } : s));
    setTimeout(() => {
      onShotsChange(shots.map(s => s.id === shotId ? { ...s, video: { status: 'done', duration: '12s' } } : s));
    }, 2500);
  };

  const generateImage = (shotId: string, idx: number) => {
    onShotsChange(shots.map(s => s.id === shotId ? {
      ...s, images: s.images.map((img, i) => i === idx ? { status: 'generating' as const } : img)
    } : s));
    setTimeout(() => {
      onShotsChange(shots.map(s => s.id === shotId ? {
        ...s, images: s.images.map((img, i) => i === idx ? { status: 'done' as const } : img)
      } : s));
    }, 1800);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
        <h2 className="text-sm font-medium text-[#F0EDE8]">Storyboard</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 text-[11px] text-[#888] border border-white/10 rounded-lg px-3 py-1.5 hover:border-white/20 hover:text-[#F0EDE8] transition-all">
            <Download className="w-3 h-3" /> Batch Download
          </button>
          <button className="flex items-center gap-1.5 text-[11px] text-[#555] border border-white/8 rounded-lg px-3 py-1.5 hover:border-white/15 transition-all">
            <Upload className="w-3 h-3" /> Upload
          </button>
          <button className="flex items-center gap-1.5 text-[11px] text-[#555] border border-white/8 rounded-lg px-3 py-1.5 hover:border-white/15 transition-all">
            <Plus className="w-3 h-3" /> Add Shot
          </button>
        </div>
      </div>

      {/* Table header */}
      <div className="grid border-b border-white/5 bg-white/2"
        style={{ gridTemplateColumns: '36px 280px 80px 1fr 220px' }}>
        {['#','Description','Entity','Images','Videos'].map(h => (
          <div key={h} className="px-3 py-2 text-[10px] text-[#555] uppercase tracking-wider">{h}</div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {shots.map(shot => (
          <div key={shot.id} className="grid border-b border-white/5 hover:bg-white/1 transition-colors"
            style={{ gridTemplateColumns: '36px 280px 80px 1fr 220px', minHeight: 160 }}>
            {/* # */}
            <div className="flex items-start justify-center pt-5 text-sm font-light text-[#555]">{shot.num}</div>

            {/* Description */}
            <div className="px-3 py-4 border-r border-white/5 overflow-hidden">
              <div className="text-[11px] text-[#888] leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                {renderDesc(shot.description)}
              </div>
            </div>

            {/* Entities */}
            <div className="px-2 py-4 flex flex-col gap-1.5 border-r border-white/5">
              {shot.entities.slice(0, 4).map(eid => {
                const e = entities.find(en => en.id === eid);
                if (!e) return null;
                return (
                  <div key={eid} className="w-9 h-9 rounded-lg flex items-center justify-center border"
                    style={{ borderColor: `${e.color}40`, background: `${e.color}10` }}>
                    <span className="text-[8px] font-semibold" style={{ color: e.color }}>
                      {e.name.split('-').map(w => w[0]).join('').slice(0,2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Images */}
            <div className="px-3 py-4 border-r border-white/5">
              <div className="flex gap-2 mb-2">
                {shot.images.map((img, idx) => (
                  <div key={idx} className={cn('w-40 h-28 rounded-lg border flex items-center justify-center overflow-hidden relative',
                    img.status === 'done'       ? 'border-white/10 bg-[#18181e]' :
                    img.status === 'generating' ? 'border-[#C9A96E]/20 bg-white/2' :
                    'border-dashed border-white/8 bg-white/2'
                  )}>
                    {img.status === 'generating' ? <RefreshCw className="w-4 h-4 text-[#C9A96E] animate-spin" /> :
                     img.status === 'done' ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#18181e] to-[#0d0d12] flex items-center justify-center">
                        <span className="text-[9px] text-[#333]">generated</span>
                      </div>
                     ) : (
                      <button onClick={() => generateImage(shot.id, idx)}
                        className="flex flex-col items-center gap-1 text-[#555] hover:text-[#999] transition-colors">
                        <Plus className="w-4 h-4" />
                        <span className="text-[9px]">Generate</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                {['Edit','Redo','Quote'].map(a => (
                  <button key={a} className="text-[10px] text-[#555] hover:text-[#888] transition-colors">{a}</button>
                ))}
              </div>
            </div>

            {/* Video */}
            <div className="px-3 py-4">
              <div className={cn('w-44 h-28 rounded-lg border flex items-center justify-center overflow-hidden mb-2 relative',
                shot.video.status === 'done'  ? 'border-white/10 bg-[#18181e]' :
                shot.video.status === 'error' ? 'border-red-500/30 bg-red-500/5' :
                shot.video.status === 'generating' ? 'border-[#C9A96E]/20 bg-white/2' :
                'border-dashed border-white/8 bg-white/2'
              )}>
                {shot.video.status === 'generating' ? (
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-[#C9A96E] animate-spin" />
                    <span className="text-[10px] text-[#555]">Generating…</span>
                  </div>
                ) : shot.video.status === 'done' ? (
                  <>
                    <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </button>
                    {shot.video.duration && (
                      <span className="absolute bottom-1.5 right-1.5 text-[9px] text-white/50 bg-black/50 px-1 py-0.5 rounded">{shot.video.duration}</span>
                    )}
                  </>
                ) : shot.video.status === 'error' ? (
                  <div className="flex flex-col items-center gap-1.5 p-3 text-center">
                    <X className="w-5 h-5 text-red-400" />
                    <span className="text-[9px] text-red-400 font-medium">Insufficient balance</span>
                    <span className="text-[9px] text-[#555]">Please recharge and try again</span>
                  </div>
                ) : (
                  <button onClick={() => generateVideo(shot.id)}
                    className="flex flex-col items-center gap-1.5 text-[#555] hover:text-[#888] transition-colors">
                    <Film className="w-5 h-5" />
                    <span className="text-[9px]">Generate Video</span>
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                {['Edit','Redo','Quote'].map(a => (
                  <button key={a} className="text-[10px] text-[#555] hover:text-[#888] transition-colors">{a}</button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Timeline Stage ───────────────────────────────────────────────────────────

function TimelineStage({ shots, entities }: { shots: Shot[]; entities: Entity[] }) {
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState(shots[0]);
  const totalSec = shots.length * 12;
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}.01`;

  const renderDesc = (text: string) =>
    text.split(/(@[\w-]+|\[@[\w-]+\])/g).map((part, i) => {
      const clean = part.replace(/^\[?@/, '').replace(/\]$/, '');
      const entity = entities.find(e => e.name.toLowerCase() === clean.toLowerCase());
      if (entity) return <span key={i} className="font-semibold" style={{ color: entity.color }}>@{entity.name}</span>;
      return <span key={i}>{part}</span>;
    });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
        <h2 className="text-sm font-medium text-[#F0EDE8]">TimeLine</h2>
        <button className="flex items-center gap-2 bg-[#C9A96E] text-[#08080A] rounded-xl px-5 py-2 text-sm font-medium hover:opacity-90">
          <Download className="w-4 h-4" /> Render Video
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: shot details */}
        <div className="w-60 flex flex-col border-r border-white/8 overflow-y-auto p-4 space-y-4 flex-shrink-0" style={{ background: '#0D0D10' }}>
          <div className="text-xs font-medium text-[#F0EDE8]">Shot {selected?.num}</div>

          <div>
            <div className="text-[9px] text-[#555] uppercase tracking-wide mb-2">Shot Description</div>
            <div className="text-[11px] text-[#888] leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
              {selected && renderDesc(selected.description.slice(0, 220) + '…')}
            </div>
          </div>

          <div>
            <div className="text-[9px] text-[#555] uppercase tracking-wide mb-2">Subject Reference</div>
            <div className="flex gap-1.5 flex-wrap">
              {selected?.entities.map(eid => {
                const e = entities.find(en => en.id === eid);
                if (!e) return null;
                return (
                  <div key={eid} className="flex flex-col items-center gap-0.5">
                    <div className="w-10 h-10 rounded-lg border flex items-center justify-center"
                      style={{ borderColor: `${e.color}40`, background: `${e.color}10` }}>
                      <span className="text-[9px] font-semibold" style={{ color: e.color }}>
                        {e.name.split('-').map(w => w[0]).join('').slice(0,2)}
                      </span>
                    </div>
                    <span className="text-[7px] text-[#555] w-10 text-center truncate">{e.name.split('-')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[9px] text-[#555] uppercase tracking-wide mb-2 flex justify-between">
              Reference Image <Edit3 className="w-3 h-3 text-[#555]" />
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[0,1].map(i => (
                <div key={i} className="aspect-video rounded-lg bg-[#1a1a22] border border-white/8 flex items-center justify-center">
                  <span className="text-[8px] text-[#333]">ref {i+1}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[9px] text-[#555] uppercase tracking-wide mb-2 flex justify-between">
              Generated Video <Edit3 className="w-3 h-3 text-[#555]" />
            </div>
            <div className="aspect-video rounded-lg bg-[#1a1a22] border border-white/8 flex items-center justify-center">
              {selected?.video.status === 'done' ? (
                <button className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="w-3 h-3 text-white fill-white" />
                </button>
              ) : <span className="text-[8px] text-[#333]">No video</span>}
            </div>
          </div>
        </div>

        {/* Main: video preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-5" style={{ background: '#050508' }}>
            <div className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden border border-white/5 relative flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #18181e 0%, #0d0d12 100%)' }}>
              <div className="text-center">
                <div className="text-3xl font-light text-[#333] mb-2">▶</div>
                <div className="text-xs text-[#2a2a2a]">Shot {selected?.num} · {videoModel_PLACEHOLDER} · {resolution_PLACEHOLDER}</div>
              </div>
              <div className="absolute bottom-3 right-3 text-[10px] text-white/15 font-medium">✦ Hypnotic</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 px-5 py-2.5 border-t border-white/5">
            <div className="text-[11px] font-mono text-[#C9A96E]">{fmt(0)}</div>
            <button onClick={() => setPlaying(!playing)}
              className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center hover:border-white/30 transition-colors">
              {playing ? <Pause className="w-3 h-3 text-[#F0EDE8]" /> : <Play className="w-3.5 h-3.5 text-[#F0EDE8] ml-0.5" />}
            </button>
            <div className="flex-1 h-1 bg-white/8 rounded-full">
              <div className="h-full w-0 bg-[#C9A96E] rounded-full" />
            </div>
            <div className="text-[11px] font-mono text-[#555]">{fmt(totalSec)}</div>
          </div>
        </div>
      </div>

      {/* Timeline scrubber */}
      <div className="border-t border-white/8 flex-shrink-0" style={{ height: 110, background: '#0A0A0C' }}>
        <div className="flex border-b border-white/5 h-6 px-4 items-end pb-1 overflow-hidden">
          {Array.from({ length: Math.min(Math.ceil(totalSec / 5) + 1, 24) }).map((_, i) => (
            <div key={i} className="flex-1 text-[7px] text-[#333] font-mono whitespace-nowrap">{fmt(i * 5)}</div>
          ))}
        </div>
        <div className="flex items-center px-4 py-2 gap-1 overflow-x-auto h-20">
          {shots.map(shot => (
            <button key={shot.id} onClick={() => setSelected(shot)}
              className={cn('flex-shrink-0 h-14 rounded-lg border overflow-hidden transition-all relative',
                selected?.id === shot.id ? 'border-[#C9A96E]' : 'border-white/8 hover:border-white/20'
              )}
              style={{ minWidth: 100 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#18181e] to-[#0d0d12] flex items-end p-1.5">
                <span className="text-[7px] text-[#666] line-clamp-2 leading-relaxed">
                  {shot.description.replace(/\[@[\w-]+\]/g, m => m.replace(/[\[\]@]/g,'')).slice(0, 35)}…
                </span>
              </div>
              {shot.video.status !== 'done' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <X className="w-4 h-4 text-red-400/70" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Placeholders for right panel display in timeline  
const videoModel_PLACEHOLDER = 'Kling C3';
const resolution_PLACEHOLDER = '16:9 · 720p';

// ─── Main ─────────────────────────────────────────────────────────────────────

export function CraftVideoPage() {
  const [stage, setStage]               = useState<Stage>('canvas');
  const [shots, setShots]               = useState<Shot[]>(DEMO_SHOTS);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [videoModel, setVideoModel]     = useState<CraftModel>(VIDEO_MODELS.find(m => m.id === 'auto')!);
  const [imageModel, setImageModel]     = useState<CraftModel>(IMAGE_MODELS.find(m => m.id === 'auto') ?? IMAGE_MODELS[0]);
  const [resolution, setResolution]     = useState('16:9');
  const [quality, setQuality]           = useState('720p');
  const [duration, setDuration]         = useState('Auto (12s)');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [chatInput, setChatInput]       = useState('');

  const INITIAL_MSGS: Record<Stage, Array<{ role: string; text: string }>> = {
    canvas:     [{ role: 'agent', text: 'Welcome to Video Studio. Describe your film idea and your style agent will help develop it.' }],
    script:     [{ role: 'agent', text: 'ok i have submitted the script\n\nAt 0.1s, quickly cut to a full-screen cinematic scene, with NO split screen. 0-3s: Wide shot — @The-World-Scene white void. @Public-Figure stands centered, motionless, facing forward with calm composure. Minimalist ink illustration style, pure white background. 3-7s: Cut to medium shot — camera slowly circles behind @Public-Figure. Faint @Ink-Footprints begin to materialise softly on the ground behind him, one by one, appearing like ink soaking into paper. 7-10s: Cut to close-up — the ink footprints on the ground, appearing silently, growing slightly darker.' }],
    characters: [{ role: 'agent', text: 'I\'ve analysed your script and identified 5 entities.\n\nCharacters: @Public-Figure, @The-World\nScenes: @Mind-Void, @The-World-Scene, @Ink-Footprints\n\nClick any entity to refine its appearance and generate reference views.' }],
    storyboard: [{ role: 'agent', text: 'ok i have submitted the script\n\nAt 0.1s, quickly cut to a full-screen cinematic scene, with NO split screen. 0-3s: Wide shot — @The-World-Scene white void. @Public-Figure stands centered, motionless, facing forward with calm composure. Minimalist ink illustration style, pure white background. 3-7s: Cut to medium shot — camera slowly circles behind @Public-Figure. Faint @Ink-Footprints begin to materialise softly on the ground behind him, one by one, appearing like ink soaking into paper. 7-10s: Cut to close-up — the ink footprints on the ground, appearing silently, growing slightly darker. @Public-Figure\'s feet visible at top of frame, unmoving.' }],
    timeline:   [{ role: 'agent', text: 'ok i have submitted the script\n\nAt 0.1s, quickly cut to a full-screen cinematic scene, with NO split screen. 0-3s: Wide shot — @The-World-Scene white void. @Public-Figure stands centered, motionless, facing forward with calm composure.' }],
  };

  const [chatMsgs, setChatMsgs] = useState(INITIAL_MSGS);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMsgs(prev => ({ ...prev, [stage]: [...prev[stage], { role: 'user', text: chatInput }] }));
    setChatInput('');
  };

  const idx = STAGES.findIndex(s => s.id === stage);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]" style={{ background: '#0A0A0C' }}>
      {/* Top nav */}
      <div className="relative flex items-center justify-center border-b border-white/8 py-2.5" style={{ background: '#0D0D10' }}>
        <div className="flex items-center gap-0.5">
          {STAGES.map((s, i) => {
            const isActive    = stage === s.id;
            const isCompleted = i < idx;
            const isLocked    = i > idx + 1;
            return (
              <div key={s.id} className="flex items-center">
                <button
                  onClick={() => !isLocked && setStage(s.id)}
                  disabled={isLocked}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-all',
                    isActive    ? 'bg-[#C9A96E] text-[#08080A]' :
                    isCompleted ? 'text-[#7abf8e] hover:text-[#a3d4b0] hover:bg-white/3' :
                    isLocked    ? 'text-[#2a2a2a] cursor-not-allowed' :
                                  'text-[#666] hover:text-[#C0B8AC] hover:bg-white/3'
                  )}>
                  {isCompleted && <Check className="w-3 h-3" />}
                  {s.label}
                </button>
                {i < STAGES.length - 1 && (
                  <span className="text-[#2a2a2a] mx-1 text-xs">···</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="absolute right-4 text-[11px] text-[#444]">New Base</div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          {stage === 'canvas'     && <CanvasStage onNext={() => setStage('script')} />}
          {stage === 'script'     && <ScriptStage />}
          {stage === 'characters' && (
            <CharactersStage entities={DEMO_ENTITIES} selectedEntity={selectedEntity} onSelectEntity={setSelectedEntity} />
          )}
          {stage === 'storyboard' && (
            <StoryboardStage shots={shots} entities={DEMO_ENTITIES} onShotsChange={setShots} />
          )}
          {stage === 'timeline'   && (
            <TimelineStage shots={shots} entities={DEMO_ENTITIES} />
          )}
        </div>

        <RightPanel
          stage={stage}
          entities={DEMO_ENTITIES}
          chatMsgs={chatMsgs[stage]}
          chatInput={chatInput}
          onChatInput={setChatInput}
          onChatSend={sendChat}
          videoModel={videoModel}   onVideoModel={setVideoModel}
          imageModel={imageModel}   onImageModel={setImageModel}
          resolution={resolution}   onResolution={setResolution}
          quality={quality}         onQuality={setQuality}
          duration={duration}       onDuration={setDuration}
          audioEnabled={audioEnabled}
          onAudioToggle={() => setAudioEnabled(a => !a)}
        />
      </div>

      {/* Bottom nav */}
      {stage !== 'canvas' && (
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/8 bg-[#0D0D10]">
          <button
            onClick={() => { if (idx > 0) setStage(STAGES[idx - 1].id); }}
            disabled={idx === 0}
            className="flex items-center gap-1.5 text-xs text-[#555] border border-white/8 rounded-lg px-4 py-2 hover:border-white/15 hover:text-[#888] transition-all disabled:opacity-30">
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>
          <span className="text-[10px] text-[#333]">{idx + 1} / {STAGES.length}</span>
          <button
            onClick={() => { if (idx < STAGES.length - 1) setStage(STAGES[idx + 1].id); }}
            disabled={idx === STAGES.length - 1}
            className="flex items-center gap-1.5 text-xs text-[#C9A96E] border border-[#C9A96E]/30 rounded-lg px-4 py-2 hover:border-[#C9A96E]/60 transition-all disabled:opacity-30">
            Continue <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
