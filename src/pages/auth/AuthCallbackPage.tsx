// src/pages/auth/AuthCallbackPage.tsx
// Handles all Supabase auth redirects: password reset, magic link, OAuth.
//
// How it works:
//   Supabase client has detectSessionInUrl: true — it automatically reads
//   #access_token / #refresh_token hash fragments and establishes the session.
//   We just listen for onAuthStateChange and react to the event type.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/store';
import { Sparkles, AlertCircle, Lock, Eye, EyeOff, Check } from 'lucide-react';

type PageState = 'loading' | 'reset_password' | 'reset_done' | 'error';

export function AuthCallbackPage() {
  const navigate  = useNavigate();
  const { initialize } = useAuthStore();
  const [state,    setState]   = useState<PageState>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [show,     setShow]     = useState(false);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    // Supabase automatically detects hash tokens (detectSessionInUrl: true).
    // We listen to the auth state change event to know what happened.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          // User clicked a password reset link — show the set-password form
          setState('reset_password');
          return;
        }

        if (event === 'SIGNED_IN' && session) {
          // Magic link or OAuth sign-in completed
          await ensureProfile(session.user.id, session.user.email ?? '');
          await initialize();

          const { data: profile } = await (supabase as any)
            .from('user_profiles')
            .select('onboarded')
            .eq('id', session.user.id)
            .single();

          navigate(profile?.onboarded ? '/dashboard' : '/onboard', { replace: true });
          return;
        }

        if (event === 'USER_UPDATED' && session) {
          // Password was just updated via updateUser
          await initialize();
          setState('reset_done');
          setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
          return;
        }
      }
    );

    // Also handle explicit error in URL hash (e.g. expired link)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const urlError   = hashParams.get('error');
    const urlDesc    = hashParams.get('error_description');

    if (urlError) {
      const msg =
        urlDesc?.includes('expired')
          ? 'This link has expired. Recovery links are valid for 1 hour — please request a new one.'
          : urlDesc?.replace(/\+/g, ' ') ?? 'Authentication failed. Please try again.';
      setErrorMsg(msg);
      setState('error');
    }

    // Handle ?code= query param (PKCE OAuth flows from some providers)
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(async ({ error: ex }) => {
        if (ex) { setErrorMsg(ex.message); setState('error'); }
        // onAuthStateChange SIGNED_IN will fire and handle redirect
      });
    }

    // Fallback timeout: if nothing fires in 8s, show error
    const timeout = setTimeout(() => {
      setState(s => s === 'loading' ? 'error' : s);
      setErrorMsg('Authentication timed out. Please try again.');
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [initialize, navigate]);

  const handleSetPassword = async () => {
    if (!passwordOk || saving) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErrorMsg(error.message);
      setState('error');
    }
    // USER_UPDATED event fires → onAuthStateChange handles navigation
    setSaving(false);
  };

  const passwordOk = password.length >= 8 && password === confirm;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ background: '#0A0A0C' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <span className="w-8 h-8 rounded-lg bg-[#C9A96E] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#08080A]" />
          </span>
          <span className="text-sm font-medium text-[#F0EDE8]">Hypnotic</span>
        </div>

        {/* Loading */}
        {state === 'loading' && (
          <div className="text-center space-y-4 py-8">
            <div className="w-8 h-8 border-2 border-white/10 border-t-[#C9A96E] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#555]">Verifying your link…</p>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div className="text-center space-y-5 py-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-light text-[#F0EDE8] mb-2">Link issue</h2>
              <p className="text-sm text-[#555] leading-relaxed">{errorMsg}</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Back to login
            </button>
          </div>
        )}

        {/* Set new password */}
        {state === 'reset_password' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-light text-[#F0EDE8] mb-1">Set new password</h2>
              <p className="text-sm text-[#555]">Choose a strong password for your Hypnotic account.</p>
            </div>

            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  autoFocus
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888]"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
                <input
                  type={show ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Same as above"
                  onKeyDown={e => e.key === 'Enter' && passwordOk && handleSetPassword()}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors"
                />
              </div>
              {confirm && password !== confirm && (
                <p className="text-[11px] text-red-400 mt-1">Passwords don't match</p>
              )}
              {confirm && password === confirm && password.length >= 8 && (
                <p className="text-[11px] text-[#7abf8e] mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>

            <button
              onClick={handleSetPassword}
              disabled={!passwordOk || saving}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#08080A]/30 border-t-[#08080A] rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                'Set password & sign in'
              )}
            </button>
          </div>
        )}

        {/* Success */}
        {state === 'reset_done' && (
          <div className="text-center space-y-4 py-8">
            <div className="w-12 h-12 rounded-full bg-[#7abf8e]/15 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-[#7abf8e]" />
            </div>
            <h2 className="text-xl font-light text-[#F0EDE8]">Password updated</h2>
            <p className="text-sm text-[#555]">Taking you to the dashboard…</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Create user_profiles row for manually-added Supabase auth users
async function ensureProfile(userId: string, email: string) {
  try {
    const { data } = await (supabase as any)
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (!data) {
      await (supabase as any).from('user_profiles').insert({
        id:       userId,
        email,
        name:     email.split('@')[0],
        role:     'admin',
        plan:     'pro',
        credits:  500,
        onboarded: true,
      });
      await (supabase as any).from('user_subscriptions').insert({
        user_id: userId, plan: 'pro', status: 'active', generation_credits: 500,
      });
    }
  } catch { /* non-critical */ }
}
