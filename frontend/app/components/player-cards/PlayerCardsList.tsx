'use client';

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale, // Import TimeScale for date axes if using time type
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns'; // Import adapter for date handling
import { AuthContext } from '../../../src/contexts/AuthContext'; // Updated path for AuthContext
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale // Register TimeScale
);

/** 
 * @interface PlayerCard
 * @description Defines the structure for a player card object displayed in the list.
 * @property {number} id - Unique identifier for the player card.
 * @property {string} player_id - Identifier for the player.
 * @property {string} play_date - Date of play.
 * @property {number} course_id - Identifier for the course.
 * @property {number} differential - Calculated score differential for the round.
 * @property {number} hcpi - Handicap index at the time of play.
 * @property {number} hcp - Course handicap for the round.
 * @property {number} gross - Gross score for the round.
 * @property {number} net - Net score for the round.
 * @property {string} tarj - Status of the card (e.g., 'OK', 'NPT').
 * @property {string} [course_name] - Optional name of the course.
 * @property {string} [player_name] - Optional name of the player.
 */
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

/**
 * @interface ChartCardData
 * @description Defines the structure for data points used in the performance chart.
 * @property {string} play_date - Date of play.
 * @property {number | null} [gross] - Optional gross score.
 * @property {number | null} [net] - Optional net score.
 * @property {number | null} [differential] - Optional score differential.
 */
interface ChartCardData {
  play_date: string;
  gross?: number | null;
  net?: number | null;
  differential?: number | null;
}

/**
 * @component PlayerCardsList
 * @description Displays a list of player cards in a table and a performance chart for the logged-in user.
 *
 * @remarks
 * This component fetches and displays two sets of data:
 * 1. Public Player Cards: Fetched from `/api/player-cards` and displayed in a sortable, paginated table.
 *    Each row shows player name, date, course, gross/net scores, differential, and status.
 *    A "View Details" link navigates to the specific player card's detail page (`/[lang]/player-cards/:id`).
 * 2. User's Chart Data: Fetched from `/api/user/chart-data` (requires authentication) if a user is logged in.
 *    Displays a line chart showing the user's Gross, Net, and Differential scores over their last 50 'OK' rounds.
 *    Handles loading and error states for both data fetches independently.
 *    Provides an "Add New Card" button if the user is logged in.
 *    Uses `AuthContext` to manage user authentication state and `useRouter` for programmatic navigation.
 *    If chart data fetch results in a 401, it logs the user out and redirects to login.
 *
 * Called by:
 * - `frontend/app/[lang]/player-cards/page.tsx`
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`, `useContext`
 * - `axios.get` (to fetch data from `/api/player-cards` and `/api/user/chart-data`)
 * - `next/link`'s `Link` component (for navigation to add new card and view card details)
 * - `react-chartjs-2`'s `Line` component (to render the performance chart)
 * - `AuthContext` (to get user status and logout function)
 * - `useRouter` (for redirecting on authentication failure)
 * - `localStorage.getItem('token')` (as part of chart data fetching, though primarily relies on `AuthContext`)
 *
 * @returns {JSX.Element} The rendered list of player cards and performance chart.
 */
const PlayerCardsList = () => {
  const [playerCards, setPlayerCards] = useState<PlayerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const lang = params?.lang || 'en';

  const [chartData, setChartData] = useState<any>(null); // Can be more specific with Chart.js types
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState('');
  
  const { user, logout } = useContext(AuthContext); // Use AuthContext
  const router = useRouter(); // Initialize router

  // Fetch general player cards (public data)
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

  // Fetch chart data (requires authentication)
  useEffect(() => {
    const fetchChartData = async () => {
      if (!user) { // Check if user is authenticated via AuthContext
        setChartLoading(false);
        setChartError('Please log in to view your chart data.'); // Or set to null if chart shouldn't show
        setChartData(null);
        return;
      }

      setChartLoading(true);
      setChartError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // This case should ideally be handled by AuthContext state, but as a fallback:
          setChartError('Authentication token not found.');
          setChartLoading(false);
          setChartData(null);
          return;
        }
        
        const response = await axios.get<ChartCardData[]>('/api/user/chart-data', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.length > 0) {
          // Data is already reversed by backend to be chronological (oldest first)
          const labels = response.data.map(d => new Date(d.play_date)); // Use Date objects for time scale
          
          setChartData({
            labels,
            datasets: [
              {
                label: 'Gross',
                data: response.data.map(d => d.gross),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.1,
              },
              {
                label: 'Net',
                data: response.data.map(d => d.net),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                tension: 0.1,
              },
              {
                label: 'Differential',
                data: response.data.map(d => d.differential),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.1,
              },
            ],
          });
        } else {
          setChartData(null); // No data to display
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setChartError('Session expired or invalid. Please log in again.');
          logout(); // Call logout from AuthContext to clear user state and token
          router.push('/login'); // Redirect to login page
        } else {
          setChartError('Failed to load chart data.');
        }
        setChartData(null);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [user, logout, router]); // Depend on user from AuthContext, logout, and router

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Your Last 50 Rounds (Status: OK)',
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          tooltipFormat: 'MMM dd, yyyy', // e.g., Jan 01, 2023
          displayFormats: {
            day: 'MMM dd' // e.g., Jan 01
          }
        },
        title: {
          display: true,
          text: 'Play Date'
        }
      },
      y: {
        beginAtZero: true, // Or false if scores can be negative / differentials
        title: {
          display: true,
          text: 'Score / Differential'
        }
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading player cards...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  // No longer return "No player cards found" immediately, show chart if available
  
  return (
    <div>
      <div className="mb-4 flex justify-end">
        {user && ( // Only show Add New Card if user is logged in
          <Link href={`/${lang}/player-cards/new`} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <span>Add New Card</span>
          </Link>
        )}
      </div>

      {/* Chart Section - Only show if user is logged in (implicitly handled by useEffect dependency) */}
      {user && (
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {chartLoading && <div className="text-center py-4">Loading chart data...</div>}
          {chartError && <div className="text-center py-4 text-red-600">{chartError}</div>}
          {!chartLoading && !chartError && chartData && (
            <div style={{ height: '400px' }}> {/* Set a fixed height for the chart container */}
              <Line options={chartOptions} data={chartData} />
            </div>
          )}
          {!chartLoading && !chartError && !chartData && (
            <div className="text-center py-4">No chart data available (no recent 'OK' scorecards found or not logged in).</div>
          )}
        </div>
      )}

      {/* Table Section */}
      {playerCards.length === 0 && !loading && <div className="text-center py-8">No player cards found in table.</div>}
      {playerCards.length > 0 && (
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
                    <Link href={`/${lang}/player-cards/${card.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlayerCardsList; 