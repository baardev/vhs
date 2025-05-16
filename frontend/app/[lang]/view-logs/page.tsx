'use client';

import React, { useState, useEffect } from 'react';
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

export default function ViewLogs({ params: { lang } }) {
  const [dict, setDict] = useState(null);
  const [logs, setLogs] = useState('Loading logs...');
  const [error, setError] = useState('');

  // Load dictionary
  useEffect(() => {
    async function loadDictionary() {
      const dictionary = await getCommonDictionary(lang);
      setDict(dictionary);
    }
    loadDictionary();
  }, [lang]);

  useEffect(() => {
    // Function to fetch logs
    const fetchLogs = async () => {
      try {
        // Using the handicap-calc endpoint that we know works
        const response = await fetch('/api/handicap-calc/logs');
        
        if (!response.ok) {
          throw new Error(`${dict?.viewLogs?.fetchError || 'Failed to fetch logs:'} ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        setLogs(text || dict?.viewLogs?.noLogs || 'No logs found');
      } catch (err) {
        console.error('Error fetching logs:', err);
        setError(err instanceof Error ? err.message : dict?.viewLogs?.unknownError || 'Unknown error');
        setLogs(dict?.viewLogs?.failedLoad || 'Failed to load logs');
      }
    };

    fetchLogs();
  }, [dict]);

  const handleRefresh = () => {
    setLogs(dict?.viewLogs?.refreshing || 'Refreshing logs...');
    setError('');
    fetch('/api/handicap-calc/logs')
      .then(response => {
        if (!response.ok) {
          throw new Error(`${dict?.viewLogs?.fetchError || 'Failed to fetch logs:'} ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then(text => {
        setLogs(text || dict?.viewLogs?.noLogs || 'No logs found');
      })
      .catch(err => {
        console.error('Error refreshing logs:', err);
        setError(err instanceof Error ? err.message : dict?.viewLogs?.unknownError || 'Unknown error');
        setLogs(dict?.viewLogs?.failedLoad || 'Failed to load logs');
      });
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} container mx-auto px-4 py-8`}>
      <h1 className="text-2xl font-bold mb-4 flex justify-between items-center">
        <span>{dict?.viewLogs?.title || 'Application Logs'}</span>
        <button 
          onClick={handleRefresh}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {dict?.viewLogs?.refreshButton || 'Refresh Logs'}
        </button>
      </h1>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {dict?.viewLogs?.errorPrefix || 'Error:'} {error}
        </div>
      )}
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto h-[70vh]">
        <pre className="text-sm font-mono dark:text-gray-200">{logs}</pre>
      </div>
    </div>
  );
} 