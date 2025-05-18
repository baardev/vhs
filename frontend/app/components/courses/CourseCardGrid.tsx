'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { getCommonDictionary } from '../../dictionaries'; // Import dictionary helper

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
  // Add debugging state to track renders
  const [renderCount, setRenderCount] = useState(0);
  const [dict, setDict] = useState<Record<string, any>>({}); // State for dictionary
  const [dictLoading, setDictLoading] = useState(true); // State for dictionary loading

  // Load dictionary
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setDictLoading(true);
        const commonDict = await getCommonDictionary(lang);
        setDict(commonDict.courseCardGrid || {}); // Assuming keys are under 'courseCardGrid'
      } catch (err) {
        console.error('Error loading dictionary in CourseCardGrid:', err);
        // Fallback or default strings could be set here if needed
        setDict({}); // Set to empty to avoid undefined errors, rely on default text in render
      } finally {
        setDictLoading(false);
      }
    };
    if (lang) {
      loadDictionary();
    }
  }, [lang]);

  // Debug effects
  useEffect(() => {
    // Log when component receives new props
    console.log('CourseCardGrid PROPS received:', { 
      propCourses: propCourses?.length || 0, 
      propIsLoading, 
      propError,
      lang
    });
  }, [propCourses, propIsLoading, propError, lang]);

  // Initialize renderCount only once on mount
  useEffect(() => {
    setRenderCount(1);
  }, []);

  // Increment render count only when key props change
  useEffect(() => {
    if (renderCount > 0) { // Only increment after initial render
      setRenderCount(prev => prev + 1);
    }
  }, [propCourses, propIsLoading, propError]); // Only update on prop changes

  useEffect(() => {
    // Log state changes without incrementing renderCount
    console.log('CourseCardGrid STATE updated:', { 
      coursesLength: courses.length,
      isLoading,
      error,
      renderCount
    });
    // Removed setRenderCount to prevent infinite loops
  }, [courses, isLoading, error, renderCount]);

  // Monitor parent prop changes and update local state
  useEffect(() => {
    console.log('propCourses changed:', propCourses?.length || 0, 'items');
    if (propCourses !== undefined) {
      setCourses(propCourses);
    }
  }, [propCourses]);
  
  useEffect(() => {
    if (propIsLoading !== undefined) {
      setIsLoading(propIsLoading);
    }
  }, [propIsLoading]);

  // Only fetch courses if they weren't provided via props
  useEffect(() => {
    if (propCourses !== undefined) {
      console.log('Skipping fetch - using provided courses');
      return; // Skip fetching if courses are provided via props
    }

    const fetchCourses = async () => {
      try {
        console.log('CourseCardGrid fetching courses from API...');
        // Add a cache buster to prevent caching
        const response = await axios.get(`/api/courses?ts=${Date.now()}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        console.log('CourseCardGrid API response:', response);
        if (Array.isArray(response.data)) {
          console.log('CourseCardGrid setting courses:', response.data.length, 'items');
          setCourses(response.data);
        } else {
          console.error('API returned non-array data:', response.data);
          setCourses([]);
          setError(dict.invalidDataFormat || 'Invalid data format received from server.');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(dict.failedToLoadCourses || 'Failed to load courses. Please try again later.');
      } finally {
        console.log('CourseCardGrid setting isLoading to false');
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [propCourses]);

  // Ensure courses is always an array
  const safeCourses = Array.isArray(courses) ? courses : [];
  
  console.log('CourseCardGrid RENDER state:', { 
    isLoading, 
    hasError: !!error, 
    coursesCount: safeCourses.length,
    renderCount
  });

  if (isLoading || dictLoading) { // Also wait for dictionary
    return (
      <div className="text-center py-12">
        <div className="text-xl font-medium">{dict.loadingCourses || 'Loading courses...'}</div>
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
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{dict.noCoursesFound || 'No courses found.'}</p>
        {isAuthenticated ? (
          <p>
            <Link
              href={`/${lang}/courses/new`}
              className="text-[#2d6a4f] dark:text-[#4fd1c5] hover:underline"
            >
              {dict.addFirstCourse || 'Add your first course'}
            </Link>
          </p>
        ) : (
          <p>
            <Link
              href={`/${lang}/login`}
              className="text-[#2d6a4f] dark:text-[#4fd1c5] hover:underline"
            >
              {dict.signIn || 'Sign in'}
            </Link>
            {' '}{dict.toAddNewCourse || 'to add a new course.'}
          </p>
        )}
      </div>
    );
  }

  // This is what should display the courses
  console.log('CourseCardGrid rendering grid with courses:', safeCourses.map(c => c.course_id));

  return (
    <div>
      {/* Removed debug div */}
      {/* 
      <div className="mb-4 p-2 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 rounded">
        Debug: Loaded {safeCourses.length} courses | Loading: {isLoading ? 'Yes' : 'No'} | Render #{renderCount}
      </div>
      */}
      
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeCourses.map((course) => (
        <div
          key={course.course_id}
          className="bg-white dark:bg-[#1a2b41] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
        >
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white truncate">
              {course.name || dict.unknownCourse || "Unknown Course"}
            </h2>
            <div className="flex items-center mt-2 text-gray-500 dark:text-[#b5ceff]">
              <span>{course.city || dict.unknownCity || "Unknown City"}, {course.province_state || dict.unknownProvince || "Unknown Province"}, {course.country || dict.unknownCountry || "Unknown Country"}</span>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {dict.courseIdLabel || "Course ID:"} {course.course_id}
              </div>
              <Link 
                href={`/${lang}/courses/${course.course_id}`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#2d6a4f] hover:bg-[#1b4332] dark:bg-[#00cc7e] dark:hover:bg-[#00aa69] rounded-md"
                onClick={(e) => e.stopPropagation()}
              >
                {dict.viewDetails || 'View Details'}
              </Link>
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default CourseCardGrid; 