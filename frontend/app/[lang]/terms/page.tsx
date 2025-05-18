'use client';

import React, { useState, useEffect } from 'react';
import { getCommonDictionary } from '../../[lang]/dictionaries';

/**
 * @page TermsPage
 * @description Legal terms of service page for the Open Handicap System.
 * 
 * This client component renders the Terms of Service document that establishes
 * the legal agreement between users and the platform. The page presents a 
 * comprehensive breakdown of the terms in multiple sections:
 * 
 * - Introduction and effective date
 * - User account responsibilities and requirements
 * - Service descriptions and limitations
 * - Prohibited activities and restrictions
 * - Account termination policies
 * - Terms modification procedures
 * 
 * All content is internationalized using the dictionary system, with fallback
 * text provided for each section in case translations are unavailable.
 * 
 * @calledBy
 * - Next.js App Router (when user navigates to /{lang}/terms)
 * - Footer links (typically contains a "Terms of Service" link) 
 * - Registration page (for users to review before creating an account)
 * - Legal notice references throughout the application
 * 
 * @calls
 * - Function: getCommonDictionary (for internationalization)
 * 
 * @requires
 * - Dictionary translations for terms of service content (terms.* keys)
 * - Proper route configuration in Next.js App Router
 */
export default function TermsPage({ params: { lang } }) {
  const [dict, setDict] = useState(null);
  
  useEffect(() => {
    async function loadDictionary() {
      const dictionary = await getCommonDictionary(lang);
      setDict(dictionary);
    }
    loadDictionary();
  }, [lang]);
  
  if (!dict) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          {dict.terms.title || 'Terms of Service'}
        </h1>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict.terms.introduction || 'Introduction'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict.terms.introText}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict.terms.effectiveDate}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict.terms.userAccounts || 'User Accounts'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict.terms.accountResponsibility}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict.terms.accurateInfo}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict.terms.oneAccount}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict.terms.services || 'Services'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict.terms.servicesText}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict.terms.prohibitedActivities || 'Prohibited Activities'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict.terms.prohibitedText}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict.terms.prohibitedText2}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict.terms.termination || 'Termination'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict.terms.terminationText}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict.terms.changes || 'Changes to Terms'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict.terms.changesText}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {dict.terms.contactInfo}
          </p>
        </div>
      </div>
    </div>
  );
} 