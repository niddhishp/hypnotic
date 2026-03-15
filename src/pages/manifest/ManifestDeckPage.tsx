import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, FileText, Film, Share2, Scroll,
  Target, Users, Zap, Lightbulb, Monitor, BarChart2,
  CheckCircle, ChevronLeft, ChevronRight, Sparkles, Network,
  Star, Mic, Grid3X3
} from 'lucide-react';
import { useManifestStore } from '@/store';
import { cn } from '@/lib/utils';

const SECTION_ICONS: Record<string, React.ElementType> = {
  brief_decode:        FileText,
  audience:            Users,
  competitive:         Target,
  tension:             Zap,
  revelation:          Lightbulb,
  manifesto:           Scroll,
  big_idea:            Star,
  creative_voice:      Mic,
  hero_concept:        Film,
  content_system:      Grid3X3,
  platform_exec:       Monitor,
  social_system:       Share2,
  measurement:         BarChart2,
  executive_summary:   FileText,
};

const MOCK_DECK = {
  id: '1',
  title: 'Nike Air Max Q4 Campaign Strategy',
  outputType: 'strategy_deck',
  fromInsight: 'Nike Air Max — Brand Positioning',
  createdAt: '2024-03-07T12:00:00Z',
  sections: [
    {
      id: 'brief_decode',
      title: 'Brief Decode',
      content: 'Launch Nike Air Max as the must-have sneaker for the holiday season, targeting style-conscious athletes aged 22–35. The core insight: they want sneakers that perform on the court and look exceptional on the street. The brief asks us to own the intersection — but the real brief is deeper: make refusing to choose feel like a power move.',
    },
    {
      id: 'audience',
      title: 'Audience Map & Psychology',
      content: 'Primary persona: "The Style-Conscious Athlete" — values both performance and aesthetics. They follow sneaker culture closely but make independent choices. Secondary: "The Trend Follower" — influenced by drops, celebrity culture, and scarcity. Psychographics: health-conscious, trend-aware, brand-loyal but increasingly suspicious of inauthenticity. They respond to real athlete stories, not polished commercials.',
    },
    {
      id: 'competitive',
      title: 'Competitive Landscape',
      content: 'Adidas dominates collaborations (Yeezy, Wales Bonner) but is losing performance credibility. New Balance owns the comfort/heritage moment. On Running is taking the premium performance aesthetic lane without the cultural weight. Whitespace remains: premium sustainable performance with genuine cultural identity. No one owns it convincingly. Air Max can be first.',
    },
    {
      id: 'tension',
      title: 'Cultural Tension & Opportunity',
      content: 'The tension: athletes are implicitly told to choose. Serious shoes for serious sport. Stylish shoes for real life. The cultural moment says: the most compelling athletes — the ones this audience follows — refuse this binary. They wear the same shoes to train and to be seen. Air Max has always been built for this person. The opportunity is to say it out loud.',
    },
    {
      id: 'revelation',
      title: 'The Revelation',
      content: 'The best athletes don\'t choose between performance and style — they\'ve never had to. Air Max was designed for exactly this: the athlete who trains hard, looks good doing it, and won\'t explain themselves to anyone. The revelation isn\'t a new insight. It\'s the recognition that Air Max has been right all along — and now the culture has caught up.',
    },
    {
      id: 'manifesto',
      title: 'Strategic Manifesto',
      content: 'Some compromises are invisible until you\'re offered the alternative. The best athletes know this. They\'ve never settled for shoes that look good but don\'t perform. They\'ve never worn performance shoes that make them look like they\'re trying. They found Air Max. Now Air Max finds them. No Compromise. Not a tagline. A standard.',
    },
    {
      id: 'big_idea',
      title: 'The Big Idea',
      content: '"NO COMPROMISE" — Not just as a product claim, but as a lifestyle declaration. Air Max is the footwear equivalent of refusing to live in separate boxes. Every execution of this idea shows athletes living their full life without apology — performing, expressing, dominating, relaxing — all in the same shoes. The same person. No split.',
    },
    {
      id: 'creative_voice',
      title: 'Creative Voice & Expression',
      content: 'Direct. Confident. Never aggressive. The voice of someone who knows they\'re right without needing to prove it. Sentences are short. Claims are specific. We show, not tell. The visual language: high-contrast, movement in stillness, real sweat alongside genuine style. Not studio gloss. The sound: silence broken by specific sound — shoe on court, city ambient, breath. Never generic music first.',
    },
    {
      id: 'hero_concept',
      title: 'Hero Content Concept',
      content: '60-second anthem film: A single athlete. One continuous day. 5am track session into afternoon studio session into evening gallery opening. The camera never cuts in a way that signals transition — the edit is seamless because the life is seamless. The shoes never leave their feet. No voiceover. Final frame: the shoe. "No Compromise." Out.',
    },
    {
      id: 'executive_summary',
      title: 'Executive Summary',
      content: 'This strategy positions Air Max to own the "No Compromise" space before a challenger claims it. The cultural tension is real and validated by data (78% positive social sentiment, 34% category market share). Three strategic routes are available, with "The No Compromise Campaign" as the recommended path: low risk, high impact, and directly addresses the primary whitespace. The hero concept and manifesto are execution-ready pending client review.',
    },
  ],
};

