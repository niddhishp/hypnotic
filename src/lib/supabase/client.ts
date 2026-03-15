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
      // NOTE: Do NOT set flowType: 'pkce' here.
      // Supabase password reset + magic link emails use implicit flow (hash fragments).
      // PKCE uses query ?code= params — enabling it breaks hash-token recovery emails.
    },
  }
);

export const isSupabaseConfigured = () =>
  Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'http://localhost:54321');

/** Base URL for OAuth / email redirect links. Uses deployed domain when set. */
export function getAppBaseUrl(): string {
  return import.meta.env.VITE_APP_URL || window.location.origin;
}
