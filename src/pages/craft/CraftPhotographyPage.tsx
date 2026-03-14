import { useState } from 'react';
import { Upload, Wand2, RefreshCw, Send, Sparkles, ChevronDown, Check, Download, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGE_MODELS, getTierColor, type CraftModel } from '@/lib/craft/models';

const SHOT_TYPES  = ['Portrait','Editorial Fashion','Street Documentary','Architecture','Commercial Product','Food & Still Life','Landscape','Abstract'];
const AESTHETICS  = ['Hyper-Realistic','Film Grain / Analog','High Fashion Editorial','Dark Cinematic','Bright & Airy','Monochrome / B&W','Vogue-Style','Gritty Documentary'];
const CAMERAS     = ['Medium Format (Hasselblad)','35mm Film','Leica M11','Canon 5D Mark IV','Sony A7R V','iPhone RAW','8×10 Large Format','Drone / Aerial'];
const LENSES      = ['35mm f/1.4','50mm f/1.8','85mm f/1.2','24mm Wide','70-200mm Telephoto','Macro','Fish-Eye'];
const LIGHTINGS   = ['Natural Golden Hour','Overcast Diffused','Harsh Midday','Studio Strobe','Rembrandt','Split Lighting','Backlit Rim','Low Key Night'];

interface PhotoResult { id: string; status: 'generating' | 'done'; }
interface AgentMsg  { role: 'agent' | 'user'; text: string; }

const PHOTO_MODELS = IMAGE_MODELS.filter(m =>
  ['auto','google-imagen-4-ultra','google-imagen-4','seedream-4-4k','mystic-2-5','gpt-1-5-high','recraft-v4-pro'].includes(m.id)
);

