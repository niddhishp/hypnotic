import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, ArrowRight, TrendingUp, Users,
  Target, Lightbulb, Zap, BarChart2, ChevronRight,
  CheckCircle, Sparkles, Globe, Network
} from 'lucide-react';
import { useInsightStore } from '@/store';
import { cn } from '@/lib/utils';

const MOCK_REPORT = {
  id: '1',
  subject: 'Nike Air Max — Brand Positioning',
  status: 'complete',
  confidenceScore: 92,
  sourcesSearched: 847,
  routeCount: 3,
  createdAt: '2024-03-07T10:00:00Z',

  executiveSummary: 'Nike Air Max holds a dominant position in the lifestyle sneaker market with strong associations to innovation, comfort, and street culture. The brand successfully bridges performance and lifestyle, appealing to both athletes and fashion-conscious consumers. A significant cultural moment is available: the convergence of sustainability pressures and Gen Z identity expression creates whitespace for a repositioning that goes deeper than product.',

  problemStatement: 'Young athletes struggle to find sneakers that balance performance credibility with everyday style — they should not have to choose.',

  brandArchetype: {
    archetype: 'The Hero',
    confidence: 87,
    rationale: 'Nike consistently positions itself as empowering athletes to overcome challenges and achieve greatness. Every campaign reinforces the notion that limits exist to be broken.',
    traits: ['brave', 'determined', 'skilled', 'inspiring'],
  },

  whatDataShows: {
    keyFindings: [
      '34% market share in the premium lifestyle sneaker category',
      '78% positive social sentiment across major platforms',
      'Heritage positioning resonates most with 22–34 demographic',
      'Innovation narrative drives 2.3× higher purchase intent vs. style-only messaging',
      'Sustainability is the fastest-growing mention in category conversations (+140% YoY)',
    ],
  },

  audienceSignals: {
    primaryPersona: {
      name: 'The Style-Conscious Athlete',
      age: '22–35',
      description: 'Values both performance and aesthetics. Seeks products that transition seamlessly from gym to street. Follows sneaker culture closely but makes independent choices.',
      motivations: ['Self-expression through product choices', 'Performance that earns respect', 'Being ahead of the trend, not chasing it'],
      frustrations: ['Limited style options in serious performance wear', 'Premium pricing without clear performance justification', 'Brands that talk sustainability but don\'t show it'],
    },
    culturalInsights: [
      'Sneaker culture has mainstreamed — ownership signals identity, not just taste',
      'Athleisure is now the default casual uniform; performance wear is daily wear',
      'Sustainability is moving from "nice to have" to a purchase filter for under-35s',
      'Authenticity > polish — UGC outperforms studio content 3:1 in engagement',
    ],
  },

  competitiveLandscape: {
    keyPlayers: [
      { name: 'Adidas', positioning: 'Street culture & collaborations', gap: 'Losing performance credibility' },
      { name: 'New Balance', positioning: 'Comfort heritage & dad shoe wave', gap: 'Limited innovation narrative' },
      { name: 'On Running', positioning: 'Performance-first with clean aesthetic', gap: 'No cultural cachet yet' },
    ],
    whitespace: 'Premium sustainable sneakers that carry both performance credibility and cultural identity. No current player owns this space convincingly.',
  },

  culturalTension: {
    tension: 'Performance vs. Identity',
    description: 'Athletes are told to choose: serious shoes for serious sport, or stylish shoes for real life. The cultural tension is that the most compelling athletes refuse this binary — and their audience does too.',
    opportunity: 'Nike Air Max can own "The No Compromise" position before a challenger claims it.',
  },

  strategicRoutes: [
    {
      id: 'r1',
      label: 'The No Compromise Campaign',
      oneLiner: 'Aggressively own the athlete-who-refuses-to-choose',
      direction: 'Lead with real athletes living the dual life — performance in the morning, streets in the afternoon. Make refusal of the binary the brand attitude, not just the product claim.',
      riskLevel: 'low' as const,
      impact: 'High awareness, repositions vs. Adidas + New Balance simultaneously',
    },
    {
      id: 'r2',
      label: 'The Heritage Forward Play',
      oneLiner: 'Make Air Max\'s 30-year legacy feel like foresight, not nostalgia',
      direction: 'Reframe history as prediction: Air Max saw the future of style-performance fusion in 1987. Frame current culture as proving Air Max right all along.',
      riskLevel: 'medium' as const,
      impact: 'Strong with 30–45 demo, risks feeling backward to under-25s',
    },
    {
      id: 'r3',
      label: 'The Sustainability Pivot',
      oneLiner: 'Become the performance-first sustainable sneaker before On Running does',
      direction: 'Lead the category\'s sustainability narrative with real product innovation stories. Position Air Max as the choice for athletes who care about what their kit leaves behind.',
      riskLevel: 'high' as const,
      impact: 'Unlocks the fastest-growing purchase driver, requires product substance to back it',
    },
  ],
};

