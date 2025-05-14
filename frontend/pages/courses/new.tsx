import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Geist, Geist_Mono } from "next/font/google";
import CourseInfoSection from '../../components/courses/CourseInfoSection';
import TeeBoxesSection from '../../components/courses/TeeBoxesSection';
import HolesSection from '../../components/courses/HolesSection';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface TeeBox {
  name: string;
  gender: 'male' | 'female' | 'other';
  courseRating: string;
  slopeRating: string;
  yardage: string;
}

interface HoleInfo {
  holeNumber: number;
  par: number;
  strokeIndex: number;
}

/**
 * @page NewCoursePage
 * @description A Next.js page component for submitting new golf course information.
 * This page is accessible at `/courses/new` and requires user authentication.
 *
 * @remarks
 * - **Authentication**: Checks for a `token` in `localStorage` on mount. If not found, redirects to `/login`.
 * - **State Management**: Uses `useState` for:
 *   - `isLoading`, `error`, `success` messages for form submission.
 *   - Course information: `courseName`, `country`, `cityProvince`, `website`.
 *   - `teeBoxes`: An array of tee box objects, initialized with one empty tee box.
 *   - `holes`: An array of 18 hole objects, initialized with default par (4) and stroke index.
 *   - Attachment files: `scorecardFile`, `ratingCertificateFile`, `courseInfoFile` (state and submission logic for these exist; the UI component `AttachmentsSection` has been removed).
 *   - `isConfirmed`: Boolean for the confirmation checkbox.
 * - **Form Sections**: The form is composed of several child components:
 *   - `CourseInfoSection`: For basic course details.
 *   - `TeeBoxesSection`: For managing multiple tee boxes (add, remove, update).
 *   - `HolesSection`: For updating par and stroke index for each of the 18 holes.
 * - **Form Submission (`handleSubmit`):
 *   - Prevents submission if the confirmation checkbox (`isConfirmed`) is not checked.
 *   - Constructs `courseData` object with details from the form state.
 *   - Tee box data (courseRating, slopeRating, yardage) is parsed to numbers (parseFloat/parseInt).
 *   - Retrieves `token` from `localStorage` for authorization.
 *   - Makes a POST request to `/api/courses` with `courseData`.
 *   - If attachments were provided (using `scorecardFile`, `ratingCertificateFile`, `courseInfoFile` states), it makes a subsequent POST request to `/api/courses/:courseId/attachments` with `FormData`.
 *   - Sets `success` message and redirects to `/courses` page after a 2-second delay on successful submission.
 *   - Handles errors from the API, displaying them to the user.
 * - Uses `Geist` and `Geist_Mono` fonts.
 *
 * Called by:
 * - Next.js routing system when a user navigates to `/courses/new`.
 * - Links from other pages (e.g., the main `/courses` page if the user is authenticated).
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`
 * - `next/router`: `useRouter` hook (for navigation/redirection).
 * - `axios.post` (to submit course data and potentially attachments).
 * - `localStorage.getItem` (for authentication token).
 * - Child Components: `CourseInfoSection`, `TeeBoxesSection`, `HolesSection`.
 *
 * @returns {JSX.Element} The rendered new course submission form page.
 */
