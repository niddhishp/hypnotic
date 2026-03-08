import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Static data ───────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  'Brand Research', 'Strategy Decks', 'Film Scripts', 'AI Image Generation',
  'Video Production', 'Voice Generation', 'Social Scheduling', 'Performance Prediction',
  'Expert Marketplace', 'Brand Archetypes', 'Audience Mapping', 'Creative Briefs',
];

const STATS = [
  { value: '4',   label: 'Integrated Modules' },
  { value: '50+', label: 'AI Generation Models' },
  { value: '7',   label: 'Publishing Platforms' },
  { value: '12',  label: 'Brand Archetypes' },
  { value: '∞',   label: 'Creative Possibilities' },
];

const MODULES = [
  {
    num: '01 / 04', chip: 'Insight', chipClass: 'chip-insight', cardClass: 'card-insight',
    title: 'Research that thinks\nlike a strategist',
    desc: 'Enter a brand, product, or campaign problem. Hypnotic searches across dozens of sources simultaneously, synthesises findings, and delivers a full strategic intelligence report — with audience personas, competitor maps, and cultural tensions.',
    features: [
      'Multi-source parallel research across 8 categories',
      'Brand archetype assignment with confidence scoring',
      'Audience persona mapping with psychographic depth',
      'Competitive landscape and whitespace identification',
      '3 strategic routes with risk and impact ratings',
      'One-click handoff to Manifest',
    ],
  },
  {
    num: '02 / 04', chip: 'Manifest', chipClass: 'chip-manifest', cardClass: 'card-manifest',
    title: 'Creative development\nat agency speed',
    desc: 'From strategy to creative output in minutes. Manifest generates full strategy decks, film scripts in proper screenplay format, social content systems, and campaign narratives — streaming section by section so you never wait.',
    features: [
      '15-section strategy decks with export to PDF & PPTX',
      'Full film scripts in Courier Prime screenplay format',
      'Character bibles and world-building documents',
      'Auto-storyboard generation from scene descriptions',
      'Social content systems with platform-native formats',
      'Upload your own brief — Insight not required',
    ],
  },
  {
    num: '03 / 04', chip: 'Craft', chipClass: 'chip-craft', cardClass: 'card-craft',
    title: 'AI production studio\nwith every model',
    desc: 'Access every major AI generation model — FLUX, Runway, Kling, ElevenLabs, Suno — from a single interface. The model registry updates automatically so Craft always offers the latest generation capabilities.',
    features: [
      'Image generation: FLUX 1.1 Pro, SDXL, Ideogram, and more',
      'Video generation: Runway Gen-3, Kling, Luma Dream Machine',
      'Voiceover: ElevenLabs with voice cloning support',
      'Music generation: Suno, Udio, custom instrumentals',
      'Dynamic model registry — always current, no code updates',
      'Asset review workflow before distribution',
    ],
  },
  {
    num: '04 / 04', chip: 'Amplify', chipClass: 'chip-amplify', cardClass: 'card-amplify',
    title: 'Distribution with\nbuilt-in intelligence',
    desc: 'Amplify takes approved assets and packages them for every platform automatically — adapting dimensions, captions, and hashtags. Then it tells you when to post, predicts performance, and publishes directly.',
    features: [
      'Auto-adapt content for Instagram, TikTok, LinkedIn, X, YouTube',
      'AI performance prediction before you schedule',
      'Visual content calendar with drag-to-reorder',
      'A/B testing framework with winner selection',
      'Optimal posting time recommendations',
      'Direct publishing to all connected platforms',
    ],
  },
];

const PIPELINE = [
  { num: '01', label: 'Insight',  color: '#7aaee0', title: 'Understand the problem', body: "Research, diagnose, and define. Hypnotic searches 8 source categories in parallel and surfaces the central tension your campaign needs to address.", hasArrow: true },
  { num: '02', label: 'Manifest', color: '#d4c07a', title: 'Build the creative',       body: "Deck, script, or system. Manifest takes Insight's strategic foundation and develops full creative output — streaming in real time so you can direct as it generates.", hasArrow: true },
  { num: '03', label: 'Craft',    color: '#7abf8e', title: 'Produce the assets',       body: "Images, video, audio. Craft generates production-ready assets from Manifest's scripts and storyboards, using the best available AI model for each task.", hasArrow: true },
  { num: '04', label: 'Amplify',  color: '#d48080', title: 'Reach the audience',       body: "Adapt, schedule, publish. Amplify handles the last mile — platform optimisation, timing intelligence, direct publishing, and performance tracking.", hasArrow: false },
];

const EXPERTS = [
  { emoji: '🎯', name: 'Brand Strategist',      role: '15 yrs · Global campaigns · Available now',       chipClass: 'chip-insight',  label: 'Insight'  },
  { emoji: '✍️', name: 'Senior Copywriter',      role: 'Award-winning · TV, digital, OOH · 12h response', chipClass: 'chip-manifest', label: 'Manifest' },
  { emoji: '🎬', name: 'Creative Director',      role: 'Film + digital · Cannes Lions finalist · 24h',    chipClass: 'chip-craft',    label: 'Craft'    },
  { emoji: '📊', name: 'Performance Strategist', role: '$50M+ ad spend · Meta, TikTok, YouTube',          chipClass: 'chip-amplify',  label: 'Amplify'  },
];

const SKILLS = ['Brand Strategy', 'Screenwriting', 'Art Direction', 'Media Planning', 'Copywriting', 'Motion Design', 'Music Production', 'Performance Marketing'];

