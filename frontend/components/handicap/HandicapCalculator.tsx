import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const HandicapCalculator: React.FC = () => {
  // The local React state manages our handicap data.
  // 'handicapData' stores the JSON response from the /api/handicap-calc endpoint,
  // and 'setHandicapData' is the updater function provided by useState to change that state.
  // This state is held internally by the component and is not passed in from any parent.
  const [handicapData, setHandicapData] = useState<{ avg_differential: number | null; is_mock?: boolean } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    // Only fetch handicap data if the user is logged in
    if (token) {
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
    } else {
      setLoading(false);
    }
    
    // Listen for auth changes
    const handleAuthChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // Calculate the golf handicap (typically 0.96 * avg_differential)
  const calculateHandicap = (avgDifferential: number | null): string => {
    if (avgDifferential === null) return 'N/A';
    const handicap = Math.round(avgDifferential * 0.96 * 10) / 10;
    return handicap.toFixed(1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden   border border-green-500">
      <div className="bg-[#2d6a4f] dark:bg-[#1e3a8a] p-4">
        <h2 className="flex justify-center text-xl font-semibold text-white flex items-center">
          <span className="mr-2">⛳</span>
          Handicap Calculator
        </h2>
      </div>
      <div className="p-6">
        {!isLoggedIn ? (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You need to be logged in to view your handicap.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/login" className="px-4 py-2 bg-[#2d6a4f] text-white rounded-md hover:bg-[#1e4835] transition-colors">
                Login
              </Link>
              <Link href="/createAccount" className="px-4 py-2 border border-[#2d6a4f] text-[#2d6a4f] dark:text-[#4fd1c5] rounded-md hover:bg-[#e6f7ee] dark:hover:bg-[#1e3a8a] transition-colors">
                Create Account
              </Link>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6a4f] mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Calculating handicap...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        ) :
          <div className="space-y-4  border border-green-500">
            <div className="flex justify-center w-full   border border-green-500">
              <div className="flex flex-col items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md p-4 w-40 h-40   border border-green-500">
                <span className="text-gray-700 dark:text-gray-300 text-base   border border-green-500">Handicap Index</span>
                <span className="mt-2 text-3xl font-bold text-[#2d6a4f] dark:text-[#4fd1c5]   border border-green-500">
                  {calculateHandicap(handicapData?.avg_differential || null)}
                </span>
              </div>
            </div>
            
            {handicapData?.is_mock && (
              <div className="flex justify-center mt-2 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-sm text-yellow-700 dark:text-yellow-400">
                Note: Using mock adjusted gross data.
              </div>
            )}
            
            <div className="flex justify-center mt-4 text-xs text-gray-500 dark:text-gray-400">
              * Calculated based on the average of your 8 best differentials
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default HandicapCalculator; 