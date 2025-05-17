'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Utility page that checks authentication and redirects appropriately
 * Can be visited to force authentication validation
 */
export default function CheckAuth({ params }: { params: { lang: string } }) {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('[Check Auth] No token found, redirecting to login');
          router.push(`/${params.lang}/login`);
          return;
        }
        
        console.log('[Check Auth] Token found, validating...');
        const response = await fetch('/api/auth/check-session', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          console.log('[Check Auth] Token validation failed, clearing auth data');
          localStorage.removeItem('userData');
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('authChange'));
          
          // Force reload to login
          window.location.href = `/${params.lang}/login`;
          return;
        }
        
        const data = await response.json();
        if (data && data.valid) {
          console.log('[Check Auth] Token is valid, redirecting to admin');
          router.push(`/${params.lang}/admin`);
        } else {
          console.log('[Check Auth] Token validation failed with valid=false, clearing auth data');
          localStorage.removeItem('userData');
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('authChange'));
          window.location.href = `/${params.lang}/login`;
        }
      } catch (error) {
        console.error('[Check Auth] Error checking token:', error);
        // On any error, clear auth data and redirect to login
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('authChange'));
        window.location.href = `/${params.lang}/login`;
      }
    };
    
    checkToken();
  }, [params.lang, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Checking authentication...</h2>
        <p>Please wait while we validate your session.</p>
      </div>
    </div>
  );
} 