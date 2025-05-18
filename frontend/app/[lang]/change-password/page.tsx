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

export default function ChangePassword({ params: { lang } }) {
  const router = useRouter();
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load dictionary
  useEffect(() => {
    async function loadDictionary() {
      const dictionary = await getCommonDictionary(lang);
      setDict(dictionary);
    }
    loadDictionary();
  }, [lang]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push(`/${lang}/login`);
    }
  }, [router, lang]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError(dict?.password?.noMatch || 'New passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push(`/${lang}/login`);
        return;
      }

      // Call API to change password
      await axios.post(
        '/api/auth/change-password',
        {
          currentPassword,
          newPassword
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Show success message
      setSuccess(dict?.password?.changeSuccess || 'Your password has been changed successfully!');

      // Clear the form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Redirect back to profile after a delay
      setTimeout(() => {
        router.push(`/${lang}/profile`);
      }, 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.msg ||
          dict?.password?.changeError || 'Failed to change your password. Please check your current password.'
        );
      } else {
        setError(dict?.password?.unexpectedError || 'An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111] relative`}>
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {dict?.password?.title || 'Change Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {dict?.password?.subtitle || 'Update your account password'}
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
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {dict?.password?.current || 'Current Password'}
            </label>
            <div className="mt-1">
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-[#111]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {dict?.password?.new || 'New Password'}
            </label>
            <div className="mt-1">
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={5}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-[#111]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {dict?.password?.confirm || 'Confirm New Password'}
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

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href={`/${lang}/profile`} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                {dict?.password?.backToProfile || 'Back to profile'}
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (dict?.password?.changingPassword || 'Changing password...') : (dict?.password?.changeButton || 'Change password')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 