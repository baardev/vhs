'use client';

import React, { useState, useEffect } from 'react';
import { getCommonDictionary } from '../../[lang]/dictionaries';

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