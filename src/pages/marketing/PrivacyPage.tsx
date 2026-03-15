import { MarketingLayout, proseStyles as s } from './MarketingLayout';
import { SEO } from '@/components/shared/SEO';

export function PrivacyPage() {
  return (
    <MarketingLayout eyebrow="Legal" title="Privacy Policy" lastUpdated="March 15, 2026"
      subtitle="We respect your privacy. This policy explains what data we collect, why, and how we use it.">
      <SEO title="Privacy Policy" description="Hypnotic's privacy policy — how we collect, use and protect your data." canonical="/privacy" />

      {[
        { title: '1. What we collect', items: [
          'Account information: name, email, password hash when you sign up.',
          'Usage data: which modules you use, generation requests, pipeline activity.',
          'Content you create: Insight reports, Manifest decks, Craft assets, Amplify posts — stored securely and accessible only to you.',
          'Payment information: processed by Stripe. We never store card numbers.',
          'Device and browser: IP address, browser type, OS — for security and analytics.',
        ]},
        { title: '2. How we use your data', items: [
          'To provide and improve the Hypnotic platform.',
          'To process payments and manage your subscription.',
          'To send product updates and essential service emails.',
          'To detect and prevent fraud and abuse.',
          'To analyse aggregate usage patterns (never individual-level) for product development.',
        ]},
        { title: '3. Data sharing', items: [
          'We do not sell your data. Ever.',
          'Supabase: our database and authentication provider (stores your data on secure Postgres).',
          'Stripe: payment processing (see Stripe\'s privacy policy).',
          'AI providers (Anthropic, OpenAI, fal.ai): your prompts are processed to generate outputs. We do not allow providers to train on your data.',
          'Vercel: our hosting platform (application logs).',
        ]},
        { title: '4. Your rights', items: [
          'Access: request a copy of all data we hold about you.',
          'Deletion: request deletion of your account and all associated data.',
          'Export: export all your projects, reports, and assets.',
          'Correction: update incorrect information in Settings.',
          'Opt-out: unsubscribe from marketing emails at any time.',
          'To exercise any right, email privacy@hypnotic.ai.',
        ]},
        { title: '5. Data retention', items: [
          'Active accounts: data retained while account is active.',
          'Deleted accounts: data permanently deleted within 30 days of account deletion request.',
          'AI generation logs: retained for 90 days for abuse prevention.',
          'Billing records: retained for 7 years as required by financial regulations.',
        ]},
        { title: '6. Security', items: [
          'All data encrypted in transit (TLS 1.3) and at rest (AES-256).',
          'Row-level security on all database tables — you can only access your own data.',
          'API keys stored as environment secrets, never in client code.',
          'OAuth tokens encrypted before database storage.',
        ]},
        { title: '7. Cookies', items: [
          'We use cookies for authentication session management only.',
          'No advertising cookies. No third-party tracking pixels.',
          'See our Cookie Policy for full details.',
        ]},
        { title: '8. Contact', items: [
          'Data controller: Hypnotic (privacy@hypnotic.ai)',
          'Questions about this policy? Email privacy@hypnotic.ai',
        ]},
      ].map(section => (
        <div key={section.title}>
          <h2 className={s.h2}>{section.title}</h2>
          <ul className={s.ul}>
            {section.items.map((item, i) => (
              <li key={i} className={s.li}>
                <span className="text-[#C9A96E] mt-0.5 flex-shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </MarketingLayout>
  );
}
