import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  FileText,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';
import { useInsightStore, useProjectsStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const mockReports = [
  {
    id: '1',
    projectId: '1',
    subject: 'Nike Air Max Brand Positioning',
    status: 'complete' as const,
    executiveSummary: 'Nike Air Max holds a dominant position in the lifestyle sneaker market, with strong associations to innovation, comfort, and street culture.',
    brandArchetype: {
      archetype: 'The Hero',
      confidence: 87,
      rationale: 'Nike consistently positions itself as empowering athletes to overcome challenges.',
      traits: ['brave', 'determined', 'skilled'],
    },
    problemStatement: 'Young athletes struggle to find sneakers that balance performance credibility with everyday style.',
    confidenceScore: 92,
    createdAt: '2024-03-07T10:00:00Z',
  },
  {
    id: '2',
    projectId: '2',
    subject: 'Spotify Wrapped User Engagement',
    status: 'researching' as const,
    confidenceScore: 45,
    createdAt: '2024-03-06T14:30:00Z',
  },
];

const researchCategories = [
  { name: 'Brand & Market Data', icon: TrendingUp, status: 'complete' },
  { name: 'News & Media Coverage', icon: FileText, status: 'complete' },
  { name: 'Audience & Social Signals', icon: Users, status: 'complete' },
  { name: 'Competitive Landscape', icon: Target, status: 'running' },
  { name: 'Cultural Context & Trends', icon: Sparkles, status: 'queued' },
];

export function InsightPage() {
  const navigate = useNavigate();
  const { reports, addReport, setCurrentReport, isResearching, setIsResearching } = useInsightStore();
  const { currentProject } = useProjectsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [researchProgress, setResearchProgress] = useState(0);

  const displayReports = reports.length > 0 ? reports : mockReports;

  const [researchError, setResearchError] = useState<string | null>(null);

  const handleStartResearch = async () => {
    if (!searchQuery.trim()) return;

    setIsResearching(true);
    setResearchProgress(0);
    setResearchError(null);

    try {
      // TODO: Replace with real API call:
      // const response = await fetch('/api/insight/research', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ subject: searchQuery, projectId: currentProject?.id }),
      // });
      // if (!response.ok) throw new Error(await response.text());
      // const { runId } = await response.json();

      // Placeholder: simulate progress until API is wired
      await new Promise<void>((resolve, reject) => {
        const interval = setInterval(() => {
          setResearchProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              resolve();
              return 100;
            }
            return prev + 12;
          });
        }, 400);
      });

      const newReport = {
        id: Date.now().toString(),
        projectId: currentProject?.id || 'default',
        subject: searchQuery,
        status: 'complete' as const,
        executiveSummary: `Research initiated for "${searchQuery}". Connect your API keys in Settings to enable live AI-powered research.`,
        brandArchetype: {
          archetype: 'The Creator',
          confidence: 78,
          rationale: 'Strong emphasis on originality and self-expression.',
          traits: ['imaginative', 'expressive', 'original'],
        },
        problemStatement: `Target audiences seek authentic connections with brands that share their values.`,
        confidenceScore: 85,
        createdAt: new Date().toISOString(),
      };

      addReport(newReport);
      setSearchQuery('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Research failed. Please try again.';
      setResearchError(message);
      console.error('[InsightPage] research error:', err);
    } finally {
      setIsResearching(false);
      setResearchProgress(0);
    }
  };

  const handleViewReport = (report: typeof mockReports[0]) => {
    setCurrentReport(report);
    navigate(`/insight/${report.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full mb-4">
          <Search className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-medium text-blue-500 uppercase tracking-wider">Insight Module</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#F6F6F6] mb-2">
          What do you want to understand?
        </h1>
        <p className="text-[#A7A7A7] max-w-lg mx-auto">
          Enter a brand, idea, product, or campaign problem. Hypnotic will research it, 
          find the tension, and give you routes forward.
        </p>
      </div>

      {/* Research Input */}
      <Card className="bg-[#0F0F11] border-white/5">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartResearch()}
                placeholder="Brand / idea / question"
                disabled={isResearching}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-[#F6F6F6] placeholder:text-[#666] focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
              />
            </div>
            {researchError && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 mt-3">
                <span>⚠</span>{researchError}
              </div>
            )}
            <Button
              onClick={handleStartResearch}
              disabled={!searchQuery.trim() || isResearching}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6"
            >
              {isResearching ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Run Research
                </>
              )}
            </Button>
          </div>

          {/* Research Progress */}
          {isResearching && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#A7A7A7]">Researching sources...</span>
                <span className="text-blue-500">{researchProgress}%</span>
              </div>
              <Progress value={researchProgress} className="h-2" />
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {researchCategories.map((cat, index) => (
                  <div 
                    key={cat.name}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg text-xs",
                      cat.status === 'complete' && "bg-green-500/10 text-green-500",
                      cat.status === 'running' && "bg-blue-500/10 text-blue-500",
                      cat.status === 'queued' && "bg-white/5 text-[#666]"
                    )}
                  >
                    <cat.icon className="w-3.5 h-3.5" />
                    <span className="truncate">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {!isResearching && (
            <div className="mt-4 flex flex-wrap gap-2">
              {['Nike', 'Spotify', 'Apple', 'Tesla', 'Coca-Cola'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs text-[#A7A7A7] hover:text-[#F6F6F6] transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Reports */}
      {displayReports.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-[#F6F6F6] mb-4">Recent Reports</h2>
          <div className="space-y-3">
            {displayReports.map((report) => (
              <Card 
                key={report.id}
                className="bg-[#0F0F11] border-white/5 hover:border-white/10 cursor-pointer group transition-all"
                onClick={() => handleViewReport(report as any)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-[#F6F6F6]">{report.subject}</h3>
                        {report.status === 'complete' ? (
                          <span className="flex items-center gap-1 text-xs text-green-500">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Complete
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-blue-500">
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            Researching
                          </span>
                        )}
                      </div>
                      
                      {report.executiveSummary && (
                        <p className="text-sm text-[#A7A7A7] line-clamp-2 mb-3">
                          {report.executiveSummary}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-[#666]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(report.createdAt)}
                        </span>
                        {report.confidenceScore && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            {report.confidenceScore}% confidence
                          </span>
                        )}
                        {report.brandArchetype && (
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full">
                            {report.brandArchetype.archetype}
                          </span>
                        )}
                      </div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-[#666] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
