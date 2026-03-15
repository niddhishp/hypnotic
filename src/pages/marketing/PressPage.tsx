import { MarketingLayout, proseStyles as s } from './MarketingLayout';
import { SEO } from '@/components/shared/SEO';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';

export function PressPage() {
  return (
    <MarketingLayout eyebrow="Press" title="Press & Media"
      subtitle="Resources for journalists, analysts, and media covering Hypnotic.">
      <SEO title="Press" description="Press resources, brand assets, and media contacts for Hypnotic." canonical="/press" />

      <h2 className={s.h2}>About Hypnotic</h2>
      <p className={s.p}>
        Hypnotic is an AI creative operating system for advertising, film, and content production.
        The platform moves creative work through four phases — Insight (brand research), Manifest (strategy & scripts),
        Craft (AI generation), and Amplify (publishing) — in a single connected pipeline.
      </p>
      <p className={s.p}>Founded in 2026. Headquartered in Mumbai, India. Available globally.</p>

      <h2 className={s.h2}>Key facts</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { value: '$12.8B', label: 'Addressable market' },
          { value: '2026',   label: 'Founded'           },
          { value: '4',      label: 'Core modules'      },
          { value: '28+',    label: 'AI models'         },
        ].map(stat => (
          <div key={stat.label} className="p-4 rounded-2xl border border-white/6 text-center" style={{ background: '#0D0D10' }}>
            <p className="text-2xl font-light text-[#C9A96E] mb-1">{stat.value}</p>
            <p className="text-[11px] text-[#555]">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className={s.h2}>Brand assets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {[
          { name: 'Logo pack (SVG + PNG)', desc: 'Light and dark variants' },
          { name: 'Brand guidelines PDF', desc: 'Colors, typography, usage rules' },
          { name: 'Product screenshots', desc: 'High-res PNG set' },
          { name: 'Founder headshots', desc: 'Print-quality JPEGs' },
        ].map(asset => (
          <div key={asset.name} className="flex items-center justify-between p-4 rounded-2xl border border-white/6" style={{ background: '#0D0D10' }}>
            <div>
              <p className="text-sm text-[#F0EDE8]">{asset.name}</p>
              <p className="text-[11px] text-[#555] mt-0.5">{asset.desc}</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-[#C9A96E] hover:text-[#e5c485] transition-colors">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        ))}
      </div>

      <h2 className={s.h2}>Media contact</h2>
      <p className={s.p}>For press enquiries, interview requests, or media partnerships:</p>
      <p className={s.p}><strong className="text-[#C0B8AC]">Email:</strong> <a href="mailto:press@hypnotic.ai" className={s.a}>press@hypnotic.ai</a></p>
      <p className={s.p}>We aim to respond within 24 hours on business days.</p>
    </MarketingLayout>
  );
}
