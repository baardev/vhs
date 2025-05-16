'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

/**
 * @component Footer
 * @description Renders the site footer, including navigation links (About, Privacy, Terms)
 * and language selection buttons.
 *
 * @remarks
 * The component uses a `mounted` state to ensure that content is only displayed after 
 * client-side hydration to prevent mismatches. Before hydration, a simplified placeholder footer is shown.
 * Language change is handled by creating links with the updated language parameter.
 *
 * Called by:
 * - `frontend/app/layout.tsx` (as part of the main application layout)
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`
 * - `next/link`'s `Link` component (for navigation to About, Privacy, Terms pages)
 * - `next/navigation`'s `useParams` and `usePathname` hooks (for handling language changes)
 *
 * @returns {React.FC} The rendered footer component.
 */
const Footer = () => {
  const params = useParams();
  const pathname = usePathname();
  const currentLang = params.lang as string || 'en';
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