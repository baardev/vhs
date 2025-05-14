import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * @page AdministrationPage
 * @description A page component located at `/administration` that automatically redirects users to the `/admin` page.
 *
 * @remarks
 * - On component mount, `useEffect` triggers `router.replace('/admin')`.
 * - `router.replace` is used to update the URL to `/admin` without adding a new entry to the browser's history stack,
 *   so the user cannot navigate back to `/administration` using the back button.
 * - While the redirection is in progress (which should be very brief), it displays a "Redirecting to admin dashboard..." message.
 *
 * Called by:
 * - Next.js routing system when a user navigates to the `/administration` URL.
 *
 * Calls:
 * - React Hooks: `useEffect`
 * - `next/router`: `useRouter` hook (specifically `router.replace` for redirection)
 *
 * @returns {JSX.Element} A simple div with a redirect message.
 */
export default function AdministrationPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to admin dashboard...</p>
    </div>
  );
} 