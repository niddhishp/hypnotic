import { useNavigate } from 'react-router-dom';
import { Film, Image, Music, Box, Camera, Hash, Sparkles, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/shared/SEO';

const PRODUCTION_TYPES = [
  {
    id: 'video', label: 'Video Production',
    icon: Film, color: '#7aaee0',
    description: 'Full AI film pipeline. Script → Characters → Storyboard → Timeline.',
    badge: 'Multi-stage', href: '/craft/video',
    models: ['Kling 2.6', 'Runway Gen-4', 'Wan', 'Hailuo', 'Seedance'],
  },
  {
    id: 'image', label: 'Image Generation',
    icon: Image, color: '#C9A96E',
    description: 'Generate hero images, illustrations, and editorial photography.',
    badge: '', href: '/craft/image',
    models: ['Flux.2 Pro', 'Mystic 2.5', 'Imagen 4 Ultra', 'Ideogram', 'Recraft V4'],
  },
  {
    id: 'social', label: 'Social Post',
    icon: Hash, color: '#7abf8e',
    description: 'Platform-optimised captions and visuals for every channel.',
    badge: '', href: '/craft/social',
    models: ['All image models', '6 platforms'],
  },
  {
    id: 'audio', label: 'Audio & Music',
    icon: Music, color: '#a07ae0',
    description: 'Compose music, record voiceovers, and generate SFX.',
    badge: '', href: '/craft/audio',
    models: ['Suno v4', 'Udio', 'ElevenLabs v3', 'ElevenLabs Turbo'],
  },
  {
    id: 'mockup', label: 'Product Mockup',
    icon: Box, color: '#e0a87a',
    description: 'Place your product in any scene, lighting, and surface context.',
    badge: '', href: '/craft/mockup',
    models: ['Mystic 2.5', 'Flux.2 Pro', 'Imagen 4', 'Recraft V4'],
  },
  {
    id: 'photography', label: 'AI Photography',
    icon: Camera, color: '#7ae0b8',
    description: 'Studio-quality photography with full creative direction.',
    badge: '', href: '/craft/photography',
    models: ['Imagen 4 Ultra', 'Seedream 4 4K', 'Mystic 2.5', 'GPT 1.5 High'],
  },
];

export function CraftPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12 px-6" style={{ background: '#0A0A0C' }}>
      <SEO title="Craft — AI Generation" noIndex />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-[#C9A96E]/15 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-[#C9A96E]" />
            </div>
            <span className="text-[11px] text-[#C9A96E] uppercase tracking-[0.15em] font-medium">Craft</span>
          </div>
          <h1 className="text-3xl font-light text-[#F0EDE8] mb-3 tracking-tight">AI Production Studio</h1>
          <p className="text-sm text-[#555] max-w-lg leading-relaxed">
            Generate video, images, audio, social content, product mockups, and photography — each with dedicated agent workflows and model selection.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCTION_TYPES.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => navigate(type.href)}
                className="group rounded-2xl border border-white/8 p-5 text-left hover:border-white/20 transition-all relative overflow-hidden"
                style={{ background: '#0D0D10' }}
              >
                {/* Subtle color glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${type.color}08 0%, transparent 60%)` }} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${type.color}15`, border: `1px solid ${type.color}25` }}>
                      <Icon className="w-4 h-4" style={{ color: type.color }} />
                    </div>
                    {type.badge && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#C9A96E]/15 text-[#C9A96E] font-medium">{type.badge}</span>
                    )}
                  </div>

                  <div className="mb-2">
                    <h3 className="text-sm font-medium text-[#F0EDE8] mb-1">{type.label}</h3>
                    <p className="text-[11px] text-[#666] leading-relaxed">{type.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {type.models.slice(0, 3).map(m => (
                      <span key={m} className="text-[11px] text-[#555] bg-white/5 px-1.5 py-0.5 rounded">{m}</span>
                    ))}
                    {type.models.length > 3 && (
                      <span className="text-[11px] text-[#444] px-1.5 py-0.5">+{type.models.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-all"
                    style={{ color: type.color }}>
                    Open Studio <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Recent generations */}
        <div className="mt-10">
          <div className="text-[11px] text-[#555] uppercase tracking-wider mb-4">Recent Generations</div>
          <div className="text-sm text-[#333] text-center py-8 border border-dashed border-white/5 rounded-xl">
            No generations yet — start creating above
          </div>
        </div>
      </div>
    </div>
  );
}
