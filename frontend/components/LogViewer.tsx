import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface LogViewerProps {
  onClose: () => void;
  visible: boolean;
}

const LogViewer: React.FC<LogViewerProps> = ({ onClose, visible }) => {
  const [logs, setLogs] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/logs');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.statusText}`);
      }
      
      const text = await response.text();
      setLogs(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error fetching logs');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchLogs();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Application Logs
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={fetchLogs}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              disabled={loading}
            >
              <ArrowPathIcon className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Reload
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">
            {error}
          </div>
        )}
        
        <div className="bg-gray-100 dark:bg-gray-900 rounded p-2 overflow-auto" style={{ maxHeight: '50vh' }}>
          {loading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : logs ? (
            <pre className="text-xs font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-200">
              {logs}
            </pre>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No logs available</p>
          )}
        </div>
        
        <div className="flex justify-end mt-2">
          <button
            onClick={() => {
              fetch('/api/logs', { method: 'DELETE' })
                .then(() => fetchLogs())
                .catch(err => console.error('Error clearing logs:', err));
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogViewer; 