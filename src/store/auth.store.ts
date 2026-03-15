import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialize:         () => Promise<void>;
  login:              (email: string, password: string) => Promise<{ error: string | null }>;
  signup:             (email: string, password: string, name: string, role: string) => Promise<{ error: string | null }>;
  loginWithGoogle:    () => Promise<{ error: string | null }>;
  loginWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  logout:             () => Promise<void>;
  updateUser:         (updates: Partial<User>) => Promise<void>;
  clearError:         () => void;
}

async function fetchProfile(userId: string): Promise<User | null> {
  try {
    const { data, error } = await (supabase as any)
      .from('user_profiles')
      .select('id, email, name, role, plan, credits, avatar_url, status')
      .eq('id', userId)
      .single();
    if (error || !data) return null;
    return {
      id:      data.id,
      email:   data.email,
      name:    data.name ?? data.email.split('@')[0],
      role:    data.role as User['role'],
      plan:    data.plan as User['plan'],
      credits: data.credits ?? 50,
      avatar:  data.avatar_url ?? undefined,
    };
  } catch { return null; }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initialize: async () => {
        set({ isLoading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const user = await fetchProfile(session.user.id);
            set({ user, isAuthenticated: !!user, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }

        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const user = await fetchProfile(session.user.id);
            set({ user, isAuthenticated: !!user });
          } else if (event === 'SIGNED_OUT') {
            set({ user: null, isAuthenticated: false });
          }
        });
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            const msg = error.message.includes('Invalid login')
              ? 'Incorrect email or password' : error.message;
            set({ error: msg, isLoading: false });
            return { error: msg };
          }
          const user = await fetchProfile(data.user.id);
          set({ user, isAuthenticated: !!user, isLoading: false });
          return { error: null };
        } catch {
          const msg = 'Login failed. Please try again.';
          set({ error: msg, isLoading: false });
          return { error: msg };
        }
      },

      signup: async (email, password, name, role) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email, password,
            options: {
              data: { name, role },
              emailRedirectTo: `${window.location.origin}/dashboard`,
            },
          });
          if (error) {
            const msg = error.message.includes('already registered')
              ? 'An account with this email already exists' : error.message;
            set({ error: msg, isLoading: false });
            return { error: msg };
          }
          if (data.user) {
            await new Promise(r => setTimeout(r, 600));
            const user = await fetchProfile(data.user.id);
            set({ user, isAuthenticated: !!user, isLoading: false });
          } else {
            set({ isLoading: false });
          }
          return { error: null };
        } catch {
          const msg = 'Signup failed. Please try again.';
          set({ error: msg, isLoading: false });
          return { error: msg };
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/dashboard` },
          });
          if (error) { set({ error: error.message, isLoading: false }); return { error: error.message }; }
          return { error: null };
        } catch {
          set({ error: 'Google login failed.', isLoading: false });
          return { error: 'Google login failed.' };
        }
      },

      loginWithMagicLink: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: `${window.location.origin}/dashboard` },
          });
          set({ isLoading: false });
          if (error) { set({ error: error.message }); return { error: error.message }; }
          return { error: null };
        } catch {
          set({ error: 'Could not send magic link.', isLoading: false });
          return { error: 'Could not send magic link.' };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false, isLoading: false, error: null });
      },

      updateUser: async (updates) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...updates } });
        try {
          const dbUpdates: Record<string, unknown> = {};
          if (updates.name)   dbUpdates.name       = updates.name;
          if (updates.role)   dbUpdates.role       = updates.role;
          if (updates.avatar) dbUpdates.avatar_url = updates.avatar;
          if (Object.keys(dbUpdates).length > 0) {
            await (supabase as any).from('user_profiles')
              .update({ ...dbUpdates, updated_at: new Date().toISOString() })
              .eq('id', current.id);
          }
        } catch { set({ user: current }); }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'hypnotic-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
);
