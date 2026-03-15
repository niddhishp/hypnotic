import { MarketingLayout, proseStyles as s } from './MarketingLayout';
import { SEO } from '@/components/shared/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const POSTS = [
  {
    slug: '#', date: 'Mar 12, 2026', category: 'Product',
    title: 'Introducing Hypnotic: The AI Creative Operating System',
    excerpt: 'Why we built a full pipeline instead of another point solution — and what that means for creative professionals.',
    readTime: '5 min',
  },
  {
    slug: '#', date: 'Mar 5, 2026', category: 'Strategy',
    title: 'The 40% Problem: How Creative Professionals Lose Half Their Day',
    excerpt: 'Our research across 200 creative teams revealed a consistent pattern: tool-switching is the silent productivity killer.',
    readTime: '8 min',
  },
  {
    slug: '#', date: 'Feb 28, 2026', category: 'AI',
    title: 'Why We Built a Dynamic Model Registry Instead of Hard-Coding AI Models',
    excerpt: 'AI generation models evolve weekly. Here\'s how we designed Craft to always offer the best available models without code deploys.',
    readTime: '6 min',
  },
  {
    slug: '#', date: 'Feb 20, 2026', category: 'Case Study',
    title: 'How a Mumbai Agency Cut Campaign Development Time by 60%',
    excerpt: 'A pilot agency ran their entire Q1 campaign through Hypnotic. Here\'s what they learned.',
    readTime: '10 min',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Product: '#C9A96E', Strategy: '#7aaee0', AI: '#a07ae0', 'Case Study': '#7abf8e',
};

export function BlogPage() {
  return (
    <MarketingLayout eyebrow="Blog" title="Thoughts on AI & Creative Work"
      subtitle="Perspectives on the future of creative production, AI tools, and the humans who use them.">
      <SEO title="Blog" description="Perspectives on AI creative tools, workflow design, and the future of advertising production." canonical="/blog" />

      <div className="space-y-4">
        {POSTS.map((post, i) => (
          <Link key={i} to={post.slug}
            className="block p-6 rounded-2xl border border-white/6 hover:border-white/15 transition-all group"
            style={{ background: '#0D0D10' }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                style={{ color: CATEGORY_COLORS[post.category] ?? '#C9A96E', background: `${CATEGORY_COLORS[post.category] ?? '#C9A96E'}15` }}>
                {post.category}
              </span>
              <span className="text-[11px] text-[#444]">{post.date}</span>
              <span className="text-[11px] text-[#333]">· {post.readTime} read</span>
            </div>
            <h2 className="text-base font-medium text-[#F0EDE8] mb-2 group-hover:text-[#C9A96E] transition-colors">{post.title}</h2>
            <p className="text-sm text-[#555] leading-relaxed mb-3">{post.excerpt}</p>
            <span className="flex items-center gap-1.5 text-xs text-[#444] group-hover:text-[#C9A96E] transition-colors">
              Read more <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>
    </MarketingLayout>
  );
}
