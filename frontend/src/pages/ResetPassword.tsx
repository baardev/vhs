import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * @page ResetPassword
 * @description A Next.js page component that allows users to reset their password using a token from the URL query parameters.
 * It validates the token, new password, and confirmation, then sends a request to the server to update the password.
 *
 * @remarks
 * - **Token Handling**: Retrieves the 'token' from the URL query string (e.g., `/reset-password?token=...`).
 *   If no token is present or if the router is not ready, it displays an appropriate message (Loading or Invalid Link).
 * - **Form Submission**: Handles the submission of the new password and confirmation.
 * - **Validation**: Checks if passwords match and meet length requirements (at least 5 characters).
 * - **API Interaction**: Sends a POST request to `/api/auth/reset-password` with the token and new password.
 * - **State Management**: Uses `useState` to manage `password`, `confirmPassword`, `error` messages, `success` status, and the `token` itself.
 * - **Navigation**: Uses `useRouter` from `next/navigation` for navigation.
 *   On successful password reset, it redirects the user to the `/login` page after a 3-second delay.
 * - **Error/Success Feedback**: Displays error messages or a success message to the user.
 *
 * Called by:
 * - Next.js routing system, typically when a user clicks a password reset link sent to their email,
 *   directing them to a URL like `/reset-password?token=YOUR_RESET_TOKEN`.
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`.
 * - `useRouter` (from `next/navigation`) for accessing URL query parameters and navigation.
 * - `fetch` API (to POST to `/api/auth/reset-password`).
 *
 * @returns {JSX.Element} The rendered password reset page, an invalid link message, or a loading state.
 */
const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Ensure router is ready and query is available before trying to access token
    if (router.isReady && router.query) { 
      const queryToken = router.query.token;
      if (typeof queryToken === 'string') {
        setToken(queryToken);
      } else if (Array.isArray(queryToken) && queryToken.length > 0) {
        setToken(queryToken[0]);
      } else {
        setToken(null); // Explicitly set to null if not found or invalid type
      }
    } else if (!router.isReady) {
      // Router not ready yet, token will be set once it is
      setToken(null); // Or some loading state for token
    } else {
      // Router is ready but query is not available (should be rare if isReady is true)
      setToken(null);
    }
  }, [router.isReady, router.query]); // MODIFIED dependency array to router.query

  // Early return if router is not ready yet, or if token hasn't been processed yet
  if (!router.isReady) { // KEPT: router.isReady check for loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <p className="text-center text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              The password reset link is invalid or has expired.
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
      setError('Passwords do not match');
      return;
    }

    if (password.length < 5) {
      setError('Password must be at least 5 characters long');
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
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
        </div>
        {success ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Password reset successful!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>You will be redirected to the login page shortly.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword; 