const RISK_COLORS = { low: '#7abf8e', medium: '#C9A96E', high: '#e07a7a' };
const RISK_BG    = { low: '#7abf8e15', medium: '#C9A96E15', high: '#e07a7a15' };

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-[#C9A96E]/10 flex items-center justify-center">
          <Icon className="w-3 h-3 text-[#C9A96E]" />
        </div>
        <h2 className="text-sm font-medium text-[#F0EDE8]">{title}</h2>
      </div>
      <div className="rounded-2xl border border-white/6 p-5" style={{ background: '#0D0D10' }}>
        {children}
      </div>
    </div>
  );
}

export function InsightReportPage() {
  const navigate = useNavigate();
  const { currentReport } = useInsightStore();
  const report = (currentReport as any) ?? MOCK_REPORT;

  const sendToManifest = (routeId?: string) => {
    navigate('/manifest');
  };

  return (
    <div style={{ background: '#0A0A0C' }} className="min-h-full">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

        {/* ── Header ───────────────────────────────────────────── */}
        <div>
          <button onClick={() => navigate('/insight')}
            className="flex items-center gap-1.5 text-xs text-[#555] hover:text-[#888] transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Insight
          </button>

          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#7abf8e]/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-[#7abf8e]" />
                </div>
                <span className="text-[10px] text-[#7abf8e] uppercase tracking-wider">Report Complete</span>
              </div>
              <h1 className="text-2xl font-light text-[#F0EDE8] tracking-tight">{report.subject}</h1>
              <div className="flex items-center gap-4 text-[11px] text-[#444]">
                <span>{new Date(report.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{report.confidenceScore}% confidence</span>
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{report.sourcesSearched} sources</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="flex items-center gap-1.5 text-xs text-[#777] border border-white/8 rounded-xl px-3 py-2 hover:border-white/20 hover:text-[#F0EDE8] transition-all">
                <Download className="w-3.5 h-3.5" /> Export PDF
              </button>
              <button onClick={() => sendToManifest()}
                className="flex items-center gap-1.5 bg-[#C9A96E] text-[#08080A] rounded-xl px-4 py-2 text-xs font-medium hover:opacity-90 transition-opacity">
                <Sparkles className="w-3.5 h-3.5" /> Take to Manifest
              </button>
            </div>
          </div>
        </div>

        {/* ── Problem Statement ─────────────────────────────────── */}
        <div className="rounded-2xl border border-[#C9A96E]/20 p-6" style={{ background: 'linear-gradient(135deg, #C9A96E08, #0D0D10)' }}>
          <div className="text-[10px] text-[#C9A96E] uppercase tracking-wider mb-3">The Central Problem</div>
          <p className="text-base font-light text-[#F0EDE8] leading-relaxed italic">
            "{report.problemStatement}"
          </p>
        </div>

        {/* ── Executive Summary ─────────────────────────────────── */}
        <Section title="Executive Summary" icon={BarChart2}>
          <p className="text-sm text-[#888] leading-relaxed">{report.executiveSummary}</p>
        </Section>

        {/* ── Brand Archetype ──────────────────────────────────── */}
        <Section title="Brand Archetype" icon={Target}>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl border border-[#C9A96E]/30 flex items-center justify-center flex-shrink-0"
              style={{ background: '#C9A96E12' }}>
              <span className="text-xl">⚔️</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#F0EDE8]">{report.brandArchetype.archetype}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C9A96E] rounded-full" style={{ width: `${report.brandArchetype.confidence}%` }} />
                  </div>
                  <span className="text-[10px] text-[#C9A96E]">{report.brandArchetype.confidence}% match</span>
                </div>
              </div>
              <p className="text-xs text-[#777] leading-relaxed">{report.brandArchetype.rationale}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {report.brandArchetype.traits.map((t: string) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A96E]/10 text-[#C9A96E]/80">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── What the Data Shows ───────────────────────────────── */}
        <Section title="What the Data Shows" icon={BarChart2}>
          <ul className="space-y-2">
            {report.whatDataShows.keyFindings.map((f: string, i: number) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="w-1 h-1 rounded-full bg-[#C9A96E] mt-2 flex-shrink-0" />
                <span className="text-xs text-[#888] leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── Audience Signals ─────────────────────────────────── */}
        <Section title="Audience Signals" icon={Users}>
          <div className="space-y-5">
            {/* Primary persona */}
            <div className="p-4 rounded-xl border border-white/6" style={{ background: '#0A0A0C' }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-[#7aaee0]/10 border border-[#7aaee0]/20 flex items-center justify-center text-sm flex-shrink-0">
                  👤
                </div>
                <div>
                  <div className="text-xs font-medium text-[#F0EDE8]">{report.audienceSignals.primaryPersona.name}</div>
                  <div className="text-[10px] text-[#555]">{report.audienceSignals.primaryPersona.age}</div>
                </div>
              </div>
              <p className="text-xs text-[#777] leading-relaxed mb-3">{report.audienceSignals.primaryPersona.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[9px] text-[#444] uppercase tracking-wider mb-1.5">Motivations</div>
                  {report.audienceSignals.primaryPersona.motivations.map((m: string) => (
                    <div key={m} className="flex items-center gap-1.5 mb-1">
                      <div className="w-1 h-1 rounded-full bg-[#7abf8e]" />
                      <span className="text-[11px] text-[#777]">{m}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-[9px] text-[#444] uppercase tracking-wider mb-1.5">Frustrations</div>
                  {report.audienceSignals.primaryPersona.frustrations.map((f: string) => (
                    <div key={f} className="flex items-center gap-1.5 mb-1">
                      <div className="w-1 h-1 rounded-full bg-[#e07a7a]" />
                      <span className="text-[11px] text-[#777]">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cultural insights */}
            <div>
              <div className="text-[10px] text-[#444] uppercase tracking-wider mb-2">Cultural Insights</div>
              <div className="space-y-1.5">
                {report.audienceSignals.culturalInsights.map((c: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <Zap className="w-3 h-3 text-[#C9A96E]/60 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-[#777]">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Competitive Landscape ─────────────────────────────── */}
        <Section title="Competitive Landscape" icon={Target}>
          <div className="space-y-3 mb-4">
            {report.competitiveLandscape.keyPlayers.map((p: any) => (
              <div key={p.name} className="flex items-start gap-3 p-3 rounded-xl border border-white/5"
                style={{ background: '#0A0A0C' }}>
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-xs flex-shrink-0 font-medium text-[#888]">
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#F0EDE8]">{p.name}</span>
                    <span className="text-[10px] text-[#555]">— {p.positioning}</span>
                  </div>
                  <div className="text-[11px] text-[#e07a7a]/80 mt-0.5">Gap: {p.gap}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl border border-[#7abf8e]/15" style={{ background: '#7abf8e08' }}>
            <div className="text-[10px] text-[#7abf8e] uppercase tracking-wider mb-1">Whitespace</div>
            <p className="text-xs text-[#888]">{report.competitiveLandscape.whitespace}</p>
          </div>
        </Section>

        {/* ── Cultural Tension ─────────────────────────────────── */}
        <Section title="Cultural Tension & Opportunity" icon={Zap}>
          <div className="space-y-4">
            <div>
              <div className="text-[10px] text-[#e07a7a] uppercase tracking-wider mb-1">The Tension</div>
              <p className="text-sm font-medium text-[#F0EDE8]">{report.culturalTension.tension}</p>
            </div>
            <p className="text-xs text-[#777] leading-relaxed">{report.culturalTension.description}</p>
            <div className="p-3 rounded-xl border border-[#C9A96E]/15" style={{ background: '#C9A96E08' }}>
              <div className="text-[10px] text-[#C9A96E] uppercase tracking-wider mb-1">The Opportunity</div>
              <p className="text-xs text-[#888]">{report.culturalTension.opportunity}</p>
            </div>
          </div>
        </Section>

        {/* ── Strategic Routes ─────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#C9A96E]/10 flex items-center justify-center">
              <Lightbulb className="w-3 h-3 text-[#C9A96E]" />
            </div>
            <h2 className="text-sm font-medium text-[#F0EDE8]">Strategic Routes</h2>
            <span className="text-[10px] text-[#444]">3 directions forward</span>
          </div>

          <div className="space-y-3">
            {report.strategicRoutes.map((route: any, i: number) => (
              <div key={route.id}
                className="rounded-2xl border p-5 transition-all hover:border-opacity-60 group"
                style={{
                  background: i === 0 ? '#0D0D10' : '#0A0A0C',
                  borderColor: i === 0 ? 'rgba(201,169,110,0.25)' : 'rgba(255,255,255,0.06)',
                }}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-[#444] font-medium">Route {i + 1}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{ background: RISK_BG[route.riskLevel as keyof typeof RISK_BG], color: RISK_COLORS[route.riskLevel as keyof typeof RISK_COLORS] }}>
                        {route.riskLevel} risk
                      </span>
                      {i === 0 && (
                        <span className="text-[10px] text-[#C9A96E] bg-[#C9A96E]/10 px-1.5 py-0.5 rounded-full">★ Recommended</span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-[#F0EDE8]">{route.label}</h3>
                    <p className="text-xs text-[#555] mt-0.5 italic">"{route.oneLiner}"</p>
                  </div>
                </div>
                <p className="text-xs text-[#777] leading-relaxed mb-3">{route.direction}</p>
                <div className="text-[11px] text-[#555]">
                  <span className="text-[#444]">Expected impact:</span> {route.impact}
                </div>
                <button
                  onClick={() => sendToManifest(route.id)}
                  className="mt-3 flex items-center gap-1.5 text-[11px] text-[#C9A96E] hover:text-[#e5c485] transition-colors group-hover:translate-x-0.5">
                  Take this route to Manifest <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA row ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <button onClick={() => navigate('/insight')}
            className="flex items-center gap-1.5 text-xs text-[#555] hover:text-[#888] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Insight
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/workspace')}
              className="flex items-center gap-1.5 text-xs text-[#777] border border-white/8 rounded-xl px-3 py-2 hover:border-white/20 hover:text-[#F0EDE8] transition-all">
              <Network className="w-3.5 h-3.5" /> View in Workspace
            </button>
            <button onClick={() => sendToManifest()}
              className="flex items-center gap-1.5 bg-[#C9A96E] text-[#08080A] rounded-xl px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
              <Sparkles className="w-4 h-4" /> Take to Manifest <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
