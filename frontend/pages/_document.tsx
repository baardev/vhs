import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="description" content="VHS Open Handicap System - Track your golf handicap easily" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body className="flex flex-col min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <Main />
          <NextScript />
          
          {/* Dark mode script */}
          <script dangerouslySetInnerHTML={{ __html: `
            (function() {
              // Check user preference on page load
              const savedMode = localStorage.getItem('darkMode');
              const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              
              if ((savedMode && savedMode === 'true') || (savedMode === null && prefersDark)) {
                document.documentElement.classList.add('dark');
              }
            })();
          `}} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;