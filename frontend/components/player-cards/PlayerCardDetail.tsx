import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface PlayerCard {
  id: number;
  player_id: string;
  play_date: string;
  course_id: number;
  weather: string;
  day_of_week: string;
  category: string;
  differential: number;
  post: string;
  judges: string;
  hcpi: number;
  hcp: number;
  ida: number;
  vta: number;
  gross: number;
  net: number;
  tarj: string;
  bir: string;
  par_holes: string;
  bog: number;
  bg2: number;
  bg3g: number;
  plus_bg3: string;
  putts: string;
  tee_id: string;
  h01: number;
  h02: number;
  h03: number;
  h04: number;
  h05: number;
  h06: number;
  h07: number;
  h08: number;
  h09: number;
  h10: number;
  h11: number;
  h12: number;
  h13: number;
  h14: number;
  h15: number;
  h16: number;
  h17: number;
  h18: number;
  verified: boolean;
  course_name?: string;
  player_name?: string;
  tee_name?: string;
}

interface PlayerCardDetailProps {
  cardId: number;
}

const PlayerCardDetail = ({ cardId }: PlayerCardDetailProps) => {
  const [playerCard, setPlayerCard] = useState<PlayerCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayerCard = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/player-cards/${cardId}`);
        setPlayerCard(response.data);
      } catch (err) {
        console.error('Error fetching player card:', err);
        setError('Failed to load player card details');
      } finally {
        setLoading(false);
      }
    };

    if (cardId) {
      fetchPlayerCard();
    }
  }, [cardId]);

  if (loading) return <div className="text-center py-8">Loading player card details...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!playerCard) return <div className="text-center py-8">Player card not found</div>;

  const getFrontNineTotal = () => {
    return [
      playerCard.h01, playerCard.h02, playerCard.h03, 
      playerCard.h04, playerCard.h05, playerCard.h06, 
      playerCard.h07, playerCard.h08, playerCard.h09
    ].filter(Boolean).reduce((sum, strokes) => sum + (strokes || 0), 0);
  };

  const getBackNineTotal = () => {
    return [
      playerCard.h10, playerCard.h11, playerCard.h12, 
      playerCard.h13, playerCard.h14, playerCard.h15, 
      playerCard.h16, playerCard.h17, playerCard.h18
    ].filter(Boolean).reduce((sum, strokes) => sum + (strokes || 0), 0);
  };

  const getTotalStrokes = () => {
    return getFrontNineTotal() + getBackNineTotal();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-green-700 dark:bg-green-800 p-6 text-white">
        <div className="mb-4">
          <Link href="/player-cards" className="text-white hover:underline">
            &larr; Back to Player Cards
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {playerCard.player_name || `Player #${playerCard.player_id}`} - {new Date(playerCard.play_date).toLocaleDateString()}
        </h1>
        <p className="text-lg">{playerCard.course_name || `Course #${playerCard.course_id}`}</p>
        <div className="mt-3 flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2">Status:</span>
            <span 
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                playerCard.tarj === 'OK' 
                  ? 'bg-green-100 text-green-800' 
                  : playerCard.tarj === 'NPT' 
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {playerCard.tarj || 'Unknown'}
            </span>
          </div>
          {playerCard.verified && (
            <div className="flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Verified
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card Details */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Score Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Score</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gross</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{playerCard.gross || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Net</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{playerCard.net || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Front 9</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{playerCard.ida || getFrontNineTotal() || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Back 9</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{playerCard.vta || getBackNineTotal() || '-'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Handicap</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">HCPI</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{playerCard.hcpi != null && !isNaN(Number(playerCard.hcpi)) ? Number(playerCard.hcpi).toFixed(1) : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">HCP</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{playerCard.hcp != null && !isNaN(Number(playerCard.hcp)) ? Number(playerCard.hcp).toFixed(1) : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Differential</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{(() => {
                  const diffNum = Number(playerCard.differential);
                  return isNaN(diffNum) ? '-' : diffNum.toFixed(1);
                })()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{playerCard.category || '-'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pars</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{playerCard.par_holes || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Birdies</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{playerCard.bir || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bogeys</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{playerCard.bog || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Double Bogeys</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{playerCard.bg2 || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scorecard Section */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Scorecard</h2>
        
        {/* Front Nine */}
        <div className="overflow-x-auto mb-6">
          <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Front Nine</h3>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r">
                  Hole
                </th>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <th key={num} className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r">
                    {num}
                  </th>
                ))}
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  OUT
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white dark:bg-gray-800">
                <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white border-r">
                  Score
                </td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h01 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h02 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h03 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h04 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h05 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h06 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h07 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h08 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h09 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm font-medium text-gray-900 dark:text-white">
                  {playerCard.ida || getFrontNineTotal() || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Back Nine */}
        <div className="overflow-x-auto">
          <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Back Nine</h3>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r">
                  Hole
                </th>
                {[10, 11, 12, 13, 14, 15, 16, 17, 18].map(num => (
                  <th key={num} className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r">
                    {num}
                  </th>
                ))}
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r">
                  IN
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white dark:bg-gray-800">
                <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white border-r">
                  Score
                </td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h10 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h11 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h12 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h13 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h14 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h15 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h16 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h17 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{playerCard.h18 || '-'}</td>
                <td className="px-3 py-2 text-center text-sm font-medium text-gray-900 dark:text-white border-r">
                  {playerCard.vta || getBackNineTotal() || '-'}
                </td>
                <td className="px-3 py-2 text-center text-sm font-medium text-gray-900 dark:text-white">
                  {playerCard.gross || getTotalStrokes() || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Details */}
      <div className="p-6 bg-gray-50 dark:bg-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Additional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Weather</p>
            <p className="text-md font-medium text-gray-900 dark:text-white">{playerCard.weather || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Day of Week</p>
            <p className="text-md font-medium text-gray-900 dark:text-white">{playerCard.day_of_week || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Post</p>
            <p className="text-md font-medium text-gray-900 dark:text-white">{playerCard.post || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Judges</p>
            <p className="text-md font-medium text-gray-900 dark:text-white">{playerCard.judges || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tee</p>
            <p className="text-md font-medium text-gray-900 dark:text-white">{playerCard.tee_name || playerCard.tee_id || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCardDetail; 