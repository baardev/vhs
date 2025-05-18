'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Geist, Geist_Mono } from "next/font/google";
import { getCommonDictionary } from '../dictionaries';

/**
 * @constant geistSans
 * @description Next.js font optimization for Geist Sans font.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * @constant geistMono
 * @description Next.js font optimization for Geist Mono font.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono", 
  subsets: ["latin"],
});

/**
 * @page RegisterPage
 * @description User registration interface for the Open Handicap System.
 * 
 * This client component provides a complete registration form that allows new users 
 * to create accounts in the system. The registration process includes:
 * - Username selection
 * - Email address verification
 * - Password creation and confirmation
 * - Form validation with error handling
 * - Submission feedback with loading states
 * 
 * Upon successful registration, users are redirected to the login page with 
 * a success indicator to improve the user experience flow. The form includes
 * proper input validation and clear error messaging.
 * 
 * @calledBy
 * - Next.js App Router (when user navigates to /{lang}/register)
 * - Login page (via "Create an account" link)
 * - Homepage call-to-action buttons (for new user onboarding)
 * - Marketing landing pages (for conversion)
 * 
 * @calls
 * - API: POST /api/auth/register (to create the user account)
 * - Function: getCommonDictionary (for internationalization)
 * - Component: Link (for navigation to login page)
 * - Router: useRouter().push() (for redirect after successful registration)
 * 
 * @requires
 * - Backend API with user registration endpoint
 * - Dictionary translations for registration page content
 * - Proper Next.js route configuration
 */
export default function Register({ params: { lang } }) {
  const router = useRouter();
  const [dict, setDict] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load dictionary
  useEffect(() => {
    async function loadDictionary() {
      const dictionary = await getCommonDictionary(lang);
      setDict(dictionary);
    }
    loadDictionary();
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(dict?.register?.passwordsNotMatch || 'Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post('/api/auth/register', {
        username,
        email,
        password,
      });

      // Redirect to login page on successful registration
      router.push(`/${lang}/login?registered=true`);
    } catch (err: unknown) {
      console.error('Registration error:', err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.msg ||
          dict?.register?.registrationFailed || 'Registration failed. Please try again.'
        );
      } else {
        setError(dict?.register?.registrationFailed || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111] relative`}>
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">{dict?.register?.title || 'Create an account'}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {dict?.register?.orSignIn || 'Already have an account?'}{' '}
            <Link href={`/${lang}/login`} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              {dict?.login?.signIn || 'Sign in'}
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
                {dict?.register?.usernameLabel || 'Username'}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict?.register?.emailLabel || 'Email address'}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict?.register?.passwordLabel || 'Password'}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                minLength={5}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict?.register?.confirmPasswordLabel || 'Confirm Password'}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
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
              {isLoading ? (dict?.register?.creatingAccount || 'Creating account...') : (dict?.register?.createAccount || 'Create account')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 