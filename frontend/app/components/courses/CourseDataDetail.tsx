'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { getCommonDictionary } from '../../dictionaries';

interface CourseData {
  id: number;
  course_id: number;
  tee_name: string;
  gender: string;
  par: number;
  course_rating: number;
  slope_rating: number;
  length: number | null;
  par_h01?: number;
  par_h02?: number;
  par_h03?: number;
  par_h04?: number;
  par_h05?: number;
  par_h06?: number;
  par_h07?: number;
  par_h08?: number;
  par_h09?: number;
  par_h10?: number;
  par_h11?: number;
  par_h12?: number;
  par_h13?: number;
  par_h14?: number;
  par_h15?: number;
  par_h16?: number;
  par_h17?: number;
  par_h18?: number;
}

interface CourseName {
  id?: number;
  course_id: number;
  course_name?: string;
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  province_state?: string;
  province_name?: string;
  country_name?: string;
}

interface CourseDataDetailProps {
  courseId: number;
  lang: string; // Added lang parameter for proper navigation
}

// Get the base URL for API requests
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

/**
 * @component CourseDataDetail
 * @description Fetches and displays detailed information for a specific course, including its name, location, and tee-specific data (summary and hole-by-hole pars).
 * @param {CourseDataDetailProps} props - The props for the component.
 * @param {number} props.courseId - The unique identifier of the course to display details for.
 * @param {string} props.lang - The current language code for localized routes.
 *
 * @remarks
 * This component performs the following actions:
 * - On mount, or when `courseId` prop changes, it fetches:
 *   - The course name and location details from `/api/coursesData/course-names/:courseId`.
 *   - The tee-specific data (including hole-by-hole pars) from `/api/coursesData/normalized-holes/:courseId`.
 * - Manages loading and error states for these API requests.
 * - Displays a header with the course name, location, and a "Back to Courses" link.
 * - If tee data is available, it shows a summary table with tee name, gender, total par, course rating, slope rating, and length.
 * - It then displays detailed hole-by-hole par information for each tee, broken down into front nine, back nine, and total.
 * - Includes a helper function `calculateTotalPar` to sum up pars for front nine, back nine, and the total 18 holes, with a fallback if hole-by-hole data isn't present.
 * - Renders appropriate messages for loading, error, or if the course/tee data is not found.
 *
 * Called by:
 * - `frontend/app/[lang]/courses/[id]/page.tsx` (which gets the `courseId` from the route parameter)
 *
 * Calls:
 * - React Hooks: `useState` (for managing course data, name, loading state, and error messages), `useEffect` (for fetching data)
 * - `axios.get`: (to make HTTP GET requests to the course names and normalized holes API endpoints)
 * - `next/link`'s `Link` component (for the "Back to Courses" navigation)
 * - Internal helper function `getBaseUrl`: (to construct the base URL for API calls)
 * - Internal helper function `calculateTotalPar`: (to compute par sums for display)
 *
 * @returns {React.FC<CourseDataDetailProps>} The rendered detailed view of a course, or a message indicating loading, error, or not found state.
 */
