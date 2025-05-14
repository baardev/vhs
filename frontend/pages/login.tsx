import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import axios from 'axios'; // Removed unused import
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
 * @page LoginPage
 * @description This page component provides a user login form.
 * It allows users to enter their username and password to authenticate.
 * On successful authentication, it stores user data and a token in localStorage,
 * dispatches an 'authChange' event, and redirects to the dashboard.
 * It also handles login errors and provides links for registration and password recovery.
 *
 * @remarks
 * - **State Management**: Uses `useState` for username, password, error messages, and loading state.
 * - **API Interaction**: Makes a POST request to `/api/auth/login` with username and password.
 * - **Storage**: On successful login, stores `token` and `userData` in `localStorage`.
 * - **Event Dispatch**: Dispatches a global `authChange` event on successful login, allowing other
 *   components (e.g., Navbar in `_app.tsx`) to react to the authentication status change.
 * - **Navigation**: Uses `useRouter` to redirect to `/dashboard` after successful login.
 *   Provides `Link` components for navigation to `/register` and `/forgot-password`.
 * - **Internationalization**: Uses `useTranslation` from `next-i18next` and `getStaticProps` with `getI18nProps` for translations.
 * - **Styling**: Uses Geist fonts and Tailwind CSS.
 *
 * Called by:
 * - Next.js routing system when a user navigates to `/login` or is redirected due to lack of authentication.
 *
 * Calls:
 * - React Hooks: `useState`.
 * - Next.js: `useRouter`, `Link`.
 * - `fetch` (to POST to `/api/auth/login`).
 * - `localStorage.setItem`.
 * - `window.dispatchEvent`.
 * - `useTranslation` (from `next-i18next`).
 * - `getI18nProps` (via `getStaticProps`).
 *
 * @returns {JSX.Element} The rendered login page.
 */
const Login = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('handleSubmit called!');
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      console.log('Form submitted');
      console.log('Response received:', response);
      console.log('Data received:', data);
      console.log('COMPLETE DATA RECEIVED:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        console.log('SAVED USER DATA:', JSON.stringify(data.user));
        
        window.dispatchEvent(new Event('authChange'));   //  <<< add this line
        
        // Redirect user to dashboard regardless of admin status
        router.push('/dashboard');
      } else {
        setError(data.message || t('login.invalidCredentials', 'Invalid credentials'));
      }
    } catch (err) {
      setError(t('login.serverError', 'Server error. Please try again.'));
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111] relative`}>
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t('login.title')}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('login.orCreateAccount')}{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              {t('createAccount')}
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
                {t('login.usernameLabel')}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="username or email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('login.passwordLabel')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {isLoading ? t('login.signingIn') : t('login.signIn')}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t('forgotPassword.link')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return getI18nProps(locale);
};

export default Login;
