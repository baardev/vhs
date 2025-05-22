'use client';

import { useState, useEffect, Suspense, useContext } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import PlayerCardsList from '../../components/player-cards/PlayerCardsList';
import Link from 'next/link';
import { getCommonDictionary } from '../dictionaries';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../../src/contexts/AuthContext';
import { forceValidateTokenOrLogout } from '../../../src/utils/authUtils';

/**
 * @constant geistSans
 * @description Next.js font optimization for Geist Sans font.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * @constant geistMono
 * @description Next.js font optimization for Geist Mono font.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * @page PlayerCardsPage
 * @description List view of all player scorecards in the Open Handicap System.
 * 
 * This page serves as the main interface for users to browse, search, and access
 * player scorecard records. It displays a comprehensive list of all scorecards
 * in the system, with options to view details of individual cards or add new ones.
 * 
 * The page features:
 * - A clear header section explaining the purpose of the view
 * - A prominent "Add New Scorecard" button for quick data entry
 * - A responsive grid layout of scorecard entries 
 * - Loading state handling via Suspense
 *
 * @remarks
 * - **Component Composition**: Primarily renders the `PlayerCardsList` component.
 * - **Styling**: Uses `Geist` and `Geist_Mono` fonts and includes a background image with an overlay.
 * - Provides a title and a brief description for the page.
 * 
 * @calledBy
 * - Next.js App Router (when user navigates to /{lang}/player-cards)
 * - Dashboard links (likely has a "View Scorecards" link)
 * - Navbar/menu items for scorecard management
 * - User profile page (potentially links to user's scorecards)
 * 
 * @calls
 * - Component: PlayerCardsList (handles fetching and displaying the actual scorecard data)
 * - Component: Link (for navigation to add new scorecard)
 * - React.Suspense (for handling loading states)
 * 
 * @requires
 * - Backend API endpoint for retrieving scorecard data (via PlayerCardsList)
 * - Proper route configuration in Next.js App Router
 * - Background image asset (/wp-golf-1.webp)
 *
 * @returns {JSX.Element} The rendered page displaying the list of player scorecards.
 */
export default function PlayerCardsPage({ params }: { params: { lang: string } }) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [dictionary, setDictionary] = useState<any>({});

  // Load dictionary
  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getCommonDictionary(params.lang);
      setDictionary(dict);
    };
    loadDictionary();
  }, [params.lang]);

  // Validate token on page load
  useEffect(() => {
    const validateSession = async () => {
      await forceValidateTokenOrLogout(params.lang, router.push);
    };
    
    validateSession();
  }, [params.lang, router]);

  return (
    <div className="min-h-screen">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img
          src="/wp-golf-1.webp"
          alt="Golf background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {dictionary?.playerCards?.title || "Player Cards"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {dictionary?.playerCards?.description || "View and manage your golf round records."}
            </p>
          </div>
          
          <div className="p-6">
            <Suspense fallback={<div>Loading player cards...</div>}>
              <PlayerCardsList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 