import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Play,
  CheckCircle,
  Star,
  Zap,
  Shield,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Search,
  FileText,
  Image,
  Share2,
  Network,
  MessageSquare,
  Clock,
  TrendingUp,
  Users,
  Lightbulb,
  Target,
  Palette,
  Layers,
  Video,
  Music,
  Calendar,
  BarChart3,
  Globe,
  Lock,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Navigation items
const navItems = [
  { label: 'Product', href: '#product' },
  { label: 'Modules', href: '#modules' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#resources' },
];

// Trusted by logos (placeholder)
const trustedLogos = [
  'Nike', 'Spotify', 'Adobe', 'Google', 'Meta', 'Netflix'
];

// Features for the product section
const features = [
  {
    icon: Search,
    title: 'Insight',
    description: 'Research brands, audiences, and cultural tensions. Get strategic routes forward.',
    color: 'blue',
    capabilities: ['Brand Analysis', 'Audience Research', 'Competitive Intel', 'Cultural Trends'],
  },
  {
    icon: FileText,
    title: 'Manifest',
    description: 'Generate strategy decks, film scripts, and social content systems.',
    color: 'green',
    capabilities: ['Strategy Decks', 'Film Scripts', 'Social Systems', 'Brand Narratives'],
  },
  {
    icon: Image,
    title: 'Craft',
    description: 'Create images, video, and audio assets. Brand-safe and export-ready.',
    color: 'purple',
    capabilities: ['Image Generation', 'Video Creation', 'Audio Production', 'Asset Library'],
  },
  {
    icon: Share2,
    title: 'Amplify',
    description: 'Schedule, publish, and optimize across all platforms. Predict performance.',
    color: 'red',
    capabilities: ['Multi-Platform', 'Smart Scheduling', 'Performance Prediction', 'Analytics'],
  },
];

// Workflow steps
const workflowSteps = [
  {
    id: 'research',
    title: 'Research',
    description: 'AI analyzes brands, audiences, and cultural trends to uncover strategic insights.',
    icon: Search,
  },
  {
    id: 'strategize',
    title: 'Strategize',
    description: 'Generate comprehensive decks, scripts, and content frameworks.',
    icon: Lightbulb,
  },
  {
    id: 'create',
    title: 'Create',
    description: 'Produce stunning visuals, video, and audio assets aligned with your brand.',
    icon: Palette,
  },
  {
    id: 'amplify',
    title: 'Amplify',
    description: 'Schedule, publish, and optimize content across all platforms.',
    icon: TrendingUp,
  },
];

// Solutions
const solutions = [
  {
    title: 'For Agencies',
    description: 'Scale creative output without scaling headcount. Deliver more campaigns faster.',
    icon: Users,
    stats: '10x faster delivery',
  },
  {
    title: 'For Brands',
    description: 'Bring creative in-house with AI-powered tools that maintain brand consistency.',
    icon: Target,
    stats: '70% cost reduction',
  },
  {
    title: 'For Creators',
    description: 'From idea to published content in hours, not weeks.',
    icon: Zap,
    stats: '5x more output',
  },
];

// Testimonials
const testimonials = [
  {
    quote: "Hypnotic transformed our creative process. What used to take weeks now takes days, and the quality is exceptional.",
    author: "Sarah Chen",
    role: "Creative Director, Wieden+Kennedy",
    avatar: "SC",
  },
  {
    quote: "The AI doesn't replace creativity—it amplifies it. Our best work comes from this collaboration.",
    author: "Marcus Johnson",
    role: "Head of Strategy, Droga5",
    avatar: "MJ",
  },
  {
    quote: "We've cut our strategy development time by 70% while improving the depth of our insights.",
    author: "Elena Rodriguez",
    role: "Founder, Studio Noir",
    avatar: "ER",
  },
];

// Pricing plans
const pricing = [
  {
    name: 'Starter',
    price: 49,
    description: 'For individual creators',
    features: [
      '3 active projects',
      '10 Insight reports/month',
      '100 generation credits',
      'Basic AI models',
      'Email support',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Professional',
    price: 149,
    description: 'For professional teams',
    features: [
      'Unlimited projects',
      'Unlimited reports',
      '500 generation credits',
      'All AI models',
      'Priority support',
      'Team collaboration',
      'API access',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'For large organizations',
    features: [
      'Everything in Professional',
      'Unlimited team seats',
      'Custom AI training',
      'Dedicated account manager',
      'SLA guarantee',
      'SSO & advanced security',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
  },
];

// FAQs
const faqs = [
  {
    question: 'How does Hypnotic work?',
    answer: 'Hypnotic is an AI-powered creative operating system that guides you through the entire campaign lifecycle—from research and strategy to asset creation and distribution. Each module builds on the previous, creating a seamless workflow.',
  },
  {
    question: 'What makes Hypnotic different from other AI tools?',
    answer: 'Unlike generic AI tools, Hypnotic is purpose-built for creative professionals. It understands brand strategy, maintains consistency across assets, and integrates research, creation, and distribution in one platform.',
  },
  {
    question: 'Can I use my own brand guidelines?',
    answer: 'Absolutely. Hypnotic learns your brand voice, visual style, and guidelines to ensure all generated content stays on-brand. You can upload brand books, style guides, and reference materials.',
  },
  {
    question: 'How do credits work?',
    answer: 'Credits are consumed based on the complexity of AI operations. Research reports, image generation, and video creation each use different amounts of credits. Unused credits roll over month-to-month on annual plans.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. We use enterprise-grade encryption, SOC 2 Type II compliance, and never train our AI on your proprietary data. Your campaigns and assets remain completely private.',
  },
];

// AI Tools
const aiTools = [
  { name: 'Brand Research', icon: Search },
  { name: 'Strategy Decks', icon: FileText },
  { name: 'Image Generation', icon: Image },
  { name: 'Video Creation', icon: Video },
  { name: 'Script Writing', icon: MessageSquare },
  { name: 'Social Scheduling', icon: Calendar },
  { name: 'Performance Analytics', icon: BarChart3 },
  { name: 'Team Collaboration', icon: Users },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      {/* Navigation */}
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-[#0B0B0D]/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D8A34A] to-[#B8832F] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#0B0B0D]" />
            </div>
            <span className="font-display font-semibold text-xl text-[#F6F6F6]">Hypnotic</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="text-sm text-[#A7A7A7] hover:text-[#F6F6F6] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
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

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#F6F6F6]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0B0B0D]/95 backdrop-blur-xl border-t border-white/5">
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left text-[#A7A7A7] hover:text-[#F6F6F6] py-2"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/login')}
                  className="w-full border-white/10 text-[#F6F6F6]"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="w-full bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D8A34A]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-[#D8A34A]" />
            <span className="text-sm text-[#A7A7A7]">Now with GPT-4 powered insights</span>
          </div>

          {/* Headline */}
          <h1 className="headline-display text-[#F6F6F6] mb-6">
            The AI studio for
            <br />
            <span className="gradient-text">creative campaigns</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-[#A7A7A7] max-w-2xl mx-auto mb-10">
            Research, strategize, create, and amplify—powered by AI. 
            From brief to launch in hours, not weeks.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D] px-8 h-12 text-base"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white/10 text-[#F6F6F6] hover:bg-white/5 px-8 h-12 text-base"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-6 text-sm text-[#666]">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              14-day free trial
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Cancel anytime
            </span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-[#666] mb-8 uppercase tracking-wider">
            Trusted by leading brands and agencies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {trustedLogos.map((logo) => (
              <div key={logo} className="text-2xl font-semibold text-[#333] hover:text-[#444] transition-colors">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="headline-section text-[#F6F6F6] mb-4">
              Four phases. One seamless flow.
            </h2>
            <p className="text-lg text-[#A7A7A7] max-w-2xl mx-auto">
              Move from insight to execution with AI-powered tools designed for creative professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card 
                key={feature.title}
                className="bg-[#0F0F11] border-white/5 hover:border-white/10 transition-all group overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-6`}>
                    <feature.icon className={`w-7 h-7 text-${feature.color}-500`} />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#F6F6F6] mb-3">{feature.title}</h3>
                  <p className="text-[#A7A7A7] mb-6">{feature.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.capabilities.map((cap) => (
                      <span 
                        key={cap}
                        className="px-3 py-1 bg-white/5 rounded-full text-xs text-[#A7A7A7]"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="modules" className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="headline-section text-[#F6F6F6] mb-6">
                From brief to launch in hours, not weeks
              </h2>
              <p className="text-lg text-[#A7A7A7] mb-10">
                Our four-phase workflow guides you from initial research through to published content, 
                with AI assisting at every step.
              </p>
              
              <div className="space-y-6">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#D8A34A]/10 flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-5 h-5 text-[#D8A34A]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#666] font-mono">0{index + 1}</span>
                        <h4 className="font-semibold text-[#F6F6F6]">{step.title}</h4>
                      </div>
                      <p className="text-sm text-[#A7A7A7]">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D8A34A]/20 to-purple-500/20 rounded-2xl blur-2xl" />
              <img 
                src="/images/hero_portrait.jpg" 
                alt="Hypnotic Dashboard"
                className="relative rounded-2xl border border-white/10 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="headline-section text-[#F6F6F6] mb-4">
              Built for every creative team
            </h2>
            <p className="text-lg text-[#A7A7A7] max-w-2xl mx-auto">
              Whether you're an agency, brand, or independent creator, Hypnotic scales to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {solutions.map((solution) => (
              <Card 
                key={solution.title}
                className="bg-[#0F0F11] border-white/5 hover:border-white/10 transition-all"
              >
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-[#D8A34A]/10 flex items-center justify-center mb-6">
                    <solution.icon className="w-6 h-6 text-[#D8A34A]" />
                  </div>
                  <div className="text-sm text-[#D8A34A] font-medium mb-2">{solution.stats}</div>
                  <h3 className="text-xl font-semibold text-[#F6F6F6] mb-3">{solution.title}</h3>
                  <p className="text-[#A7A7A7]">{solution.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Grid */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="headline-section text-[#F6F6F6] mb-4">
              AI tools for every creative need
            </h2>
            <p className="text-lg text-[#A7A7A7]">
              Accelerate production with features designed to complement your workflow
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {aiTools.map((tool) => (
              <div 
                key={tool.name}
                className="p-6 bg-[#0F0F11] border border-white/5 rounded-xl hover:border-white/10 transition-all group cursor-pointer"
              >
                <tool.icon className="w-8 h-8 text-[#A7A7A7] group-hover:text-[#D8A34A] transition-colors mb-4" />
                <span className="text-[#F6F6F6] font-medium">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="headline-section text-[#F6F6F6] mb-4">
              Loved by creative professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author} className="bg-[#0F0F11] border-white/5">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D8A34A] text-[#D8A34A]" />
                    ))}
                  </div>
                  <p className="text-[#F6F6F6] mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D8A34A] to-[#B8832F] flex items-center justify-center">
                      <span className="text-sm font-medium text-[#0B0B0D]">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-medium text-[#F6F6F6]">{testimonial.author}</div>
                      <div className="text-sm text-[#666]">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="headline-section text-[#F6F6F6] mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-[#A7A7A7]">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <Card 
                key={plan.name}
                className={cn(
                  "bg-[#0F0F11] border-white/5 relative",
                  plan.popular && "border-[#D8A34A]/50"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-[#D8A34A] text-[#0B0B0D] text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-[#F6F6F6] mb-1">{plan.name}</h3>
                  <p className="text-sm text-[#666] mb-4">{plan.description}</p>
                  <div className="mb-6">
                    {plan.price ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-[#F6F6F6]">${plan.price}</span>
                        <span className="text-[#666]">/month</span>
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-[#F6F6F6]">Custom</div>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-[#A7A7A7]">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={cn(
                      "w-full",
                      plan.popular 
                        ? "bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D]" 
                        : "border-white/10 text-[#F6F6F6] hover:bg-white/5"
                    )}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate(plan.price ? '/signup' : '/contact')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="resources" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="headline-section text-[#F6F6F6] mb-4">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-[#0F0F11] border border-white/5 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-medium text-[#F6F6F6]">{faq.question}</span>
                  {activeFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-[#666]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#666]" />
                  )}
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-[#A7A7A7]">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D8A34A]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="headline-section text-[#F6F6F6] mb-6">
            Ready to create campaigns that feel inevitable?
          </h2>
          <p className="text-xl text-[#A7A7A7] mb-8">
            Join thousands of creative professionals using Hypnotic to transform their workflow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-[#D8A34A] hover:bg-[#e5b55c] text-[#0B0B0D] px-8 h-12 text-base"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/contact')}
              className="border-white/10 text-[#F6F6F6] hover:bg-white/5 px-8 h-12 text-base"
            >
              Contact Sales
            </Button>
          </div>
          <p className="mt-6 text-sm text-[#666]">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D8A34A] to-[#B8832F] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#0B0B0D]" />
                </div>
                <span className="font-display font-semibold text-xl text-[#F6F6F6]">Hypnotic</span>
              </div>
              <p className="text-[#666] mb-4 max-w-xs">
                The AI Creative Operating System for modern marketing teams.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-[#666] hover:text-[#F6F6F6]">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="text-[#666] hover:text-[#F6F6F6]">
                  <MessageSquare className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-medium text-[#F6F6F6] mb-4">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'API', 'Integrations'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[#666] hover:text-[#F6F6F6] text-sm">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-[#F6F6F6] mb-4">Resources</h4>
              <ul className="space-y-2">
                {['Documentation', 'Tutorials', 'Blog', 'Community'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[#666] hover:text-[#F6F6F6] text-sm">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-[#F6F6F6] mb-4">Company</h4>
              <ul className="space-y-2">
                {['About', 'Careers', 'Contact', 'Privacy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[#666] hover:text-[#F6F6F6] text-sm">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#666]">
              © 2024 Hypnotic. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-[#666]">
              <a href="#" className="hover:text-[#F6F6F6]">Privacy Policy</a>
              <a href="#" className="hover:text-[#F6F6F6]">Terms of Service</a>
              <a href="#" className="hover:text-[#F6F6F6]">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
