import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Sparkles, AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { useAuthStore } from '@/store';
import { supabase } from '@/lib/supabase/client';
import { getAppBaseUrl } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/shared/SEO';

type Mode = 'password' | 'magic' | 'forgot';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithMagicLink, isLoading, error, clearError } = useAuthStore();

  const [mode, setMode]             = useState<Mode>('password');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPw]   = useState(false);
  const [magicSent, setMagicSent]   = useState(false);
  const [resetSent, setResetSent]   = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [localError, setLocalError]   = useState('');

  const changeMode = (m: Mode) => { setMode(m); clearError(); setMagicSent(false); setResetSent(false); setLocalError(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (mode === 'magic') {
      const { error: err } = await loginWithMagicLink(email);
      if (!err) setMagicSent(true);
      return;
    }

    if (mode === 'forgot') {
      setResetLoading(true);
      setLocalError('');
      try {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${getAppBaseUrl()}/auth/callback`,
        });
        if (err) {
          // Most common: "For security purposes, you can only request this once every 60 seconds"
          setLocalError(
            err.message.includes('60 seconds')
              ? 'Please wait 60 seconds before requesting another reset email.'
              : err.message
          );
        } else {
          setResetSent(true);
        }
      } catch (err: any) {
        setLocalError(err?.message ?? 'Failed to send reset email. Please try again.');
      } finally {
        setResetLoading(false);
      }
      return;
    }

    const { error: err } = await login(email, password);
    if (!err) navigate('/dashboard');
  };

  const handleGoogle = async () => {
    clearError();
    await loginWithGoogle();
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors";

  return (
    <div className="space-y-6">
      <SEO title="Sign In" description="Sign in to your Hypnotic workspace." canonical="/login" />

      {/* ── Header ── */}
      <div className="text-center">
        {mode === 'forgot' ? (
          <>
            <h1 className="text-2xl font-light text-[#F0EDE8] mb-1">Reset your password</h1>
            <p className="text-sm text-[#555]">We'll send a reset link to your email</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-light text-[#F0EDE8] mb-1">Welcome back</h1>
            <p className="text-sm text-[#555]">Sign in to your Hypnotic workspace</p>
          </>
        )}
      </div>

      {/* ── Google OAuth (not on forgot) ── */}
      {mode !== 'forgot' && (
        <>
          <button type="button" onClick={handleGoogle} disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/10 bg-white/4 text-sm text-[#C0B8AC] hover:bg-white/8 hover:border-white/20 transition-all disabled:opacity-50">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-[#444]">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/8">
            {(['password', 'magic'] as const).map(m => (
              <button key={m} type="button" onClick={() => changeMode(m)}
                className={cn('flex-1 py-2 rounded-lg text-xs font-medium transition-all',
                  mode === m ? 'bg-[#C9A96E] text-[#08080A]' : 'text-[#666] hover:text-[#999]'
                )}>
                {m === 'magic' ? 'Magic Link' : 'Password'}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Error ── */}
      {(error || localError) && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{localError || error}
        </div>
      )}

      {/* ── Sent confirmations ── */}
      {(magicSent || resetSent) ? (
        <div className="text-center py-6 space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#7abf8e]/15 flex items-center justify-center mx-auto">
            <Check className="w-5 h-5 text-[#7abf8e]" />
          </div>
          <p className="text-sm font-medium text-[#F0EDE8]">
            {resetSent ? 'Reset email sent' : 'Magic link sent'}
          </p>
          <p className="text-xs text-[#555] leading-relaxed">
            Check <span className="text-[#C9A96E]">{email}</span><br />
            {resetSent ? 'Click the link to set a new password.' : 'Click the link to sign in.'}
          </p>
          {mode === 'forgot' && (
            <button onClick={() => changeMode('password')}
              className="flex items-center gap-1.5 text-xs text-[#C9A96E] hover:text-[#e5c485] transition-colors mx-auto">
              <ArrowLeft className="w-3 h-3" /> Back to login
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={`${inputClass} pl-10 pr-4 py-3`} />
            </div>
          </div>

          {/* Password field (password mode only) */}
          {mode === 'password' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] text-[#555] uppercase tracking-wider">Password</label>
                <button type="button" onClick={() => changeMode('forgot')}
                  className="text-[11px] text-[#444] hover:text-[#C9A96E] transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
                <input type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className={`${inputClass} pl-10 pr-10 py-3`} />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit */}
          <button type="submit"
            disabled={isLoading || resetLoading || !email || (mode === 'password' && !password)}
            className="w-full flex items-center justify-center gap-2 bg-[#C9A96E] text-[#08080A] py-3 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all">
            {(isLoading || resetLoading) ? (
              <><div className="w-4 h-4 border-2 border-[#08080A]/30 border-t-[#08080A] rounded-full animate-spin" />
                {mode === 'forgot' ? 'Sending…' : mode === 'magic' ? 'Sending…' : 'Signing in…'}</>
            ) : (
              <><Sparkles className="w-4 h-4" />
                {mode === 'forgot' ? 'Send reset email' : mode === 'magic' ? 'Send magic link' : 'Sign in'}</>
            )}
          </button>

          {/* Back from forgot */}
          {mode === 'forgot' && (
            <button type="button" onClick={() => changeMode('password')}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-[#444] hover:text-[#888] transition-colors py-1">
              <ArrowLeft className="w-3 h-3" /> Back to login
            </button>
          )}
        </form>
      )}

      <p className="text-center text-xs text-[#555]">
        No account?{' '}
        <Link to="/signup" className="text-[#C9A96E] hover:text-[#e5c485] transition-colors">
          Create one free
        </Link>
      </p>
    </div>
  );
}
