import Link from 'next/link';
import { useTranslation } from 'next-i18next';
// import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import LogoutButton from '../LogoutButton';

/**
 * @component Navbar
 * @description Renders the main navigation bar for the application.
 * It displays different links based on the user's authentication status and roles (admin/editor).
 * Features a responsive design with a hamburger menu for mobile devices.
 *
 * @remarks
 * - Manages `isLoggedIn`, `username`, and `isEditor` states based on `localStorage` data.
 * - Listens to `storage` and `authChange` window events to update authentication status dynamically.
 * - Uses a `mounted` state to prevent hydration mismatches with translated content, showing a skeleton loader initially.
 * - Includes links to Home, Courses, Player Scorecards.
 * - Conditionally displays links to Admin dashboard, Editor dashboard, Profile, Sign In, and Create Account.
 * - Integrates the `LogoutButton` component.
 * - Uses `next-i18next` for internationalization of link texts and labels.
 * - Includes a temporary `useEffect` for debugging translations (should be removed in production).
 *
 * Called by:
 * - `frontend/pages/_app.tsx` (as part of the main application layout)
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`
 * - `next/link`'s `Link` component (for client-side navigation)
 * - `next-i18next`'s `useTranslation` hook (for internationalization)
 * - `localStorage.getItem` (to retrieve `token` and `userData`)
 * - `JSON.parse` (to parse `userData`)
 * - `window.addEventListener` and `window.removeEventListener` (for `storage` and `authChange` events)
 * - `LogoutButton` component
 * - SVG icons (for logo and hamburger menu)
 *
 * @returns {React.FC} The rendered navigation bar component.
 */
const Navbar = () => {
  const { t, ready, i18n } = useTranslation('common');
//   const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  // Add state for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Debug translations - TEMPORARY
  useEffect(() => {
    if (mounted && isLoggedIn) {
      console.log('Current language:', i18n.language);
      console.log('Upload Scorecard translation:', t('uploadScorecard', 'FALLBACK VALUE'));
      console.log('Is translation ready:', ready);
      console.log('Available languages:', i18n.languages);
      console.log('Namespace loaded:', i18n.hasLoadedNamespace('common'));
    }
  }, [mounted, isLoggedIn, i18n, t, ready]);

  // Skip rendering fully until client-side and translations are ready
  if (!mounted) {
    // Return a minimal navbar skeleton that doesn't use translations
    return (
      <nav className="w-full bg-white dark:bg-gray-900 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Simple placeholder with no text that requires translation */}
          <div className="flex justify-between h-16"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-[#2d6a4f] dark:text-[#4fd1c5]">
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

          {/* Hamburger menu button - only visible on mobile */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 p-2"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {mounted && (
              <>
                {/* ---------------------------- {t('home')} ---------------------------- */}
                <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]">
                  {t('home')}
                </Link>
                {/* ---------------------------- {t('courses')} ---------------------------- */}
                <Link href="/course-data" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]">
                  {t('courses')}
                </Link>
                {/* ---------------------------- Player Scorecards ---------------------------- */}
                <Link href="/player-cards" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]">
                  {t('playerScorecards', 'Player Scorecards')}
                </Link>

                {isLoggedIn ? (
                  <>
                    {/* ---------------------------- Admin Link ---------------------------- */}
                    {(() => {
                      try {
                        const userData = localStorage.getItem('userData');
                        if (userData) {
                          const parsedData = JSON.parse(userData);
                          if (parsedData.is_admin) {
                            return (
                              <Link
                                href="/admin"
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm"
                              >
                                {t('admin.title', 'Admin')}
                              </Link>
                            );
                          }
                        }
                      } catch (error) {
                        console.error('Error checking admin status:', error);
                      }
                      return null;
                    })()}

                    {/* ---------------------------- Editor Link ---------------------------- */}
                    {isEditor && (
                      <Link href="/editor" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm ml-3">
                        {t('update', 'Update')}
                      </Link>
                    )}

                    {/* ---------------------------- User Profile ---------------------------- */}
                    <div className="flex items-center ml-6">
                      <Link
                        href="/profile"
                        className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5] font-medium mr-3"
                      >
                        {username}
                      </Link>

                      <LogoutButton
                        variant="text"
                          className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* ---------------------------- {t('signIn')} ---------------------------- */}
                    <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]">
                      {t('signIn')}
                    </Link>
                    {/* ---------------------------- {t('createAccount')} ---------------------------- */}
                    <Link href="/register" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]">
                      {t('createAccount')}
                    </Link>
                  </>
                )}
              </>
            )}
            {!mounted && (
              <>
                <span className="text-gray-700 dark:text-gray-300">...</span>
                <span className="text-gray-700 dark:text-gray-300">...</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown - only visible when hamburger clicked */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 absolute right-4 left-4 z-50">
          <div className="flex flex-col space-y-4">
            <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5] py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>
              {t('home')}
            </Link>
            <Link href="/course-data" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5] py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>
              {t('courses')}
            </Link>
            <Link href="/player-cards" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5] py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>
              {t('playerScorecards', 'Player Scorecards')}
            </Link>


            {isLoggedIn ? (
              <>
                {/* Mobile Admin Link */}
                {(() => {
                  try {
                    const userData = localStorage.getItem('userData');
                    if (userData) {
                      const parsedData = JSON.parse(userData);
                      if (parsedData.is_admin) {
                        return (
                          <Link
                            href="/admin"
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-md"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {t('admin.title', 'Admin')}
                          </Link>
                        );
                      }
                    }
                  } catch (error) {
                    console.error('Error checking admin status:', error);
                  }
                  return null;
                })()}

                {/* Mobile Editor Link */}
                {isEditor && (
                  <Link
                    href="/editor"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('update', 'Update')}
                  </Link>
                )}

                <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5] py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  {username}
                </Link>
                <div className="py-2 px-3">
                  <LogoutButton variant="text" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]" />
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5] py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>
                  {t('signIn')}
                </Link>
                <Link href="/register" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5] py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>
                  {t('createAccount')}
                </Link>
              </>
            )}
            
            {/* Close button */}
            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm mt-2">
              Close Menu
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;