import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Geist, Geist_Mono } from "next/font/google";
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import AdminUserTable from '../../components/admin/UserTable';
import { getI18nProps } from '../../utils/i18n-helpers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * @page AdminDashboard
 * @description Represents the admin dashboard page, accessible at `/admin`.
 * This page is responsible for verifying administrator privileges and displaying an admin-specific user management table.
 *
 * @remarks
 * - On mount, it performs an `useEffect` hook to check for admin status:
 *   - Retrieves `token` and `userData` from `localStorage`.
 *   - If no token is found, redirects to `/login`.
 *   - If `userData` is found and `parsedData.is_admin` is true, sets `isAdmin` state to true.
 *   - If `userData` is not found, `parsedData.is_admin` is false, or an error occurs during parsing, it sets `isAdmin` to false and redirects to the home page (`/`).
 * - Manages `isLoading` and `isAdmin` states to control rendering.
 *   - Shows a "Loading..." message while `isLoading` is true or `isAdmin` is null.
 *   - If `isAdmin` is false after checks, it renders `null` (as redirection is handled in `useEffect`).
 * - If the user is confirmed as an admin, it renders the main dashboard content:
 *   - A title (e.g., "Admin Dashboard", translated using `useTranslation`).
 *   - The `AdminUserTable` component, which handles the display and management of users.
 * - Uses `Geist` and `Geist_Mono` fonts.
 * - `getStaticProps`: Utilizes `getI18nProps` to provide internationalization props for the page, enabling server-side rendering of translated content.
 *
 * Called by:
 * - Next.js routing system when a user navigates to the `/admin` URL.
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`
 * - `next/router`: `useRouter` hook (for navigation/redirection)
 * - `next-i18next`: `useTranslation` hook (for internationalization)
 * - `localStorage.getItem` (to retrieve `token` and `userData`)
 * - `JSON.parse` (to parse `userData`)
 * - `AdminUserTable` component (to display the user management table)
 * - `getI18nProps` (in `getStaticProps` for i18n setup)
 *
 * @returns {JSX.Element | null} The rendered admin dashboard page, a loading indicator, or null if redirecting.
 */
const AdminDashboard = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check admin status
    const checkAdminStatus = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (parsedData.is_admin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            router.push('/');
          }
        } else {
          setIsAdmin(false);
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [router]);

  // Show loading state
  if (isLoading || isAdmin === null) {
    return (
      <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111]`}>
        <div className="text-xl font-medium">Loading...</div>
      </div>
    );
  }

  // If not admin, the useEffect will redirect them
  if (!isAdmin) {
    return null;
  }

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-[#fafafa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('admin.dashboard')}</h1>

        <div className="bg-white dark:bg-[#1a1a1a] shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('admin.userManagement')}</h2>
          </div>

          <AdminUserTable />
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return getI18nProps(locale);
};

export default AdminDashboard;