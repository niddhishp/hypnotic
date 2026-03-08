import { create } from 'zustand';
import type { User, GenerationModel } from '@/types';

export interface SystemPrompt {
  id: string;
  module?: string;
  category?: string;
  type: 'system' | 'chat' | 'image' | 'video' | 'audio' | 'expert' | 'workflow';
  name: string;
  description: string;
  content: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  isActive: boolean;
  updatedAt?: string;
  version?: string;
  usageCount?: number;
}

interface AdminState {
  // Users
  users: User[];
  isLoadingUsers: boolean;
  
  // Models
  models: GenerationModel[];
  isLoadingModels: boolean;
  
  // Prompts
  prompts: SystemPrompt[];
  isLoadingPrompts: boolean;
  
  // Stats
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalProjects: number;
    totalGenerations: number;
    revenue: number;
    userGrowth?: number;
    generationGrowth?: number;
    revenueGrowth?: number;
  } | null;
  isLoadingStats: boolean;
  
  // Actions
  setUsers: (users: User[]) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  setLoadingUsers: (loading: boolean) => void;
  fetchUsers: () => Promise<void>;
  
  setModels: (models: GenerationModel[]) => void;
  addModel: (model: GenerationModel) => void;
  updateModel: (id: string, updates: Partial<GenerationModel>) => void;
  deleteModel: (id: string) => void;
  setLoadingModels: (loading: boolean) => void;
  fetchModels: () => Promise<void>;
  
  setPrompts: (prompts: SystemPrompt[]) => void;
  addPrompt: (promptData: { name: string; description: string; content: string; type: SystemPrompt['type']; isActive: boolean }) => void;
  updatePrompt: (id: string, updates: Partial<SystemPrompt>) => void;
  deletePrompt: (id: string) => void;
  setLoadingPrompts: (loading: boolean) => void;
  fetchPrompts: () => Promise<void>;
  
  setStats: (stats: AdminState['stats']) => void;
  setLoadingStats: (loading: boolean) => void;
  fetchStats: () => Promise<void>;
}

// Mock data for admin
const mockUsers: User[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@agency.com', role: 'agency', plan: 'agency', credits: 5000, status: 'active', lastActive: '2024-01-15T10:30:00Z' },
  { id: '2', name: 'Mike Johnson', email: 'mike@studio.com', role: 'creator', plan: 'pro', credits: 2500, status: 'active', lastActive: '2024-01-14T16:45:00Z' },
  { id: '3', name: 'Emma Davis', email: 'emma@brand.com', role: 'creator', plan: 'pro', credits: 1800, status: 'active', lastActive: '2024-01-13T09:20:00Z' },
  { id: '4', name: 'Alex Wong', email: 'alex@creative.com', role: 'expert', plan: 'agency', credits: 7500, status: 'suspended', lastActive: '2024-01-10T14:00:00Z' },
  { id: '5', name: 'Lisa Park', email: 'lisa@design.com', role: 'creator', plan: 'starter', credits: 500, status: 'active', lastActive: '2024-01-15T08:15:00Z' },
];

const mockModels: GenerationModel[] = [
  { id: '1', name: 'DALL-E 3', provider: 'OpenAI', type: 'image', tier: 'quality', isActive: true, lastVerified: '2024-01-15T10:00:00Z', costPerImage: 0.04 },
  { id: '2', name: 'Midjourney v6', provider: 'Midjourney', type: 'image', tier: 'ultra', isActive: true, lastVerified: '2024-01-14T16:00:00Z', costPerImage: 0.08 },
  { id: '3', name: 'Stable Diffusion XL', provider: 'Stability AI', type: 'image', tier: 'fast', isActive: true, lastVerified: '2024-01-13T12:00:00Z', costPerImage: 0.02 },
  { id: '4', name: 'Runway Gen-2', provider: 'Runway', type: 'video', tier: 'quality', isActive: true, lastVerified: '2024-01-12T09:00:00Z', costPerSecond: 0.05 },
  { id: '5', name: 'Pika Labs', provider: 'Pika', type: 'video', tier: 'fast', isActive: false, lastVerified: '2024-01-10T14:00:00Z', costPerSecond: 0.03 },
  { id: '6', name: 'ElevenLabs Multilingual', provider: 'ElevenLabs', type: 'voice', tier: 'quality', isActive: true, lastVerified: '2024-01-15T08:00:00Z', costPerChar: 0.0001 },
  { id: '7', name: 'Suno AI', provider: 'Suno', type: 'audio', tier: 'quality', isActive: true, lastVerified: '2024-01-14T20:00:00Z', costPerSong: 0.5 },
];

