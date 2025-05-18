'use client';

import { useState, ChangeEvent, FormEvent, useEffect, ReactElement, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ErrorBoundary } from 'react-error-boundary';
import { getCommonDictionary } from '../../dictionaries';

// Interface for the PlayerCard data - can be shared or imported if defined elsewhere
/**
 * @interface NewPlayerCardData
 * @description Defines the structure for a new player scorecard's data,
 * covering all fields from basic info to hole-by-hole scores.
 * Numeric fields that can be optional are typed as `number | string` to accommodate
 * empty string from input, which are then processed before submission.
 */
interface NewPlayerCardData {
  player_id: string; // Or number, depending on your needs
  play_date: string; // Use string for input type='date'
  course_id: string; // Or number
  weather?: string;
  day_of_week?: string;
  category?: string;
  differential?: number | string; // Allow string for input, convert to number on save
  post?: string;
  judges?: string;
  hcpi?: number | string;
  hcp?: number | string;
  ida?: number | string;
  vta?: number | string;
  gross: number | string;
  net?: number | string;
  tarj: string;
  bir?: string;
  par_holes?: string;
  bog?: number | string;
  bg2?: number | string;
  bg3g?: number | string;
  plus_bg3?: string;
  putts?: string;
  tee_id: string;
  h01?: number | string; h02?: number | string; h03?: number | string; h04?: number | string; h05?: number | string;
  h06?: number | string; h07?: number | string; h08?: number | string; h09?: number | string;
  h10?: number | string; h11?: number | string; h12?: number | string; h13?: number | string; h14?: number | string;
  h15?: number | string; h16?: number | string; h17?: number | string; h18?: number | string;
  verified: boolean;
}

/**
 * @interface CourseName
 * @description Defines the structure for a course object, typically used in dropdowns,
 * containing the course ID and name.
 */
interface CourseName {
  course_id: number | string; // Match the type from your backend
  course_name: string;
}

/**
 * @interface TeeType
 * @description Defines the structure for a tee object, containing the tee ID and name,
 * used for selecting a tee for a specific course.
 */
interface TeeType {
  tee_id: string; // Match the type from your backend (e.g., VARCHAR or an ID)
  tee_name: string; // Or tee_color, based on what you want to display
}

/**
 * @constant initialFormData
 * @description Provides the initial state for the new player card form,
 * with default values for all fields.
 * @type {NewPlayerCardData}
 */
const initialFormData: NewPlayerCardData = {
  player_id: '',
  play_date: '',
  course_id: '',
  weather: '',
  day_of_week: '',
  category: '',
  differential: '',
  post: '',
  judges: '',
  hcpi: '',
  hcp: '',
  ida: '',
  vta: '',
  gross: '',
  net: '',
  tarj: 'OK', // Default to OK
  bir: '',
  par_holes: '',
  bog: '',
  bg2: '',
  bg3g: '',
  plus_bg3: '',
  putts: '',
  tee_id: '',
  h01: '', h02: '', h03: '', h04: '', h05: '',
  h06: '', h07: '', h08: '', h09: '',
  h10: '', h11: '', h12: '', h13: '', h14: '',
  h15: '', h16: '', h17: '', h18: '',
  verified: false,
};

// Specific type for hole field keys to resolve linter error and improve type safety
type HoleFieldKey =
  | 'h01' | 'h02' | 'h03' | 'h04' | 'h05' | 'h06' | 'h07' | 'h08' | 'h09'
  | 'h10' | 'h11' | 'h12' | 'h13' | 'h14' | 'h15' | 'h16' | 'h17' | 'h18';

