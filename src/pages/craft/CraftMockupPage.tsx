import { useState } from 'react';
import { Upload, Wand2, RefreshCw, Send, Sparkles, ChevronDown, Check, Download, Box, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGE_MODELS, getTierColor, type CraftModel } from '@/lib/craft/models';

const SURFACES    = ['Flat Lay','Studio Shot','Lifestyle Context','Outdoor / Nature','Hands-On','Close-Up Detail','Billboard / OOH','Packaging Stack','Shelf Context','Gift Box'];
const LIGHTINGS   = ['Natural Diffuse','Studio Soft Box','Hard Directional','Backlit Rim','Golden Hour','Neon / Artificial','Dark & Moody','High Key White'];
const BACKGROUNDS = ['Pure White','Light Grey Studio','Dark Studio','Textured Surface','Abstract Gradient','Scene Context','Transparent (PNG)','Bokeh Blur'];

interface MockupResult { id: string; status: 'generating' | 'done'; }
interface AgentMsg    { role: 'agent' | 'user'; text: string; }

const MOCKUP_MODELS = IMAGE_MODELS.filter(m =>
  ['auto','mystic-2-5','flux-2-pro','google-imagen-4','recraft-v4','recraft-v4-pro'].includes(m.id)
);

export function CraftMockupPage() {
  const [uploaded, setUploaded]       = useState(false);
  const [surface, setSurface]         = useState('Studio Shot');
  const [lighting, setLighting]       = useState('Natural Diffuse');
  const [background, setBackground]   = useState('Pure White');
  const [prompt, setPrompt]           = useState('');
  const [quantity, setQuantity]       = useState(4);
  const [model, setModel]             = useState<CraftModel>(MOCKUP_MODELS[0]);
  const [results, setResults]         = useState<MockupResult[]>([]);
  const [generating, setGenerating]   = useState(false);
  const [modelOpen, setModelOpen]     = useState(false);
  const [selected, setSelected]       = useState<string | null>(null);
  const [chatInput, setChatInput]     = useState('');
  const [msgs, setMsgs]               = useState<AgentMsg[]>([
    { role: 'agent', text: 'Ready to generate product mockups. Upload your product image first.\n\nFor clean product photography, Mystic 2.5 gives the best surface fidelity. For lifestyle context scenes, Flux.2 Pro handles depth and atmosphere better.' },
  ]);

  const generate = () => {
    if (!uploaded) return;
    setGenerating(true);
    const ids = Array.from({ length: quantity }, (_, i) => ({ id: `m-${Date.now()}-${i}`, status: 'generating' as const }));
    setResults(ids);
    ids.forEach((r, i) => setTimeout(() => {
      setResults(p => p.map(x => x.id === r.id ? { ...x, status: 'done' } : x));
      if (i === ids.length - 1) setGenerating(false);
    }, 1600 + i * 400));
  };

  const send = () => {
    if (!chatInput.trim()) return;
    setMsgs(p => [...p, { role: 'user', text: chatInput }]);
    setChatInput('');
  };

  const tc = getTierColor(model.tier);

  return (
    <div className="flex h-[calc(100vh-64px)]" style={{ background:'#0A0A0C' }}>

      {/* Left: Config */}
      <div className="w-[300px] flex-shrink-0 border-r border-white/8 overflow-y-auto" style={{ background:'#0D0D10' }}>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#e0a87a]/15 flex items-center justify-center">
              <Box className="w-3.5 h-3.5 text-[#e0a87a]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#F0EDE8]">Product Mockup</div>
              <div className="text-[11px] text-[#555]">Product Designer Agent</div>
            </div>
          </div>

          {/* Product upload */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Product Image</label>
            <button
              onClick={() => setUploaded(!uploaded)}
              className={cn('w-full border-2 rounded-xl p-5 flex flex-col items-center gap-2 transition-all',
                uploaded ? 'border-[#C9A96E]/50 bg-[#C9A96E]/5' : 'border-dashed border-white/12 hover:border-white/25'
              )}>
              {uploaded ? (
                <>
                  <div className="w-10 h-10 rounded-lg bg-[#C9A96E]/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-[#C9A96E]" />
                  </div>
                  <span className="text-xs text-[#C9A96E]">product.png uploaded</span>
                  <span className="text-[11px] text-[#555]">Click to replace</span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-[#444]" />
                  <span className="text-xs text-[#888]">Upload product image</span>
                  <span className="text-[11px] text-[#555]">PNG with transparent background works best</span>
                </>
              )}
            </button>
          </div>

          {/* Surface */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Surface / Placement</label>
            <div className="flex flex-wrap gap-1.5">
              {SURFACES.map(s => (
                <button key={s} onClick={() => setSurface(s)}
                  className={cn('px-2.5 py-1 rounded-lg text-[11px] transition-all',
                    surface === s ? 'bg-[#C9A96E] text-[#08080A] font-medium' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{s}</button>
              ))}
            </div>
          </div>

          {/* Lighting */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Lighting</label>
            <div className="flex flex-wrap gap-1.5">
              {LIGHTINGS.map(l => (
                <button key={l} onClick={() => setLighting(l)}
                  className={cn('px-2.5 py-1 rounded-lg text-[11px] transition-all',
                    lighting === l ? 'bg-[#C9A96E] text-[#08080A] font-medium' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{l}</button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Background</label>
            <div className="flex flex-wrap gap-1.5">
              {BACKGROUNDS.map(b => (
                <button key={b} onClick={() => setBackground(b)}
                  className={cn('px-2.5 py-1 rounded-lg text-[11px] transition-all',
                    background === b ? 'bg-[#C9A96E] text-[#08080A] font-medium' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{b}</button>
              ))}
            </div>
          </div>

          {/* Additional prompt */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Additional Direction</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder="E.g. 'luxury feel, marble surface, fresh flowers nearby'…"
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none" />
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

          <button onClick={generate} disabled={!uploaded || generating}
            className="w-full bg-[#C9A96E] text-[#08080A] rounded-lg py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
            {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating…</> : <><Wand2 className="w-4 h-4" />Generate Mockup</>}
          </button>
          {!uploaded && <p className="text-[11px] text-[#555] text-center">Upload a product image to generate mockups</p>}
        </div>
      </div>

      {/* Center: Results */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {results.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl border border-dashed border-white/10 flex items-center justify-center mx-auto mb-4">
                <Box className="w-7 h-7 text-[#333]" />
              </div>
              <div className="text-sm font-light text-[#F0EDE8] mb-2">Product mockups appear here</div>
              <p className="text-xs text-[#555] leading-relaxed">Upload your product, configure the scene, and generate. Works best with transparent background PNGs.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between flex-shrink-0">
              <div className="text-xs text-[#555]">{results.filter(r => r.status === 'done').length}/{results.length} generated · {surface} · {lighting}</div>
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
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 gap-4">
              {results.map(r => (
                <button key={r.id} onClick={() => setSelected(r.id === selected ? null : r.id)}
                  className={cn('relative rounded-xl overflow-hidden border aspect-square transition-all',
                    selected === r.id ? 'border-[#C9A96E] ring-1 ring-[#C9A96E]/30' : 'border-white/8 hover:border-white/20'
                  )}>
                  {r.status === 'generating' ? (
                    <div className="absolute inset-0 bg-[#0D0D10] flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 text-[#C9A96E] animate-spin" />
                      <span className="text-xs text-[#555]">Generating…</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1e] to-[#0d0d10] flex items-center justify-center">
                      <Box className="w-8 h-8 text-[#2a2a30]" />
                    </div>
                  )}
                  {selected === r.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C9A96E] flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#08080A]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right: Agent + Model */}
      <div className="w-[280px] flex-shrink-0 border-l border-white/8 flex flex-col overflow-hidden" style={{ background:'#0D0D10' }}>
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === 'agent' ? 'flex gap-2' : 'flex justify-end'}>
              {m.role === 'agent' ? (
                <><div className="w-5 h-5 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0 mt-0.5"><Sparkles className="w-2.5 h-2.5 text-[#C9A96E]" /></div>
                <div className="bg-white/4 rounded-xl rounded-tl-none px-3 py-2.5 text-[11px] text-[#B0A898] leading-relaxed flex-1" style={{ whiteSpace:'pre-line' }}>{m.text}</div></>
              ) : (
                <div className="bg-[#C9A96E]/12 border border-[#C9A96E]/20 rounded-xl rounded-tr-none px-3 py-2 text-[11px] text-[#F0EDE8] max-w-[90%]">{m.text}</div>
              )}
            </div>
          ))}
        </div>
        <div className="px-3 py-2 border-t border-white/5">
          <div className="flex gap-2">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Adjust scene, lighting, direction…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40" />
            <button onClick={send} className="p-2 bg-[#C9A96E] text-[#08080A] rounded-xl hover:opacity-90 flex-shrink-0"><Send className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <div className="border-t border-white/8 p-3" style={{ background:'#0A0A0C' }}>
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
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#0D0D10] border border-white/10 rounded-xl z-50 overflow-hidden shadow-2xl">
                {MOCKUP_MODELS.map(m => (
                  <button key={m.id} onClick={() => { setModel(m); setModelOpen(false); }}
                    className={cn('w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors', model.id === m.id && 'bg-[#C9A96E]/8')}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#F0EDE8]">{m.name}</span>
                      {m.recommended && <span className="text-[11px] text-[#C9A96E]">★</span>}
                    </div>
                    <div className="text-[11px] text-[#555] mt-0.5">{m.tags.slice(0,3).join(' · ')}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mt-2 text-[11px] text-[#555]">~{model.creditsPerUnit * quantity} credits for {quantity} mockup{quantity > 1 ? 's' : ''}</div>
        </div>
      </div>

    </div>
  );
}
