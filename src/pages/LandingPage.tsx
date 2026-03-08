import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  FileText, 
  Image, 
  Share2,
  Play,
  CheckCircle,
  Star,
  Zap,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Search,
    title: 'Insight',
    description: 'Research brands, audiences, and cultural tensions. Get strategic routes forward.',
    color: 'blue',
  },
  {
    icon: FileText,
    title: 'Manifest',
    description: 'Generate strategy decks, film scripts, and social content systems.',
    color: 'green',
  },
  {
    icon: Image,
    title: 'Craft',
    description: 'Create images, video, and audio assets. Brand-safe and export-ready.',
    color: 'purple',
  },
  {
    icon: Share2,
    title: 'Amplify',
    description: 'Schedule, publish, and optimize across all platforms. Predict performance.',
    color: 'red',
  },
];

const testimonials = [
  {
    quote: "Hypnotic cut our strategy development time by 70%. The research quality is incredible.",
    author: "Sarah Chen",
    role: "Creative Director, Wieden+Kennedy",
  },
  {
    quote: "We went from brief to campaign assets in 48 hours. This is the future of advertising.",
    author: "Marcus Johnson",
    role: "Head of Strategy, Droga5",
  },
  {
    quote: "The AI doesn't replace creativity—it amplifies it. Our best work comes from this collaboration.",
    author: "Elena Rodriguez",
    role: "Founder, Studio Noir",
  },
];

const pricing = [
  {
    name: 'Starter',
    price: 19,
    description: 'For individual creators',
    features: ['3 projects', '5 Insight reports/month', '50 generation credits', 'Basic models'],
  },
  {
    name: 'Pro',
    price: 49,
    description: 'For professional teams',
    features: ['Unlimited projects', 'Unlimited reports', '200 generation credits', 'All models', 'Priority support'],
    popular: true,
  },
  {
    name: 'Agency',
    price: 149,
    description: 'For agencies at scale',
    features: ['5 team seats', '1000 credits', 'White-label exports', 'API access', 'Dedicated manager'],
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0B0D]/80 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D8A34A] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#0B0B0D]" />
            </div>
            <span className="font-display font-semibold text-xl text-[#F6F6F6]">Hypnotic</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[#A7A7A7] hover:text-[#F6F6F6]">Features</a>
            <a href="#pricing" className="text-sm text-[#A7A7A7] hover:text-[#F6F6F6]">Pricing</a>
            <a href="#testimonials" className="text-sm text-[#A7A7A7] hover:text-[#F6F6F6]">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="text-[#A7A7A7] hover:text-[#F6F6F6]"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D8A34A]/10 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-[#D8A34A]" />
            <span className="text-sm text-[#D8A34A]">Now with GPT-4 powered insights</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold text-[#F6F6F6] mb-6 leading-tight">
            Campaigns that feel<br />
            <span className="text-[#D8A34A]">inevitable</span>
          </h1>
          <p className="text-xl text-[#A7A7A7] max-w-2xl mx-auto mb-10">
            The AI Creative Operating System. Research, strategize, create, and amplify—
            all in one powerful platform.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D] px-8"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white/10 text-[#F6F6F6] hover:bg-white/5 px-8"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>
          
          {/* Hero Image */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-transparent z-10" />
            <img 
              src="/images/hero_portrait.jpg" 
              alt="Hypnotic Dashboard"
              className="w-full max-w-5xl mx-auto rounded-2xl border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#F6F6F6] mb-4">
              Four phases. One seamless flow.
            </h2>
            <p className="text-[#A7A7A7] max-w-2xl mx-auto">
              Move from insight to execution with AI-powered tools designed for creative professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={feature.title} className="bg-[#0F0F11] border-white/5 hover:border-white/10 transition-all group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-500`} />
                  </div>
                  <h3 className="text-xl font-medium text-[#F6F6F6] mb-2">{feature.title}</h3>
                  <p className="text-[#A7A7A7]">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-[#F6F6F6] mb-6">
                From brief to launch in hours, not weeks
              </h2>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Research', desc: 'AI analyzes brands, audiences, and cultural trends' },
                  { step: '02', title: 'Strategize', desc: 'Generate decks, scripts, and content systems' },
                  { step: '03', title: 'Create', desc: 'Produce images, video, and audio assets' },
                  { step: '04', title: 'Amplify', desc: 'Schedule and optimize across all platforms' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#D8A34A]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-[#D8A34A]">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#F6F6F6]">{item.title}</h4>
                      <p className="text-sm text-[#A7A7A7]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="/images/manifest_portrait.jpg" 
                alt="Workflow"
                className="rounded-2xl border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#F6F6F6] mb-4">
              Loved by creative teams
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author} className="bg-[#0F0F11] border-white/5">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D8A34A] text-[#D8A34A]" />
                    ))}
                  </div>
                  <p className="text-[#F6F6F6] mb-4">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-medium text-[#F6F6F6]">{testimonial.author}</div>
                    <div className="text-sm text-[#A7A7A7]">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#F6F6F6] mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-[#A7A7A7]">Start free, scale as you grow</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricing.map((plan) => (
              <Card 
                key={plan.name} 
                className={`bg-[#0F0F11] border-white/5 ${plan.popular ? 'border-[#D8A34A]/50' : ''}`}
              >
                <CardContent className="p-6">
                  {plan.popular && (
                    <div className="mb-4 px-3 py-1 bg-[#D8A34A]/20 text-[#D8A34A] text-xs rounded-full inline-block">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-medium text-[#F6F6F6] mb-1">{plan.name}</h3>
                  <p className="text-sm text-[#A7A7A7] mb-4">{plan.description}</p>
                  <div className="text-4xl font-semibold text-[#F6F6F6] mb-6">
                    ${plan.price}
                    <span className="text-lg text-[#666]">/mo</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-[#A7A7A7]">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]' 
                        : 'border-white/10 text-[#F6F6F6] hover:bg-white/5'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/signup')}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-[#F6F6F6] mb-6">
            Ready to create campaigns that feel inevitable?
          </h2>
          <p className="text-xl text-[#A7A7A7] mb-8">
            Join thousands of creative professionals using Hypnotic to transform their workflow.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D] px-8"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="mt-4 text-sm text-[#666]">14-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D8A34A] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#0B0B0D]" />
            </div>
            <span className="font-display font-semibold text-[#F6F6F6]">Hypnotic</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#A7A7A7]">
            <a href="#" className="hover:text-[#F6F6F6]">Privacy</a>
            <a href="#" className="hover:text-[#F6F6F6]">Terms</a>
            <a href="#" className="hover:text-[#F6F6F6]">Contact</a>
          </div>
          <div className="text-sm text-[#666]">
            © 2024 Hypnotic. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
