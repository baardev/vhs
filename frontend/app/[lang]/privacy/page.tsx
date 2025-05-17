import React from 'react';
import { getCommonDictionary } from '../dictionaries';

/**
 * @page PrivacyPage
 * @description Legal information page displaying the Privacy Policy for the Open Handicap System.
 * 
 * This server component renders a comprehensive privacy policy that informs users about 
 * how their data is collected, used, shared, and protected within the application. The page 
 * is structured into multiple sections covering all aspects of data privacy, including:
 * 
 * - Introduction and policy overview
 * - Information collection practices
 * - How user information is used
 * - Data sharing policies
 * - Security measures
 * - User privacy rights
 * - Policy update procedures
 * 
 * The component uses translations from the dictionary system to support multiple languages,
 * with fallback text provided for each section in case translations are unavailable.
 * 
 * @calledBy
 * - Next.js App Router (when user navigates to /{lang}/privacy)
 * - Footer links (typically contains a "Privacy Policy" link)
 * - Legal notice references (such as during user registration)
 * - Settings/account pages (for user reference)
 * 
 * @calls
 * - Function: getCommonDictionary (for internationalization)
 * 
 * @requires
 * - Dictionary translations for privacy policy content (privacy.* keys)
 * - Proper route configuration in Next.js App Router
 * 
 * @param {Object} props - Component props
 * @param {Object} props.params - Route parameters
 * @param {string} props.params.lang - Language code for translations
 * @returns {Promise<JSX.Element>} The rendered Privacy Policy page
 */
export default async function PrivacyPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getCommonDictionary(lang);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          {dict?.privacy?.title || 'Privacy Policy'}
        </h1>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict?.privacy?.introduction || 'Introduction'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict?.privacy?.introText || 'Intro text placeholder...'}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict?.privacy?.effectiveDate || 'Effective date placeholder...'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict?.privacy?.informationCollection || 'Information We Collect'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict?.privacy?.personalInfo || 'Personal info placeholder...'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li className="mb-2">{dict?.privacy?.infoItem1 || 'Info item 1'}</li>
            <li className="mb-2">{dict?.privacy?.infoItem2 || 'Info item 2'}</li>
            <li className="mb-2">{dict?.privacy?.infoItem3 || 'Info item 3'}</li>
            <li className="mb-2">{dict?.privacy?.infoItem4 || 'Info item 4'}</li>
            <li className="mb-2">{dict?.privacy?.infoItem5 || 'Info item 5'}</li>
          </ul>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict?.privacy?.automaticInfo || 'Automatic info placeholder...'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li className="mb-2">{dict?.privacy?.autoItem1 || 'Auto item 1'}</li>
            <li className="mb-2">{dict?.privacy?.autoItem2 || 'Auto item 2'}</li>
            <li className="mb-2">{dict?.privacy?.autoItem3 || 'Auto item 3'}</li>
            <li className="mb-2">{dict?.privacy?.autoItem4 || 'Auto item 4'}</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict?.privacy?.informationUse || 'How We Use Your Information'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict?.privacy?.useInfo || 'Use info placeholder...'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li className="mb-2">{dict?.privacy?.useItem1 || 'Use item 1'}</li>
            <li className="mb-2">{dict?.privacy?.useItem2 || 'Use item 2'}</li>
            <li className="mb-2">{dict?.privacy?.useItem3 || 'Use item 3'}</li>
            <li className="mb-2">{dict?.privacy?.useItem4 || 'Use item 4'}</li>
            <li className="mb-2">{dict?.privacy?.useItem5 || 'Use item 5'}</li>
            <li className="mb-2">{dict?.privacy?.useItem6 || 'Use item 6'}</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict?.privacy?.informationSharing || 'Information Sharing'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict?.privacy?.sharingInfo || 'Sharing info placeholder...'}
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li className="mb-2">{dict?.privacy?.sharingItem1 || 'Sharing item 1'}</li>
            <li className="mb-2">{dict?.privacy?.sharingItem2 || 'Sharing item 2'}</li>
            <li className="mb-2">{dict?.privacy?.sharingItem3 || 'Sharing item 3'}</li>
            <li className="mb-2">{dict?.privacy?.sharingItem4 || 'Sharing item 4'}</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict?.privacy?.dataSecurity || 'Data Security'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict?.privacy?.securityInfo || 'Security info placeholder...'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict?.privacy?.yourRights || 'Your Privacy Rights'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict?.privacy?.rightsInfo || 'Rights info placeholder...'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict?.privacy?.changes || 'Changes to Privacy Policy'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict?.privacy?.changesInfo || 'Changes info placeholder...'}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {dict?.privacy?.contactInfo || 'Contact info placeholder...'}
          </p>
        </div>
      </div>
    </div>
  );
} 