const FEATURES = [
  { icon: '🧠', title: 'Multi-agent AI orchestration',   body: 'Parallel AI agents run simultaneously across research categories, each specialised for a different type of analysis. No waiting for one to finish before the next begins.' },
  { icon: '⚡', title: 'Real-time streaming generation',  body: 'Manifest and Craft stream output section by section. You see the strategy deck build in real time. You watch the script write itself. No blank screens.' },
  { icon: '🔄', title: 'Dynamic model registry',          body: "The AI generation landscape evolves weekly. Craft's model list auto-updates — you always have access to the latest and best models without any updates required." },
  { icon: '🗺️', title: 'Visual node workspace',           body: 'See your entire campaign as a connected node graph. Describe a campaign in chat — Hypnotic builds the workflow automatically as draggable, editable nodes.' },
  { icon: '💬', title: 'Context-aware AI assistant',      body: 'The floating AI chat knows everything in your project — your Insight report, your active deck, your approved assets. Ask anything. It directs and navigates.' },
  { icon: '🔐', title: 'Enterprise-grade security',       body: 'Row Level Security on every table. No data crosses between accounts. All AI API keys server-side. CSP headers. SOC2-ready infrastructure on Supabase + Vercel.' },
  { icon: '📦', title: 'Platform-native packaging',       body: "Amplify auto-adapts your assets — dimensions, caption length, hashtag count — to every platform's exact requirements. One approval, every format." },
  { icon: '📊', title: 'Performance prediction',          body: 'Before you schedule, Amplify predicts reach, engagement rate, and optimal posting time — based on content type, audience fit, and competitive activity.' },
  { icon: '🔀', title: 'A/B testing framework',           body: 'Run multiple creative variants in parallel. Define your success metric. Amplify tracks results and identifies the winner — then promotes it automatically.' },
];

const PLANS = [
  {
    tier: 'Starter', price: '24', featured: false,
    desc: 'For independent creators and early-stage founders building their first campaigns.',
    btnClass: 'btn-pricing-outline', btnLabel: 'Get started free',
    features: [
      { text: '3 active projects', on: true }, { text: '5 Insight reports per month', on: true },
      { text: '3 Manifest decks per month', on: true }, { text: '50 generation credits (Craft)', on: true },
      { text: 'Core AI models (image + voice)', on: true }, { text: '2 publishing platforms (Amplify)', on: true },
      { text: '+Human marketplace', on: false }, { text: 'Node workspace', on: false }, { text: 'Team seats', on: false },
    ],
  },
  {
    tier: 'Pro', price: '59', featured: true,
    desc: 'For creative professionals, strategists, and solo agencies doing serious work.',
    btnClass: 'btn-pricing-gold', btnLabel: 'Start Pro free',
    features: [
      { text: 'Unlimited projects', on: true }, { text: 'Unlimited Insight reports', on: true },
      { text: 'Unlimited Manifest decks', on: true }, { text: '200 generation credits (Craft)', on: true },
      { text: 'All models including premium video', on: true }, { text: 'All 7 publishing platforms', on: true },
      { text: '+Human marketplace access', on: true }, { text: 'Node workspace', on: true }, { text: 'Team seats', on: false },
    ],
  },
  {
    tier: 'Agency', price: '179', featured: false,
    desc: 'For agencies, studios, and brand teams running multiple client campaigns simultaneously.',
    btnClass: 'btn-pricing-outline', btnLabel: 'Contact sales',
    features: [
      { text: 'Everything in Pro', on: true }, { text: '5 team seats', on: true },
      { text: '1,000 generation credits', on: true }, { text: 'White-label PDF reports', on: true },
      { text: 'Priority +Human matching', on: true }, { text: 'Custom brand guidelines enforcement', on: true },
      { text: 'API access', on: true }, { text: 'Dedicated account manager', on: true }, { text: 'SSO + advanced permissions', on: true },
    ],
  },
];

const TESTIMONIALS = [
  { emoji: '⚡', quote: '"The Insight module replaced three weeks of agency briefing prep. I walked into the client meeting with competitive intelligence and audience personas that usually take a junior researcher two weeks to compile."', name: 'Independent brand strategist', role: '10 years at global agencies, now solo' },
  { emoji: '🎬', quote: '"I used Manifest to write the first draft of a short film script from my Insight report. It understood the world-building, the character tensions. The draft was 60% of the final script — that\'s extraordinary for an AI first pass."', name: 'Independent filmmaker', role: 'Documentary and branded content director' },
  { emoji: '📱', quote: '"We run social for six brand clients. Amplify\'s packaging and scheduling alone saved us 12 hours a week. Combined with the +Human marketplace, we can now take on more clients without hiring."', name: 'Social media agency founder', role: '4-person studio, 6 active clients' },
];

// ─── Hooks ─────────────────────────────────────────────────────────────────────

function useFadeUp() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.lp-fade-up');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('lp-visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.lp-hero .lp-fade-up').forEach(el => el.classList.add('lp-visible'));
    }, 80);
    return () => io.disconnect();
  }, []);
}

function useCounterAnimation() {
  const started = useRef(false);
  useEffect(() => {
    const statEls = document.querySelectorAll<HTMLElement>('.lp-stat-number[data-target]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          statEls.forEach(el => {
            const raw = el.dataset.target ?? '';
            const num = parseInt(raw);
            if (!isNaN(num)) {
              let cur = 0;
              const step = num / (1200 / 16);
              const hasSuffix = raw.includes('+');
              const timer = setInterval(() => {
                cur += step;
                if (cur >= num) { el.textContent = raw; clearInterval(timer); }
                else { el.textContent = Math.floor(cur) + (hasSuffix ? '+' : ''); }
              }, 16);
            }
          });
          io.disconnect();
        }
      });
    }, { threshold: 0.5 });
    const bar = document.querySelector('.lp-stat-bar');
    if (bar) io.observe(bar);
    return () => io.disconnect();
  }, []);
}

