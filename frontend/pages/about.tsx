import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nProps } from '../utils/i18n-helpers';

/**
 * @page AboutPage
 * @description A static Next.js page that displays information about the Virtual Handicap System.
 * It includes sections detailing the mission, key features of the application, and contact information.
 * The content is internationalized using `next-i18next`.
 *
 * @remarks
 * - **Content**: Displays static informational content.
 * - **Internationalization**: Uses `useTranslation` hook from `next-i18next` to load translated strings.
 *   The `getStaticProps` function is used to provide the necessary i18n props for pre-rendering.
 * - **Layout**: Standard page layout, likely inheriting global styles and components like Navbar/Footer from `_app.tsx`.
 *
 * Called by:
 * - Next.js routing system when a user navigates to `/about`.
 *
 * Calls:
 * - `useTranslation` (from `next-i18next` for translations).
 * - `getI18nProps` (via `getStaticProps` for i18n setup).
 *
 * @returns {JSX.Element} The rendered About Us page content.
 */
const AboutPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          {t('about.title', 'About Virtual Handicap System')}
        </h1>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('about.ourMission', 'Our Mission')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('about.missionText', 'Virtual Handicap System (VHS) is designed to provide golfers with a simple and effective way to track their handicaps, find courses, and connect with other players in their area.')}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('about.missionText2', 'We believe that golf should be accessible to everyone, and our platform aims to make handicap tracking straightforward and user-friendly.')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('about.features', 'Key Features')}
          </h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li className="mb-2">{t('about.feature1', 'Accurate handicap calculation')}</li>
            <li className="mb-2">{t('about.feature2', 'Course database with detailed information')}</li>
            <li className="mb-2">{t('about.feature3', 'Score tracking and performance statistics')}</li>
            <li className="mb-2">{t('about.feature4', 'Mobile-friendly design for on-course use')}</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('about.contact', 'Contact Us')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('about.contactText', 'If you have any questions, feedback, or suggestions, please don\'t hesitate to get in touch with our team:')}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="font-medium">Email:</strong> support@virtualhandicapsystem.com
          </p>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return getI18nProps(locale);
};

export default AboutPage;