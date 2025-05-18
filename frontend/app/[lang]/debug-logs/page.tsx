'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

// Type for the dictionary
interface Dictionary {
  debugLogsPage?: {
    title?: string;
    viewLogsLink?: string;
  };
  [key: string]: any;
}

export default function DebugLogs({ params: { lang } }) {
  const [dict, setDict] = useState<Dictionary | null>(null);
  
  // Load dictionary
  useEffect(() => {
    async function loadDictionary() {
      const dictionary = await getCommonDictionary(lang);
      setDict(dictionary as Dictionary);
    }
    loadDictionary();
  }, [lang]);

  return (
    <div className={`${geistSans.className} ${geistMono.className} container mx-auto px-4 py-8`}>
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        {dict?.debugLogsPage?.title || 'Debug Logs'}
      </h1>
      
      <p className="text-center">
        <Link href={`/${lang}/view-logs`} className="text-blue-500 hover:underline">
          {dict?.debugLogsPage?.viewLogsLink || 'Go to the logs viewer'}
        </Link>
      </p>
    </div>
  );
} 