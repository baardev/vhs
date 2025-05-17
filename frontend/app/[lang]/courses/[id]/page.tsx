'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface TeeBox {
  id: number;
  name: string;
  gender: 'male' | 'female' | 'other';
  course_rating: number;
  slope_rating: number;
  yardage: number | null;
}

interface HoleInfo {
  hole_number: number;
  par: number;
  stroke_index: number;
}

interface Attachment {
  id: number;
  attachment_type: string;
  file_path: string;
  original_filename: string;
}

interface Course {
  id: number;
  name: string;
  country: string;
  city_province: string;
  website: string | null;
  created_at: string;
  tee_boxes: TeeBox[];
  holes: HoleInfo[];
  attachments: Attachment[];
}

/**
 * Maps country codes to displayable strings including flag emoji and country name.
 */
const countryMap: Record<string, string> = {
  US: '🇺🇸 United States',
  MX: '🇲🇽 Mexico',
  CA: '🇨🇦 Canada',
  GB: '🇬🇧 United Kingdom',
  ES: '🇪🇸 Spain',
  other: '🌍 Other'
};

/**
 * Maps gender keys to displayable labels.
 */
const genderLabel: Record<string, string> = {
  'male': 'Men',
  'female': 'Women',
  'other': 'Other / Mixed'
};

/**
 * @page CourseDetail
 * @description Displays comprehensive details for a specific golf course.
 */
