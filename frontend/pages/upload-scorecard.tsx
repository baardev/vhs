import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import GolfCardUploader from '../components/GolfCardUploader';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

const UploadScorecard = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      router.push('/login?redirect=/upload-scorecard');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2d6a4f]"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect in the useEffect
  }

  return (
    <>
      <Head>
        <title>{t('uploadScorecard', 'Upload Scorecard')} | VHS</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          {t('uploadScorecard', 'Upload Scorecard')}
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {t(
            'uploadScorecardDescription',
            'Upload an image of your golf scorecard. Our system will process it and update your playing history automatically.'
          )}
        </p>
        <GolfCardUploader />
      </div>
    </>
  );
};

export default UploadScorecard; 