/**
 * @page NewPlayerCardPage
 * @description A comprehensive form interface for creating a new golf scorecard in the Open Handicap System.
 * 
 * This page provides users with a detailed form to record all aspects of a golf round:
 * - Course and tee selection with dynamic loading of available options
 * - Play date, weather conditions, and other contextual information
 * - Score entry (both gross/net totals and hole-by-hole details)
 * - Handicap information and calculations
 * - Additional metadata and notes
 * 
 * The form implements robust error handling, data validation, timeout protection for API calls,
 * and user feedback during the submission process. Upon successful creation, it redirects
 * the user to the player cards listing page.
 * 
 * @calledBy
 * - Next.js App Router (when user navigates to /{lang}/player-cards/new)
 * - Player cards list page (via "Add New Card" button)
 * - Dashboard (potentially via quick action links)
 * 
 * @calls
 * - API: GET /api/courses/list-names (to fetch available courses)
 * - API: GET /api/courses/{courseId}/tees (to fetch tees for selected course)
 * - API: POST /api/player-cards (to create the new player card)
 * - Component: ErrorBoundary (for graceful error handling)
 * - Component: Link (for navigation)
 * - Router: useRouter().push() (for redirect after submission)
 * 
 * @requires
 * - Authentication (user must be logged in to record scores)
 * - Backend API endpoints for courses, tees, and player card creation
 * - Course and tee data in the database
 * - Form validation and error handling logic
 *
 * @returns {JSX.Element} The rendered form page for creating a new player card.
 */
