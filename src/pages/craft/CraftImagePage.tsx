import { useState } from 'react';
import { Wand2, Upload, Plus, RefreshCw, Download, ChevronDown, Sparkles, Check, Send, Image as ImgIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGE_MODELS, getTierColor, type CraftModel } from '@/lib/craft/models';

type Stage = 'brief' | 'generate' | 'refine';
type AspectRatio = '1:1' | '16:9' | '9:16' | '4:5' | '3:4' | '21:9';

const ASPECT_RATIOS: { id: AspectRatio; label: string; w: number; h: number }[] = [
  { id: '1:1',  label: '1:1',   w: 1, h: 1   },
  { id: '16:9', label: '16:9',  w: 16, h: 9  },
  { id: '9:16', label: '9:16',  w: 9, h: 16  },
  { id: '4:5',  label: '4:5',   w: 4, h: 5   },
  { id: '3:4',  label: '3:4',   w: 3, h: 4   },
  { id: '21:9', label: '21:9',  w: 21, h: 9  },
];

const STYLE_PRESETS = [
  { id: 'photorealistic', label: 'Photorealistic', emoji: '📷', desc: 'True-to-life photography' },
  { id: 'editorial',      label: 'Editorial',      emoji: '📰', desc: 'Magazine & press style' },
  { id: 'illustration',   label: 'Illustration',   emoji: '🎨', desc: 'Artistic & illustrated' },
  { id: 'product',        label: 'Product Shot',   emoji: '📦', desc: 'Clean product imaging' },
  { id: 'cinematic',      label: 'Cinematic',      emoji: '🎬', desc: 'Film-quality aesthetics' },
  { id: 'minimal',        label: 'Minimalist',     emoji: '⬜', desc: 'Clean, stripped-back' },
];

interface GeneratedResult {
  id: string; status: 'generating' | 'done' | 'error'; seed?: number;
}

