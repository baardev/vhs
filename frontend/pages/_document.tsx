import Document, { Html, Head, Main, NextScript } from 'next/document';

/**
 * @class MyDocument
 * @extends Document
 * @description Custom Document component for the Next.js application.
 * This component is used to augment the application's `<html>` and `<body>` tags,
 * add custom `<meta>` and `<link>` tags to the `<head>`, and inject critical scripts
 * like the dark mode initialization script.
 *
 * @remarks
 * - Sets the HTML language to "en".
 * - Includes common meta tags (charset, description) and a favicon link.
 * - Applies base Tailwind CSS classes to the `<body>` for layout and theming.
 * - **Dark Mode Initialization**: Critically, it includes an inline script that runs
 *   before the main application bundle to check for saved dark mode preference in
 *   `localStorage` or system preference via `prefers-color-scheme`. It then applies
 *   the `.dark` class to the `<html>` element (`document.documentElement`) if dark mode
 *   should be active, preventing a flash of light mode on initial load.
 */
class MyDocument extends Document {
  /**
   * @method render
   * @description Renders the custom HTML structure for the document.
   * @returns {JSX.Element} The JSX structure for the `<html>`, `<head>`, and `<body>` elements.
   */
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