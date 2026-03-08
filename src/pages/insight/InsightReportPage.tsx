import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Sparkles,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useInsightStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const mockReport = {
  id: '1',
  projectId: '1',
  subject: 'Nike Air Max Brand Positioning',
  status: 'complete',
  executiveSummary: 'Nike Air Max holds a dominant position in the lifestyle sneaker market, with strong associations to innovation, comfort, and street culture. The brand successfully bridges performance and lifestyle, appealing to both athletes and fashion-conscious consumers.',
  whatDataShows: {
    title: 'What the Data Shows',
    content: 'Market analysis reveals Nike Air Max commands 34% market share in the premium lifestyle sneaker category. Social sentiment is 78% positive, with key themes around comfort, style, and heritage.',
    keyFindings: [
      '34% market share in premium lifestyle category',
      '78% positive social sentiment',
      'Strong association with innovation and comfort',
      'Heritage positioning resonates with Gen Z and Millennials',
    ],
  },
  audienceSignals: {
    primaryPersona: {
      name: 'The Style-Conscious Athlete',
      age: '22-35',
      description: 'Values both performance and aesthetics. Seeks products that transition seamlessly from gym to street.',
      motivations: ['Self-expression', 'Performance', 'Social status'],
      frustrations: ['Limited style options in performance wear', 'High prices for quality'],
      aspirations: ['Be seen as active and stylish', 'Join a community of like-minded individuals'],
    },
    psychographics: ['Health-conscious', 'Trend-aware', 'Brand-loyal'],
    culturalInsights: [
      'Sneaker culture has mainstreamed',
      'Athleisure is now everyday wear',
      'Sustainability matters to younger consumers',
    ],
  },
  competitiveLandscape: {
    keyPlayers: [
      { name: 'Adidas', positioning: 'Street culture and collaborations', strengths: ['Yeezy partnership', 'Originals line'], weaknesses: ['Less performance credibility'] },
      { name: 'New Balance', positioning: 'Comfort and dad shoe trend', strengths: ['Comfort reputation', 'Heritage'], weaknesses: ['Less style innovation'] },
    ],
    gaps: ['Sustainable materials', 'Personalization', 'Affordable premium'],
    whitespace: 'Premium sustainable sneakers that don\'t compromise on style or performance.',
  },
  culturalTension: {
    trends: ['Sustainability', 'Personalization', 'Community-driven brands'],
    tensions: ['Performance vs style', 'Heritage vs innovation', 'Premium vs accessible'],
    opportunities: ['Sustainable innovation', 'Community building', 'Limited editions'],
  },
  brandArchetype: {
    archetype: 'The Hero',
    confidence: 87,
    rationale: 'Nike consistently positions itself as empowering athletes to overcome challenges. The "Just Do It" slogan epitomizes the Hero archetype.',
    traits: ['brave', 'determined', 'skilled', 'inspiring'],
  },
  problemStatement: 'Young athletes struggle to find sneakers that balance performance credibility with everyday style, forcing them to choose between looking good and performing well.',
  strategicRoutes: [
    {
      id: '1',
      label: 'The Innovation Leader',
      oneLiner: 'Double down on technology and performance',
      fullDirection: 'Position Air Max as the most technologically advanced sneaker, emphasizing innovation in comfort and performance.',
      implications: ['R&D investment', 'Tech-focused marketing', 'Premium pricing'],
      riskLevel: 'medium' as const,
    },
    {
      id: '2',
      label: 'The Cultural Connector',
      oneLiner: 'Own street culture and community',
      fullDirection: 'Deepen connections with street culture, music, and art communities through collaborations and events.',
      implications: ['Artist partnerships', 'Community events', 'Limited drops'],
      riskLevel: 'low' as const,
    },
    {
      id: '3',
      label: 'The Sustainable Pioneer',
      oneLiner: 'Lead in eco-friendly innovation',
      fullDirection: 'Make sustainability a core brand pillar, innovating in materials and manufacturing.',
      implications: ['Supply chain overhaul', 'Green marketing', 'Higher costs'],
      riskLevel: 'high' as const,
    },
  ],
  confidenceScore: 92,
  createdAt: '2024-03-07T10:00:00Z',
};