function useGridStagger() {
  useEffect(() => {
    const grids = document.querySelectorAll<HTMLElement>('.lp-stagger-grid');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll<HTMLElement>('.lp-stagger-item');
          cards.forEach((card, idx) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            card.style.transition = `opacity 0.5s ease ${idx * 0.08}s, transform 0.5s ease ${idx * 0.08}s`;
            setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 60);
          });
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    grids.forEach(g => io.observe(g));
    return () => io.disconnect();
  }, []);
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function LandingPage() {
  const navigate = useNavigate();
  useFadeUp();
  useCounterAnimation();
  useGridStagger();
  const marqueeItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Courier+Prime:ital@0;1&display=swap');
        :root{--lpb:#08080A;--lps:#0F0F12;--lps2:#141418;--lpbr:rgba(255,255,255,0.08);--lpg:#C9A96E;--lpgd:rgba(201,169,110,0.15);--lpw:#F0EDE8;--lpw5:rgba(240,237,232,0.5);--lpw3:rgba(240,237,232,0.3)}
        .lp-root{font-family:'DM Sans',sans-serif;background:var(--lpb);color:var(--lpw);overflow-x:hidden;-webkit-font-smoothing:antialiased;min-height:100vh}
        .lp-root *,.lp-root *::before,.lp-root *::after{box-sizing:border-box;margin:0;padding:0}
        .lp-go{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px);background-size:80px 80px}
        .lp-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:64px;border-bottom:1px solid var(--lpbr);background:rgba(8,8,10,0.8);backdrop-filter:blur(20px)}
        .lp-logo{font-family:'DM Serif Display',serif;font-size:1.35rem;letter-spacing:.15em;color:var(--lpw);text-transform:uppercase}
        .lp-logo span{color:var(--lpg)}
        .lp-navlinks{display:flex;gap:40px;list-style:none}
        .lp-navlinks a{font-size:.8rem;font-weight:400;letter-spacing:.05em;color:var(--lpw5);text-decoration:none;text-transform:uppercase;transition:color .2s}
        .lp-navlinks a:hover{color:var(--lpw)}
        .lp-navcta{display:flex;align-items:center;gap:16px}
        .lp-bg{font-size:.8rem;font-weight:400;letter-spacing:.05em;color:var(--lpw5);text-transform:uppercase;transition:color .2s;cursor:pointer;background:none;border:none}
        .lp-bg:hover{color:var(--lpw)}
        .lp-bp{display:inline-flex;align-items:center;gap:8px;font-size:.8rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;padding:10px 24px;border-radius:4px;background:var(--lpg);color:#08080A;transition:opacity .2s;cursor:pointer;border:none}
        .lp-bp:hover{opacity:.88}
        .lp-hero{position:relative;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:120px 48px 80px;text-align:center;overflow:hidden}
        .lp-orb{position:absolute;border-radius:50%;filter:blur(120px);pointer-events:none}
        .lp-o1{width:600px;height:600px;top:-100px;left:50%;transform:translateX(-50%);background:radial-gradient(circle,rgba(201,169,110,.12) 0%,transparent 70%);animation:lpoa 8s ease-in-out infinite}
        .lp-o2{width:400px;height:400px;bottom:-50px;left:10%;background:radial-gradient(circle,rgba(74,107,165,.1) 0%,transparent 70%);animation:lpob 10s ease-in-out infinite 2s}
        .lp-o3{width:350px;height:350px;bottom:50px;right:8%;background:radial-gradient(circle,rgba(74,122,90,.08) 0%,transparent 70%);animation:lpob 12s ease-in-out infinite 4s}
        @keyframes lpoa{0%,100%{opacity:.6;transform:translateX(-50%) scale(1)}50%{opacity:1;transform:translateX(-50%) scale(1.1)}}
        @keyframes lpob{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.9;transform:scale(1.12)}}
        .lp-eyebrow{font-size:.7rem;font-weight:500;letter-spacing:.25em;text-transform:uppercase;color:var(--lpg);margin-bottom:28px;display:inline-flex;align-items:center;gap:12px}
        .lp-eyebrow::before,.lp-eyebrow::after{content:'';display:inline-block;width:32px;height:1px;background:var(--lpg);opacity:.5}
        .lp-ht{font-family:'DM Serif Display',serif;font-size:clamp(3.5rem,8vw,7.5rem);line-height:1.0;font-weight:400;letter-spacing:-.02em;color:var(--lpw);max-width:900px;margin:0 auto 12px}
        .lp-ht em{font-style:italic;color:var(--lpg)}
        .lp-hs{font-size:clamp(1rem,2vw,1.25rem);font-weight:300;line-height:1.6;color:var(--lpw5);max-width:600px;margin:20px auto 48px}
        .lp-ha{display:flex;align-items:center;gap:20px;justify-content:center;flex-wrap:wrap}
        .lp-bh{display:inline-flex;align-items:center;gap:10px;padding:16px 36px;border-radius:4px;font-size:.875rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;border:none;transition:all .2s;text-decoration:none}
        .lp-bhp{background:var(--lpg);color:#08080A}
        .lp-bhp:hover{opacity:.88;transform:translateY(-1px)}
        .lp-bhs{background:transparent;color:var(--lpw5);border:1px solid var(--lpbr)}
        .lp-bhs:hover{color:var(--lpw);border-color:rgba(255,255,255,.2)}
        .lp-hpipe{display:flex;align-items:center;margin-top:72px;border:1px solid var(--lpbr);border-radius:6px;overflow:hidden;backdrop-filter:blur(12px)}
        .lp-ps{padding:16px 32px;font-size:.75rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;border-right:1px solid var(--lpbr);transition:background .3s;cursor:default}
        .lp-ps:last-of-type{border-right:none}
        .lp-ps:hover{background:rgba(255,255,255,.04)}
        .lp-ps.insight{color:#7aaee0}.lp-ps.manifest{color:#d4c07a}.lp-ps.craft{color:#7abf8e}.lp-ps.amplify{color:#d48080}
        .lp-pa{font-size:.7rem;color:var(--lpw3);padding:0 2px}
        .lp-fade-up{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease}
        .lp-fade-up.lp-visible{opacity:1;transform:translateY(0)}
        .lp-d1{transition-delay:.1s}.lp-d2{transition-delay:.2s}.lp-d3{transition-delay:.3s}
        .lp-mq{padding:40px 0;border-top:1px solid var(--lpbr);border-bottom:1px solid var(--lpbr);overflow:hidden;position:relative;z-index:1}
        .lp-mqt{display:flex;gap:64px;white-space:nowrap;animation:lpmq 30s linear infinite}
        .lp-mqi{font-size:.75rem;font-weight:400;letter-spacing:.12em;text-transform:uppercase;color:var(--lpw3);flex-shrink:0}
        .lp-mqd{color:var(--lpg);opacity:.5;flex-shrink:0;font-size:.5rem}
        @keyframes lpmq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .lp-sb{display:flex;align-items:center;justify-content:center;gap:64px;padding:48px;border-top:1px solid var(--lpbr);border-bottom:1px solid var(--lpbr);position:relative;z-index:1}
        .lp-si{text-align:center}
        .lp-sn{font-family:'DM Serif Display',serif;font-size:2.5rem;color:var(--lpw);line-height:1}
        .lp-sl{font-size:.75rem;color:var(--lpw3);letter-spacing:.08em;margin-top:6px;text-transform:uppercase}
        .lp-sd{width:1px;height:48px;background:var(--lpbr);flex-shrink:0}
        .lp-sec{position:relative;z-index:1}
        .lp-inn{max-width:1200px;margin:0 auto;padding:0 48px}
        .lp-slbl{font-size:.7rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--lpg);opacity:.8;margin-bottom:16px}
        .lp-stit{font-family:'DM Serif Display',serif;font-size:clamp(2rem,4vw,3.5rem);line-height:1.15;font-weight:400;color:var(--lpw);margin-bottom:20px}
        .lp-stit em{font-style:italic;color:var(--lpg)}
        .lp-sbdy{font-size:1.0625rem;line-height:1.7;color:var(--lpw5);max-width:560px}
        .lp-mods{padding:120px 0;background:linear-gradient(to bottom,transparent,var(--lps),transparent)}
        .lp-mhd{text-align:center;margin-bottom:80px}
        .lp-mgrid{display:grid;grid-template-columns:1fr 1fr;gap:2px;border:1px solid var(--lpbr);border-radius:8px;overflow:hidden}
        .lp-mc{padding:56px 48px;background:var(--lps);position:relative;overflow:hidden;transition:background .3s;cursor:default}
        .lp-mc:hover{background:var(--lps2)}
        .lp-mc:nth-child(2){border-left:1px solid var(--lpbr)}
        .lp-mc:nth-child(3){border-top:1px solid var(--lpbr)}
        .lp-mc:nth-child(4){border-top:1px solid var(--lpbr);border-left:1px solid var(--lpbr)}
        .lp-mnum{font-family:'Courier Prime',monospace;font-size:.7rem;color:var(--lpw3);letter-spacing:.1em;margin-bottom:24px;display:block}
        .lp-chip{display:inline-flex;align-items:center;padding:5px 12px;border-radius:3px;font-size:.65rem;font-weight:500;letter-spacing:.15em;text-transform:uppercase;margin-bottom:24px;border:1px solid}
        .chip-insight{color:#7aaee0;border-color:rgba(122,174,224,.25);background:rgba(122,174,224,.06)}
        .chip-manifest{color:#d4c07a;border-color:rgba(212,192,122,.25);background:rgba(212,192,122,.06)}
        .chip-craft{color:#7abf8e;border-color:rgba(122,191,142,.25);background:rgba(122,191,142,.06)}
        .chip-amplify{color:#d48080;border-color:rgba(212,128,128,.25);background:rgba(212,128,128,.06)}
        .lp-mtit{font-family:'DM Serif Display',serif;font-size:2rem;line-height:1.1;font-weight:400;color:var(--lpw);margin-bottom:16px;white-space:pre-line}
        .lp-mdsc{font-size:.9375rem;line-height:1.65;color:var(--lpw5);margin-bottom:32px}
        .lp-mft{list-style:none;display:flex;flex-direction:column;gap:10px}
        .lp-mft li{font-size:.8125rem;color:var(--lpw3);display:flex;align-items:flex-start;gap:10px;line-height:1.5}
        .lp-mft li::before{content:'→';color:var(--lpg);opacity:.6;flex-shrink:0;margin-top:1px;font-size:.75rem}
        .lp-mglow{position:absolute;bottom:-60px;right:-60px;width:200px;height:200px;border-radius:50%;filter:blur(80px);pointer-events:none;opacity:.3}
        .card-insight .lp-mglow{background:#4A6FA5}.card-manifest .lp-mglow{background:#7A6E45}.card-craft .lp-mglow{background:#4A7A5A}.card-amplify .lp-mglow{background:#8A4A4A}
        .lp-pipe-sec{padding:120px 0}
        .lp-pipe-hdr{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:end;margin-bottom:64px}
        .lp-pvis{display:flex;align-items:stretch;border:1px solid var(--lpbr);border-radius:6px;overflow:hidden}
        .lp-pcol{flex:1;padding:40px 32px;border-right:1px solid var(--lpbr);position:relative;transition:background .2s}
        .lp-pcol:last-child{border-right:none}
        .lp-pcol:hover{background:rgba(255,255,255,.02)}
        .lp-pnum{font-family:'Courier Prime',monospace;font-size:.65rem;color:var(--lpw3);letter-spacing:.1em;margin-bottom:20px}
        .lp-plbl{font-size:.7rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;margin-bottom:16px}
        .lp-ptit{font-family:'DM Serif Display',serif;font-size:1.5rem;line-height:1.2;margin-bottom:12px;color:var(--lpw)}
        .lp-pbdy{font-size:.8125rem;line-height:1.6;color:var(--lpw3)}
        .lp-pcon{position:absolute;right:-12px;top:50%;transform:translateY(-50%);width:24px;height:24px;background:var(--lpg);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.6rem;color:#08080A;font-weight:700;z-index:2}
        .lp-hum{padding:120px 0;background:var(--lps);border-top:1px solid var(--lpbr);border-bottom:1px solid var(--lpbr)}
        .lp-hgrid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .lp-hbdg{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:4px;border:1px solid rgba(201,169,110,.3);background:var(--lpgd);font-size:.75rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--lpg);margin-bottom:24px}
        .lp-hbdg::before{content:'+';font-weight:700;font-size:1rem}
        .lp-htit{font-family:'DM Serif Display',serif;font-size:clamp(2rem,4vw,3rem);line-height:1.15;color:var(--lpw);margin-bottom:16px}
        .lp-htit em{font-style:italic;color:var(--lpg)}
        .lp-hbdy{font-size:1rem;line-height:1.7;color:var(--lpw5);margin-bottom:36px}
        .lp-hbdy strong{color:var(--lpg);font-weight:500}
        .lp-sgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:32px}
        .lp-stag{font-size:.75rem;color:var(--lpw3);padding:8px 12px;border:1px solid var(--lpbr);border-radius:3px;text-align:center;transition:all .2s}
        .lp-stag:hover{border-color:rgba(201,169,110,.3);color:var(--lpg)}
        .lp-ecards{display:flex;flex-direction:column;gap:12px}
        .lp-ec{display:flex;align-items:center;gap:16px;padding:16px 20px;background:var(--lpb);border:1px solid var(--lpbr);border-radius:6px;transition:border-color .3s}
        .lp-ec:hover{border-color:rgba(201,169,110,.3)}
        .lp-eav{width:40px;height:40px;border-radius:50%;background:var(--lps2);border:1px solid var(--lpbr);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
        .lp-ei{flex:1}
        .lp-en{font-size:.875rem;font-weight:500;color:var(--lpw)}
        .lp-er{font-size:.75rem;color:var(--lpw3);margin-top:2px}
        .lp-em{font-size:.65rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;padding:4px 8px;border-radius:3px;flex-shrink:0}
        .lp-feat{padding:120px 0}
        .lp-fhd{text-align:center;margin-bottom:72px}
        .lp-fgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;border:1px solid var(--lpbr);border-radius:6px;overflow:hidden}
        .lp-fc{padding:40px 32px;background:var(--lps);transition:background .3s;border-right:1px solid var(--lpbr)}
        .lp-fc:hover{background:var(--lps2)}
        .lp-fc:nth-child(3n){border-right:none}
        .lp-fc:nth-child(n+4){border-top:1px solid var(--lpbr)}
        .lp-fi{width:40px;height:40px;margin-bottom:20px;display:flex;align-items:center;justify-content:center;border:1px solid var(--lpbr);border-radius:6px;font-size:1.1rem;background:var(--lpb)}
        .lp-ftt{font-size:1rem;font-weight:500;color:var(--lpw);margin-bottom:10px}
        .lp-fb{font-size:.8125rem;line-height:1.6;color:var(--lpw3)}
        .lp-price{padding:120px 0;background:var(--lps);border-top:1px solid var(--lpbr);border-bottom:1px solid var(--lpbr)}
        .lp-phd{text-align:center;margin-bottom:72px}
        .lp-pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;border:1px solid var(--lpbr);border-radius:8px;overflow:hidden}
        .lp-pc{padding:48px 40px;background:var(--lpb);position:relative;transition:background .3s}
        .lp-pc:hover{background:#0C0C0F}
        .lp-pc+.lp-pc{border-left:1px solid var(--lpbr)}
        .lp-pc.feat{background:var(--lps2);border-left:1px solid rgba(201,169,110,.2)!important;border-right:1px solid rgba(201,169,110,.2)!important}
        .lp-pc.feat::before{content:'MOST POPULAR';position:absolute;top:-1px;left:50%;transform:translateX(-50%);font-size:.6rem;letter-spacing:.15em;font-weight:500;padding:5px 16px;border-radius:0 0 4px 4px;background:var(--lpg);color:#08080A;font-family:'DM Sans',sans-serif}
        .lp-ptier{font-size:.7rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--lpw3);margin-bottom:20px}
        .lp-pamt{font-family:'DM Serif Display',serif;font-size:3rem;color:var(--lpw);line-height:1;margin-bottom:4px}
        .lp-pamt .cur{font-size:1.5rem;vertical-align:top;margin-top:8px;display:inline-block;font-family:'DM Sans',sans-serif;font-weight:300}
        .lp-pamt .per{font-size:.875rem;color:var(--lpw5);font-family:'DM Sans',sans-serif;font-weight:300;vertical-align:middle}
        .lp-pdsc{font-size:.875rem;color:var(--lpw5);margin-bottom:32px;line-height:1.5}
        .lp-pdiv{height:1px;background:var(--lpbr);margin-bottom:28px}
        .lp-pfl{list-style:none;display:flex;flex-direction:column;gap:12px;margin-bottom:36px}
        .lp-pfl li{font-size:.8125rem;color:var(--lpw5);display:flex;align-items:flex-start;gap:10px;line-height:1.4}
        .lp-pfl li::before{content:'✓';color:var(--lpg);flex-shrink:0;font-size:.75rem;margin-top:1px}
        .lp-pfl li.off{color:var(--lpw3);opacity:.4}
        .lp-pfl li.off::before{content:'—';color:var(--lpw3)}
        .lp-pbtn{display:block;width:100%;padding:13px 24px;border-radius:4px;font-size:.8rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;text-align:center;cursor:pointer;transition:all .2s;border:none}
        .btn-pricing-outline{background:transparent;color:var(--lpw5);border:1px solid var(--lpbr)}
        .btn-pricing-outline:hover{border-color:rgba(255,255,255,.2);color:var(--lpw)}
        .btn-pricing-gold{background:var(--lpg);color:#08080A}
        .btn-pricing-gold:hover{opacity:.88}
        .lp-testi{padding:120px 0}
        .lp-thd{text-align:center;margin-bottom:72px}
        .lp-tgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;border:1px solid var(--lpbr);border-radius:6px;overflow:hidden}
        .lp-tc{padding:40px 36px;background:var(--lps);border-right:1px solid var(--lpbr);transition:background .3s}
        .lp-tc:last-child{border-right:none}
        .lp-tc:hover{background:var(--lps2)}
        .lp-tq{font-family:'DM Serif Display',serif;font-size:1.125rem;line-height:1.5;color:var(--lpw);margin-bottom:28px;font-style:italic}
        .lp-tau{display:flex;align-items:center;gap:14px}
        .lp-tav{width:40px;height:40px;border-radius:50%;background:var(--lps2);border:1px solid var(--lpbr);display:flex;align-items:center;justify-content:center;font-size:1rem}
        .lp-tn{font-size:.875rem;font-weight:500;color:var(--lpw)}
        .lp-tr{font-size:.75rem;color:var(--lpw3);margin-top:2px}
        .lp-cta{padding:160px 48px;text-align:center;position:relative;overflow:hidden}
        .lp-ctag{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:400px;border-radius:50%;background:radial-gradient(ellipse,rgba(201,169,110,.08) 0%,transparent 70%);pointer-events:none}
        .lp-ctit{font-family:'DM Serif Display',serif;font-size:clamp(2.5rem,6vw,5rem);line-height:1.05;color:var(--lpw);margin-bottom:20px;position:relative;z-index:1}
        .lp-ctit em{font-style:italic;color:var(--lpg)}
        .lp-csub{font-size:1.0625rem;line-height:1.65;color:var(--lpw5);max-width:480px;margin:0 auto 48px;position:relative;z-index:1}
        .lp-ca{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;position:relative;z-index:1}
        .lp-cn{font-size:.75rem;color:var(--lpw3);margin-top:24px;letter-spacing:.04em;position:relative;z-index:1}
        .lp-foot{padding:64px 48px 40px;border-top:1px solid var(--lpbr);position:relative;z-index:1}
        .lp-fgd{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:64px}
        .lp-fl{font-family:'DM Serif Display',serif;font-size:1.25rem;letter-spacing:.15em;text-transform:uppercase;color:var(--lpw);margin-bottom:16px}
        .lp-fl span{color:var(--lpg)}
        .lp-ftag{font-size:.8125rem;line-height:1.6;color:var(--lpw3);max-width:240px}
        .lp-fcol h4{font-size:.7rem;font-weight:500;letter-spacing:.15em;text-transform:uppercase;color:var(--lpw5);margin-bottom:20px}
        .lp-fcol ul{list-style:none;display:flex;flex-direction:column;gap:10px}
        .lp-fcol ul li a{font-size:.8125rem;color:var(--lpw3);text-decoration:none;transition:color .2s}
        .lp-fcol ul li a:hover{color:var(--lpw)}
        .lp-fbot{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding-top:32px;border-top:1px solid var(--lpbr);font-size:.75rem;color:var(--lpw3)}
        @media(max-width:900px){.lp-nav{padding:0 24px}.lp-navlinks{display:none}.lp-hero{padding:100px 24px 60px}.lp-inn{padding:0 24px}.lp-mgrid{grid-template-columns:1fr}.lp-mc:nth-child(n){border:none;border-top:1px solid var(--lpbr)}.lp-mc:first-child{border-top:none}.lp-hgrid{grid-template-columns:1fr}.lp-pipe-hdr{grid-template-columns:1fr;gap:32px}.lp-pvis{flex-direction:column}.lp-pcol{border-right:none;border-bottom:1px solid var(--lpbr)}.lp-pcon{display:none}.lp-fgrid{grid-template-columns:1fr 1fr}.lp-fc:nth-child(3n){border-right:1px solid var(--lpbr)}.lp-fc:nth-child(2n){border-right:none}.lp-pgrid{grid-template-columns:1fr}.lp-pc+.lp-pc{border-left:none;border-top:1px solid var(--lpbr)}.lp-tgrid{grid-template-columns:1fr}.lp-tc{border-right:none;border-bottom:1px solid var(--lpbr)}.lp-sb{gap:32px;padding:32px 24px;flex-wrap:wrap}.lp-fgd{grid-template-columns:1fr 1fr;gap:32px}.lp-hpipe{flex-wrap:wrap}.lp-cta{padding:100px 24px}.lp-mods,.lp-pipe-sec,.lp-hum,.lp-feat,.lp-price,.lp-testi{padding:80px 0}}
        @media(max-width:600px){.lp-fgrid{grid-template-columns:1fr}.lp-fc:nth-child(n){border-right:none}.lp-fgd{grid-template-columns:1fr}}
      `}</style>

      <div className="lp-root">
        <div className="lp-go" />

        {/* NAV */}
        <nav className="lp-nav">
          <div className="lp-logo">Hypno<span>·</span>tic</div>
          <ul className="lp-navlinks">
            <li><a href="#modules">Platform</a></li>
            <li><a href="#human">+Human</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#about">About</a></li>
          </ul>
          <div className="lp-navcta">
            <button className="lp-bg" onClick={() => navigate('/login')}>Sign in</button>
            <button className="lp-bp" onClick={() => navigate('/signup')}>Start free →</button>
          </div>
        </nav>

        {/* HERO */}
        <div className="lp-hero">
          <div className="lp-orb lp-o1" /><div className="lp-orb lp-o2" /><div className="lp-orb lp-o3" />
          <div className="lp-eyebrow">AI Creative Operating System</div>
          <h1 className="lp-ht lp-fade-up">From <em>insight</em><br />to impact.</h1>
          <p className="lp-hs lp-fade-up lp-d1">Hypnotic moves your creative work from strategy to production to distribution — with AI handling the heavy lifting at every stage.</p>
          <div className="lp-ha lp-fade-up lp-d2">
            <button className="lp-bh lp-bhp" onClick={() => navigate('/signup')}>Start creating free</button>
            <a href="#modules" className="lp-bh lp-bhs">See the platform →</a>
          </div>
          <div className="lp-hpipe lp-fade-up lp-d3">
            <div className="lp-ps insight">INSIGHT</div><div className="lp-pa">→</div>
            <div className="lp-ps manifest">MANIFEST</div><div className="lp-pa">→</div>
            <div className="lp-ps craft">CRAFT</div><div className="lp-pa">→</div>
            <div className="lp-ps amplify">AMPLIFY</div>
          </div>
        </div>

        {/* MARQUEE */}
        <div className="lp-mq">
          <div className="lp-mqt">
            {marqueeItems.map((item, i) => (
              <span key={i} style={{display:'contents'}}>
                <span className="lp-mqi">{item}</span><span className="lp-mqd">◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="lp-sb">
          {STATS.map((s, i) => (
            <span key={s.label} style={{display:'contents'}}>
              {i > 0 && <div className="lp-sd" />}
              <div className="lp-si">
                <div className="lp-sn" data-target={/^\d/.test(s.value) ? s.value : undefined}>{s.value}</div>
                <div className="lp-sl">{s.label}</div>
              </div>
            </span>
          ))}
        </div>

        {/* MODULES */}
        <section className="lp-sec lp-mods" id="modules">
          <div className="lp-inn">
            <div className="lp-mhd lp-fade-up">
              <div className="lp-slbl">The Platform</div>
              <h2 className="lp-stit">Four phases.<br /><em>One operating system.</em></h2>
              <p className="lp-sbdy" style={{margin:'0 auto',textAlign:'center'}}>Each module is powerful alone. Together, they form an end-to-end creative pipeline where every output feeds the next — compounding intelligence at every stage.</p>
            </div>
            <div className="lp-mgrid lp-stagger-grid">
              {MODULES.map((m) => (
                <div key={m.num} className={`lp-mc ${m.cardClass} lp-stagger-item`}>
                  <span className="lp-mnum">{m.num}</span>
                  <span className={`lp-chip ${m.chipClass}`}>{m.chip}</span>
                  <h3 className="lp-mtit">{m.title}</h3>
                  <p className="lp-mdsc">{m.desc}</p>
                  <ul className="lp-mft">{m.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <div className="lp-mglow" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PIPELINE */}
        <section className="lp-sec lp-pipe-sec">
          <div className="lp-inn">
            <div className="lp-pipe-hdr lp-fade-up">
              <div>
                <div className="lp-slbl">How it works</div>
                <h2 className="lp-stit">The complete<br /><em>creative pipeline</em></h2>
              </div>
              <p className="lp-sbdy" style={{paddingBottom:8}}>Each module hands off to the next. Insight's research informs Manifest's creative development. Manifest's scripts and storyboards feed Craft's production. Craft's approved assets flow directly into Amplify's distribution queue.</p>
            </div>
            <div className="lp-pvis lp-stagger-grid">
              {PIPELINE.map((p) => (
                <div key={p.num} className="lp-pcol lp-stagger-item">
                  <div className="lp-pnum">{p.num}</div>
                  <div className="lp-plbl" style={{color:p.color}}>{p.label}</div>
                  <div className="lp-ptit">{p.title}</div>
                  <div className="lp-pbdy">{p.body}</div>
                  {p.hasArrow && <div className="lp-pcon">→</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HUMAN */}
        <section className="lp-sec lp-hum" id="human">
          <div className="lp-inn">
            <div className="lp-hgrid">
              <div className="lp-fade-up">
                <div className="lp-hbdg">Human Enhancement</div>
                <h2 className="lp-htit">AI gets you far.<br /><em>Humans</em> get you there.</h2>
                <p className="lp-hbdy">At any point in any module, tap <strong>+Human</strong> to bring in a vetted specialist. A strategist to sharpen your Insight. A screenwriter to elevate your script. A director to brief your Craft output. Real expertise, matched to your exact need, delivered within your project.</p>
                <button className="lp-bh lp-bhs" onClick={() => navigate('/marketplace')}>Browse experts →</button>
                <div className="lp-sgrid">{SKILLS.map((s) => <div key={s} className="lp-stag">{s}</div>)}</div>
              </div>
              <div className="lp-ecards lp-fade-up lp-d1">
                {EXPERTS.map((e) => (
                  <div key={e.name} className="lp-ec">
                    <div className="lp-eav">{e.emoji}</div>
                    <div className="lp-ei"><div className="lp-en">{e.name}</div><div className="lp-er">{e.role}</div></div>
                    <div className={`lp-em lp-chip ${e.chipClass}`}>{e.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="lp-sec lp-feat">
          <div className="lp-inn">
            <div className="lp-fhd lp-fade-up">
              <div className="lp-slbl">Platform Capabilities</div>
              <h2 className="lp-stit">Built for professionals.<br /><em>Designed for speed.</em></h2>
            </div>
            <div className="lp-fgrid lp-stagger-grid">
              {FEATURES.map((f) => (
                <div key={f.title} className="lp-fc lp-stagger-item">
                  <div className="lp-fi">{f.icon}</div>
                  <div className="lp-ftt">{f.title}</div>
                  <div className="lp-fb">{f.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="lp-sec lp-price" id="pricing">
          <div className="lp-inn">
            <div className="lp-phd lp-fade-up">
              <div className="lp-slbl">Pricing</div>
              <h2 className="lp-stit">Clear plans.<br /><em>No surprises.</em></h2>
              <p className="lp-sbdy" style={{margin:'12px auto 0',textAlign:'center'}}>Start free for 14 days. No credit card required.</p>
            </div>
            <div className="lp-pgrid lp-stagger-grid">
              {PLANS.map((plan) => (
                <div key={plan.tier} className={`lp-pc lp-stagger-item${plan.featured?' feat':''}`}>
                  <div className="lp-ptier">{plan.tier}</div>
                  <div className="lp-pamt"><span className="cur">$</span>{plan.price}<span className="per">/mo</span></div>
                  <div className="lp-pdsc">{plan.desc}</div>
                  <div className="lp-pdiv" />
                  <ul className="lp-pfl">
                    {plan.features.map((f) => <li key={f.text} className={f.on?'':'off'}>{f.text}</li>)}
                  </ul>
                  <button className={`lp-pbtn ${plan.btnClass}`} onClick={() => navigate('/signup')}>{plan.btnLabel}</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="lp-sec lp-testi">
          <div className="lp-inn">
            <div className="lp-thd lp-fade-up">
              <div className="lp-slbl">Early Access</div>
              <h2 className="lp-stit">What creators are building<br /><em>with Hypnotic</em></h2>
            </div>
            <div className="lp-tgrid lp-stagger-grid">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="lp-tc lp-stagger-item">
                  <p className="lp-tq">{t.quote}</p>
                  <div className="lp-tau">
                    <div className="lp-tav">{t.emoji}</div>
                    <div><div className="lp-tn">{t.name}</div><div className="lp-tr">{t.role}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="lp-sec lp-cta">
          <div className="lp-ctag" />
          <h2 className="lp-ctit lp-fade-up">Your next campaign<br />starts <em>here</em>.</h2>
          <p className="lp-csub lp-fade-up lp-d1">From brief to production to distribution — Hypnotic runs the pipeline so you can focus on the work that only you can do.</p>
          <div className="lp-ca lp-fade-up lp-d2">
            <button className="lp-bh lp-bhp" onClick={() => navigate('/signup')}>Start free — no credit card</button>
            <button className="lp-bh lp-bhs">Talk to the team</button>
          </div>
          <div className="lp-cn lp-fade-up lp-d3">14-day free trial on Pro · Cancel anytime · Used in 40+ countries</div>
        </section>

        {/* FOOTER */}
        <footer className="lp-foot">
          <div className="lp-fgd">
            <div>
              <div className="lp-fl">Hypno<span>·</span>tic</div>
              <p className="lp-ftag">The world's first end-to-end AI creative operating system for advertising, content, and campaign production.</p>
            </div>
            <div className="lp-fcol"><h4>Platform</h4><ul>{['Insight','Manifest','Craft','Amplify','Workspace','+Human'].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
            <div className="lp-fcol"><h4>Company</h4><ul>{['About','Blog','Careers','Press','Contact'].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
            <div className="lp-fcol"><h4>Legal</h4><ul>{['Privacy Policy','Terms of Service','Cookie Policy','Security','API Docs'].map(l=><li key={l}><a href="#">{l}</a></li>)}</ul></div>
          </div>
          <div className="lp-fbot">
            <span>© 2026 Hypnotic. All rights reserved.</span>
            <span>Made for creative professionals everywhere.</span>
          </div>
        </footer>
      </div>
    </>
  );
}
