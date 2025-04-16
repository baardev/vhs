import React from 'react';

interface TeeBox {
  name: string;
  gender: 'male' | 'female' | 'other';
  courseRating: string;
  slopeRating: string;
  yardage: string;
}

interface TeeBoxesSectionProps {
  teeBoxes: TeeBox[];
  updateTeeBox: (index: number, field: keyof TeeBox, value: string) => void;
  addTeeBox: () => void;
  removeTeeBox: (index: number) => void;
}

const TeeBoxesSection: React.FC<TeeBoxesSectionProps> = ({
  teeBoxes,
  updateTeeBox,
  addTeeBox,
  removeTeeBox
}) => {
  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
      <div className="bg-[#f1faee] dark:bg-[#2d3748] p-4 mb-6 -mx-6 flex items-center">
        <span className="text-2xl mr-2">🏳️</span>
        <h2 className="text-xl font-semibold text-[#2d6a4f] dark:text-white">Tee Boxes</h2>
      </div>

      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Add information about each tee box at this course.
      </p>

      {teeBoxes.map((teeBox, index) => (
        <div key={index} className="mb-8 p-6 bg-gray-50 dark:bg-[#1f2937] rounded-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Tee Box {index + 1}</h3>
            {teeBoxes.length > 1 && (
              <button
                type="button"
                onClick={() => removeTeeBox(index)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tee Name
              </label>
              <input
                type="text"
                value={teeBox.name}
                onChange={(e) => updateTeeBox(index, 'name', e.target.value)}
                placeholder="e.g., Blue, Championship"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#40916c] focus:border-[#40916c] dark:bg-[#2d3748] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender
              </label>
              <select
                value={teeBox.gender}
                onChange={(e) => updateTeeBox(index, 'gender', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#40916c] focus:border-[#40916c] dark:bg-[#2d3748] dark:text-white"
              >
                <option value="male">Men</option>
                <option value="female">Women</option>
                <option value="other">Other / Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="50"
                max="90"
                value={teeBox.courseRating}
                onChange={(e) => updateTeeBox(index, 'courseRating', e.target.value)}
                placeholder="e.g., 72.4"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#40916c] focus:border-[#40916c] dark:bg-[#2d3748] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Slope Rating
              </label>
              <input
                type="number"
                min="55"
                max="155"
                value={teeBox.slopeRating}
                onChange={(e) => updateTeeBox(index, 'slopeRating', e.target.value)}
                placeholder="e.g., 132"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-[#40916c] focus:border-[#40916c] dark:bg-[#2d3748] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Yardage <span className="font-normal text-gray-500 dark:text-gray-400 text-sm">(optional)</span>
              </label>
              <input
                type="number"
                min="1000"
                max="9000"
                value={teeBox.yardage}
                onChange={(e) => updateTeeBox(index, 'yardage', e.target.value)}
                placeholder="e.g., 6800"
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
        Add Another Tee Box
      </button>
    </div>
  );
};

export default TeeBoxesSection;