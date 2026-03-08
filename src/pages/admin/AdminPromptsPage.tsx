import { useState, useEffect } from 'react';
import { useAdminStore } from '@/store/admin.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Search,
  Plus,
  FileText,
  MessageSquare,
  Image,
  Video,
  Music,
  Edit2,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Brain,
  Wand2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { SystemPrompt } from '@/store/admin.store';

const promptTypeIcons = {
  system: Brain,
  chat: MessageSquare,
  image: Image,
  video: Video,
  audio: Music,
  expert: Sparkles,
  workflow: Wand2,
};

const promptTypeLabels = {
  system: 'System',
  chat: 'Chat',
  image: 'Image Gen',
  video: 'Video Gen',
  audio: 'Audio Gen',
  expert: 'Expert',
  workflow: 'Workflow',
};

export function AdminPromptsPage() {
  const { prompts, fetchPrompts, updatePrompt, deletePrompt } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [editingPrompt, setEditingPrompt] = useState<SystemPrompt | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || prompt.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCopyPrompt = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Prompt copied to clipboard');
  };

  const handleDeletePrompt = async (id: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      await deletePrompt(id);
    }
  };

  const activePrompts = prompts.filter((p) => p.isActive).length;
  const totalPrompts = prompts.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Prompts</h1>
          <p className="text-zinc-400">
            Manage AI prompts and instructions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4" />
              Add Prompt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-zinc-800 bg-zinc-950">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Prompt</DialogTitle>
            </DialogHeader>
            <AddPromptForm onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Total Prompts</p>
                <p className="text-2xl font-bold text-white">{totalPrompts}</p>
              </div>
              <div className="rounded-lg bg-zinc-800 p-3">
                <FileText className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Active Prompts</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {activePrompts}
                </p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <Check className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Expert Prompts</p>
                <p className="text-2xl font-bold text-purple-400">
                  {prompts.filter((p) => p.type === 'expert').length}
                </p>
              </div>
              <div className="rounded-lg bg-purple-500/10 p-3">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-zinc-800 bg-zinc-900 pl-10 text-white placeholder:text-zinc-500"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-40 border-zinc-800 bg-zinc-900 text-white">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="border-zinc-800 bg-zinc-900">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="chat">Chat</SelectItem>
            <SelectItem value="image">Image Gen</SelectItem>
            <SelectItem value="video">Video Gen</SelectItem>
            <SelectItem value="audio">Audio Gen</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
            <SelectItem value="workflow">Workflow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Prompts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPrompts.map((prompt) => {
          const Icon = promptTypeIcons[prompt.type] || FileText;
          return (
            <Card
              key={prompt.id}
              className="group border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-700"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-zinc-800 p-2">
                      <Icon className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium text-white">
                        {prompt.name}
                      </CardTitle>
                      <p className="text-xs text-zinc-500">
                        {promptTypeLabels[prompt.type]}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-400 hover:text-white"
                      onClick={() => handleCopyPrompt(prompt.content, prompt.id)}
                    >
                      {copiedId === prompt.id ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-400 hover:text-white"
                          onClick={() => setEditingPrompt(prompt)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl border-zinc-800 bg-zinc-950">
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            Edit Prompt
                          </DialogTitle>
                        </DialogHeader>
                        <EditPromptForm
                          prompt={prompt}
                          onClose={() => setEditingPrompt(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-400 hover:text-red-400"
                      onClick={() => handleDeletePrompt(prompt.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-zinc-400 line-clamp-2">
                  {prompt.description}
                </p>
                <div className="rounded-lg bg-zinc-950 p-3">
                  <p className="text-xs text-zinc-500 font-mono line-clamp-3">
                    {prompt.content}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    <Badge
                      variant={prompt.isActive ? 'default' : 'secondary'}
                      className={
                        prompt.isActive
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }
                    >
                      {prompt.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {prompt.version && (
                      <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                        v{prompt.version}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-zinc-500">
                    {prompt.usageCount?.toLocaleString()} uses
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            No prompts found
          </h3>
          <p className="text-zinc-400 max-w-sm">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first system prompt'}
          </p>
        </div>
      )}
    </div>
  );
}

function AddPromptForm({ onClose }: { onClose: () => void }) {
  const { addPrompt } = useAdminStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    type: 'system' as SystemPrompt['type'],
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPrompt(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-zinc-300">Name</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="e.g., Creative Writing Expert"
            className="border-zinc-800 bg-zinc-900 text-white"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-300">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData({ ...formData, type: value as SystemPrompt['type'] })
            }
          >
            <SelectTrigger className="border-zinc-800 bg-zinc-900 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-zinc-800 bg-zinc-900">
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
              <SelectItem value="image">Image Gen</SelectItem>
              <SelectItem value="video">Video Gen</SelectItem>
              <SelectItem value="audio">Audio Gen</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
              <SelectItem value="workflow">Workflow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-zinc-300">Description</Label>
        <Input
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Brief description of what this prompt does"
          className="border-zinc-800 bg-zinc-900 text-white"
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="text-zinc-300">Prompt Content</Label>
        <Textarea
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Enter the prompt content..."
          className="min-h-[200px] border-zinc-800 bg-zinc-900 font-mono text-sm text-white"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: checked })
            }
          />
          <Label className="text-zinc-300">Active</Label>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600"
          >
            Add Prompt
          </Button>
        </div>
      </div>
    </form>
  );
}

function EditPromptForm({
  prompt,
  onClose,
}: {
  prompt: SystemPrompt;
  onClose: () => void;
}) {
  const { updatePrompt } = useAdminStore();
  const [formData, setFormData] = useState(prompt);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePrompt(prompt.id, formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-zinc-300">Name</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="border-zinc-800 bg-zinc-900 text-white"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-300">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData({ ...formData, type: value as SystemPrompt['type'] })
            }
          >
            <SelectTrigger className="border-zinc-800 bg-zinc-900 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-zinc-800 bg-zinc-900">
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
              <SelectItem value="image">Image Gen</SelectItem>
              <SelectItem value="video">Video Gen</SelectItem>
              <SelectItem value="audio">Audio Gen</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
              <SelectItem value="workflow">Workflow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-zinc-300">Description</Label>
        <Input
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border-zinc-800 bg-zinc-900 text-white"
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="text-zinc-300">Prompt Content</Label>
        <Textarea
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="min-h-[200px] border-zinc-800 bg-zinc-900 font-mono text-sm text-white"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: checked })
            }
          />
          <Label className="text-zinc-300">Active</Label>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
