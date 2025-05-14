import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { Geist, Geist_Mono } from "next/font/google";
import HomeLink from '../../components/common/HomeLink';

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
 * @page ResetPasswordTokenPage
 * @description This page component handles the password reset process when a user clicks a unique
 * password reset link containing a token. It captures the token from the URL path (dynamic route),
 * presents a form for the user to enter and confirm their new password, and then submits this
 * information to the backend API to update the password.
 *
 * @remarks
 * - Called by: Next.js router for dynamic routes matching `/reset-password/[token]` (e.g., `/reset-password/xyz123abc`).
 *   This link is typically provided in a password reset email.
 * - Calls:
 *   - `axios.post` (to `/api/auth/reset-password` with the token and new password)
 *   - `useState`, `useEffect` (React hooks for managing component state and side effects)
 *   - `useRouter` (Next.js hook for accessing the dynamic `token` route parameter and for navigation)
 *   - `Link` (Next.js component for navigation to `/login`)
 *   - `HomeLink` (custom component, likely for navigating to the homepage)
 *   - `setTimeout` (to redirect after successful password reset)
 * - Utilizes `geistSans` and `geistMono` for font styling.
 * - Displays success/error messages based on the API response and form validation.
 *
 * @returns {JSX.Element} The rendered password reset form page or an error/loading state.
 */
export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ensure token is available (router.query might be empty on initial render)
  useEffect(() => {
    if (!router.isReady) return;
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [router.isReady, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post('/api/auth/reset-password', {
        token,
        password,
      });

      // Show success message
      setSuccess('Your password has been reset successfully!');

      // Clear the form
      setPassword('');
      setConfirmPassword('');

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login?reset=success');
      }, 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.msg ||
          'Failed to reset your password. The link may be expired or invalid.'
        );
      } else {
        setError('Failed to reset your password. The link may be expired or invalid.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111] relative`}>
      <HomeLink />
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create a new password for your account
          </p>
        </div>

        {success ? (
          <div className="rounded-md bg-green-50 dark:bg-green-900 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {success}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-md bg-red-50 dark:bg-red-900 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={5}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-[#111]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm New Password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={5}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-[#111]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Resetting password...' : 'Reset password'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Return to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}