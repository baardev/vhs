import React, { useState, useEffect } from 'react';
import Head from 'next/head';

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