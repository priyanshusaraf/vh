import Head from 'next/head';
import siteConfig from '@/lib/siteConfig';

export default function Seo({ title, description, path = '/', ogImage, noindex = false }) {
  const url = `${siteConfig.baseUrl}${path}`;
  const image = ogImage || siteConfig.ogImage;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />
      {!noindex && <link rel="canonical" href={url} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteConfig.brand} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}

// Structured data block. Rendered through dangerouslySetInnerHTML so the JSON
// isn't HTML-escaped by React.
export function JsonLd({ data }) {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    </Head>
  );
}
