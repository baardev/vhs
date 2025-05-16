'use client';

import Link from 'next/link';
// import { useTranslation } from 'next-i18next'; // REMOVED
import { useParams } from 'next/navigation'; // ADDED
import { useState, useEffect } from 'react';
import LogoutButton from '../LogoutButton';
import { getCommonDictionary } from '../../app/dictionaries'; // ADDED - Adjust path if necessary

// Add the necessary type declaration for the window object
declare global {
  interface Window {
    toggleDarkMode?: () => void;
  }
}

/**
 * @component Navbar
 * @description Renders the main navigation bar for the application.
 * It displays different links based on the user's authentication status and roles (admin/editor).
 * Features a responsive design with a hamburger menu for mobile devices.
 *
 * @remarks
 * - Now includes dark mode toggle.
 * - Manages `isLoggedIn`, `username`, and `isEditor` states based on `localStorage` data.
 * - Listens to `storage` and `authChange` window events to update authentication status dynamically.
 * - Uses a `mounted` state to prevent hydration mismatches, showing a skeleton loader initially.
 * - Includes links to Home, Courses, Player Scorecards.
 * - Conditionally displays links to Admin dashboard, Editor dashboard, Profile, Sign In, and Create Account.
 * - Integrates the `LogoutButton` component.
 * - Uses dictionary-based approach for internationalization.
 * - Includes a temporary `useEffect` for debugging translations (should be removed in production).
 *
 * Called by:
 * - `frontend/app/[lang]/layout.tsx` (as part of the main application layout)
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`
 * - `next/link`'s `Link` component (for client-side navigation)
 * - `next/navigation`'s `useParams` hook (for language parameter and dictionary loading)
 * - `getCommonDictionary` for loading translations.
 * - `localStorage.getItem` (to retrieve `token` and `userData`)
 * - `JSON.parse` (to parse `userData`)
 * - `window.addEventListener` and `window.removeEventListener` (for `storage` and `authChange` events)
 * - `LogoutButton` component
 * - SVG icons (for logo and hamburger menu)
 *
 * @returns {React.FC} The rendered navigation bar component.
 */
