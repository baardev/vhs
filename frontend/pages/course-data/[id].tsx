import { useRouter } from 'next/router';
import { NextPage } from 'next';
import CourseDataDetail from '../../components/courses/CourseDataDetail';
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
 * @page CourseDataPage
 * @description A dynamic Next.js page component that displays detailed information for a specific golf course.
 * The page path is `/course-data/[id]`, where `[id]` is the unique identifier for the course.
 *
 * @remarks
 * - Uses `useRouter` from `next/router` to access the dynamic `id` parameter from the URL query.
 * - Parses the `id` string into an integer `courseId`. If `id` is not present or invalid, `courseId` defaults to `0`,
 *   which typically results in a loading or not-found state within the `CourseDataDetail` component.
 * - Conditionally renders the `CourseDataDetail` component, passing the `courseId` as a prop, if `courseId` is truthy.
 * - If `courseId` is falsy (e.g., during initial render before router is ready, or if `id` is invalid resulting in `0`),
 *   it displays a "Loading course data..." message.
 * - Applies `Geist` and `Geist_Mono` fonts to the page.
 * - The actual data fetching and display logic for the course details are handled by the `CourseDataDetail` component.
 *
 * Called by:
 * - Next.js routing system when a user navigates to a URL matching `/course-data/[some_id]` (e.g., `/course-data/123`).
 *
 * Calls:
 * - `next/router`: `useRouter` hook (to get the `id` from the URL path).
 * - `CourseDataDetail` component (to display the specific course data).
 * - `parseInt` (to convert the route parameter `id` to a number).
 *
 * @returns {NextPage} The rendered page displaying course details or a loading message.
 */
const CourseDataPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const courseId = id ? parseInt(id as string, 10) : 0;

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-[#f8f9fa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8 relative`}>
      <div className="max-w-7xl mx-auto">
        {courseId ? (
          <CourseDataDetail courseId={courseId} />
        ) : (
          <div className="text-center py-12">
            <div className="text-xl font-medium">Loading course data...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDataPage; 