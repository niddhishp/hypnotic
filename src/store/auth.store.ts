import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, name: string, role: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<{ error: string | null }>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initialize: async () => {
    // Check for existing session
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping session check');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Fetch user profile from database
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        const p = profile as any;
        set({
          user: {
            id: p.id,
            email: p.email,
            name: p.name || session.user.email?.split('@')[0] || 'User',
            role: p.role,
            plan: p.plan,
            credits: p.credits,
            avatar: p.avatar_url,
          },
          isAuthenticated: true,
        });
      }
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const p = profile as any;
          set({
            user: {
              id: p.id,
              email: p.email,
              name: p.name || session.user.email?.split('@')[0] || 'User',
              role: p.role,
              plan: p.plan,
              credits: p.credits,
              avatar: p.avatar_url,
            },
            isAuthenticated: true,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, isAuthenticated: false });
      }
    });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // If Supabase is not configured, use mock auth for development
      if (!isSupabaseConfigured()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock successful login
        set({
          user: {
            id: 'mock-user-id',
            email,
            name: email.split('@')[0],
            role: 'creator',
            plan: 'pro',
            credits: 200,
          },
          isAuthenticated: true,
          isLoading: false,
        });
        return { error: null };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return { error: error.message };
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          const p = profile as any;
          set({
            user: {
              id: p.id,
              email: p.email,
              name: p.name || email.split('@')[0],
              role: p.role,
              plan: p.plan,
              credits: p.credits,
              avatar: p.avatar_url,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        }
      }

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message, isLoading: false });
      return { error: message };
    }
  },

  signup: async (email: string, password: string, name: string, role: string) => {
    set({ isLoading: true, error: null });
    
    try {
      if (!isSupabaseConfigured()) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set({
          user: {
            id: 'mock-user-id',
            email,
            name,
            role: role as 'creator' | 'agency',
            plan: 'starter',
            credits: 50,
          },
          isAuthenticated: true,
          isLoading: false,
        });
        return { error: null };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
        },
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return { error: error.message };
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          name,
          role,
          plan: 'starter',
          credits: 50,
        } as any);

        if (profileError) {
          set({ error: profileError.message, isLoading: false });
          return { error: profileError.message };
        }

        set({
          user: {
            id: data.user.id,
            email,
            name,
            role: role as 'creator' | 'agency',
            plan: 'starter',
            credits: 50,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      }

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      set({ error: message, isLoading: false });
      return { error: message };
    }
  },

  logout: async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    set({ user: null, isAuthenticated: false, error: null });
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    
    try {
      if (!isSupabaseConfigured()) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        set({
          user: {
            id: 'mock-google-user',
            email: 'google@example.com',
            name: 'Google User',
            role: 'creator',
            plan: 'pro',
            credits: 200,
          },
          isAuthenticated: true,
          isLoading: false,
        });
        return { error: null };
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        set({ error: error.message, isLoading: false });
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google login failed';
      set({ error: message, isLoading: false });
      return { error: message };
    }
  },

  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null,
  })),

  clearError: () => set({ error: null }),
}));
