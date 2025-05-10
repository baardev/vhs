import { useState, useEffect } from 'react';
import axios from 'axios';
// @ts-ignore: next/link module is missing its type declarations in the current setup
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

interface ChartCardData {
  play_date: string;
  gross?: number | null;
  net?: number | null;
  differential?: number | null;
}

const PlayerCardsList = () => {
  const [playerCards, setPlayerCards] = useState<PlayerCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [chartData, setChartData] = useState<any>(null); // Can be more specific with Chart.js types
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsUserLoggedIn(!!token);
    // Initial fetch for the table data
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

  useEffect(() => {
    const fetchChartData = async () => {
      setChartLoading(true);
      setChartError('');
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem('token');
        
        // Add the token to the request headers
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
        setChartError('Failed to load chart data.');
        setChartData(null);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [isUserLoggedIn]);

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
        <Link href="/player-cards/new" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          <span>Add New Card</span>
        </Link>
      </div>

      {/* Chart Section - Only show if user is logged in */}
      {isUserLoggedIn && (
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {chartLoading && <div className="text-center py-4">Loading chart data...</div>}
          {chartError && <div className="text-center py-4 text-red-600">{chartError}</div>}
          {!chartLoading && !chartError && chartData && (
            <div style={{ height: '400px' }}> {/* Set a fixed height for the chart container */}
              <Line options={chartOptions} data={chartData} />
            </div>
          )}
          {!chartLoading && !chartError && !chartData && (
            <div className="text-center py-4">No chart data available (no recent 'OK' scorecards found).</div>
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
                    <Link href={`/player-cards/${card.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
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