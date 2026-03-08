import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project } from '@/types';

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Note: Projects are server data - should come from Supabase
// This store is for client-side state management only
export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({
    projects: [project, ...state.projects]
  })),
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(p => 
      p.id === id ? { ...p, ...updates } : p
    )
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id)
  })),
  setCurrentProject: (project) => set({ currentProject: project }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
