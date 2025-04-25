import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface PlayerCard {
  id: number;
  player_id: string;
  play_date: string;
  course_id: number;
  differential: number;
  hcpi: number;
  hcp: number;
  gross: number;
  net: number;
  tarj: string;
  course_name?: string;
  player_name?: string;
}

const PlayerCardsList = () => {
  const [playerCards, setPlayerCards] = useState<PlayerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayerCards = async () => {
      try {
        setLoading(true);
        console.log('Fetching player cards from /api/player-cards');
        const response = await axios.get('/api/player-cards');
        console.log('Player cards response:', response.data);
        setPlayerCards(response.data);
      } catch (err) {
        console.error('Error fetching player cards:', err);
        if (axios.isAxiosError(err)) {
          setError(`Failed to load player cards: ${err.message} (${err.response?.status || 'unknown'} ${err.response?.statusText || ''})`);
        } else {
          setError(`Failed to load player cards: ${err.toString()}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerCards();
  }, []);

  if (loading) return <div className="text-center py-8">Loading player cards...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (playerCards.length === 0) return <div className="text-center py-8">No player cards found</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Player
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Course
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Gross
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Net
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Differential
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {playerCards.map((card) => (
            <tr key={card.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {card.player_name || card.player_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {new Date(card.play_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {card.course_name || `Course #${card.course_id}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {card.gross || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {card.net || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {card.differential != null && !isNaN(Number(card.differential)) ? Number(card.differential).toFixed(1) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    card.tarj === 'OK' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                      : card.tarj === 'NPT' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}
                >
                  {card.tarj || 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <Link href={`/player-cards/${card.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerCardsList; 