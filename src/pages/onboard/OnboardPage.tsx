import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';

type UserRole = 'creator' | 'agency';
type UseCase = 'advertising' | 'film' | 'social' | 'brand' | 'other';

const ROLES: { id: UserRole; label: string; description: string }[] = [
  { id: 'creator',  label: 'Independent Creator', description: 'Filmmaker, content creator, freelance creative' },
  { id: 'agency',   label: 'Agency / Brand Team',  description: 'Ad agency, in-house creative, marketing team'  },
];

const USE_CASES: { id: UseCase; label: string }[] = [
  { id: 'advertising', label: 'Advertising & Campaigns' },
  { id: 'film',        label: 'Film & Video Production' },
  { id: 'social',      label: 'Social Media Content'    },
  { id: 'brand',       label: 'Brand Strategy'          },
  { id: 'other',       label: 'Something else'          },
];

export function OnboardPage() {
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFinish = async () => {
    if (!selectedRole || !selectedUseCase) return;
    setIsSaving(true);
    try {
      // TODO: Persist role & use_case to user_profiles table via Supabase
      updateUser({ role: selectedRole });
      navigate('/dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-12 text-center">
        <h1 className="text-2xl font-semibold text-[#F6F6F6] tracking-tight">hypnotic</h1>
        <p className="text-sm text-[#666] mt-1">AI Creative Operating System</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-10">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
              step > s ? 'bg-[#D8A34A] text-[#0B0B0D]' :
              step === s ? 'border-2 border-[#D8A34A] text-[#D8A34A]' :
              'border border-white/20 text-[#666]'
            }`}>
              {step > s ? <Check className="w-3.5 h-3.5" /> : s}
            </div>
            {s < 2 && <div className={`w-16 h-px ${step > s ? 'bg-[#D8A34A]' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#F6F6F6] mb-2">How do you work?</h2>
              <p className="text-sm text-[#A7A7A7]">This helps us tailor your experience from day one.</p>
            </div>
            <div className="space-y-3">
              {ROLES.map((r) => (
                <button key={r.id} onClick={() => setSelectedRole(r.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${
                    selectedRole === r.id
                      ? 'border-[#D8A34A] bg-[#D8A34A]/5'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#F6F6F6]">{r.label}</p>
                      <p className="text-xs text-[#A7A7A7] mt-0.5">{r.description}</p>
                    </div>
                    {selectedRole === r.id && (
                      <div className="w-5 h-5 rounded-full bg-[#D8A34A] flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#0B0B0D]" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <Button onClick={() => setStep(2)} disabled={!selectedRole}
              className="w-full bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D] font-medium h-12">
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#F6F6F6] mb-2">What's your main focus?</h2>
              <p className="text-sm text-[#A7A7A7]">We'll surface the most relevant tools and examples.</p>
            </div>
            <div className="space-y-2">
              {USE_CASES.map((u) => (
                <button key={u.id} onClick={() => setSelectedUseCase(u.id)}
                  className={`w-full px-4 py-3.5 rounded-xl text-left transition-all border text-sm ${
                    selectedUseCase === u.id
                      ? 'border-[#D8A34A] bg-[#D8A34A]/5 text-[#F6F6F6] font-medium'
                      : 'border-white/10 bg-white/5 text-[#A7A7A7] hover:border-white/20 hover:text-[#F6F6F6]'
                  }`}>
                  <div className="flex items-center justify-between">
                    {u.label}
                    {selectedUseCase === u.id && (
                      <Check className="w-4 h-4 text-[#D8A34A]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}
                className="flex-1 border-white/10 text-[#A7A7A7] hover:bg-white/5 h-12">
                Back
              </Button>
              <Button onClick={handleFinish} disabled={!selectedUseCase || isSaving}
                className="flex-[2] bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D] font-medium h-12">
                {isSaving ? 'Saving…' : 'Enter Hypnotic'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
