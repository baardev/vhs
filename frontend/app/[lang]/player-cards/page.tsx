'use client';

import { Suspense } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import PlayerCardsList from '../../components/player-cards/PlayerCardsList';
import Link from 'next/link';

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
  // Update to handle params properly without React.use() since we're in a client component
  const { lang } = params;
  
  return (
    <div 
      className={`${geistSans.className} ${geistMono.className} min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative`}
      style={{ backgroundImage: "url('/wp-golf-1.webp')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-white mb-8">
          Player Scorecards
        </h1>
        
        <div className="flex justify-end mb-4">
          <Link 
            href={`/${lang}/player-cards/new`} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Add New Scorecard
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            View all player scorecards from the database. This page displays data from the player_cards table, 
            showing information like scores, differentials, and round status.
          </p>
        </div>
        
        <Suspense fallback={<div className="text-white">Loading scorecards...</div>}>
          <PlayerCardsList />
        </Suspense>
      </div>
    </div>
  );
} 