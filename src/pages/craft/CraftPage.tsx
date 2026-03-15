// src/pages/craft/CraftPage.tsx — Creative Studio Hub
// Entry point to all generation capabilities, organized by output type.

import { useNavigate } from 'react-router-dom';
import {
  Film, Image as ImgIcon, Music, FileText, Users, Sparkles,
  Zap, Play, Layers, Package, Volume2, Bot, ArrowRight, Star,
} from 'lucide-react';
import { useProjectsStore } from '@/store';
import { useBrandMemoryStore } from '@/store/brand-memory.store';
import { ALL_TEMPLATES } from '@/lib/craft/prompt-library';
import { SEO } from '@/components/shared/SEO';
import { cn } from '@/lib/utils';

const OUTPUT_TYPES = [
  {
    id: 'video',       label: 'Video',          route: '/craft/video',         icon: Film,      color: '#C9A96E',
    desc: 'Brand films, commercials, reels, explainers',
    tools: ['Script → Storyboard → Keyframes → Timeline', 'Cinematic & animated styles', 'Multi-character scenes'],
    credits: 10,
  },
  {
    id: 'image',       label: 'Image',          route: '/craft/image',         icon: ImgIcon,   color: '#7aaee0',
    desc: 'Campaign visuals, product shots, social content',
    tools: ['40+ style presets', 'Brand-aligned auto-enhancement', 'Hero shots & mockups'],
    credits: 2,
  },
  {
    id: 'document',    label: 'Document',       route: '/craft/document',      icon: FileText,  color: '#7abf8e',
    desc: 'Decks, reports, briefs, content calendars',
    tools: ['Strategy decks (PPTX)', 'Research reports (PDF)', 'Content calendars (XLSX)'],
    credits: 5,
  },
  {
    id: 'audio',       label: 'Audio',          route: '/craft/audio',         icon: Music,     color: '#a07ae0',
    desc: 'Music, voiceover, sound design',
    tools: ['Brand music (60+ styles)', 'Voiceover in 10+ languages', 'Sound design & SFX'],
    credits: 3,
  },
  {
    id: 'avatar',      label: 'Character',      route: '/craft/avatar',        icon: Users,     color: '#e07aa0',
    desc: 'AI brand ambassadors, mascots, digital presenters',
    tools: ['Photorealistic AI influencers', 'Animated mascots', 'Digital presenters'],
    credits: 8,
    isNew: true,
  },
  {
    id: 'social',      label: 'Social Factory', route: '/craft/social',        icon: Zap,       color: '#e0a07a',
    desc: 'Bulk generate posts, reels, and stories at scale',
    tools: ['Batch content generation', 'Platform-native formats', 'Auto-caption variants'],
    credits: 4,
  },
];

const QUICK_TEMPLATES = ALL_TEMPLATES.filter(t => t.isFeatured).slice(0, 6);

