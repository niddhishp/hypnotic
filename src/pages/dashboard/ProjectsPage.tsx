import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, FolderOpen, Clock, ArrowRight,
  MoreVertical, Trash2, Edit3, Sparkles
} from 'lucide-react';
import { useProjectsStore } from '@/store';
import { SEO } from '@/components/shared/SEO';
import { cn } from '@/lib/utils';

const MODULE_COLORS = ['#7aaee0', '#C9A96E', '#a07ae0', '#7abf8e'];

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface NewProjectModal {
  open: boolean;
  name: string;
  description: string;
  brand: string;
}

export function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, currentProject, fetchProjects, addProject, deleteProject, setCurrentProject, isLoading } = useProjectsStore();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [modal, setModal] = useState<NewProjectModal>({ open: false, name: '', description: '', brand: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!modal.name.trim()) return;
    setCreating(true);
    const project = await addProject(modal.name.trim(), modal.description, modal.brand);
    setCreating(false);
    if (project) {
      setModal({ open: false, name: '', description: '', brand: '' });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-full" style={{ background: '#0A0A0C' }}>
      <SEO title="Projects" noIndex />
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-[#F0EDE8] tracking-tight">Projects</h1>
            <p className="text-sm text-[#555] mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setModal(p => ({ ...p, open: true }))}
            className="flex items-center gap-2 bg-[#C9A96E] text-[#08080A] rounded-xl px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
          <input
            type="text"
            placeholder="Search projects…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors"
          />
        </div>

        {/* Project grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-40 rounded-2xl skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/8 rounded-2xl">
            <FolderOpen className="w-10 h-10 text-[#333] mx-auto mb-4" />
            <p className="text-base font-light text-[#555] mb-1">
              {search ? 'No projects match your search' : 'No projects yet'}
            </p>
            <p className="text-sm text-[#333] mb-6">
              {search ? 'Try a different search term' : 'Create your first project to get started'}
            </p>
            {!search && (
              <button
                onClick={() => setModal(p => ({ ...p, open: true }))}
                className="flex items-center gap-2 bg-[#C9A96E] text-[#08080A] rounded-xl px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-all mx-auto"
              >
                <Plus className="w-4 h-4" /> Create first project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((project, idx) => {
              const isActive = currentProject?.id === project.id;
              const color = MODULE_COLORS[idx % MODULE_COLORS.length];
              return (
                <button
                  key={project.id}
                  onClick={() => { setCurrentProject(project); navigate('/dashboard'); }}
                  className={cn(
                    'text-left rounded-2xl border p-5 transition-all group relative',
                    isActive ? 'border-[#C9A96E]/40' : 'border-white/6 hover:border-white/15'
                  )}
                  style={{ background: isActive ? `${color}08` : '#0D0D10' }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                      <span className="text-[11px] text-[#C9A96E]">Active</span>
                    </div>
                  )}

                  {/* Color bar */}
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15` }}>
                    <FolderOpen className="w-4 h-4" style={{ color }} />
                  </div>

                  <h3 className="text-sm font-medium text-[#F0EDE8] mb-1 pr-16 truncate">{project.name}</h3>
                  {project.brand && (
                    <p className="text-[11px] text-[#C9A96E]/70 mb-2">{project.brand}</p>
                  )}
                  {project.description && (
                    <p className="text-xs text-[#555] leading-relaxed line-clamp-2 mb-3">{project.description}</p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                    <span className="flex items-center gap-1 text-[11px] text-[#444]">
                      <Clock className="w-3 h-3" />
                      {fmt(project.updatedAt ?? project.createdAt)}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[#C9A96E] opacity-0 group-hover:opacity-100 transition-opacity">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Context menu */}
                  <div
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === project.id ? null : project.id); }}
                  >
                    <button className="p-1.5 rounded-lg hover:bg-white/8 text-[#555] hover:text-[#F0EDE8] transition-all">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    {menuOpen === project.id && (
                      <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-white/8 overflow-hidden z-10 shadow-xl" style={{ background: '#0F0F12' }}>
                        <button
                          onClick={e => { e.stopPropagation(); setMenuOpen(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-[#777] hover:text-[#F0EDE8] hover:bg-white/4 transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Rename
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); deleteProject(project.id); setMenuOpen(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-[#777] hover:text-red-400 hover:bg-red-500/5 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={() => setModal(p => ({ ...p, open: false }))}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-2xl border border-white/10 p-6 space-y-5 shadow-2xl"
            style={{ background: '#0F0F12' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-7 h-7 rounded-lg bg-[#C9A96E] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#08080A]" />
              </span>
              <h2 className="text-base font-medium text-[#F0EDE8]">New project</h2>
            </div>

            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Project name *</label>
              <input
                autoFocus
                type="text"
                value={modal.name}
                onChange={e => setModal(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Nike Q4 Campaign"
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Brand name</label>
              <input
                type="text"
                value={modal.brand}
                onChange={e => setModal(p => ({ ...p, brand: e.target.value }))}
                placeholder="e.g. Nike"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Description</label>
              <textarea
                rows={3}
                value={modal.description}
                onChange={e => setModal(p => ({ ...p, description: e.target.value }))}
                placeholder="What's this project about?"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setModal(p => ({ ...p, open: false }))}
                className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm text-[#777] hover:border-white/20 hover:text-[#F0EDE8] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!modal.name.trim() || creating}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all"
              >
                {creating
                  ? <><div className="w-4 h-4 border-2 border-[#08080A]/30 border-t-[#08080A] rounded-full animate-spin" /> Creating…</>
                  : <><Plus className="w-4 h-4" /> Create</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
