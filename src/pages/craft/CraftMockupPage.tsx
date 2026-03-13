import { useState } from 'react';
import { Upload, Wand2, RefreshCw, Send, Sparkles, ChevronDown, Check, Download, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGE_MODELS, getTierColor, type CraftModel } from '@/lib/craft/models';

const SURFACES   = ['Flat Lay','Studio Shot','Lifestyle Context','Outdoor','Hands-On','Close-Up Detail','Billboard / OOH','Packaging Stack'];
const LIGHTINGS  = ['Natural Diffuse','Studio Soft Box','Hard Directional','Backlit','Golden Hour','Neon / Artificial','Dark & Moody'];
const BACKGROUNDS= ['Pure White','Light Grey','Dark Studio','Textured Surface','Abstract','Scene / Context','Transparent'];

export function CraftMockupPage() {
  const [productUploaded, setProductUploaded] = useState(false);
  const [surface, setSurface]       = useState('Studio Shot');
  const [lighting, setLighting]     = useState('Natural Diffuse');
  const [background, setBackground] = useState('Pure White');
  const [prompt, setPrompt]         = useState('');
  const [model, setModel]           = useState<CraftModel>(IMAGE_MODELS.find(m => m.id === 'mystic-2-5') ?? IMAGE_MODELS[0]);
  const [results, setResults]       = useState<Array<{ id: string; status: 'generating' | 'done' }>>([]);
  const [generating, setGenerating] = useState(false);
  const [modelOpen, setModelOpen]   = useState(false);
  const [chatInput, setChatInput]   = useState('');
  const [chatMsgs, setChatMsgs]     = useState([{ role: 'agent', text: 'Upload your product image and I\'ll place it in a professional context.\n\nFor premium packaging work, use Mystic 2.5 — it handles product surfaces and material properties exceptionally well.' }]);

  const generate = () => {
    setGenerating(true);
    const ids = [0,1,2,3].map((_, i) => ({ id: `m-${Date.now()}-${i}`, status: 'generating' as const }));
    setResults(ids);
    ids.forEach((r, i) => {
      setTimeout(() => {
        setResults(prev => prev.map(p => p.id === r.id ? { ...p, status: 'done' } : p));
        if (i === ids.length - 1) setGenerating(false);
      }, 1200 + i * 350);
    });
  };

  const tc = getTierColor(model.tier);

  return (
    <div className="flex h-[calc(100vh-80px)]" style={{ background: '#0A0A0C' }}>
      <div className="w-[300px] flex flex-col border-r border-white/8 overflow-y-auto" style={{ background: '#0D0D10' }}>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#e0a87a]/15 flex items-center justify-center">
              <Box className="w-3.5 h-3.5 text-[#e0a87a]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#F0EDE8]">Product Mockup</div>
              <div className="text-[11px] text-[#555]">Art Director Agent</div>
            </div>
          </div>

          {/* Product upload */}
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Product Image</label>
            <button onClick={() => setProductUploaded(!productUploaded)}
              className={cn('w-full rounded-xl border p-4 flex flex-col items-center gap-2 transition-all',
                productUploaded ? 'border-[#C9A96E]/40 bg-[#C9A96E]/5' : 'border-dashed border-white/12 bg-white/2 hover:border-white/20'
              )}>
              {productUploaded ? (
                <>
                  <div className="w-16 h-16 rounded-lg bg-white/8 flex items-center justify-center">
                    <Box className="w-7 h-7 text-[#C9A96E]" />
                  </div>
                  <div className="text-[10px] text-[#C9A96E]">product.png · uploaded</div>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-[#444]" />
                  <span className="text-[11px] text-[#555]">Upload product image</span>
                  <span className="text-[9px] text-[#444]">PNG, JPG — with or without background</span>
                </>
              )}
            </button>
          </div>

          {/* Surface */}
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Scene Type</label>
            <div className="grid grid-cols-2 gap-1">
              {SURFACES.map(s => (
                <button key={s} onClick={() => setSurface(s)}
                  className={cn('px-2 py-1.5 rounded-lg border text-[10px] text-left transition-all',
                    surface === s ? 'border-[#C9A96E] bg-[#C9A96E]/10 text-[#F0EDE8]' : 'border-white/8 bg-white/3 text-[#777] hover:border-white/15'
                  )}>{s}</button>
              ))}
            </div>
          </div>

          {/* Lighting */}
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Lighting</label>
            <div className="flex flex-wrap gap-1">
              {LIGHTINGS.map(l => (
                <button key={l} onClick={() => setLighting(l)}
                  className={cn('px-2 py-1 rounded-lg text-[10px] transition-all',
                    lighting === l ? 'bg-[#C9A96E] text-[#08080A]' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{l}</button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Background</label>
            <div className="flex flex-wrap gap-1">
              {BACKGROUNDS.map(b => (
                <button key={b} onClick={() => setBackground(b)}
                  className={cn('px-2 py-1 rounded-lg text-[10px] transition-all',
                    background === b ? 'bg-[#C9A96E] text-[#08080A]' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{b}</button>
              ))}
            </div>
          </div>

          {/* Custom prompt */}
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Additional Direction</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={2}
              placeholder="Shot from above, luxury feel, marble surface, warm tones…"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none" />
          </div>

          {/* Model */}
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Model</label>
            <div className="relative">
              <button onClick={() => setModelOpen(!modelOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 bg-white/3 hover:border-white/20 text-xs">
                <span className="font-medium text-[#F0EDE8]">{model.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ color: tc, background: `${tc}18` }}>{model.tier}</span>
                  <ChevronDown className="w-3 h-3 text-[#555]" />
                </div>
              </button>
              {modelOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#0D0D10] border border-white/10 rounded-xl shadow-2xl z-50 max-h-52 overflow-y-auto">
                  {IMAGE_MODELS.filter(m => ['auto','mystic-2-5','flux-2-pro','google-imagen-4','recraft-v4','seedream-4-5'].includes(m.id)).map(m => (
                    <button key={m.id} onClick={() => { setModel(m); setModelOpen(false); }}
                      className={cn('w-full text-left px-3 py-2 hover:bg-white/5 transition-colors', model.id === m.id && 'bg-[#C9A96E]/10')}>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-[#F0EDE8]">{m.name}</span>
                        {m.recommended && <span className="text-[9px] text-[#C9A96E]">★</span>}
                      </div>
                      <div className="text-[10px] text-[#555] mt-0.5">{m.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button onClick={generate} disabled={generating}
            className="w-full bg-[#C9A96E] text-[#08080A] rounded-lg py-3 text-sm font-medium hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2">
            {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating…</> : <><Wand2 className="w-4 h-4" />Generate Mockups</>}
          </button>
        </div>

        {/* Agent chat */}
        <div className="border-t border-white/8 flex flex-col" style={{ minHeight: 160, maxHeight: 240 }}>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {chatMsgs.map((m, i) => (
              <div key={i} className={m.role === 'agent' ? 'flex gap-2' : 'flex justify-end'}>
                {m.role === 'agent' ? (
                  <><div className="w-5 h-5 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0 mt-0.5"><Sparkles className="w-2.5 h-2.5 text-[#C9A96E]" /></div>
                  <div className="text-[11px] text-[#A0998F] leading-relaxed flex-1">{m.text}</div></>
                ) : (
                  <div className="bg-[#C9A96E]/12 border border-[#C9A96E]/20 rounded-xl rounded-tr-none px-3 py-2 text-[11px] text-[#F0EDE8] max-w-[88%]">{m.text}</div>
                )}
              </div>
            ))}
          </div>
          <div className="p-3 flex gap-2">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && chatInput.trim()) { setChatMsgs(p => [...p, { role: 'user', text: chatInput }]); setChatInput(''); } }}
              placeholder="Adjust scene, lighting, style…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40" />
            <button onClick={() => { if (chatInput.trim()) { setChatMsgs(p => [...p, { role: 'user', text: chatInput }]); setChatInput(''); } }}
              className="w-8 h-8 flex items-center justify-center bg-[#C9A96E] text-[#08080A] rounded-xl hover:opacity-90">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right: results */}
      <div className="flex-1 overflow-y-auto p-5">
        {results.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl border border-dashed border-white/10 flex items-center justify-center mx-auto mb-4"><Box className="w-7 h-7 text-[#333]" /></div>
              <div className="text-sm text-[#F0EDE8] font-light mb-2">Mockups will appear here</div>
              <p className="text-xs text-[#555] leading-relaxed">Upload your product, choose a scene type and lighting, then generate.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-w-3xl">
            {results.map(r => (
              <div key={r.id} className="rounded-xl border border-white/8 overflow-hidden group" style={{ background: '#0F0F12' }}>
                <div className="aspect-square flex items-center justify-center relative" style={{ background: '#1a1a22' }}>
                  {r.status === 'generating' ? (
                    <RefreshCw className="w-6 h-6 text-[#C9A96E] animate-spin" />
                  ) : (
                    <>
                      <Box className="w-10 h-10 text-[#333]" />
                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg bg-black/60 backdrop-blur">
                          <Download className="w-3.5 h-3.5 text-white" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-[#C9A96E] text-[#08080A]">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div className="text-[10px] text-[#666]">{surface} · {lighting}</div>
                  {r.status === 'done' && (
                    <span className="text-[9px] text-[#C9A96E] bg-[#C9A96E]/10 px-2 py-0.5 rounded">Generated</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
