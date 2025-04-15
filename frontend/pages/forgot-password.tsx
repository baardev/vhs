import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { Geist, Geist_Mono } from "next/font/google";
import HomeLink from '../components/common/HomeLink';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await axios.post('http://localhost:4000/api/auth/forgot-password', {
        email,
      });

      // Show success message
      setSuccess('If an account with this email exists, a password reset link has been sent to your email.');
      setEmail(''); // Clear the form
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to process your request. Please try again.'
      );
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
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            No worries, we'll send you a reset link
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address
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
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Sending reset link...' : 'Send reset link'}
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