function ModelSelector({ selected, onSelect }: { selected: CraftModel; onSelect: (m: CraftModel) => void }) {
  const [open, setOpen] = useState(false);
  const tc = getTierColor(selected.tier);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/3 hover:border-white/20 transition-colors text-xs">
        <span className="font-medium text-[#F0EDE8]">{selected.name}</span>
        <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ color: tc, background: `${tc}18` }}>{selected.tier.toUpperCase()}</span>
        <ChevronDown className={cn('w-3 h-3 text-[#666] transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-[#0D0D10] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 max-h-96 overflow-y-auto space-y-1">
            {IMAGE_MODELS.map(m => {
              const tc2 = getTierColor(m.tier);
              return (
                <button key={m.id} onClick={() => { onSelect(m); setOpen(false); }}
                  className={cn('w-full text-left p-2.5 rounded-lg transition-all hover:bg-white/5',
                    selected.id === m.id && 'bg-[#C9A96E]/10 border border-[#C9A96E]/30'
                  )}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#F0EDE8]">{m.name}</span>
                    <div className="flex items-center gap-1.5">
                      {m.new && <span className="text-[9px] px-1 py-0.5 rounded bg-[#7abf8e]/15 text-[#7abf8e]">NEW</span>}
                      {m.recommended && <span className="text-[9px] px-1 py-0.5 rounded bg-[#C9A96E]/15 text-[#C9A96E]">★</span>}
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: tc2, background: `${tc2}18` }}>{m.tier}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#666] mb-1.5">{m.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {m.tags.slice(0,3).map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-[#555]">{t}</span>)}
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

export function CraftImagePage() {
  const [stage, setStage] = useState<Stage>('brief');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState('');
  const [aspect, setAspect] = useState<AspectRatio>('1:1');
  const [quantity, setQuantity] = useState(4);
  const [model, setModel] = useState<CraftModel>(IMAGE_MODELS.find(m => m.id === 'auto')!);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMsgs, setChatMsgs] = useState([
    { role: 'agent', text: 'I\'ve pulled context from your Manifest brief. Ready to generate images.\n\nDescribe what you need, choose a visual style, and pick a model. I\'ll recommend Mystic 2.5 for brand work, Ideogram if you need text in the image, or Flux.2 Pro for hero photography.' }
  ]);

  const generate = () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setStage('generate');
    const ids = Array.from({ length: quantity }, (_, i) => ({ id: `gen-${Date.now()}-${i}`, status: 'generating' as const }));
    setResults(ids);
    ids.forEach((r, i) => {
      setTimeout(() => {
        setResults(prev => prev.map(p => p.id === r.id ? { ...p, status: 'done', seed: Math.floor(Math.random() * 99999) } : p));
        if (i === ids.length - 1) setGenerating(false);
      }, 1500 + i * 400);
    });
  };

  const aspectPreview = ASPECT_RATIOS.find(a => a.id === aspect)!;
  const previewW = 120;
  const previewH = Math.round(previewW * aspectPreview.h / aspectPreview.w);

  return (
    <div className="flex h-[calc(100vh-80px)]" style={{ background: '#0A0A0C' }}>
      {/* Left panel — brief */}
      <div className="w-[340px] flex flex-col border-r border-white/8 overflow-y-auto" style={{ background: '#0D0D10' }}>
        <div className="p-5 border-b border-white/8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#C9A96E]/15 flex items-center justify-center">
              <ImgIcon className="w-3.5 h-3.5 text-[#C9A96E]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#F0EDE8]">Image Generation</div>
              <div className="text-[11px] text-[#555]">Art Director Agent</div>
            </div>
          </div>

          {/* Prompt */}
          <div className="mb-4">
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Prompt</label>
            <textarea
              value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder="Describe the image in detail — subject, setting, mood, lighting, composition…"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none leading-relaxed"
            />
          </div>

          {/* Style presets */}
          <div className="mb-4">
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Visual Style</label>
            <div className="grid grid-cols-3 gap-1.5">
              {STYLE_PRESETS.map(s => (
                <button key={s.id} onClick={() => setStyle(s.id === style ? '' : s.id)}
                  className={cn('p-2 rounded-lg border text-left transition-all',
                    style === s.id ? 'border-[#C9A96E] bg-[#C9A96E]/10' : 'border-white/8 bg-white/3 hover:border-white/15'
                  )}>
                  <div className="text-sm mb-0.5">{s.emoji}</div>
                  <div className="text-[10px] font-medium text-[#F0EDE8] leading-tight">{s.label}</div>
                  <div className="text-[9px] text-[#555] leading-tight">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Negative prompt */}
          <div className="mb-4">
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Negative Prompt</label>
            <input
              value={negativePrompt} onChange={e => setNegativePrompt(e.target.value)}
              placeholder="What to avoid…"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-white/20"
            />
          </div>

          {/* Aspect ratio */}
          <div className="mb-4">
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Aspect Ratio</label>
            <div className="flex gap-1.5 flex-wrap">
              {ASPECT_RATIOS.map(a => (
                <button key={a.id} onClick={() => setAspect(a.id)}
                  className={cn('px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all',
                    aspect === a.id ? 'bg-[#C9A96E] text-[#08080A]' : 'bg-white/5 text-[#999] hover:bg-white/8'
                  )}>{a.label}</button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Quantity — {quantity}</label>
            <div className="flex gap-1.5">
              {[1, 2, 4].map(n => (
                <button key={n} onClick={() => setQuantity(n)}
                  className={cn('flex-1 py-1.5 rounded-lg text-xs transition-all',
                    quantity === n ? 'bg-[#C9A96E] text-[#08080A] font-medium' : 'bg-white/5 text-[#999] hover:bg-white/8'
                  )}>{n}</button>
              ))}
            </div>
          </div>

          {/* Reference image */}
          <div className="mb-4">
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Reference Image (optional)</label>
            <button className="w-full border border-dashed border-white/12 rounded-lg p-3 flex flex-col items-center gap-1.5 hover:border-white/20 transition-colors">
              <Upload className="w-4 h-4 text-[#444]" />
              <span className="text-[11px] text-[#555]">Upload reference</span>
            </button>
          </div>

          {/* Model selector */}
          <div className="mb-5">
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Model</label>
            <ModelSelector selected={model} onSelect={setModel} />
            <div className="mt-2 text-[10px] text-[#555]">
              Cost: ~{model.creditsPerUnit * quantity} credits for {quantity} image{quantity > 1 ? 's' : ''}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!prompt.trim() || generating}
            className="w-full bg-[#C9A96E] text-[#08080A] rounded-lg py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating…</> : <><Wand2 className="w-4 h-4" />Generate</>}
          </button>
        </div>

        {/* Agent chat */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMsgs.map((m, i) => (
              <div key={i} className={m.role === 'agent' ? 'flex gap-2' : 'flex justify-end'}>
                {m.role === 'agent' ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-[#C9A96E]" />
                    </div>
                    <div className="bg-white/5 rounded-lg rounded-tl-none p-2.5 text-[11px] text-[#C0B8AC] leading-relaxed flex-1">{m.text}</div>
                  </>
                ) : (
                  <div className="bg-[#C9A96E]/15 border border-[#C9A96E]/20 rounded-lg rounded-tr-none p-2.5 text-[11px] text-[#F0EDE8] max-w-[85%]">{m.text}</div>
                )}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/8 flex gap-2">
            <input
              value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && chatInput.trim()) { setChatMsgs(p => [...p, { role: 'user', text: chatInput }]); setChatInput(''); } }}
              placeholder="Refine prompt, ask for variations…"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40"
            />
            <button onClick={() => { if (chatInput.trim()) { setChatMsgs(p => [...p, { role: 'user', text: chatInput }]); setChatInput(''); } }}
              className="p-2 bg-[#C9A96E] text-[#08080A] rounded-lg hover:opacity-90">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right — results grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {results.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl border border-dashed border-white/10 flex items-center justify-center mx-auto mb-4">
                <ImgIcon className="w-7 h-7 text-[#333]" />
              </div>
              <div className="text-sm text-[#F0EDE8] font-light mb-2">Ready to generate</div>
              <p className="text-xs text-[#555] leading-relaxed">Add your prompt and style on the left, pick a model, and click Generate.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between">
              <div className="text-xs text-[#666]">{results.filter(r => r.status === 'done').length}/{results.length} generated · {model.name}</div>
              <div className="flex items-center gap-2">
                {selectedResult && (
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
                  className="flex items-center gap-1.5 text-xs text-[#999] border border-white/10 rounded-lg px-3 py-1.5 hover:border-white/20 hover:text-[#F0EDE8] transition-all disabled:opacity-40">
                  <RefreshCw className={cn('w-3 h-3', generating && 'animate-spin')} /> Regenerate all
                </button>
              </div>
            </div>
            <div className={cn('flex-1 overflow-y-auto p-5 grid gap-4',
              quantity === 1 ? 'grid-cols-1 max-w-2xl mx-auto w-full' :
              quantity === 2 ? 'grid-cols-2' : 'grid-cols-2'
            )}>
              {results.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedResult(r.id === selectedResult ? null : r.id)}
                  className={cn('relative rounded-xl overflow-hidden border transition-all',
                    selectedResult === r.id ? 'border-[#C9A96E] ring-1 ring-[#C9A96E]/30' : 'border-white/8 hover:border-white/20'
                  )}
                  style={{ aspectRatio: `${aspectPreview.w}/${aspectPreview.h}` }}
                >
                  {r.status === 'generating' ? (
                    <div className="absolute inset-0 bg-[#0D0D10] flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 text-[#C9A96E] animate-spin" />
                      <span className="text-xs text-[#555]">Generating…</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a20] to-[#0d0d12] flex items-center justify-center">
                      <ImgIcon className="w-8 h-8 text-[#333]" />
                    </div>
                  )}
                  {selectedResult === r.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C9A96E] flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#08080A]" />
                    </div>
                  )}
                  {r.status === 'done' && r.seed && (
                    <div className="absolute bottom-2 left-2 text-[9px] text-white/40 bg-black/50 px-1.5 py-0.5 rounded">
                      seed {r.seed}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
