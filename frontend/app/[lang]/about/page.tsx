'use client';

import React, { useState, useEffect } from 'react';
import { getCommonDictionary } from '../dictionaries';

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