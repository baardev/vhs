import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Geist, Geist_Mono } from "next/font/google";
import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { getI18nProps } from '../../utils/i18n-helpers';
import Link from 'next/link';
import axios from 'axios';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Interface for Course
interface Course {
  id: number;
  course_id: number;
  course_name: string;
  city: string;
  state: string;
  country: string;
}

// Interface for Course Details
interface CourseData {
  id: number;
  course_id: number;
  tee_name: string;
  gender: string;
  par: number;
  course_rating: number;
  slope_rating: number;
  length: number;
  par_h01: number;
  par_h02: number;
  par_h03: number;
  par_h04: number;
  par_h05: number;
  par_h06: number;
  par_h07: number;
  par_h08: number;
  par_h09: number;
  par_h10: number;
  par_h11: number;
  par_h12: number;
  par_h13: number;
  par_h14: number;
  par_h15: number;
  par_h16: number;
  par_h17: number;
  par_h18: number;
}

// Interface for Course Hole Data
interface CourseHoleData {
  id: number;
  course_id: number;
  category: string;
  gender: string;
  h01: number;
  h02: number;
  h03: number;
  h04: number;
  h05: number;
  h06: number;
  h07: number;
  h08: number;
  h09: number;
  h10: number;
  h11: number;
  h12: number;
  h13: number;
  h14: number;
  h15: number;
  h16: number;
  h17: number;
  h18: number;
}

// Get the base URL for API requests
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

