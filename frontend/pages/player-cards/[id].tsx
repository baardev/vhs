import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import PlayerCardDetail from '../../components/player-cards/PlayerCardDetail';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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