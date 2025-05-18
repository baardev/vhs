'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCommonDictionary } from '../dictionaries';
import FlagIcon, { USAFlag, SpainFlag, IsraelFlag, RussiaFlag, ChinaFlag } from './FlagIcons';

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
  const [dict, setDict] = useState<Record<string, any>>({});

  useEffect(() => {
    setMounted(true);
    
    // Load dictionary
    const loadDictionary = async () => {
      try {
        const dictionary = await getCommonDictionary(currentLang);
        setDict(dictionary);
      } catch (error) {
        console.error('Error loading dictionary in Footer:', error);
      }
    };
    
    loadDictionary();
  }, [currentLang]);

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
    <footer className="w-full flex flex-col gap-4 py-8 mt-auto bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
        <div className="flex gap-[24px] flex-wrap items-center">
          <Link
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-700 dark:text-gray-300"
            href={`/${currentLang}/about`}
          >
            {dict.navigation?.about || 'About'}
          </Link>
          <Link
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-700 dark:text-gray-300"
            href={`/${currentLang}/privacy`}
          >
            {dict.navigation?.privacy || 'Privacy'}
          </Link>
          <Link
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-700 dark:text-gray-300"
            href={`/${currentLang}/terms`}
          >
            {dict.navigation?.terms || 'Terms'}
          </Link>
        </div>
        <div className="flex flex-wrap space-x-3 items-center mt-4 sm:mt-0">
          <Link 
            href={`/en${getPathWithoutLang()}`} 
            className={`opacity-70 hover:opacity-100 transition-opacity ${
              currentLang === 'en' ? 'opacity-100' : ''
            }`}
            title={dict.languages?.english || 'English'}
            aria-label={dict.languages?.english || 'English'}
          >
            <USAFlag className="w-5.5 h-4" />
          </Link>
          <Link 
            href={`/es${getPathWithoutLang()}`} 
            className={`opacity-70 hover:opacity-100 transition-opacity ${
              currentLang === 'es' ? 'opacity-100' : ''
            }`}
            title={dict.languages?.spanish || 'Español'}
            aria-label={dict.languages?.spanish || 'Español'}
          >
            <SpainFlag className="w-5.5 h-4" />
          </Link>
          <Link 
            href={`/he${getPathWithoutLang()}`} 
            className={`opacity-70 hover:opacity-100 transition-opacity ${
              currentLang === 'he' ? 'opacity-100' : ''
            }`}
            title={dict.languages?.hebrew || 'עברית'}
            aria-label={dict.languages?.hebrew || 'עברית'}
          >
            <IsraelFlag className="w-5.5 h-4" />
          </Link>
          <Link 
            href={`/ru${getPathWithoutLang()}`} 
            className={`opacity-70 hover:opacity-100 transition-opacity ${
              currentLang === 'ru' ? 'opacity-100' : ''
            }`}
            title={dict.languages?.russian || 'Русский'}
            aria-label={dict.languages?.russian || 'Русский'}
          >
            <RussiaFlag className="w-5.5 h-4" />
          </Link>
          <Link 
            href={`/zh${getPathWithoutLang()}`} 
            className={`opacity-70 hover:opacity-100 transition-opacity ${
              currentLang === 'zh' ? 'opacity-100' : ''
            }`}
            title={dict.languages?.chinese || '中文'}
            aria-label={dict.languages?.chinese || '中文'}
          >
            <ChinaFlag className="w-5.5 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 