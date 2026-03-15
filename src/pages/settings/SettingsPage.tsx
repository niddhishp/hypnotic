import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Key, CreditCard, Bell, Shield, Palette, Plug,
  CheckCircle, ChevronRight, Eye, EyeOff, Save, Plus,
  Sparkles, Globe, Zap, Volume2
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/shared/SEO';

type Tab = 'api' | 'billing' | 'integrations' | 'notifications' | 'security';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'api',           label: 'API Keys',      icon: Key      },
  { id: 'billing',       label: 'Billing',        icon: CreditCard },
  { id: 'integrations',  label: 'Integrations',   icon: Plug     },
  { id: 'notifications', label: 'Notifications',  icon: Bell     },
  { id: 'security',      label: 'Security',       icon: Shield   },
];

const PLANS = [
  {
    id: 'starter', name: 'Starter', price: '₹1,999', period: '/month',
    features: ['3 projects', '5 Insight reports/month', '3 Manifest decks/month', '50 generation credits', '2 platforms in Amplify'],
    credits: 50,
  },
  {
    id: 'pro', name: 'Pro', price: '₹4,999', period: '/month', badge: 'Most Popular',
    features: ['Unlimited projects', 'Unlimited Insight + Manifest', '200 generation credits', 'All Craft models', 'All 6 platforms', '+Human marketplace', 'Node workspace'],
    credits: 200,
  },
  {
    id: 'agency', name: 'Agency', price: '₹14,999', period: '/month',
    features: ['Everything in Pro', '5 team seats', '1000 generation credits', 'White-label reports', 'Priority +Human matching', 'API access', 'Dedicated account manager'],
    credits: 1000,
  },
];

const API_KEYS = [
  { id: 'openrouter',   label: 'OpenRouter',    placeholder: 'sk-or-…',  envVar: 'OPENROUTER_API_KEY',  desc: 'Unified AI access — Anthropic, OpenAI, Gemini', required: true },
  { id: 'anthropic',    label: 'Anthropic',      placeholder: 'sk-ant-…', envVar: 'ANTHROPIC_API_KEY',   desc: 'Claude — Insight + Manifest AI backbone'        },
  { id: 'openai',       label: 'OpenAI',          placeholder: 'sk-…',     envVar: 'OPENAI_API_KEY',      desc: 'GPT-4o vision + Whisper + TTS'                  },
  { id: 'fal',          label: 'fal.ai',          placeholder: 'fal-…',    envVar: 'FAL_API_KEY',         desc: 'Image + video generation (Flux, Kling, etc.)'   },
  { id: 'elevenlabs',   label: 'ElevenLabs',      placeholder: 'el-…',     envVar: 'ELEVENLABS_API_KEY',  desc: 'Voiceover generation'                           },
  { id: 'serpapi',      label: 'SerpAPI',          placeholder: 'serp-…',   envVar: 'SERPAPI_KEY',         desc: 'Web research for Insight module'                },
  { id: 'stripe_pub',   label: 'Stripe Public Key', placeholder: 'pk_…',   envVar: 'NEXT_PUBLIC_STRIPE_KEY', desc: 'Payment processing'                         },
];

const INTEGRATIONS = [
  { id: 'instagram', name: 'Instagram', icon: '📸', connected: true,  module: 'amplify', handle: '@hypnotic_brand' },
  { id: 'linkedin',  name: 'LinkedIn',  icon: '💼', connected: true,  module: 'amplify', handle: 'Hypnotic Agency' },
  { id: 'x',         name: 'X / Twitter', icon: '𝕏', connected: false, module: 'amplify' },
  { id: 'youtube',   name: 'YouTube',   icon: '▶️', connected: false, module: 'amplify' },
  { id: 'tiktok',    name: 'TikTok',    icon: '🎵', connected: false, module: 'amplify' },
  { id: 'supabase',  name: 'Supabase',  icon: '🗄️', connected: true,  module: 'core', handle: 'hypnotic-db' },
];

const API_KEY_STORAGE = 'hypnotic-api-keys';

function loadStoredKeys(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(API_KEY_STORAGE) ?? '{}');
  } catch { return {}; }
}

