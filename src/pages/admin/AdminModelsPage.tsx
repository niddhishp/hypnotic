import { useState } from 'react';
import { 
  Cpu, 
  Plus, 
  Search, 
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Power,
  RefreshCw,
  Image,
  Video,
  Music,
  Mic
} from 'lucide-react';
import { useAdminStore } from '@/store';
import type { GenerationModel } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock models data
const mockModels = [
  { id: 'flux-1-1-pro', name: 'FLUX 1.1 Pro', provider: 'fal', type: 'image', tier: 'ultra', isActive: true, lastVerified: '2 hours ago', costPerImage: 0.035 },
  { id: 'sdxl', name: 'SDXL', provider: 'stability', type: 'image', tier: 'quality', isActive: true, lastVerified: '1 day ago', costPerImage: 0.018 },
  { id: 'dalle-3', name: 'DALL-E 3', provider: 'openai', type: 'image', tier: 'quality', isActive: true, lastVerified: '3 hours ago', costPerImage: 0.040 },
  { id: 'runway-gen3', name: 'Runway Gen-3', provider: 'runway', type: 'video', tier: 'ultra', isActive: true, lastVerified: '5 hours ago', costPerSecond: 0.15 },
  { id: 'kling-1-5', name: 'Kling 1.5', provider: 'kling', type: 'video', tier: 'quality', isActive: false, lastVerified: '1 week ago', costPerSecond: 0.08 },
  { id: 'elevenlabs-v2', name: 'ElevenLabs v2', provider: 'elevenlabs', type: 'voice', tier: 'quality', isActive: true, lastVerified: '12 hours ago', costPerChar: 0.0001 },
  { id: 'suno-v3', name: 'Suno v3', provider: 'suno', type: 'audio', tier: 'quality', isActive: true, lastVerified: '1 day ago', costPerSong: 0.50 },
  { id: 'luma-dream-machine', name: 'Luma Dream Machine', provider: 'luma', type: 'video', tier: 'fast', isActive: true, lastVerified: '30 minutes ago', costPerSecond: 0.05 },
];

const typeIcons: Record<string, typeof Image> = {
  image: Image,
  video: Video,
  audio: Music,
  voice: Mic,
};

const typeColors: Record<string, string> = {
  image: 'bg-purple-500/10 text-purple-500',
  video: 'bg-red-500/10 text-red-500',
  audio: 'bg-blue-500/10 text-blue-500',
  voice: 'bg-green-500/10 text-green-500',
};

const tierColors: Record<string, string> = {
  fast: 'bg-gray-500/10 text-gray-500',
  quality: 'bg-blue-500/10 text-blue-500',
  ultra: 'bg-[#D8A34A]/10 text-[#D8A34A]',
};

export default function AdminModelsPage() {
  const { models, setModels } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<GenerationModel | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const displayModels = models.length > 0 ? models : mockModels;

  const filteredModels = displayModels.filter((model) =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleActive = (modelId: string) => {
    // In real app, call API to toggle model status
    console.log('Toggle model:', modelId);
  };

  const handleRefreshModel = (modelId: string) => {
    // In real app, call API to refresh/verify model
    console.log('Refresh model:', modelId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#F6F6F6]">AI Models</h2>
          <p className="text-sm text-[#666]">Manage AI generation models and providers</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Model
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Models', value: displayModels.length, color: 'blue' },
          { label: 'Active', value: displayModels.filter(m => m.isActive).length, color: 'green' },
          { label: 'Image', value: displayModels.filter(m => m.type === 'image').length, color: 'purple' },
          { label: 'Video', value: displayModels.filter(m => m.type === 'video').length, color: 'red' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-[#0F0F11] border-white/5">
            <CardContent className="p-4">
              <p className="text-sm text-[#666] mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold text-[#F6F6F6]">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="bg-[#0F0F11] border-white/5">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
            <Input
              type="text"
              placeholder="Search models by name or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-[#F6F6F6] placeholder:text-[#666]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => {
          const TypeIcon = typeIcons[model.type];
          return (
            <Card key={model.id} className="bg-[#0F0F11] border-white/5">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", typeColors[model.type])}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#F6F6F6]">{model.name}</h3>
                      <p className="text-xs text-[#666]">{model.provider}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-[#666] hover:text-[#F6F6F6]">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0F0F11] border-white/10">
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedModel(model as GenerationModel);
                          setIsEditDialogOpen(true);
                        }}
                        className="text-[#A7A7A7] focus:text-[#F6F6F6] focus:bg-white/5"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleRefreshModel(model.id)}
                        className="text-[#A7A7A7] focus:text-[#F6F6F6] focus:bg-white/5"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Verify
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem 
                        onClick={() => handleToggleActive(model.id)}
                        className={model.isActive ? "text-red-500" : "text-green-500"}
                      >
                        <Power className="w-4 h-4 mr-2" />
                        {model.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className={cn("capitalize", typeColors[model.type])}>
                    {model.type}
                  </Badge>
                  <Badge variant="outline" className={cn("capitalize", tierColors[model.tier])}>
                    {model.tier}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={model.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}
                  >
                    {model.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#666]">Cost:</span>
                    <span className="text-[#F6F6F6]">
                      {model.costPerImage && `$${model.costPerImage}/image`}
                      {model.costPerSecond && `$${model.costPerSecond}/sec`}
                      {model.costPerChar && `$${model.costPerChar}/char`}
                      {model.costPerSong && `$${model.costPerSong}/song`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">Last Verified:</span>
                    <span className="text-[#A7A7A7]">{model.lastVerified}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Model Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-[#0F0F11] border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F6F6F6]">Add New Model</DialogTitle>
            <DialogDescription className="text-[#666]">
              Add a new AI generation model to the registry
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm text-[#A7A7A7] mb-2">Model Name</label>
              <Input 
                placeholder="e.g., FLUX 1.1 Pro"
                className="bg-white/5 border-white/10 text-[#F6F6F6]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#A7A7A7] mb-2">Provider</label>
              <Input 
                placeholder="e.g., fal"
                className="bg-white/5 border-white/10 text-[#F6F6F6]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#A7A7A7] mb-2">Type</label>
                <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-[#F6F6F6]">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="voice">Voice</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#A7A7A7] mb-2">Tier</label>
                <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-[#F6F6F6]">
                  <option value="fast">Fast</option>
                  <option value="quality">Quality</option>
                  <option value="ultra">Ultra</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#A7A7A7] mb-2">API Endpoint</label>
              <Input 
                placeholder="https://api.provider.com/v1/generate"
                className="bg-white/5 border-white/10 text-[#F6F6F6]"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
                className="flex-1 border-white/10 text-[#F6F6F6] hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setIsAddDialogOpen(false)}
                className="flex-1 bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]"
              >
                Add Model
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
