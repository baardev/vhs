// import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';
import GolfNewsHeadlines from '../components/GolfNewsHeadlines';
import RandomQuote from '../components/RandomQuote';
import { getI18nProps } from '../utils/i18n-helpers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} grid grid-rows-[40px_1fr_auto_40px] items-center justify-items-center min-h-screen p-8 pb-20 gap-12 sm:p-24 font-[family-name:var(--font-geist-sans)]`}
    >
      <header className="w-full">
        <RandomQuote />
      </header>
      <main className="flex flex-col gap-[48px] row-start-2 items-center sm:items-start w-full max-w-4xl">
        <div className="text-center sm:text-left w-full mt-6">
          <h1 className="text-5xl font-bold mb-8">{t('welcome')}</h1>
          {t('subtitle') && (
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
              {t('subtitle')}
            </p>
          )}


        </div>

        <div className="w-full mt-16 flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 bg-white dark:bg-[#1a1a1a] rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">{t('features')}</h2>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">{t('organizeCollection')}</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{t('organizeDescription')}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">{t('trackProgress')}</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{t('trackDescription')}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">{t('createWatchlists')}</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{t('watchlistsDescription')}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">{t('shareRecommendations')}</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{t('shareDescription')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-bold mb-6">{t('golfNews')}</h2>
            {/* <GolfNewsHeadlines /> */}
          </div>
        </div>
      </main>
    </div>
  );
}

// This function now runs on every request
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  // Assuming getI18nProps is compatible with GetServerSideProps context
  // or adjust getI18nProps if needed based on context type differences
  return getI18nProps(locale);
}
