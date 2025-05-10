import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Interface for the PlayerCard data - can be shared or imported if defined elsewhere
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

interface CourseName {
  course_id: number | string; // Match the type from your backend
  course_name: string;
}

interface TeeType {
  tee_id: string; // Match the type from your backend (e.g., VARCHAR or an ID)
  tee_name: string; // Or tee_color, based on what you want to display
}

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

const NewPlayerCardPage = () => {
  const [formData, setFormData] = useState<NewPlayerCardData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const [coursesList, setCoursesList] = useState<CourseName[]>([]);
  const [teesList, setTeesList] = useState<TeeType[]>([]);
  const [fetchingCourses, setFetchingCourses] = useState(false);
  const [fetchingTees, setFetchingTees] = useState(false);

  // TODO: Fetch current logged-in player_id and set it
  useEffect(() => {
    // const currentUserId = getCurrentUserId(); // Replace with actual auth logic
    // For now, let's assume a placeholder or that it will be handled by backend if not sent
    // setFormData(prev => ({ ...prev, player_id: currentUserId })); 
    // If player_id is determined by the backend based on session, no need to set it here.
    // For this example, let's assume it might be sent, or the backend handles it.
    // If removing from form, ensure your backend can get it or it's not strictly needed from client.
  }, []);

  // Fetch courses list on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      setFetchingCourses(true);
      try {
        // Replace with your actual API endpoint for course names
        // const response = await axios.get('/api/courses/names'); 
        // setCoursesList(response.data);
        // STUBBED DATA for now:
        setCoursesList([
          { course_id: 1, course_name: 'Sample Course Alpha' },
          { course_id: 2, course_name: 'Sample Course Beta' },
          { course_id: 'C3', course_name: 'Sample Course Charlie (ID as string)' },
        ]);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses list.');
      } finally {
        setFetchingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch tees list when course_id changes
  useEffect(() => {
    const fetchTees = async () => {
      if (!formData.course_id) {
        setTeesList([]); // Clear tees if no course is selected
        setFormData(prev => ({ ...prev, tee_id: '' })); // Reset tee_id in form
        return;
      }
      setFetchingTees(true);
      try {
        // Replace with your actual API endpoint for tees by courseId
        // const response = await axios.get(`/api/courses/${formData.course_id}/tees`);
        // setTeesList(response.data);
        // STUBBED DATA for now:
        if (formData.course_id === '1') {
            setTeesList([
                { tee_id: 'T1A', tee_name: 'Blue Tees (Course 1)' }, 
                { tee_id: 'T1B', tee_name: 'Red Tees (Course 1)' }
            ]);
        } else if (formData.course_id === '2') {
            setTeesList([
                { tee_id: 'T2X', tee_name: 'Championship (Course 2)' }, 
                { tee_id: 'T2Y', tee_name: 'Forward (Course 2)' }
            ]);
        } else {
             setTeesList([{tee_id: 'DEFAULT', tee_name: 'Default Tee'}]); // Fallback or for other courses
        }
      } catch (err) {
        console.error('Error fetching tees:', err);
        setError('Failed to load tees list for the selected course.');
        setTeesList([]);
      } finally {
        setFetchingTees(false);
      }
    };
    fetchTees();
  }, [formData.course_id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, type } = e.target;
    const target = e.target as HTMLInputElement; // Cast for checked property and value for all

    setFormData(prev => {
      if (!prev) return null; // Should ideally not happen

      const fieldName = name as keyof NewPlayerCardData;

      if (fieldName === 'verified' && type === 'checkbox') {
        return { ...prev, verified: target.checked };
      } else if (type === 'number' || target.dataset.type === 'number-empty') {
        // For fields intended to be numeric (or empty string representing no number)
        const numValue = target.value === '' ? '' : Number(target.value);
        // We need to assure TypeScript that fieldName here corresponds to a field that can accept number | string
        // This is implicitly handled if NewPlayerCardData types are like `h01?: number | string;`
        return { ...prev, [fieldName]: numValue }; 
      } else {
        // For all other fields, treat the value as a string
        // This is implicitly handled if NewPlayerCardData types are like `weather?: string;`
        return { ...prev, [fieldName]: target.value };
      }
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Basic frontend validation example (can be expanded)
    if (!formData.player_id || !formData.play_date || !formData.course_id || !formData.gross || !formData.tee_id) {
      setError('Player ID, Play Date, Course ID, Gross Score, and Tee ID are required.');
      setLoading(false);
      return;
    }
    
    // Prepare data for API (convert empty strings for numbers to null or handle as needed by backend)
    const dataToSubmit: any = {};
    for (const key in formData) {
      const fieldKey = key as keyof NewPlayerCardData;
      if (formData[fieldKey] === '' && typeof initialFormData[fieldKey] === 'number') {
        dataToSubmit[fieldKey] = null; // Or omit, depending on backend handling for optional numbers
      } else {
        dataToSubmit[fieldKey] = formData[fieldKey];
      }
    }
    if (dataToSubmit.differential === '') dataToSubmit.differential = null;
    if (dataToSubmit.hcpi === '') dataToSubmit.hcpi = null;
    if (dataToSubmit.hcp === '') dataToSubmit.hcp = null;
    // ... and so on for all numeric fields that can be empty

    try {
      console.log('Submitting new player card:', dataToSubmit);
      const response = await axios.post('/api/player-cards', dataToSubmit);
      setSuccessMessage('Player card created successfully! Redirecting...');
      setFormData(initialFormData); // Reset form
      setTimeout(() => {
        router.push('/player-cards'); // Redirect to list page or response.data.id for detail
      }, 2000);
    } catch (err) {
      console.error('Error creating player card:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`Failed to create player card: ${err.response.data.error || err.message}`);
      } else {
        setError('Failed to create player card. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Helper for rendering hole inputs
  const renderHoleInputs = (startHole: number, endHole: number) => {
    const inputs = [];
    for (let i = startHole; i <= endHole; i++) {
      const holeKey = `h${String(i).padStart(2, '0')}` as keyof NewPlayerCardData;
      inputs.push(
        <div key={holeKey} className="mb-2">
          <label htmlFor={holeKey} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hole {i}:</label>
          <input
            type="number"
            id={holeKey}
            name={holeKey}
            value={formData[holeKey] ?? ''}
            onChange={handleChange}
            data-type="number-empty"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
      );
    }
    return inputs;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/player-cards" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
            &larr; Back to Player Cards List
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Add New Player Card</h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 space-y-6">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">Error: {error}</div>}
          {successMessage && <div className="p-3 bg-green-100 text-green-700 rounded-md">{successMessage}</div>}

          {/* Main Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Course*</label>
              <select 
                name="course_id" 
                id="course_id" 
                value={formData.course_id} 
                onChange={handleChange} 
                required 
                className="mt-1 input-field"
                disabled={fetchingCourses}
              >
                <option value="">{fetchingCourses ? 'Loading courses...' : 'Select a Course'}</option>
                {coursesList.map(course => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="play_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Play Date*</label>
              <input type="date" name="play_date" id="play_date" value={formData.play_date} onChange={handleChange} required className="mt-1 input-field" />
            </div>
             <div>
              <label htmlFor="tee_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tee*</label>
              <select 
                name="tee_id" 
                id="tee_id" 
                value={formData.tee_id} 
                onChange={handleChange} 
                required 
                className="mt-1 input-field"
                disabled={fetchingTees || !formData.course_id || teesList.length === 0}
              >
                <option value="">
                  {fetchingTees ? 'Loading tees...' : 
                   !formData.course_id ? 'Select a course first' : 
                   teesList.length === 0 ? 'No tees available' :
                   'Select a Tee'}
                </option>
                {teesList.map(tee => (
                  <option key={tee.tee_id} value={tee.tee_id}>
                    {tee.tee_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Score Details Section */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-900 dark:text-white px-2">Score Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
              <div>
                <label htmlFor="gross" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gross Score*</label>
                <input type="number" name="gross" id="gross" value={formData.gross} onChange={handleChange} required className="mt-1 input-field" />
              </div>
              <div>
                <label htmlFor="net" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Net Score</label>
                <input type="number" name="net" id="net" value={formData.net ?? ''} data-type="number-empty" onChange={handleChange} className="mt-1 input-field" />
              </div>
              <div>
                <label htmlFor="tarj" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status (Tarj)*</label>
                <select name="tarj" id="tarj" value={formData.tarj} onChange={handleChange} required className="mt-1 input-field">
                  <option value="OK">OK</option>
                  <option value="NPT">NPT</option>
                  <option value="ERR">ERR</option>
                  {/* Add other relevant statuses */}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Handicap Details Section */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-900 dark:text-white px-2">Handicap Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
              <div>
                <label htmlFor="hcpi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">HCPI</label>
                <input type="number" step="0.1" name="hcpi" id="hcpi" value={formData.hcpi ?? ''} data-type="number-empty" onChange={handleChange} className="mt-1 input-field" />
              </div>
              <div>
                <label htmlFor="hcp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">HCP</label>
                <input type="number" step="0.1" name="hcp" id="hcp" value={formData.hcp ?? ''} data-type="number-empty" onChange={handleChange} className="mt-1 input-field" />
              </div>
              <div>
                <label htmlFor="differential" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Differential</label>
                <input type="number" step="0.1" name="differential" id="differential" value={formData.differential ?? ''} data-type="number-empty" onChange={handleChange} className="mt-1 input-field" />
              </div>
            </div>
          </fieldset>
          
          {/* Hole Scores Section */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-900 dark:text-white px-2">Hole-by-Hole Scores</legend>
            <div className="mt-2">
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Front Nine</h4>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-2">
                {renderHoleInputs(1, 9)}
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Back Nine</h4>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-2">
                {renderHoleInputs(10, 18)}
              </div>
            </div>
          </fieldset>

          {/* Additional Information Section */}
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-900 dark:text-white px-2">Additional Information</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
               <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <input type="text" name="category" id="category" value={formData.category ?? ''} onChange={handleChange} className="mt-1 input-field" />
              </div>
              <div>
                <label htmlFor="weather" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weather</label>
                <input type="text" name="weather" id="weather" value={formData.weather ?? ''} onChange={handleChange} className="mt-1 input-field" />
              </div>
              <div>
                <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Day of Week</label>
                <input type="text" name="day_of_week" id="day_of_week" value={formData.day_of_week ?? ''} onChange={handleChange} className="mt-1 input-field" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="post" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Post Notes</label>
                <textarea name="post" id="post" value={formData.post ?? ''} onChange={handleChange} rows={3} className="mt-1 input-field"></textarea>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="judges" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Judges Notes</label>
                <textarea name="judges" id="judges" value={formData.judges ?? ''} onChange={handleChange} rows={3} className="mt-1 input-field"></textarea>
              </div>
               <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input id="verified" name="verified" type="checkbox" checked={formData.verified} onChange={handleChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="verified" className="font-medium text-gray-700 dark:text-gray-300">Verified</label>
                </div>
              </div>
            </div>
          </fieldset>

          <div className="pt-5">
            <div className="flex justify-end">
              <Link href="/player-cards" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mr-3 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              >
                {loading ? 'Creating Card...' : 'Create Player Card'}
              </button>
            </div>
          </div>
        </form>
      </div>
      <style jsx>{`
        .input-field {
          display: block;
          width: 100%;
          padding: 0.5rem;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db; /* gray-300 */
        }
        .dark .input-field {
          background-color: #374151; /* gray-700 */
          border-color: #4b5563; /* gray-600 */
          color: white;
        }
        .input-field:focus {
          outline: none;
          --tw-ring-color: #6366f1; /* indigo-500 */
          border-color: #6366f1; /* indigo-500 */
          box-shadow: 0 0 0 3px var(--tw-ring-color);
        }
      `}</style>
    </div>
  );
};

export default NewPlayerCardPage; 