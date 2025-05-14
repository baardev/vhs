import React from 'react';

interface CourseInfoSectionProps {
  courseName: string;
  setCourseName: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  cityProvince: string;
  setCityProvince: (value: string) => void;
  website: string;
  setWebsite: (value: string) => void;
}

/**
 * @component CourseInfoSection
 * @description A form section for inputting basic course identification details.
 * It includes fields for course name, country (dropdown), city/province, and an optional website URL.
 * @param {CourseInfoSectionProps} props - The props for the component.
 * @param {string} props.courseName - The current value for the course name input.
 * @param {(value: string) => void} props.setCourseName - Callback to update the course name.
 * @param {string} props.country - The current selected value for the country dropdown.
 * @param {(value: string) => void} props.setCountry - Callback to update the selected country.
 * @param {string} props.cityProvince - The current value for the city/province input.
 * @param {(value: string) => void} props.setCityProvince - Callback to update the city/province.
 * @param {string} props.website - The current value for the website URL input.
 * @param {(value: string) => void} props.setWebsite - Callback to update the website URL.
 *
 * @remarks
 * This component is designed to be part of a larger form, likely for creating or editing course information.
 * It provides controlled input fields and a select dropdown for country selection.
 * Input fields for course name and city/province are marked as required.
 *
 * Called by:
 * - `frontend/pages/courses/new.tsx` (as part of the new course creation form)
 *
 * Calls:
 * - React (implicitly, as it's a React functional component)
 *
 * @returns {React.FC<CourseInfoSectionProps>} The rendered form section for course information.
 */
const CourseInfoSection: React.FC<CourseInfoSectionProps> = ({
  courseName,
  setCourseName,
  country,
  setCountry,
  cityProvince,
  setCityProvince,
  website,
  setWebsite
}) => {
  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
      <div className="bg-[#f1faee] dark:bg-[#2d3748] p-4 mb-6 -mx-6 flex items-center">
        <span className="text-2xl mr-2">🧱</span>
        <h2 className="text-xl font-semibold text-[#2d6a4f] dark:text-white">Course Info</h2>
      </div>

      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Basic identity information to catalog the course in our database.
      </p>

      <div className="mb-6">
        <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Course Name
        </label>
        <input
          type="text"
          id="courseName"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="e.g., Club de Golf Los Cedros"
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#40916c] focus:border-[#40916c] dark:bg-[#2d3748] dark:text-white"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Country
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#40916c] focus:border-[#40916c] dark:bg-[#2d3748] dark:text-white"
        >
          <option value="">Select a country</option>
          <option value="US">United States</option>
          <option value="MX">Mexico</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="ES">Spain</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="cityProvince" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          City / Province
        </label>
        <input
          type="text"
          id="cityProvince"
          value={cityProvince}
          onChange={(e) => setCityProvince(e.target.value)}
          placeholder="e.g., Phoenix, Arizona"
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#40916c] focus:border-[#40916c] dark:bg-[#2d3748] dark:text-white"
        />
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Helps distinguish courses with similar names
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Website <span className="font-normal text-gray-500 dark:text-gray-400 text-sm">(optional)</span>
        </label>
        <input
          type="url"
          id="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="e.g., https://www.golfcourse.com"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#40916c] focus:border-[#40916c] dark:bg-[#2d3748] dark:text-white"
        />
      </div>
    </div>
  );
};

export default CourseInfoSection;