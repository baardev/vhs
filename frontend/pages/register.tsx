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
 * @description Next.js font optimization for Geist Sans font, applied via CSS variable.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * @constant geistMono
 * @description Next.js font optimization for Geist Mono font, applied via CSS variable.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * @page RegisterPage
 * @description This page component provides a form for new users to register an account.
 * It collects username, email, password, and password confirmation. On successful registration,
 * it redirects the user to the login page.
 *
 * @remarks
 * - **State Management**: Uses `useState` for form inputs (username, email, password, confirmPassword),
 *   loading state (`isLoading`), and error messages (`error`).
 * - **Form Validation**: Performs a client-side check to ensure that the password and confirm password fields match.
 * - **API Interaction**: Makes a POST request to `/api/auth/register` with the registration details.
 * - **Navigation**: Uses `useRouter` to redirect to `/login?registered=true` upon successful registration.
 *   Provides a `Link` component for navigation to the `/login` page for existing users.
 * - **Internationalization**: Uses `useTranslation` from `next-i18next` and `getStaticProps` with `getI18nProps` for translations.
 * - **Styling**: Uses Geist fonts and Tailwind CSS.
 *
 * Called by:
 * - Next.js routing system when a user navigates to `/register`.
 *
 * Calls:
 * - React Hooks: `useState`.
 * - Next.js: `useRouter`, `Link`.
 * - `axios.post` (to submit registration data to `/api/auth/register`).
 * - `useTranslation` (from `next-i18next`).
 * - `getI18nProps` (via `getStaticProps`).
 *
 * @returns {JSX.Element} The rendered user registration page.
 */
const Register = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('common');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('register.passwordsNotMatch', 'Passwords do not match'));
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
      router.push('/login?registered=true');
    } catch (err: unknown) {
      console.error('Registration error:', err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.msg ||
          t('register.registrationFailed', 'Registration failed. Please try again.')
        );
      } else {
        setError(t('register.registrationFailed', 'Registration failed. Please try again.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111] relative`}>
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t('register.title')}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('register.orSignIn')}{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              {t('login.signIn', 'Sign in')}
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
                {t('register.usernameLabel', 'Username')}
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
                {t('register.emailLabel', 'Email address')}
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
                {t('register.passwordLabel', 'Password')}
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
                {t('register.confirmPasswordLabel', 'Confirm Password')}
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
              {isLoading ? t('register.creatingAccount', 'Creating account...') : t('register.createAccount', 'Create account')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return getI18nProps(locale);
};

export default Register;