import { useState, useRef } from 'react';
import { 
  Image, 
  Video, 
  Music, 
  Sparkles, 
  Download, 
  CheckCircle,
  Clock,
  MoreVertical,
  Eye,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';
import { useCraftStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const generationTypes = [
  { id: 'image', name: 'Image', icon: Image, description: 'Generate photos, illustrations, concepts' },
  { id: 'video', name: 'Video', icon: Video, description: 'Create motion content and clips' },
  { id: 'audio', name: 'Audio', icon: Music, description: 'Music, voiceovers, sound effects' },
];

const mockModels = [
  { id: 'flux', name: 'FLUX 1.1 Pro', provider: 'fal', tier: 'ultra' },
  { id: 'sdxl', name: 'SDXL', provider: 'stability', tier: 'quality' },
  { id: 'dalle', name: 'DALL-E 3', provider: 'openai', tier: 'quality' },
];

const mockAssets = [
  {
    id: '1',
    projectId: '1',
    type: 'image' as const,
    url: '/images/hero_portrait.jpg',
    thumbnailUrl: '/images/hero_portrait.jpg',
    prompt: 'Athletic lifestyle photo, Nike Air Max sneakers, urban setting, golden hour lighting',
    model: 'FLUX 1.1 Pro',
    status: 'approved' as const,
    dimensions: { width: 1024, height: 1024 },
    createdAt: '2024-03-07T10:00:00Z',
  },
  {
    id: '2',
    projectId: '1',
    type: 'image' as const,
    url: '/images/insight_portrait.jpg',
    thumbnailUrl: '/images/insight_portrait.jpg',
    prompt: 'Close-up product shot, Air Max sole detail, dramatic lighting',
    model: 'SDXL',
    status: 'draft' as const,
    dimensions: { width: 1024, height: 1024 },
    createdAt: '2024-03-06T15:00:00Z',
  },
];

export function CraftPage() {
  const { assets, addAsset, selectedType, setSelectedType, isGenerating, setIsGenerating } = useCraftStore();
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('flux');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [viewingAsset, setViewingAsset] = useState<typeof mockAssets[0] | null>(null);

  const displayAssets = assets.length > 0 ? assets : mockAssets;
  const filteredAssets = displayAssets.filter(a => a.type === selectedType);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          const newAsset = {
            id: Date.now().toString(),
            projectId: '1',
            type: selectedType,
            url: `/images/${selectedType === 'image' ? 'craft_portrait' : selectedType === 'video' ? 'manifest_portrait' : 'amplify_portrait'}.jpg`,
            thumbnailUrl: `/images/${selectedType === 'image' ? 'craft_portrait' : selectedType === 'video' ? 'manifest_portrait' : 'amplify_portrait'}.jpg`,
            prompt,
            model: mockModels.find(m => m.id === selectedModel)?.name || 'Unknown',
            status: 'draft' as const,
            dimensions: { width: 1024, height: 1024 },
            createdAt: new Date().toISOString(),
          };
          
          addAsset(newAsset);
          setPrompt('');
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const handleApprove = (assetId: string) => {
    // Update asset status
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 rounded-full mb-4">
          <Image className="w-4 h-4 text-purple-500" />
          <span className="text-xs font-medium text-purple-500 uppercase tracking-wider">Craft Module</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#F6F6F6] mb-2">
          Make it real
        </h1>
        <p className="text-[#A7A7A7] max-w-lg mx-auto">
          Generate images, video, and audio assets. Brand-safe, export-ready.
        </p>
      </div>

      {/* Type Selection */}
      <div className="flex justify-center gap-3">
        {generationTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id as 'image' | 'video' | 'audio')}
            className={cn(
              "flex items-center gap-3 px-6 py-4 border rounded-xl transition-all",
              selectedType === type.id
                ? "border-purple-500 bg-purple-500/10"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            )}
          >
            <type.icon className={cn(
              "w-5 h-5",
              selectedType === type.id ? "text-purple-500" : "text-[#A7A7A7]"
            )} />
            <div className="text-left">
              <div className={cn(
                "font-medium",
                selectedType === type.id ? "text-[#F6F6F6]" : "text-[#A7A7A7]"
              )}>{type.name}</div>
              <div className="text-xs text-[#666]">{type.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Generation Input */}
      <Card className="bg-[#0F0F11] border-white/5">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Model Selection */}
            <div>
              <label className="block text-sm text-[#A7A7A7] mb-2">Model</label>
              <div className="flex gap-2">
                {mockModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={cn(
                      "px-4 py-2 border rounded-lg text-sm transition-all",
                      selectedModel === model.id
                        ? "border-purple-500 bg-purple-500/10 text-purple-500"
                        : "border-white/10 bg-white/5 text-[#A7A7A7] hover:bg-white/10"
                    )}
                  >
                    {model.name}
                    {model.tier === 'ultra' && (
                      <span className="ml-2 px-1.5 py-0.5 bg-purple-500/20 text-purple-500 rounded text-[10px]">
                        PRO
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div>
              <label className="block text-sm text-[#A7A7A7] mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe the ${selectedType} you want to create...`}
                rows={3}
                disabled={isGenerating}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#F6F6F6] placeholder:text-[#666] focus:outline-none focus:border-purple-500/50 resize-none disabled:opacity-50"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                </>
              )}
            </Button>

            {/* Progress */}
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#A7A7A7]">Generating...</span>
                  <span className="text-purple-500">{generationProgress}%</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      {filteredAssets.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-[#F6F6F6] mb-4">
            Your {selectedType}s
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <Card 
                key={asset.id}
                className="bg-[#0F0F11] border-white/5 overflow-hidden group"
              >
                <div className="relative aspect-square">
                  <img 
                    src={asset.thumbnailUrl} 
                    alt={asset.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      onClick={() => setViewingAsset(asset as any)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute top-2 right-2">
                    {asset.status === 'approved' ? (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Approved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 bg-white/20 text-white rounded text-xs">
                        <Clock className="w-3 h-3" />
                        Draft
                      </span>
                    )}
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-[#A7A7A7] line-clamp-2 mb-2">{asset.prompt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#666]">{asset.model}</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleApprove(asset.id)}
                        className="p-1 hover:bg-green-500/20 rounded text-[#666] hover:text-green-500"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button className="p-1 hover:bg-red-500/20 rounded text-[#666] hover:text-red-500">
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Asset Viewer Dialog */}
      <Dialog open={!!viewingAsset} onOpenChange={() => setViewingAsset(null)}>
        <DialogContent className="max-w-4xl bg-[#0F0F11] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-[#F6F6F6]">Generated Asset</DialogTitle>
          </DialogHeader>
          {viewingAsset && (
            <div className="space-y-4">
              <img 
                src={viewingAsset.url} 
                alt={viewingAsset.prompt}
                className="w-full rounded-lg"
              />
              <div>
                <label className="text-sm text-[#666]">Prompt</label>
                <p className="text-[#F6F6F6]">{viewingAsset.prompt}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="text-sm text-[#666]">Model</label>
                  <p className="text-[#F6F6F6]">{viewingAsset.model}</p>
                </div>
                <div>
                  <label className="text-sm text-[#666]">Created</label>
                  <p className="text-[#F6F6F6]">{formatDate(viewingAsset.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-purple-500 hover:bg-purple-600">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-white/10 text-[#F6F6F6] hover:bg-white/5"
                  onClick={() => setViewingAsset(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
