import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function HomeLink() {
  const { t } = useTranslation('common');
  return (
    <div className="absolute top-4 left-4 flex items-center space-x-4">
      <Link
        href="/"
        className="text-sm text-[#2d6a4f] dark:text-[#4fd1c5] hover:underline flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        {t('home')}
      </Link>
      <Link
        href="/courses"
        className="text-sm text-[#2d6a4f] dark:text-[#4fd1c5] hover:underline flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        {t('courses')}
      </Link>
    </div>
  );
}