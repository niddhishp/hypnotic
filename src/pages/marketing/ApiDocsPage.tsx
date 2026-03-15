import { MarketingLayout, proseStyles as s } from './MarketingLayout';
import { SEO } from '@/components/shared/SEO';
import { Link } from 'react-router-dom';
import { Code2, Zap, Lock, Terminal } from 'lucide-react';

const ENDPOINTS = [
  { method: 'POST', path: '/v1/insight/research', desc: 'Run brand research pipeline', plan: 'Agency+' },
  { method: 'POST', path: '/v1/manifest/generate', desc: 'Generate strategy deck (streaming)', plan: 'Agency+' },
  { method: 'POST', path: '/v1/craft/image',      desc: 'Generate images via fal.ai', plan: 'Agency+' },
  { method: 'POST', path: '/v1/craft/video',      desc: 'Generate video (async)', plan: 'Agency+' },
  { method: 'GET',  path: '/v1/models',           desc: 'List available AI models', plan: 'Pro+' },
  { method: 'GET',  path: '/v1/projects',         desc: 'List your projects', plan: 'Pro+' },
];

const METHOD_COLORS: Record<string, string> = {
  GET: '#7abf8e', POST: '#7aaee0', PUT: '#C9A96E', DELETE: '#e07a7a',
};

export function ApiDocsPage() {
  return (
    <MarketingLayout eyebrow="Developers" title="API Documentation"
      subtitle="Integrate Hypnotic's AI creative pipeline into your own products and workflows.">
      <SEO title="API Docs" description="Hypnotic API documentation — integrate AI brand research, generation, and publishing into your stack." canonical="/api-docs" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Code2, title: 'RESTful API', desc: 'Standard HTTP JSON API. Works with any language or framework.' },
          { icon: Lock,  title: 'API key auth', desc: 'Authenticate with a bearer token from your Settings page.' },
          { icon: Zap,   title: 'Streaming',    desc: 'Manifest and Insight endpoints support Server-Sent Events for real-time progress.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="p-5 rounded-2xl border border-white/6" style={{ background: '#0D0D10' }}>
            <Icon className="w-4.5 h-4.5 text-[#C9A96E] mb-3" />
            <p className="text-sm font-medium text-[#F0EDE8] mb-1">{title}</p>
            <p className="text-xs text-[#555] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <h2 className={s.h2}>Authentication</h2>
      <div className="rounded-2xl border border-white/6 p-4 mb-6 font-mono text-xs" style={{ background: '#080810' }}>
        <p className="text-[#444] mb-1"># Add to all requests</p>
        <p><span className="text-[#7aaee0]">Authorization</span><span className="text-[#555]">: Bearer </span><span className="text-[#C9A96E]">hk_your_api_key_here</span></p>
      </div>
      <p className={s.p}>Generate API keys in <Link to="/settings" className={s.a}>Settings → API Keys</Link>. API access requires the Agency plan.</p>

      <h2 className={s.h2}>Endpoints</h2>
      <div className="rounded-2xl border border-white/6 overflow-hidden mb-8">
        <div className="grid grid-cols-12 px-4 py-2.5 border-b border-white/6 bg-white/3">
          {['Method', 'Endpoint', 'Description', 'Plan'].map(h => (
            <span key={h} className={`text-[11px] text-[#444] uppercase tracking-wider ${h === 'Endpoint' ? 'col-span-4' : h === 'Description' ? 'col-span-4' : 'col-span-2'}`}>{h}</span>
          ))}
        </div>
        {ENDPOINTS.map((ep, i) => (
          <div key={i} className="grid grid-cols-12 px-4 py-3 border-b border-white/4 last:border-0 items-center">
            <span className="col-span-2 text-[11px] font-mono font-medium" style={{ color: METHOD_COLORS[ep.method] }}>{ep.method}</span>
            <code className="col-span-4 text-xs text-[#C0B8AC] font-mono">{ep.path}</code>
            <span className="col-span-4 text-xs text-[#555]">{ep.desc}</span>
            <span className="col-span-2 text-[11px] text-[#C9A96E]/70">{ep.plan}</span>
          </div>
        ))}
      </div>

      <h2 className={s.h2}>Quick start</h2>
      <div className="rounded-2xl border border-white/6 p-4 mb-6 font-mono text-xs overflow-x-auto" style={{ background: '#080810' }}>
        <p className="text-[#444] mb-2"># Run Insight research</p>
        <p><span className="text-[#a07ae0]">curl</span> <span className="text-[#7abf8e]">-X POST</span> <span className="text-[#C9A96E]">https://hypnotic.ai/api/v1/insight/research</span> \</p>
        <p>  <span className="text-[#7abf8e]">-H</span> <span className="text-[#F0EDE8]">"Authorization: Bearer hk_..."</span> \</p>
        <p>  <span className="text-[#7abf8e]">-H</span> <span className="text-[#F0EDE8]">"Content-Type: application/json"</span> \</p>
        <p>  <span className="text-[#7abf8e]">-d</span> <span className="text-[#F0EDE8]">'{`{"subject": "Nike", "projectId": "proj_xxx"}`}'</span></p>
      </div>

      <p className={s.p}>Full API reference, SDKs, and code examples coming soon. <Link to="/contact" className={s.a}>Join the developer waitlist</Link>.</p>
    </MarketingLayout>
  );
}
