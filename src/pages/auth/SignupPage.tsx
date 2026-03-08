import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'creator' as 'creator' | 'agency',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signup(formData.email, formData.password, formData.name, formData.role);
    setIsLoading(false);
    
    if (!error) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[#F6F6F6] mb-2">
          Create your account
        </h2>
        <p className="text-sm text-[#A7A7A7]">
          Start creating campaigns that feel inevitable
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          step >= 1 ? 'bg-[#D8A34A] text-[#0B0B0D]' : 'bg-white/10 text-[#A7A7A7]'
        }`}>
          1
        </div>
        <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-[#D8A34A]' : 'bg-white/10'}`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          step >= 2 ? 'bg-[#D8A34A] text-[#0B0B0D]' : 'bg-white/10 text-[#A7A7A7]'
        }`}>
          2
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormData({ ...formData, role: 'creator' })}
              className={`p-4 border rounded-xl text-left transition-all ${
                formData.role === 'creator'
                  ? 'border-[#D8A34A] bg-[#D8A34A]/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-sm font-medium text-[#F6F6F6] mb-1">Creator</div>
              <div className="text-xs text-[#A7A7A7]">Individual creators and freelancers</div>
            </button>
            <button
              onClick={() => setFormData({ ...formData, role: 'agency' })}
              className={`p-4 border rounded-xl text-left transition-all ${
                formData.role === 'agency'
                  ? 'border-[#D8A34A] bg-[#D8A34A]/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-sm font-medium text-[#F6F6F6] mb-1">Agency</div>
              <div className="text-xs text-[#A7A7A7]">Teams and agencies</div>
            </button>
          </div>

          <Button
            onClick={() => setStep(2)}
            className="w-full bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D] font-medium py-3 h-12"
          >
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#A7A7A7] mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F6F6F6] placeholder:text-[#666] focus:outline-none focus:border-[#D8A34A]/50 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#A7A7A7] mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F6F6F6] placeholder:text-[#666] focus:outline-none focus:border-[#D8A34A]/50 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#A7A7A7] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F6F6F6] placeholder:text-[#666] focus:outline-none focus:border-[#D8A34A]/50 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#A7A7A7]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-[#666]">Must be at least 8 characters</p>
          </div>

          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5" required />
            <span className="text-sm text-[#A7A7A7]">
              I agree to the{' '}
              <Link to="/terms" className="text-[#D8A34A] hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-[#D8A34A] hover:underline">Privacy Policy</Link>
            </span>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => setStep(1)}
              variant="outline"
              className="flex-1 border-white/10 text-[#F6F6F6] hover:bg-white/5"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D] font-medium py-3 h-12"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </div>
        </form>
      )}

      <p className="text-center text-sm text-[#A7A7A7]">
        Already have an account?{' '}
        <Link to="/login" className="text-[#D8A34A] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
