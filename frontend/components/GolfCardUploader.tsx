import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

const GolfCardUploader: React.FC = () => {
  const { t } = useTranslation('common');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({
    type: '',
    text: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check if the file is an image
    if (!selectedFile.type.match('image.*')) {
      setMessage({
        type: 'error',
        text: t('invalidFileType', 'Please select an image file'),
      });
      return;
    }

    // Create a preview URL
    const url = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreviewUrl(url);
    setMessage({ type: '', text: '' });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({
        type: 'error',
        text: t('noFileSelected', 'Please select a file'),
      });
      return;
    }

    setUploading(true);
    
    try {
      // This is a placeholder for the actual upload logic
      // which will be implemented later
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: t('uploadSuccess', 'Card uploaded successfully. Processing will be implemented soon.'),
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: t('uploadFailed', 'Upload failed. Please try again.'),
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {t('uploadGolfCard', 'Upload Golf Scorecard')}
      </h2>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          {previewUrl ? (
            <div className="space-y-4">
              <img
                src={previewUrl}
                alt="Scorecard preview"
                className="max-h-64 mx-auto"
              />
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                }}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                {t('removeImage', 'Remove Image')}
              </button>
            </div>
          ) : (
            <>
              <label htmlFor="card-upload" className="cursor-pointer">
                <div className="text-gray-500 dark:text-gray-400">
                  <svg
                    className="mx-auto h-12 w-12"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm">
                    {t('dragAndDrop', 'Drag and drop a file here or click to select')}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t('acceptedFormats', 'PNG, JPG, GIF up to 10MB')}
                  </p>
                </div>
              </label>
              <input
                id="card-upload"
                name="card-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </>
          )}
        </div>

        {message.text && (
          <div
            className={`p-3 rounded ${
              message.type === 'error'
                ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                : message.type === 'success'
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                : ''
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!file || uploading}
            className={`px-4 py-2 rounded text-white font-medium ${
              !file || uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#2d6a4f] hover:bg-[#1b4332] dark:bg-[#4fd1c5] dark:hover:bg-[#38b2ac]'
            }`}
          >
            {uploading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t('uploading', 'Uploading...')}
              </div>
            ) : (
              t('upload', 'Upload Card')
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GolfCardUploader; 