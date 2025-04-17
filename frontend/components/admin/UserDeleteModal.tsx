import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'next-i18next';

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserDeleteModalProps {
  user: User;
  onClose: () => void;
  onDelete: () => void;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({ user, onClose, onDelete }) => {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`/api/admin/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      onDelete();
    } catch (error) {
      console.error('Error deleting user:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || t('admin.errorDeletingUser'));
      } else {
        setError(t('admin.errorDeletingUser'));
      }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('admin.confirmDelete')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}

        <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
          {t('admin.deleteConfirmation', { username: user.username })}
        </p>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {t('admin.deleteWarning')}
        </p>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('admin.cancel')}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? 'bg-red-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            }`}
          >
            {loading ? t('admin.deleting') : t('admin.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;