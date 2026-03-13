import { useState } from 'react';
import { Upload, Wand2, RefreshCw, Send, Sparkles, ChevronDown, Check, Download, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGE_MODELS, getTierColor, type CraftModel } from '@/lib/craft/models';

const SHOT_TYPES  = ['Portrait','Editorial','Fashion','Architecture','Street','Product','Food','Landscape'];
const AESTHETICS  = ['Hyper-Realistic','Film Grain / Analog','High Fashion','Documentary','Dark Cinematic','Bright & Airy','Monochrome'];
const CAMERAS     = ['35mm Film','Medium Format','Leica M','Canon 5D','Sony A7','iPhone RAW','8×10 Large Format'];

export function CraftPhotographyPage() {
  const [subject, setSubject]       = useState('');
  const [scene, setScene]           = useState('');
  const [shotType, setShotType]     = useState('Portrait');
  const [aesthetic, setAesthetic]   = useState('Hyper-Realistic');
  const [cameraStyle, setCameraStyle]= useState('Medium Format');
  const [model, setModel]           = useState<CraftModel>(IMAGE_MODELS.find(m => m.id === 'google-imagen-4') ?? IMAGE_MODELS[0]);
  const [results, setResults]       = useState<Array<{ id: string; status: 'generating' | 'done' }>>([]);
  const [generating, setGenerating] = useState(false);
  const [modelOpen, setModelOpen]   = useState(false);
  const [quantity, setQuantity]     = useState(4);
  const [chatInput, setChatInput]   = useState('');
  const [chatMsgs, setChatMsgs]     = useState([{ role: 'agent', text: 'Ready to direct your AI photography session. Describe the subject, scene, and aesthetic direction.\n\nFor photorealistic results, Google Imagen 4 Ultra or Seedream 4 4K are the top choices. Mystic 2.5 is exceptional for fashion and editorial.' }]);

  const generate = () => {
    setGenerating(true);
    const ids = Array.from({ length: quantity }, (_, i) => ({ id: `p-${Date.now()}-${i}`, status: 'generating' as const }));
    setResults(ids);
    ids.forEach((r, i) => {
      setTimeout(() => {
        setResults(prev => prev.map(p => p.id === r.id ? { ...p, status: 'done' } : p));
        if (i === ids.length - 1) setGenerating(false);
      }, 1300 + i * 400);
    });
  };

  const tc = getTierColor(model.tier);

  return (
    <div className="flex h-[calc(100vh-80px)]" style={{ background: '#0A0A0C' }}>
      <div className="w-[300px] flex flex-col border-r border-white/8 overflow-y-auto" style={{ background: '#0D0D10' }}>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#7ae0b8]/15 flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-[#7ae0b8]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#F0EDE8]">AI Photography</div>
              <div className="text-[11px] text-[#555]">Photography Director Agent</div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)}
              placeholder="A woman in her 30s, confident, natural beauty…"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40" />
          </div>

          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Location & Scene</label>
            <input value={scene} onChange={e => setScene(e.target.value)}
              placeholder="Rooftop at golden hour, Mumbai skyline, hazy light…"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40" />
          </div>

          {/* Shot type */}
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Shot Type</label>
            <div className="grid grid-cols-2 gap-1">
              {SHOT_TYPES.map(s => (
                <button key={s} onClick={() => setShotType(s)}
                  className={cn('px-2 py-1.5 rounded-lg border text-[10px] text-left transition-all',
                    shotType === s ? 'border-[#C9A96E] bg-[#C9A96E]/10 text-[#F0EDE8]' : 'border-white/8 bg-white/3 text-[#777] hover:border-white/15'
                  )}>{s}</button>
              ))}
            </div>
          </div>

          {/* Aesthetic */}
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Aesthetic</label>
            <div className="flex flex-wrap gap-1">
              {AESTHETICS.map(a => (
                <button key={a} onClick={() => setAesthetic(a)}
                  className={cn('px-2 py-1 rounded-lg text-[10px] transition-all',
                    aesthetic === a ? 'bg-[#C9A96E] text-[#08080A]' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{a}</button>
              ))}
            </div>
          </div>

          {/* Camera */}
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Camera / Film Style</label>
            <div className="flex flex-wrap gap-1">
              {CAMERAS.map(c => (
                <button key={c} onClick={() => setCameraStyle(c)}
                  className={cn('px-2 py-1 rounded-lg text-[10px] transition-all',
                    cameraStyle === c ? 'bg-[#C9A96E] text-[#08080A]' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{c}</button>
              ))}
            </div>
          </div>

          {/* Upload reference */}
          <div>
            <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Reference (optional)</label>
            <button className="w-full border border-dashed border-white/12 rounded-lg p-3 flex items-center justify-center gap-2 hover:border-white/20 transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#444]" />
              <span className="text-[11px] text-[#555]">Upload reference image</span>
            </button>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Quantity</label>
              <div className="flex gap-1">
                {[1, 2, 4].map(n => (
                  <button key={n} onClick={() => setQuantity(n)}
                    className={cn('flex-1 py-1.5 rounded-lg text-xs transition-all',
                      quantity === n ? 'bg-[#C9A96E] text-[#08080A] font-medium' : 'bg-white/5 text-[#777] hover:bg-white/8'
                    )}>{n}</button>
                ))}
              </div>
            </div>
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
                  {IMAGE_MODELS.filter(m => m.capabilities?.photoreal || m.capabilities?.realistic || ['auto','google-imagen-4','google-imagen-4-ultra','seedream-4-4k','mystic-2-5'].includes(m.id)).map(m => (
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

          <button onClick={generate} disabled={generating || (!subject.trim() && !scene.trim())}
            className="w-full bg-[#C9A96E] text-[#08080A] rounded-lg py-3 text-sm font-medium hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2">
            {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Shooting…</> : <><Wand2 className="w-4 h-4" />Generate Photos</>}
          </button>
        </div>

        {/* Chat */}
        <div className="border-t border-white/8 flex flex-col" style={{ maxHeight: 220 }}>
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
              placeholder="Adjust composition, lighting…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40" />
            <button onClick={() => { if (chatInput.trim()) { setChatMsgs(p => [...p, { role: 'user', text: chatInput }]); setChatInput(''); } }}
              className="w-8 h-8 flex items-center justify-center bg-[#C9A96E] text-[#08080A] rounded-xl hover:opacity-90">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-5">
        {results.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl border border-dashed border-white/10 flex items-center justify-center mx-auto mb-4"><Camera className="w-7 h-7 text-[#333]" /></div>
              <div className="text-sm text-[#F0EDE8] font-light mb-2">Your photo shoot will appear here</div>
              <p className="text-xs text-[#555] leading-relaxed">Describe your subject and scene, choose aesthetic and camera style, then generate.</p>
            </div>
          </div>
        ) : (
          <div className={cn('grid gap-4', quantity === 1 ? 'max-w-lg' : quantity === 2 ? 'grid-cols-2 max-w-3xl' : 'grid-cols-2 max-w-3xl')}>
            {results.map(r => (
              <div key={r.id} className="rounded-xl border border-white/8 overflow-hidden aspect-[4/5] relative flex items-center justify-center group" style={{ background: '#1a1a22' }}>
                {r.status === 'generating' ? (
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-[#C9A96E] animate-spin" />
                    <span className="text-xs text-[#555]">Shooting…</span>
                  </div>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-[#333]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                      <span className="text-[10px] text-white/70">{shotType} · {aesthetic}</span>
                      <div className="flex gap-1.5">
                        <button className="p-1.5 rounded-lg bg-black/60 backdrop-blur"><Download className="w-3.5 h-3.5 text-white" /></button>
                        <button className="p-1.5 rounded-lg bg-[#C9A96E] text-[#08080A]"><Check className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
