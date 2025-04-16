import React from 'react';

interface AttachmentsSectionProps {
  scorecardFile: File | null;
  setScorecardFile: (file: File | null) => void;
  ratingCertificateFile: File | null;
  setRatingCertificateFile: (file: File | null) => void;
  courseInfoFile: File | null;
  setCourseInfoFile: (file: File | null) => void;
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
  scorecardFile,
  setScorecardFile,
  ratingCertificateFile,
  setRatingCertificateFile,
  courseInfoFile,
  setCourseInfoFile
}) => {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-800">
      <div className="bg-[#f1faee] dark:bg-[#2d3748] p-4 mb-6 -mx-6 flex items-center">
        <span className="text-2xl mr-2">📎</span>
        <h2 className="text-xl font-semibold text-[#2d6a4f] dark:text-white">Optional Uploads</h2>
      </div>

      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Upload supporting documentation to help verify the course information.
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Scorecard Photo <span className="font-normal text-gray-500 dark:text-gray-400 text-sm">(optional)</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center bg-gray-50 dark:bg-[#1f2937]">
          <input
            type="file"
            id="scorecardUpload"
            onChange={(e) => handleFileChange(e, setScorecardFile)}
            accept="image/*"
            className="w-full text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#d8f3dc] file:text-[#2d6a4f] dark:file:bg-[#374151] dark:file:text-[#4fd1c5] hover:file:bg-[#b7e4c7] dark:hover:file:bg-[#4B5563] file:cursor-pointer"
          />
          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Upload a clear photo of the scorecard showing tee information and hole details
          </div>
          {scorecardFile && (
            <div className="mt-2 text-sm text-green-600 dark:text-green-400">
              Selected: {scorecardFile.name}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rating Certificate <span className="font-normal text-gray-500 dark:text-gray-400 text-sm">(optional)</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center bg-gray-50 dark:bg-[#1f2937]">
          <input
            type="file"
            id="ratingCertificateUpload"
            onChange={(e) => handleFileChange(e, setRatingCertificateFile)}
            accept="image/*, application/pdf"
            className="w-full text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#d8f3dc] file:text-[#2d6a4f] dark:file:bg-[#374151] dark:file:text-[#4fd1c5] hover:file:bg-[#b7e4c7] dark:hover:file:bg-[#4B5563] file:cursor-pointer"
          />
          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Upload the official rating certificate from a national federation if available
          </div>
          {ratingCertificateFile && (
            <div className="mt-2 text-sm text-green-600 dark:text-green-400">
              Selected: {ratingCertificateFile.name}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Course Info Screenshot <span className="font-normal text-gray-500 dark:text-gray-400 text-sm">(optional)</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center bg-gray-50 dark:bg-[#1f2937]">
          <input
            type="file"
            id="courseInfoUpload"
            onChange={(e) => handleFileChange(e, setCourseInfoFile)}
            accept="image/*"
            className="w-full text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#d8f3dc] file:text-[#2d6a4f] dark:file:bg-[#374151] dark:file:text-[#4fd1c5] hover:file:bg-[#b7e4c7] dark:hover:file:bg-[#4B5563] file:cursor-pointer"
          />
          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Upload a screenshot of the course information from the official website or other source
          </div>
          {courseInfoFile && (
            <div className="mt-2 text-sm text-green-600 dark:text-green-400">
              Selected: {courseInfoFile.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachmentsSection;