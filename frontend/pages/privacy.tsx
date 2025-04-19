import React from 'react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nProps } from '../utils/i18n-helpers';

const PrivacyPage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          {t('privacy.title', 'Privacy Policy')}
        </h1>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('privacy.introduction', 'Introduction')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('privacy.introText', 'At Virtual Handicap System (VHS), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.')}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('privacy.effectiveDate', 'This Privacy Policy is effective as of January 1, 2025.')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('privacy.informationCollection', 'Information We Collect')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('privacy.personalInfo', 'We may collect personal information that you provide to us, including but not limited to:')}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li className="mb-2">{t('privacy.infoItem1', 'Name, email address, and other contact information')}</li>
            <li className="mb-2">{t('privacy.infoItem2', 'Account credentials, such as usernames and passwords')}</li>
            <li className="mb-2">{t('privacy.infoItem3', 'Profile information, such as golf handicap and preferences')}</li>
            <li className="mb-2">{t('privacy.infoItem4', 'Golf scores and performance data')}</li>
            <li className="mb-2">{t('privacy.infoItem5', 'Communication preferences')}</li>
          </ul>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('privacy.automaticInfo', 'We may also automatically collect certain information when you use our service, including:')}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li className="mb-2">{t('privacy.autoItem1', 'Device information (e.g., device type, operating system)')}</li>
            <li className="mb-2">{t('privacy.autoItem2', 'Log information (e.g., IP address, browser type, pages visited)')}</li>
            <li className="mb-2">{t('privacy.autoItem3', 'Location information')}</li>
            <li className="mb-2">{t('privacy.autoItem4', 'Usage information (e.g., features used, time spent)')}</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('privacy.informationUse', 'How We Use Your Information')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('privacy.useInfo', 'We may use the information we collect for various purposes, including:')}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li className="mb-2">{t('privacy.useItem1', 'Providing and maintaining our service')}</li>
            <li className="mb-2">{t('privacy.useItem2', 'Personalizing your experience')}</li>
            <li className="mb-2">{t('privacy.useItem3', 'Improving our service')}</li>
            <li className="mb-2">{t('privacy.useItem4', 'Communicating with you')}</li>
            <li className="mb-2">{t('privacy.useItem5', 'Ensuring the security of our service')}</li>
            <li className="mb-2">{t('privacy.useItem6', 'Complying with legal obligations')}</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('privacy.informationSharing', 'Information Sharing')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('privacy.sharingInfo', 'We may share your information in the following situations:')}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li className="mb-2">{t('privacy.sharingItem1', 'With service providers who help us operate our service')}</li>
            <li className="mb-2">{t('privacy.sharingItem2', 'When required by law')}</li>
            <li className="mb-2">{t('privacy.sharingItem3', 'With your consent')}</li>
            <li className="mb-2">{t('privacy.sharingItem4', 'In connection with a business transaction')}</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('privacy.dataSecurity', 'Data Security')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('privacy.securityInfo', 'We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no data transmission over the Internet or electronic storage is 100% secure.')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('privacy.yourRights', 'Your Privacy Rights')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('privacy.rightsInfo', 'Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, delete, or restrict the processing of your information.')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('privacy.changes', 'Changes to Privacy Policy')}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {t('privacy.changesInfo', 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.')}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {t('privacy.contactInfo', 'If you have any questions about this Privacy Policy, please contact us at: privacy@virtualhandicapsystem.com')}
          </p>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return getI18nProps(locale);
};

export default PrivacyPage;