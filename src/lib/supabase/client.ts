import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Hypnotic] Supabase env vars not set — running in demo mode.');
}

export const supabase = createClient<Database>(
  supabaseUrl    || 'http://localhost:54321',
  supabaseAnonKey || 'mock-key',
  {
    auth: {
      autoRefreshToken:   true,
      persistSession:     true,
      detectSessionInUrl: true,
      // Use VITE_APP_URL for redirects if set, otherwise current origin
      // This fixes the localhost:3000 vs 5173 issue
      flowType: 'pkce',
    },
  }
);

export const isSupabaseConfigured = () =>
  Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'http://localhost:54321');

// The base URL for OAuth/magic-link redirects
// Priority: VITE_APP_URL → window.location.origin
export function getAppBaseUrl(): string {
  return import.meta.env.VITE_APP_URL || window.location.origin;
}
