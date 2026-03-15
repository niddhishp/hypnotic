import { MarketingLayout, proseStyles as s } from './MarketingLayout';
import { SEO } from '@/components/shared/SEO';

export function CookiesPage() {
  return (
    <MarketingLayout eyebrow="Legal" title="Cookie Policy" lastUpdated="March 15, 2026"
      subtitle="We use cookies minimally — only what's required for the platform to function.">
      <SEO title="Cookie Policy" description="Hypnotic's cookie policy — we only use essential cookies." canonical="/cookies" />

      <h2 className={s.h2}>Cookies we use</h2>
      <div className="rounded-2xl border border-white/6 overflow-hidden mb-8">
        <div className="grid grid-cols-3 px-4 py-2.5 border-b border-white/6 bg-white/3">
          <span className="text-[11px] text-[#444] uppercase tracking-wider">Cookie</span>
          <span className="text-[11px] text-[#444] uppercase tracking-wider">Purpose</span>
          <span className="text-[11px] text-[#444] uppercase tracking-wider">Duration</span>
        </div>
        {[
          { name: 'sb-access-token',  purpose: 'Authentication session token', duration: '1 hour' },
          { name: 'sb-refresh-token', purpose: 'Refreshes authentication session', duration: '30 days' },
          { name: 'hypnotic-auth',    purpose: 'Cached user profile for faster load', duration: 'Session' },
        ].map((c, i) => (
          <div key={i} className="grid grid-cols-3 px-4 py-3 border-b border-white/4 last:border-0">
            <code className="text-xs text-[#C9A96E] font-mono">{c.name}</code>
            <span className="text-xs text-[#555]">{c.purpose}</span>
            <span className="text-xs text-[#555]">{c.duration}</span>
          </div>
        ))}
      </div>

      <h2 className={s.h2}>What we don't use</h2>
      <ul className={s.ul}>
        {['No advertising cookies', 'No third-party tracking pixels', 'No analytics cookies (we use server-side analytics only)', 'No social media tracking cookies'].map((item, i) => (
          <li key={i} className={s.li}><span className="text-[#7abf8e]">✓</span><span>{item}</span></li>
        ))}
      </ul>

      <h2 className={s.h2}>Managing cookies</h2>
      <p className={s.p}>All cookies we set are strictly necessary for Hypnotic to function. Disabling them will prevent you from logging in and using the platform.</p>
      <p className={s.p}>Questions? Email <a href="mailto:privacy@hypnotic.ai" className={s.a}>privacy@hypnotic.ai</a></p>
    </MarketingLayout>
  );
}
