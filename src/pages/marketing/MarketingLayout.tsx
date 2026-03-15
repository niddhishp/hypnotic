// Shared layout for all marketing/legal pages
import { type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface MarketingLayoutProps {
  children: ReactNode;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  lastUpdated?: string;
}

export function MarketingLayout({ children, eyebrow, title, subtitle, lastUpdated }: MarketingLayoutProps) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen" style={{ background: '#0A0A0C', color: '#F0EDE8' }}>
      {/* Nav */}
      <nav className="border-b border-white/6 px-6 h-14 flex items-center justify-between" style={{ background: '#0D0D10' }}>
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <span className="w-7 h-7 rounded-lg bg-[#C9A96E] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#08080A]" />
          </span>
          <span className="text-sm font-medium text-[#F0EDE8]">Hypnotic</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-[#555]">
          <Link to="/login" className="hover:text-[#F0EDE8] transition-colors">Sign in</Link>
          <Link to="/signup" className="px-4 py-1.5 bg-[#C9A96E] text-[#08080A] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="border-b border-white/6 px-6 py-16 text-center" style={{ background: '#0D0D10' }}>
        <div className="max-w-2xl mx-auto">
          {eyebrow && (
            <p className="text-[11px] text-[#C9A96E] uppercase tracking-[0.15em] font-medium mb-4">{eyebrow}</p>
          )}
          <h1 className="text-4xl font-light text-[#F0EDE8] mb-4 tracking-tight">{title}</h1>
          {subtitle && <p className="text-base text-[#555] leading-relaxed">{subtitle}</p>}
          {lastUpdated && <p className="text-xs text-[#333] mt-4">Last updated {lastUpdated}</p>}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs text-[#444] hover:text-[#888] transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <article className="prose-hypnotic">
          {children}
        </article>
      </main>

      {/* Footer */}
      <FooterStrip />
    </div>
  );
}

export function FooterStrip() {
  return (
    <footer className="border-t border-white/6 px-6 py-8 mt-16" style={{ background: '#0D0D10' }}>
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-[#444]">
        <span>© 2026 Hypnotic. All rights reserved.</span>
        <div className="flex flex-wrap gap-4">
          {[
            ['Privacy', '/privacy'], ['Terms', '/terms'], ['Cookies', '/cookies'],
            ['Security', '/security'], ['Contact', '/contact'],
          ].map(([label, href]) => (
            <Link key={href} to={href} className="hover:text-[#888] transition-colors">{label}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

// Prose styles — applied via classNames
export const proseStyles = {
  h2: 'text-xl font-medium text-[#F0EDE8] mt-12 mb-4 first:mt-0',
  h3: 'text-base font-medium text-[#C0B8AC] mt-8 mb-3',
  p:  'text-sm text-[#666] leading-relaxed mb-4',
  ul: 'space-y-2 mb-6',
  li: 'text-sm text-[#666] flex gap-2 leading-relaxed',
  a:  'text-[#C9A96E] hover:text-[#e5c485] transition-colors underline-offset-2',
  hr: 'border-white/6 my-10',
};
