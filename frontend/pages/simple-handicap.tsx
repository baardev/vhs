import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SimpleHandicapPage: NextPage = () => {
  const [handicapData, setHandicapData] = useState<{ avg_differential: number | null; is_mock?: boolean } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHandicap = async () => {
      try {
        const response = await fetch('/api/handicap-calc');
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setHandicapData(data);
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
    <div className={`${geistSans.variable} flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900`}>
      <Head>
        <title>Golf Handicap Calculator</title>
      </Head>
      
      {/* Simple header instead of Navbar */}
      <header className="w-full bg-white dark:bg-gray-900 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center text-[#2d6a4f] dark:text-[#4fd1c5]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.743-.95l.337-2.698a.99.99 0 0 0-.278-.83l-1.566-1.566a.997.997 0 0 1 0-1.414L18.285 6.3a.997.997 0 0 1 1.414 0l.707.707a.997.997 0 0 1 .289.707l-1.046 2.175"></path>
              <path d="M11.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.743-.95l.337-2.698a.99.99 0 0 0-.278-.83l-1.566-1.566a.997.997 0 0 1 0-1.414L10.285 6.3a.997.997 0 0 1 1.414 0l.707.707a.997.997 0 0 1 .289.707l-1.046 2.175"></path>
              <circle cx="3.5" cy="12" r="2.5"></circle>
            </svg>
            <span className="text-xl font-bold">VHS</span>
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-[#2d6a4f] dark:hover:text-[#4fd1c5]">
              Back to Home
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#2d6a4f] to-[#40916c] p-6">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <span className="mr-2">⛳</span>
                Golf Handicap Index
              </h1>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2d6a4f]"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 h-40 flex items-center">
                  <p className="text-red-700 dark:text-red-400">{error}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8">
                  <div className="text-6xl font-bold text-[#2d6a4f] dark:text-[#4fd1c5] mb-2">
                    {calculateHandicap(handicapData?.avg_differential || null)}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 mb-6">
                    Handicap Index
                  </div>
                  
                  <div className="w-full border-t border-gray-200 dark:border-gray-700 pt-6 mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Average Differential:</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {handicapData?.avg_differential !== null
                          ? Number(handicapData?.avg_differential).toFixed(1)
                          : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                      Based on your 8 best recent scores
                    </div>
                    
                    {handicapData?.is_mock && (
                      <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded text-sm text-yellow-700 dark:text-yellow-400">
                        Note: This is sample data. Real handicap calculations will be available once you have posted scores.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#2d6a4f] dark:text-white mb-4">
              What is a Handicap Index?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your Handicap Index is a portable measure of your playing ability calculated using the 8 best differentials from your 20 most recent scores.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              To calculate your Course Handicap for a specific golf course, multiply your Handicap Index by the Slope Rating of the tees played, then divide by 113.
            </p>
          </div>
        </div>
      </main>
      
      {/* Simple footer */}
      <footer className="w-full py-6 bg-gray-100 dark:bg-gray-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} VHS Handicap System
        </div>
      </footer>
    </div>
  );
};

export default SimpleHandicapPage; 