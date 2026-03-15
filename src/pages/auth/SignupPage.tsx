import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, AlertCircle, Check } from 'lucide-react';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const ROLES = [
  { id: 'creator', label: 'Independent Creator', desc: 'Filmmaker, content creator, freelance creative' },
  { id: 'agency',  label: 'Agency / Brand Team',  desc: 'Ad agency, in-house creative, marketing team'  },
] as const;

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, isLoading, error, clearError } = useAuthStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'creator' as 'creator' | 'agency' });
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);

  const set = (k: keyof typeof form, v: string) => {
    clearError();
    setForm(prev => ({ ...prev, [k]: v }));
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.password.length >= 8) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error: err } = await signup(form.email, form.password, form.name, form.role);
    if (!err) {
      // If email confirmation required, show confirmation screen
      const store = useAuthStore.getState();
      if (store.isAuthenticated) {
        navigate('/onboard');
      } else {
        setConfirmEmailSent(true);
      }
    }
  };

  const handleGoogle = async () => {
    clearError();
    await loginWithGoogle();
  };

  const passwordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8)  score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'][Math.min(strength, 5)];
  const strengthColor = ['', '#e07a7a', '#C9A96E', '#C9A96E', '#7abf8e', '#7abf8e'][Math.min(strength, 5)];

  if (confirmEmailSent) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="text-4xl mb-4">✉️</div>
        <h2 className="text-xl font-light text-[#F0EDE8]">Check your inbox</h2>
        <p className="text-sm text-[#555] max-w-xs mx-auto leading-relaxed">
          We sent a confirmation link to <span className="text-[#C9A96E]">{form.email}</span>.
          Click it to activate your account.
        </p>
        <p className="text-xs text-[#444]">Didn't receive it? Check spam or{' '}
          <button onClick={() => setConfirmEmailSent(false)} className="text-[#C9A96E] hover:underline">try again</button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-light text-[#F0EDE8] mb-1">Start creating</h1>
        <p className="text-sm text-[#555]">Free trial — no credit card required</p>
      </div>

      {/* Google OAuth */}
      <button type="button" onClick={handleGoogle} disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/10 bg-white/4 text-sm text-[#C0B8AC] hover:bg-white/8 hover:border-white/20 transition-all disabled:opacity-50">
        <svg className="w-4 h-4" viewBox="0 0 24 24">
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

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0',
              step > s ? 'bg-[#7abf8e] text-white' : step === s ? 'bg-[#C9A96E] text-[#08080A]' : 'bg-white/8 text-[#444]'
            )}>
              {step > s ? <Check className="w-3 h-3" /> : s}
            </div>
            <span className="text-[10px] text-[#555]">{s === 1 ? 'Your details' : 'Your role'}</span>
            {s < 2 && <div className="flex-1 h-px bg-white/8" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleStep1} className="space-y-4">
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required
                placeholder="Your name"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors" />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
                placeholder="you@agency.com"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors" />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
              <input type={showPassword ? 'text' : 'password'} value={form.password}
                onChange={e => set('password', e.target.value)} required minLength={8}
                placeholder="Min 8 characters"
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="flex-1 h-0.5 rounded-full transition-all"
                      style={{ background: i <= strength ? strengthColor : 'rgba(255,255,255,0.08)' }} />
                  ))}
                </div>
                <span className="text-[10px]" style={{ color: strengthColor }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          <button type="submit"
            disabled={!form.name || !form.email || form.password.length < 8}
            className="w-full py-3 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all">
            Continue →
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider block mb-3">I am a…</label>
            <div className="space-y-2">
              {ROLES.map(r => (
                <button key={r.id} type="button" onClick={() => set('role', r.id)}
                  className={cn('w-full text-left p-4 rounded-xl border transition-all',
                    form.role === r.id ? 'border-[#C9A96E] bg-[#C9A96E]/8' : 'border-white/8 hover:border-white/20'
                  )}>
                  <div className="flex items-center gap-3">
                    <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                      form.role === r.id ? 'border-[#C9A96E]' : 'border-[#444]'
                    )}>
                      {form.role === r.id && <div className="w-2 h-2 rounded-full bg-[#C9A96E]" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#F0EDE8]">{r.label}</div>
                      <div className="text-xs text-[#555]">{r.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)}
              className="flex-1 py-3 border border-white/10 rounded-xl text-sm text-[#777] hover:border-white/20 hover:text-[#F0EDE8] transition-all">
              Back
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all">
              {isLoading
                ? <><div className="w-4 h-4 border-2 border-[#08080A]/30 border-t-[#08080A] rounded-full animate-spin" />Creating…</>
                : <><Sparkles className="w-4 h-4" />Create Account</>}
            </button>
          </div>

          <p className="text-center text-[10px] text-[#444]">
            By creating an account you agree to our Terms of Service
          </p>
        </form>
      )}

      <p className="text-center text-xs text-[#555]">
        Already have an account?{' '}
        <Link to="/login" className="text-[#C9A96E] hover:text-[#e5c485] transition-colors">Sign in</Link>
      </p>
    </div>
  );
}
