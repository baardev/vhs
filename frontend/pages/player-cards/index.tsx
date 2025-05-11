import { NextPage } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import PlayerCardsList from '../../components/player-cards/PlayerCardsList';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const PlayerCardsPage: NextPage = () => {
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
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            View all player scorecards from the database. This page displays data from the player_cards table, 
            showing information like scores, differentials, and round status.
          </p>
        </div>
        
        <PlayerCardsList />
      </div>
    </div>
  );
};

export default PlayerCardsPage; 