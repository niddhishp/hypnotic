import { useState } from 'react';
import { MarketingLayout, proseStyles as s } from './MarketingLayout';
import { SEO } from '@/components/shared/SEO';
import { Send, Check } from 'lucide-react';

const TOPICS = [
  { id: 'sales',    label: 'Sales & pricing'   },
  { id: 'support',  label: 'Support'            },
  { id: 'press',    label: 'Press & media'      },
  { id: 'partners', label: 'Partnerships'       },
  { id: 'other',    label: 'Something else'     },
];

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Placeholder — wire to a form service like Resend or Formspree
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setSending(false);
  };

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#F0EDE8] placeholder:text-[#333] focus:outline-none focus:border-[#C9A96E]/50 transition-colors";

  return (
    <MarketingLayout eyebrow="Contact" title="Get in touch"
      subtitle="We read every message. Typically respond within one business day.">
      <SEO title="Contact" description="Contact Hypnotic for sales, support, press, or partnership enquiries." canonical="/contact" />

      {sent ? (
        <div className="text-center py-16 space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#7abf8e]/15 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6 text-[#7abf8e]" />
          </div>
          <h2 className="text-xl font-light text-[#F0EDE8]">Message sent</h2>
          <p className="text-sm text-[#555]">We'll get back to you at <span className="text-[#C9A96E]">{form.email}</span> within 24 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Name</label>
              <input type="text" required placeholder="Your name" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Email</label>
              <input type="email" required placeholder="you@company.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Topic</label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map(t => (
                <button key={t.id} type="button"
                  onClick={() => setForm(p => ({ ...p, topic: t.id }))}
                  className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${
                    form.topic === t.id
                      ? 'border-[#C9A96E] bg-[#C9A96E]/10 text-[#C9A96E]'
                      : 'border-white/8 text-[#555] hover:border-white/20 hover:text-[#888]'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-[#555] uppercase tracking-wider block mb-1.5">Message</label>
            <textarea required rows={5} placeholder="How can we help?"
              value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              className={`${inputClass} resize-none`} />
          </div>

          <button type="submit" disabled={sending || !form.name || !form.email || !form.message}
            className="flex items-center gap-2 px-6 py-3 bg-[#C9A96E] text-[#08080A] rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all">
            {sending
              ? <><div className="w-4 h-4 border-2 border-[#08080A]/30 border-t-[#08080A] rounded-full animate-spin" /> Sending…</>
              : <><Send className="w-3.5 h-3.5" /> Send message</>}
          </button>
        </form>
      )}

      <hr className={s.hr} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'General', email: 'hello@hypnotic.ai' },
          { label: 'Support', email: 'support@hypnotic.ai' },
          { label: 'Press',   email: 'press@hypnotic.ai'  },
        ].map(c => (
          <div key={c.label} className="p-4 rounded-2xl border border-white/6" style={{ background: '#0D0D10' }}>
            <p className="text-[11px] text-[#444] uppercase tracking-wider mb-1">{c.label}</p>
            <a href={`mailto:${c.email}`} className={s.a + ' text-sm'}>{c.email}</a>
          </div>
        ))}
      </div>
    </MarketingLayout>
  );
}
