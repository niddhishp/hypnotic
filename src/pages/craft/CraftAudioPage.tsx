import { useState } from 'react';
import { Wand2, RefreshCw, Send, Sparkles, ChevronDown, Play, Pause, Download, Check, Music, Mic, Volume2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AUDIO_MODELS, getTierColor, type CraftModel } from '@/lib/craft/models';

type AudioType = 'music' | 'voiceover' | 'sfx';

const MUSIC_GENRES = ['Cinematic','Electronic','Ambient','Hip-Hop','Jazz','Classical','Rock','Folk','Lo-Fi','Orchestral'];
const MOODS        = ['Dramatic','Uplifting','Melancholic','Tense','Joyful','Mysterious','Epic','Calm','Urgent','Playful'];
const TEMPOS       = ['Slow','Medium','Fast'] as const;
const VOICES       = ['Nova (Warm)','Alloy (Neutral)','Echo (Deep)','Fable (Expressive)','Onyx (Authoritative)','Shimmer (Bright)'];

interface AudioResult { id: string; title: string; duration: number; status: 'generating' | 'done'; type: AudioType; playing?: boolean; }
interface AgentMsg  { role: 'agent' | 'user'; text: string; }

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-0.5 h-8">
      {Array.from({ length: 32 }).map((_, i) => {
        const h = active ? 8 + Math.sin(i * 0.8 + Date.now() / 500) * 12 + Math.random() * 8 : 6 + Math.sin(i * 0.6) * 4;
        return <div key={i} className={cn('w-0.5 rounded-full transition-none', active ? 'bg-[#C9A96E]' : 'bg-[#333]')} style={{ height: Math.max(2, h) }} />;
      })}
    </div>
  );
}

