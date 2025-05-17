'use client';

import { Geist, Geist_Mono } from "next/font/google";
import PlayerCardDetail from '../../../../components/player-cards/PlayerCardDetail';

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
 * @page PlayerCardPage
 * @description A dynamic page for displaying detailed information about a specific player card.
 * 
 * This page serves as the detailed view for individual player handicap cards in the Open
 * Handicap System. It retrieves the card ID from the route parameters and delegates
 * the actual rendering and data fetching to the PlayerCardDetail component.
 * 
 * @remarks
 * - **Dynamic Routing**: Uses App Router dynamic routing `[id]/page.tsx` to capture the player card ID.
 * - **Component Composition**: Primarily acts as a wrapper for the `PlayerCardDetail` component.
 * - **State/Props**: Retrieves `id` from `params`, parses it to an integer `cardId`,
 *   and passes `cardId` as a prop to `PlayerCardDetail`.
 * - Displays a loading message if `cardId` is not valid (e.g., 0).
 * - Uses `Geist` and `Geist_Mono` fonts for styling.
 * 
 * @calledBy
 * - Next.js App Router (when user navigates to /{lang}/player-cards/{id})
 * - Player card list page (when user selects a specific card)
 * - Dashboard links (when showing recent or featured player cards)
 * - Search results (when displaying player card matches)
 * 
 * @calls
 * - Component: PlayerCardDetail (which handles data fetching and rendering the card details)
 * 
 * @requires
 * - PlayerCardDetail component
 * - Valid numeric ID in the route parameters
 * - Backend API support for retrieving player card data by ID (via PlayerCardDetail)
 *
 * @returns {JSX.Element} The rendered page containing the player card details or a loading state.
 */
export default function PlayerCardPage({ params }: { params: { id: string, lang: string } }) {
  const { id } = params;
  const cardId = id ? parseInt(id, 10) : 0;

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-[#f8f9fa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8 relative`}>
      <div className="max-w-7xl mx-auto">
        {cardId ? (
          <PlayerCardDetail cardId={cardId} />
        ) : (
          <div className="text-center py-12">
            <div className="text-xl font-medium">Loading player card...</div>
          </div>
        )}
      </div>
    </div>
  );
} 