export function CraftPage() {
  const navigate = useNavigate();
  const { currentProject } = useProjectsStore();
  const brandMemory = useBrandMemoryStore();
  const memory = currentProject ? brandMemory.getMemory(currentProject.id) : null;

  return (
    <div className="min-h-full" style={{ background: '#0A0A0C' }}>
      <SEO title="Craft" noIndex />
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#a07ae0]/15 text-[#a07ae0] uppercase tracking-wider">Craft</span>
            {(memory?.completeness ?? 0) > 0 && (
              <span className="text-[11px] text-[#555]">Brand memory active — all outputs auto-enhanced</span>
            )}
          </div>
          <h1 className="text-2xl font-light text-[#F0EDE8]">What do you want to create?</h1>
          <p className="text-sm text-[#555] mt-1 max-w-lg leading-relaxed">
            Every generation passes through the invisible intelligence layer — your brand memory, archetype, and visual DNA are automatically injected. Your prompt stays simple. The output gets better.
          </p>
        </div>

        {/* Output type grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {OUTPUT_TYPES.map(type => {
            const Icon = type.icon;
            return (
              <button key={type.id} onClick={() => navigate(type.route)}
                className="text-left p-5 rounded-2xl border border-white/6 hover:border-white/15 transition-all group relative overflow-hidden"
                style={{ background: '#0D0D10' }}>
                {type.isNew && (
                  <span className="absolute top-3 right-3 text-[10px] px-1.5 py-0.5 rounded-full bg-[#7abf8e]/15 text-[#7abf8e] font-medium">New</span>
                )}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${type.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: type.color }} />
                </div>
                <h3 className="text-sm font-medium text-[#F0EDE8] mb-1 group-hover:text-white transition-colors">{type.label}</h3>
                <p className="text-[11px] text-[#555] leading-relaxed mb-3">{type.desc}</p>
                <ul className="space-y-0.5">
                  {type.tools.map(t => (
                    <li key={t} className="text-[10px] text-[#444] flex items-center gap-1">
                      <span style={{ color: type.color }}>·</span>{t}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <span className="text-[10px] text-[#333]">{type.credits} credits/gen</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#333] group-hover:text-[#C9A96E] transition-colors" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Featured templates */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-[#C9A96E]" />
            <h2 className="text-sm font-medium text-[#F0EDE8]">Featured templates</h2>
            <span className="text-[11px] text-[#444] ml-1">Premade prompts — enhanced by your brand memory</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_TEMPLATES.map(template => (
              <button key={template.id}
                onClick={() => navigate(`/craft/${template.category}?template=${template.id}`)}
                className="text-left flex items-start gap-4 p-4 rounded-2xl border border-white/6 hover:border-white/15 transition-all group"
                style={{ background: '#0D0D10' }}>
                <div className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0',
                  template.category === 'video'    && 'bg-[#C9A96E]/15',
                  template.category === 'image'    && 'bg-[#7aaee0]/15',
                  template.category === 'audio'    && 'bg-[#a07ae0]/15',
                  template.category === 'document' && 'bg-[#7abf8e]/15',
                  template.category === 'avatar'   && 'bg-[#e07aa0]/15',
                )}>
                  {template.category === 'video'    && <Film className="w-4 h-4 text-[#C9A96E]" />}
                  {template.category === 'image'    && <ImgIcon className="w-4 h-4 text-[#7aaee0]" />}
                  {template.category === 'audio'    && <Music className="w-4 h-4 text-[#a07ae0]" />}
                  {template.category === 'document' && <FileText className="w-4 h-4 text-[#7abf8e]" />}
                  {template.category === 'avatar'   && <Users className="w-4 h-4 text-[#e07aa0]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-[#F0EDE8] group-hover:text-white transition-colors">{template.label}</span>
                    <span className="text-[10px] text-[#444] px-1.5 py-0.5 rounded-full border border-white/6 capitalize">{template.category}</span>
                  </div>
                  <p className="text-[11px] text-[#555] leading-relaxed">{template.description}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#333] group-hover:text-[#C9A96E] transition-colors flex-shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Brand memory context */}
        {memory && (memory?.completeness ?? 0) > 0 && (
          <div className="rounded-2xl border border-[#C9A96E]/15 p-5" style={{ background: 'rgba(201,169,110,0.04)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#C9A96E]" />
              <span className="text-sm font-medium text-[#C9A96E]">Brand Memory — Auto-injected into every generation</span>
              <span className="text-[11px] text-[#444] ml-auto">{memory?.completeness ?? 0}% complete</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-xs">
              {memory.persona && (
                <div>
                  <p className="text-[10px] text-[#555] mb-1">Archetype</p>
                  <p className="text-[#C9A96E] font-medium">{memory.persona.archetype}</p>
                  <p className="text-[#444] mt-0.5">{memory.persona.voice}</p>
                </div>
              )}
              {memory.audience && (
                <div>
                  <p className="text-[10px] text-[#555] mb-1">Audience</p>
                  <p className="text-[#C0B8AC]">{memory.audience.name}</p>
                  <p className="text-[#444] mt-0.5">{memory.audience.age}</p>
                </div>
              )}
              {memory.brief?.bigIdea && (
                <div>
                  <p className="text-[10px] text-[#555] mb-1">Creative Platform</p>
                  <p className="text-[#C0B8AC] line-clamp-2">{memory.brief.bigIdea}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
