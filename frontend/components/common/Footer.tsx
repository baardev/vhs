import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const Footer = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const changeLanguage = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
  };

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