function ApiTab() {
  const [values, setValues]   = useState<Record<string, string>>(loadStoredKeys);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [saved, setSaved]     = useState<Record<string, boolean>>({});

  const save = (id: string) => {
    // Persist to localStorage (used by Edge Function calls as fallback)
    const all = loadStoredKeys();
    if (values[id]) {
      all[id] = values[id];
    } else {
      delete all[id];
    }
    localStorage.setItem(API_KEY_STORAGE, JSON.stringify(all));
    setSaved(p => ({ ...p, [id]: true }));
    setTimeout(() => setSaved(p => ({ ...p, [id]: false })), 2000);
  };

  return (
    <div className="space-y-3">
      <SEO title="Settings" noIndex />
      <p className="text-xs text-[#555] mb-4">
        API keys are stored securely in your environment. Hypnotic uses these to power AI generation, research, and publishing.
      </p>
      {API_KEYS.map(k => (
        <div key={k.id} className="rounded-xl border border-white/6 p-4" style={{ background: '#0D0D10' }}>
          <div className="flex items-start justify-between mb-1.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#F0EDE8]">{k.label}</span>
                {k.required && <span className="text-[11px] text-[#C9A96E] bg-[#C9A96E]/10 px-1.5 py-0.5 rounded-full">Required</span>}
              </div>
              <div className="text-[11px] text-[#444] mt-0.5">{k.desc}</div>
            </div>
            {values[k.id] && (
              <div className="flex items-center gap-1 text-[11px] text-[#7abf8e]">
                <CheckCircle className="w-3 h-3" /> Configured
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <div className="flex-1 relative">
              <input
                type={visible[k.id] ? 'text' : 'password'}
                value={values[k.id] ?? ''}
                onChange={e => setValues(p => ({ ...p, [k.id]: e.target.value }))}
                placeholder={k.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/40 pr-10 font-mono"
              />
              <button onClick={() => setVisible(p => ({ ...p, [k.id]: !p[k.id] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors">
                {visible[k.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <button onClick={() => save(k.id)}
              className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg border border-white/10 text-[#777] hover:border-white/20 hover:text-[#F0EDE8] transition-all">
              {saved[k.id] ? <><CheckCircle className="w-3 h-3 text-[#7abf8e]" /> Saved</> : <><Save className="w-3 h-3" /> Save</>}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BillingTab() {
  const { user } = useAuthStore();
  const currentPlan = 'pro';

  return (
    <div className="space-y-6">
      {/* Current plan */}
      <div className="rounded-2xl border border-[#C9A96E]/20 p-5" style={{ background: '#C9A96E08' }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] text-[#C9A96E] uppercase tracking-wider mb-1">Current Plan</div>
            <div className="text-xl font-light text-[#F0EDE8]">Pro</div>
            <div className="text-xs text-[#555] mt-1">200 credits/month · Renews Mar 15, 2025</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-light text-[#F0EDE8]">₹4,999</div>
            <div className="text-xs text-[#555]">/month</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-[#555] mb-1.5">
            <span>Generation credits</span>
            <span className="text-[#C9A96E]">143 / 200 remaining</span>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full bg-[#C9A96E] rounded-full" style={{ width: '71.5%' }} />
          </div>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-3 gap-3">
        {PLANS.map(plan => (
          <div key={plan.id}
            className={cn(
              'rounded-2xl border p-4 transition-all',
              plan.id === currentPlan ? 'border-[#C9A96E]/30' : 'border-white/6'
            )}
            style={{ background: plan.id === currentPlan ? '#C9A96E08' : '#0D0D10' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#F0EDE8]">{plan.name}</span>
              {plan.badge && (
                <span className="text-[11px] text-[#C9A96E] bg-[#C9A96E]/15 px-1.5 py-0.5 rounded-full">{plan.badge}</span>
              )}
              {plan.id === currentPlan && <span className="text-[11px] text-[#7abf8e]">Current</span>}
            </div>
            <div className="text-xl font-light text-[#F0EDE8] mb-1">{plan.price}<span className="text-xs text-[#444]">{plan.period}</span></div>
            <div className="space-y-1 mb-4">
              {plan.features.slice(0, 4).map(f => (
                <div key={f} className="flex items-center gap-1.5 text-[11px] text-[#666]">
                  <CheckCircle className="w-2.5 h-2.5 text-[#7abf8e] flex-shrink-0" /> {f}
                </div>
              ))}
            </div>
            {plan.id !== currentPlan && (
              <button className="w-full text-xs py-2 rounded-xl border border-white/10 text-[#777] hover:border-white/20 hover:text-[#F0EDE8] transition-all">
                {plan.id === 'starter' ? 'Downgrade' : 'Upgrade'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Credit packs */}
      <div>
        <div className="text-[11px] text-[#444] uppercase tracking-wider mb-3">Buy Additional Credits</div>
        <div className="flex gap-3">
          {[
            { credits: 50, price: '₹499' }, { credits: 200, price: '₹1,499' }, { credits: 500, price: '₹2,999' }
          ].map(pack => (
            <button key={pack.credits}
              className="flex-1 rounded-xl border border-white/8 p-3 text-center hover:border-white/20 hover:bg-white/3 transition-all">
              <div className="text-sm font-medium text-[#F0EDE8]">{pack.credits} credits</div>
              <div className="text-xs text-[#555]">{pack.price}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS.map(i => [i.id, i.connected]))
  );

  return (
    <div className="space-y-3">
      {INTEGRATIONS.map(intg => (
        <div key={intg.id} className="rounded-xl border border-white/6 p-4 flex items-center justify-between"
          style={{ background: '#0D0D10' }}>
          <div className="flex items-center gap-3">
            <span className="text-lg">{intg.icon}</span>
            <div>
              <div className="text-xs font-medium text-[#F0EDE8]">{intg.name}</div>
              {connected[intg.id] && intg.handle
                ? <div className="text-[11px] text-[#7abf8e]">{intg.handle}</div>
                : <div className="text-[11px] text-[#444] capitalize">{intg.module} module</div>}
            </div>
          </div>
          <button
            onClick={() => setConnected(p => ({ ...p, [intg.id]: !p[intg.id] }))}
            className={cn(
              'text-xs px-3 py-1.5 rounded-xl transition-all',
              connected[intg.id]
                ? 'bg-[#7abf8e]/10 text-[#7abf8e] border border-[#7abf8e]/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                : 'bg-[#C9A96E] text-[#08080A] hover:opacity-90'
            )}>
            {connected[intg.id] ? 'Connected' : 'Connect'}
          </button>
        </div>
      ))}
    </div>
  );
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('api');
  const { user } = useAuthStore();

  return (
    <div style={{ background: '#0A0A0C' }} className="min-h-full">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="space-y-2 mb-10">
          <h1 className="text-2xl font-light text-[#F0EDE8]">Settings</h1>
          <p className="text-sm text-[#555]">API keys, billing, integrations, and account preferences</p>
        </div>

        <div className="flex gap-8">
          {/* Tab nav */}
          <div className="w-44 flex-shrink-0 space-y-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-left',
                    activeTab === tab.id ? 'bg-white/8 text-[#F0EDE8]' : 'text-[#555] hover:bg-white/4 hover:text-[#888]'
                  )}>
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'api'           && <ApiTab />}
            {activeTab === 'billing'       && <BillingTab />}
            {activeTab === 'integrations'  && <IntegrationsTab />}
            {activeTab === 'notifications' && (
              <div className="text-sm text-[#555] p-6 border border-dashed border-white/8 rounded-2xl text-center">
                Notification preferences coming soon
              </div>
            )}
            {activeTab === 'security'      && (
              <div className="space-y-4">
                <div className="rounded-xl border border-white/6 p-4" style={{ background: '#0D0D10' }}>
                  <div className="text-xs font-medium text-[#F0EDE8] mb-1">Email</div>
                  <div className="text-xs text-[#555]">{user?.email ?? 'niddhish@hypnotic.ai'}</div>
                </div>
                <button className="flex items-center gap-2 text-xs text-[#777] border border-white/8 rounded-xl px-4 py-2.5 hover:border-white/20 hover:text-[#F0EDE8] transition-all">
                  <Shield className="w-3.5 h-3.5" /> Change password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
