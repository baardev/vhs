import React from 'react';

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