export function ManifestDeckPage() {
  const navigate  = useNavigate();
  const { currentDeck } = useManifestStore();
  const deck = (currentDeck as any) ?? MOCK_DECK;
  const [activeSectionId, setActiveSectionId] = useState(deck.sections[0]?.id ?? '');
  const [viewMode, setViewMode] = useState<'scroll' | 'slides'>('scroll');

  const activeSection = deck.sections.find((s: any) => s.id === activeSectionId) ?? deck.sections[0];
  const activeIdx     = deck.sections.findIndex((s: any) => s.id === activeSectionId);

  const prev = () => {
    if (activeIdx > 0) setActiveSectionId(deck.sections[activeIdx - 1].id);
  };
  const next = () => {
    if (activeIdx < deck.sections.length - 1) setActiveSectionId(deck.sections[activeIdx + 1].id);
  };

  const typeLabel: Record<string, string> = {
    strategy_deck: 'Strategy Deck', film_script: 'Film Script',
    social_system: 'Social System', campaign_narrative: 'Campaign Narrative',
    character_doc: 'Character Document',
  };
  const typeIcon: Record<string, React.ElementType> = {
    strategy_deck: FileText, film_script: Film, social_system: Share2,
    campaign_narrative: Scroll, character_doc: Users,
  };
  const TypeIcon = typeIcon[deck.outputType] ?? FileText;

  return (
    <div style={{ background: '#0A0A0C' }} className="min-h-full">
      <div className="flex h-[calc(100vh-56px)]">

        {/* ── Left: Section nav ────────────────────────────────── */}
        <div className="w-[220px] flex-shrink-0 border-r border-white/6 flex flex-col overflow-hidden"
          style={{ background: '#0D0D10' }}>
          {/* Deck header */}
          <div className="px-4 py-4 border-b border-white/5">
            <button onClick={() => navigate('/manifest')}
              className="flex items-center gap-1.5 text-[11px] text-[#555] hover:text-[#888] transition-colors mb-3">
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
            <div className="flex items-center gap-1.5 mb-1">
              <TypeIcon className="w-3 h-3 text-[#C9A96E]" />
              <span className="text-[11px] text-[#C9A96E] uppercase tracking-wider">{typeLabel[deck.outputType] ?? 'Output'}</span>
            </div>
            <div className="text-xs font-medium text-[#F0EDE8] leading-snug">{deck.title}</div>
            {deck.fromInsight && (
              <div className="text-[11px] text-[#444] mt-1 truncate">↳ {deck.fromInsight}</div>
            )}
          </div>

          {/* Section list */}
          <div className="flex-1 overflow-y-auto p-2">
            {deck.sections.map((section: any, i: number) => {
              const Icon = SECTION_ICONS[section.id] ?? FileText;
              const isActive = section.id === activeSectionId;
              return (
                <button key={section.id}
                  onClick={() => setActiveSectionId(section.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all group relative',
                    isActive ? 'bg-[#C9A96E]/10 text-[#F0EDE8]' : 'text-[#555] hover:bg-white/3 hover:text-[#888]'
                  )}>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/4 rounded-r-full bg-[#C9A96E]" />}
                  <span className="text-[11px] text-[#333] w-4 text-right flex-shrink-0">{i + 1}</span>
                  <Icon className="w-3 h-3 flex-shrink-0" style={isActive ? { color: '#C9A96E' } : {}} />
                  <span className="text-[11px] leading-tight truncate">{section.title}</span>
                  {isActive && <CheckCircle className="w-3 h-3 text-[#C9A96E] ml-auto flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Export */}
          <div className="p-3 border-t border-white/5 space-y-2">
            <button className="w-full flex items-center justify-center gap-1.5 text-xs text-[#777] border border-white/8 rounded-xl py-2.5 hover:border-white/20 hover:text-[#F0EDE8] transition-all">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
            <button
              onClick={() => navigate('/craft')}
              className="w-full flex items-center justify-center gap-1.5 bg-[#C9A96E] text-[#08080A] rounded-xl py-2.5 text-xs font-medium hover:opacity-90 transition-opacity">
              <Sparkles className="w-3.5 h-3.5" /> Take to Craft
            </button>
          </div>
        </div>

        {/* ── Center: Content ───────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/6 flex-shrink-0"
            style={{ background: '#0D0D10' }}>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#555]">{activeIdx + 1} / {deck.sections.length}</span>
              <div className="w-24 h-1 bg-white/8 rounded-full overflow-hidden ml-2">
                <div className="h-full bg-[#C9A96E] rounded-full transition-all"
                  style={{ width: `${((activeIdx + 1) / deck.sections.length) * 100}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'scroll' ? 'slides' : 'scroll')}
                className="text-[11px] text-[#555] border border-white/8 rounded-lg px-2.5 py-1.5 hover:border-white/20 hover:text-[#888] transition-all">
                {viewMode === 'scroll' ? 'Slide view' : 'Scroll view'}
              </button>
              <button onClick={prev} disabled={activeIdx === 0}
                className="p-1.5 text-[#555] hover:text-[#F0EDE8] hover:bg-white/5 rounded-lg transition-all disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={next} disabled={activeIdx === deck.sections.length - 1}
                className="p-1.5 text-[#555] hover:text-[#F0EDE8] hover:bg-white/5 rounded-lg transition-all disabled:opacity-30">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content area */}
          {viewMode === 'scroll' ? (
            <div className="flex-1 overflow-y-auto px-10 py-10">
              <div className="max-w-2xl mx-auto space-y-10">
                {deck.sections.map((section: any, i: number) => {
                  const Icon = SECTION_ICONS[section.id] ?? FileText;
                  return (
                    <div key={section.id} id={section.id}
                      className={cn('transition-all', section.id === activeSectionId ? 'opacity-100' : 'opacity-60 hover:opacity-80')}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[11px] text-[#333]">{String(i + 1).padStart(2, '0')}</span>
                        <div className="w-5 h-5 rounded-lg bg-[#C9A96E]/10 flex items-center justify-center">
                          <Icon className="w-3 h-3 text-[#C9A96E]" />
                        </div>
                        <h2 className="text-base font-light text-[#F0EDE8]">{section.title}</h2>
                      </div>
                      <p className="text-sm text-[#888] leading-loose" style={{ fontFamily: section.id === 'manifesto' || section.id === 'revelation' ? '"Courier Prime", monospace' : undefined }}>
                        {section.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-10" style={{ background: '#0A0A0C' }}>
              <div className="w-full max-w-2xl">
                {/* Slide card */}
                <div className="rounded-2xl border border-white/8 overflow-hidden"
                  style={{ background: '#0D0D10', aspectRatio: '16/9' }}>
                  <div className="h-full flex flex-col p-8 justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {(() => { const Icon = SECTION_ICONS[activeSection?.id] ?? FileText; return <Icon className="w-4 h-4 text-[#C9A96E]" />; })()}
                        <span className="text-[11px] text-[#C9A96E] uppercase tracking-wider">{activeSection?.title}</span>
                      </div>
                      <span className="text-[11px] text-[#333]">{activeIdx + 1}/{deck.sections.length}</span>
                    </div>

                    <div className="flex-1 flex items-center py-6">
                      <p className="text-sm text-[#C0B8AC] leading-loose max-h-48 overflow-hidden"
                        style={{ fontFamily: ['manifesto','revelation'].includes(activeSection?.id) ? '"Courier Prime", monospace' : undefined }}>
                        {activeSection?.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#444]">{deck.title}</span>
                      <div className="flex gap-0.5">
                        {deck.sections.map((_: any, i: number) => (
                          <div key={i} className="w-4 h-0.5 rounded-full"
                            style={{ background: i === activeIdx ? '#C9A96E' : i < activeIdx ? '#C9A96E40' : '#ffffff10' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide nav */}
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button onClick={prev} disabled={activeIdx === 0}
                    className="flex items-center gap-1.5 text-xs text-[#555] hover:text-[#F0EDE8] disabled:opacity-30 transition-all">
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <span className="text-xs text-[#444]">{activeSection?.title}</span>
                  <button onClick={next} disabled={activeIdx === deck.sections.length - 1}
                    className="flex items-center gap-1.5 text-xs text-[#555] hover:text-[#F0EDE8] disabled:opacity-30 transition-all">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
