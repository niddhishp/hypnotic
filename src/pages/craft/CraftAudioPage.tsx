import { useState } from 'react';
import { Wand2, RefreshCw, Send, Sparkles, ChevronDown, Play, Pause, Download, Check, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AUDIO_MODELS, getTierColor, type CraftModel } from '@/lib/craft/models';

const MUSIC_GENRES = ['Cinematic', 'Electronic', 'Ambient', 'Hip-Hop', 'Jazz', 'Classical', 'Rock', 'Folk'];
const MOODS        = ['Dramatic', 'Uplifting', 'Melancholic', 'Tense', 'Joyful', 'Mysterious', 'Epic', 'Calm'];

interface AudioResult { id: string; title: string; duration: number; status: 'generating' | 'done'; type: 'music' | 'voiceover' | 'sfx'; playing?: boolean; }

function AudioWaveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-0.5 h-6">
      {Array.from({ length: 28 }).map((_, i) => {
        const h = active ? Math.random() * 18 + 4 : 6 + Math.sin(i * 0.7) * 4;
        return (
          <div key={i} className={cn('w-0.5 rounded-full transition-all', active ? 'bg-[#C9A96E]' : 'bg-[#333]')}
            style={{ height: h }} />
        );
      })}
    </div>
  );
}

export function CraftAudioPage() {
  const [activeTab, setActiveTab]    = useState<'music' | 'voiceover' | 'sfx'>('music');
  const [prompt, setPrompt]          = useState('');
  const [genre, setGenre]            = useState('Cinematic');
  const [mood, setMood]              = useState('Dramatic');
  const [duration, setDuration]      = useState(30);
  const [instrumental, setInstrumental] = useState(true);
  const [voiceScript, setVoiceScript]  = useState('');
  const [model, setModel]            = useState<CraftModel>(AUDIO_MODELS[0]);
  const [results, setResults]        = useState<AudioResult[]>([]);
  const [generating, setGenerating]  = useState(false);
  const [modelOpen, setModelOpen]    = useState(false);
  const [chatInput, setChatInput]    = useState('');
  const [playingId, setPlayingId]    = useState<string | null>(null);
  const [chatMsgs, setChatMsgs]      = useState([
    { role: 'agent', text: activeTab === 'music'
      ? 'Ready to compose. Describe the sonic world you need — mood, energy, instrumentation.\n\nFor campaign work, Suno v4 gives the best melodic quality. ElevenLabs is best for voiceovers with natural emotion.'
      : 'Ready for voiceover generation. Paste your script and select a voice style.' }
  ]);

  const generate = () => {
    setGenerating(true);
    const r: AudioResult = { id: `a-${Date.now()}`, title: activeTab === 'music' ? `${genre} · ${mood}` : 'Voiceover', duration, status: 'generating', type: activeTab };
    setResults(prev => [r, ...prev]);
    setTimeout(() => {
      setResults(prev => prev.map(a => a.id === r.id ? { ...a, status: 'done' } : a));
      setGenerating(false);
    }, 2500);
  };

  const tc = getTierColor(model.tier);

  return (
    <div className="flex h-[calc(100vh-80px)]" style={{ background: '#0A0A0C' }}>
      {/* Left panel */}
      <div className="w-[300px] flex flex-col border-r border-white/8" style={{ background: '#0D0D10' }}>
        <div className="p-4 border-b border-white/8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#9b7ae0]/15 flex items-center justify-center">
              <Music className="w-3.5 h-3.5 text-[#9b7ae0]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#F0EDE8]">Audio Generation</div>
              <div className="text-[11px] text-[#555]">Music Composer Agent</div>
            </div>
          </div>

          {/* Type tabs */}
          <div className="flex gap-1 mb-4">
            {(['music','voiceover','sfx'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={cn('flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all capitalize',
                  activeTab === t ? 'bg-[#C9A96E] text-[#08080A]' : 'bg-white/5 text-[#777] hover:bg-white/8'
                )}>{t === 'sfx' ? 'SFX' : t === 'voiceover' ? 'Voiceover' : 'Music'}</button>
            ))}
          </div>

          {activeTab === 'music' && (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Prompt</label>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3}
                  placeholder="Dark cinematic score with strings building to a climax, minimal percussion…"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none" />
              </div>
              <div>
                <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Genre</label>
                <div className="flex flex-wrap gap-1">
                  {MUSIC_GENRES.map(g => (
                    <button key={g} onClick={() => setGenre(g)}
                      className={cn('px-2 py-1 rounded-lg text-[10px] transition-all',
                        genre === g ? 'bg-[#C9A96E] text-[#08080A]' : 'bg-white/5 text-[#777] hover:bg-white/8'
                      )}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Mood</label>
                <div className="flex flex-wrap gap-1">
                  {MOODS.map(m => (
                    <button key={m} onClick={() => setMood(m)}
                      className={cn('px-2 py-1 rounded-lg text-[10px] transition-all',
                        mood === m ? 'bg-[#C9A96E] text-[#08080A]' : 'bg-white/5 text-[#777] hover:bg-white/8'
                      )}>{m}</button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1">Duration — {duration}s</label>
                  <input type="range" min={5} max={180} value={duration} onChange={e => setDuration(+e.target.value)}
                    className="w-32 accent-[#C9A96E]" />
                </div>
                <button onClick={() => setInstrumental(!instrumental)}
                  className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] transition-all',
                    instrumental ? 'border-[#C9A96E]/40 bg-[#C9A96E]/10 text-[#C9A96E]' : 'border-white/10 bg-white/3 text-[#666]'
                  )}>
                  {instrumental && <Check className="w-3 h-3" />} Instrumental
                </button>
              </div>
            </div>
          )}

          {activeTab === 'voiceover' && (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Script</label>
                <textarea value={voiceScript} onChange={e => setVoiceScript(e.target.value)} rows={5}
                  placeholder="Every public figure walks a path. Some paths are chosen. Others are written…"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Calm/Narrator','Emotional','Authoritative','Soft & Intimate'].map(v => (
                  <button key={v} className="px-2 py-2 rounded-lg border border-white/8 bg-white/3 text-[10px] text-[#777] hover:border-white/15 hover:text-[#F0EDE8] transition-all text-left">{v}</button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sfx' && (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-[#666] uppercase tracking-wider block mb-1.5">Describe the sound</label>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3}
                  placeholder="Ink drops falling on paper, soft and deliberate, with a subtle echo…"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none" />
              </div>
              <div className="flex flex-wrap gap-1">
                {['Ambience','Impact','Transition','Foley','UI Sound','Nature'].map(c => (
                  <button key={c} className="px-2 py-1 rounded-lg text-[10px] bg-white/5 text-[#777] hover:bg-white/8 transition-colors">{c}</button>
                ))}
              </div>
            </div>
          )}

          {/* Model */}
          <div className="mt-3">
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
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#0D0D10] border border-white/10 rounded-xl shadow-2xl z-50">
                  {AUDIO_MODELS.map(m => (
                    <button key={m.id} onClick={() => { setModel(m); setModelOpen(false); }}
                      className={cn('w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors',
                        model.id === m.id && 'bg-[#C9A96E]/10'
                      )}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] font-medium text-[#F0EDE8]">{m.name}</span>
                        {m.recommended && <span className="text-[9px] text-[#C9A96E]">★ Rec</span>}
                      </div>
                      <div className="text-[10px] text-[#555]">{m.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button onClick={generate} disabled={generating || (!prompt.trim() && !voiceScript.trim())}
            className="w-full mt-3 bg-[#C9A96E] text-[#08080A] rounded-lg py-3 text-sm font-medium hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2">
            {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating…</> : <><Wand2 className="w-4 h-4" />Generate Audio</>}
          </button>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
          <div className="p-3 flex gap-2 border-t border-white/8">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && chatInput.trim()) { setChatMsgs(p => [...p, { role: 'user', text: chatInput }]); setChatInput(''); } }}
              placeholder="Adjust style, request variations…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40" />
            <button onClick={() => { if (chatInput.trim()) { setChatMsgs(p => [...p, { role: 'user', text: chatInput }]); setChatInput(''); } }}
              className="w-8 h-8 flex items-center justify-center bg-[#C9A96E] text-[#08080A] rounded-xl hover:opacity-90">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right: results */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {results.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl border border-dashed border-white/10 flex items-center justify-center mx-auto mb-4">
                <Music className="w-7 h-7 text-[#333]" />
              </div>
              <div className="text-sm text-[#F0EDE8] font-light mb-2">Audio will appear here</div>
              <p className="text-xs text-[#555] leading-relaxed">Configure your generation settings and click Generate Audio.</p>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            <div className="text-xs text-[#555] mb-1">{results.length} track{results.length > 1 ? 's' : ''} · {model.name}</div>
            {results.map(r => (
              <div key={r.id} className="rounded-xl border border-white/8 p-4 flex items-center gap-4" style={{ background: '#0F0F12' }}>
                <button onClick={() => setPlayingId(playingId === r.id ? null : r.id)}
                  disabled={r.status === 'generating'}
                  className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
                    playingId === r.id ? 'bg-[#C9A96E] text-[#08080A]' : 'bg-white/8 text-[#999] hover:bg-white/12'
                  )}>
                  {r.status === 'generating' ? <RefreshCw className="w-4 h-4 animate-spin" /> :
                   playingId === r.id ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-[#F0EDE8]">{r.title}</span>
                    <span className="text-[10px] text-[#555]">{r.duration}s</span>
                  </div>
                  <AudioWaveform active={playingId === r.id} />
                </div>
                {r.status === 'done' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="p-2 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                      <Download className="w-3.5 h-3.5 text-[#888]" />
                    </button>
                    <button className="flex items-center gap-1 text-[10px] text-[#C9A96E] border border-[#C9A96E]/25 rounded-lg px-3 py-1.5 hover:border-[#C9A96E]/50 transition-colors">
                      <Check className="w-3 h-3" /> Approve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
