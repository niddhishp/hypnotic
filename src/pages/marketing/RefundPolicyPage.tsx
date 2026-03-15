import { MarketingLayout, proseStyles as s } from './MarketingLayout';
import { SEO } from '@/components/shared/SEO';
import { Link } from 'react-router-dom';

export function RefundPolicyPage() {
  return (
    <MarketingLayout
      eyebrow="Legal"
      title="Cancellation & Refund Policy"
      lastUpdated="March 15, 2026"
      subtitle="Clear, fair, and no hidden clauses. Here's exactly how cancellations and refunds work."
    >
      <SEO
        title="Cancellation & Refund Policy"
        description="Hypnotic's cancellation and refund policy — straightforward terms for subscriptions and credit purchases."
        canonical="/refund-policy"
      />

      {/* Quick summary card */}
      <div className="rounded-2xl border border-[#C9A96E]/20 p-5 mb-10" style={{ background: 'rgba(201,169,110,0.05)' }}>
        <p className="text-[11px] text-[#C9A96E] uppercase tracking-wider font-medium mb-3">Summary</p>
        <ul className="space-y-2">
          {[
            'Cancel anytime — no lock-in, no cancellation fee.',
            'Annual plans: full refund within 7 days of purchase.',
            'Monthly plans: no refund on the current billing period, but you keep access until it ends.',
            'Unused generation credits: non-refundable after 30 days.',
            'Technical issues we caused: always made right.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#C0B8AC]">
              <span className="text-[#C9A96E] flex-shrink-0 mt-0.5">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <h2 className={s.h2}>1. Subscription cancellation</h2>
      <p className={s.p}>
        You may cancel your Hypnotic subscription at any time from <strong className="text-[#C0B8AC]">Settings → Billing → Cancel subscription</strong>.
        There is no cancellation fee.
      </p>
      <p className={s.p}>
        When you cancel, your subscription remains active until the end of the current billing period.
        You retain full access to all features you paid for until that date.
        After the period ends, your account reverts to the Free tier and your data is preserved.
      </p>

      <h2 className={s.h2}>2. Refund eligibility</h2>

      <h3 className={s.h3}>Annual subscriptions</h3>
      <p className={s.p}>
        If you purchased an annual Starter, Pro, or Agency plan, you are entitled to a full refund
        if you cancel within <strong className="text-[#C0B8AC]">7 days of the initial purchase date</strong>.
        Renewal payments are eligible for a refund within 7 days of the renewal date.
      </p>
      <p className={s.p}>
        To request an annual plan refund, email <a href="mailto:billing@hypnotic.ai" className={s.a}>billing@hypnotic.ai</a> with
        your account email and reason. Refunds are processed within 5–10 business days to the original payment method.
      </p>

      <h3 className={s.h3}>Monthly subscriptions</h3>
      <p className={s.p}>
        Monthly subscriptions are not eligible for refunds on the current billing period. When you cancel,
        you keep full access until your billing period ends. No partial-month refunds are issued.
      </p>

      <h3 className={s.h3}>Generation credit packs (one-time purchases)</h3>
      <p className={s.p}>
        Credit pack purchases are eligible for a full refund within <strong className="text-[#C0B8AC]">30 days</strong> provided
        fewer than 10% of the purchased credits have been used. Once credits have been substantially used,
        they are non-refundable.
      </p>

      <h2 className={s.h2}>3. Non-refundable items</h2>
      <ul className={s.ul}>
        {[
          'Monthly subscription fees for any portion of a billing period already elapsed.',
          'Generation credits that have been used.',
          'Credits purchased more than 30 days ago, regardless of usage.',
          'Expert marketplace payments once a hire request has been accepted by the expert.',
        ].map((item, i) => (
          <li key={i} className={s.li}><span className="text-[#555]">·</span><span>{item}</span></li>
        ))}
      </ul>

      <h2 className={s.h2}>4. Exceptions — we always make it right</h2>
      <p className={s.p}>
        If you experienced a technical failure on our side that prevented you from using the platform
        (confirmed service outage, billing error, duplicate charge), we will issue a full or partial refund
        regardless of the above terms. Contact <a href="mailto:support@hypnotic.ai" className={s.a}>support@hypnotic.ai</a> with details.
      </p>
      <p className={s.p}>
        We use discretion in exceptional circumstances. If something feels unfair, reach out — we'd rather
        do right by you than lose a customer.
      </p>

      <h2 className={s.h2}>5. How to cancel or request a refund</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          {
            title: 'Cancel your subscription',
            steps: ['Log in to Hypnotic', 'Go to Settings → Billing', 'Click "Cancel subscription"', 'Confirm cancellation'],
          },
          {
            title: 'Request a refund',
            steps: [
              'Email billing@hypnotic.ai',
              'Include your account email',
              'Briefly describe the reason',
              'We respond within 1 business day',
            ],
          },
        ].map(card => (
          <div key={card.title} className="p-5 rounded-2xl border border-white/6" style={{ background: '#0D0D10' }}>
            <p className="text-sm font-medium text-[#F0EDE8] mb-3">{card.title}</p>
            <ol className="space-y-1.5">
              {card.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#555]">
                  <span className="text-[#C9A96E] font-medium flex-shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <h2 className={s.h2}>6. Dispute resolution</h2>
      <p className={s.p}>
        If you believe a charge is incorrect or you are unsatisfied with our response, you may contact
        your card issuer to initiate a chargeback. However, we ask that you contact us first at{' '}
        <a href="mailto:billing@hypnotic.ai" className={s.a}>billing@hypnotic.ai</a> — most issues are
        resolved faster directly.
      </p>

      <h2 className={s.h2}>7. Changes to this policy</h2>
      <p className={s.p}>
        We may update this policy. Material changes will be communicated by email with 14 days notice.
        Continued use of Hypnotic after the effective date constitutes acceptance.
      </p>

      <div className="mt-10 pt-8 border-t border-white/6">
        <p className="text-xs text-[#444]">
          Questions?{' '}
          <Link to="/contact" className={s.a}>Contact us</Link>
          {' '}or email{' '}
          <a href="mailto:billing@hypnotic.ai" className={s.a}>billing@hypnotic.ai</a>
        </p>
        <p className="text-xs text-[#333] mt-1">
          Related: <Link to="/terms" className="text-[#444] hover:text-[#666] transition-colors">Terms of Service</Link>
          {' · '}
          <Link to="/privacy" className="text-[#444] hover:text-[#666] transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </MarketingLayout>
  );
}
