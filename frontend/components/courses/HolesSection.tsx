import React from 'react';

interface HoleInfo {
  holeNumber: number;
  par: number;
  strokeIndex: number;
}

interface HolesSectionProps {
  holes: HoleInfo[];
  updateHole: (holeNumber: number, field: 'par' | 'strokeIndex', value: number) => void;
}

/**
 * @component HolesSection
 * @description Renders a form section for inputting hole-by-hole par and stroke index information for a golf course.
 * @param {HolesSectionProps} props - The props for the component.
 * @param {HoleInfo[]} props.holes - An array of objects, each representing a hole and containing its number, par, and stroke index.
 * @param {(holeNumber: number, field: 'par' | 'strokeIndex', value: number) => void} props.updateHole - Callback function to update the par or stroke index for a specific hole.
 *
 * @remarks
 * This component displays a table with rows for each hole (1 through 18 typically).
 * For each hole, it provides number input fields for 'Par' (min 3, max 6) and 'Stroke Index' (min 1, max 18).
 * These inputs are controlled and call the `updateHole` callback on change.
 * It includes a note that par and stroke index are typically the same across all tee boxes.
 *
 * Called by:
 * - `frontend/pages/courses/new.tsx` (as part of the new course creation form)
 *
 * Calls:
 * - React (implicitly, as it's a React functional component)
 *
 * @returns {React.FC<HolesSectionProps>} The rendered form section for hole-by-hole information.
 */
const HolesSection: React.FC<HolesSectionProps> = ({ holes, updateHole }) => {
  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
      <div className="bg-[#f1faee] dark:bg-[#2d3748] p-4 mb-6 -mx-6 flex items-center">
        <span className="text-2xl mr-2">🕳️</span>
        <h2 className="text-xl font-semibold text-[#2d6a4f] dark:text-white">Hole-by-Hole Information</h2>
      </div>

      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Enter the par and stroke index for each hole. These values are typically the same across all tee boxes.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 bg-[#f1faee] dark:bg-[#2d3748] border border-gray-300 dark:border-gray-700 font-semibold text-[#2d6a4f] dark:text-white">
                Hole
              </th>
              <th className="p-3 bg-[#f1faee] dark:bg-[#2d3748] border border-gray-300 dark:border-gray-700 font-semibold text-[#2d6a4f] dark:text-white">
                Par
              </th>
              <th className="p-3 bg-[#f1faee] dark:bg-[#2d3748] border border-gray-300 dark:border-gray-700 font-semibold text-[#2d6a4f] dark:text-white">
                Stroke Index
              </th>
            </tr>
          </thead>
          <tbody>
            {holes.map((hole) => (
              <tr key={hole.holeNumber} className={hole.holeNumber % 2 === 0 ? 'bg-gray-50 dark:bg-[#1f2937]' : ''}>
                <td className="p-3 text-center border border-gray-300 dark:border-gray-700">
                  {hole.holeNumber}
                </td>
                <td className="p-3 text-center border border-gray-300 dark:border-gray-700">
                  <input
                    type="number"
                    min="3"
                    max="6"
                    value={hole.par}
                    onChange={(e) => updateHole(hole.holeNumber, 'par', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded text-center dark:bg-[#2d3748] dark:text-white"
                    required
                  />
                </td>
                <td className="p-3 text-center border border-gray-300 dark:border-gray-700">
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={hole.strokeIndex}
                    onChange={(e) => updateHole(hole.holeNumber, 'strokeIndex', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-700 rounded text-center dark:bg-[#2d3748] dark:text-white"
                    required
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Note: Par and Stroke Index are typically the same across all tee boxes at a course.
      </div>
    </div>
  );
};

export default HolesSection;