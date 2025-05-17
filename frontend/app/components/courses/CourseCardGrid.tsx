'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

interface Course {
  course_id: number;
  name: string;
  city: string;
  country: string;
  province_state: string;
}

/**
 * @interface CourseCardGridProps
 * @description Props for the CourseCardGrid component
 * @property {string} lang - The current language code from the URL
 * @property {Course[]} [courses] - Optional pre-fetched courses (if not provided, component fetches them)
 * @property {boolean} [isLoading] - Optional loading state (if not provided, component manages its own)
 * @property {string} [error] - Optional error state (if not provided, component manages its own)
 * @property {boolean} [isAuthenticated] - Optional authentication state for displaying proper actions
 */
interface CourseCardGridProps {
  lang: string;
  courses?: Course[];
  isLoading?: boolean;
  error?: string;
  isAuthenticated?: boolean;
}

/**
 * @component CourseCardGrid
 * @description Displays a grid of course cards, allowing users to navigate to detailed course pages.
 *
 * @remarks
 * This component performs the following actions:
 * - If courses are not provided via props, it fetches a list of courses from the API
 * - Displays courses in a responsive grid with course details
 * - Provides links to view course details that respect the current language
 * - Handles states for loading, errors, and empty results
 *
 * @param {CourseCardGridProps} props - Component props
 * @returns {JSX.Element} The rendered grid of course cards
 */
const CourseCardGrid: React.FC<CourseCardGridProps> = ({ 
  lang, 
  courses: propCourses,
  isLoading: propIsLoading,
  error: propError,
  isAuthenticated
}) => {
  // Internal state for courses if not provided via props
  const [courses, setCourses] = useState<Course[]>(propCourses || []);
  const [isLoading, setIsLoading] = useState(propIsLoading !== undefined ? propIsLoading : true);
  const [error, setError] = useState(propError || '');

  // Only fetch courses if they weren't provided via props
  useEffect(() => {
    if (propCourses !== undefined) {
      return; // Skip fetching if courses are provided via props
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses');
        if (Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          console.error('API returned non-array data:', response.data);
          setCourses([]);
          setError('Invalid data format received from server.');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [propCourses]);

  // Ensure courses is always an array
  const safeCourses = Array.isArray(courses) ? courses : [];

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl font-medium">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md mb-6">
        <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (safeCourses.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1a2b41] rounded-lg shadow-md p-6 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">No courses found.</p>
        {isAuthenticated ? (
          <p>
            <Link
              href={`/${lang}/courses/new`}
              className="text-[#2d6a4f] dark:text-[#4fd1c5] hover:underline"
            >
              Add your first course
            </Link>
          </p>
        ) : (
          <p>
            <Link
              href={`/${lang}/login`}
              className="text-[#2d6a4f] dark:text-[#4fd1c5] hover:underline"
            >
              Sign in
            </Link>
            {' '}to add a new course.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeCourses.map((course) => (
        <div
          key={course.course_id}
          className="bg-white dark:bg-[#1a2b41] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
        >
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white truncate">
              {course.name || "Unknown Course"}
            </h2>
            <div className="flex items-center mt-2 text-gray-500 dark:text-[#b5ceff]">
              <span>{course.city || "Unknown City"}, {course.province_state || "Unknown Province"}, {course.country || "Unknown Country"}</span>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Course ID: {course.course_id}
              </div>
              <Link 
                href={`/${lang}/courses/${course.course_id}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#2d6a4f] hover:bg-[#1b4332] dark:bg-[#00cc7e] dark:hover:bg-[#00aa69] rounded-md"
                onClick={(e) => e.stopPropagation()}
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseCardGrid; 