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
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-[#f8f9fa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8 relative`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#2d6a4f] dark:text-[#4fd1c5] mb-8">
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