import React, { useEffect, useState } from 'react';

const HandicapCalculator: React.FC = () => {
  const [handicapData, setHandicapData] = useState<{ avg_differential: number | null; is_mock?: boolean } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHandicap = async () => {
      try {
        setLoading(true);
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/handicap-calc?t=${timestamp}`);
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setHandicapData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch handicap data');
        console.error('Error fetching handicap:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHandicap();
  }, []);

  // Calculate the golf handicap (typically 0.96 * avg_differential)
  const calculateHandicap = (avgDifferential: number | null): string => {
    if (avgDifferential === null) return 'N/A';
    const handicap = Math.round(avgDifferential * 0.96 * 10) / 10;
    return handicap.toFixed(1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-[#2d6a4f] dark:bg-[#1e3a8a] p-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="mr-2">⛳</span>
          Handicap Calculator
        </h2>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6a4f] mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Calculating handicap...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Average Differential:</span>
              <span className="font-medium text-[#2d6a4f] dark:text-[#4fd1c5]">
                {handicapData?.avg_differential !== null
                  ? Number(handicapData?.avg_differential).toFixed(1)
                  : 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Handicap Index:</span>
              <span className="text-2xl font-bold text-[#2d6a4f] dark:text-[#4fd1c5]">
                {calculateHandicap(handicapData?.avg_differential || null)}
              </span>
            </div>
            
            {handicapData?.is_mock && (
              <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-sm text-yellow-700 dark:text-yellow-400">
                Note: This is sample data. Connect to the database for real handicap calculations.
              </div>
            )}
            
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              * Calculated based on the average of your 8 best differentials
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandicapCalculator; 