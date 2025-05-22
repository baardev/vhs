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
import { getCommonDictionary } from '../../dictionaries';

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
 * @property {number} g_differential - Alternative name for differential in some API responses.
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
  g_differential?: number; // Added for backend API compatibility
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
 *    Uses translations loaded from the language dictionaries.
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
 * - `getCommonDictionary` (for loading translations)
 *
 * @returns {JSX.Element} The rendered list of player cards and performance chart.
 */
const PlayerCardsList = () => {
  const [playerCards, setPlayerCards] = useState<PlayerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const lang = params?.lang || 'en';
  const [dict, setDict] = useState<Record<string, any>>({});

  const [chartData, setChartData] = useState<any>(null); // Can be more specific with Chart.js types
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState('');
  
  const { user, logout } = useContext(AuthContext); // Use AuthContext
  const router = useRouter(); // Initialize router

  // Load dictionary
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dictionary = await getCommonDictionary(lang as string);
        setDict(dictionary);
      } catch (err) {
        console.error('Error loading dictionary in PlayerCardsList:', err);
      }
    };
    
    if (lang) {
      loadDictionary();
    }
  }, [lang]);

  // Fetch general player cards (public data)
  useEffect(() => {
    const fetchPlayerCards = async () => {
      try {
        setLoading(true);
        
        // Check if user is logged in
        if (!user) {
          setError(dict?.playerCardsList?.authError || 'Please log in to view your player cards.');
          setLoading(false);
          setPlayerCards([]);
          return;
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError(dict?.playerCardsList?.tokenError || 'Authentication token not found. Please log in again.');
          setLoading(false);
          setPlayerCards([]);
          return;
        }
        
        console.log('Fetching player cards from /api/player-cards');
        const response = await axios.get('/api/player-cards', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Player cards response:', response.data);
        setPlayerCards(response.data);
      } catch (err) {
        console.error('Error fetching player cards:', err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError(dict?.playerCardsList?.authError || 'Your session has expired. Please log in again.');
            logout(); // Call logout from AuthContext to clear user state and token
            router.push(`/${lang}/login`); // Redirect to login page with language
          } else {
            setError(`${dict?.playerCardsList?.error || 'Failed to load player cards: '}${err.message} (${err.response?.status || 'unknown'} ${err.response?.statusText || ''})`);
          }
        } else {
          setError(`${dict?.playerCardsList?.error || 'Failed to load player cards: '}${err.toString()}`);
        }
        setPlayerCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerCards();
  }, [dict, user, logout, router, lang]);

  // Fetch chart data (requires authentication)
  useEffect(() => {
    const fetchChartData = async () => {
      if (!user) { // Check if user is authenticated via AuthContext
        setChartLoading(false);
        setChartError(dict?.playerCardsList?.chartError || 'Please log in to view your chart data.'); // Or set to null if chart shouldn't show
        setChartData(null);
        return;
      }

      setChartLoading(true);
      setChartError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // This case should ideally be handled by AuthContext state, but as a fallback:
          setChartError(dict?.playerCardsList?.chartLoginError || 'Authentication token not found.');
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
          
          // Calculate min and max values for Y-axis
          const allValues = [
            ...response.data.map(d => d.gross).filter(v => v !== null && v !== undefined) as number[],
            ...response.data.map(d => d.net).filter(v => v !== null && v !== undefined) as number[],
            ...response.data.map(d => d.differential).filter(v => v !== null && v !== undefined) as number[]
          ];
          
          // Logging to debug
          console.log('All chart values:', allValues);
          
          // Calculate min and max with a little extra padding
          const minValue = Math.floor(Math.min(...allValues)) - 5;
          const maxValue = Math.ceil(Math.max(...allValues)) + 5;
          
          console.log('Calculated Y range - min:', minValue, 'max:', maxValue);
          
          // Create chart.js datasets
          const chartDatasets = [
            {
              label: dict?.playerCardsList?.tableHeaders?.gross || 'Gross',
              data: response.data.map(d => d.gross),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              tension: 0.1,
            },
            {
              label: dict?.playerCardsList?.tableHeaders?.net || 'Net',
              data: response.data.map(d => d.net),
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              tension: 0.1,
            },
            {
              label: dict?.playerCardsList?.tableHeaders?.differential || 'Differential',
              data: response.data.map(d => d.differential),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              tension: 0.1,
            },
          ];
          
          setChartData({
            labels,
            datasets: chartDatasets,
            // Store calculated min/max values to be used in chart options
            _calculatedYRange: { min: minValue, max: maxValue }
          });
        } else {
          setChartData(null); // No data to display
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setChartError(dict?.playerCardsList?.chart401Error || 'Session expired or invalid. Please log in again.');
          logout(); // Call logout from AuthContext to clear user state and token
          router.push(`/${lang}/login`); // Redirect to login page with language
        } else {
          setChartError(dict?.playerCardsList?.chartGenericError || 'Failed to load chart data.');
        }
        setChartData(null);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [user, logout, router, dict, lang]); // Depend on user from AuthContext, logout, router, dict, and lang

  // Create chart options with dynamic Y-axis min and max values based on data
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: dict?.playerCardsList?.chartTitle || 'Your Last 50 Rounds (Status: OK)',
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
          text: dict?.playerCardsList?.chartXAxis || 'Play Date'
        }
      },
      y: {
        // Use calculated min/max if available, otherwise use default
        min: chartData?._calculatedYRange?.min,
        max: chartData?._calculatedYRange?.max,
        beginAtZero: false, // Force Chart.js not to start at zero
        suggestedMin: chartData?._calculatedYRange?.min, // Alternative way to set min
        suggestedMax: chartData?._calculatedYRange?.max, // Alternative way to set max
        ticks: {
          precision: 0 // Use integers only for the tick values
        },
        title: {
          display: true,
          text: dict?.playerCardsList?.chartYAxis || 'Score / Differential'
        }
      }
    }
  };

  if (loading) return <div className="text-center py-8">{dict?.playerCardsList?.loading || 'Loading player cards...'}</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  // No longer return "No player cards found" immediately, show chart if available
  
  return (
    <div>
      <div className="mb-4 flex justify-end">
        {user && ( // Only show Add New Card if user is logged in
          <Link href={`/${lang}/player-cards/new`} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <span>{dict?.playerCardsList?.addNewCard || 'Add New Card'}</span>
          </Link>
        )}
      </div>

      {/* Authentication Message */}
      {!user && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-3">{dict?.playerCardsList?.authTitle || 'Authentication Required'}</h2>
          <p className="mb-4">{dict?.playerCardsList?.authMessage || 'Please log in to view your player cards.'}</p>
          <Link href={`/${lang}/login`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <span>{dict?.playerCardsList?.loginButton || 'Log In'}</span>
          </Link>
        </div>
      )}

      {/* Chart Section - Only show if user is logged in (implicitly handled by useEffect dependency) */}
      {user && (
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {chartLoading && <div className="text-center py-4">{dict?.playerCardsList?.chartLoading || 'Loading chart data...'}</div>}
          {chartError && <div className="text-center py-4 text-red-600">{chartError}</div>}
          {!chartLoading && !chartError && chartData && (
            <div style={{ height: '400px' }}> {/* Set a fixed height for the chart container */}
              <Line 
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      // Force these settings directly in the render
                      min: chartData._calculatedYRange.min,
                      max: chartData._calculatedYRange.max,
                      beginAtZero: false
                    }
                  }
                }} 
                data={chartData} 
              />
              <div className="text-xs text-gray-500 text-center mt-1">
                Y-axis range: {chartData._calculatedYRange.min} to {chartData._calculatedYRange.max}
              </div>
            </div>
          )}
          {!chartLoading && !chartError && !chartData && (
            <div className="text-center py-4">{dict?.playerCardsList?.noChartData || 'No chart data available (no recent \'OK\' scorecards found or not logged in).'}</div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="text-center py-4 text-red-600">{error}</div>
        </div>
      )}

      {/* Table Section - Only show if user is logged in and data is loaded */}
      {user && !loading && playerCards.length > 0 && (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{dict?.playerCardsList?.tableHeaders?.player || 'Player'}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{dict?.playerCardsList?.tableHeaders?.date || 'Date'}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{dict?.playerCardsList?.tableHeaders?.course || 'Course'}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{dict?.playerCardsList?.tableHeaders?.gross || 'Gross'}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{dict?.playerCardsList?.tableHeaders?.net || 'Net'}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{dict?.playerCardsList?.tableHeaders?.differential || 'Differential'}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{dict?.playerCardsList?.tableHeaders?.status || 'Status'}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{dict?.playerCardsList?.tableHeaders?.actions || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {playerCards.map((card) => (
                <tr key={card.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{card.player_name || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(card.play_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{card.course_name || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{card.gross || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{card.net || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{card.differential || card.g_differential || '—'}</td>
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
                      {dict?.playerCardsList?.viewDetails || 'View Details'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* No cards found message - Only show if user is logged in and not loading */}
      {user && !loading && playerCards.length === 0 && !error && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {dict?.playerCardsList?.noCardsFound || 'No player cards found.'}
        </div>
      )}
      
      {/* Loading message */}
      {loading && (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {dict?.playerCardsList?.loading || 'Loading player cards...'}
        </div>
      )}
    </div>
  );
};

export default PlayerCardsList; 