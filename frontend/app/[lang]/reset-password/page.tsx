'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
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
 * @page ResetPasswordPage
 * @description Password reset interface for the Open Handicap System.
 * 
 * This client component handles the final step in the password recovery process,
 * allowing users to set a new password after receiving a reset token via email.
 * The component includes:
 * - Validation of the reset token from URL parameters
 * - A form for entering and confirming a new password
 * - Password validation (matching passwords, minimum length)
 * - Error handling for invalid tokens or submission failures
 * - Success feedback with automatic redirection to login
 * 
 * If no valid token is provided in the URL, the page displays an error message
 * instead of the password reset form. On successful password reset, the user
 * is automatically redirected to the login page after a brief success message.
 * 
 * @calledBy
 * - Next.js App Router (when user navigates to /{lang}/reset-password)
 * - Email reset links (with token parameter)
 * - Forgot password flow (as the final step)
 * 
 * @calls
 * - API: POST /api/auth/reset-password (to reset the user password)
 * - Function: getCommonDictionary (for internationalization)
 * - Router: useRouter().push() (for redirect after successful reset)
 * - Hook: useSearchParams() (to extract the token from the URL)
 * 
 * @requires
 * - Backend API with password reset endpoint
 * - Valid reset token in URL parameters
 * - Dictionary translations for reset password page content
 */
export default function ResetPassword({ params: { lang } }) {
  const [dict, setDict] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Load dictionary
  useEffect(() => {
    async function loadDictionary() {
      const dictionary = await getCommonDictionary(lang);
      setDict(dictionary);
    }
    loadDictionary();
  }, [lang]);

  if (!token) {
    return (
      <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              {dict?.resetPassword?.invalidTitle || 'Invalid Reset Link'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {dict?.resetPassword?.invalidMessage || 'The password reset link is invalid or has expired.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(dict?.resetPassword?.passwordsNotMatch || 'Passwords do not match');
      return;
    }

    if (password.length < 5) {
      setError(dict?.resetPassword?.passwordTooShort || 'Password must be at least 5 characters long');
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || dict?.resetPassword?.genericError || 'Failed to reset password');
      }

      setSuccess(true);
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push(`/${lang}/login`);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : dict?.resetPassword?.unexpectedError || 'An error occurred');
    }
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {dict?.resetPassword?.title || 'Reset Your Password'}
          </h2>
        </div>
        {success ? (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  {dict?.resetPassword?.successTitle || 'Password reset successful!'}
                </h3>
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  <p>{dict?.resetPassword?.successMessage || 'You will be redirected to the login page shortly.'}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  {dict?.resetPassword?.newPassword || 'New Password'}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={dict?.resetPassword?.newPassword || 'New Password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  {dict?.resetPassword?.confirmPassword || 'Confirm Password'}
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={dict?.resetPassword?.confirmPassword || 'Confirm Password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {dict?.resetPassword?.resetButton || 'Reset Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 