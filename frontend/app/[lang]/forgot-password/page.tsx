'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
 * @page ForgotPassword
 * @description Password recovery interface for the Open Handicap System.
 * 
 * This page provides users with a way to reset their forgotten passwords by:
 * - Allowing them to enter their email address
 * - Submitting a request to the backend to send a password reset link
 * - Displaying appropriate success or error messages
 * - Providing navigation back to the login page
 * 
 * For security reasons, the page always shows a success message regardless
 * of whether the email exists in the system, preventing user enumeration attacks.
 * The actual verification happens securely on the server side.
 * 
 * @calledBy
 * - Next.js App Router (when user navigates to /{lang}/forgot-password)
 * - Login page (via "Forgot Password?" link)
 * 
 * @calls
 * - API: POST /api/auth/forgot-password (to request password reset email)
 * - Function: getCommonDictionary (for internationalization)
 * - Component: Link (for navigation back to login)
 * 
 * @requires
 * - Backend API support for password reset functionality
 * - Email service configured on the backend
 * - Dictionary translations for password reset page content
 */
export default function ForgotPassword({ params: { lang } }) {
  const [dict, setDict] = useState(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

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
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || dict?.forgotPassword?.genericError || 'Failed to send reset email');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : dict?.forgotPassword?.unexpectedError || 'An error occurred');
    }
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111] relative`}>
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {dict?.forgotPassword?.title || 'Forgot Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {dict?.forgotPassword?.subtitle || 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {success ? (
          <div className="rounded-md bg-green-50 dark:bg-green-900 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-white">
                  {dict?.forgotPassword?.successTitle || 'Request Sent'}
                </h3>
                <div className="mt-2 text-sm text-green-700 dark:text-gray-100">
                  <p>
                    {dict?.forgotPassword?.successMessage || 'If an account with that email exists, a password reset link has been sent to your email. Please check your inbox (and spam folder).'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {dict?.forgotPassword?.emailLabel || 'Email address'}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-[#111]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {dict?.forgotPassword?.send || 'Send Reset Link'}
              </button>
            </div>

            <div className="text-sm text-center">
              <Link href={`/${lang}/login`} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                {dict?.forgotPassword?.return || 'Return to login'}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 