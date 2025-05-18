'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLoginDictionary } from '../dictionaries'; 

/**
 * @page LoginPage
 * @description Authentication interface for the Open Handicap System.
 * 
 * This page provides the main entry point for user authentication, featuring:
 * - A secure login form for username/email and password
 * - Password visibility toggle for better user experience
 * - Error handling with descriptive messages
 * - Links to account registration and password recovery
 * - Proper form validation and submission handling
 * 
 * On successful authentication, the component:
 * - Stores the JWT token in localStorage for subsequent authenticated requests
 * - Saves user data to localStorage for easy access throughout the application
 * - Dispatches an 'authChange' event to notify other components of the auth state change
 * - Redirects the user to their dashboard
 * 
 * @calledBy
 * - Next.js App Router (when user navigates to /{lang}/login)
 * - Protected routes (via redirect when authentication is required)
 * - Navbar login link
 * - Registration page (if user already has an account)
 * 
 * @calls
 * - API: POST /api/auth/login (to authenticate user credentials)
 * - Function: getLoginDictionary (for internationalization)
 * - Component: Link (for navigation to register and forgot-password pages)
 * - Router: useRouter().push() (for redirect after successful login)
 * 
 * @requires
 * - Backend API with authentication endpoint
 * - localStorage for token/user data storage
 * - Dictionary translations for login page content
 */
export default function Login({
  params: { lang }
}: {
  params: { lang: string }
}) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dictionary, setDictionary] = useState<any>({
    title: 'Sign in to VHS',
    subtitle: 'Access your account',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?"
  });
  const [dictionaryLoaded, setDictionaryLoaded] = useState(false);

  // Load dictionary asynchronously
  useEffect(() => {
    async function loadDictionary() {
      try {
        const dict = await getLoginDictionary(lang);
        setDictionary(dict);
      } catch (err) {
        console.error('Error loading dictionary:', err);
        // Continue with default fallback values
      } finally {
        setDictionaryLoaded(true);
      }
    }
    loadDictionary();
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', username);
      
      // Set a timeout for the fetch operation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
          signal: controller.signal
        });

        // Clear the timeout
        clearTimeout(timeoutId);
        
        console.log('Login response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('API endpoint not found. Please contact support.');
            setIsLoading(false);
            return;
          }
          
          if (response.status === 524 || response.status === 522 || response.status === 523) {
            console.error('CloudFlare timeout error:', response.status);
            setError('The server is taking too long to respond. This is a known issue we are fixing. Please try again in a moment.');
            setIsLoading(false);
            return;
          }
          
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.indexOf('application/json') !== -1) {
            const data = await response.json();
            console.log('Login response error data:', data);
            setError(data.error || data.message || 'Invalid credentials');
          } else {
            setError(`Server returned ${response.status}: ${response.statusText}`);
          }
          setIsLoading(false);
          return;
        }
        
        const data = await response.json();
        console.log('Login response data:', data);

        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        window.dispatchEvent(new Event('authChange'));
        
        // Redirect user to dashboard
        router.push(`/${lang}/dashboard`);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        // Handle abort error specifically
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
          console.error('Fetch request timed out');
          setError('Login request timed out. The server may be overloaded. Please try again.');
        } else {
          throw fetchError; // Re-throw to be caught by the outer catch
        }
      }
    } catch (err) {
      console.error('Login error details:', err);
      
      if (err instanceof TypeError && err.message.includes('NetworkError')) {
        setError('Network error. Please check your internet connection and try again.');
      } else if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Connection to server failed. The server may be temporarily unavailable.');
      } else {
        setError(`Server error (${err instanceof Error ? err.message : 'unknown'}). Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111] relative">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">{dictionary.title}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {dictionary.noAccount}{' '}
            <Link href={`/${lang}/register`} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Create Account
            </Link>
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username or Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="username or email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading
                  ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              href={`/${lang}/forgot-password`}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {dictionary.forgotPassword}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 