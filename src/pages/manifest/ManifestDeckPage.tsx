import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Presentation,
  Scroll,
  Lightbulb,
  Target,
  Users,
  Zap,
  Monitor
} from 'lucide-react';
import { useManifestStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const mockDeck = {
  id: '1',
  projectId: '1',
  title: 'Nike Air Max Q4 Campaign Strategy',
  outputType: 'strategy_deck',
  sections: [
    {
      id: 'brief_decode',
      title: 'Brief Decode',
      content: 'Launch Nike Air Max as the must-have sneaker for the holiday season. Target: Style-conscious athletes aged 22-35. Key insight: They want sneakers that perform on the court and look good on the street.',
      icon: FileText,
    },
    {
      id: 'audience',
      title: 'Audience Map & Psychology',
      content: 'Primary persona: "The Style-Conscious Athlete" — values both performance and aesthetics. They follow sneaker culture on Instagram, shop at premium retailers, and are willing to pay for quality. Secondary: "The Trend Follower" — influenced by celebrity endorsements and limited drops.',
      icon: Users,
    },
    {
      id: 'competitive',
      title: 'Competitive Landscape',
      content: 'Adidas dominates collaborations (Yeezy). New Balance owns comfort. Under Armour struggles with lifestyle credibility. Whitespace: Premium sustainable sneakers that don\'t compromise on style.',
      icon: Target,
    },
    {
      id: 'tension',
      title: 'Cultural Tension & Opportunity',
      content: 'Tension: Athletes feel forced to choose between performance and style. Opportunity: Position Air Max as the "no compromise" choice — the sneaker that performs when you need it and turns heads when you don\'t.',
      icon: Zap,
    },
    {
      id: 'revelation',
      title: 'The Revelation',
      content: 'The best athletes don\'t choose between performance and style — they demand both. Air Max has always been the sneaker for those who refuse to compromise.',
      icon: Lightbulb,
    },
    {
      id: 'manifesto',
      title: 'Strategic Manifesto',
      content: 'We believe that greatness doesn\'t happen in a vacuum. It happens on the street, in the gym, at the party, on the runway. Air Max is for the athletes who live in all these worlds at once.',
      icon: Scroll,
    },
    {
      id: 'big_idea',
      title: 'The Big Idea',
      content: '"No Compromise" — A campaign celebrating athletes who refuse to choose between performance and style. Featuring real athletes who embody this duality: pro basketball players with fashion lines, runners who are also DJs, etc.',
      icon: Lightbulb,
    },
    {
      id: 'creative_voice',
      title: 'Creative Voice & Expression',
      content: 'Tone: Confident but not arrogant. Inclusive but exclusive. Voice: Direct, punchy, urban. Visual: High contrast, dynamic movement, street-meets-court aesthetic.',
      icon: Presentation,
    },
    {
      id: 'hero_concept',
      title: 'Hero Content Concept',
      content: '60-second film featuring 3 athletes in their dual worlds: morning run / evening DJ set, basketball practice / fashion shoot, gym session / art gallery opening. Tagline: "No Compromise. Just Air Max."',
      icon: Monitor,
    },
  ],
  status: 'complete',
  createdAt: '2024-03-07T12:00:00Z',
};

export function ManifestDeckPage() {
  const navigate = useNavigate();
  const { currentDeck } = useManifestStore();
  const deck = currentDeck || mockDeck;
  
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const currentSection = deck.sections[currentSectionIndex];

  const goToPrevious = () => {
    setCurrentSectionIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentSectionIndex(prev => Math.min(deck.sections.length - 1, prev + 1));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button 
            onClick={() => navigate('/manifest')}
            className="flex items-center gap-2 text-sm text-[#A7A7A7] hover:text-[#F6F6F6] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Manifest
          </button>
          <h1 className="text-2xl font-semibold text-[#F6F6F6] mb-2">{deck.title}</h1>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Strategy Deck
            </Badge>
            <span className="text-sm text-[#666]">
              {deck.sections.length} sections
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
            Export PDF
          </Button>
          <Button 
            onClick={() => navigate('/craft')}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Take to Craft
          </Button>
        </div>
      </div>

      {/* Deck Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <Card className="bg-[#0F0F11] border-white/5 lg:col-span-1">
          <CardContent className="p-4">
            <div className="space-y-1">
              {deck.sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentSectionIndex(index)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all",
                    currentSectionIndex === index
                      ? "bg-green-500/10 text-green-500"
                      : "text-[#A7A7A7] hover:bg-white/5 hover:text-[#F6F6F6]"
                  )}
                >
                  <section.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{section.title}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section Content */}
        <Card className="bg-[#0F0F11] border-white/5 lg:col-span-3">
          <CardContent className="p-8">
            {currentSection && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <currentSection.icon className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm text-[#666] mb-1">
                      Section {currentSectionIndex + 1} of {deck.sections.length}
                    </div>
                    <h2 className="text-xl font-medium text-[#F6F6F6]">
                      {currentSection.title}
                    </h2>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-[#A7A7A7] leading-relaxed whitespace-pre-line">
                    {currentSection.content}
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                  <Button
                    variant="outline"
                    onClick={goToPrevious}
                    disabled={currentSectionIndex === 0}
                    className="border-white/10 text-[#F6F6F6] hover:bg-white/5 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-1">
                    {deck.sections.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all",
                          index === currentSectionIndex
                            ? "bg-green-500 w-4"
                            : "bg-white/20"
                        )}
                      />
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={goToNext}
                    disabled={currentSectionIndex === deck.sections.length - 1}
                    className="border-white/10 text-[#F6F6F6] hover:bg-white/5 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
