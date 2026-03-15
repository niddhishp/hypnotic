// src/components/shared/SEO.tsx
// Per-page SEO component using react-helmet-async
// Usage: <SEO title="Insight — Hypnotic" description="..." />

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noIndex?: boolean;
  ogImage?: string;
  ogType?: 'website' | 'article';
  /** Schema.org JSON-LD object */
  schema?: Record<string, unknown>;
}

const BASE_TITLE = 'Hypnotic';
const BASE_DESCRIPTION =
  'AI creative operating system for advertising, film, and content. Insight → Manifest → Craft → Amplify.';
const BASE_URL = import.meta.env.VITE_APP_URL ?? 'https://hypnotic.ai';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export function SEO({
  title,
  description = BASE_DESCRIPTION,
  canonical,
  noIndex = false,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  schema,
}: SEOProps) {
  const fullTitle = title ? `${title} — ${BASE_TITLE}` : `${BASE_TITLE} — AI Creative Operating System`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
