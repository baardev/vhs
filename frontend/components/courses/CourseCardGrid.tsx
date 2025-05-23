import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface CourseName {
  course_id: number;
  course_name?: string;
  name?: string; // Allow either name or course_name
  city: string;
  state: string;
  country: string;
}

// Get the base URL for API requests
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

/**
 * @component CourseCardGrid
 * @description Fetches and displays a grid of course cards, allowing users to navigate to detailed course pages.
 *
 * @remarks
 * This component performs the following actions:
 * - On mount, it fetches a list of courses from the `/api/coursesData/course-names` API endpoint.
 * - It manages loading and error states for the API request.
 * - Displays courses in a responsive grid. Each card shows the course name (defaulting to "Unknown Course" if unavailable),
 *   location (city, state, country), and its unique ID.
 * - Each card is clickable and includes a "View Details" button, both of which trigger navigation.
 * - Handles navigation to a specific course page (e.g., `/course-data/[courseId]`) upon user interaction.
 * - Renders appropriate messages for loading state, error occurrences, or when no courses are found.
 *
 * Called by:
 * - [Information needed: Please specify which file/component imports and uses `CourseCardGrid`. Example: `frontend/pages/course-data/index.tsx`]
 *
 * Calls:
 * - React Hooks: `useState` (for managing courses, loading state, and error messages), `useEffect` (for fetching data on mount)
 * - `next/router`: `useRouter` (for programmatic navigation)
 * - `axios.get`: (to make HTTP GET requests to the course names API endpoint)
 * - Internal helper function `getBaseUrl`: (to construct the base URL for API calls)
 * - Internal event handler `handleCardClick`: (to manage navigation when a course card is clicked)
 *
 * @returns {React.FC} The rendered grid of course cards, or a message indicating loading, error, or empty state.
 */
const CourseCardGrid = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const baseUrl = getBaseUrl();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Updated to use the correct API endpoint
        const response = await axios.get(`${baseUrl}/api/coursesData/course-names`);
        console.log('API response:', response.data);
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCardClick = (courseId: number) => {
    router.push(`/course-data/${courseId}`);
  };

  if (loading) return <div className="text-center py-8">Loading courses...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (courses.length === 0) return <div className="text-center py-8">No courses found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div 
          key={course.course_id} 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick(course.course_id)}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {course.course_name || course.name || "Unknown Course"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {course.city}, {course.state}, {course.country}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Course ID: {course.course_id}
              </span>
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(course.course_id);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCardGrid; 