const mockPrompts: SystemPrompt[] = [
  { id: '1', name: 'Brand Analysis Expert', type: 'expert', description: 'Expert in analyzing brand positioning and market opportunities', category: 'insight', content: 'You are an expert brand analyst...', model: 'gpt-4', isActive: true, updatedAt: '2024-01-15T10:00:00Z', version: '1.2', usageCount: 1250 },
  { id: '2', name: 'Creative Strategist', type: 'expert', description: 'Develops comprehensive creative strategies', category: 'manifest', content: 'You are a creative strategist...', model: 'claude-3-opus', isActive: true, updatedAt: '2024-01-14T16:00:00Z', version: '2.0', usageCount: 890 },
  { id: '3', name: 'Image Prompt Engineer', type: 'image', description: 'Crafts optimized prompts for image generation', category: 'craft', content: 'You are an expert at crafting image generation prompts...', model: 'gpt-4', isActive: true, updatedAt: '2024-01-13T12:00:00Z', version: '1.5', usageCount: 2340 },
  { id: '4', name: 'Social Media Optimizer', type: 'workflow', description: 'Optimizes content for social media platforms', category: 'amplify', content: 'You are a social media optimization expert...', model: 'gpt-4-turbo', isActive: false, updatedAt: '2024-01-12T09:00:00Z', version: '1.0', usageCount: 456 },
  { id: '5', name: 'System Assistant', type: 'system', description: 'Default system assistant for general queries', content: 'You are a helpful AI assistant...', isActive: true, updatedAt: '2024-01-11T08:00:00Z', version: '1.0', usageCount: 5600 },
  { id: '6', name: 'Chat Companion', type: 'chat', description: 'Conversational AI for brainstorming sessions', content: 'You are a creative conversation partner...', isActive: true, updatedAt: '2024-01-10T14:00:00Z', version: '1.1', usageCount: 1890 },
];

// Admin data - no persistence (fetched from server)
export const useAdminStore = create<AdminState>((set) => ({
  users: mockUsers,
  isLoadingUsers: false,
  
  models: mockModels,
  isLoadingModels: false,
  
  prompts: mockPrompts,
  isLoadingPrompts: false,
  
  stats: {
    totalUsers: 1247,
    activeUsers: 892,
    totalProjects: 3456,
    totalGenerations: 89234,
    revenue: 45200,
    userGrowth: 12.5,
    generationGrowth: 23.1,
    revenueGrowth: 15.3,
  },
  isLoadingStats: false,
  
  // User actions
  setUsers: (users) => set({ users }),
  updateUser: (id, updates) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
  })),
  deleteUser: (id) => set((state) => ({
    users: state.users.filter(u => u.id !== id)
  })),
  setLoadingUsers: (loading) => set({ isLoadingUsers: loading }),
  fetchUsers: async () => {
    set({ isLoadingUsers: true });
    // In real implementation, fetch from API
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoadingUsers: false });
  },
  
  // Model actions
  setModels: (models) => set({ models }),
  addModel: (model) => set((state) => ({
    models: [...state.models, model]
  })),
  updateModel: (id, updates) => set((state) => ({
    models: state.models.map(m => m.id === id ? { ...m, ...updates } : m)
  })),
  deleteModel: (id) => set((state) => ({
    models: state.models.filter(m => m.id !== id)
  })),
  setLoadingModels: (loading) => set({ isLoadingModels: loading }),
  fetchModels: async () => {
    set({ isLoadingModels: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoadingModels: false });
  },
  
  // Prompt actions
  setPrompts: (prompts) => set({ prompts }),
  addPrompt: (promptData: { name: string; description: string; content: string; type: SystemPrompt['type']; isActive: boolean }) => set((state) => ({
    prompts: [...state.prompts, {
      ...promptData,
      id: Math.random().toString(36).substr(2, 9),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      usageCount: 0,
    } as SystemPrompt]
  })),
  updatePrompt: (id, updates) => set((state) => ({
    prompts: state.prompts.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  deletePrompt: (id) => set((state) => ({
    prompts: state.prompts.filter(p => p.id !== id)
  })),
  setLoadingPrompts: (loading) => set({ isLoadingPrompts: loading }),
  fetchPrompts: async () => {
    set({ isLoadingPrompts: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoadingPrompts: false });
  },
  
  // Stats actions
  setStats: (stats) => set({ stats }),
  setLoadingStats: (loading) => set({ isLoadingStats: loading }),
  fetchStats: async () => {
    set({ isLoadingStats: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoadingStats: false });
  },
}));
