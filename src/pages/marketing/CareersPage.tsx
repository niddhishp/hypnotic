import { MarketingLayout, proseStyles as s } from './MarketingLayout';
import { SEO } from '@/components/shared/SEO';
import { Link } from 'react-router-dom';

const ROLES = [
  { title: 'Senior Full-Stack Engineer', team: 'Engineering', location: 'Remote / Mumbai', type: 'Full-time' },
  { title: 'AI Systems Engineer', team: 'AI Platform', location: 'Remote', type: 'Full-time' },
  { title: 'Product Designer', team: 'Design', location: 'Remote / Mumbai', type: 'Full-time' },
  { title: 'Creative Strategist (Agency)', team: 'Product', location: 'Remote', type: 'Part-time / Advisor' },
];

export function CareersPage() {
  return (
    <MarketingLayout eyebrow="Careers" title="Work at Hypnotic"
      subtitle="We're a small team building tools used by creative professionals every day. Every role has leverage.">
      <SEO title="Careers" description="Join Hypnotic. We're hiring engineers, designers, and creative strategists who want to build the future of creative work." canonical="/careers" />

      <h2 className={s.h2}>Why Hypnotic</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { title: 'Real product', desc: 'Shipped and used by professionals daily. Not a prototype.' },
          { title: 'Full leverage', desc: 'Small team. Every person\'s work is visible and impactful.' },
          { title: 'Remote-first', desc: 'Work from anywhere. We care about output, not office hours.' },
        ].map(v => (
          <div key={v.title} className="p-5 rounded-2xl border border-white/6" style={{ background: '#0D0D10' }}>
            <p className="text-sm font-medium text-[#C9A96E] mb-1">{v.title}</p>
            <p className="text-xs text-[#555] leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      <h2 className={s.h2}>Open roles</h2>
      <div className="space-y-3 mb-10">
        {ROLES.map(role => (
          <div key={role.title} className="flex items-center justify-between p-5 rounded-2xl border border-white/6 hover:border-white/15 transition-all" style={{ background: '#0D0D10' }}>
            <div>
              <p className="text-sm font-medium text-[#F0EDE8]">{role.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] text-[#555]">{role.team}</span>
                <span className="text-[11px] text-[#333]">·</span>
                <span className="text-[11px] text-[#555]">{role.location}</span>
                <span className="text-[11px] text-[#333]">·</span>
                <span className="text-[11px] text-[#C9A96E]/70">{role.type}</span>
              </div>
            </div>
            <Link to="/contact" className="text-xs text-[#C9A96E] hover:text-[#e5c485] transition-colors">Apply →</Link>
          </div>
        ))}
      </div>

      <p className={s.p}>Don't see a fit? Send a note anyway — <Link to="/contact" className={s.a}>contact us</Link>.</p>
    </MarketingLayout>
  );
}