const CourseDataDetail: React.FC<CourseDataDetailProps> = ({ courseId, lang }) => {
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [courseName, setCourseName] = useState<CourseName | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dict, setDict] = useState<Record<string, any>>({});
  const baseUrl = getBaseUrl();

  // Load dictionary
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dictionary = await getCommonDictionary(lang);
        setDict(dictionary);
      } catch (err) {
        console.error('Error loading dictionary in CourseDataDetail:', err);
      }
    };
    
    loadDictionary();
  }, [lang]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        // Fetch course name
        const nameResponse = await axios.get(`${baseUrl}/api/coursesData/course-names/${courseId}`);
        console.log('Course name response:', nameResponse.data);
        setCourseName(nameResponse.data);
        
        // Use normalized-holes endpoint which provides both tee and hole data
        const dataResponse = await axios.get(`${baseUrl}/api/coursesData/normalized-holes/${courseId}`);
        console.log('Normalized hole data response:', dataResponse.data);
        setCourseData(dataResponse.data);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError(dict.courseDetail?.loading || 'Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, dict]);

  if (loading) return <div className="text-center py-8">{dict.courseDetail?.loading || 'Loading course data...'}</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!courseName) return <div className="text-center py-8">{dict.courseDetail?.courseNotFound || 'Course not found'}</div>;

  // Calculate total front nine, back nine, and overall pars
  const calculateTotalPar = (teeData: CourseData) => {
    // If the hole-by-hole data is not available, use the total par from the tee data
    if (!teeData.par_h01) {
      return {
        frontNine: Math.floor(teeData.par / 2),
        backNine: Math.ceil(teeData.par / 2),
        total: teeData.par
      };
    }

    // Fix for linter errors: using Number() to ensure we get 0 instead of undefined
    // when accessing potentially undefined properties
    const frontNine = [
      Number(teeData.par_h01 || 0), Number(teeData.par_h02 || 0), Number(teeData.par_h03 || 0), 
      Number(teeData.par_h04 || 0), Number(teeData.par_h05 || 0), Number(teeData.par_h06 || 0), 
      Number(teeData.par_h07 || 0), Number(teeData.par_h08 || 0), Number(teeData.par_h09 || 0)
    ].reduce((sum, par) => sum + par, 0);
    
    const backNine = [
      Number(teeData.par_h10 || 0), Number(teeData.par_h11 || 0), Number(teeData.par_h12 || 0), 
      Number(teeData.par_h13 || 0), Number(teeData.par_h14 || 0), Number(teeData.par_h15 || 0), 
      Number(teeData.par_h16 || 0), Number(teeData.par_h17 || 0), Number(teeData.par_h18 || 0)
    ].reduce((sum, par) => sum + par, 0);
    
    return {
      frontNine,
      backNine,
      total: frontNine + backNine
    };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Course Header */}
      <div className="bg-green-700 dark:bg-green-800 p-6 text-white">
        <div className="mb-4">
          <Link href={`/${lang}/courses`} className="text-white hover:underline">
            &larr; {dict.courseDetail?.backToCourses || 'Back to Courses'}
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-2">{courseName.course_name || courseName.name}</h1>
        <p>
          {courseName.city || (courseName.course_name && courseName.course_name.split(' - ')[0]) || dict.courseDetail?.unknownCity || 'Unknown City'}, 
          {courseName.state || courseName.province_name || dict.courseDetail?.defaultProvince || 'Buenos Aires Province'}, 
          {courseName.country || courseName.country_name || dict.courseDetail?.defaultCountry || 'Argentina'}
        </p>
      </div>

      {/* Tee Data Section */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{dict.courseDetail?.teeInformation || 'Tee Information'}</h2>
        
        {courseData.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">{dict.courseDetail?.noTeeData || 'No tee data available for this course.'}</p>
        ) : (
          <>
            {/* Tee Summary Table */}
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {dict.courseDetail?.teeName || 'Tee Name'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {dict.courseDetail?.gender || 'Gender'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {dict.courseDetail?.par || 'Par'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {dict.courseDetail?.courseRating || 'Course Rating'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {dict.courseDetail?.slopeRating || 'Slope Rating'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {dict.courseDetail?.lengthYards || 'Length (Yards)'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {courseData.map((tee) => (
                    <tr key={tee.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {tee.tee_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {tee.gender === 'M' ? (dict.courseDetail?.male || 'Male') : 
                          tee.gender === 'F' ? (dict.courseDetail?.female || 'Female') : 
                          (dict.courseDetail?.other || 'Other')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {tee.par}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {tee.course_rating && typeof tee.course_rating === 'number' 
                          ? tee.course_rating.toFixed(1) 
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {tee.slope_rating}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {tee.length?.toLocaleString() || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Hole-by-Hole Section */}
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{dict.courseDetail?.holeByHole || 'Hole-by-Hole Information'}</h2>
            
            {courseData.map((tee) => {
              const pars = calculateTotalPar(tee);
              return (
                <div key={`holes-${tee.id}`} className="mb-8">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                    {tee.tee_name} {dict.courseDetail?.teesSuffix || 'Tees'}
                  </h3>
                  
                  {/* Front Nine */}
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r">
                            {dict.courseDetail?.hole || 'Hole'}
                          </th>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <th key={num} className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r">
                              {num}
                            </th>
                          ))}
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {dict.courseDetail?.out || 'OUT'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white dark:bg-gray-800">
                          <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white border-r">
                            {dict.courseDetail?.par || 'Par'}
                          </td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h01 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h02 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h03 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h04 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h05 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h06 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h07 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h08 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h09 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm font-medium text-gray-900 dark:text-white">
                            {pars.frontNine || '-'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Back Nine */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r">
                            {dict.courseDetail?.hole || 'Hole'}
                          </th>
                          {[10, 11, 12, 13, 14, 15, 16, 17, 18].map(num => (
                            <th key={num} className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r">
                              {num}
                            </th>
                          ))}
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-r">
                            {dict.courseDetail?.in || 'IN'}
                          </th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {dict.courseDetail?.total || 'TOTAL'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white dark:bg-gray-800">
                          <td className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white border-r">
                            {dict.courseDetail?.par || 'Par'}
                          </td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h10 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h11 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h12 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h13 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h14 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h15 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h16 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h17 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm text-gray-500 dark:text-gray-300 border-r">{tee.par_h18 || '-'}</td>
                          <td className="px-3 py-2 text-center text-sm font-medium text-gray-900 dark:text-white border-r">
                            {pars.backNine || '-'}
                          </td>
                          <td className="px-3 py-2 text-center text-sm font-medium text-gray-900 dark:text-white">
                            {pars.total || '-'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDataDetail; 