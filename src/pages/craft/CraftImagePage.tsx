import { useState } from 'react';
import { Image, Sparkles, Download, RefreshCw, ChevronDown, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:5' | '3:4';
type ModelTier = 'fast' | 'quality' | 'ultra';

interface ModelOption {
  id: string;
  name: string;
  provider: string;
  tier: ModelTier;
}

const MODELS: ModelOption[] = [
  { id: 'flux-1.1-pro',    name: 'FLUX 1.1 Pro',    provider: 'fal',       tier: 'ultra'   },
  { id: 'flux-schnell',    name: 'FLUX Schnell',     provider: 'fal',       tier: 'fast'    },
  { id: 'sdxl',            name: 'SDXL',             provider: 'stability', tier: 'quality' },
  { id: 'dalle-3',         name: 'DALL·E 3',         provider: 'openai',    tier: 'quality' },
];

const ASPECT_RATIOS: AspectRatio[] = ['1:1', '16:9', '9:16', '4:5', '3:4'];

const TIER_STYLES: Record<ModelTier, string> = {
  fast:    'text-blue-400 bg-blue-500/10',
  quality: 'text-green-400 bg-green-500/10',
  ultra:   'text-[#D8A34A] bg-[#D8A34A]/10',
};

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
  aspectRatio: AspectRatio;
}

// placeholder gradient cards when no real images exist yet
const placeholderGradients = [
  'from-blue-900 to-purple-900',
  'from-green-900 to-teal-900',
  'from-orange-900 to-red-900',
  'from-pink-900 to-rose-900',
];

export function CraftImagePage() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelOption>(MODELS[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [quantity, setQuantity] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      // TODO: Replace with real API call to /api/craft/image once backend is wired
      await new Promise((r) => setTimeout(r, 2000));

      // Placeholder: use gradient cards; real implementation returns image URLs
      const newImages: GeneratedImage[] = Array.from({ length: quantity }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        url: '',            // real URL comes from generation API
        prompt,
        model: selectedModel.name,
        aspectRatio,
      }));
      setGeneratedImages((prev) => [...newImages, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
            <Image className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">Craft · Image</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#F6F6F6] mb-2">Image Generation</h1>
          <p className="text-sm text-[#A7A7A7]">Generate photos, illustrations, and visual concepts from your brief.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Left: Prompt + Settings */}
          <div className="space-y-4">
            <Card className="bg-[#0F0F11] border-white/5">
              <CardContent className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#A7A7A7] mb-2">Prompt</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate…"
                    rows={4}
                    className="bg-white/5 border-white/10 text-[#F6F6F6] placeholder:text-[#666] focus:border-[#D8A34A]/50 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#A7A7A7] mb-2">Negative prompt <span className="text-[#666] font-normal">(optional)</span></label>
                  <Textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="What to exclude from the image…"
                    rows={2}
                    className="bg-white/5 border-white/10 text-[#F6F6F6] placeholder:text-[#666] focus:border-[#D8A34A]/50 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Settings row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Model */}
              <Card className="bg-[#0F0F11] border-white/5 col-span-2 sm:col-span-1">
                <CardContent className="p-4">
                  <label className="block text-xs font-medium text-[#A7A7A7] mb-2">Model</label>
                  <div className="relative">
                    <select
                      value={selectedModel.id}
                      onChange={(e) => setSelectedModel(MODELS.find((m) => m.id === e.target.value) ?? MODELS[0])}
                      className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F6F6F6] focus:outline-none focus:border-[#D8A34A]/50 pr-8"
                    >
                      {MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666] pointer-events-none" />
                  </div>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-medium ${TIER_STYLES[selectedModel.tier]}`}>
                    {selectedModel.tier}
                  </span>
                </CardContent>
              </Card>

              {/* Aspect Ratio */}
              <Card className="bg-[#0F0F11] border-white/5">
                <CardContent className="p-4">
                  <label className="block text-xs font-medium text-[#A7A7A7] mb-2">Aspect ratio</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ASPECT_RATIOS.map((r) => (
                      <button key={r} onClick={() => setAspectRatio(r)}
                        className={`px-2 py-1 rounded text-xs transition-colors ${
                          aspectRatio === r ? 'bg-[#D8A34A] text-[#0B0B0D] font-medium' : 'bg-white/5 text-[#A7A7A7] hover:bg-white/10'
                        }`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quantity */}
              <Card className="bg-[#0F0F11] border-white/5">
                <CardContent className="p-4">
                  <label className="block text-xs font-medium text-[#A7A7A7] mb-2">Quantity</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 4].map((n) => (
                      <button key={n} onClick={() => setQuantity(n)}
                        className={`w-9 h-9 rounded-lg text-sm transition-colors ${
                          quantity === n ? 'bg-[#D8A34A] text-[#0B0B0D] font-medium' : 'bg-white/5 text-[#A7A7A7] hover:bg-white/10'
                        }`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {error && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                <span>⚠</span>{error}
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D] font-medium h-12"
            >
              {isGenerating ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating…</>
              ) : (
                <><Wand2 className="w-4 h-4 mr-2" />Generate {quantity > 1 ? `${quantity} images` : 'image'}</>
              )}
            </Button>
          </div>

          {/* Right: Generated images */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-[#A7A7A7]">Generated</h2>
            {generatedImages.length === 0 ? (
              <Card className="bg-[#0F0F11] border-white/5 border-dashed">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <Sparkles className="w-8 h-8 text-[#444] mb-3" />
                  <p className="text-sm text-[#666]">Your generated images will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {generatedImages.map((img, idx) => (
                  <Card key={img.id} className="bg-[#0F0F11] border-white/5 overflow-hidden">
                    {img.url ? (
                      <img src={img.url} alt={img.prompt} className="w-full object-cover" />
                    ) : (
                      <div className={`aspect-square bg-gradient-to-br ${placeholderGradients[idx % placeholderGradients.length]} flex items-center justify-center`}>
                        <div className="text-center">
                          <Image className="w-8 h-8 text-white/20 mx-auto mb-2" />
                          <p className="text-xs text-white/30">Preview</p>
                        </div>
                      </div>
                    )}
                    <div className="p-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-xs text-[#A7A7A7] truncate">{img.prompt}</p>
                        <p className="text-[10px] text-[#666] mt-0.5">{img.model} · {img.aspectRatio}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="flex-shrink-0 text-[#666] hover:text-[#F6F6F6]">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
