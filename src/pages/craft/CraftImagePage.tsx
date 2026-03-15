import { useState } from 'react';
import { Wand2, Upload, RefreshCw, Download, ChevronDown, Sparkles, Check, Send, Image as ImgIcon, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGE_MODELS, getTierColor, type CraftModel } from '@/lib/craft/models';

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:5' | '3:4' | '21:9';

const ASPECT_RATIOS: { id: AspectRatio; label: string; w: number; h: number }[] = [
  { id:'1:1',  label:'1:1',   w:1,  h:1  },
  { id:'16:9', label:'16:9',  w:16, h:9  },
  { id:'9:16', label:'9:16',  w:9,  h:16 },
  { id:'4:5',  label:'4:5',   w:4,  h:5  },
  { id:'3:4',  label:'3:4',   w:3,  h:4  },
  { id:'21:9', label:'21:9',  w:21, h:9  },
];

const STYLE_PRESETS = [
  { id:'photorealistic', label:'Photorealistic', emoji:'📷' },
  { id:'editorial',      label:'Editorial',      emoji:'📰' },
  { id:'illustration',   label:'Illustration',   emoji:'🎨' },
  { id:'product',        label:'Product Shot',   emoji:'📦' },
  { id:'cinematic',      label:'Cinematic',      emoji:'🎬' },
  { id:'minimal',        label:'Minimalist',     emoji:'⬜' },
  { id:'typographic',    label:'Typographic',    emoji:'✏️' },
  { id:'abstract',       label:'Abstract',       emoji:'🌀' },
];

interface GenResult { id: string; status: 'generating' | 'done' | 'error'; seed?: number; }
interface AgentMsg  { role: 'agent' | 'user'; text: string; }

