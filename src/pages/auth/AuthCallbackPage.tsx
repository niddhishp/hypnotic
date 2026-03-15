// src/pages/auth/AuthCallbackPage.tsx
// Handles ALL Supabase OAuth + magic link + password recovery callbacks

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/store';
import { Sparkles, AlertCircle, Lock, Eye, EyeOff, Check } from 'lucide-react';

type PageState = 'loading' | 'error' | 'reset_password' | 'reset_done';

export function AuthCallbackPage() {
  const navigate  = useNavigate();
  const { initialize } = useAuthStore();
  const [state, setState] = useState<PageState>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [show,     setShow]     = useState(false);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    async function handleCallback() {
      // Parse BOTH hash and query params (Supabase uses both depending on flow)
      const hash         = window.location.hash.substring(1);
      const hashParams   = new URLSearchParams(hash);
      const searchParams = new URLSearchParams(window.location.search);

      const error            = hashParams.get('error')             || searchParams.get('error');
      const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');
      const type             = hashParams.get('type')              || searchParams.get('type');
      const code             = searchParams.get('code');
      const accessToken      = hashParams.get('access_token');
      const refreshToken     = hashParams.get('refresh_token');

      // ── Error from Supabase ────────────────────────────────────────────────
      if (error) {
        const msg =
          error === 'access_denied' && errorDescription?.includes('expired')
            ? 'This link has expired. Recovery links are valid for 1 hour — please request a new one.'
            : errorDescription?.replace(/\+/g, ' ') ?? 'Authentication failed.';
        setErrorMsg(msg);
        setState('error');
        return;
      }

      // ── PKCE code exchange (OAuth flows) ──────────────────────────────────
      if (code) {
        const { error: ex } = await supabase.auth.exchangeCodeForSession(code);
        if (ex) { setErrorMsg(ex.message); setState('error'); return; }
      }

      // ── Hash-fragment token (magic link, recovery) ────────────────────────
      if (accessToken && refreshToken) {
        const { error: se } = await supabase.auth.setSession({
          access_token:  accessToken,
          refresh_token: refreshToken,
        });
        if (se) { setErrorMsg(se.message); setState('error'); return; }
      }

      // ── Recovery flow — show set-password form ─────────────────────────────
      if (type === 'recovery') {
        setState('reset_password');
        return;
      }

      // ── All other flows — reinitialise + redirect ──────────────────────────
      await initialize();
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // Ensure user_profiles row exists (may be missing for manually-added users)
        await ensureProfile(session.user.id, session.user.email ?? '');

        const { data: profile } = await (supabase as any)
          .from('user_profiles')
          .select('onboarded')
          .eq('id', session.user.id)
          .single();

        navigate(profile?.onboarded ? '/dashboard' : '/onboard', { replace: true });
      } else {
        setErrorMsg('Could not establish session. Please try again.');
        setState('error');
      }
    }

    handleCallback();
  }, [initialize, navigate]);

  // ── Set new password handler ──────────────────────────────────────────────
  const handleSetPassword = async () => {
    if (password.length < 8) return;
    if (password !== confirm) return;
    setSaving(true);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setErrorMsg(error.message); setState('error'); return; }

    setState('reset_done');
    await initialize();

    // Get current session to check onboarding
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await ensureProfile(session.user.id, session.user.email ?? '');
      // Wait 2s to show success then navigate
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
    }
  };

  const passwordOk = password.length >= 8 && password === confirm;

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#0A0A0C' }}>
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
            <p className="text-sm text-[#555]">Signing you in…</p>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div className="text-center space-y-5 py-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-light text-[#F0EDE8] mb-2">Sign-in failed</h2>
              <p className="text-sm text-[#555] leading-relaxed">{errorMsg}</p>
            </div>
            <button onClick={() => navigate('/login')}
              className="px-5 py-2.5 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
              Back to login
            </button>
          </div>
        )}

        {/* Set new password */}
        {state === 'reset_password' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-light text-[#F0EDE8] mb-1">Set new password</h2>
              <p className="text-sm text-[#555]">Choose a strong password for your account.</p>
            </div>

            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">New password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
                <input type={show ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors" />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888]">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
                <input type={show ? 'text' : 'password'} value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Same as above"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors" />
              </div>
              {confirm && !passwordOk && (
                <p className="text-[11px] text-red-400 mt-1">Passwords don't match</p>
              )}
            </div>

            <button onClick={handleSetPassword} disabled={!passwordOk || saving}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all">
              {saving
                ? <><div className="w-4 h-4 border-2 border-[#08080A]/30 border-t-[#08080A] rounded-full animate-spin" /> Saving…</>
                : 'Set password & continue'}
            </button>
          </div>
        )}

        {/* Success */}
        {state === 'reset_done' && (
          <div className="text-center space-y-4 py-8">
            <div className="w-12 h-12 rounded-full bg-[#7abf8e]/15 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-[#7abf8e]" />
            </div>
            <h2 className="text-xl font-light text-[#F0EDE8]">Password set</h2>
            <p className="text-sm text-[#555]">Redirecting you to the dashboard…</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Ensure user_profiles row exists for manually-created Supabase auth users
async function ensureProfile(userId: string, email: string) {
  try {
    const { data } = await (supabase as any)
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (!data) {
      // Profile doesn't exist — create it (happens for users added via Auth dashboard)
      await (supabase as any).from('user_profiles').insert({
        id:       userId,
        email,
        name:     email.split('@')[0],
        role:     'admin',       // Manually-added users are likely admins
        plan:     'pro',         // Give full access
        credits:  500,
        onboarded: true,         // Skip onboarding for manual users
      });

      // Also ensure subscription row exists
      await (supabase as any).from('user_subscriptions').insert({
        user_id:            userId,
        plan:               'pro',
        status:             'active',
        generation_credits: 500,
      });
    }
  } catch { /* non-critical */ }
}
