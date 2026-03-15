import { MarketingLayout, proseStyles as s } from './MarketingLayout';
import { SEO } from '@/components/shared/SEO';

export function TermsPage() {
  return (
    <MarketingLayout eyebrow="Legal" title="Terms of Service" lastUpdated="March 15, 2026"
      subtitle="By using Hypnotic, you agree to these terms. Please read them carefully.">
      <SEO title="Terms of Service" description="Hypnotic's Terms of Service — the rules that govern use of the platform." canonical="/terms" />

      {[
        { title: '1. Acceptance', body: 'By creating an account or using Hypnotic, you agree to be bound by these Terms. If you use Hypnotic on behalf of a company, you represent that you have the authority to bind that company to these Terms.' },
        { title: '2. Your account', body: 'You are responsible for maintaining the security of your account. Do not share your credentials. Notify us immediately of any unauthorised access. Accounts may not be transferred without written permission.' },
        { title: '3. Acceptable use', body: 'You may not use Hypnotic to: generate content that is illegal, harmful, or violates intellectual property rights; spam, phish, or defraud others; attempt to reverse-engineer, scrape, or abuse our systems; resell or sublicense access to the platform without a written agreement.' },
        { title: '4. Content ownership', body: 'You own the content you create using Hypnotic. We claim no intellectual property rights over your Insight reports, Manifest decks, or Craft assets. You grant Hypnotic a limited licence to process and store your content solely to provide the service.' },
        { title: '5. AI-generated content', body: 'You are responsible for reviewing and verifying AI-generated outputs before use. Hypnotic makes no warranties about the accuracy, completeness, or fitness for purpose of AI-generated content. Outputs may include errors, biases, or factual inaccuracies.' },
        { title: '6. Payment', body: 'Paid plans are billed monthly or annually. Subscriptions renew automatically unless cancelled. Refunds are available within 7 days of initial purchase for annual plans. Credits expire at end of billing period unless stated otherwise. We reserve the right to change pricing with 30 days notice.' },
        { title: '7. Termination', body: 'You may delete your account at any time from Settings. We may suspend or terminate accounts that violate these Terms. On termination, your right to use Hypnotic ceases immediately. We will delete your data within 30 days of account deletion.' },
        { title: '8. Warranties & liability', body: 'Hypnotic is provided "as is". We do not warrant uninterrupted or error-free service. Our liability is limited to the amount you paid in the 12 months preceding any claim. We are not liable for indirect, incidental, or consequential damages.' },
        { title: '9. Governing law', body: 'These Terms are governed by the laws of India. Any disputes will be resolved in the courts of Mumbai, Maharashtra, India.' },
        { title: '10. Changes', body: 'We may update these Terms. Material changes will be notified by email or in-app notice with 14 days advance notice. Continued use after changes constitutes acceptance.' },
        { title: '11. Contact', body: 'Questions about these Terms? Email legal@hypnotic.ai' },
      ].map(section => (
        <div key={section.title}>
          <h2 className={s.h2}>{section.title}</h2>
          <p className={s.p}>{section.body}</p>
        </div>
      ))}
    </MarketingLayout>
  );
}
