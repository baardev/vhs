'use client';

import React, { useState, useEffect } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import { getCommonDictionary } from '../dictionaries';
import LogViewer from '../../components/LogViewer';

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
  viewLogs?: {
    title?: string;
    refreshButton?: string;
    showLogs?: string;
  };
  [key: string]: any;
}

/** 
 * @page ViewLogsPage
 * @description Administration interface for viewing application logs in the Open Handicap System.
 * 
 * This client component provides a dedicated interface for administrators and developers 
 * to monitor and troubleshoot the application by viewing system logs. The page features:
 * 
 * - A log viewer component that displays real-time or recent application logs
 * - Controls to refresh the logs or toggle their visibility
 * - A clean, developer-friendly interface optimized for log reading
 * 
 * The component is designed primarily for debugging, troubleshooting, and system
 * monitoring purposes. It likely requires administrative privileges to access
 * as it may display sensitive system information.
 * 
 * @calledBy
 * - Next.js App Router (when user navigates to /{lang}/view-logs)
 * - Admin dashboard (via system monitoring links)
 * - Developer tools section
 * - Error pages (potentially linking here for more details)
 * 
 * @calls
 * - Component: LogViewer (handles the actual display of log content)
 * - Function: getCommonDictionary (for internationalization)
 * 
 * @requires
 * - Administrative access controls (likely should be restricted)
 * - LogViewer component 
 * - Dictionary translations for log viewer UI
 * - Backend API that provides access to system logs
 */
export default function ViewLogs({ params: { lang } }) {
  const [dict, setDict] = useState<Dictionary | null>(null);
  const [showLogViewer, setShowLogViewer] = useState(true);

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
      <h1 className="text-2xl font-bold mb-4 flex justify-between items-center">
        <span>{dict?.viewLogs?.title || 'Application Logs'}</span>
        <button 
          onClick={() => setShowLogViewer(true)}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {dict?.viewLogs?.refreshButton || 'Refresh Logs'}
        </button>
      </h1>
      
      <LogViewer 
        visible={showLogViewer} 
        onClose={() => setShowLogViewer(false)} 
      />
      
      {!showLogViewer && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-center">
          <button
            onClick={() => setShowLogViewer(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {dict?.viewLogs?.showLogs || 'Show Logs'}
          </button>
        </div>
      )}
    </div>
  );
} 