export default function NewCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Course Info State
  const [courseName, setCourseName] = useState('');
  const [country, setCountry] = useState('');
  const [cityProvince, setCityProvince] = useState('');
  const [website, setWebsite] = useState('');

  // Tee Boxes State
  const [teeBoxes, setTeeBoxes] = useState<TeeBox[]>([
    {
      name: '',
      gender: 'male',
      courseRating: '',
      slopeRating: '',
      yardage: ''
    }
  ]);

  // Holes State
  const [holes, setHoles] = useState<HoleInfo[]>(
    Array.from({ length: 18 }, (_, i) => ({
      holeNumber: i + 1,
      par: 4,
      strokeIndex: i + 1
    }))
  );

  // Attachments State
  const [scorecardFile, setScorecardFile] = useState<File | null>(null);
  const [ratingCertificateFile, setRatingCertificateFile] = useState<File | null>(null);
  const [courseInfoFile, setCourseInfoFile] = useState<File | null>(null);

  // Confirmation
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Check for authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const addTeeBox = () => {
    setTeeBoxes([
      ...teeBoxes,
      {
        name: '',
        gender: 'male',
        courseRating: '',
        slopeRating: '',
        yardage: ''
      }
    ]);
  };

  const removeTeeBox = (index: number) => {
    setTeeBoxes(teeBoxes.filter((_, i) => i !== index));
  };

  const updateTeeBox = (index: number, field: keyof TeeBox, value: string) => {
    const updatedTeeBoxes = [...teeBoxes];
    if (field === 'gender') {
      updatedTeeBoxes[index][field] = value as 'male' | 'female' | 'other';
    } else {
      updatedTeeBoxes[index][field] = value;
    }
    setTeeBoxes(updatedTeeBoxes);
  };

  const updateHole = (holeNumber: number, field: 'par' | 'strokeIndex', value: number) => {
    const updatedHoles = [...holes];
    const index = updatedHoles.findIndex(h => h.holeNumber === holeNumber);
    if (index !== -1) {
      updatedHoles[index][field] = value;
      setHoles(updatedHoles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConfirmed) {
      setError('Please confirm that the data is accurate.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Step 1: Submit course data
      const courseData = {
        name: courseName,
        country,
        cityProvince,
        website: website || null,
        teeBoxes: teeBoxes.map(tee => ({
          name: tee.name,
          gender: tee.gender,
          courseRating: parseFloat(tee.courseRating),
          slopeRating: parseInt(tee.slopeRating),
          yardage: tee.yardage ? parseInt(tee.yardage) : null
        })),
        holes: holes.map(hole => ({
          holeNumber: hole.holeNumber,
          par: hole.par,
          strokeIndex: hole.strokeIndex
        }))
      };

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const courseResponse = await axios.post('/api/courses', courseData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Step 2: Upload attachments if any
      if (scorecardFile || ratingCertificateFile || courseInfoFile) {
        const formData = new FormData();

        if (scorecardFile) {
          formData.append('scorecardUpload', scorecardFile);
        }

        if (ratingCertificateFile) {
          formData.append('ratingCertificateUpload', ratingCertificateFile);
        }

        if (courseInfoFile) {
          formData.append('courseInfoUpload', courseInfoFile);
        }

        await axios.post(`/api/courses/${courseResponse.data.id}/attachments`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      }

      setSuccess('Course successfully submitted!');

      // Reset form
      setTimeout(() => {
        router.push('/courses');
      }, 2000);
    } catch (err: unknown) {
      console.error('Error submitting course:', err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.msg ||
          'Failed to submit course.'
        );
      } else {
        setError('Failed to submit course.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-[#f8f9fa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8 relative`}>
      <div className="max-w-[900px] mx-auto bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md overflow-hidden">
        <header className="bg-[#2d6a4f] text-white p-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Golf Course Submission Form</h1>
        </header>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md m-6">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md m-6">
            <p className="text-sm text-green-800 dark:text-green-400">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <CourseInfoSection
            courseName={courseName}
            setCourseName={setCourseName}
            country={country}
            setCountry={setCountry}
            cityProvince={cityProvince}
            setCityProvince={setCityProvince}
            website={website}
            setWebsite={setWebsite}
          />

          <TeeBoxesSection
            teeBoxes={teeBoxes}
            updateTeeBox={updateTeeBox}
            addTeeBox={addTeeBox}
            removeTeeBox={removeTeeBox}
          />

          <HolesSection
            holes={holes}
            updateHole={updateHole}
          />

          {/* Confirmation Section */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-800">
            <div className="bg-[#f1faee] dark:bg-[#2d3748] p-4 mb-6 -mx-6 flex items-center">
              <span className="text-2xl mr-2">✅</span>
              <h2 className="text-xl font-semibold text-[#2d6a4f] dark:text-white">Confirmation</h2>
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="confirmation"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="mr-3 h-5 w-5 text-[#40916c] dark:text-[#4fd1c5] focus:ring-[#40916c] dark:focus:ring-[#4fd1c5] rounded"
                  required
                />
                <label htmlFor="confirmation" className="font-medium">
                  I confirm this data is accurate to the best of my knowledge.
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2d6a4f] hover:bg-[#1b4332] text-white py-4 px-6 rounded-md text-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit Course Information'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}