'use client';

import React, { useState, useEffect } from 'react';
import HandicapCalculator from '../../components/handicap/HandicapCalculator';
import { Geist, Geist_Mono } from "next/font/google";
import { getCommonDictionary } from '../dictionaries';

/**
 * @constant geistSans
 * @description Next.js font optimization for Geist Sans font.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * @constant geistMono 
 * @description Next.js font optimization for Geist Mono font.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * @interface Dictionary
 * @description Defines the structure for the translation dictionary.
 */
interface Dictionary {
  handicap?: {
    title?: string;
  };
  [key: string]: any;
}

/**
 * @page HandicapPage
 * @description Handicap calculation page for the Open Handicap System.
 * 
 * This page allows users to access the handicap calculation functionality, which is
 * a core feature of the OHS platform. It provides:
 * - A user-friendly interface for calculating golf handicaps
 * - Access to the handicap calculation tools for both registered and unregistered users
 * - An alternative to expensive commercial handicapping services
 * 
 * The page renders the HandicapCalculator component that contains the actual
 * calculation form and logic. This separation of concerns keeps the page component
 * focused on layout and translation, while the calculator component handles
 * the business logic.
 * 
 * @calledBy
 * - Next.js App Router (when user navigates to /{lang}/handicap)
 * - Application navbar/menu links
 * 
 * @calls
 * - Component: HandicapCalculator (handles the actual handicap calculation UI and logic)
 * - Function: getCommonDictionary (for internationalization)
 * 
 * @requires
 * - Backend API support for handicap calculations if the HandicapCalculator
 *   submits data to the server
 * - Dictionary translations for handicap page content
 */
export default function HandicapPage({ params: { lang } }: { params: { lang: string } }) {
  const [dict, setDict] = useState<Dictionary | null>(null);
  
  // Load dictionary
  useEffect(() => {
    async function loadDictionary() {
      const dictionary = await getCommonDictionary(lang);
      setDict(dictionary);
    }
    loadDictionary();
  }, [lang]);

  return (
    <div className={`${geistSans.className} ${geistMono.className}`}>
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-8 text-center text-[#2d6a4f] dark:text-white">
            {dict?.handicap?.title || 'OHS Golf Handicap Calculator'}
          </h1>
          <HandicapCalculator />
        </div>
      </main>
    </div>
  );
} 