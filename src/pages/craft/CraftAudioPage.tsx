import { useState } from 'react';
import { Music, Mic, Wand2, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export function CraftAudioPage() {
  const [musicPrompt, setMusicPrompt] = useState('');
  const [voiceScript, setVoiceScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // TODO: Wire to /api/craft/audio endpoint
      await new Promise((r) => setTimeout(r, 2500));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
            <Music className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">Craft · Audio</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#F6F6F6] mb-2">Audio Generation</h1>
          <p className="text-sm text-[#A7A7A7]">Generate music, voiceovers, and sound design for your productions.</p>
        </div>

        <div className="flex items-start gap-3 p-4 bg-[#D8A34A]/5 border border-[#D8A34A]/20 rounded-xl">
          <Info className="w-4 h-4 text-[#D8A34A] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-[#A7A7A7]">
            Requires <span className="text-[#D8A34A]">ElevenLabs</span> (voiceover) and <span className="text-[#D8A34A]">Suno</span> or <span className="text-[#D8A34A]">Udio</span> (music) API keys.
            Configure in Settings → Integrations.
          </p>
        </div>

        <Tabs defaultValue="music">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="music" className="data-[state=active]:bg-[#D8A34A] data-[state=active]:text-[#0B0B0D]">
              <Music className="w-4 h-4 mr-2" />Music
            </TabsTrigger>
            <TabsTrigger value="voiceover" className="data-[state=active]:bg-[#D8A34A] data-[state=active]:text-[#0B0B0D]">
              <Mic className="w-4 h-4 mr-2" />Voiceover
            </TabsTrigger>
          </TabsList>

          <TabsContent value="music" className="mt-4">
            <Card className="bg-[#0F0F11] border-white/5">
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#A7A7A7] mb-2">Music description</label>
                  <Textarea value={musicPrompt} onChange={(e) => setMusicPrompt(e.target.value)}
                    placeholder="e.g. Cinematic orchestral build, hopeful and triumphant, 90bpm, no lyrics"
                    rows={3} className="bg-white/5 border-white/10 text-[#F6F6F6] placeholder:text-[#666] focus:border-[#D8A34A]/50 resize-none" />
                </div>
                {error && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                    <span>⚠</span>{error}
                  </div>
                )}
                <Button onClick={handleGenerate} disabled={!musicPrompt.trim() || isGenerating}
                  className="w-full bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D] font-medium h-11">
                  {isGenerating ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating…</> : <><Wand2 className="w-4 h-4 mr-2" />Generate music</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voiceover" className="mt-4">
            <Card className="bg-[#0F0F11] border-white/5">
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#A7A7A7] mb-2">Script</label>
                  <Textarea value={voiceScript} onChange={(e) => setVoiceScript(e.target.value)}
                    placeholder="Enter the script for your voiceover…"
                    rows={5} className="bg-white/5 border-white/10 text-[#F6F6F6] placeholder:text-[#666] focus:border-[#D8A34A]/50 resize-none font-mono text-sm" />
                </div>
                {error && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                    <span>⚠</span>{error}
                  </div>
                )}
                <Button onClick={handleGenerate} disabled={!voiceScript.trim() || isGenerating}
                  className="w-full bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D] font-medium h-11">
                  {isGenerating ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating…</> : <><Mic className="w-4 h-4 mr-2" />Generate voiceover</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
}
