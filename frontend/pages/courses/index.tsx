import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface Course {
  course_id: number;
  name: string;
  city: string;
  country: string;
  province_state: string;
}

const countryMap: Record<string, string> = {
  US: '🇺🇸 United States',
  MX: '🇲🇽 Mexico',
  CA: '🇨🇦 Canada',
  GB: '🇬🇧 United Kingdom',
  ES: '🇪🇸 Spain',
  Argentina: '🇦🇷 Argentina',
  other: '🌍 Other'
};

/**
 * @page CoursesPage
 * @description A Next.js page component that displays a list of golf courses from a database.
 * This page is accessible at `/courses`.
 *
 * @remarks
 * - Fetches a list of courses from the `/api/courses` endpoint on component mount.
 * - Manages `courses`, `isLoading`, `error`, and `isAuthenticated` states.
 * - `isAuthenticated` state is determined by checking for a 'token' in `localStorage`.
 * - Displays a loading message while courses are being fetched.
 * - Shows an error message if the API call fails.
 * - If no courses are found:
 *   - If authenticated, prompts the user to "Add your first course" with a link to `/courses/new`.
 *   - If not authenticated, prompts the user to "Sign in to add a new course" with a link to `/login`.
 * - If courses are loaded, displays them in a responsive grid (1, 2, or 3 columns based on screen size).
 * - Each course card shows:
 *   - Course Name (defaults to "Unknown Course").
 *   - City, Province/State, and Country (defaulting to "Unknown ..." if data is missing).
 *   - Course ID.
 *   - A "View Details" button that links to `/courses/[course_id]` for that specific course.
 * - Provides an "Add New Course" button (links to `/courses/new`) if the user is authenticated,
 *   otherwise, it shows a "Log in to add new courses" button (links to `/login`).
 * - Uses `Geist` and `Geist_Mono` fonts.
 * - The `countryMap` constant is defined but not directly used in this component for displaying course cards (it seems intended for more detailed views).
 *
 * Called by:
 * - Next.js routing system when a user navigates to the `/courses` URL.
 *
 * Calls:
 * - React Hooks: `useState`, `useEffect`
 * - `next/link`: `Link` component (for navigation to course details, new course page, or login).
 * - `next/router`: `useRouter` hook (though not directly used for its properties in the current logic, it's imported).
 * - `axios.get` (to fetch course data from `/api/courses`).
 * - `localStorage.getItem` (to check for authentication token).
 *
 * @returns {JSX.Element} The rendered page displaying a list of golf courses or relevant messages.
 */
export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses');
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-[#f8f9fa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8 relative`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#2d6a4f] dark:text-[#4fd1c5]">Golf Course Database</h1>
          {isAuthenticated ? (
            <Link
              href="/courses/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2d6a4f] hover:bg-[#1b4332] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40916c] dark:bg-[#4fd1c5] dark:hover:bg-[#38b2ac] dark:focus:ring-[#38b2ac]"
            >
              Add New Course
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2d6a4f] hover:bg-[#1b4332] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40916c] dark:bg-[#4fd1c5] dark:hover:bg-[#38b2ac] dark:focus:ring-[#38b2ac]"
            >
              Log in to add new courses
            </Link>
          )}
        </div>

        <div className="bg-white dark:bg-[#1a2b41] p-6 rounded-lg mb-8">
          <p className="text-gray-700 dark:text-[#b5ceff] text-lg">
            Browse our comprehensive database of golf courses. Click on a card to view detailed information including tee options, course ratings, and hole-by-hole data.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md mb-6">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-xl font-medium">Loading courses...</div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white dark:bg-[#1a2b41] rounded-lg shadow-md p-6 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">No courses found.</p>
            {isAuthenticated ? (
              <p>
                <Link
                  href="/courses/new"
                  className="text-[#2d6a4f] dark:text-[#4fd1c5] hover:underline"
                >
                  Add your first course
                </Link>
              </p>
            ) : (
              <p>
                <Link
                  href="/login"
                  className="text-[#2d6a4f] dark:text-[#4fd1c5] hover:underline"
                >
                  Sign in
                </Link>
                {' '}to add a new course.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
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
                      href={`/courses/${course.course_id}`}
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
        )}
      </div>
    </div>
  );
}