export function CraftImagePage() {
  const [prompt, setPrompt]         = useState('');
  const [negPrompt, setNegPrompt]   = useState('');
  const [style, setStyle]           = useState('photorealistic');
  const [aspect, setAspect]         = useState<AspectRatio>('1:1');
  const [quantity, setQuantity]     = useState(4);
  const [model, setModel]           = useState<CraftModel>(IMAGE_MODELS.find(m => m.id === 'auto')!);
  const [results, setResults]       = useState<GenResult[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selected, setSelected]     = useState<string | null>(null);
  const [modelOpen, setModelOpen]   = useState(false);
  const [chatInput, setChatInput]   = useState('');
  const [msgs, setMsgs]             = useState<AgentMsg[]>([
    { role:'agent', text:'I\'ve pulled context from your Manifest brief. Ready to generate images.\n\nRecommended: Mystic 2.5 for brand work, Ideogram for text in images, Flux.2 Pro for hero photography.' },
  ]);

  const ar = ASPECT_RATIOS.find(a => a.id === aspect)!;

  const generate = () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    const ids = Array.from({ length: quantity }, (_, i) => ({ id: `g-${Date.now()}-${i}`, status: 'generating' as const }));
    setResults(ids);
    ids.forEach((r, i) => setTimeout(() => {
      setResults(p => p.map(x => x.id === r.id ? { ...x, status: 'done', seed: Math.floor(Math.random() * 99999) } : x));
      if (i === ids.length - 1) setGenerating(false);
    }, 1400 + i * 350));
  };

  const send = () => {
    if (!chatInput.trim()) return;
    setMsgs(p => [...p, { role: 'user', text: chatInput }]);
    setChatInput('');
  };

  const tc = getTierColor(model.tier);

  return (
    <div className="flex h-[calc(100vh-64px)]" style={{ background:'#0A0A0C' }}>

      {/* ── Left: Brief panel ─────────────────────────── */}
      <div className="w-[300px] flex-shrink-0 border-r border-white/8 overflow-y-auto" style={{ background:'#0D0D10' }}>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#C9A96E]/15 flex items-center justify-center">
              <ImgIcon className="w-3.5 h-3.5 text-[#C9A96E]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#F0EDE8]">Image Generation</div>
              <div className="text-[11px] text-[#555]">Art Director Agent</div>
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Prompt</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder="Describe subject, setting, mood, lighting, composition…"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none leading-relaxed" />
          </div>

          {/* Style presets */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Visual Style</label>
            <div className="grid grid-cols-2 gap-1.5">
              {STYLE_PRESETS.map(s => (
                <button key={s.id} onClick={() => setStyle(s.id === style ? '' : s.id)}
                  className={cn('flex items-center gap-1.5 p-2 rounded-lg border text-left transition-all text-[11px]',
                    style === s.id ? 'border-[#C9A96E] bg-[#C9A96E]/10 text-[#F0EDE8]' : 'border-white/8 bg-white/3 text-[#777] hover:border-white/15'
                  )}>
                  <span>{s.emoji}</span> {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Negative */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Negative Prompt</label>
            <input value={negPrompt} onChange={e => setNegPrompt(e.target.value)}
              placeholder="What to avoid…"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-white/20" />
          </div>

          {/* Aspect ratio */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Aspect Ratio</label>
            <div className="flex gap-1.5 flex-wrap">
              {ASPECT_RATIOS.map(a => (
                <button key={a.id} onClick={() => setAspect(a.id)}
                  className={cn('px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all',
                    aspect === a.id ? 'bg-[#C9A96E] text-[#08080A]' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{a.label}</button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Quantity</label>
            <div className="flex gap-1.5">
              {[1,2,4].map(n => (
                <button key={n} onClick={() => setQuantity(n)}
                  className={cn('flex-1 py-1.5 rounded-lg text-xs transition-all',
                    quantity === n ? 'bg-[#C9A96E] text-[#08080A] font-medium' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{n}</button>
              ))}
            </div>
          </div>

          {/* Reference */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Reference Image (optional)</label>
            <button className="w-full border border-dashed border-white/12 rounded-lg p-3 flex flex-col items-center gap-1.5 hover:border-white/20 transition-colors">
              <Upload className="w-4 h-4 text-[#444]" />
              <span className="text-[11px] text-[#555]">Upload reference</span>
            </button>
          </div>

          <button onClick={generate} disabled={!prompt.trim() || generating}
            className="w-full bg-[#C9A96E] text-[#08080A] rounded-lg py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
            {generating
              ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating…</>
              : <><Wand2 className="w-4 h-4" />Generate</>}
          </button>
        </div>
      </div>

      {/* ── Center: Results ───────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {results.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl border border-dashed border-white/10 flex items-center justify-center mx-auto mb-4">
                <ImgIcon className="w-7 h-7 text-[#333]" />
              </div>
              <div className="text-sm font-light text-[#F0EDE8] mb-2">Ready to generate</div>
              <p className="text-xs text-[#555] leading-relaxed">Add your prompt and style on the left, pick a model on the right, and click Generate.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between flex-shrink-0">
              <div className="text-xs text-[#555]">
                {results.filter(r => r.status === 'done').length}/{results.length} generated · {model.name}
              </div>
              <div className="flex items-center gap-2">
                {selected && (
                  <>
                    <button className="flex items-center gap-1.5 text-xs text-[#999] border border-white/10 rounded-lg px-3 py-1.5 hover:border-white/20 hover:text-[#F0EDE8] transition-all">
                      <Download className="w-3 h-3" /> Export
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-[#C9A96E] border border-[#C9A96E]/30 rounded-lg px-3 py-1.5 hover:border-[#C9A96E] transition-all">
                      <Check className="w-3 h-3" /> Approve to Amplify
                    </button>
                  </>
                )}
                <button onClick={generate} disabled={generating}
                  className="flex items-center gap-1.5 text-xs text-[#777] border border-white/10 rounded-lg px-3 py-1.5 hover:border-white/20 hover:text-[#F0EDE8] transition-all disabled:opacity-40">
                  <RefreshCw className={cn('w-3 h-3', generating && 'animate-spin')} /> Regenerate all
                </button>
              </div>
            </div>

            <div className={cn('flex-1 overflow-y-auto p-5 grid gap-4',
              quantity <= 2 ? 'grid-cols-2' : 'grid-cols-2'
            )}>
              {results.map(r => (
                <button key={r.id} onClick={() => setSelected(r.id === selected ? null : r.id)}
                  className={cn('relative rounded-xl overflow-hidden border transition-all',
                    selected === r.id ? 'border-[#C9A96E] ring-1 ring-[#C9A96E]/30' : 'border-white/8 hover:border-white/20'
                  )}
                  style={{ aspectRatio:`${ar.w}/${ar.h}` }}>
                  {r.status === 'generating' ? (
                    <div className="absolute inset-0 bg-[#0D0D10] flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 text-[#C9A96E] animate-spin" />
                      <span className="text-xs text-[#555]">Generating…</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a24] to-[#0d0d14] flex items-center justify-center">
                      <ImgIcon className="w-8 h-8 text-[#2a2a34]" />
                    </div>
                  )}
                  {selected === r.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C9A96E] flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#08080A]" />
                    </div>
                  )}
                  {r.seed && r.status === 'done' && (
                    <div className="absolute bottom-2 left-2 text-[11px] text-white/30 bg-black/50 px-1.5 py-0.5 rounded">
                      seed {r.seed}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Right: Agent + Model settings ────────────── */}
      <div className="w-[300px] flex-shrink-0 border-l border-white/8 flex flex-col overflow-hidden" style={{ background:'#0D0D10' }}>
        {/* Chat */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === 'agent' ? 'flex gap-2' : 'flex justify-end'}>
              {m.role === 'agent' ? (
                <><div className="w-5 h-5 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-[#C9A96E]" />
                </div>
                <div className="bg-white/4 rounded-xl rounded-tl-none px-3 py-2.5 text-[11px] text-[#B0A898] leading-relaxed flex-1" style={{ whiteSpace:'pre-line' }}>{m.text}</div></>
              ) : (
                <div className="bg-[#C9A96E]/12 border border-[#C9A96E]/20 rounded-xl rounded-tr-none px-3 py-2 text-[11px] text-[#F0EDE8] max-w-[90%]">{m.text}</div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-3 py-2 border-t border-white/5">
          <div className="flex gap-2">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Refine prompt, ask for variations…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40" />
            <button onClick={send} className="p-2 bg-[#C9A96E] text-[#08080A] rounded-xl hover:opacity-90 flex-shrink-0">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Model settings bar */}
        <div className="border-t border-white/8 p-3 space-y-2" style={{ background:'#0A0A0C' }}>
          {/* Model picker */}
          <div className="relative">
            <button onClick={() => setModelOpen(!modelOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors text-xs" style={{ background:'#0D0D10' }}>
              <span className="text-[#F0EDE8] font-medium">{model.name}</span>
              <div className="flex items-center gap-1.5">
                {model.recommended && <span className="text-[11px] text-[#C9A96E]">★</span>}
                <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ color:tc, background:`${tc}18` }}>{model.tier}</span>
                <ChevronDown className={cn('w-3 h-3 text-[#555] transition-transform', modelOpen && 'rotate-180')} />
              </div>
            </button>
            {modelOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#0D0D10] border border-white/10 rounded-xl z-50 max-h-72 overflow-y-auto shadow-2xl">
                {IMAGE_MODELS.map(m => {
                  const tc2 = getTierColor(m.tier);
                  return (
                    <button key={m.id} onClick={() => { setModel(m); setModelOpen(false); }}
                      className={cn('w-full text-left px-3 py-2 hover:bg-white/5 transition-colors',
                        model.id === m.id && 'bg-[#C9A96E]/8'
                      )}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-[#F0EDE8]">{m.name}</span>
                        <div className="flex items-center gap-1">
                          {m.new && <span className="text-[8px] bg-[#7abf8e]/15 text-[#7abf8e] px-1 rounded">NEW</span>}
                          {m.recommended && <span className="text-[11px] text-[#C9A96E]">★</span>}
                          <span className="text-[11px] px-1 rounded" style={{ color:tc2, background:`${tc2}18` }}>{m.tier}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-[#555]">{m.description.slice(0,70)}…</div>
                      <div className="flex gap-1 mt-1">
                        {m.tags.slice(0,3).map(t => <span key={t} className="text-[8px] bg-white/5 text-[#444] px-1 py-0.5 rounded">{t}</span>)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Aspect + quantity quick controls */}
          <div className="flex items-center gap-2 text-[11px] text-[#666]">
            <span>{aspect}</span>
            <span className="text-[#333]">·</span>
            <span>{quantity} image{quantity > 1 ? 's' : ''}</span>
            <span className="text-[#333]">·</span>
            <span className="text-[#C9A96E]/80">~{model.creditsPerUnit * quantity} credits</span>
          </div>
        </div>
      </div>

    </div>
  );
}
