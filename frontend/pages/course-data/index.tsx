import { NextPage } from 'next';
import CourseCardGrid from '../../components/courses/CourseCardGrid';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * @page CourseDataListPage
 * @description A Next.js page component that displays a list or grid of golf courses.
 * This page is accessible at `/course-data`.
 *
 * @remarks
 * - Renders a main title "Golf Course Database".
 * - Includes a descriptive paragraph inviting users to browse the database and click on cards for details.
 * - Utilizes the `CourseCardGrid` component to fetch and display the actual list of course cards.
 * - Applies `Geist` and `Geist_Mono` fonts to the page.
 * - The primary content (the grid of courses) is delegated to the `CourseCardGrid` component.
 *
 * Called by:
 * - Next.js routing system when a user navigates to the `/course-data` URL.
 *
 * Calls:
 * - `CourseCardGrid` component (to display the list/grid of courses).
 *
 * @returns {NextPage} The rendered page displaying a grid of course cards.
 */
const CourseDataListPage: NextPage = () => {
  return (
    <div className={`${geistSans.className} ${geistMono.className} course-data-page-background min-h-screen bg-[#f8f9fa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8 relative`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#2d6a4f] dark:text-[#4fd1c5] mb-8">
          Golf Course Database
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Browse our comprehensive database of golf courses. Click on a card to view detailed information including 
            tee options, course ratings, and hole-by-hole data.
          </p>
        </div>
        
        <CourseCardGrid />
      </div>
    </div>
  );
};

export default CourseDataListPage; 