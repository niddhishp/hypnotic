import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { useAuthStore } from '@/store';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

type Role    = 'creator' | 'agency';
type UseCase = 'advertising' | 'film' | 'social' | 'brand' | 'other';

const ROLES: { id: Role; label: string; desc: string; emoji: string }[] = [
  { id: 'creator', label: 'Independent Creator', desc: 'Filmmaker, content creator, freelance creative', emoji: '🎬' },
  { id: 'agency',  label: 'Agency / Brand Team',  desc: 'Ad agency, in-house creative, marketing team',  emoji: '🏢' },
];

const USE_CASES: { id: UseCase; label: string; emoji: string }[] = [
  { id: 'advertising', label: 'Advertising & Campaigns', emoji: '📣' },
  { id: 'film',        label: 'Film & Video Production', emoji: '🎥' },
  { id: 'social',      label: 'Social Media Content',    emoji: '📱' },
  { id: 'brand',       label: 'Brand Strategy',          emoji: '⚡' },
  { id: 'other',       label: 'Something else',          emoji: '✨' },
];

export function OnboardPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFinish = async () => {
    if (!role || !useCase || !user) return;
    setIsSaving(true);

    try {
      // Persist to Supabase
      await (supabase as any).from('user_profiles').update({
        role,
        use_case: useCase,
        onboarded: true,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);

      // Update local store
      await updateUser({ role });

      // Create first project automatically
      await (supabase as any).from('projects').insert({
        user_id: user.id,
        name: `${user.name}'s First Project`,
        status: 'active',
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('[onboard] failed to save:', err);
      // Still navigate — they can update profile later
      navigate('/dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0A0A0C' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-[#C9A96E] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#08080A]" />
          </div>
          <span className="text-lg font-medium text-[#F0EDE8]">Hypnotic</span>
        </div>

        {/* Step header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-[#F0EDE8] mb-2">
            {step === 1 ? 'Welcome. Who are you?' : 'What do you create?'}
          </h1>
          <p className="text-sm text-[#555]">
            {step === 1 ? 'This helps us personalise your first pipeline' : 'We\'ll set up the right modules for you'}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={cn('flex-1 h-1 rounded-full transition-all',
              s <= step ? 'bg-[#C9A96E]' : 'bg-white/8'
            )} />
          ))}
        </div>

        {step === 1 ? (
          <div className="space-y-3">
            {ROLES.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)}
                className={cn('w-full text-left p-4 rounded-2xl border transition-all',
                  role === r.id ? 'border-[#C9A96E] bg-[#C9A96E]/8' : 'border-white/8 hover:border-white/20'
                )}
                style={{ background: role === r.id ? undefined : '#0D0D10' }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{r.emoji}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#F0EDE8]">{r.label}</div>
                    <div className="text-xs text-[#555] mt-0.5">{r.desc}</div>
                  </div>
                  {role === r.id && (
                    <div className="w-5 h-5 rounded-full bg-[#C9A96E] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#08080A]" />
                    </div>
                  )}
                </div>
              </button>
            ))}

            <button onClick={() => role && setStep(2)} disabled={!role}
              className="w-full flex items-center justify-center gap-2 mt-4 py-3.5 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {USE_CASES.map(uc => (
                <button key={uc.id} onClick={() => setUseCase(uc.id)}
                  className={cn('text-left p-4 rounded-2xl border transition-all',
                    useCase === uc.id ? 'border-[#C9A96E] bg-[#C9A96E]/8' : 'border-white/8 hover:border-white/20'
                  )}
                  style={{ background: useCase === uc.id ? undefined : '#0D0D10' }}>
                  <div className="text-xl mb-1">{uc.emoji}</div>
                  <div className="text-xs font-medium text-[#F0EDE8] leading-snug">{uc.label}</div>
                  {useCase === uc.id && (
                    <div className="w-4 h-4 rounded-full bg-[#C9A96E] flex items-center justify-center mt-1.5">
                      <Check className="w-2.5 h-2.5 text-[#08080A]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(1)}
                className="flex-1 py-3 border border-white/10 rounded-xl text-sm text-[#777] hover:border-white/20 hover:text-[#F0EDE8] transition-all">
                Back
              </button>
              <button onClick={handleFinish} disabled={!useCase || isSaving}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all">
                {isSaving
                  ? <><div className="w-4 h-4 border-2 border-[#08080A]/30 border-t-[#08080A] rounded-full animate-spin" />Setting up…</>
                  : <><Sparkles className="w-4 h-4" />Enter Hypnotic</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
