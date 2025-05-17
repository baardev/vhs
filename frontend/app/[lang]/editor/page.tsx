'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import { getCommonDictionary } from '../../dictionaries';
import { forceValidateTokenOrLogout } from '../../../src/utils/authUtils';

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
 * displays a welcome message and navigation options to various content management sections.
 */
export default function EditorDashboard({ params }: { params: { lang: string } }) {
  const router = useRouter();
  const [dict, setDict] = useState<any>(null);
  const [isEditor, setIsEditor] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load dictionary
  useEffect(() => {
    async function loadDictionary() {
      const dictionary = await getCommonDictionary(params.lang);
      setDict(dictionary);
    }
    loadDictionary();
  }, [params.lang]);

  useEffect(() => {
    // Check editor status and validate token
    const checkEditorStatus = async () => {
      console.log('[Editor Page] Checking editor status');
      
      // First validate token
      const isTokenValid = await forceValidateTokenOrLogout(params.lang, router.push);
      if (!isTokenValid) {
        // The forceValidateTokenOrLogout function will handle logout and redirect
        return;
      }

      // If token is valid, check if user is editor
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (parsedData.is_editor) {
            setIsEditor(true);
          } else {
            setIsEditor(false);
            console.log('[Editor Page] User is not an editor, redirecting');
            router.push(`/${params.lang}/`);
          }
        } else {
          setIsEditor(false);
          console.log('[Editor Page] No user data found, redirecting');
          router.push(`/${params.lang}/`);
        }
      } catch (error) {
        console.error('[Editor Page] Error checking editor status:', error);
        setIsEditor(false);
        router.push(`/${params.lang}/`);
      } finally {
        setIsLoading(false);
      }
    };

    checkEditorStatus();
  }, [router, params.lang]);

  // Show loading state
  if (isLoading || isEditor === null || !dict) {
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{dict?.editor?.dashboard || 'Editor Dashboard'}</h1>

        <div className="bg-white dark:bg-[#1a1a1a] shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{dict?.editor?.contentManagement || 'Content Management'}</h2>
          </div>
          
          <div className="px-4 py-5 sm:px-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {dict?.editor?.welcomeMessage || 'Welcome to the editor dashboard. Here you can manage content.'}
            </p>
            
            <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2">
              <Link href={`/${params.lang}/editor/courses`} className="block">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {dict?.editor?.courseManagement || 'Course Management'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {dict?.editor?.courseManagementDesc || 'Add, edit, or remove golf courses and their details.'}
                  </p>
                </div>
              </Link>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {dict?.editor?.scorecardTemplates || 'Scorecard Templates'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {dict?.editor?.scorecardTemplatesDesc || 'Design and manage scorecard templates for different courses.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 