const Navbar = () => {
  // const { t, ready, i18n } = useTranslation('common'); // REMOVED
  const params = useParams() || {}; // Add fallback empty object
  const lang = (params.lang as string) || 'en'; // ADDED

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dict, setDict] = useState<Record<string, any> | null>(null); // Initialize with null
  const [dictError, setDictError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    setIsLoggedIn(!!token);

    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUsername(user.username || '');
        setIsEditor(user.is_editor || false);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      setIsLoggedIn(!!token);

      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUsername(user.username || '');
          setIsEditor(user.is_editor || false);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      } else {
        setUsername('');
        setIsEditor(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (lang) {
      console.log(`[Navbar] Attempting to load dictionary for lang: ${lang}`);
      setDict(null); // Reset dict on lang change to show loading state
      setDictError(null);
      getCommonDictionary(lang)
        .then(loadedDict => {
          if (loadedDict && typeof loadedDict === 'object' && Object.keys(loadedDict).length > 0) {
            console.log(`[Navbar] Successfully loaded dictionary for lang '${lang}'. First key:`, Object.keys(loadedDict)[0], loadedDict[Object.keys(loadedDict)[0]]);
            setDict(loadedDict);
          } else {
            console.error(`[Navbar] Loaded dictionary for lang '${lang}' is empty or invalid:`, loadedDict);
            setDict({}); // Set to empty object to allow fallbacks to work
            setDictError(`Dictionary for lang '${lang}' was empty or invalid.`);
          }
        })
        .catch(error => {
          console.error(`[Navbar] Catch: Error loading dictionary for lang '${lang}':`, error);
          setDict({}); // Set to empty object on error
          setDictError(`Failed to load dictionary for lang '${lang}': ${error.message}`);
        });
    } else {
      console.warn('[Navbar] lang parameter is not available. Cannot load dictionary.');
      setDict({}); // No lang, no dictionary
      setDictError('Language parameter missing.');
    }
  }, [lang]);

  // Skip rendering fully until client-side and dictionary are ready or an error occurred
  if (!mounted) {
    // Return a minimal navbar skeleton
    return (
      <nav className="w-full bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16"></div>
        </div>
      </nav>
    );
  }
  
  // If dictionary is still loading (null) and no error, show loading. 
  // If error, it will show fallbacks. If dict is {}, it will show fallbacks.
  if (dict === null && !dictError) {
     console.log('[Navbar] Dictionary is null and no error, showing loading skeleton.');
     // Return a minimal navbar skeleton or a specific loading indicator
     return (
      <nav className="w-full bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16"><span>Loading translations...</span></div>
        </div>
      </nav>
    );
  }
  
  if (dictError && (!dict || Object.keys(dict).length === 0) ) {
    console.warn(`[Navbar] Rendering with fallback texts due to dictionary error: ${dictError}`);
  }
  
  // Ensure dict is an object for safe access, even if it's empty from an error
  const currentDict = dict || {};

  return (
    <nav className="w-full bg-white shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href={`/${lang}/`} className="flex items-center text-[#2d6a4f]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.743-.95l.337-2.698a.99.99 0 0 0-.278-.83l-1.566-1.566a.997.997 0 0 1 0-1.414L18.285 6.3a.997.997 0 0 1 1.414 0l.707.707a.997.997 0 0 1 .289.707l-1.046 2.175"></path>
                <path d="M11.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.743-.95l.337-2.698a.99.99 0 0 0-.278-.83l-1.566-1.566a.997.997 0 0 1 0-1.414L10.285 6.3a.997.997 0 0 1 1.414 0l.707.707a.997.997 0 0 1 .289.707l-1.046 2.175"></path>
                <circle cx="3.5" cy="12" r="2.5"></circle>
              </svg>
              <span className="text-xl font-bold">VHS</span>
            </Link>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 p-2"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link href={`/${lang}/dashboard`} className="text-gray-700 hover:text-[#2d6a4f]">
              {currentDict?.home || 'Home'}
            </Link>
            <Link href={`/${lang}/courses`} className="text-gray-700 hover:text-[#2d6a4f]">
              {currentDict?.courses || 'Courses'}
            </Link>
            <Link href={`/${lang}/player-cards`} className="text-gray-700 hover:text-[#2d6a4f]">
              {currentDict?.playerScorecards || 'Player Scorecards'}
            </Link>

            {isLoggedIn ? (
              <>
                {(() => {
                  try {
                    const userData = localStorage.getItem('userData');
                    if (userData) {
                      const parsedData = JSON.parse(userData);
                      if (parsedData.is_admin) {
                        return (
                          <Link
                            href={`/${lang}/admin`}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm"
                          >
                            {currentDict?.admin?.title || 'Admin'} 
                          </Link>
                        );
                      }
                    }
                  } catch (error) {
                    console.error('Error checking admin status:', error);
                  }
                  return null;
                })()}

                {isEditor && (
                  <Link href={`/${lang}/editor`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm ml-3">
                    {currentDict?.editor?.title || currentDict?.editorDashboard || 'Editor'}
                  </Link>
                )}

                <div className="flex items-center ml-6">
                  <Link
                    href={`/${lang}/profile`}
                    className="text-gray-700 hover:text-[#2d6a4f] font-medium mr-3"
                  >
                    {username}
                  </Link>

                  <LogoutButton
                    variant="text"
                    className="text-gray-700 hover:text-[#2d6a4f]"
                    dict={currentDict} // Pass currentDict
                  />
                </div>
              </>
            ) : (
              <>
                <Link href={`/${lang}/login`} className="text-gray-700 hover:text-[#2d6a4f]">
                  {currentDict?.signIn || 'Sign In'}
                </Link>
                <Link href={`/${lang}/register`} className="text-gray-700 hover:text-[#2d6a4f]">
                  {currentDict?.createAccount || 'Create Account'}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4 absolute right-4 left-4 z-50">
          <div className="flex flex-col space-y-4">
            <Link href={`/${lang}/dashboard`} className="text-gray-700 hover:text-[#2d6a4f] py-2 px-3 rounded-md hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
              {currentDict?.home || 'Home'}
            </Link>
            <Link href={`/${lang}/courses`} className="text-gray-700 hover:text-[#2d6a4f] py-2 px-3 rounded-md hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
              {currentDict?.courses || 'Courses'}
            </Link>
            <Link href={`/${lang}/player-cards`} className="text-gray-700 hover:text-[#2d6a4f] py-2 px-3 rounded-md hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
              {currentDict?.playerScorecards || 'Player Scorecards'}
            </Link>

            {isLoggedIn ? (
              <>
                {(() => {
                  try {
                    const userData = localStorage.getItem('userData');
                    if (userData) {
                      const parsedData = JSON.parse(userData);
                      if (parsedData.is_admin) {
                        return (
                          <Link
                            href={`/${lang}/admin`}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-md"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {currentDict?.admin?.title || 'Admin'}
                          </Link>
                        );
                      }
                    }
                  } catch (error) {
                    console.error('Error checking admin status:', error);
                  }
                  return null;
                })()}

                {isEditor && (
                  <Link
                    href={`/${lang}/editor`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {currentDict?.editor?.title || currentDict?.editorDashboard || 'Editor'}
                  </Link>
                )}

                <Link href={`/${lang}/profile`} className="text-gray-700 hover:text-[#2d6a4f] py-2 px-3 rounded-md hover:bg-gray-100 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  {username}
                </Link>
                <div className="py-2 px-3">
                  <LogoutButton 
                    variant="text" 
                    className="text-gray-700 hover:text-[#2d6a4f]" 
                    dict={currentDict} // Pass currentDict
                  />
                </div>
              </>
            ) : (
              <>
                <Link href={`/${lang}/login`} className="text-gray-700 hover:text-[#2d6a4f] py-2 px-3 rounded-md hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                  {currentDict?.signIn || 'Sign In'}
                </Link>
                <Link href={`/${lang}/register`} className="text-gray-700 hover:text-[#2d6a4f] py-2 px-3 rounded-md hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                  {currentDict?.createAccount || 'Create Account'}
                </Link>
              </>
            )}
            
            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700 text-sm mt-2">
              {currentDict?.closeMenu || 'Close Menu'} 
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;