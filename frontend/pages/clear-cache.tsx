import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getI18nProps } from '../utils/i18n-helpers';

/**
 * @page ClearCache
 * @description A utility page that attempts to clear various browser storage mechanisms
 * including localStorage, sessionStorage, and cookies. It also dispatches an 'authChange' event.
 * This is typically used to ensure a complete logout or to reset client-side state.
 *
 * @remarks
 * - **Functionality**: On component mount (via `useEffect`), it calls `localStorage.clear()`, `sessionStorage.clear()`,
 *   and iterates through `document.cookie` to set past expiry dates for cookies (basic approach).
 * - **Event Dispatch**: After attempting to clear storage, it dispatches a global `authChange` event.
 *   This can be listened to by other components (e.g., `_app.tsx`) to react to the logout state.
 * - **User Feedback**: Displays a message indicating whether the cache clearing was successful or if an error occurred.
 * - **Navigation**: Provides links to the Login page and the Homepage.
 * - **Static Props**: Includes `getStaticProps` for `next-i18next` internationalization, though translations are not
 *   explicitly used in the current visible text of the component itself beyond what `i18n-helpers` might provide globally.
 *
 * Called by:
 * - Next.js router when a user navigates to `/clear-cache`.
 *
 * Calls:
 * - `localStorage.clear()`
 * - `sessionStorage.clear()`
 * - `document.cookie` manipulation (to attempt cookie clearing).
 * - `window.dispatchEvent` (to signal an `authChange`).
 * - React Hooks: `useState`, `useEffect`.
 * - Next.js: `Link`.
 * - `getI18nProps` (via `getStaticProps`).
 *
 * @returns {JSX.Element} The rendered page displaying the cache clearing status and navigation links.
 */
export default function ClearCache() {
  const [cleared, setCleared] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      // Clear localStorage
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear cookies (this is a basic approach - not all cookies will be cleared)
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Dispatch auth change event
      window.dispatchEvent(new Event('authChange'));

      setCleared(true);
    } catch (e) {
      setError(`Error clearing cache: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Cache Clearing Utility</h1>

        {cleared ? (
          <div className="p-4 bg-green-100 text-green-800 rounded mb-6">
            <p className="font-medium">✅ All browser storage has been cleared!</p>
            <p className="text-sm mt-2">You are now completely logged out.</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-800 rounded mb-6">
            <p className="font-medium">❌ Error clearing cache</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        ) : (
          <div className="p-4 bg-blue-100 text-blue-800 rounded mb-6">
            <p className="font-medium">Clearing browser storage...</p>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <Link href="/login" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
            Go to Login
          </Link>
          <Link href="/" className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

// This function gets called at build time
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return getI18nProps(locale);
};