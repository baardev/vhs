import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Geist, Geist_Mono } from "next/font/google";
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nProps } from '../../utils/i18n-helpers';
import Link from 'next/link';

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
 * @page EditorDashboard
 * @description This page serves as the main dashboard for users with editor privileges.
 * It verifies editor status based on user data stored in localStorage and, if authorized,
 * displays a welcome message and navigation options to various content management sections,
 * such as course management and scorecard template management.
 *
 * @remarks
 * - **Authentication & Authorization**: Checks for a JWT token and `is_editor` flag in `localStorage`.
 *   Redirects to `/login` if no token, or to `/` (homepage) if the user is not an editor.
 * - **State Management**: Uses `useState` for `isEditor` (to store authorization status) and `isLoading`.
 * - **UI**: Presents a dashboard layout with links to different editor functionalities.
 *   Currently shows a link to `/editor/courses` for "Course Management" and a placeholder for "Scorecard Templates".
 * - Uses Geist fonts and `next-i18next` for translations.
 * - Includes `getStaticProps` for `next-i18next` internationalization.
 *
 * Called by:
 * - Next.js router when an authenticated user navigates to `/editor` or `/editor/index`.
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`.
 * - Next.js: `useRouter`, `Link`.
 * - `localStorage.getItem` (for token and `userData`).
 * - `useTranslation` (from `next-i18next`).
 * - `getI18nProps` (via `getStaticProps`).
 *
 * @returns {JSX.Element | null} The rendered editor dashboard, a loading indicator, or null if redirecting due to lack of authorization.
 */
const EditorDashboard = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isEditor, setIsEditor] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check editor status
    const checkEditorStatus = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (parsedData.is_editor) {
            setIsEditor(true);
          } else {
            setIsEditor(false);
            router.push('/');
          }
        } else {
          setIsEditor(false);
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking editor status:', error);
        setIsEditor(false);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkEditorStatus();
  }, [router]);

  // Show loading state
  if (isLoading || isEditor === null) {
    return (
      <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111]`}>
        <div className="text-xl font-medium">Loading...</div>
      </div>
    );
  }

  // If not editor, the useEffect will redirect them
  if (!isEditor) {
    return null;
  }

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-[#fafafa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('editor.dashboard', 'Editor Dashboard')}</h1>

        <div className="bg-white dark:bg-[#1a1a1a] shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('editor.contentManagement', 'Content Management')}</h2>
          </div>
          
          <div className="px-4 py-5 sm:px-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {t('editor.welcomeMessage', 'Welcome to the editor dashboard. Here you can manage content.')}
            </p>
            
            <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2">
              <Link href="/editor/courses" className="block">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {t('editor.courseManagement', 'Course Management')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('editor.courseManagementDesc', 'Add, edit, or remove golf courses and their details.')}
                  </p>
                </div>
              </Link>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('editor.scorecardTemplates', 'Scorecard Templates')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('editor.scorecardTemplatesDesc', 'Design and manage scorecard templates for different courses.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return getI18nProps(locale);
};

export default EditorDashboard; 