export function CraftAudioPage() {
  const [audioType, setAudioType] = useState<AudioType>('music');
  const [genre, setGenre]         = useState('Cinematic');
  const [mood, setMood]           = useState('Dramatic');
  const [tempo, setTempo]         = useState<'Slow'|'Medium'|'Fast'>('Medium');
  const [duration, setDuration]   = useState(30);
  const [instrumental, setInstrumental] = useState(false);
  const [musicPrompt, setMusicPrompt]   = useState('');
  const [voiceScript, setVoiceScript]   = useState('');
  const [voice, setVoice]               = useState(VOICES[0]);
  const [sfxPrompt, setSfxPrompt]       = useState('');
  const [model, setModel]               = useState<CraftModel>(AUDIO_MODELS.find(m => m.id === 'auto-audio') ?? AUDIO_MODELS[0]);
  const [results, setResults]           = useState<AudioResult[]>([]);
  const [generating, setGenerating]     = useState(false);
  const [modelOpen, setModelOpen]       = useState(false);
  const [chatInput, setChatInput]       = useState('');
  const [msgs, setMsgs]                 = useState<AgentMsg[]>([
    { role: 'agent', text: 'Ready to compose. For your campaign\'s emotional arc, I recommend a Cinematic Dramatic build.\n\nFor voiceover, ElevenLabs v3 gives the most natural delivery. For music beds, Suno v4 handles long-form compositions best.' },
  ]);

  const generate = () => {
    setGenerating(true);
    const newResult: AudioResult = {
      id: `a-${Date.now()}`, type: audioType, status: 'generating', playing: false,
      title: audioType === 'music' ? `${genre} · ${mood}` : audioType === 'voiceover' ? 'Voiceover' : 'SFX',
      duration,
    };
    setResults(p => [newResult, ...p]);
    setTimeout(() => {
      setResults(p => p.map(r => r.id === newResult.id ? { ...r, status: 'done' } : r));
      setGenerating(false);
    }, 2500);
  };

  const toggle = (id: string) => setResults(p => p.map(r => r.id === id ? { ...r, playing: !r.playing } : r));

  const send = () => {
    if (!chatInput.trim()) return;
    setMsgs(p => [...p, { role: 'user', text: chatInput }]);
    setChatInput('');
  };

  const tc = getTierColor(model.tier);

  const ConfigPanel = () => (
    <div className="p-5 space-y-4">
      {/* Type selector */}
      <div>
        <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Output Type</label>
        <div className="flex gap-1.5">
          {(['music','voiceover','sfx'] as AudioType[]).map(t => (
            <button key={t} onClick={() => setAudioType(t)}
              className={cn('flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all capitalize',
                audioType === t ? 'bg-[#C9A96E] text-[#08080A] font-medium' : 'bg-white/5 text-[#777] hover:bg-white/8'
              )}>
              {t === 'music' ? <Music className="w-3 h-3" /> : t === 'voiceover' ? <Mic className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              {t}
            </button>
          ))}
        </div>
      </div>

      {audioType === 'music' && (
        <>
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Prompt</label>
            <textarea value={musicPrompt} onChange={e => setMusicPrompt(e.target.value)}
              placeholder="Describe the musical direction, references, instrumentation…"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none" />
          </div>

          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Genre</label>
            <div className="flex flex-wrap gap-1.5">
              {MUSIC_GENRES.map(g => (
                <button key={g} onClick={() => setGenre(g)}
                  className={cn('px-2.5 py-1 rounded-lg text-[11px] transition-all',
                    genre === g ? 'bg-[#C9A96E] text-[#08080A] font-medium' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{g}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Mood</label>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map(m => (
                <button key={m} onClick={() => setMood(m)}
                  className={cn('px-2.5 py-1 rounded-lg text-[11px] transition-all',
                    mood === m ? 'bg-[#C9A96E] text-[#08080A] font-medium' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{m}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Tempo</label>
            <div className="flex gap-1.5">
              {TEMPOS.map(t => (
                <button key={t} onClick={() => setTempo(t)}
                  className={cn('flex-1 py-1.5 rounded-lg text-xs transition-all',
                    tempo === t ? 'bg-[#C9A96E] text-[#08080A] font-medium' : 'bg-white/5 text-[#777] hover:bg-white/8'
                  )}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Duration — {duration}s</label>
            <input type="range" min={10} max={120} value={duration} onChange={e => setDuration(+e.target.value)}
              className="w-full accent-[#C9A96E]" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setInstrumental(!instrumental)}
              className={cn('w-8 h-4 rounded-full transition-colors relative cursor-pointer', instrumental ? 'bg-[#C9A96E]' : 'bg-[#333]')}>
              <div className={cn('absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all', instrumental ? 'left-4' : 'left-0.5')} />
            </div>
            <span className="text-xs text-[#888]">Instrumental only</span>
          </label>
        </>
      )}

      {audioType === 'voiceover' && (
        <>
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Script</label>
            <textarea value={voiceScript} onChange={e => setVoiceScript(e.target.value)}
              placeholder="Enter the text to be spoken…"
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none font-mono leading-relaxed" />
          </div>
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Voice</label>
            <div className="relative">
              <select value={voice} onChange={e => setVoice(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E]/40 appearance-none">
                {VOICES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#555] pointer-events-none" />
            </div>
          </div>
        </>
      )}

      {audioType === 'sfx' && (
        <div>
          <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Sound Description</label>
          <textarea value={sfxPrompt} onChange={e => setSfxPrompt(e.target.value)}
            placeholder="Describe the sound effect — e.g. 'ink drops falling on paper, slow and deliberate, with subtle echo'…"
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40 resize-none" />
        </div>
      )}

      <button onClick={generate} disabled={generating}
        className="w-full bg-[#C9A96E] text-[#08080A] rounded-lg py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
        {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Composing…</> : <><Wand2 className="w-4 h-4" />Generate</>}
      </button>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-64px)]" style={{ background:'#0A0A0C' }}>

      {/* Left: Config */}
      <div className="w-[300px] flex-shrink-0 border-r border-white/8 overflow-y-auto" style={{ background:'#0D0D10' }}>
        <div className="flex items-center gap-2 p-5 pb-0">
          <div className="w-7 h-7 rounded-lg bg-[#a07ae0]/15 flex items-center justify-center">
            <Music className="w-3.5 h-3.5 text-[#a07ae0]" />
          </div>
          <div>
            <div className="text-xs font-medium text-[#F0EDE8]">Audio Generation</div>
            <div className="text-[10px] text-[#555]">Sound Design Agent</div>
          </div>
        </div>
        <ConfigPanel />
      </div>

      {/* Center: Results */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {results.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl border border-dashed border-white/10 flex items-center justify-center mx-auto mb-4">
                <Music className="w-7 h-7 text-[#333]" />
              </div>
              <div className="text-sm font-light text-[#F0EDE8] mb-2">Ready to compose</div>
              <p className="text-xs text-[#555] leading-relaxed">Choose music, voiceover, or SFX on the left, configure it, and generate.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {results.map(r => (
              <div key={r.id} className="rounded-xl border border-white/8 p-4" style={{ background:'#0D0D10' }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium text-[#F0EDE8]">{r.title}</div>
                    <div className="text-xs text-[#555] mt-0.5 capitalize">{r.type} · {r.duration}s</div>
                  </div>
                  {r.status === 'done' && (
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-[11px] text-[#888] border border-white/10 rounded-lg px-2.5 py-1.5 hover:border-white/20 hover:text-[#F0EDE8] transition-all">
                        <Download className="w-3 h-3" /> Export
                      </button>
                      <button className="flex items-center gap-1 text-[11px] text-[#C9A96E] border border-[#C9A96E]/30 rounded-lg px-2.5 py-1.5 hover:border-[#C9A96E] transition-all">
                        <Check className="w-3 h-3" /> Approve
                      </button>
                    </div>
                  )}
                </div>

                {r.status === 'generating' ? (
                  <div className="flex items-center gap-3 py-3">
                    <RefreshCw className="w-4 h-4 text-[#C9A96E] animate-spin flex-shrink-0" />
                    <div className="flex-1">
                      <Waveform active={false} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggle(r.id)}
                      className="w-8 h-8 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/30 flex items-center justify-center hover:bg-[#C9A96E]/25 transition-colors flex-shrink-0">
                      {r.playing
                        ? <Pause className="w-3.5 h-3.5 text-[#C9A96E] fill-[#C9A96E]" />
                        : <Play className="w-3.5 h-3.5 text-[#C9A96E] fill-[#C9A96E]" />}
                    </button>
                    <div className="flex-1">
                      <Waveform active={!!r.playing} />
                    </div>
                    <span className="text-[11px] text-[#555] font-mono flex-shrink-0">
                      {String(Math.floor(r.duration / 60)).padStart(2,'0')}:{String(r.duration % 60).padStart(2,'0')}
                    </span>
                  </div>
                )}
              </div>
            ))}
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
              placeholder="Adjust style, request variations…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#444] focus:outline-none focus:border-[#C9A96E]/40" />
            <button onClick={send} className="p-2 bg-[#C9A96E] text-[#08080A] rounded-xl hover:opacity-90 flex-shrink-0"><Send className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        {/* Model bar */}
        <div className="border-t border-white/8 p-3" style={{ background:'#0A0A0C' }}>
          <div className="relative">
            <button onClick={() => setModelOpen(!modelOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors text-xs" style={{ background:'#0D0D10' }}>
              <span className="text-[#F0EDE8] font-medium">{model.name}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ color:tc, background:`${tc}18` }}>{model.tier}</span>
                <ChevronDown className={cn('w-3 h-3 text-[#555] transition-transform', modelOpen && 'rotate-180')} />
              </div>
            </button>
            {modelOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#0D0D10] border border-white/10 rounded-xl z-50 overflow-hidden shadow-2xl">
                {AUDIO_MODELS.map(m => (
                  <button key={m.id} onClick={() => { setModel(m); setModelOpen(false); }}
                    className={cn('w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors', model.id === m.id && 'bg-[#C9A96E]/8')}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#F0EDE8]">{m.name}</span>
                      {m.recommended && <span className="text-[9px] text-[#C9A96E]">★ Recommended</span>}
                    </div>
                    <div className="text-[10px] text-[#555] mt-0.5">{m.description.slice(0,60)}…</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mt-2 text-[10px] text-[#555]">~{model.creditsPerUnit} credits / generation</div>
        </div>
      </div>
    </div>
  );
}
