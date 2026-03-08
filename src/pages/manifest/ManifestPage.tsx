import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  Film, 
  Share2, 
  ArrowRight,
  Clock,
  CheckCircle,
  MoreVertical,
  Download
} from 'lucide-react';
import { useManifestStore, useInsightStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const outputTypes = [
  { id: 'deck', name: 'Strategy Deck', icon: FileText, description: 'Full presentation with all sections' },
  { id: 'script', name: 'Film Script', icon: Film, description: 'Screenplay with scenes and dialogue' },
  { id: 'social', name: 'Social System', icon: Share2, description: 'Content pillars and captions' },
];

const mockDecks = [
  {
    id: '1',
    projectId: '1',
    title: 'Nike Air Max Q4 Campaign',
    outputType: 'strategy_deck',
    sections: [],
    status: 'complete' as const,
    createdAt: '2024-03-07T12:00:00Z',
  },
  {
    id: '2',
    projectId: '2',
    title: 'Spotify Wrapped 2024 Script',
    outputType: 'film_script',
    sections: [],
    status: 'generating' as const,
    createdAt: '2024-03-06T15:00:00Z',
  },
];

const deckSections = [
  { id: 'brief_decode', title: 'Brief Decode', status: 'complete' },
  { id: 'audience', title: 'Audience Map', status: 'complete' },
  { id: 'competitive', title: 'Competitive Landscape', status: 'complete' },
  { id: 'tension', title: 'Cultural Tension', status: 'running' },
  { id: 'revelation', title: 'The Revelation', status: 'queued' },
  { id: 'manifesto', title: 'Strategic Manifesto', status: 'queued' },
  { id: 'big_idea', title: 'The Big Idea', status: 'queued' },
];

export function ManifestPage() {
  const navigate = useNavigate();
  const { decks, addDeck, setCurrentDeck, isGenerating, setIsGenerating } = useManifestStore();
  const { currentReport } = useInsightStore();
  const [selectedType, setSelectedType] = useState('deck');
  const [brief, setBrief] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  const displayDecks = decks.length > 0 ? decks : mockDecks;

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          const newDeck = {
            id: Date.now().toString(),
            projectId: '1',
            title: brief || 'New Campaign Strategy',
            outputType: selectedType === 'deck' ? 'strategy_deck' : selectedType === 'script' ? 'film_script' : 'social_system',
            sections: [],
            status: 'complete' as const,
            createdAt: new Date().toISOString(),
          };
          
          addDeck(newDeck);
          setBrief('');
          return 100;
        }
        return prev + 8;
      });
    }, 300);
  };

  const handleViewDeck = (deck: typeof mockDecks[0]) => {
    setCurrentDeck(deck);
    navigate(`/manifest/${deck.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full mb-4">
          <FileText className="w-4 h-4 text-green-500" />
          <span className="text-xs font-medium text-green-500 uppercase tracking-wider">Manifest Module</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#F6F6F6] mb-2">
          Build the story
        </h1>
        <p className="text-[#A7A7A7] max-w-lg mx-auto">
          Transform insights into compelling creative. Generate strategy decks, 
          film scripts, and social content systems.
        </p>
      </div>

      {/* Generation Input */}
      <Card className="bg-[#0F0F11] border-white/5">
        <CardContent className="p-6">
          {/* Output Type Selection */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {outputTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  "p-4 border rounded-xl text-left transition-all",
                  selectedType === type.id
                    ? "border-green-500 bg-green-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                )}
              >
                <type.icon className={cn(
                  "w-6 h-6 mb-2",
                  selectedType === type.id ? "text-green-500" : "text-[#A7A7A7]"
                )} />
                <div className="font-medium text-[#F6F6F6] text-sm mb-1">{type.name}</div>
                <div className="text-xs text-[#666]">{type.description}</div>
              </button>
            ))}
          </div>

          {/* Brief Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#A7A7A7] mb-2">
                Campaign Brief
              </label>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder={currentReport 
                  ? `Based on: ${currentReport.subject}...`
                  : "Describe your campaign, objectives, and target audience..."
                }
                rows={4}
                disabled={isGenerating}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#F6F6F6] placeholder:text-[#666] focus:outline-none focus:border-green-500/50 resize-none disabled:opacity-50"
              />
            </div>

            {currentReport && (
              <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-500">
                  Using Insight report: {currentReport.subject}
                </span>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#A7A7A7]">Building sections...</span>
                <span className="text-green-500">{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
              
              <div className="space-y-2">
                {deckSections.map((section) => (
                  <div 
                    key={section.id}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg text-xs",
                      section.status === 'complete' && "bg-green-500/10 text-green-500",
                      section.status === 'running' && "bg-green-500/10 text-green-500 animate-pulse",
                      section.status === 'queued' && "bg-white/5 text-[#666]"
                    )}
                  >
                    <span>{section.title}</span>
                    {section.status === 'complete' && <CheckCircle className="w-3.5 h-3.5" />}
                    {section.status === 'running' && <Sparkles className="w-3.5 h-3.5" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Decks */}
      {displayDecks.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-[#F6F6F6] mb-4">Recent Outputs</h2>
          <div className="space-y-3">
            {displayDecks.map((deck) => (
              <Card 
                key={deck.id}
                className="bg-[#0F0F11] border-white/5 hover:border-white/10 cursor-pointer group transition-all"
                onClick={() => handleViewDeck(deck as any)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-[#F6F6F6]">{deck.title}</h3>
                        {deck.status === 'complete' ? (
                          <span className="flex items-center gap-1 text-xs text-green-500">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Complete
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-green-500">
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            Generating
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-[#666]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(deck.createdAt)}
                        </span>
                        <span className="px-2 py-0.5 bg-white/5 rounded-full capitalize">
                          {deck.outputType?.replace('_', ' ') || 'Strategy Deck'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-2 text-[#666] hover:text-[#F6F6F6] hover:bg-white/10 rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <ArrowRight className="w-5 h-5 text-[#666] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
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
