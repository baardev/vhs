'use client';

import React, { useState, useEffect } from 'react';
import { getCommonDictionary } from '../../dictionaries';

/**
 * @interface TeeBox
 * @description Defines the structure for a single tee box object.
 * @property {string} name - The name of the tee box (e.g., "Blue", "Championship").
 * @property {'male' | 'female' | 'other'} gender - The gender category for the tee box.
 * @property {string} courseRating - The USGA course rating for this tee box.
 * @property {string} slopeRating - The USGA slope rating for this tee box.
 * @property {string} yardage - The total yardage for this tee box (optional).
 */
interface TeeBox {
  name: string;
  gender: 'male' | 'female' | 'other';
  courseRating: string;
  slopeRating: string;
  yardage: string;
}

/**
 * @interface TeeBoxesSectionProps
 * @description Defines the props for the TeeBoxesSection component.
 * @property {TeeBox[]} teeBoxes - An array of tee box objects to be displayed and managed.
 * @property {(index: number, field: keyof TeeBox, value: string) => void} updateTeeBox - Callback to update a specific field of a tee box.
 * @property {() => void} addTeeBox - Callback to add a new tee box to the list.
 * @property {(index: number) => void} removeTeeBox - Callback to remove a tee box from the list.
 * @property {string} lang - The current language for internationalization.
 */
interface TeeBoxesSectionProps {
  teeBoxes: TeeBox[];
  updateTeeBox: (index: number, field: keyof TeeBox, value: string) => void;
  addTeeBox: () => void;
  removeTeeBox: (index: number) => void;
  lang: string;
}

/**
 * @component TeeBoxesSection
 * @description A form section for inputting and managing information about multiple tee boxes for a golf course.
 * @param {TeeBoxesSectionProps} props - The props for the component.
 *
 * @remarks
 * This component allows users to:
 * - View and edit details for existing tee boxes (Tee Name, Gender, Course Rating, Slope Rating, Total Yardage).
 * - Add new tee boxes to the course.
 * - Remove tee boxes (if more than one exists).
 * Each tee box is rendered as a distinct sub-form with input fields for its attributes.
 * Input changes trigger the `updateTeeBox` callback.
 * The "Add Another Tee Box" button triggers the `addTeeBox` callback.
 * The "Remove" button (per tee box) triggers the `removeTeeBox` callback.
 *
 * Called by:
 * - `frontend/app/[lang]/courses/new/page.tsx` (as part of the new course creation form)
 *
 * Calls:
 * - React (implicitly, as it's a React functional component)
 * - getCommonDictionary (for internationalization)
 * - `props.updateTeeBox` (when an input field value changes)
 * - `props.addTeeBox` (when the "Add Another Tee Box" button is clicked)
 * - `props.removeTeeBox` (when a "Remove" button for a tee box is clicked)
 *
 * @returns {React.FC<TeeBoxesSectionProps>} The rendered form section for managing tee box information.
 */
const TeeBoxesSection: React.FC<TeeBoxesSectionProps> = ({
  teeBoxes,
  updateTeeBox,
  addTeeBox,
  removeTeeBox,
  lang
}) => {
  const [dict, setDict] = useState<Record<string, any>>({});

  // Load dictionary
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dictionary = await getCommonDictionary(lang);
        setDict(dictionary);
      } catch (err) {
        console.error('Error loading dictionary in TeeBoxesSection:', err);
      }
    };
    
    if (lang) {
      loadDictionary();
    }
  }, [lang]);

  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
      <div className="bg-[#f1faee] dark:bg-[#2d3748] p-4 mb-6 -mx-6 flex items-center">
        <span className="text-2xl mr-2">🏳️</span>
        <h2 className="text-xl font-semibold text-[#2d6a4f] dark:text-white">
          {dict.teeBoxesSection?.header || 'Tee Boxes'}
        </h2>
      </div>

      <p className="mb-6 text-gray-600 dark:text-gray-300">
        {dict.teeBoxesSection?.description || 'Add information about each tee box at this course.'}
      </p>

      {teeBoxes.map((teeBox, index) => (
        <div key={index} className="mb-8 p-6 bg-gray-50 dark:bg-[#1f2937] rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {dict.teeBoxesSection?.teeBox || 'Tee Box'} {index + 1}
            </h3>
            {teeBoxes.length > 1 && (
              <button
                type="button"
                onClick={() => removeTeeBox(index)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                {dict.teeBoxesSection?.remove || 'Remove'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {dict.teeBoxesSection?.teeName || 'Tee Name'}
              </label>
              <input
                type="text"
                value={teeBox.name}
                onChange={(e) => updateTeeBox(index, 'name', e.target.value)}
                placeholder={dict.teeBoxesSection?.teeNamePlaceholder || 'e.g., Blue, Championship'}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#40916c] focus:border-[#40916c] dark:bg-[#2d3748] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {dict.teeBoxesSection?.gender || 'Gender'}
              </label>
              <select
                value={teeBox.gender}
                onChange={(e) => updateTeeBox(index, 'gender', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#40916c] focus:border-[#40916c] dark:bg-[#2d3748] dark:text-white"
              >
                <option value="male">{dict.teeBoxesSection?.genderMale || 'Men'}</option>
                <option value="female">{dict.teeBoxesSection?.genderFemale || 'Women'}</option>
                <option value="other">{dict.teeBoxesSection?.genderOther || 'Other / Mixed'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {dict.teeBoxesSection?.courseRating || 'Course Rating'}
              </label>
              <input
                type="number"
                step="0.1"
                min="50"
                max="90"
                value={teeBox.courseRating}
                onChange={(e) => updateTeeBox(index, 'courseRating', e.target.value)}
                placeholder={dict.teeBoxesSection?.courseRatingPlaceholder || 'e.g., 72.4'}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#40916c] focus:border-[#40916c] dark:bg-[#2d3748] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {dict.teeBoxesSection?.slopeRating || 'Slope Rating'}
              </label>
              <input
                type="number"
                min="55"
                max="155"
                value={teeBox.slopeRating}
                onChange={(e) => updateTeeBox(index, 'slopeRating', e.target.value)}
                placeholder={dict.teeBoxesSection?.slopeRatingPlaceholder || 'e.g., 132'}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#40916c] focus:border-[#40916c] dark:bg-[#2d3748] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {dict.teeBoxesSection?.totalYardage || 'Total Yardage'} <span className="font-normal text-gray-500 dark:text-gray-400 text-sm">{dict.teeBoxesSection?.optional || '(optional)'}</span>
              </label>
              <input
                type="number"
                min="1000"
                max="9000"
                value={teeBox.yardage}
                onChange={(e) => updateTeeBox(index, 'yardage', e.target.value)}
                placeholder={dict.teeBoxesSection?.yardagePlaceholder || 'e.g., 6800'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#40916c] focus:border-[#40916c] dark:bg-[#2d3748] dark:text-white"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addTeeBox}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#40916c] hover:bg-[#2d6a4f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40916c] dark:bg-[#4fd1c5] dark:hover:bg-[#38b2ac] dark:focus:ring-[#38b2ac]"
      >
        {dict.teeBoxesSection?.addAnotherTeeBox || 'Add Another Tee Box'}
      </button>
    </div>
  );
};

export default TeeBoxesSection; 