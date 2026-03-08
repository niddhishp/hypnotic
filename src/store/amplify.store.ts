import { create } from 'zustand';
import type { ScheduledPost } from '@/types';

interface AmplifyState {
  posts: ScheduledPost[];
  currentPost: ScheduledPost | null;
  isPublishing: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPosts: (posts: ScheduledPost[]) => void;
  addPost: (post: ScheduledPost) => void;
  updatePost: (id: string, updates: Partial<ScheduledPost>) => void;
  setCurrentPost: (post: ScheduledPost | null) => void;
  setIsPublishing: (value: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Server data - no persistence
export const useAmplifyStore = create<AmplifyState>((set) => ({
  posts: [],
  currentPost: null,
  isPublishing: false,
  isLoading: false,
  error: null,
  
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({
    posts: [post, ...state.posts]
  })),
  updatePost: (id, updates) => set((state) => ({
    posts: state.posts.map(p => 
      p.id === id ? { ...p, ...updates } : p
    )
  })),
  setCurrentPost: (post) => set({ currentPost: post }),
  setIsPublishing: (value) => set({ isPublishing: value }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
