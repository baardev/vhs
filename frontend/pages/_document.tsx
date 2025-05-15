import Document, { Html, Head, Main, NextScript } from 'next/document';

declare global {
  interface Window {
    webview?: any; // You can use a more specific type if you know the structure of webview
    __ONLOOK_ENVIRONMENT__?: boolean;
    __ONLOOK_INITIALIZED__?: boolean;
  }
}

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
 * - **Onlook Polyfill**: Includes logic to detect if the application is running in an
 *   Onlook environment and polyfills `window.webview` and other expected properties
 *   to ensure compatibility and prevent runtime errors.
 */
// Create this as a script that runs before your application code
// Save it as onlook-polyfill.js and include it in your _app.tsx or _document.tsx

// Check if we're running in the Onlook environment
const isOnlook = typeof window !== 'undefined' && 
  (window.navigator.userAgent.includes('Onlook') || (window as any).__ONLOOK_ENVIRONMENT__ === true);

// Create a mock implementation of Onlook's expected methods
if (isOnlook) {
  // Create the webview object if it doesn't exist
  window.webview = window.webview || {};
  
  // Define the missing method to prevent the error
  if (!window.webview.setWebviewId) {
    window.webview.setWebviewId = function(id) {
      console.log('Mock setWebviewId called with:', id);
      // You can implement actual functionality here if needed
      return true;
    };
  }
  
  // Add any other Onlook-specific methods that might be missing
  window.__ONLOOK_INITIALIZED__ = true;
  
  console.log('Onlook environment detected and polyfilled');
}


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