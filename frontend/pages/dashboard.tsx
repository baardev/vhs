import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../src/contexts/AuthContext';
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { getI18nProps } from '../utils/i18n-helpers';
import { useTranslation } from 'next-i18next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Dashboard: React.FC = () => {
  const { t } = useTranslation('common');
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState<any>(null);
  const [recentCards, setRecentCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch user profile data with authentication
        const profileResponse = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfileData(profileData);
        }

        // Fetch recent player cards
        const cardsResponse = await fetch('/api/player-cards?limit=3', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (cardsResponse.ok) {
          const cardsData = await cardsResponse.json();
          setRecentCards(cardsData.slice(0, 3)); // Take only first 3 cards
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111]`}>
        <div className="max-w-md w-full p-6 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Please log in to see your dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              You need to be logged in to view your personalized dashboard.
            </p>
            <Link href="/login" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-[#fafafa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 dark:from-green-600 dark:to-teal-600 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user.username}!
          </h1>
          <p className="text-white text-opacity-90 mt-2">
            Track your golf performance and manage your handicap.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Handicap Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Handicap</h2>
            </div>
            <div className="p-5">
              {loading ? (
                <div className="animate-pulse h-24 flex items-center justify-center">
                  <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-5xl font-bold text-green-600 dark:text-green-400">
                    {profileData?.handicap || 'N/A'}
                  </span>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Current Handicap Index</p>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    {recentCards && recentCards.length > 0 
                      ? `Last played: ${new Date(recentCards[0].play_date).toLocaleDateString()} at ${recentCards[0].course_name || `Course #${recentCards[0].course_id}`}`
                      : "No recent games"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            </div>
            <div className="p-5">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              ) : (
                <div>
                  {recentCards && recentCards.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {recentCards.map((card) => (
                        <li key={card.id} className="py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {card.course_name || `Course #${card.course_id}`}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(card.play_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {card.gross || '-'}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center">No recent activity</p>
                  )}
                  <div className="mt-4 text-center">
                    <Link href="/player-cards" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      View All Scorecards →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Stats</h2>
            </div>
            <div className="p-5">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                      {profileData?.playerCardsCount || '0'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Rounds</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                      {profileData?.bestScore || '-'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Best Score</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                      {profileData?.averageScore || '-'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Avg. Score</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                      {profileData?.roundsThisMonth || '0'}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">This Month</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              <Link 
                href="/player-cards" 
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                View Scorecards
              </Link>
              <Link 
                href="/profile" 
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Edit Profile
              </Link>
              <Link 
                href="/handicap" 
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Calculate Handicap
              </Link>
              <Link 
                href="/course-data" 
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Browse Courses
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Status</h2>
            </div>
            <div className="p-5">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Completion</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">80%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Keep tracking your golf rounds to improve your handicap accuracy!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return getI18nProps(locale);
};

export default Dashboard; 