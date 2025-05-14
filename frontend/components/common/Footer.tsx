import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

/**
 * @component Footer
 * @description Renders the site footer, including navigation links (About, Privacy, Terms)
 * and language selection buttons.
 *
 * @remarks
 * The component uses a `mounted` state to ensure that language-dependent content
 * (rendered via `useTranslation`) is only displayed after client-side hydration
 * to prevent mismatches. Before hydration, a simplified placeholder footer is shown.
 * Language change is handled by pushing a new route with the selected locale using `next/router`.
 *
 * Called by:
 * - `frontend/pages/_app.tsx` (as part of the main application layout)
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`
 * - `next/link`'s `Link` component (for navigation to About, Privacy, Terms pages)
 * - `next-i18next`'s `useTranslation` hook (for internationalizing link text)
 * - `next/router`'s `useRouter` hook (for handling language changes by navigating to the same path with a different locale)
 * - Internal function `changeLanguage` (handler for language selection buttons)
 *
 * @returns {React.FC} The rendered footer component.
 */
const Footer = () => {
  const { t, ready } = useTranslation('common');
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
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
          href="/about"
        >
          {t('about')}
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/privacy"
        >
          {t('privacy')}
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/terms"
        >
          {t('terms')}
        </Link>
      </div>
      <div className="flex flex-wrap space-x-3 justify-center mt-2">
        <button onClick={() => changeLanguage('en')} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2">English</button>
        <button onClick={() => changeLanguage('es')} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2">Español</button>
        <button onClick={() => changeLanguage('he')} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2">עברית</button>
        <button onClick={() => changeLanguage('ru')} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2">Русский</button>
        <button onClick={() => changeLanguage('zh')} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2">中文</button>
      </div>
    </footer>
  );
};

export default Footer;