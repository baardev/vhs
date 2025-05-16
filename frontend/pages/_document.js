import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add meta tags to indicate this is not an ad/tracking site */}
        <meta name="resource-type" content="document" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="robots" content="index, follow" />
        <meta name="revisit-after" content="1 day" />
        <meta name="generator" content="Next.js" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
        <meta name="googlebot" content="index, follow" />
        <meta name="google" content="notranslate" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 