export function InsightReportPage() {
  const navigate = useNavigate();
  const { currentReport } = useInsightStore();
  const report = currentReport || mockReport;

  const getRiskBadge = (level: string) => {
    const styles = {
      low: 'bg-green-500/10 text-green-500',
      medium: 'bg-yellow-500/10 text-yellow-500',
      high: 'bg-red-500/10 text-red-500',
    };
    return styles[level as keyof typeof styles] || styles.medium;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button 
            onClick={() => navigate('/insight')}
            className="flex items-center gap-2 text-sm text-[#A7A7A7] hover:text-[#F6F6F6] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Insight
          </button>
          <h1 className="text-2xl font-semibold text-[#F6F6F6] mb-2">{report.subject}</h1>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              Complete
            </Badge>
            <span className="text-sm text-[#666]">
              Confidence: {report.confidenceScore}%
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-[#F6F6F6] hover:bg-white/5">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" className="border-white/10 text-[#F6F6F6] hover:bg-white/5">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={() => navigate('/manifest')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Take to Manifest
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="bg-[#0F0F11] border-white/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium text-[#F6F6F6] flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#D8A34A]" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#A7A7A7] leading-relaxed">{report.executiveSummary}</p>
        </CardContent>
      </Card>

      {/* Brand Archetype */}
      {'brandArchetype' in report && report.brandArchetype && (
        <Card className="bg-[#0F0F11] border-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-[#F6F6F6] flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              Brand Archetype
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-purple-500">
                  {report.brandArchetype.confidence}%
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium text-[#F6F6F6] mb-2">
                  {report.brandArchetype.archetype}
                </h3>
                <p className="text-sm text-[#A7A7A7] mb-3">{report.brandArchetype.rationale}</p>
                <div className="flex flex-wrap gap-2">
                  {report.brandArchetype.traits.map((trait) => (
                    <span key={trait} className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-xs">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Problem Statement */}
      {'problemStatement' in report && report.problemStatement && (
        <Card className="bg-[#0F0F11] border-white/5 border-l-4 border-l-[#D8A34A]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-[#F6F6F6]">
              Problem Statement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-[#F6F6F6] italic">"{report.problemStatement}"</p>
          </CardContent>
        </Card>
      )}

      {/* Key Findings Grid */}
      {'whatDataShows' in report && report.whatDataShows && (
        <Card className="bg-[#0F0F11] border-white/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-[#F6F6F6] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              {report.whatDataShows.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#A7A7A7] mb-4">{report.whatDataShows.content}</p>
            <ul className="space-y-2">
              {report.whatDataShows.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-[#F6F6F6]">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {finding}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Audience & Competition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience */}
        {'audienceSignals' in report && report.audienceSignals && (
          <Card className="bg-[#0F0F11] border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-[#F6F6F6] flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                Primary Audience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-medium text-[#F6F6F6] mb-1">
                  {report.audienceSignals.primaryPersona.name}
                </h4>
                <p className="text-xs text-[#666] mb-2">{report.audienceSignals.primaryPersona.age}</p>
                <p className="text-sm text-[#A7A7A7]">
                  {report.audienceSignals.primaryPersona.description}
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-[#666] uppercase tracking-wider">Motivations</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {report.audienceSignals.primaryPersona.motivations.map((m) => (
                      <span key={m} className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-xs">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Competition */}
        {'competitiveLandscape' in report && report.competitiveLandscape && (
          <Card className="bg-[#0F0F11] border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-[#F6F6F6] flex items-center gap-2">
                <Target className="w-4 h-4 text-red-500" />
                Competitive Landscape
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.competitiveLandscape.keyPlayers.map((player) => (
                  <div key={player.name} className="p-3 bg-white/5 rounded-lg">
                    <div className="font-medium text-[#F6F6F6] mb-1">{player.name}</div>
                    <div className="text-xs text-[#A7A7A7]">{player.positioning}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <span className="text-xs text-[#666] uppercase tracking-wider">Whitespace</span>
                <p className="text-sm text-[#F6F6F6] mt-1">{report.competitiveLandscape.whitespace}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Strategic Routes */}
      {'strategicRoutes' in report && report.strategicRoutes && (
        <div>
          <h2 className="text-lg font-medium text-[#F6F6F6] mb-4">Strategic Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.strategicRoutes.map((route) => (
              <Card key={route.id} className="bg-[#0F0F11] border-white/5 hover:border-white/10 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={cn("px-2 py-1 rounded text-xs", getRiskBadge(route.riskLevel))}>
                      {route.riskLevel} risk
                    </span>
                  </div>
                  <h3 className="font-medium text-[#F6F6F6] mb-1">{route.label}</h3>
                  <p className="text-sm text-[#A7A7A7] mb-3">{route.oneLiner}</p>
                  <p className="text-xs text-[#666] mb-4">{route.fullDirection}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/manifest')}
                    className="w-full border-white/10 text-[#F6F6F6] hover:bg-white/5"
                  >
                    Take to Manifest
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
