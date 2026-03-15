import { useState } from 'react';
import { Wand2, RefreshCw, Copy, Check, Send, Sparkles, Image as ImgIcon, Hash, Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IMAGE_MODELS, getTierColor, type CraftModel } from '@/lib/craft/models';

const PLATFORMS = [
  { id:'instagram',  label:'Instagram',  icon:'📸', maxCaption:2200,  formats:['Feed','Story','Reel'] },
  { id:'linkedin',   label:'LinkedIn',   icon:'💼', maxCaption:3000,  formats:['Post','Article','Video'] },
  { id:'x',          label:'X / Twitter',icon:'𝕏',  maxCaption:280,   formats:['Post','Thread'] },
  { id:'youtube',    label:'YouTube',    icon:'▶️', maxCaption:5000,  formats:['Video','Short','Community'] },
  { id:'tiktok',     label:'TikTok',     icon:'🎵', maxCaption:2200,  formats:['Video'] },
  { id:'facebook',   label:'Facebook',   icon:'👥', maxCaption:63206, formats:['Post','Reel','Story'] },
];

const TONES = [
  { id:'professional',    label:'Professional',  emoji:'📊' },
  { id:'conversational',  label:'Conversational',emoji:'💬' },
  { id:'inspirational',   label:'Inspirational', emoji:'✨' },
  { id:'humorous',        label:'Humorous',      emoji:'😄' },
  { id:'urgent',          label:'Urgent / CTA',  emoji:'🔥' },
  { id:'storytelling',    label:'Storytelling',  emoji:'📖' },
];

const SAMPLE_CAPTIONS: Record<string, string> = {
  instagram: 'Every great brand story starts with a single, powerful insight. What\'s yours? 🎯\n\nWe\'ve helped 200+ brands find the thread that pulls everything together — from strategy to content to conversion.\n\nSwipe to see the process →',
  linkedin: 'The brands that resonate aren\'t the loudest. They\'re the clearest.\n\nAfter 5 years and 400+ campaigns, the pattern is consistent: the winning brands know exactly who they\'re speaking to, what they truly need, and why now.\n\nHere\'s what we\'ve learned about building creative that actually moves people:',
  x: 'The best campaigns aren\'t about the product. They\'re about the feeling the product makes possible. 🎯',
  youtube: 'We broke down 100 viral campaigns to find what they have in common. The results were surprising.',
  tiktok: 'POV: You finally crack your brand\'s creative code 🔓✨',
  facebook: 'What separates a good campaign from a great one? It\'s rarely the budget. We\'ll show you the framework our highest-performing clients use.',
};

interface PostVariant { id: string; platform: string; format: string; caption: string; hashtags: string[]; status: 'idle' | 'generating' | 'done'; copied?: boolean; }
interface AgentMsg  { role: 'agent' | 'user'; text: string; }

const SOCIAL_MODELS = IMAGE_MODELS.filter(m =>
  ['auto','mystic-2-5','flux-2-pro','ideogram','google-imagen-4','recraft-v4'].includes(m.id)
);