export function CraftPhotographyPage() {
  const [subject, setSubject]         = useState('');
  const [scene, setScene]             = useState('');
  const [shotType, setShotType]       = useState('Portrait');
  const [aesthetic, setAesthetic]     = useState('Hyper-Realistic');
  const [camera, setCamera]           = useState('Medium Format (Hasselblad)');
  const [lens, setLens]               = useState('85mm f/1.2');
  const [lighting, setLighting]       = useState('Natural Golden Hour');
  const [quantity, setQuantity]       = useState(4);
  const [model, setModel]             = useState<CraftModel>(PHOTO_MODELS[0]);
  const [results, setResults]         = useState<PhotoResult[]>([]);
  const [generating, setGenerating]   = useState(false);
  const [modelOpen, setModelOpen]     = useState(false);
  const [selected, setSelected]       = useState<string | null>(null);
  const [chatInput, setChatInput]     = useState('');
  const [msgs, setMsgs]               = useState<AgentMsg[]>([
    { role: 'agent', text: 'I\'ll direct a photography session based on your brief.\n\nFor ultra-realistic editorial work, Imagen 4 Ultra is unmatched. For fashion and styled shoots, Seedream 4 4K gives the most controlled aesthetic. Recraft V4 Pro excels at specific stylistic references.' },
  ]);

  const generate = () => {
    if (!subject.trim()) return;
    setGenerating(true);
    const ids = Array.from({ length: quantity }, (_, i) => ({ id: `p-${Date.now()}-${i}`, status: 'generating' as const }));
    setResults(ids);
    ids.forEach((r, i) => setTimeout(() => {
      setResults(p => p.map(x => x.id === r.id ? { ...x, status: 'done' } : x));
      if (i === ids.length - 1) setGenerating(false);
    }, 1500 + i * 380));
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
            <div className="w-7 h-7 rounded-lg bg-[#7ae0b8]/15 flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-[#7ae0b8]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#F0EDE8]">AI Photography</div>
              <div className="text-[10px] text-[#555]">Photographer Agent</div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)}
              placeholder="Who or what is being photographed…"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40" />
          </div>

          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Scene / Location</label>
            <input value={scene} onChange={e => setScene(e.target.value)}
              placeholder="Setting, environment, background…"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40" />
          </div>

          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Shot Type</label>
            <div className="flex flex-wrap gap-1.5">
              {SHOT_TYPES.map(s => (
                <button key={s} onClick={() => setShotType(s)}
                  className={cn('px-2.5 py-1 rounded-lg text-[11px] transition-all',
                    shotType === s ? 'bg-[#C9A96E] text-[#08080A] font-medium' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Aesthetic Direction</label>
            <div className="flex flex-wrap gap-1.5">
              {AESTHETICS.map(a => (
                <button key={a} onClick={() => setAesthetic(a)}
                  className={cn('px-2.5 py-1 rounded-lg text-[11px] transition-all',
                    aesthetic === a ? 'bg-[#C9A96E] text-[#08080A] font-medium' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{a}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Camera / Film Stock</label>
            <div className="flex flex-wrap gap-1.5">
              {CAMERAS.map(c => (
                <button key={c} onClick={() => setCamera(c)}
                  className={cn('px-2.5 py-1 rounded-lg text-[11px] transition-all',
                    camera === c ? 'bg-[#C9A96E] text-[#08080A] font-medium' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{c}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Lens</label>
              <div className="relative">
                <select value={lens} onChange={e => setLens(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E]/40 appearance-none">
                  {LENSES.map(l => <option key={l}>{l}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#555] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Lighting</label>
              <div className="relative">
                <select value={lighting} onChange={e => setLighting(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E]/40 appearance-none">
                  {LIGHTINGS.map(l => <option key={l}>{l}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#555] pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Quantity</label>
            <div className="flex gap-1.5">
              {[1,2,4].map(n => (
                <button key={n} onClick={() => setQuantity(n)}
                  className={cn('flex-1 py-1.5 rounded-lg text-xs transition-all',
                    quantity === n ? 'bg-[#C9A96E] text-[#08080A] font-medium' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{n}</button>
              ))}
            </div>
          </div>

          <button onClick={generate} disabled={!subject.trim() || generating}
            className="w-full bg-[#C9A96E] text-[#08080A] rounded-lg py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
            {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Shooting…</> : <><Camera className="w-4 h-4" />Shoot</>}
          </button>
        </div>
      </div>

      {/* Center: Results */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {results.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl border border-dashed border-white/10 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-7 h-7 text-[#333]" />
              </div>
              <div className="text-sm font-light text-[#F0EDE8] mb-2">Photography session ready</div>
              <p className="text-xs text-[#555] leading-relaxed">Define subject, scene, camera style, and lighting. I'll direct the shoot.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-white/8 flex items-center justify-between flex-shrink-0">
              <div className="text-xs text-[#555]">{results.filter(r => r.status === 'done').length}/{results.length} shots · {camera.split(' ')[0]} · {aesthetic}</div>
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
                  className={cn('relative rounded-xl overflow-hidden border aspect-[4/3] transition-all',
                    selected === r.id ? 'border-[#C9A96E] ring-1 ring-[#C9A96E]/30' : 'border-white/8 hover:border-white/20'
                  )}>
                  {r.status === 'generating' ? (
                    <div className="absolute inset-0 bg-[#0D0D10] flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 text-[#C9A96E] animate-spin" />
                      <span className="text-xs text-[#555]">Shooting…</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a24] to-[#0d0d14] flex items-center justify-center">
                      <Camera className="w-8 h-8 text-[#2a2a34]" />
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
              placeholder="Adjust direction, request retakes…"
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
                {model.recommended && <span className="text-[9px] text-[#C9A96E]">★</span>}
                <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ color:tc, background:`${tc}18` }}>{model.tier}</span>
                <ChevronDown className={cn('w-3 h-3 text-[#555] transition-transform', modelOpen && 'rotate-180')} />
              </div>
            </button>
            {modelOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#0D0D10] border border-white/10 rounded-xl z-50 overflow-hidden shadow-2xl">
                {PHOTO_MODELS.map(m => (
                  <button key={m.id} onClick={() => { setModel(m); setModelOpen(false); }}
                    className={cn('w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors', model.id === m.id && 'bg-[#C9A96E]/8')}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#F0EDE8]">{m.name}</span>
                      {m.recommended && <span className="text-[9px] text-[#C9A96E]">★</span>}
                    </div>
                    <div className="text-[10px] text-[#555] mt-0.5">{m.tags.slice(0,3).join(' · ')}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mt-2 text-[10px] text-[#555]">~{model.creditsPerUnit * quantity} credits for {quantity} shot{quantity > 1 ? 's' : ''}</div>
        </div>
      </div>

    </div>
  );
}
