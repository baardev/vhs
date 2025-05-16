import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { Geist, Geist_Mono } from "next/font/google";
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nProps } from '../utils/i18n-helpers';

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
 * @description This page component provides a form for users to request a password reset link.
 * It allows users to enter their email address, and upon submission, it sends a request
 * to the backend API to initiate the password reset process. It displays success or error
 * messages based on the API response.
 *
 * @remarks
 * - Called by: Next.js router when navigating to `/forgot-password`.
 * - Calls:
 *   - `fetch` (to POST to `/api/auth/forgot-password`)
 *   - `useState` (React hook for managing email, error, and success states)
 *   - `useRouter` (Next.js hook for navigation)
 *   - `useTranslation` (from `next-i18next` for internationalization)
 *   - `Link` (Next.js component for client-side navigation to `/login`)
 * - Utilizes `geistSans` and `geistMono` for font styling.
 * - Includes `getStaticProps` for `next-i18next` internationalization setup.
 *
 * @returns {JSX.Element} The rendered forgot password page.
 */
const ForgotPassword = () => {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

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
        throw new Error(data.error || 'Failed to send reset email');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111] relative`}>
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('forgotPassword.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('forgotPassword.subtitle')}
          </p>
        </div>

        {success ? (
          <div className="rounded-md bg-green-50 dark:bg-green-900 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-white">
                  {t('forgotPassword.successTitle', 'Request Sent')}
                </h3>
                <div className="mt-2 text-sm text-green-700 dark:text-gray-100">
                  <p>
                    {t('forgotPassword.successMessage', 'If an account with that email exists, a password reset link has been sent to your email. Please check your inbox (and spam folder).')}
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
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('forgotPassword.emailLabel')}
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
                {t('forgotPassword.send')}
              </button>
            </div>

            <div className="text-sm text-center">
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                {t('forgotPassword.return')}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

// This function gets called at build time
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return getI18nProps(locale);
}