'use client';

import React, { useState, useEffect } from 'react';
import { getCommonDictionary } from '../dictionaries';

/**
 * @page AboutPage
 * @description The About page for the Open Handicap System application.
 * 
 * This page provides information about the system, including:
 * - The mission and purpose of the handicap system
 * - Key features and capabilities
 * - Contact information for support
 * 
 * The component uses internationalization to display content in the user's
 * selected language through the dictionary system.
 * 
 * @calledBy
 * - Next.js App Router (when user navigates to /{lang}/about)
 * - Navigation links in the application (likely in Navbar and Footer components)
 * 
 * @calls
 * - Function: getCommonDictionary (for internationalization)
 * 
 * @requires
 * - Language parameter from the URL (provided by Next.js App Router)
 * - Dictionary translations for the about page content
 */
export default function AboutPage({ params: { lang } }) {
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
          {dict.about.title || 'About Virtual Handicap System'}
        </h1>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict.about.ourMission || 'Our Mission'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict.about.missionText}
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict.about.missionText2}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict.about.features || 'Key Features'}
          </h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li className="mb-2">{dict.about.feature1}</li>
            <li className="mb-2">{dict.about.feature2}</li>
            <li className="mb-2">{dict.about.feature3}</li>
            <li className="mb-2">{dict.about.feature4}</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {dict.about.contact || 'Contact Us'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {dict.about.contactText}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="font-medium">Email:</strong> support@virtualhandicapsystem.com
          </p>
        </div>
      </div>
    </div>
  );
} 