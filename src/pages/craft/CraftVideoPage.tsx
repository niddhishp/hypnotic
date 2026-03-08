import { useState } from 'react';
import { Video, Wand2, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

type VideoModel = { id: string; name: string; provider: string; maxDuration: number };
type MotionIntensity = 'subtle' | 'medium' | 'high';
type AspectRatio = '16:9' | '9:16' | '1:1';

const VIDEO_MODELS: VideoModel[] = [
  { id: 'runway-gen3', name: 'Runway Gen-3 Alpha', provider: 'runway',  maxDuration: 10 },
  { id: 'kling-1.5',   name: 'Kling 1.5',          provider: 'kling',   maxDuration: 10 },
  { id: 'luma-dream',  name: 'Luma Dream Machine',  provider: 'luma',   maxDuration: 5  },
];

const MOTION_LABELS: Record<MotionIntensity, string> = {
  subtle: 'Subtle',
  medium: 'Medium',
  high:   'High',
};

export function CraftVideoPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(VIDEO_MODELS[0]);
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [motionIntensity, setMotionIntensity] = useState<MotionIntensity>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      // TODO: Wire to /api/craft/video endpoint
      await new Promise((r) => setTimeout(r, 3000));
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
            <Video className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">Craft · Video</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#F6F6F6] mb-2">Video Generation</h1>
          <p className="text-sm text-[#A7A7A7]">Create motion content from text prompts or reference images.</p>
        </div>

        <div className="flex items-start gap-3 p-4 bg-[#D8A34A]/5 border border-[#D8A34A]/20 rounded-xl">
          <Info className="w-4 h-4 text-[#D8A34A] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-[#A7A7A7]">
            Video generation requires production API keys configured in your environment.
            Connect <span className="text-[#D8A34A]">Runway</span>, <span className="text-[#D8A34A]">Kling</span>, or <span className="text-[#D8A34A]">Luma</span> in Settings → Integrations.
          </p>
        </div>

        <Card className="bg-[#0F0F11] border-white/5">
          <CardContent className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#A7A7A7] mb-2">Scene description</label>
              <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video scene in detail — action, camera movement, mood…"
                rows={4} className="bg-white/5 border-white/10 text-[#F6F6F6] placeholder:text-[#666] focus:border-[#D8A34A]/50 resize-none" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#A7A7A7] mb-2">Model</label>
                <select value={selectedModel.id}
                  onChange={(e) => setSelectedModel(VIDEO_MODELS.find((m) => m.id === e.target.value) ?? VIDEO_MODELS[0])}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F6F6F6] focus:outline-none focus:border-[#D8A34A]/50">
                  {VIDEO_MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A7A7A7] mb-2">Duration (s)</label>
                <input type="range" min={1} max={selectedModel.maxDuration} value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-[#D8A34A]" />
                <span className="text-xs text-[#A7A7A7]">{duration}s</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A7A7A7] mb-2">Aspect ratio</label>
                <div className="flex gap-1.5">
                  {(['16:9', '9:16', '1:1'] as AspectRatio[]).map((r) => (
                    <button key={r} onClick={() => setAspectRatio(r)}
                      className={`flex-1 py-1.5 rounded text-xs transition-colors ${aspectRatio === r ? 'bg-[#D8A34A] text-[#0B0B0D] font-medium' : 'bg-white/5 text-[#A7A7A7] hover:bg-white/10'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#A7A7A7] mb-2">Motion</label>
                <div className="flex gap-1.5">
                  {(['subtle', 'medium', 'high'] as MotionIntensity[]).map((m) => (
                    <button key={m} onClick={() => setMotionIntensity(m)}
                      className={`flex-1 py-1.5 rounded text-xs transition-colors ${motionIntensity === m ? 'bg-[#D8A34A] text-[#0B0B0D] font-medium' : 'bg-white/5 text-[#A7A7A7] hover:bg-white/10'}`}>
                      {MOTION_LABELS[m]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                <span>⚠</span>{error}
              </div>
            )}

            <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating}
              className="w-full bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D] font-medium h-12">
              {isGenerating ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating…</> : <><Wand2 className="w-4 h-4 mr-2" />Generate video</>}
            </Button>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}
