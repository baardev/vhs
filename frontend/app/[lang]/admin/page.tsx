'use client';

import React, { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Geist, Geist_Mono } from "next/font/google";
import { getCommonDictionary } from '../../dictionaries';
import { forceValidateTokenOrLogout } from '../../../src/utils/authUtils';
import AdminUserTable from '../../components/admin/UserTable';

// Script to validate token immediately on page load
const authCheckScript = `
  (function() {
    // Check if we've already been redirected to check-auth
    const hasBeenChecked = sessionStorage.getItem('auth_checked');
    if (!hasBeenChecked) {
      // Set flag to prevent redirect loop
      sessionStorage.setItem('auth_checked', 'true');
      
      // Redirect to check-auth page
      const langPrefix = window.location.pathname.split('/')[1] || 'en';
      window.location.href = '/' + langPrefix + '/admin/check-auth';
    }
  })();
`;

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
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Execute auth check script on client side
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = authCheckScript;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Load dictionary
  useEffect(() => {
    async function loadDictionary() {
      const dictionary = await getCommonDictionary(params.lang);
      setDict(dictionary);
    }
    loadDictionary();
  }, [params.lang]);

  useEffect(() => {
    // Check admin status and validate token
    const checkAdminStatus = async () => {
      console.log('[Admin Page] Checking admin status');
      
      // Manually validate token directly in the component
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('[Admin Page] No token found, redirecting to login');
          router.push(`/${params.lang}/login`);
          return;
        }
        
        // Validate token directly with the backend
        const response = await fetch('/api/auth/validate-token', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.error('[Admin Page] Token validation failed with status:', response.status);
          // Clear auth data
          localStorage.removeItem('userData');
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('authChange'));
          
          // Force hard redirect
          window.location.href = `/${params.lang}/login`;
          return;
        }
        
        const data = await response.json();
        if (!data.valid) {
          console.error('[Admin Page] Token is invalid, redirecting');
          // Clear auth data
          localStorage.removeItem('userData');
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('authChange'));
          
          // Force hard redirect
          window.location.href = `/${params.lang}/login`;
          return;
        }
        
        // If token is valid, check if user is admin
        try {
          const userData = localStorage.getItem('userData');
          if (userData) {
            const parsedData = JSON.parse(userData);
            if (parsedData.is_admin) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
              console.log('[Admin Page] User is not an admin, redirecting');
              router.push(`/${params.lang}/`);
            }
          } else {
            setIsAdmin(false);
            console.log('[Admin Page] No user data found, redirecting');
            router.push(`/${params.lang}/`);
          }
        } catch (error) {
          console.error('[Admin Page] Error checking admin status:', error);
          setIsAdmin(false);
          router.push(`/${params.lang}/`);
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('[Admin Page] Error validating token:', error);
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('authChange'));
        window.location.href = `/${params.lang}/login`;
      }
    };

    checkAdminStatus();
  }, [router, params.lang]);

  // Show loading state
  if (isLoading || isAdmin === null || !dict) {
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{dict?.admin?.dashboard || 'Admin Dashboard'}</h1>

        <div className="bg-white dark:bg-[#1a1a1a] shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{dict?.admin?.userManagement || 'User Management'}</h2>
          </div>

          <AdminUserTable locale={params.lang} />
        </div>
      </div>
    </div>
  );
} 