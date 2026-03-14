import { useState, useRef } from 'react';
import {
  Upload, Plus, RefreshCw, Play, Download, Send, ChevronDown,
  Sparkles, Check, Edit3, Film, X, Pause, Wand2, Camera,
  Image as ImgIcon, AlignLeft, Volume2, Maximize2, Grid3X3, Undo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VIDEO_MODELS, IMAGE_MODELS, getTierColor, type CraftModel } from '@/lib/craft/models';

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = 'brief' | 'script' | 'characters' | 'storyboard' | 'timeline';

const STAGES: { id: Stage; label: string }[] = [
  { id: 'brief',      label: 'Brief'      },
  { id: 'script',     label: 'Script'     },
  { id: 'characters', label: 'Characters' },
  { id: 'storyboard', label: 'Storyboard' },
  { id: 'timeline',   label: 'TimeLine'   },
];

interface Entity {
  id: string; name: string; type: 'character' | 'scene';
  description: string; color: string;
  views: number; // number of reference images generated
}

interface Shot {
  id: string; num: number; description: string;
  entities: string[];
  images: Array<{ status: 'empty' | 'generating' | 'done' }>;
  video: { status: 'empty' | 'generating' | 'done' | 'error'; duration?: string };
  approved: boolean;
}

interface AgentMessage { role: 'agent' | 'user'; text: string; }

// ─── Demo Data ────────────────────────────────────────────────────────────────

const DEMO_ENTITIES: Entity[] = [
  { id: 'public-figure',   name: 'Public-Figure',   type: 'character', views: 4, color: '#7aaee0',
    description: 'A stylized minimalist character, reminiscent of R. K. Laxman\'s editorial cartoons. He floats in a void. A white, translucent \'reputation cloth\' flows from his head.' },
  { id: 'the-world',       name: 'The-World',       type: 'character', views: 4, color: '#e07a7a',
    description: 'Minimalist monochrome ink illustration of a symbolic Indian male figure representing media and public opinion. He has a slightly dishevelled appearance.' },
  { id: 'mind-void',       name: 'Mind-Void',       type: 'scene',     views: 4, color: '#a07ae0',
    description: 'An infinite, pitch-black space representing the internal psychological landscape. Deep space with swirling ink patterns.' },
  { id: 'the-world-scene', name: 'The-World-Scene', type: 'scene',     views: 4, color: '#C9A96E',
    description: 'A stark, pure white environment where The World resides. Minimalist ink wash landscape.' },
  { id: 'ink-footprints',  name: 'Ink-Footprints',  type: 'scene',     views: 2, color: '#7abf8e',
    description: 'Detailed footprints made of liquid ink on a white surface, spreading and fading organically.' },
];

const DEMO_SHOTS: Shot[] = [
  {
    id: 's1', num: 1, approved: true,
    entities: ['public-figure', 'the-world-scene', 'ink-footprints'],
    description: `0-3s: Wide shot — [@The-World-Scene] white void. [@Public-Figure] stands centered, motionless, facing forward with calm composure.\n3-7s: Medium shot — camera slowly circles behind [@Public-Figure]. Faint [@Ink-Footprints] begin to materialise softly on the ground behind him, one by one.\n7-10s: Close-up — the ink footprints on the ground, appearing silently, growing slightly darker. [@Public-Figure]'s feet visible at top of frame, unmoving.\n10-12s: Medium shot — back to frontal view of [@Public-Figure], expression neutral, unaware. The footprints behind him continue to multiply quietly.`,
    images: [{ status: 'done' }, { status: 'done' }],
    video: { status: 'done', duration: '12s' },
  },
  {
    id: 's2', num: 2, approved: false,
    entities: ['public-figure', 'ink-footprints'],
    description: `0-3s: Medium shot — [@Public-Figure] turns and notices the footprints behind him. He crouches slightly, reaching down toward them.\n3-6s: Close-up — his hand sweeping across the floor where [@Ink-Footprints] lie. The ink smears and fades as he wipes.\n6-9s: Extreme close-up — the wiped area. The footprints are mostly gone but faint grey ghost-shadows linger on the white surface.\n9-12s: Medium wide shot — [@Public-Figure] stands upright, examining the floor. The ghost shadows of [@Ink-Footprints] remain visible behind him.`,
    images: [{ status: 'done' }, { status: 'empty' }],
    video: { status: 'error' },
  },
  {
    id: 's3', num: 3, approved: false,
    entities: ['the-world', 'public-figure', 'ink-footprints'],
    description: `0-3s: Medium shot — [@The-World] materialises from the edge of the white void, stepping calmly into the frame with one hand extended forward.\n3-6s: Close-up — [@The-World]'s finger descends and presses onto one of the remaining [@Ink-Footprints] on the floor.\n6-10s: Top-down wide shot — the pressed footprint erupts, ink spreading like liquid in water, branching outward across the floor in fractal patterns.`,
    images: [{ status: 'empty' }, { status: 'empty' }],
    video: { status: 'empty' },
  },
];

const AGENT_INTROS: Record<Stage, AgentMessage[]> = {
  brief: [{ role: 'agent', text: 'Welcome to Video Production. Describe your concept and I\'ll help you plan the production pipeline.' }],
  script: [{ role: 'agent', text: 'ok i have submitted the script' }],
  characters: [{ role: 'agent', text: 'I\'ve created characters from your script. You can generate multi-view references, upload your own, or inpaint details.\n\nRecommended: Use Seedream 4 2K for character sheets — best consistency for illustration styles.' }],
  storyboard: [{ role: 'agent', text: 'ok i have submitted the script' }],
  timeline: [{ role: 'agent', text: 'Your footage is loaded. You can reorder shots, trim clips, and add audio. Click "Render Video" to export.\n\nFor the final edit, I recommend keeping Shot 1 at full 12s — the ink materialisation needs the breathing room.' }],
};

