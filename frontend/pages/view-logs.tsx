import React, { useState, useEffect } from 'react';
import Head from 'next/head';

/**
 * @page ViewLogsPage
 * @description A Next.js page component dedicated to viewing application logs.
 * It fetches log data from a specified API endpoint on load and provides a button
 * to manually refresh the logs.
 *
 * @remarks
 * - **Log Fetching**: Uses `useEffect` to fetch logs from `/api/handicap-calc/logs` when the component mounts.
 *   The `handleRefresh` function allows users to manually trigger a re-fetch of the logs.
 * - **State Management**: Employs `useState` to manage the `logs` content (string),
 *   and any `error` messages that occur during fetching.
 * - **Display**: Renders the fetched logs within a `<pre>` tag to preserve formatting.
 *   Displays loading messages or error messages appropriately.
 * - **Metadata**: Sets the HTML document title to "Logs Viewer" using the `Head` component from `next/head`.
 *
 * Called by:
 * - Next.js routing system when a user navigates to `/view-logs` (possibly linked from `/debug-logs` or an admin panel).
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`.
 * - `fetch` API (to GET logs from `/api/handicap-calc/logs`).
 * - `Head` (from `next/head`).
 *
 * @returns {JSX.Element} The rendered log viewer page.
 */
export default function ViewLogs() {
  const [logs, setLogs] = useState('Loading logs...');
  const [error, setError] = useState('');

  useEffect(() => {
    // Function to fetch logs
    const fetchLogs = async () => {
      try {
        // Using the handicap-calc endpoint that we know works
        const response = await fetch('/api/handicap-calc/logs');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`);
        }
        
        const text = await response.text();
        setLogs(text || 'No logs found');
      } catch (err) {
        console.error('Error fetching logs:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLogs('Failed to load logs');
      }
    };

    fetchLogs();
  }, []);

  const handleRefresh = () => {
    setLogs('Refreshing logs...');
    setError('');
    fetch('/api/handicap-calc/logs')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then(text => {
        setLogs(text || 'No logs found');
      })
      .catch(err => {
        console.error('Error refreshing logs:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLogs('Failed to load logs');
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Logs Viewer</title>
      </Head>
      
      <h1 className="text-2xl font-bold mb-4 flex justify-between items-center">
        <span>Application Logs</span>
        <button 
          onClick={handleRefresh}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh Logs
        </button>
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded overflow-auto h-[70vh]">
        <pre className="text-sm font-mono">{logs}</pre>
      </div>
    </div>
  );
} 