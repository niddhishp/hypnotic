// src/pages/auth/AuthCallbackPage.tsx
// Handles Supabase OAuth + magic link callbacks
// Route: /auth/callback

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/store';
import { Sparkles, AlertCircle } from 'lucide-react';

export function AuthCallbackPage() {
  const navigate  = useNavigate();
  const { initialize } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function handleCallback() {
      // Parse hash/query params from URL
      const hashParams   = new URLSearchParams(window.location.hash.substring(1));
      const searchParams = new URLSearchParams(window.location.search);

      const error             = hashParams.get('error') || searchParams.get('error');
      const errorDescription  = hashParams.get('error_description') || searchParams.get('error_description');
      const code              = searchParams.get('code');

      // Handle errors from Supabase
      if (error) {
        const msg =
          error === 'access_denied' && errorDescription?.includes('expired')
            ? 'This magic link has expired. Please request a new one — links expire after 1 hour.'
            : errorDescription?.replace(/\+/g, ' ') ?? 'Authentication failed. Please try again.';
        setErrorMsg(msg);
        setStatus('error');
        return;
      }

      // Handle PKCE code exchange (magic link / OAuth)
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setErrorMsg(exchangeError.message);
          setStatus('error');
          return;
        }
      }

      // Re-initialize auth state then redirect
      await initialize();

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user needs onboarding
        const { data: profile } = await (supabase as any)
          .from('user_profiles')
          .select('onboarded')
          .eq('id', session.user.id)
          .single();

        navigate(profile?.onboarded ? '/dashboard' : '/onboard', { replace: true });
      } else {
        setErrorMsg('Could not establish session. Please try logging in again.');
        setStatus('error');
      }
    }

    handleCallback();
  }, [initialize, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ background: '#0A0A0C' }}
    >
      <div className="text-center space-y-6 max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <span className="w-9 h-9 rounded-xl bg-[#C9A96E] flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-[#08080A]" />
          </span>
          <span className="text-base font-medium text-[#F0EDE8]">Hypnotic</span>
        </div>

        {status === 'loading' ? (
          <>
            <div className="w-8 h-8 border-2 border-white/10 border-t-[#C9A96E] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#555]">Signing you in…</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-light text-[#F0EDE8] mb-2">Sign-in failed</h2>
              <p className="text-sm text-[#555] leading-relaxed">{errorMsg}</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
