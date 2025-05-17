'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

/**
 * @component Footer
 * @description Footer component for the Open Handicap System application.
 * 
 * This component provides the global footer with:
 * - Links to informational pages (About, Privacy, Terms)
 * - Language selection buttons to switch between supported languages
 * - Support for maintaining the current path when changing languages
 * 
 * The component handles mounted state properly to prevent hydration mismatches
 * and provides a simplified placeholder until client-side rendering is complete.
 * 
 * @calledBy
 * - RootLayout (as the main application footer)
 * - All pages that use the default layout
 * 
 * @calls
 * - next/navigation hooks (useParams, usePathname)
 * - Link component for navigation
 * 
 * @requires
 * - Client-side rendering ('use client' directive)
 * - Next.js App Router
 * 
 * @returns {JSX.Element} The rendered footer component
 */
const Footer = () => {
  const params = useParams() || {};
  const pathname = usePathname();
  const currentLang = (params.lang as string) || 'en';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get the path without the language prefix
  const getPathWithoutLang = () => {
    if (!pathname) return '/';
    const pathParts = pathname.split('/');
    // Remove the first empty string and the language part
    pathParts.splice(0, 2);
    return '/' + pathParts.join('/');
  };

  // Return a simplified footer during initial client-side rendering
  if (!mounted) {
    return (
      <footer className="w-full flex flex-col items-center gap-4 py-8 mt-auto bg-gray-100 dark:bg-gray-900">
        <div className="flex gap-[24px] flex-wrap items-center justify-center">
          {/* Placeholder content without translations */}
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full flex flex-col items-center gap-4 py-8 mt-auto bg-gray-100 dark:bg-gray-900">
      <div className="flex gap-[24px] flex-wrap items-center justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href={`/${currentLang}/about`}
        >
          About
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href={`/${currentLang}/privacy`}
        >
          Privacy
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href={`/${currentLang}/terms`}
        >
          Terms
        </Link>
      </div>
      <div className="flex flex-wrap space-x-3 justify-center mt-2">
        <Link href={`/en${getPathWithoutLang()}`} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2">English</Link>
        <Link href={`/es${getPathWithoutLang()}`} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2">Español</Link>
        <Link href={`/he${getPathWithoutLang()}`} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2">עברית</Link>
        <Link href={`/ru${getPathWithoutLang()}`} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2">Русский</Link>
        <Link href={`/zh${getPathWithoutLang()}`} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2">中文</Link>
      </div>
    </footer>
  );
};

export default Footer; 