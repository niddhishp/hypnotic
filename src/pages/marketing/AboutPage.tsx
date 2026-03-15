import { MarketingLayout, proseStyles as s } from './MarketingLayout';
import { SEO } from '@/components/shared/SEO';
import { Link } from 'react-router-dom';

const TEAM = [
  { name: 'Niddhish P', role: 'Founder & CEO', bio: 'Built ReputeOS. Advertising industry veteran. Obsessed with creative workflow.' },
];

const VALUES = [
  { title: 'Creative first', desc: 'Every product decision starts with the creative professional, not the algorithm.' },
  { title: 'End-to-end or nothing', desc: 'Fragmented tools create fragmented thinking. We build the whole pipeline.' },
  { title: 'Human + AI', desc: 'AI handles the heavy lifting. Humans provide the creative intelligence. Neither alone is enough.' },
  { title: 'Premium, always', desc: 'The tools used by the best creative minds in the world should feel like it.' },
];

export function AboutPage() {
  return (
    <MarketingLayout
      eyebrow="Company"
      title="About Hypnotic"
      subtitle="We're building the operating system for the next generation of creative professionals."
    >
      <SEO title="About" description="Hypnotic is an AI creative operating system built for advertising professionals, filmmakers, and brand strategists." canonical="/about" />

      <h2 className={s.h2}>Our story</h2>
      <p className={s.p}>
        Hypnotic started from a simple frustration: creative professionals were spending 40% of their time
        switching between 5–7 disconnected tools instead of actually creating. Research in one place, strategy in another,
        generation scattered across a dozen apps, publishing in yet another.
      </p>
      <p className={s.p}>
        We built Hypnotic to collapse that. One pipeline. Insight → Manifest → Craft → Amplify.
        Every module feeds the next. The AI does the heavy lifting. You stay in the creative seat.
      </p>
      <p className={s.p}>
        Built on lessons from shipping ReputeOS — a production AI SaaS platform —
        Hypnotic is engineered for real creative work at scale, not demos.
      </p>

      <hr className={s.hr} />

      <h2 className={s.h2}>What we believe</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {VALUES.map(v => (
          <div key={v.title} className="p-5 rounded-2xl border border-white/6" style={{ background: '#0D0D10' }}>
            <h3 className="text-sm font-medium text-[#C9A96E] mb-2">{v.title}</h3>
            <p className="text-xs text-[#555] leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      <hr className={s.hr} />

      <h2 className={s.h2}>The team</h2>
      <div className="space-y-4 mb-10">
        {TEAM.map(member => (
          <div key={member.name} className="flex items-start gap-4 p-5 rounded-2xl border border-white/6" style={{ background: '#0D0D10' }}>
            <div className="w-10 h-10 rounded-full bg-[#C9A96E]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-[#C9A96E]">{member.name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#F0EDE8]">{member.name}</p>
              <p className="text-xs text-[#C9A96E] mb-1">{member.role}</p>
              <p className="text-xs text-[#555] leading-relaxed">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>

      <hr className={s.hr} />

      <h2 className={s.h2}>Join us</h2>
      <p className={s.p}>We're hiring. If you're obsessed with creative tools, AI systems, and building things that professionals actually use every day, <Link to="/careers" className={s.a}>see open roles</Link>.</p>
      <p className={s.p}>Questions? <Link to="/contact" className={s.a}>Get in touch</Link>.</p>
    </MarketingLayout>
  );
}
