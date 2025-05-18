'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCommonDictionary } from './dictionaries';
import { useState, useEffect } from 'react';

/**
 * @component NotFound
 * @description Custom 404 error page component for the Open Handicap System.
 * 
 * This component provides a user-friendly error page when users navigate to
 * non-existent routes or resources. It features:
 * - Clear error messaging with the 404 status code
 * - Helpful explanation of what might have happened
 * - Easy navigation back to the home page
 * - Responsive design that works across device sizes
 * - Dark/light mode support through utility classes
 * 
 * In the Next.js App Router, this special file is automatically used when
 * a route cannot be matched or when notFound() is thrown in a route handler.
 * 
 * @calledBy
 * - Next.js App Router (automatically for unmatched routes)
 * - Error boundaries that call notFound()
 * - API routes that return a 404 status
 * 
 * @calls
 * - next/link (for client-side navigation back to homepage)
 * 
 * @requires
 * - Next.js App Router configuration
 * - Tailwind CSS for styling
 * 
 * @returns {JSX.Element} The 404 error page component
 */
export default function NotFound() {
  const params = useParams() || {};
  const lang = (params.lang as string) || 'en';
  const [dict, setDict] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setIsLoading(true);
        const dictionary = await getCommonDictionary(lang);
        setDict(dictionary);
      } catch (error) {
        console.error('Error loading dictionary in NotFound:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDictionary();
  }, [lang]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 py-16 mx-auto text-center max-w-7xl sm:px-6 sm:py-24 lg:px-8 lg:py-48">
        <p className="text-sm font-semibold tracking-wide text-gray-600 dark:text-gray-400 uppercase">
          {dict.notFound?.errorCode || '404 error'}
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          {dict.notFound?.title || 'Page not found.'}
        </h1>
        <p className="mt-4 text-lg font-medium text-gray-500 dark:text-gray-400">
          {dict.notFound?.description || 'The page you are looking for does not exist or has been moved.'}
        </p>
        <div className="mt-10">
          <Link
            href={`/${lang}/`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {dict.notFound?.goHome || 'Go back home'}
          </Link>
        </div>
      </div>
    </div>
  );
} 