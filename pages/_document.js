import { Html, Head, Main, NextScript } from "next/document";

// Bump when the icons change: browsers cache favicons hard and only refetch
// when the URL changes.
const ICON_VERSION = 2;

export default function Document() {
  return (
    <Html lang="en-IN" data-scroll-behavior="smooth">
      <Head>
        <link rel="icon" href={`/favicon.ico?v=${ICON_VERSION}`} sizes="48x48" />
        <link
          rel="icon"
          href={`/icon-192.png?v=${ICON_VERSION}`}
          type="image/png"
          sizes="192x192"
        />
        <link
          rel="apple-touch-icon"
          href={`/apple-touch-icon.png?v=${ICON_VERSION}`}
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
