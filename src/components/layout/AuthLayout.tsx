import { Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex" style={{ background: '#0A0A0C' }}>
      {/* Left: form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-[#C9A96E] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#08080A]" />
            </div>
            <span className="text-base font-medium text-[#F0EDE8] tracking-wide">Hypnotic</span>
          </div>

          {/* Page content */}
          <Outlet />
        </div>
      </div>

      {/* Right: brand panel */}
      <div className="hidden lg:flex w-[480px] flex-col justify-between p-12 border-l border-white/6"
        style={{ background: '#0D0D10' }}>
        <div>
          <div className="text-[10px] text-[#C9A96E] uppercase tracking-[0.15em] mb-6">
            Insight → Manifest → Craft → Amplify
          </div>
          <h2 className="text-3xl font-light text-[#F0EDE8] leading-snug mb-4">
            The AI Creative<br />Operating System
          </h2>
          <p className="text-sm text-[#555] leading-relaxed max-w-xs">
            Research brands, build strategy decks, generate video and images,
            publish across every platform — in a single connected pipeline.
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-4">
          {[
            { label: 'Insight', desc: 'AI-powered brand research & strategy' },
            { label: 'Manifest', desc: 'Strategy decks, scripts & campaigns' },
            { label: 'Craft', desc: 'AI video, images, audio & social content' },
            { label: 'Amplify', desc: 'Schedule & publish across 6 platforms' },
          ].map(f => (
            <div key={f.label} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] mt-2 flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-[#C0B8AC]">{f.label}</span>
                <span className="text-xs text-[#444] ml-2">{f.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-[#333]">
          TAM: $12.8B · 2.3M creative professionals
        </div>
      </div>
    </div>
  );
}
