import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Geist } from "next/font/google";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const MyHandicapPage: NextPage = () => {
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
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${geistSans.variable} font-sans`}>
      <Head>
        <title>My Handicap | VHS Golf</title>
        <meta name="description" content="View your golf handicap index at VHS Golf Club" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">My Handicap</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {!isLoggedIn ? (
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Login Required
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  You need to be logged in to view your handicap information.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link href="/login" className="px-6 py-3 bg-[#2d6a4f] text-white rounded-md hover:bg-[#1e4835] transition-colors">
                    Login
                  </Link>
                  <Link href="/createAccount" className="px-6 py-3 border border-[#2d6a4f] text-[#2d6a4f] dark:text-[#4fd1c5] rounded-md hover:bg-[#e6f7ee] dark:hover:bg-[#1e3a8a] transition-colors">
                    Create Account
                  </Link>
                </div>
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d6a4f]"></div>
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
      </main>

      <Footer />
    </div>
  );
};

export default MyHandicapPage; 