import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';
import type { Project } from '@/types';

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;

  fetchProjects:    () => Promise<void>;
  addProject:       (name: string, description?: string, brand?: string) => Promise<Project | null>;
  updateProject:    (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject:    (id: string) => Promise<void>;
  setCurrentProject:(project: Project | null) => void;
  setProjects:      (projects: Project[]) => void;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects:       [],
      currentProject: null,
      isLoading:      false,
      error:          null,

      // ── Fetch all projects for current user ──────────────────────────────
      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) { set({ isLoading: false }); return; }

          const { data, error } = await (supabase as any)
            .from('projects')
            .select('id, user_id, name, description, brand, thumbnail_url, status, created_at, updated_at')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('updated_at', { ascending: false });

          if (error) throw error;

          const projects: Project[] = (data ?? []).map((p: any) => ({
            id:          p.id,
            name:        p.name,
            description: p.description,
            brand:       p.brand,
            thumbnail:   p.thumbnail_url,
            createdAt:   p.created_at,
            updatedAt:   p.updated_at,
            userId:      p.user_id,
          }));

          set({ projects, isLoading: false });

          // Auto-select first project if none selected
          const current = get().currentProject;
          if (!current && projects.length > 0) {
            set({ currentProject: projects[0] });
          }
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      // ── Create new project ───────────────────────────────────────────────
      addProject: async (name, description, brand) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const { data, error } = await (supabase as any)
            .from('projects')
            .insert({ user_id: user.id, name, description, brand, status: 'active' })
            .select()
            .single();

          if (error) throw error;

          const project: Project = {
            id:          data.id,
            name:        data.name,
            description: data.description,
            brand:       data.brand,
            createdAt:   data.created_at,
            updatedAt:   data.updated_at,
          };

          set(state => ({
            projects: [project, ...state.projects],
            currentProject: project,
          }));

          return project;
        } catch (err) {
          console.error('[projects] addProject failed:', err);
          return null;
        }
      },

      // ── Update project ───────────────────────────────────────────────────
      updateProject: async (id, updates) => {
        set(state => ({
          projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
          currentProject: state.currentProject?.id === id
            ? { ...state.currentProject, ...updates }
            : state.currentProject,
        }));
        try {
          const dbUpdates: any = {};
          if (updates.name)        dbUpdates.name        = updates.name;
          if (updates.description) dbUpdates.description = updates.description;
          if (updates.brand)       dbUpdates.brand       = updates.brand;
          dbUpdates.updated_at = new Date().toISOString();
          await (supabase as any).from('projects').update(dbUpdates).eq('id', id);
        } catch (err) {
          console.error('[projects] updateProject failed:', err);
        }
      },

      // ── Soft-delete project ──────────────────────────────────────────────
      deleteProject: async (id) => {
        set(state => ({
          projects: state.projects.filter(p => p.id !== id),
          currentProject: state.currentProject?.id === id ? state.projects.find(p => p.id !== id) ?? null : state.currentProject,
        }));
        try {
          await (supabase as any).from('projects').update({ status: 'deleted' }).eq('id', id);
        } catch (err) {
          console.error('[projects] deleteProject failed:', err);
        }
      },

      setCurrentProject: (project) => set({ currentProject: project }),
      setProjects:       (projects) => set({ projects }),
    }),
    {
      name: 'hypnotic-projects',
      partialize: (s) => ({ currentProject: s.currentProject }),
    }
  )
);