export function CraftSocialPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram','linkedin']);
  const [brief, setBrief]           = useState('');
  const [tone, setTone]             = useState('professional');
  const [model, setModel]           = useState<CraftModel>(SOCIAL_MODELS[0]);
  const [variants, setVariants]     = useState<PostVariant[]>([]);
  const [generating, setGenerating] = useState(false);
  const [modelOpen, setModelOpen]   = useState(false);
  const [chatInput, setChatInput]   = useState('');
  const [msgs, setMsgs]             = useState<AgentMsg[]>([
    { role:'agent', text:'Ready to create platform-optimised content. I\'ll adapt tone, character count, hashtag density, and visual format per platform.\n\nFor LinkedIn, I recommend a data-led hook. For Instagram, lead with emotion then CTA.' },
  ]);

  const toggle = (pid: string) =>
    setSelectedPlatforms(p => p.includes(pid) ? p.filter(x => x !== pid) : [...p, pid]);

  const generate = () => {
    if (!brief.trim() || selectedPlatforms.length === 0) return;
    setGenerating(true);
    const newVariants: PostVariant[] = selectedPlatforms.map(pid => ({
      id: `${pid}-${Date.now()}`, platform: pid, format: PLATFORMS.find(p => p.id === pid)!.formats[0],
      caption: '', hashtags: [], status: 'generating',
    }));
    setVariants(newVariants);
    newVariants.forEach((v, i) => setTimeout(() => {
      const p = PLATFORMS.find(pl => pl.id === v.platform)!;
      const raw = SAMPLE_CAPTIONS[v.platform] ?? brief;
      const cap = raw.length > p.maxCaption ? raw.slice(0, p.maxCaption - 3) + '...' : raw;
      setVariants(prev => prev.map(pv => pv.id === v.id ? {
        ...pv, status: 'done', caption: cap,
        hashtags: ['#hypnotic','#creative','#branding','#content'].slice(0,4),
      } : pv));
      if (i === newVariants.length - 1) setGenerating(false);
    }, 1200 + i * 500));
  };

  const copy = (vid: string) => {
    const v = variants.find(x => x.id === vid);
    if (v) navigator.clipboard.writeText(v.caption + '\n\n' + v.hashtags.join(' '));
    setVariants(p => p.map(x => x.id === vid ? { ...x, copied: true } : x));
    setTimeout(() => setVariants(p => p.map(x => x.id === vid ? { ...x, copied: false } : x)), 2000);
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
            <div className="w-7 h-7 rounded-lg bg-[#7aaee0]/15 flex items-center justify-center">
              <Hash className="w-3.5 h-3.5 text-[#7aaee0]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#F0EDE8]">Social Post Generator</div>
              <div className="text-[11px] text-[#555]">Content Strategist Agent</div>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Campaign Brief</label>
            <textarea value={brief} onChange={e => setBrief(e.target.value)}
              placeholder="Message, campaign, or announcement…"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none" />
          </div>

          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Platforms</label>
            <div className="grid grid-cols-2 gap-1.5">
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => toggle(p.id)}
                  className={cn('flex items-center gap-1.5 p-2 rounded-lg border text-xs transition-all',
                    selectedPlatforms.includes(p.id) ? 'border-[#C9A96E] bg-[#C9A96E]/10 text-[#F0EDE8]' : 'border-white/8 text-[#777] hover:border-white/15'
                  )}>
                  <span>{p.icon}</span>
                  <span className="font-medium truncate">{p.label}</span>
                  {selectedPlatforms.includes(p.id) && <Check className="w-3 h-3 ml-auto text-[#C9A96E] flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Tone</label>
            <div className="grid grid-cols-2 gap-1.5">
              {TONES.map(t => (
                <button key={t.id} onClick={() => setTone(t.id)}
                  className={cn('flex items-center gap-1.5 p-2 rounded-lg border text-[11px] transition-all',
                    tone === t.id ? 'border-[#C9A96E] bg-[#C9A96E]/10 text-[#F0EDE8]' : 'border-white/8 text-[#777] hover:border-white/15'
                  )}>
                  <span>{t.emoji}</span> {t.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generate} disabled={!brief.trim() || selectedPlatforms.length === 0 || generating}
            className="w-full bg-[#C9A96E] text-[#08080A] rounded-lg py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
            {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating…</> : <><Wand2 className="w-4 h-4" />Generate posts</>}
          </button>
        </div>
      </div>

      {/* Center: Results */}
      <div className="flex-1 overflow-y-auto p-5">
        {variants.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl border border-dashed border-white/10 flex items-center justify-center mx-auto mb-4">
                <Hash className="w-7 h-7 text-[#333]" />
              </div>
              <div className="text-sm font-light text-[#F0EDE8] mb-2">Posts will appear here</div>
              <p className="text-xs text-[#555] leading-relaxed">Select platforms, write your brief, pick a tone, and generate. Each gets an optimised variant.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl">
            {variants.map(v => {
              const p = PLATFORMS.find(pl => pl.id === v.platform)!;
              return (
                <div key={v.id} className="rounded-xl border border-white/8 overflow-hidden" style={{ background:'#0F0F12' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span>{p.icon}</span>
                      <span className="text-xs font-medium text-[#F0EDE8]">{p.label}</span>
                      <span className="text-[11px] text-[#555] bg-white/5 px-2 py-0.5 rounded">{v.format}</span>
                    </div>
                    {v.status === 'done' && (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#555]">{v.caption.length}/{p.maxCaption}</span>
                        <button onClick={() => copy(v.id)}
                          className="flex items-center gap-1 text-[11px] text-[#888] hover:text-[#F0EDE8] px-2 py-1 rounded border border-white/8 hover:border-white/20 transition-all">
                          {v.copied ? <><Check className="w-3 h-3 text-[#7abf8e]" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
                        </button>
                        <button className="flex items-center gap-1 text-[11px] text-[#C9A96E] px-2 py-1 rounded border border-[#C9A96E]/25 hover:border-[#C9A96E]/50 transition-all">
                          <Calendar className="w-3 h-3" /> Schedule
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 p-4">
                    <div className="w-20 h-20 rounded-lg border border-white/8 bg-[#0A0A0C] flex items-center justify-center flex-shrink-0">
                      <ImgIcon className="w-5 h-5 text-[#333]" />
                    </div>
                    <div className="flex-1">
                      {v.status === 'generating' ? (
                        <div className="flex items-center gap-2 text-xs text-[#555]">
                          <RefreshCw className="w-3 h-3 animate-spin text-[#C9A96E]" />Generating caption…
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-[#C0B8AC] leading-relaxed mb-2 whitespace-pre-line">{v.caption}</p>
                          <div className="flex flex-wrap gap-1">
                            {v.hashtags.map(h => (
                              <span key={h} className="text-[11px] text-[#C9A96E]/70 bg-[#C9A96E]/10 px-1.5 py-0.5 rounded">{h}</span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
              placeholder="Adjust tone, add CTA, request variations…"
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
                <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ color:tc, background:`${tc}18` }}>{model.tier}</span>
                <ChevronDown className={cn('w-3 h-3 text-[#555] transition-transform', modelOpen && 'rotate-180')} />
              </div>
            </button>
            {modelOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#0D0D10] border border-white/10 rounded-xl z-50 overflow-hidden shadow-2xl">
                {SOCIAL_MODELS.map(m => (
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
          <div className="mt-2 text-[11px] text-[#555]">{selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} selected</div>
        </div>
      </div>

    </div>
  );
}
