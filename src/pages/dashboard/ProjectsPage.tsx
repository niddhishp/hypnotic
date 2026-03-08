import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  FolderOpen,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useProjectsStore } from '@/store';
import type { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const mockProjects = [
  {
    id: '1',
    name: 'Nike Air Max Campaign',
    description: 'Q4 product launch campaign for Air Max line',
    brand: 'Nike',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-07T15:30:00Z',
  },
  {
    id: '2',
    name: 'Spotify Wrapped 2024',
    description: 'Year-end user engagement campaign',
    brand: 'Spotify',
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2024-03-05T12:00:00Z',
  },
  {
    id: '3',
    name: 'Apple Vision Pro Launch',
    description: 'Spatial computing product launch',
    brand: 'Apple',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-02-28T16:45:00Z',
  },
  {
    id: '4',
    name: 'Coca-Cola Summer Refresh',
    description: 'Summer seasonal campaign',
    brand: 'Coca-Cola',
    createdAt: '2024-03-05T11:00:00Z',
    updatedAt: '2024-03-06T10:20:00Z',
  },
];

export function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, setProjects, setCurrentProject } = useProjectsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', brand: '' });

  // Use mock projects if none exist
  const displayProjects = projects.length > 0 ? projects : mockProjects;

  const filteredProjects = displayProjects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    const project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      brand: newProject.brand,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: '1',
    };
    
    setProjects([project, ...displayProjects]);
    setCurrentProject(project);
    setIsCreateOpen(false);
    setNewProject({ name: '', description: '', brand: '' });
    navigate('/dashboard');
  };

  const handleSelectProject = (project: any) => {
    setCurrentProject(project as Project);
    navigate('/dashboard');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#F6F6F6] mb-1">Projects</h1>
          <p className="text-sm text-[#A7A7A7]">Manage your creative campaigns</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0F0F11] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-[#F6F6F6]">Create New Project</DialogTitle>
              <DialogDescription className="text-[#A7A7A7]">
                Start a new creative campaign
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm text-[#A7A7A7] mb-2">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g., Summer Campaign 2024"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F6F6F6] placeholder:text-[#666] focus:outline-none focus:border-[#D8A34A]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A7A7A7] mb-2">Brand</label>
                <input
                  type="text"
                  value={newProject.brand}
                  onChange={(e) => setNewProject({ ...newProject, brand: e.target.value })}
                  placeholder="e.g., Nike"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F6F6F6] placeholder:text-[#666] focus:outline-none focus:border-[#D8A34A]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A7A7A7] mb-2">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Brief description of the project..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F6F6F6] placeholder:text-[#666] focus:outline-none focus:border-[#D8A34A]/50 resize-none"
                />
              </div>
              <Button 
                onClick={handleCreateProject}
                disabled={!newProject.name}
                className="w-full bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]"
              >
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-12 pr-4 py-3 bg-[#0F0F11] border border-white/10 rounded-xl text-[#F6F6F6] placeholder:text-[#666] focus:outline-none focus:border-[#D8A34A]/50"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="w-16 h-16 text-[#333] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#F6F6F6] mb-2">No projects found</h3>
          <p className="text-sm text-[#A7A7A7] mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first project to get started'}
          </p>
          {!searchQuery && (
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id}
              className="bg-[#0F0F11] border-white/5 hover:border-white/10 group cursor-pointer transition-all"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D8A34A]/30 to-[#B8832F]/30 flex items-center justify-center"
                  >
                    <span className="text-lg font-semibold text-[#D8A34A]">
                      {project.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-[#666] hover:text-[#F6F6F6] hover:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0F0F11] border-white/10">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProject(project);
                        }}
                        className="text-[#A7A7A7] focus:text-[#F6F6F6] focus:bg-white/5"
                      >
                        Open Project
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-[#A7A7A7] focus:text-[#F6F6F6] focus:bg-white/5">
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 focus:text-red-400 focus:bg-white/5">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <h3 className="font-medium text-[#F6F6F6] mb-1">{project.name}</h3>
                {project.brand && (
                  <div className="text-xs text-[#D8A34A] mb-2">{project.brand}</div>
                )}
                {project.description && (
                  <p className="text-sm text-[#A7A7A7] line-clamp-2 mb-3">{project.description}</p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-[#666]">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(project.updatedAt)}
                  </div>
                  <button 
                    onClick={() => handleSelectProject(project)}
                    className="flex items-center gap-1 text-xs text-[#D8A34A] hover:underline"
                  >
                    Open
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
