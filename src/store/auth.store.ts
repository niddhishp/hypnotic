import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@/types';

// Use the configured app URL for OAuth redirects
// Falls back to window.location.origin (correct for local dev)
function getRedirectBase(): string {
  return import.meta.env.VITE_APP_URL || window.location.origin;
}

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
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            // Silently refresh — don't update loading state
            const currentUser = get().user;
            if (!currentUser) {
              const user = await fetchProfile(session.user.id);
              if (user) set({ user, isAuthenticated: true });
            }
          }
        });
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            // Human-readable errors
            const msg =
              error.message.includes('Invalid login credentials') ? 'Incorrect email or password. Did you sign up with Google instead?' :
              error.message.includes('Email not confirmed')       ? 'Please check your email and click the confirmation link first.' :
              error.message.includes('too many requests')         ? 'Too many attempts. Please wait a minute and try again.' :
              error.message;
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
            email,
            password,
            options: {
              data: { name, role },
              emailRedirectTo: `${getRedirectBase()}/dashboard`,
            },
          });
          if (error) {
            const msg =
              error.message.includes('already registered') ? 'An account with this email already exists. Try logging in instead.' :
              error.message.includes('Password should')    ? 'Password must be at least 8 characters.' :
              error.message;
            set({ error: msg, isLoading: false });
            return { error: msg };
          }
          if (data.user) {
            // Check if email confirmation is needed
            if (data.user.identities?.length === 0) {
              set({ isLoading: false });
              return { error: null }; // will show confirmEmail state
            }
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
            options: {
              redirectTo: `${getRedirectBase()}/dashboard`,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            },
          });
          if (error) {
            const msg =
              error.message.includes('not enabled') ? 'Google sign-in is not configured yet. Please use email instead.' :
              error.message;
            set({ error: msg, isLoading: false });
            return { error: msg };
          }
          // Redirect happens — loading cleared by onAuthStateChange
          return { error: null };
        } catch {
          set({ error: 'Google login failed. Please use email instead.', isLoading: false });
          return { error: 'Google login failed.' };
        }
      },

      loginWithMagicLink: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: `${getRedirectBase()}/auth/callback`,
              shouldCreateUser: true,
            },
          });
          set({ isLoading: false });
          if (error) {
            const msg =
              error.message.includes('rate limit') ? 'Email already sent. Please check your inbox (or wait 60s).' :
              error.message;
            set({ error: msg });
            return { error: msg };
          }
          return { error: null };
        } catch {
          set({ error: 'Could not send magic link. Please try again.', isLoading: false });
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