export default function CourseDetail({ params }: { params: { id: string, lang: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params.id) return;

    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/courses/${params.id}`);
        setCourse(response.data);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#111]">
        <div className="text-xl font-medium">Loading course details...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Error</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{error || 'Course not found'}</p>
          <Link
            href={`/${params.lang}/courses`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2d6a4f] hover:bg-[#1b4332] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40916c] dark:bg-[#4fd1c5] dark:hover:bg-[#38b2ac] dark:focus:ring-[#38b2ac]"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const frontNine = course.holes.filter(hole => hole.hole_number <= 9);
  const backNine = course.holes.filter(hole => hole.hole_number > 9);

  const frontNinePar = frontNine.reduce((total, hole) => total + hole.par, 0);
  const backNinePar = backNine.reduce((total, hole) => total + hole.par, 0);
  const totalPar = frontNinePar + backNinePar;

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/${params.lang}/courses`}
            className="inline-flex items-center text-[#2d6a4f] dark:text-[#4fd1c5] hover:underline"
          >
            ← Back to Courses
          </Link>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md overflow-hidden mb-10">
          <div className="bg-[#2d6a4f] dark:bg-[#2d3748] px-6 py-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{course.name}</h1>
            <div className="flex flex-wrap items-center mt-2 text-[#d8f3dc] dark:text-gray-300">
              <span className="mr-6 text-sm">{countryMap[course.country] || countryMap.other}</span>
              <span className="text-sm">{course.city_province}</span>
            </div>
          </div>

          {course.website && (
            <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
              <a
                href={course.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#40916c] dark:text-[#4fd1c5] hover:underline"
              >
                {course.website}
              </a>
            </div>
          )}

          {/* Tee Boxes Section */}
          <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-[#2d6a4f] dark:text-[#4fd1c5] mb-4">
              Tee Information
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-left bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      Tee Name
                    </th>
                    <th className="p-2 text-left bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      Gender
                    </th>
                    <th className="p-2 text-left bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      Course Rating
                    </th>
                    <th className="p-2 text-left bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      Slope Rating
                    </th>
                    <th className="p-2 text-left bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      Total Yardage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {course.tee_boxes.map((tee) => (
                    <tr key={tee.id}>
                      <td className="p-2 border border-gray-300 dark:border-gray-700">
                        {tee.name}
                      </td>
                      <td className="p-2 border border-gray-300 dark:border-gray-700">
                        {genderLabel[tee.gender]}
                      </td>
                      <td className="p-2 border border-gray-300 dark:border-gray-700">
                        {tee.course_rating != null
                          ? (typeof tee.course_rating === 'number'
                              ? tee.course_rating.toFixed(1)
                              : (isNaN(Number(tee.course_rating)) ? '—' : Number(tee.course_rating).toFixed(1)))
                          : '—'}
                      </td>
                      <td className="p-2 border border-gray-300 dark:border-gray-700">
                        {tee.slope_rating != null
                          ? (typeof tee.slope_rating === 'number'
                              ? tee.slope_rating
                              : (isNaN(Number(tee.slope_rating)) ? '—' : Number(tee.slope_rating)))
                          : '—'}
                      </td>
                      <td className="p-2 border border-gray-300 dark:border-gray-700">
                        {tee.yardage != null
                          ? (typeof tee.yardage === 'number'
                              ? tee.yardage.toLocaleString()
                              : (isNaN(Number(tee.yardage)) ? '—' : Number(tee.yardage).toLocaleString()))
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hole Information Section */}
          <div className="px-6 py-6">
            <h2 className="text-xl font-semibold text-[#2d6a4f] dark:text-[#4fd1c5] mb-4">
              Hole-by-Hole Information
            </h2>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      Hole
                    </th>
                    {frontNine.map(hole => (
                      <th key={hole.hole_number} className="p-2 w-12 text-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                        {hole.hole_number}
                      </th>
                    ))}
                    <th className="p-2 text-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      OUT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 text-center font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      Par
                    </td>
                    {frontNine.map(hole => (
                      <td key={hole.hole_number} className="p-2 text-center border border-gray-300 dark:border-gray-700">
                        {hole.par}
                      </td>
                    ))}
                    <td className="p-2 text-center font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      {frontNinePar}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 text-center font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      S.I.
                    </td>
                    {frontNine.map(hole => (
                      <td key={hole.hole_number} className="p-2 text-center border border-gray-300 dark:border-gray-700">
                        {hole.stroke_index}
                      </td>
                    ))}
                    <td className="p-2 text-center bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      —
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      Hole
                    </th>
                    {backNine.map(hole => (
                      <th key={hole.hole_number} className="p-2 w-12 text-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                        {hole.hole_number}
                      </th>
                    ))}
                    <th className="p-2 text-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      IN
                    </th>
                    <th className="p-2 text-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      TOT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 text-center font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      Par
                    </td>
                    {backNine.map(hole => (
                      <td key={hole.hole_number} className="p-2 text-center border border-gray-300 dark:border-gray-700">
                        {hole.par}
                      </td>
                    ))}
                    <td className="p-2 text-center font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      {backNinePar}
                    </td>
                    <td className="p-2 text-center font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      {totalPar}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 text-center font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      S.I.
                    </td>
                    {backNine.map(hole => (
                      <td key={hole.hole_number} className="p-2 text-center border border-gray-300 dark:border-gray-700">
                        {hole.stroke_index}
                      </td>
                    ))}
                    <td className="p-2 text-center bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      —
                    </td>
                    <td className="p-2 text-center bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      —
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {course.attachments.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-[#2d6a4f] dark:text-[#4fd1c5] mb-4">
                  Attachments
                </h2>
                <div className="space-y-3">
                  {course.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700"
                    >
                      <div className="mr-3">
                        {attachment.attachment_type === 'scorecard' && '🃏'}
                        {attachment.attachment_type === 'rating_certificate' && '📜'}
                        {attachment.attachment_type === 'course_info' && '📝'}
                      </div>
                      <div>
                        <div className="font-medium">
                          {attachment.attachment_type === 'scorecard' && 'Scorecard'}
                          {attachment.attachment_type === 'rating_certificate' && 'Rating Certificate'}
                          {attachment.attachment_type === 'course_info' && 'Course Info'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {attachment.original_filename}
                        </div>
                      </div>
                      <a
                        href={`/uploads/${attachment.file_path.split('/').pop()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto px-3 py-1 text-sm bg-[#d8f3dc] text-[#2d6a4f] dark:bg-[#2d3748] dark:text-[#4fd1c5] rounded hover:bg-[#b7e4c7] dark:hover:bg-[#374151] transition-colors"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 