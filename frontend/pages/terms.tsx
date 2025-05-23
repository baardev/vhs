import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nProps } from '../utils/i18n-helpers';

/**
 * @page TermsPage
 * @description A static Next.js page that displays the Terms of Service for the Virtual Handicap System.
 * It outlines the rules and guidelines users must agree to when using the service. The content is
 * organized into sections covering user accounts, service provisions, prohibited activities, termination,
 * and modifications to the terms. The content is internationalized using `next-i18next`.
 *
 * @remarks
 * - **Content**: Displays static legal/informational content regarding the terms of service.
 * - **Internationalization**: Uses `useTranslation` hook from `next-i18next` to load translated strings
 *   for various sections of the terms.
 *   The `getStaticProps` function is used to provide the necessary i18n props for pre-rendering.
 * - **Layout**: Standard page layout, expected to inherit global styles and components (Navbar/Footer) from `_app.tsx`.
 *
 * Called by:
 * - Next.js routing system when a user navigates to `/terms` (e.g., from a link in the footer).
 *
 * Calls:
 * - `useTranslation` (from `next-i18next` for translations).
 * - `getI18nProps` (via `getStaticProps` for i18n setup).
 *
 * @returns {JSX.Element} The rendered Terms of Service page content.
 */
const TermsPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          {t('terms.title', 'Terms of Service')}
        </h1>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('terms.introduction', 'Introduction')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('terms.introText', 'Welcome to Virtual Handicap System (VHS). By accessing and using our services, you agree to these Terms of Service. Please read them carefully.')}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('terms.effectiveDate', 'These Terms of Service are effective as of January 1, 2025.')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('terms.userAccounts', 'User Accounts')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('terms.accountResponsibility', 'You are responsible for maintaining the security of your account, and you are fully responsible for all activities that occur under your account.')}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('terms.accurateInfo', 'You must provide accurate and complete information when creating an account and keep your account information updated.')}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('terms.oneAccount', 'One person or legal entity may maintain no more than one account.')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('terms.services', 'Services')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('terms.servicesText', 'VHS provides a platform for tracking golf handicaps, finding courses, and connecting with other golfers. We reserve the right to modify, suspend, or discontinue the service at any time.')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('terms.prohibitedActivities', 'Prohibited Activities')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('terms.prohibitedText', 'You may not use our services for any illegal purposes or to violate any laws in your jurisdiction.')}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('terms.prohibitedText2', 'You may not post or transmit harmful code or any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('terms.termination', 'Termination')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('terms.terminationText', 'We may terminate or suspend your account at any time for any reason without notice or liability.')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('terms.changes', 'Changes to Terms')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('terms.changesText', 'We reserve the right to modify these Terms of Service at any time. We will provide notice of significant changes by posting a notice on our website or by sending you an email.')}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {t('terms.contactInfo', 'If you have any questions about these Terms, please contact us at: legal@virtualhandicapsystem.com')}
          </p>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return getI18nProps(locale);
};

export default TermsPage;