// ─── Model Settings Bar ───────────────────────────────────────────────────────

interface ModelSettings {
  videoModel: CraftModel;
  imageModel: CraftModel;
  aspect: '16:9' | '9:16' | '1:1';
  quality: '720p' | '1080p' | '4K';
  duration: string;
  audio: boolean;
}

function SettingsBar({
  settings, setSettings, stage
}: {
  settings: ModelSettings;
  setSettings: (s: ModelSettings) => void;
  stage: Stage;
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const isVideo = stage === 'storyboard' || stage === 'timeline';
  const currentModel = isVideo ? settings.videoModel : settings.imageModel;
  const models = isVideo ? VIDEO_MODELS : IMAGE_MODELS.filter(m =>
    ['auto','seedream-4','seedream-4-4k','mystic-2-5','flux-2-pro','google-imagen-4'].includes(m.id)
  );

  const tc = getTierColor(currentModel.tier);
  const mini = (label: string, value: string, key: string, options: string[], onSelect: (v: string) => void) => (
    <div className="relative">
      <button onClick={() => setOpenMenu(openMenu === key ? null : key)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/8 transition-colors text-[11px] text-[#888] hover:text-[#F0EDE8]">
        {value} <ChevronDown className="w-2.5 h-2.5" />
      </button>
      {openMenu === key && (
        <div className="absolute bottom-full mb-1 left-0 bg-[#18181e] border border-white/10 rounded-lg overflow-hidden z-50 min-w-[80px]">
          {options.map(o => (
            <button key={o} onClick={() => { onSelect(o); setOpenMenu(null); }}
              className={cn('w-full px-3 py-1.5 text-[11px] text-left hover:bg-white/5 transition-colors',
                value === o ? 'text-[#C9A96E]' : 'text-[#888]'
              )}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="border-t border-white/8 px-3 py-2 flex items-center gap-1 flex-wrap" style={{ background: '#0D0D10' }}>
      {/* Model selector */}
      <div className="relative">
        <button onClick={() => setOpenMenu(openMenu === 'model' ? null : 'model')}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-white/8 transition-colors text-[11px]">
          <RefreshCw className="w-3 h-3 text-[#555]" />
          <span className="text-[#888]">{currentModel.name}</span>
          <ChevronDown className="w-2.5 h-2.5 text-[#555]" />
        </button>
        {openMenu === 'model' && (
          <div className="absolute bottom-full mb-1 left-0 bg-[#18181e] border border-white/10 rounded-xl overflow-hidden z-50 w-72 max-h-80 overflow-y-auto">
            {models.map(m => {
              const tc2 = getTierColor(m.tier);
              return (
                <button key={m.id}
                  onClick={() => {
                    if (isVideo) setSettings({ ...settings, videoModel: m });
                    else setSettings({ ...settings, imageModel: m });
                    setOpenMenu(null);
                  }}
                  className={cn('w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors',
                    currentModel.id === m.id && 'bg-[#C9A96E]/8'
                  )}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-[#F0EDE8]">{m.name}</span>
                    <div className="flex items-center gap-1">
                      {m.new && <span className="text-[9px] px-1 rounded bg-[#7abf8e]/15 text-[#7abf8e]">NEW</span>}
                      {m.recommended && <span className="text-[9px] text-[#C9A96E]">★</span>}
                      <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ color: tc2, background: `${tc2}18` }}>{m.tier}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(m.capabilities).filter(([,v]) => v).slice(0,4).map(([c]) => (
                      <span key={c} className="text-[8px] px-1 py-0.5 rounded bg-white/5 text-[#555]">{c}</span>
                    ))}
                    {m.maxDuration && <span className="text-[8px] px-1 py-0.5 rounded bg-white/5 text-[#555]">max {m.maxDuration}s</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <span className="text-[#333] text-xs mx-0.5">|</span>

      {mini('aspect', settings.aspect, 'aspect', ['16:9','9:16','1:1'], v => setSettings({ ...settings, aspect: v as any }))}
      {mini('quality', settings.quality, 'quality', ['720p','1080p','4K'], v => setSettings({ ...settings, quality: v as any }))}
      {isVideo && mini('duration', settings.duration, 'duration', ['Auto (5s)','Auto (8s)','Auto (12s)','5s','10s'], v => setSettings({ ...settings, duration: v }))}

      {isVideo && (
        <>
          <span className="text-[#333] text-xs mx-0.5">|</span>
          <div className="flex items-center gap-1.5 px-2">
            <span className="text-[11px] text-[#888]">Audio</span>
            <button onClick={() => setSettings({ ...settings, audio: !settings.audio })}
              className={cn('w-8 h-4 rounded-full transition-colors relative',
                settings.audio ? 'bg-[#C9A96E]' : 'bg-[#333]'
              )}>
              <div className={cn('absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all',
                settings.audio ? 'left-4' : 'left-0.5'
              )} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Right Panel (Entities + Agent Chat + Settings) ───────────────────────────

function RightPanel({
  entities, stage, settings, setSettings, msgs, setMsgs,
}: {
  entities: Entity[]; stage: Stage;
  settings: ModelSettings; setSettings: (s: ModelSettings) => void;
  msgs: AgentMessage[]; setMsgs: (m: AgentMessage[]) => void;
}) {
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMsgs([...msgs, { role: 'user', text: input }]);
    setInput('');
  };

  const entityColors = (eid: string) => entities.find(e => e.id === eid)?.color ?? '#888';

  return (
    <div className="w-[340px] flex-shrink-0 flex flex-col border-l border-white/8 overflow-hidden" style={{ background: '#0D0D10' }}>
      {/* Entity thumbnail strip */}
      <div className="px-3 py-3 border-b border-white/5 flex flex-wrap gap-2">
        {entities.map(e => (
          <div key={e.id} className="relative group cursor-pointer">
            <div className="w-[60px] h-[60px] rounded-lg overflow-hidden border"
              style={{ borderColor: `${e.color}35`, background: `${e.color}10` }}>
              {/* Simulated entity image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold" style={{ color: e.color }}>
                  {e.name.split('-').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                </span>
              </div>
            </div>
            {e.views > 1 && (
              <div className="absolute -bottom-0.5 -right-0.5 text-[8px] bg-[#1a1a22] border border-white/10 rounded px-0.5 text-[#555]">
                {e.views}v
              </div>
            )}
          </div>
        ))}
        <button className="w-[60px] h-[60px] rounded-lg border border-dashed border-white/10 flex items-center justify-center hover:border-white/20 transition-colors">
          <Plus className="w-4 h-4 text-[#444]" />
        </button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={m.role === 'agent' ? 'flex gap-2' : 'flex justify-end'}>
            {m.role === 'agent' ? (
              <>
                <div className="w-5 h-5 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-[#C9A96E]" />
                </div>
                <div className="bg-white/4 rounded-xl rounded-tl-none px-3 py-2.5 text-[11px] text-[#B0A898] leading-relaxed flex-1" style={{ whiteSpace: 'pre-line' }}>
                  {m.text}
                </div>
              </>
            ) : (
              <div className="bg-[#C9A96E]/12 border border-[#C9A96E]/20 rounded-xl rounded-tr-none px-3 py-2 text-[11px] text-[#F0EDE8] max-w-[85%]">
                {m.text}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chat input */}
      <div className="px-3 py-2 border-t border-white/5">
        <div className="flex gap-2 items-end">
          <textarea
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={stage === 'timeline' ? 'Tell the director what to shoot…' : 'Chat with the agent…'}
            rows={1}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none leading-relaxed"
            style={{ minHeight: 36 }}
          />
          <button onClick={send} className="p-2 bg-[#C9A96E] text-[#08080A] rounded-xl hover:opacity-90 flex-shrink-0 mb-0.5">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Model settings bar */}
      <SettingsBar settings={settings} setSettings={setSettings} stage={stage} />
    </div>
  );
}

// ─── Canvas Stage ─────────────────────────────────────────────────────────────

function CanvasStage({ onNext }: { onNext: () => void }) {
  const [prompt, setPrompt] = useState('');
  const EXAMPLES = ['Apocalypse', 'Fantasy', 'Wild Ideas', 'Commercial', 'Science', 'Short Drama'];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-12" style={{ background: '#0A0A0C' }}>
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-light text-[#F0EDE8] text-center mb-2">Your Personal AI Film Studio.</h1>
        <p className="text-sm text-[#555] text-center mb-8">Enter your idea or a script</p>

        <div className="border border-white/12 rounded-2xl overflow-hidden" style={{ background: '#0D0D10' }}>
          <textarea
            value={prompt} onChange={e => setPrompt(e.target.value)}
            placeholder="Animated style, little rabbit and bear exploring colorful mushroom forest, seeking legendary rainbow gem →"
            rows={4}
            className="w-full bg-transparent px-5 py-4 text-sm text-[#F0EDE8] placeholder:text-[#444] focus:outline-none resize-none"
          />
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/8">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 text-xs text-[#666] hover:text-[#999] transition-colors">
                <Plus className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1.5 text-xs text-[#666] hover:text-[#999] transition-colors">
                <AlignLeft className="w-3 h-3" /> Upload Script
              </button>
              <button className="flex items-center gap-1.5 text-xs text-[#666] hover:text-[#999] transition-colors">
                <Grid3X3 className="w-3 h-3" /> Upload Storyboard
              </button>
              <button className="flex items-center gap-1.5 text-xs text-[#888] hover:text-[#BBB] transition-colors border border-white/10 rounded-lg px-2 py-1">
                <RefreshCw className="w-3 h-3" /> Kling 2.6 <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <button onClick={onNext} disabled={!prompt.trim()}
              className="flex items-center gap-1.5 bg-[#C9A96E] text-[#08080A] rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity">
              <Sparkles className="w-4 h-4" /> Create
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mt-5">
          {EXAMPLES.map(e => (
            <button key={e} onClick={() => setPrompt(e)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/8 text-xs text-[#666] hover:border-white/20 hover:text-[#999] transition-all">
              <Sparkles className="w-3 h-3" /> {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Script Stage ─────────────────────────────────────────────────────────────

function ScriptStage({ script, setScript }: { script: string; setScript: (s: string) => void; }) {
  return (
    <div className="flex-1 overflow-auto p-6" style={{ background: '#0A0A0C' }}>
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: '#0D0D10' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
            <div className="flex items-center gap-2">
              <div className="text-xs px-2 py-0.5 rounded border border-white/10 text-[#888]">Screenwriter</div>
              <button className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/5 text-[#555]">
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="p-5">
            <div className="text-sm font-medium text-[#F0EDE8] mb-4">Script</div>
            <textarea
              value={script}
              onChange={e => setScript(e.target.value)}
              placeholder="Enter your story script here, or chat with the Agent to auto-generate the script..."
              className="w-full min-h-[60vh] bg-transparent text-sm text-[#C0B8AC] placeholder:text-[#333] focus:outline-none resize-none leading-relaxed"
              style={{ fontFamily: 'var(--font-mono, "Courier Prime", monospace)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Characters Stage ─────────────────────────────────────────────────────────

function CharactersStage({ entities, setEntities }: { entities: Entity[]; setEntities: (e: Entity[]) => void; }) {
  const [detailId, setDetailId] = useState<string | null>(null);
  const [generating, setGenerating] = useState<Record<string, boolean>>({});

  const chars  = entities.filter(e => e.type === 'character');
  const scenes = entities.filter(e => e.type === 'scene');

  const genViews = (id: string) => {
    setGenerating(p => ({ ...p, [id]: true }));
    setTimeout(() => {
      setGenerating(p => ({ ...p, [id]: false }));
      setEntities(entities.map(e => e.id === id ? { ...e, views: Math.max(e.views, 4) } : e));
    }, 2000);
  };

  const EntityCard = ({ entity }: { entity: Entity }) => (
    <div
      className="rounded-2xl border border-white/8 overflow-hidden cursor-pointer group hover:border-white/20 transition-all"
      style={{ background: '#0D0D10' }}
      onClick={() => setDetailId(entity.id)}
    >
      {/* Image area */}
      <div className="relative aspect-[16/10] flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${entity.color}08, #0a0a0c)` }}>
        {/* Multi-view strip */}
        <div className="absolute inset-0 grid grid-cols-4 gap-0.5 p-1 opacity-70">
          {Array.from({ length: entity.views }).map((_, i) => (
            <div key={i} className="rounded-sm flex items-center justify-center"
              style={{ background: `${entity.color}12` }}>
              <span className="text-[8px] font-bold" style={{ color: `${entity.color}80` }}>
                {['F','S','¾','B'][i] ?? i}
              </span>
            </div>
          ))}
          {entity.views < 4 && Array.from({ length: 4 - entity.views }).map((_, i) => (
            <div key={`empty-${i}`} className="rounded-sm border border-dashed border-white/5" />
          ))}
        </div>
        {/* Entity name overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0D0D10] to-transparent pt-8 pb-2 px-3">
          <span className="text-sm font-medium text-[#F0EDE8]">{entity.name}</span>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-3">
        <p className="text-[11px] text-[#666] leading-relaxed line-clamp-2">{entity.description}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 pb-3">
        <button onClick={e => { e.stopPropagation(); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-[#888] hover:text-[#F0EDE8] hover:bg-white/5 transition-all">
          <Upload className="w-3 h-3" /> Upload
        </button>
        <button onClick={e => { e.stopPropagation(); setDetailId(entity.id); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-[#888] hover:text-[#F0EDE8] hover:bg-white/5 transition-all">
          <Edit3 className="w-3 h-3" /> Edit
        </button>
        <button onClick={e => { e.stopPropagation(); genViews(entity.id); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-[#888] hover:text-[#F0EDE8] hover:bg-white/5 transition-all disabled:opacity-40"
          disabled={!!generating[entity.id]}>
          {generating[entity.id]
            ? <><RefreshCw className="w-3 h-3 animate-spin" /> Generating…</>
            : <><Undo2 className="w-3 h-3" /> Redo</>}
        </button>
      </div>
    </div>
  );

  const DetailModal = ({ entity }: { entity: Entity }) => {
    const [prompt, setPrompt] = useState('');
    const imageModel = IMAGE_MODELS.find(m => m.id === 'seedream-4') ?? IMAGE_MODELS[0];

    return (
      <div className="fixed inset-0 z-50 flex" style={{ background: 'rgba(0,0,0,0.92)' }}>
        {/* Thumbnail strip */}
        <div className="w-[68px] border-r border-white/8 flex flex-col items-center py-3 gap-2" style={{ background: '#0D0D10' }}>
          <button className="w-10 h-10 rounded-lg border border-[#C9A96E]/50 bg-[#C9A96E]/10 flex items-center justify-center">
            <span className="text-[8px] font-bold" style={{ color: entity.color }}>F</span>
          </button>
          {Array.from({ length: Math.min(entity.views - 1, 3) }).map((_, i) => (
            <button key={i} className="w-10 h-10 rounded-lg border border-white/8 flex items-center justify-center hover:border-white/20 transition-colors">
              <span className="text-[8px] text-[#555]">{['S','¾','B'][i]}</span>
            </button>
          ))}
          <button className="w-10 h-10 rounded-lg border border-dashed border-white/10 flex items-center justify-center hover:border-white/20 transition-colors">
            <Plus className="w-4 h-4 text-[#444]" />
          </button>
        </div>

        {/* Action toolbar + main preview */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8" style={{ background: '#0D0D10' }}>
            <span className="text-xs px-2 py-1 rounded bg-[#C9A96E] text-[#08080A] font-medium">Chosen</span>
            {[
              { icon: Grid3X3, label: 'Use as Reference' },
              { icon: Camera, label: 'Local Inpaint' },
              { icon: RefreshCw, label: 'Regenerate' },
              { icon: Grid3X3, label: 'Generate 3-view' },
            ].map(a => (
              <button key={a.label} className="flex items-center gap-1.5 text-xs text-[#888] hover:text-[#F0EDE8] transition-colors border border-white/8 rounded-lg px-2.5 py-1.5 hover:border-white/20">
                <a.icon className="w-3 h-3" /> {a.label}
              </button>
            ))}
            <div className="ml-auto flex gap-2">
              <button className="p-1.5 text-[#555] hover:text-[#888] transition-colors"><Download className="w-4 h-4" /></button>
              <button className="p-1.5 text-[#555] hover:text-[#888] transition-colors"><X className="w-4 h-4" /></button>
              <button onClick={() => setDetailId(null)} className="p-1.5 text-[#555] hover:text-[#F0EDE8] transition-colors"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8"
            style={{ background: `linear-gradient(135deg, ${entity.color}05, #080810)` }}>
            <div className="max-w-lg w-full aspect-video rounded-2xl border border-white/8 flex items-center justify-center"
              style={{ background: `${entity.color}08` }}>
              <span className="text-4xl font-black opacity-20" style={{ color: entity.color }}>
                {entity.name.split('-').map(w => w[0]).join('').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Right detail panel */}
        <div className="w-[320px] border-l border-white/8 flex flex-col overflow-hidden" style={{ background: '#0D0D10' }}>
          <div className="flex-1 overflow-y-auto p-5">
            <h3 className="text-base font-medium text-[#F0EDE8] mb-2">{entity.name}</h3>
            <p className="text-xs text-[#666] leading-relaxed mb-5">{entity.description}</p>

            <div className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Multi-view Reference ({entity.views})</div>
            <div className="flex gap-2 mb-5">
              {Array.from({ length: entity.views }).map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-lg border border-white/10 flex flex-col items-center justify-center gap-1"
                  style={{ background: `${entity.color}08` }}>
                  <span className="text-[9px]" style={{ color: entity.color }}>{['F','S','¾','B'][i]}</span>
                  <span className="text-[7px] text-[#444]">view</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prompt + generate */}
          <div className="p-3 border-t border-white/8">
            <div className="w-8 h-8 rounded-lg border border-dashed border-white/10 flex items-center justify-center mb-2">
              <Plus className="w-4 h-4 text-[#444]" />
            </div>
            <textarea placeholder="Enter your prompt here" rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none mb-2" />

            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-[#666]">
                <span>Seedream 4</span>
                <ChevronDown className="w-3 h-3" />
                <span>·</span>
                <span>16:9</span>
                <span>·</span>
                <span>2K</span>
              </div>
              <button className="flex items-center gap-1 bg-[#C9A96E] text-[#08080A] rounded-lg px-3 py-1.5 text-xs font-medium hover:opacity-90">
                <Sparkles className="w-3 h-3" /> 3
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const detailEntity = entities.find(e => e.id === detailId);

  return (
    <>
      {detailEntity && <DetailModal entity={detailEntity} />}
      <div className="flex-1 overflow-y-auto p-6" style={{ background: '#0A0A0C' }}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Characters */}
          <div>
            <h2 className="text-base font-medium text-[#F0EDE8] mb-4">Character</h2>
            <div className="grid grid-cols-2 gap-4">
              {chars.map(e => <EntityCard key={e.id} entity={e} />)}
              <button className="rounded-2xl border border-dashed border-white/8 flex flex-col items-center justify-center gap-2 min-h-[180px] hover:border-white/20 transition-colors text-[#444] hover:text-[#666]">
                <Plus className="w-6 h-6" />
                <span className="text-xs">Add Character</span>
              </button>
            </div>
          </div>

          {/* Scenes */}
          <div>
            <h2 className="text-base font-medium text-[#F0EDE8] mb-4">Scene</h2>
            <div className="grid grid-cols-2 gap-4">
              {scenes.map(e => <EntityCard key={e.id} entity={e} />)}
              <button className="rounded-2xl border border-dashed border-white/8 flex flex-col items-center justify-center gap-2 min-h-[180px] hover:border-white/20 transition-colors text-[#444] hover:text-[#666]">
                <Plus className="w-6 h-6" />
                <span className="text-xs">Add Scene</span>
              </button>
            </div>
          </div>

          {/* Reference / Look & Feel */}
          <div>
            <h2 className="text-base font-medium text-[#F0EDE8] mb-2">Reference & Look / Feel</h2>
            <p className="text-xs text-[#555] mb-4">Upload mood board images that define the visual style. The Production Designer agent will incorporate these across all assets.</p>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <button key={i} className="aspect-video rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-1.5 hover:border-white/20 transition-colors">
                  <Upload className="w-4 h-4 text-[#444]" />
                  <span className="text-[10px] text-[#444]">Add reference</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Storyboard Stage ─────────────────────────────────────────────────────────

function renderDesc(text: string, entities: Entity[]) {
  return text.split(/(@[\w-]+|\[@[\w-]+\])/g).map((part, i) => {
    const clean = part.replace(/^\[?@/, '').replace(/\]$/, '');
    const entity = entities.find(e => e.name.toLowerCase() === clean.toLowerCase());
    if (entity) return <span key={i} className="font-semibold" style={{ color: entity.color }}>@{entity.name}</span>;
    return <span key={i}>{part}</span>;
  });
}

function StoryboardStage({
  shots, setShots, entities,
}: { shots: Shot[]; setShots: (s: Shot[]) => void; entities: Entity[] }) {
  const totalCredits = shots.length * 307;

  const generateImage = (shotId: string, imgIdx: number) => {
    setShots(shots.map(s => s.id !== shotId ? s : {
      ...s, images: s.images.map((img, i) => i === imgIdx ? { status: 'generating' } : img)
    }));
    setTimeout(() => setShots(shots.map(s => s.id !== shotId ? s : {
      ...s, images: s.images.map((img, i) => i === imgIdx ? { status: 'done' } : img)
    })), 2200);
  };

  const generateVideo = (shotId: string) => {
    setShots(shots.map(s => s.id !== shotId ? s : { ...s, video: { status: 'generating' } }));
    setTimeout(() => setShots(shots.map(s => s.id !== shotId ? s : { ...s, video: { status: 'done', duration: '12s' } })), 3500);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#0A0A0C' }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-[11px] text-[#888] border border-white/10 rounded-lg px-3 py-1.5 hover:border-white/20 hover:text-[#F0EDE8] transition-all">
            <Download className="w-3 h-3" /> Batch Download
          </button>
          <button className="flex items-center gap-1.5 text-[11px] text-[#888] border border-white/10 rounded-lg px-3 py-1.5 hover:border-white/20 hover:text-[#F0EDE8] transition-all">
            <Upload className="w-3 h-3" /> Upload
          </button>
          <button className="flex items-center gap-1.5 text-[11px] text-[#888] border border-white/10 rounded-lg px-3 py-1.5 hover:border-white/20 hover:text-[#F0EDE8] transition-all">
            <Plus className="w-3 h-3" /> Add Shot
          </button>
        </div>
        <button className="flex items-center gap-2 text-[11px] border border-[#C9A96E]/30 text-[#C9A96E] rounded-lg px-3 py-1.5 hover:border-[#C9A96E] transition-colors">
          <Sparkles className="w-3 h-3" /> Storyboard Estimation: {totalCredits}
        </button>
      </div>

      {/* Table header */}
      <div className="grid border-b border-white/5 bg-white/1.5 flex-shrink-0"
        style={{ gridTemplateColumns: '40px 1fr 88px 340px 230px' }}>
        {['#', 'Description', 'Entity', 'Images', 'Videos'].map(h => (
          <div key={h} className="px-3 py-2 text-[10px] text-[#444] uppercase tracking-wider">{h}</div>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {shots.map(shot => (
          <div key={shot.id} className="grid border-b border-white/5 hover:bg-white/1 transition-colors"
            style={{ gridTemplateColumns: '40px 1fr 88px 340px 230px', minHeight: 180 }}>
            {/* # */}
            <div className="flex items-start justify-center pt-5 text-sm font-light text-[#444]">{shot.num}</div>

            {/* Description */}
            <div className="px-3 py-4 border-r border-white/5 overflow-hidden">
              <div className="text-[11px] text-[#888] leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
                {renderDesc(shot.description, entities)}
              </div>
            </div>

            {/* Entities */}
            <div className="px-2 py-4 flex flex-col gap-1.5 border-r border-white/5">
              {shot.entities.slice(0, 4).map(eid => {
                const e = entities.find(en => en.id === eid);
                if (!e) return null;
                return (
                  <div key={eid} className="w-9 h-9 rounded-lg flex items-center justify-center border flex-shrink-0"
                    style={{ borderColor: `${e.color}40`, background: `${e.color}10` }}>
                    <span className="text-[8px] font-bold" style={{ color: e.color }}>
                      {e.name.split('-').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Images */}
            <div className="px-3 py-4 border-r border-white/5">
              <div className="flex gap-2 mb-2">
                {shot.images.map((img, idx) => (
                  <div key={idx}
                    className={cn('w-36 h-24 rounded-xl border flex items-center justify-center overflow-hidden relative flex-shrink-0',
                      img.status === 'done'       ? 'border-white/10 bg-[#18181e]' :
                      img.status === 'generating' ? 'border-[#C9A96E]/20 bg-white/2' :
                      'border-dashed border-white/8 bg-white/2'
                    )}>
                    {img.status === 'generating' ? (
                      <RefreshCw className="w-4 h-4 text-[#C9A96E] animate-spin" />
                    ) : img.status === 'done' ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a24] to-[#0d0d14] flex items-center justify-center">
                        <ImgIcon className="w-5 h-5 text-[#2a2a34]" />
                      </div>
                    ) : (
                      <button onClick={() => generateImage(shot.id, idx)}
                        className="flex flex-col items-center gap-1 text-[#444] hover:text-[#888] transition-colors">
                        <Wand2 className="w-4 h-4" />
                        <span className="text-[9px]">Generate</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                {['Edit', 'Redo', 'Quote'].map(a => (
                  <button key={a} className="text-[10px] text-[#555] hover:text-[#888] transition-colors">{a}</button>
                ))}
              </div>
            </div>

            {/* Video */}
            <div className="px-3 py-4">
              <div className={cn('w-44 h-24 rounded-xl border flex items-center justify-center overflow-hidden mb-2 relative',
                shot.video.status === 'done'       ? 'border-white/10 bg-[#18181e]' :
                shot.video.status === 'error'      ? 'border-red-500/30 bg-red-500/5' :
                shot.video.status === 'generating' ? 'border-[#C9A96E]/20 bg-white/2' :
                'border-dashed border-white/8 bg-white/2'
              )}>
                {shot.video.status === 'generating' ? (
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-[#C9A96E] animate-spin" />
                    <span className="text-[9px] text-[#555]">Generating…</span>
                  </div>
                ) : shot.video.status === 'done' ? (
                  <>
                    <button className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </button>
                    {shot.video.duration && (
                      <span className="absolute bottom-1.5 right-1.5 text-[9px] text-white/40 bg-black/50 px-1 py-0.5 rounded">
                        {shot.video.duration}
                      </span>
                    )}
                  </>
                ) : shot.video.status === 'error' ? (
                  <div className="flex flex-col items-center gap-1 p-2 text-center">
                    <X className="w-4 h-4 text-red-400" />
                    <span className="text-[9px] text-red-400 font-medium">Insufficient balance</span>
                    <span className="text-[8px] text-[#555]">Please recharge and try again</span>
                    <span className="text-[8px] text-[#444]">Required: $1.34 · Available: $0.57</span>
                  </div>
                ) : (
                  <button onClick={() => generateVideo(shot.id)}
                    className="flex flex-col items-center gap-1.5 text-[#444] hover:text-[#888] transition-colors">
                    <Film className="w-5 h-5" />
                    <span className="text-[9px]">Generate Video</span>
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                {['Edit', 'Redo', 'Quote'].map(a => (
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
  const [current, setCurrent] = useState(0);
  const selected = shots[0];
  const totalSec = shots.length * 12;
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}.01`;

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: '#0A0A0C' }}>
      {/* Left: Shot detail panel */}
      <div className="w-[240px] flex-shrink-0 border-r border-white/8 overflow-y-auto p-4 space-y-4" style={{ background: '#0D0D10' }}>
        <div className="text-xs font-medium text-[#F0EDE8]">Shot {selected?.num}</div>

        <div>
          <div className="text-[9px] text-[#444] uppercase tracking-wide mb-2">Shot Description</div>
          <div className="text-[10px] text-[#777] leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
            {selected && renderDesc(selected.description.slice(0, 250) + '…', entities)}
          </div>
        </div>

        <div>
          <div className="text-[9px] text-[#444] uppercase tracking-wide mb-2">Subject Reference</div>
          <div className="flex flex-wrap gap-1.5">
            {selected?.entities.map(eid => {
              const e = entities.find(en => en.id === eid);
              if (!e) return null;
              return (
                <div key={eid} className="flex flex-col items-center gap-0.5">
                  <div className="w-10 h-10 rounded-lg border flex items-center justify-center"
                    style={{ borderColor: `${e.color}40`, background: `${e.color}10` }}>
                    <span className="text-[9px] font-bold" style={{ color: e.color }}>
                      {e.name.split('-').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[7px] text-[#444] w-10 text-center truncate">{e.name.split('-')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[9px] text-[#444] uppercase tracking-wide mb-2">
            Reference Image <Edit3 className="w-3 h-3" />
          </div>
          <div className="grid grid-cols-2 gap-1">
            {[0, 1].map(i => (
              <div key={i} className="aspect-video rounded-lg bg-[#15151c] border border-white/5 flex items-center justify-center">
                <span className="text-[8px] text-[#2a2a38]">ref {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[9px] text-[#444] uppercase tracking-wide mb-2">Generated Video</div>
          <div className="aspect-video rounded-lg bg-[#15151c] border border-white/5 flex items-center justify-center">
            <Play className="w-4 h-4 text-[#333]" />
          </div>
        </div>
      </div>

      {/* Center: Video preview + timeline */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
          <h2 className="text-sm font-medium text-[#F0EDE8]">TimeLine</h2>
          <button className="flex items-center gap-2 bg-[#C9A96E] text-[#08080A] rounded-xl px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" /> Render Video
          </button>
        </div>

        {/* Video player */}
        <div className="flex-1 flex items-center justify-center px-8 py-6">
          <div className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden border border-white/8"
            style={{ aspectRatio: '16/9' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a24] to-[#08080c] flex items-center justify-center">
              <div className="text-center">
                <Film className="w-10 h-10 text-[#2a2a35] mx-auto mb-2" />
                <span className="text-xs text-[#333]">Video Preview</span>
              </div>
            </div>
            {/* Player controls overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setPlaying(!playing)}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  {playing
                    ? <Pause className="w-3.5 h-3.5 text-white fill-white" />
                    : <Play className="w-3.5 h-3.5 text-white fill-white" />}
                </button>
                <Volume2 className="w-4 h-4 text-white/60" />
                <span className="text-xs text-white/60">{fmt(current)}</span>
                <div className="flex-1 h-1 bg-white/20 rounded-full">
                  <div className="h-full bg-[#C9A96E] rounded-full" style={{ width: `${(current / totalSec) * 100}%` }} />
                </div>
                <span className="text-xs text-white/40">{fmt(totalSec)}</span>
                <Maximize2 className="w-4 h-4 text-white/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline scrubber */}
        <div className="border-t border-white/8 flex-shrink-0" style={{ background: '#0D0D10', height: 140 }}>
          {/* Controls */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5">
            <button onClick={() => setPlaying(!playing)}
              className="w-6 h-6 rounded flex items-center justify-center text-[#888] hover:text-[#F0EDE8]">
              {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[11px] text-[#C9A96E] font-mono">{fmt(current)}</span>
            <span className="text-[11px] text-[#444] font-mono">{fmt(totalSec)}</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[11px] text-[#555]">−</span>
              <div className="w-20 h-1.5 bg-white/10 rounded-full">
                <div className="w-1/2 h-full bg-[#C9A96E]/50 rounded-full" />
              </div>
              <span className="text-[11px] text-[#555]">+</span>
            </div>
          </div>

          {/* Time ruler */}
          <div className="relative overflow-x-auto">
            <div className="flex text-[9px] text-[#444] px-2 py-1" style={{ minWidth: 800 }}>
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} className="flex-1 border-l border-white/5 pl-1">{fmt(i * 5)}</div>
              ))}
            </div>
            {/* Clip track */}
            <div className="flex gap-1 px-2 pb-2" style={{ minWidth: 800 }}>
              {shots.map((shot, si) => (
                <div key={shot.id}
                  className={cn('flex-1 h-14 rounded-lg overflow-hidden border cursor-pointer transition-all',
                    si === 0 ? 'border-[#C9A96E]/40' : 'border-white/8 hover:border-white/20'
                  )}
                  style={{ background: si === 0 ? '#1a1814' : '#14141a' }}>
                  <div className="p-1.5">
                    <div className="text-[8px] text-[#666] truncate">
                      {shot.description.split('\n')[0].slice(0, 40)}…
                    </div>
                    <div className="text-[7px] text-[#444] mt-0.5">{shot.video.duration ?? '—'}</div>
                  </div>
                  {shot.video.status === 'error' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500/10">
                      <X className="w-4 h-4 text-red-500/60" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export function CraftVideoPage() {
  const [stage, setStage]   = useState<Stage>('brief');
  const [script, setScript] = useState('');
  const [entities, setEntities] = useState<Entity[]>(DEMO_ENTITIES);
  const [shots, setShots]   = useState<Shot[]>(DEMO_SHOTS);
  const [msgs, setMsgs]     = useState<AgentMessage[]>(AGENT_INTROS.brief);

  const [settings, setSettings] = useState<ModelSettings>({
    videoModel: VIDEO_MODELS.find(m => m.id === 'auto') ?? VIDEO_MODELS[0],
    imageModel: IMAGE_MODELS.find(m => m.id === 'auto') ?? IMAGE_MODELS[0],
    aspect: '16:9', quality: '720p', duration: 'Auto (12s)', audio: true,
  });

  const goTo = (s: Stage) => {
    setStage(s);
    setMsgs(AGENT_INTROS[s]);
  };

  const completedStages: Stage[] = stage === 'brief' ? []
    : stage === 'script'     ? ['brief']
    : stage === 'characters' ? ['brief','script']
    : stage === 'storyboard' ? ['brief','script','characters']
    : ['brief','script','characters','storyboard'];

  const isCanvas = stage === 'brief';

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]" style={{ background: '#0A0A0C' }}>
      {/* ── Top navigation bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/8 flex-shrink-0" style={{ background: '#0D0D10' }}>
        <div className="text-sm text-[#888] font-medium truncate max-w-[160px]">New Base</div>

        {/* Stage tabs */}
        <div className="flex items-center gap-1">
          {STAGES.map((s, idx) => {
            const done = completedStages.includes(s.id);
            const active = stage === s.id;
            return (
              <div key={s.id} className="flex items-center">
                {idx > 0 && (
                  <div className="flex gap-0.5 mx-1">
                    {[0,1,2].map(d => (
                      <div key={d} className={cn('w-0.5 h-0.5 rounded-full', done ? 'bg-[#C9A96E]/50' : 'bg-white/15')} />
                    ))}
                  </div>
                )}
                <button
                  onClick={() => done || active ? goTo(s.id) : undefined}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all',
                    active   ? 'bg-[#C9A96E] text-[#08080A] font-medium' :
                    done     ? 'text-[#888] hover:text-[#F0EDE8] hover:bg-white/5 cursor-pointer' :
                               'text-[#444] cursor-default'
                  )}
                >
                  {done && !active && <Check className="w-3 h-3 text-[#C9A96E]" />}
                  {s.label}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button className="text-xs text-[#555] border border-white/8 rounded-lg px-2.5 py-1.5 hover:border-white/20 hover:text-[#888] transition-all flex items-center gap-1.5">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Stage content */}
        {isCanvas ? (
          <CanvasStage onNext={() => goTo('script')} />
        ) : (
          <>
            <div className="flex-1 flex flex-col overflow-hidden">
              {stage === 'script'     && <ScriptStage script={script} setScript={setScript} />}
              {stage === 'characters' && <CharactersStage entities={entities} setEntities={setEntities} />}
              {stage === 'storyboard' && <StoryboardStage shots={shots} setShots={setShots} entities={entities} />}
              {stage === 'timeline'   && <TimelineStage shots={shots} entities={entities} />}

              {/* Continue button (not on timeline) */}
              {stage !== 'timeline' && (
                <div className="px-5 py-3 border-t border-white/8 flex items-center justify-between flex-shrink-0" style={{ background: '#0D0D10' }}>
                  <span className="text-xs text-[#555]">
                    {stage === 'script'     && 'Script is pre-filled from Manifest. Edit freely or continue.'}
                    {stage === 'characters' && 'Generate or upload all entities before continuing to Storyboard.'}
                    {stage === 'storyboard' && 'Confirm image prompts per shot, then generate videos.'}
                  </span>
                  <button
                    onClick={() => {
                      const next: Stage = stage === 'script' ? 'characters' : stage === 'characters' ? 'storyboard' : 'timeline';
                      goTo(next);
                    }}
                    className="flex items-center gap-2 bg-[#C9A96E] text-[#08080A] rounded-xl px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Continue <ChevronDown className="w-4 h-4 -rotate-90" />
                  </button>
                </div>
              )}
            </div>

            {/* Right panel */}
            <RightPanel
              entities={entities}
              stage={stage}
              settings={settings}
              setSettings={setSettings}
              msgs={msgs}
              setMsgs={setMsgs}
            />
          </>
        )}
      </div>
    </div>
  );
}