const CourseEditor = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isEditor, setIsEditor] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [courseHoleData, setCourseHoleData] = useState<CourseHoleData[]>([]);
  const [selectedCourseData, setSelectedCourseData] = useState<CourseData | null>(null);
  const [selectedHoleData, setSelectedHoleData] = useState<CourseHoleData | null>(null);
  const [editMode, setEditMode] = useState<'course' | 'tee' | 'hole' | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const baseUrl = getBaseUrl();

  useEffect(() => {
    // Check editor status
    const checkEditorStatus = () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (parsedData.is_editor) {
            setIsEditor(true);
            fetchCourses();
          } else {
            setIsEditor(false);
            router.push('/');
          }
        } else {
          setIsEditor(false);
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking editor status:', error);
        setIsEditor(false);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkEditorStatus();
  }, [router]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/coursesData/course-names`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses');
    }
  };

  const fetchCourseDetails = async (courseId: number) => {
    try {
      setIsLoading(true);

      // Fetch course data
      const courseDataResponse = await axios.get(`${baseUrl}/api/coursesData/course-data/${courseId}`);
      setCourseData(courseDataResponse.data);

      // Fetch course hole data
      const courseHoleDataResponse = await axios.get(`${baseUrl}/api/coursesData/course-hole-data/${courseId}`);
      setCourseHoleData(courseHoleDataResponse.data);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('Failed to fetch course details');
      setIsLoading(false);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setSelectedCourseData(null);
    setSelectedHoleData(null);
    setEditMode(null);
    fetchCourseDetails(course.course_id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === '' ? '' : Number(value)
    });
  };

  const handleEditCourse = () => {
    if (!selectedCourse) return;
    
    setEditMode('course');
    setFormData({
      course_name: selectedCourse.course_name,
      city: selectedCourse.city,
      state: selectedCourse.state,
      country: selectedCourse.country
    });
  };

  const handleEditTee = (teeData: CourseData) => {
    setSelectedCourseData(teeData);
    setEditMode('tee');
    setFormData({
      tee_name: teeData.tee_name,
      gender: teeData.gender,
      par: teeData.par,
      course_rating: teeData.course_rating,
      slope_rating: teeData.slope_rating,
      length: teeData.length,
      par_h01: teeData.par_h01,
      par_h02: teeData.par_h02,
      par_h03: teeData.par_h03,
      par_h04: teeData.par_h04,
      par_h05: teeData.par_h05,
      par_h06: teeData.par_h06,
      par_h07: teeData.par_h07,
      par_h08: teeData.par_h08,
      par_h09: teeData.par_h09,
      par_h10: teeData.par_h10,
      par_h11: teeData.par_h11,
      par_h12: teeData.par_h12,
      par_h13: teeData.par_h13,
      par_h14: teeData.par_h14,
      par_h15: teeData.par_h15,
      par_h16: teeData.par_h16,
      par_h17: teeData.par_h17,
      par_h18: teeData.par_h18
    });
  };

  const handleEditHole = (holeData: CourseHoleData) => {
    setSelectedHoleData(holeData);
    setEditMode('hole');
    setFormData({
      category: holeData.category,
      gender: holeData.gender,
      h01: holeData.h01,
      h02: holeData.h02,
      h03: holeData.h03,
      h04: holeData.h04,
      h05: holeData.h05,
      h06: holeData.h06,
      h07: holeData.h07,
      h08: holeData.h08,
      h09: holeData.h09,
      h10: holeData.h10,
      h11: holeData.h11,
      h12: holeData.h12,
      h13: holeData.h13,
      h14: holeData.h14,
      h15: holeData.h15,
      h16: holeData.h16,
      h17: holeData.h17,
      h18: holeData.h18
    });
  };

  const handleSaveForm = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      if (editMode === 'course' && selectedCourse) {
        // Update course information
        await axios.put(`${baseUrl}/api/coursesData/course-names/${selectedCourse.course_id}`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSuccess('Course information updated successfully');
        
        // Refresh course list
        await fetchCourses();
        
        // Update selected course
        const updatedCourse = {
          ...selectedCourse,
          course_name: formData.course_name,
          city: formData.city,
          state: formData.state,
          country: formData.country
        };
        setSelectedCourse(updatedCourse);
      } 
      else if (editMode === 'tee' && selectedCourseData) {
        // Update tee information
        await axios.put(`${baseUrl}/api/coursesData/course-data/${selectedCourseData.id}`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSuccess('Tee information updated successfully');
        
        // Refresh course details
        await fetchCourseDetails(selectedCourse!.course_id);
      } 
      else if (editMode === 'hole' && selectedHoleData) {
        // Update hole information
        await axios.put(`${baseUrl}/api/coursesData/course-hole-data/${selectedHoleData.id}`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSuccess('Hole information updated successfully');
        
        // Refresh course details
        await fetchCourseDetails(selectedCourse!.course_id);
      }
      
      // Reset edit mode
      setEditMode(null);
    } catch (error) {
      console.error('Error saving data:', error);
      setError('Failed to save data');
    }
  };

  const cancelEdit = () => {
    setEditMode(null);
    setFormData({});
  };

  // Show loading state
  if (isLoading || isEditor === null) {
    return (
      <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#111]`}>
        <div className="text-xl font-medium">Loading...</div>
      </div>
    );
  }

  // If not editor, the useEffect will redirect them
  if (!isEditor) {
    return null;
  }

  // Render hole data row
  const renderHoleDataRow = (data: { h01: number, h02: number, h03: number, h04: number, h05: number, h06: number, h07: number, h08: number, h09: number, h10: number, h11: number, h12: number, h13: number, h14: number, h15: number, h16: number, h17: number, h18: number }) => {
    return (
      <tr>
        <td className="border px-2 py-1">{data.h01}</td>
        <td className="border px-2 py-1">{data.h02}</td>
        <td className="border px-2 py-1">{data.h03}</td>
        <td className="border px-2 py-1">{data.h04}</td>
        <td className="border px-2 py-1">{data.h05}</td>
        <td className="border px-2 py-1">{data.h06}</td>
        <td className="border px-2 py-1">{data.h07}</td>
        <td className="border px-2 py-1">{data.h08}</td>
        <td className="border px-2 py-1">{data.h09}</td>
        <td className="border px-2 py-1">{data.h10}</td>
        <td className="border px-2 py-1">{data.h11}</td>
        <td className="border px-2 py-1">{data.h12}</td>
        <td className="border px-2 py-1">{data.h13}</td>
        <td className="border px-2 py-1">{data.h14}</td>
        <td className="border px-2 py-1">{data.h15}</td>
        <td className="border px-2 py-1">{data.h16}</td>
        <td className="border px-2 py-1">{data.h17}</td>
        <td className="border px-2 py-1">{data.h18}</td>
      </tr>
    );
  };

  // Render hole data input row for forms
  const renderHoleDataInputRow = (prefix: string) => {
    return (
      <tr>
        {Array.from({ length: 18 }, (_, i) => i + 1).map(holeNumber => {
          const fieldName = `${prefix}${holeNumber.toString().padStart(2, '0')}`;
          return (
            <td key={fieldName} className="border px-1 py-1">
              <input
                type="number"
                name={fieldName}
                value={formData[fieldName] || ''}
                onChange={handleNumberInputChange}
                className="w-12 p-1 text-sm text-black"
              />
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className={`${geistSans.className} ${geistMono.className} min-h-screen bg-[#fafafa] dark:bg-[#111] py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('editor.courseEditor', 'Course Editor')}</h1>
          <Link href="/editor" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            {t('common.back', 'Back')}
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Course List */}
          <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg p-4 lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('editor.courseList', 'Course List')}
            </h2>
            
            <div className="h-[600px] overflow-y-auto">
              <ul className="space-y-2">
                {courses.map(course => (
                  <li 
                    key={course.id}
                    onClick={() => handleCourseSelect(course)}
                    className={`p-2 rounded-md cursor-pointer ${selectedCourse?.id === course.id ? 'bg-indigo-100 dark:bg-indigo-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{course.course_name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{course.city}, {course.state}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Course Details */}
          <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg p-4 lg:col-span-3">
            {!selectedCourse ? (
              <div className="flex items-center justify-center h-[600px]">
                <p className="text-gray-500 dark:text-gray-400">Select a course to view details</p>
              </div>
            ) : (
              <div>
                {/* Course Info */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedCourse.course_name}
                    </h2>
                    <button 
                      onClick={handleEditCourse}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      {t('common.edit', 'Edit')}
                    </button>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedCourse.city}, {selectedCourse.state}, {selectedCourse.country}
                  </p>
                </div>

                {/* Edit Forms */}
                {editMode === 'course' && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Edit Course Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Course Name
                        </label>
                        <input
                          type="text"
                          name="course_name"
                          value={formData.course_name || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md text-black"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md text-black"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md text-black"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md text-black"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveForm}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {editMode === 'tee' && selectedCourseData && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Edit Tee Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Tee Name
                        </label>
                        <input
                          type="text"
                          name="tee_name"
                          value={formData.tee_name || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md text-black"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md text-black"
                        >
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Par
                        </label>
                        <input
                          type="number"
                          name="par"
                          value={formData.par || ''}
                          onChange={handleNumberInputChange}
                          className="w-full p-2 border rounded-md text-black"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Course Rating
                        </label>
                        <input
                          type="number"
                          name="course_rating"
                          step="0.1"
                          value={formData.course_rating || ''}
                          onChange={handleNumberInputChange}
                          className="w-full p-2 border rounded-md text-black"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Slope Rating
                        </label>
                        <input
                          type="number"
                          name="slope_rating"
                          value={formData.slope_rating || ''}
                          onChange={handleNumberInputChange}
                          className="w-full p-2 border rounded-md text-black"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Length
                        </label>
                        <input
                          type="number"
                          name="length"
                          value={formData.length || ''}
                          onChange={handleNumberInputChange}
                          className="w-full p-2 border rounded-md text-black"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-md font-medium mb-2">Hole Par Values</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-center">
                          <thead>
                            <tr>
                              {Array.from({ length: 18 }, (_, i) => i + 1).map(num => (
                                <th key={num} className="border px-2 py-1">{num}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {renderHoleDataInputRow('par_h')}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveForm}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {editMode === 'hole' && selectedHoleData && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Edit Hole Data</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={formData.category || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md text-black"
                          disabled
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender || ''}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md text-black"
                          disabled
                        >
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-md font-medium mb-2">Hole Values</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-center">
                          <thead>
                            <tr>
                              {Array.from({ length: 18 }, (_, i) => i + 1).map(num => (
                                <th key={num} className="border px-2 py-1">{num}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {renderHoleDataInputRow('h')}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveForm}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {!editMode && (
                  <>
                    {/* Tee Boxes */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        Tee Boxes
                      </h3>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                              <th className="border p-2 text-left">Tee Name</th>
                              <th className="border p-2 text-left">Gender</th>
                              <th className="border p-2 text-left">Par</th>
                              <th className="border p-2 text-left">Course Rating</th>
                              <th className="border p-2 text-left">Slope Rating</th>
                              <th className="border p-2 text-left">Length</th>
                              <th className="border p-2 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {courseData.map(tee => (
                              <tr key={tee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="border p-2">{tee.tee_name}</td>
                                <td className="border p-2">{tee.gender === 'M' ? 'Male' : 'Female'}</td>
                                <td className="border p-2">{tee.par}</td>
                                <td className="border p-2">{tee.course_rating}</td>
                                <td className="border p-2">{tee.slope_rating}</td>
                                <td className="border p-2">{tee.length}</td>
                                <td className="border p-2 text-center">
                                  <button 
                                    onClick={() => handleEditTee(tee)}
                                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition-colors"
                                  >
                                    Edit
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Par Values */}
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        Par Values
                      </h3>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border text-center">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                              <th className="border px-2 py-1">Hole</th>
                              {Array.from({ length: 18 }, (_, i) => i + 1).map(num => (
                                <th key={num} className="border px-2 py-1">{num}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {courseData.map(tee => (
                              <tr key={`par-${tee.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="border px-2 py-1 font-medium">{tee.tee_name}</td>
                                {renderHoleDataRow({
                                  h01: tee.par_h01, h02: tee.par_h02, h03: tee.par_h03, h04: tee.par_h04, h05: tee.par_h05,
                                  h06: tee.par_h06, h07: tee.par_h07, h08: tee.par_h08, h09: tee.par_h09, h10: tee.par_h10,
                                  h11: tee.par_h11, h12: tee.par_h12, h13: tee.par_h13, h14: tee.par_h14, h15: tee.par_h15,
                                  h16: tee.par_h16, h17: tee.par_h17, h18: tee.par_h18
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Hole Data */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        Course Hole Data
                      </h3>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border">
                          <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                              <th className="border px-2 py-1 text-left">Category</th>
                              <th className="border px-2 py-1 text-left">Gender</th>
                              <th className="border px-2 py-1 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {courseHoleData.map(holeData => (
                              <tr key={holeData.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="border px-2 py-1">{holeData.category}</td>
                                <td className="border px-2 py-1">{holeData.gender === 'M' ? 'Male' : 'Female'}</td>
                                <td className="border px-2 py-1 text-center">
                                  <button 
                                    onClick={() => handleEditHole(holeData)}
                                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition-colors"
                                  >
                                    Edit
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Show Hole Data Details */}
                      {courseHoleData.length > 0 && (
                        <div className="mt-4">
                          <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse border text-center">
                              <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700">
                                  <th className="border px-2 py-1">Data</th>
                                  {Array.from({ length: 18 }, (_, i) => i + 1).map(num => (
                                    <th key={num} className="border px-2 py-1">{num}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {courseHoleData.map(holeData => (
                                  <tr key={`detail-${holeData.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="border px-2 py-1 font-medium">
                                      {holeData.category} ({holeData.gender === 'M' ? 'Male' : 'Female'})
                                    </td>
                                    {renderHoleDataRow(holeData)}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return getI18nProps(locale);
};

export default CourseEditor; 