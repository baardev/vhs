'use client';

import React, { useState, useEffect } from 'react';
import HandicapCalculator from '../../../components/handicap/HandicapCalculator';
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

export default function HandicapPage({ params: { lang } }) {
  const [dict, setDict] = useState(null);
  
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