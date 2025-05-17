'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import CourseCardGrid from '../../components/courses/CourseCardGrid';

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
 * @description Displays a list of golf courses from a database.
 * This page is accessible at `/[lang]/courses`.
 */
export default function CoursesPage({ params }: { params: { lang: string } }) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Safety check for browser environment
    if (typeof window === 'undefined') return;
    
    try {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    } catch (err) {
      console.error('Error accessing localStorage:', err);
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses');
        // Ensure we always have an array, even if API returns null or undefined
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
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#2d6a4f] dark:text-[#4fd1c5]">Golf Course Database</h1>
          {isAuthenticated ? (
            <Link
              href={`/${params.lang}/courses/new`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2d6a4f] hover:bg-[#1b4332] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40916c] dark:bg-[#4fd1c5] dark:hover:bg-[#38b2ac] dark:focus:ring-[#38b2ac]"
            >
              Add New Course
            </Link>
          ) : (
            <Link
              href={`/${params.lang}/login`}
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

        <CourseCardGrid 
          lang={params.lang}
          courses={courses}
          isLoading={isLoading}
          error={error}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
} 