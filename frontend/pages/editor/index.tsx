import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Geist, Geist_Mono } from "next/font/google";
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nProps } from '../../utils/i18n-helpers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('editor.courseManagement', 'Course Management')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('editor.courseManagementDesc', 'Add, edit, or remove golf courses and their details.')}
                </p>
              </div>
              
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