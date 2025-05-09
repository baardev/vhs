import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PlayerCard | null>(null);

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

  useEffect(() => {
    if (playerCard) {
      setFormData(playerCard);
    }
  }, [playerCard]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(playerCard);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);
    try {
      const response = await axios.put(`/api/player-cards/${cardId}`, formData);
      setPlayerCard(response.data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      console.error('Error updating player card:', err);
      setError('Failed to update player card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number | boolean = value;

    if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    }

    setFormData(prev => prev ? { ...prev, [name]: processedValue } : null);
  };

  if (loading && !isEditing) return <div className="text-center py-8">Loading player card details...</div>;
  if (error && !isEditing) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!playerCard && !isEditing) return <div className="text-center py-8">Player card not found</div>;
  if (!formData && isEditing) return <div className="text-center py-8">Loading edit form...</div>;
  if (!playerCard && !formData) return <div className="text-center py-8">Player card data unavailable.</div>;

  const displayData = isEditing && formData ? formData : playerCard;
  if (!displayData) return <div className="text-center py-8">Data unavailable.</div>;

  const getFrontNineTotal = (data: PlayerCard) => {
    return [
      data.h01, data.h02, data.h03, 
      data.h04, data.h05, data.h06, 
      data.h07, data.h08, data.h09
    ].filter(Boolean).reduce((sum, strokes) => sum + (strokes || 0), 0);
  };

  const getBackNineTotal = (data: PlayerCard) => {
    return [
      data.h10, data.h11, data.h12, 
      data.h13, data.h14, data.h15, 
      data.h16, data.h17, data.h18
    ].filter(Boolean).reduce((sum, strokes) => sum + (strokes || 0), 0);
  };

  const getTotalStrokes = (data: PlayerCard) => {
    return getFrontNineTotal(data) + getBackNineTotal(data);
  };

  if (isEditing && formData) {
    return (
      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-700 dark:bg-green-800 p-6 text-white flex justify-between items-center">
          <div>
            <div className="mb-4">
              <Link href="/player-cards" className="text-white hover:underline">
                &larr; Back to Player Cards
              </Link>
            </div>
            <h1 className="text-2xl font-bold mb-2">
              Editing: {formData.player_name || `Player #${formData.player_id}`} - {new Date(formData.play_date).toLocaleDateString()}
            </h1>
            <p className="text-lg">{formData.course_name || `Course #${formData.course_id}`}</p>
          </div>
          <div>
            <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={handleCancel} disabled={loading} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>
        {error && <div className="p-4 bg-red-100 text-red-700 text-center">{error}</div>}
        
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Score Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Score</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Gross</p>
                  <input type="number" name="gross" value={formData.gross ?? ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Net</p>
                  <input type="number" name="net" value={formData.net ?? ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Front 9 (Display)</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.ida || getFrontNineTotal(formData) || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Back 9 (Display)</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.vta || getBackNineTotal(formData) || '-'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Handicap & Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">HCPI</p>
                  <input type="number" step="0.1" name="hcpi" value={formData.hcpi ?? ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">HCP</p>
                  <input type="number" step="0.1" name="hcp" value={formData.hcp ?? ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Differential</p>
                  <input type="number" step="0.1" name="differential" value={formData.differential ?? ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                  <input type="text" name="category" value={formData.category ?? ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status (Tarj)</p>
                  <select name="tarj" value={formData.tarj ?? ''} onChange={handleChange} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <option value="">Select Status</option>
                    <option value="OK">OK</option>
                    <option value="NPT">NPT</option>
                    <option value="ERR">ERR</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="verifiedEdit" className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    Verified:
                    <input type="checkbox" id="verifiedEdit" name="verified" checked={formData.verified ?? false} onChange={handleChange} className="ml-2 h-4 w-4 text-indigo-600 border-gray-300 rounded dark:bg-gray-900 dark:border-gray-600 focus:ring-indigo-500" />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Statistics (Display)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500 dark:text-gray-400">Pars</p><p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.par_holes || '-'}</p></div>
                <div><p className="text-sm text-gray-500 dark:text-gray-400">Birdies</p><p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.bir || '-'}</p></div>
                <div><p className="text-sm text-gray-500 dark:text-gray-400">Bogeys</p><p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.bog || '-'}</p></div>
                <div><p className="text-sm text-gray-500 dark:text-gray-400">Double Bogeys</p><p className="text-lg font-semibold text-gray-900 dark:text-white">{formData.bg2 || '-'}</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Scorecard</h2>
          
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
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(holeNum => {
                    const holeKey = `h${String(holeNum).padStart(2, '0')}` as keyof PlayerCard;
                    return (
                      <td key={holeKey} className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">
                        <input
                          type="number"
                          name={holeKey}
                          value={formData[holeKey] as number ?? ''}
                          onChange={handleChange}
                          className="w-12 p-1 border rounded-md text-center dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-center text-sm font-medium text-gray-900 dark:text-white">
                    {formData.ida || getFrontNineTotal(formData) || '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
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
                  {[10, 11, 12, 13, 14, 15, 16, 17, 18].map(holeNum => {
                    const holeKey = `h${String(holeNum).padStart(2, '0')}` as keyof PlayerCard;
                    return (
                      <td key={holeKey} className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">
                        <input
                          type="number"
                          name={holeKey}
                          value={formData[holeKey] as number ?? ''}
                          onChange={handleChange}
                          className="w-12 p-1 border rounded-md text-center dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-center text-sm font-medium text-gray-900 dark:text-white border-r">
                    {formData.vta || getBackNineTotal(formData) || '-'}
                  </td>
                  <td className="px-3 py-2 text-center text-sm font-medium text-gray-900 dark:text-white">
                    {formData.gross || getTotalStrokes(formData) || '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Weather</p>
              <input 
                type="text" 
                name="weather" 
                value={formData.weather ?? ''} 
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Day of Week</p>
              <input 
                type="text" 
                name="day_of_week" 
                value={formData.day_of_week ?? ''} 
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Post</p>
              <textarea 
                name="post" 
                value={formData.post ?? ''} 
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                rows={3}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Judges</p>
              <textarea 
                name="judges" 
                value={formData.judges ?? ''} 
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                rows={3}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tee</p>
              <input 
                type="text" 
                name="tee_id"
                value={formData.tee_id ?? ''} 
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Tee ID or Name"
              />
            </div>
          </div>
        </div>
      </form>
    );
  }

  if (!playerCard) return <div className="text-center py-8">Player card data is not available.</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-700 dark:bg-green-800 p-6 text-white flex justify-between items-center">
        <div>
          <div className="mb-4">
            <Link href="/player-cards" className="text-white hover:underline">
              &larr; Back to Player Cards
            </Link>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {playerCard.player_name || `Player #${playerCard.player_id}`} - {new Date(playerCard.play_date).toLocaleDateString()}
          </h1>
          <p className="text-lg">{playerCard.course_name || `Course #${playerCard.course_id}`}</p>
        </div>
        <div>
          <button type="button" onClick={handleEdit} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
            Edit
          </button>
        </div>
      </div>
      {error && <div className="p-4 bg-red-100 text-red-700 text-center">{error}</div>}

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
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{playerCard.ida || getFrontNineTotal(playerCard) || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Back 9</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{playerCard.vta || getBackNineTotal(playerCard) || '-'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">Handicap & Status</h3>
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
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status (Tarj)</p>
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
              <div>
                <label htmlFor="verifiedDisplay" className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  Verified:
                  {playerCard.verified && (
                     <span id="verifiedDisplay" className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                       Yes
                     </span>
                  )}
                </label>
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

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Scorecard</h2>
        
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(holeNum => {
                  const holeKey = `h${String(holeNum).padStart(2, '0')}` as keyof PlayerCard;
                  return (
                    <td key={holeKey} className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">
                      {playerCard[holeKey] || '-'}
                    </td>
                  );
                })}
                <td className="px-3 py-2 text-center text-sm font-medium text-gray-900 dark:text-white">
                  {playerCard.ida || getFrontNineTotal(playerCard) || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
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
                {[10, 11, 12, 13, 14, 15, 16, 17, 18].map(holeNum => {
                  const holeKey = `h${String(holeNum).padStart(2, '0')}` as keyof PlayerCard;
                  return (
                    <td key={holeKey} className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">
                      {playerCard[holeKey] || '-'}
                    </td>
                  );
                })}
                <td className="px-3 py-2 text-center text-sm font-medium text-gray-900 dark:text-white border-r">
                  {playerCard.vta || getBackNineTotal(playerCard) || '-'}
                </td>
                <td className="px-3 py-2 text-center text-sm font-medium text-gray-900 dark:text-white">
                  {playerCard.gross || getTotalStrokes(playerCard) || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

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