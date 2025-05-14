import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import PlayerCardDetail from '../../components/player-cards/PlayerCardDetail';

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
 * @description A dynamic Next.js page component responsible for displaying the details of a specific player card.
 * It retrieves the card ID from the URL path (e.g., `/player-cards/123`) and passes it to the
 * `PlayerCardDetail` component for rendering.
 *
 * @remarks
 * - **Dynamic Routing**: Uses Next.js dynamic routing `[id].tsx` to capture the player card ID.
 * - **Component Composition**: Primarily acts as a wrapper for the `PlayerCardDetail` component.
 * - **State/Props**: Retrieves `id` from `router.query`, parses it to an integer `cardId`,
 *   and passes `cardId` as a prop to `PlayerCardDetail`.
 * - Displays a loading message if `cardId` is not yet processed or is invalid (e.g., 0).
 * - Uses `Geist` and `Geist_Mono` fonts for styling.
 *
 * Called by:
 * - Next.js routing system when a user navigates to a URL like `/player-cards/[some-id]`.
 *
 * Calls:
 * - `useRouter` (Next.js hook to access route parameters).
 * - `parseInt` (to convert the ID from string to number).
 * - `PlayerCardDetail` (component to render the actual card details).
 *
 * @returns {JSX.Element} The rendered page containing the player card details or a loading state.
 */
const PlayerCardPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const cardId = id ? parseInt(id as string, 10) : 0;

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
};

export default PlayerCardPage; 