export default function NewPlayerCardPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  const [formData, setFormData] = useState<NewPlayerCardData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const [coursesList, setCoursesList] = useState<CourseName[]>([]);
  const [teesList, setTeesList] = useState<TeeType[]>([]);
  const [fetchingCourses, setFetchingCourses] = useState(false);
  const [fetchingTees, setFetchingTees] = useState(false);
  
  // Load dictionary
  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getCommonDictionary(lang);
      setDict(dictionary);
    };
    loadDictionary();
  }, [lang]);
  
  // Use timeout for API calls to prevent hanging
  const fetchWithTimeout = useCallback(async (url: string, options = {}, timeout = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await axios.get(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }, []);
  
  // Fetch courses list on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      setFetchingCourses(true);
      setError(''); // Clear previous errors
      try {
        const response = await fetchWithTimeout('/api/courses/list-names');
        setCoursesList(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again later.');
        } else {
          setError('Failed to load courses list. Please check API and database.');
        }
        setCoursesList([]); // Clear list on error
      } finally {
        setFetchingCourses(false);
      }
    };
    fetchCourses();
  }, [fetchWithTimeout]);

  // Fetch tees list when course_id changes
  useEffect(() => {
    const fetchTees = async () => {
      if (!formData.course_id) {
        setTeesList([]); // Clear tees if no course is selected
        setFormData(prev => ({ ...prev, tee_id: '' })); // Reset tee_id in form
        return;
      }
      setFetchingTees(true);
      setError(''); // Clear previous errors related to tees
      try {
        const response = await fetchWithTimeout(`/api/courses/${formData.course_id}/tees`);
        setTeesList(response.data);
        if (response.data.length > 0 && !response.data.find((tee: TeeType) => tee.tee_id === formData.tee_id)) {
            // Optionally, auto-select the first tee or clear current selection
        }
      } catch (err) {
        console.error('Error fetching tees for course:', formData.course_id, err);
        if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again later.');
        } else {
          setError('Failed to load tees list for the selected course.');
        }
        setTeesList([]); // Clear list on error
      } finally {
        setFetchingTees(false);
      }
    };
    fetchTees();
  }, [formData.course_id, fetchWithTimeout]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, type } = e.target;
    const target = e.target as HTMLInputElement; // Cast for checked property and value for all

    setFormData(prev => {
      if (!prev) return initialFormData; // Return initialFormData instead of null

      const fieldName = name as keyof NewPlayerCardData;

      if (fieldName === 'verified' && type === 'checkbox') {
        return { ...prev, verified: target.checked };
      } else if (type === 'number' || target.dataset.type === 'number-empty') {
        // For fields intended to be numeric (or empty string representing no number)
        const numValue = target.value === '' ? '' : Number(target.value);
        return { ...prev, [fieldName]: numValue }; 
      } else {
        // For all other fields, treat the value as a string
        return { ...prev, [fieldName]: target.value };
      }
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    
    try {
      // Convert empty strings to null for numeric fields
      const processedData = { ...formData };
      
      // Convert string numeric values to actual numbers for API
      for (const [key, value] of Object.entries(processedData)) {
        if (value === '') {
          // @ts-ignore - Dynamic property access
          processedData[key] = null;
        } else if (
          typeof value === 'string' && 
          !isNaN(Number(value)) && 
          key !== 'play_date' && // Don't convert date string
          !key.startsWith('weather') && // Don't convert weather string
          !key.startsWith('day_of_week') && // Don't convert day of week string
          !key.startsWith('post') && // Don't convert post notes
          !key.startsWith('judges') && // Don't convert judges notes
          !key.startsWith('tarj') && // Don't convert status string
          !key.startsWith('category') // Don't convert category string
        ) {
          // @ts-ignore - Dynamic property access
          processedData[key] = Number(value);
        }
      }
      
      // Set player_id from token if not explicitly set
      if (!processedData.player_id) {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            // Implement your JWT decode logic here if needed
            // For now we'll rely on the backend to extract player_id from the token
          } catch (tokenErr) {
            console.error('Token decode error:', tokenErr);
          }
        }
      }
      
      const response = await axios.post('/api/player-cards', processedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setSuccessMessage('Player card created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/${lang}/player-cards`);
      }, 1500);
      
    } catch (err) {
      console.error('Error creating player card:', err);
      
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || err.response?.data?.error || dict?.playerCardNew?.errorPrefix + ' ' + err.message || 'Error: ' + err.message;
        setError(errorMessage);
      } else {
        setError(dict?.playerCardNew?.errorPrefix + ' ' + (err instanceof Error ? err.message : 'Unknown error occurred') || 'Error: Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Helper for rendering hole inputs
  /**
   * @function renderHoleInputs
   * @description A helper function that generates a series of number input fields for hole scores.
   * @param {number} startHole - The starting hole number (e.g., 1 for front nine).
   * @param {number} endHole - The ending hole number (e.g., 9 for front nine).
   * @returns {JSX.Element[]} An array of JSX elements, each representing an input field for a hole.
   */
  const renderHoleInputs = (startHole: number, endHole: number) => {
    const inputs: ReactElement[] = [];
    
    for (let i = startHole; i <= endHole; i++) {
      const holeKey = `h${i.toString().padStart(2, '0')}` as HoleFieldKey;
      inputs.push(
        <div key={holeKey}>
          <label className="block text-gray-700 font-medium mb-1" htmlFor={holeKey}>
            {dict?.playerCardNew?.hole || 'Hole'} {i}
          </label>
          <input
            type="number"
            id={holeKey}
            name={holeKey}
            value={formData[holeKey] ?? ''}
            onChange={handleChange}
            className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            min="1"
            max="15"
            placeholder="-"
          />
        </div>
      );
    }
    
    return inputs;
  };

  // Replace hardcoded text in the ErrorFallback component
  const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
    <div className="text-center p-4 bg-red-50 border border-red-200 rounded-md">
      <h2 className="text-lg font-semibold text-red-800 mb-2">
        {dict?.playerCardNew?.errorPrefix || 'Error:'} {error.message}
      </h2>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        {dict?.playerCardNew?.tryAgain || 'Try again'}
      </button>
    </div>
  );

  if (!dict) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link 
            href={`/${lang}/player-cards`}
            className="text-blue-600 hover:text-blue-800"
          >
            ← {dict.playerCardNew.backToPlayerCards}
          </Link>
          <h1 className="text-2xl font-bold">{dict.playerCardNew.addNewPlayerCard}</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Details */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{dict.playerCardNew.mainDetails}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="course_id">
                  {dict.playerCardNew.course}
                </label>
                <div>
                  {fetchingCourses ? (
                    <p className="text-gray-500 italic">{dict.playerCardNew.loadingCourses}</p>
                  ) : (
                    <select
                      id="course_id"
                      name="course_id"
                      value={formData.course_id}
                      onChange={handleChange}
                      className="form-select w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    >
                      <option value="">{dict.playerCardNew.selectCourse}</option>
                      {coursesList.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                          {course.course_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="play_date">
                  {dict.playerCardNew.playDate}
                </label>
                <input
                  type="date"
                  id="play_date"
                  name="play_date"
                  value={formData.play_date}
                  onChange={handleChange}
                  className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="tee_id">
                  {dict.playerCardNew.tee}
                </label>
                <div>
                  {fetchingTees ? (
                    <p className="text-gray-500 italic">{dict.playerCardNew.loadingTees}</p>
                  ) : !formData.course_id ? (
                    <p className="text-gray-500">{dict.playerCardNew.selectCourseThen}</p>
                  ) : teesList.length === 0 ? (
                    <p className="text-gray-500">{dict.playerCardNew.noTeesAvailable}</p>
                  ) : (
                    <select
                      id="tee_id"
                      name="tee_id"
                      value={formData.tee_id}
                      onChange={handleChange}
                      className="form-select w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    >
                      <option value="">{dict.playerCardNew.selectTee}</option>
                      {teesList.map((tee) => (
                        <option key={tee.tee_id} value={tee.tee_id}>
                          {tee.tee_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Score Details */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{dict.playerCardNew.scoreDetails}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="gross">
                  {dict.playerCardNew.grossScore}
                </label>
                <input
                  type="number"
                  id="gross"
                  name="gross"
                  value={formData.gross}
                  onChange={handleChange}
                  className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                  min="30"
                  max="200"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="net">
                  {dict.playerCardNew.netScore}
                </label>
                <input
                  type="number"
                  id="net"
                  name="net"
                  value={formData.net}
                  onChange={handleChange}
                  className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  min="30"
                  max="200"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="tarj">
                  {dict.playerCardNew.status}
                </label>
                <select
                  id="tarj"
                  name="tarj"
                  value={formData.tarj}
                  onChange={handleChange}
                  className="form-select w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                >
                  <option value="OK">OK</option>
                  <option value="HOLD">HOLD</option>
                  <option value="ERROR">ERROR</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>
            </div>
          </section>
          
          {/* Handicap details section */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{dict.playerCardNew.handicapDetails}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="hcpi">
                  {dict.playerCardNew.hcpi}
                </label>
                <input
                  type="number"
                  id="hcpi"
                  name="hcpi"
                  value={formData.hcpi}
                  onChange={handleChange}
                  className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="hcp">
                  {dict.playerCardNew.hcp}
                </label>
                <input
                  type="number"
                  id="hcp"
                  name="hcp"
                  value={formData.hcp}
                  onChange={handleChange}
                  className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="differential">
                  {dict.playerCardNew.differential}
                </label>
                <input
                  type="number"
                  id="differential"
                  name="differential"
                  value={formData.differential}
                  onChange={handleChange}
                  className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  step="0.1"
                />
              </div>
            </div>
          </section>
          
          {/* Hole Scores section */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{dict.playerCardNew.holeScores}</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">{dict.playerCardNew.frontNine}</h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {renderHoleInputs(1, 9)}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">{dict.playerCardNew.backNine}</h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {renderHoleInputs(10, 18)}
              </div>
            </div>
          </section>
          
          {/* Additional Information section */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{dict.playerCardNew.additionalInformation}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                  {dict.playerCardNew.category}
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="weather">
                  {dict.playerCardNew.weather}
                </label>
                <input
                  type="text"
                  id="weather"
                  name="weather"
                  value={formData.weather}
                  onChange={handleChange}
                  className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="day_of_week">
                  {dict.playerCardNew.dayOfWeek}
                </label>
                <input
                  type="text"
                  id="day_of_week"
                  name="day_of_week"
                  value={formData.day_of_week}
                  onChange={handleChange}
                  className="form-input w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="post">
                  {dict.playerCardNew.postNotes}
                </label>
                <textarea
                  id="post"
                  name="post"
                  value={formData.post}
                  onChange={handleChange}
                  className="form-textarea w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="judges">
                  {dict.playerCardNew.judgesNotes}
                </label>
                <textarea
                  id="judges"
                  name="judges"
                  value={formData.judges}
                  onChange={handleChange}
                  className="form-textarea w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verified"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700" htmlFor="verified">
                  {dict.playerCardNew.verified}
                </label>
              </div>
            </div>
          </section>
          
          <div className="flex justify-end gap-3">
            <Link 
              href={`/${lang}/player-cards`}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              {dict.playerCardNew.cancel}
            </Link>
            <button
              type="submit"
              className={`px-6 py-2 bg-blue-600 text-white rounded-md ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
              disabled={loading}
            >
              {loading ? dict.playerCardNew.creatingCard : dict.playerCardNew.createPlayerCard}
            </button>
          </div>
        </form>
      </div>
    </ErrorBoundary>
  );
} 