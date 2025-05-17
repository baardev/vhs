'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Geist, Geist_Mono } from "next/font/google";
import { getCommonDictionary } from '../dictionaries';
import AdminUserTable from '../../../components/admin/UserTable';

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
 */
export default function AdminDashboard({ params }: { params: { lang: string } }) {
  const router = useRouter();
  const [dictionary, setDictionary] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getCommonDictionary(params.lang);
      setDictionary(dict);
    };
    
    loadDictionary();
  }, [params.lang]);

  useEffect(() => {
    // Check admin status
    const checkAdminStatus = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push(`/${params.lang}/login`);
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
            router.push(`/${params.lang}`);
          }
        } else {
          setIsAdmin(false);
          router.push(`/${params.lang}`);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        router.push(`/${params.lang}`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [router, params.lang]);

  // Show loading state
  if (isLoading || isAdmin === null || !dictionary) {
    return (
      <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111]`}>
        <div className="text-xl font-medium">Loading...</div>
      </div>
    );
  }

  // If not admin, the useEffect will redirect them
  if (!isAdmin) {
    return null;
  }

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#fafafa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{dictionary.admin?.dashboard || 'Admin Dashboard'}</h1>

        <div className="bg-white dark:bg-[#1a1a1a] shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{dictionary.admin?.userManagement || 'User Management'}</h2>
          </div>

          <AdminUserTable locale={params.lang} />
        </div>
      </div>
    </div>
  );
} 