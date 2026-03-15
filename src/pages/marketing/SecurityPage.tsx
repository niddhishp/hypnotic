import { MarketingLayout, proseStyles as s } from './MarketingLayout';
import { SEO } from '@/components/shared/SEO';
import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';

const PRACTICES = [
  { icon: Lock, title: 'Encryption everywhere', desc: 'All data encrypted in transit (TLS 1.3) and at rest (AES-256). Database encrypted at the volume level.' },
  { icon: Shield, title: 'Row-level security', desc: 'Database enforces per-user data isolation at the Postgres level. You can only ever read your own data — even if our application layer had a bug.' },
  { icon: Eye, title: 'Secret management', desc: 'API keys stored as environment secrets via Supabase Vault and Vercel Secure Environment Variables. Never in code or logs.' },
  { icon: AlertTriangle, title: 'Rate limiting', desc: 'All API endpoints rate-limited per user. AI generation endpoints have concurrency limits to prevent abuse.' },
];

export function SecurityPage() {
  return (
    <MarketingLayout eyebrow="Security" title="Security at Hypnotic"
      subtitle="How we protect your data, your account, and your creative work.">
      <SEO title="Security" description="Hypnotic's security practices — encryption, access controls, and responsible disclosure." canonical="/security" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {PRACTICES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="p-5 rounded-2xl border border-white/6" style={{ background: '#0D0D10' }}>
            <Icon className="w-5 h-5 text-[#C9A96E] mb-3" />
            <h3 className="text-sm font-medium text-[#F0EDE8] mb-2">{title}</h3>
            <p className="text-xs text-[#555] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <h2 className={s.h2}>Infrastructure</h2>
      <ul className={s.ul}>
        {[
          'Hosted on Vercel (SOC 2 Type II certified) and Supabase (SOC 2 compliant)',
          'Automatic HTTPS with HSTS preload',
          'Content Security Policy headers configured — no unsafe-eval',
          'Regular dependency vulnerability scanning via npm audit',
          'Supabase Row Level Security enabled on all 14 database tables',
          'OAuth tokens encrypted before storage using Supabase Vault',
        ].map((item, i) => (
          <li key={i} className={s.li}><span className="text-[#C9A96E]">·</span><span>{item}</span></li>
        ))}
      </ul>

      <h2 className={s.h2}>Responsible disclosure</h2>
      <p className={s.p}>Found a security vulnerability? We appreciate responsible disclosure. Please email <a href="mailto:security@hypnotic.ai" className={s.a}>security@hypnotic.ai</a> with:</p>
      <ul className={s.ul}>
        {['A description of the vulnerability', 'Steps to reproduce', 'Potential impact', 'Any proof of concept (screenshots, logs)'].map((item, i) => (
          <li key={i} className={s.li}><span className="text-[#C9A96E]">·</span><span>{item}</span></li>
        ))}
      </ul>
      <p className={s.p}>We will respond within 48 hours, keep you updated on remediation, and credit you publicly if you wish.</p>
      <p className={s.p}>Please do not publicly disclose until we have addressed the issue.</p>
    </MarketingLayout>
  );
}
