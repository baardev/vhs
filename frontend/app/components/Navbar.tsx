'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';
import { getCommonDictionary } from '../dictionaries';
import { validateToken, clearAuthData } from '../../src/utils/authUtils'; 

/**
 * @component Navbar
 * @description Renders the main navigation bar for the Open Handicap System application.
 * 
 * This component provides the primary navigation interface with:
 * - Dynamic link generation based on user authentication state
 * - Role-based access control for admin and editor sections
 * - Responsive design with mobile menu toggle
 * - Internationalization support via dictionary loading
 * - Dark mode toggle support
 * - Authentication state monitoring and token validation
 * 
 * The component handles loading states appropriately to prevent hydration mismatches
 * and provides fallback UI during dictionary loading.
 * 
 * @calledBy
 * - RootLayout (as the main application header)
 * - All pages that use the default layout
 * 
 * @calls
 * - getCommonDictionary (for internationalization)
 * - validateToken/clearAuthData (for auth verification)
 * - LogoutButton component
 * - localStorage API (for auth state persistence)
 * - next/navigation hooks (for routing and params)
 * 
 * @requires
 * - Client-side rendering ('use client' directive)
 * - Authentication utilities
 * - Dictionary data for localization
 * - localStorage access
 * 
 * @returns {JSX.Element} The rendered navigation bar component
 */
const Navbar = () => {
  const params = useParams() || {};
  const lang = (params.lang as string) || 'en';
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  const [dictError, setDictError] = useState<string | null>(null);

  // Validate token on mount
  useEffect(() => {
    const validateUserToken = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        console.log('[Navbar] Validating token on page load');
        const isValid = await validateToken();
        
        if (!isValid) {
          console.warn('[Navbar] Token validation failed, logging out user');
          clearAuthData();
          if (window.location.pathname.includes('/admin') || 
              window.location.pathname.includes('/editor')) {
            router.push(`/${lang}/login`);
          }
        } else {
          console.log('[Navbar] Token successfully validated');
        }
      }
    };
    
    if (mounted) {
      validateUserToken();
    }
  }, [mounted, lang, router]);

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
              <span className="text-xl font-bold">OHS</span>
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
            {isLoggedIn && (
            <Link href={`/${lang}/dashboard`} className="text-gray-700 hover:text-[#2d6a4f]">
              {currentDict?.home || 'Home'}
            </Link>
            )}
            <Link href={`/${lang}/courses`} className="text-gray-700 hover:text-[#2d6a4f]">
              {currentDict?.courses || 'Courses'}
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
                    {currentDict?.editor?.title || (currentDict?.editorDashboard?.dashboard) || 'Editor'}
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
            {isLoggedIn && (
            <Link href={`/${lang}/dashboard`} className="text-gray-700 hover:text-[#2d6a4f] py-2 px-3 rounded-md hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
              {currentDict?.home || 'Home'}
            </Link>
            )}
            <Link href={`/${lang}/courses`} className="text-gray-700 hover:text-[#2d6a4f] py-2 px-3 rounded-md hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
              {currentDict?.courses || 'Courses'}
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
                    {currentDict?.editor?.title || (currentDict?.editorDashboard?.dashboard) || 'Editor'}
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