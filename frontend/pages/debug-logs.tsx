import React from 'react';

/**
 * @page DebugLogs
 * @description A simple Next.js page component that serves as a placeholder or entry point
 * for accessing debug logs. It primarily displays a title and a link to the `/view-logs` page.
 *
 * @remarks
 * - **Functionality**: Provides a direct link to the log viewer page.
 * - **Simplicity**: Contains no complex logic, state management, or data fetching.
 *
 * Called by:
 * - Next.js routing system when a user navigates to `/debug-logs`.
 *
 * Calls:
 * - None beyond standard React rendering and HTML anchor tag navigation.
 *
 * @returns {JSX.Element} The rendered page with a title and a link to view logs.
 */
export default function DebugLogs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Debug Logs
      </h1>
      
      <p className="text-center">
        <a href="/view-logs" className="text-blue-500 hover:underline">
          Go to the logs viewer
        </a>
      </p>
    </div>
  );
} 